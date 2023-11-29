import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChangeActionType, ChannelService } from '../channel/channel.service';
import { ChannelId, ClientId, idOf, UserId } from '../common/Id';
import { DmService } from '../dm/dm.service';
import { UserFollowService } from '../user-follow/user-follow.service';
import { UsersService } from '../users/users.service';
// import { ChatRoomDto, ChatRoomStatusDto } from './chat.dto'
import { Server, Socket } from 'socket.io';
import { GateWayEvents } from '../common/gateway-events.enum';
import { MessageWithMemberDto } from '../dm/dto/message-with-member';
import { UserDto } from '../users/dto/user.dto';
import {
  ChannelMemberInfo,
  DmChannelInfoType,
  JoiningChannelInfo,
  LeavingChannelInfo,
} from './event-response.dto';
import { UserSocket } from './events.gateway';

interface JwtPayload {
  phase: string;
  id: {
    value: string; // uuid
  };
  iat: number;
  exp: number;
}

export enum ChannelRoomType {
  NORMAL = 'normal',
  DM = 'dm',
}

type ChannelRoomTypeKey = string;
type ChannelIdKey = string;
type UserIdKey = string;
type ClientIdKey = string;

@Injectable()
export class EventsService {
  server!: Server;

  // private channels!: Record<string, Record<string, string[]>>;
  private channels!: Record<
    ChannelRoomTypeKey,
    Record<ChannelIdKey, Set<UserIdKey>>
  >;
  private socketMap = new Map<UserIdKey, UserSocket[]>(); // 소켓맵은 이곳에서 초기화 상태

  constructor(
    private usersService: UsersService,
    private dmService: DmService,
    private channelService: ChannelService,
    private userFollowService: UserFollowService,
  ) {}

  async afterInit(server: Server) {
    // 서버 초기화 시 변수 설정
    this.server = server;
    this.channels = {
      normal: {},
      dm: {},
    };

    // 아래는 각 채널에 들어가 있는 UserId 배포
    const channelMembers = await this.channelService.findAllChannelMembers();
    channelMembers.forEach(({ channelId, memberId }) =>
      this.handleUserJoinChannel(
        ChannelRoomType.NORMAL,
        idOf(channelId),
        idOf(memberId),
      ),
    );
    const dmChannels = await this.dmService.findAllDmChannels();
    dmChannels.forEach(({ id, member1Id, member2Id }) => {
      this.handleUserJoinChannel(ChannelRoomType.DM, idOf(id), idOf(member1Id));
      this.handleUserJoinChannel(ChannelRoomType.DM, idOf(id), idOf(member2Id));
    });
  }

  async handleConnection(client: UserSocket) {
    this.addClientAtSocketMap(client); // 소켓의 새로운 접속을 반영

    // 아래는 그저 유저에게 유용한 정보 전달.
    const { dmChannels, channels } = await this.getUserJoinedChannelInfos(
      client,
    );

    // TODO: Game 상태까지 고려하기
    const allOnlineUsers = this.getAllOnlineUsers();

    client.emit(GateWayEvents.Events, {
      userId: client.data.userId as string,
      dmChannels,
      channels,
      allOnlineUsers,
    });
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId as string | undefined;
    if (userId) {
      this.removeClientAtSocketMap(idOf(client.id), idOf(userId)); // 소켓의 접속 해제를 반영
    }
  }

  // 애매하다. 이걸로도 부족할듯 하고.
  // handleOnChat(client: UserSocket) {
  //   this.addClientAtSocketMap(client);
  // }

  // handleOffChat(clientId: ClientId, userId: UserId) {
  //   this.removeClientAtSocketMap(clientId, userId);
  // }

  // only 일반채널
  async sendMessage(client: UserSocket, channelId: ChannelId, msg: string) {
    const userId = client.data.userId as string;
    const type = ChannelRoomType.NORMAL;

    const result = await this.channelService.sendMessage(
      idOf(userId),
      channelId,
      msg,
    );

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    const blockList = await this.userFollowService.getUsersBlockingMe(
      idOf(userId),
    );

    const blockedIdList = blockList.map(({ followerId }) => followerId);

    const eventName = GateWayEvents.ChannelMessage;

    const data: MessageWithMemberDto = result.data!;

    this.broadcastToChannel(type, channelId, blockedIdList, eventName, {
      type: eventName,
      data,
    });
  }

  // only DM채널
  async handleCreateDmChannel(
    client: UserSocket,
    nickname?: string,
    memberId?: string,
  ) {
    const userId = client.data.userId as string;
    const type = ChannelRoomType.DM;

    let targetUser: UserDto | null;

    if (nickname) {
      targetUser = await this.usersService.findOneByNickname(nickname);
    } else if (memberId) {
      targetUser = await this.usersService.findOne(idOf(memberId));
    } else {
      throw new WsException(
        `Fail on createDmChannel: (${type}, ${nickname}, ${memberId})`,
      );
    }

    if (targetUser === null) {
      throw new WsException(
        `Fail on createDmChannel: targetUser를 찾지 못했습니다. (${type}, ${nickname}, ${memberId})`,
      );
    }

    const result = await this.dmService.findOrCraeteDmChannel(
      idOf(userId),
      idOf(targetUser.id),
    );
    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    const eventName = GateWayEvents.Events;
    const data: DmChannelInfoType = result.data!;

    this.broadcastToUserClients(idOf(userId), eventName, {
      type: eventName,
      data,
    });
  }

  async handleSendDm(client: UserSocket, toId: UserId, msg: string) {
    const userId = client.data.userId as string;
    const type = ChannelRoomType.DM;

    const result = await this.dmService.createDm(idOf(userId), toId, msg);

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    const relationship = await this.userFollowService.getUserRelationshipWithMe(
      toId,
      idOf(userId),
    );

    const blockedIdList = relationship?.isBlock ? [userId] : [];

    const channelId = result.data!.channelId;

    const eventName = GateWayEvents.DirectMessage;

    const data: MessageWithMemberDto = result.data!;

    this.broadcastToChannel(type, idOf(channelId), blockedIdList, eventName, {
      type: eventName,
      data,
    });
  }

  // only 일반채널
  async handleJoin(client: Socket, channelId: ChannelId) {
    const userId = client.data.userId as string;
    const type = ChannelRoomType.NORMAL;

    const result = await this.channelService.joinChannel(
      idOf(userId),
      channelId,
    );

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    this.handleUserJoinChannel(type, channelId, idOf(userId));

    const eventName = GateWayEvents.Join;

    const data: JoiningChannelInfo = result.data!;

    this.broadcastToChannel(type, channelId, [], eventName, {
      type: eventName,
      data,
    });
  }

  // only 일반채널
  async handleLeave(client: Socket, channelId: ChannelId) {
    const userId = client.data.userId as string;
    const type = ChannelRoomType.NORMAL;

    const result = await this.channelService.leaveChannel(
      idOf(userId!),
      channelId,
    );

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    this.handleUserLeaveChannel(type, channelId, idOf(userId));

    const eventName = GateWayEvents.Leave;
    const data: LeavingChannelInfo = result.data!;
    this.broadcastToChannel(type, channelId, [], eventName, {
      type: eventName,
      data,
    });
  }

  private getChannel(type?: string, channelId?: ChannelId) {
    if (type === undefined || channelId === undefined) {
      return null;
    }
    if (!(type in this.channels)) {
      return null;
    }

    if (!(channelId.value in this.channels[type])) {
      return null;
    }
    return this.channels[type][channelId.value];
  }
  private getChannelArray(type?: string, channelId?: ChannelId) {
    const channel = this.getChannel(type, channelId);
    return channel ? Array.from(channel) : null;
  }

  // only 일반채널
  async handleKickBanPromote(
    client: UserSocket,
    channelId: ChannelId,
    toId: UserId,
    actionType: ChangeActionType,
  ) {
    const userId = client.data.userId as string;
    const type = ChannelRoomType.NORMAL;

    const result = await this.channelService.changeMemberStatus(
      idOf(userId!),
      channelId,
      toId,
      actionType,
    );

    if (!result.ok) {
      throw new WsException(result.error?.message!);
    }

    const eventName = GateWayEvents.KickBanPromote;

    const data: ChannelMemberInfo = result.data!;

    this.broadcastToChannel(type, channelId, [], eventName, {
      type: eventName,
      data,
    }); // 채널에 통보
    this.removeUserFromChannel(
      this.channels[type][channelId.value],
      idOf(userId),
    ); // 실제 쫓아내기
  }

  handleUserJoinChannel(
    type: ChannelRoomType,
    channelId: ChannelId,
    userId: UserId,
  ) {
    if (!(channelId.value in this.channels[type])) {
      this.channels[type][channelId.value] = new Set();
    }
    this.channels[type][channelId.value].add(userId.value);
  }

  handleUserLeaveChannel(
    type: ChannelRoomType,
    channelId: ChannelId,
    userId: UserId,
  ) {
    if (!(channelId.value in this.channels[type])) {
      this.channels[type][channelId.value].delete(userId.value);
    }
  }

  handleNotificationToUser(userId: UserId, data: any) {
    const eventName = GateWayEvents.Notification;
    this.broadcastToUserClients(userId, eventName, data);
  }

  private getAllOnlineUsers = () => {
    return Array.from(this.socketMap.entries())
      .filter(([_userId, sockets]) => sockets.length)
      .map(([userId, _sockets]) => userId);
  };
  private addClientAtSocketMap(client: UserSocket) {
    const userId = client.data.userId as string;
    const sockets: UserSocket[] = this.socketMap.get(userId) ?? [];
    if (sockets.length === 0) {
      this.notiUserOn(userId);
    }
    this.socketMap.set(userId, [...sockets, client]);
  }
  private removeClientAtSocketMap(clientId: ClientId, userId: UserId) {
    const sockets = this.socketMap.get(userId.value);
    if (sockets?.length) {
      const newSockets = sockets.filter(
        (socket) => socket.id !== clientId.value,
      );
      if (newSockets.length === 0) {
        this.notiUserOff(userId.value);
      }
      this.socketMap.set(userId.value, newSockets);
    }
  }
  private broadcastToChannel(
    type: string,
    channelId: ChannelId,
    blockedIdList: string[],
    eventName: string,
    data: any,
  ) {
    this.getChannelArray(type, channelId)
      ?.filter((userId) =>
        blockedIdList.every((blockedId) => blockedId !== userId),
      )
      .forEach((userId) =>
        this.broadcastToUserClients(idOf(userId), eventName, data),
      );
  }
  private broadcastToUserClients(userId: UserId, eventName: string, data: any) {
    this.socketMap
      .get(userId.value)
      ?.forEach((client) => client.emit(eventName, data));
  }
  private broadcastAll(eventName: string, data: any) {
    this.server.emit(eventName, data);
  }
  private notiUserStatusUpdate(status: string, userId: string) {
    this.broadcastAll('userStatus', { status, userId });
  }
  private notiUserOn(userId: string) {
    this.notiUserStatusUpdate('online', userId);
  }
  private notiUserOff(userId: string) {
    this.notiUserStatusUpdate('offline', userId);
  }
  private notiUserGame(userId: string) {
    this.notiUserStatusUpdate('game', userId);
  }

  private async getUserJoinedChannelInfos(client: UserSocket) {
    const userId = client.data.userId as string;
    const dmChannels = await this.dmService.getDMChannelsWithMessages(
      idOf(userId),
    );
    const channels = await this.channelService.findByUser(idOf(userId));
    return { dmChannels, channels };
  }
  // only DM채널
  private removeUserFromChannel(channel: Set<UserIdKey>, userId: UserId) {
    channel.delete(userId.value); // 스스로 방에서 나가거나, 쫓겨나거나
  }
}
