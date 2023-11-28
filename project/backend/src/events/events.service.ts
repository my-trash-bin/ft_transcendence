import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { ChangeActionType, ChannelService } from '../channel/channel.service';
import { ChannelId, ClientId, idOf, UserId } from '../common/Id';
import { DmService } from '../dm/dm.service';
import { UserFollowService } from '../user-follow/user-follow.service';
import { UsersService } from '../users/users.service';
// import { ChatRoomDto, ChatRoomStatusDto } from './chat.dto'
import { Server, Socket } from 'socket.io';
import { GateWayEvents } from '../common/gateway-events.enum';
import { UserDto } from '../users/dto/user.dto';

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
  private socketMap = new Map<UserIdKey, Socket[]>();
  private userMap = new Map<ClientIdKey, UserIdKey>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
    private dmService: DmService,
    private channelService: ChannelService,
    private userFollowService: UserFollowService,
  ) {}

  afterInit(server: Server) {
    // 서버 초기화 시 변수 설정
    this.server = server;
    this.channels = {
      normal: {},
      dm: {},
    };
  }

  async handleConnection(
    client: Socket,
    userId: UserId,
    isAddClient: boolean = true,
  ) {
    this.userMap.set(client.id, userId.value);

    // client
    if (isAddClient) {
      this.addClientAtSocketMap(client, userId);
    }
    // UserId
    const { dmChannels, channels } = await this.addUserJoinedChannels(
      client,
      userId,
    );

    // TODO: Game 상태까지 고려하기
    const allOnlineUsers = this.getAllOnlineUsers();
    client.emit(GateWayEvents.Events, {
      userId,
      dmChannels,
      channels,
      allOnlineUsers,
    });
  }

  async handleDisconnect(client: Socket) {
    const { id } = client;
    const userId = this.userMap.get(id);
    if (userId) {
      // client
      this.removeClientAtSocketMap(idOf(id), idOf(userId));
      // UserId
      this.removeUserFromAllChannels(id);
    }
    this.userMap.delete(id);
  }

  handleOnChat(client: Socket, userId: UserId) {
    this.addClientAtSocketMap(client, userId);
  }

  handleOffChat(client: Socket, userId: UserId) {
    this.removeClientAtSocketMap(idOf(client.id), userId);
  }

  async sendMessage(client: Socket, channelId: ChannelId, msg: string) {
    const userId = this.userMap.get(client.id);
    const type = ChannelRoomType.NORMAL;

    if (!userId) {
      throw new WsException('Fail to mapping clientId to userId');
    }

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

    const data = result;

    this.broadcastToChannel(type, channelId, blockedIdList, eventName, data);
  }

  // only dmChannel
  async handleCreateDmChannel(
    client: Socket,
    nickname?: string,
    memberId?: string,
  ) {
    const { id } = client;
    const userId = this.userMap.get(id);
    const type = ChannelRoomType.DM;

    let targetUser: UserDto | null;

    if (!userId) {
      throw new WsException(`Failt to mapping clientId to userId: ${id}`);
    }

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
      idOf(this.userMap.get(id)!),
      idOf(targetUser.id),
    );
    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    const dmChannel = result.data!;

    const eventName = GateWayEvents.Events;
    const data = dmChannel;

    client.emit(eventName, data);
  }

  async handleSendDm(client: Socket, toId: UserId, msg: string) {
    const { id } = client;
    const userId = this.userMap.get(id);
    const type = ChannelRoomType.DM;

    if (!userId) {
      throw new WsException('Fail to mapping clientId to userId');
    }

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

    const data = result;

    this.broadcastToChannel(
      type,
      idOf(channelId),
      blockedIdList,
      eventName,
      data,
    );
  }

  // no dmChannel
  async handleJoin(client: Socket, channelId: ChannelId) {
    const { id } = client;
    const userId = this.userMap.get(id);
    const type = ChannelRoomType.NORMAL;

    if (!userId) {
      throw new WsException(`Fail to mapping clientId to userId: ${id}`);
    }

    const result = await this.channelService.joinChannel(
      idOf(userId),
      channelId,
    );
    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    this.handleUserJoinChannel(type, channelId, idOf(userId));

    const eventName = GateWayEvents.Join;

    const data = result.data!;

    this.broadcastToChannel(type, channelId, [], eventName, data);
  }

  // no dmChannel
  async handleLeave(client: Socket, channelId: ChannelId) {
    const { id } = client;
    const userId = this.userMap.get(id);
    const type = ChannelRoomType.NORMAL;

    if (!userId) {
      throw new WsException(`Fail to mapping clientId to userId: ${id}`);
    }

    const result = await this.channelService.leaveChannel(
      idOf(userId!),
      channelId,
    );

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    this.handleUserLeaveChannel(type, channelId, idOf(userId));

    const eventName = GateWayEvents.Leave;
    const data = result.data!;
    this.broadcastToChannel(type, channelId, [], eventName, data);
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

  // no dmChannel
  async handleKickBanPromote(
    client: Socket,
    channelId: ChannelId,
    toId: UserId,
    actionType: ChangeActionType,
  ) {
    const { id } = client;
    const userId = this.userMap.get(id);
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

    const data = result.data!;

    this.broadcastToChannel(type, channelId, [], eventName, data);
    this.removeUserFromChannel(this.channels[type][channelId.value], id);
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
    return Array.from(this.userMap.values()).filter(
      (userId) => this.socketMap.get(userId)?.length,
    );
  };
  private addClientAtSocketMap(client: Socket, userId: UserId) {
    const sockets: Socket[] = this.socketMap.get(userId.value) ?? [];
    if (sockets.length === 0) {
      this.notiUserOn(userId.value);
    }
    this.socketMap.set(userId.value, [...sockets, client]);
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

  private async addUserJoinedChannels(client: Socket, userId: UserId) {
    const dmChannels = await this.dmService.getDMChannelsWithMessages(userId);
    dmChannels.forEach((dmChannel) => {
      this.handleUserJoinChannel(
        ChannelRoomType.DM,
        idOf(dmChannel.id),
        userId,
      );
    });
    const channels = await this.channelService.findByUser(userId);
    channels.forEach((channel) => {
      this.handleUserJoinChannel(ChannelRoomType.DM, idOf(channel.id), userId);
    });
    return { dmChannels, channels };
  }
  private removeUserFromAllChannels(id: string) {
    Object.entries(this.channels).forEach(([_channelType, _chennels]) => {
      this.removeUserFromChannels(_channelType, id);
    });
  }
  private removeUserFromChannels(channelType: string, id: string) {
    Object.entries(this.channels[channelType]).forEach(
      ([_channelId, channel]) => this.removeUserFromChannel(channel, id),
    );
  }
  private removeUserFromChannel(channel: Set<string>, id: string) {
    channel.delete(id);
  }
}
