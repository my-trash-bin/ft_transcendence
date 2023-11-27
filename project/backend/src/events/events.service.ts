import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { ChangeActionType, ChannelService } from '../channel/channel.service';
import { ChannelId, idOf, UserId } from '../common/Id';
import { DmService } from '../dm/dm.service';
import { UserFollowService } from '../user-follow/user-follow.service';
import { UsersService } from '../users/users.service';
// import { ChatRoomDto, ChatRoomStatusDto } from './chat.dto'
import { Server, Socket } from 'socket.io';
import { UserDto } from '../users/dto/user.dto';

interface JwtPayload {
  phase: string;
  id: {
    value: string; // uuid
  };
  iat: number;
  exp: number;
}

enum ChannelType {
  NORMAL = 'normal',
  DM = 'dm',
}

type ChannelTypeKey = string;
type ChannelIdKey = string;
type UserIdKey = string;
type ClientIdKey = string;

@Injectable()
export class EventsService {
  server!: Server;

  // private channels!: Record<string, Record<string, string[]>>;
  private channels!: Record<
    ChannelTypeKey,
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

  async handleConnection(client: Socket, userId: UserId) {
    this.addClient(client, userId);

    const { dmChannels, channels } = await this.addUserJoinedChannels(
      client,
      userId,
    );
    // TODO: Game 상태까지 고려하기
    const allOnlineUsers = this.getAllOnlineUsers();
    client.emit('events', { userId, dmChannels, channels, allOnlineUsers });
  }

  async handleDisconnect(client: Socket) {
    const { id } = client;
    this.removeClient(id);
    this.removeUserFromAllChannels(id);
  }

  async sendMessage(client: Socket, channelId: ChannelId, msg: string) {
    const userId = this.userMap.get(client.id);
    const type = ChannelType.NORMAL;

    const result = await this.channelService.sendMessage(
      idOf(userId!),
      channelId,
      msg,
    );

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    const blockList = await this.userFollowService.findByUsers(
      idOf(userId!),
      true,
    );

    // 방법 2. 채널에만 보내기
    Array.from(this.channels[type][channelId.value])
      .filter(
        (userId) =>
          blockList.findIndex(({ followee }) => followee.id === userId) !== -1,
      )
      .forEach((userId) => {
        this.socketMap
          .get(userId)!
          .forEach((client) => client.emit('message', result));
      });
    // 방법 1. 전체에 그냥 보내기
    this.server.to(type + channelId).emit('message', result);
  }

  // NOT 소켓콜, API 호출에 의해 생성 시, 집어 넣기
  handleNewChannel(type: string, channelId: string, id: UserId) {
    const userId = id.value;
    const isValidType = (
      [ChannelType.DM, ChannelType.NORMAL] as string[]
    ).includes(type);
    if (!isValidType) {
      console.error(`handleNewChannel 시, 유효하지 않음 채널타입: ${type}`);
    }

    const clients = this.socketMap.get(userId);
    if (clients?.length) {
      // 접속중인 클라이언트가 있을때, 새롭게 생긴 room에 join시켜주는것.
      clients.forEach((client) => {
        client.join(type + channelId);
        this.clientJoinChannel(type, channelId, userId);
        client.emit('events', `채널 넣어드림: ${channelId}`);
      });
    }
  }

  // only dmChannel
  async handleCreateDmChannel(
    client: Socket,
    nickname?: string,
    memberId?: string,
  ) {
    const { id } = client;
    const userId = this.userMap.get(id);
    const type = ChannelType.DM;

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
      idOf(this.userMap.get(id)!),
      idOf(targetUser.id),
    );
    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    const dmChannel = result.data!;

    client.join(ChannelType.DM + dmChannel.id);
    client.emit('events', dmChannel);
  }

  async handleSendDm(client: Socket, toId: UserId, msg: string) {
    const { id } = client;
    const userId = this.userMap.get(id);
    const type = ChannelType.DM;

    const result = await this.dmService.createDm(idOf(userId!), toId, msg);

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    const userFollow = await this.userFollowService.findOne(
      toId,
      idOf(userId!),
    );

    if (!userFollow?.isBlock) {
      this.channels[type][result.data!.channelId].forEach((userId) => {
        this.socketMap
          .get(userId)
          ?.forEach((client) => client.emit('message', result));
      });
    } else {
      client.emit('message', result);
    }
  }

  // no dmChannel
  async handleJoinChannel(client: Socket, channelId: ChannelId) {
    const { id } = client;
    const userId = this.userMap.get(id);
    const type = ChannelType.NORMAL;

    const result = await this.channelService.joinChannel(
      idOf(userId!),
      channelId,
    );
    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    client.join(type + channelId);
    this.clientJoinChannel(type, channelId.value, userId!);

    this.server
      .to(type + channelId.value)
      .emit('newUser', { data: result.data! });
    this.channels[type][channelId.value];
  }

  // no dmChannel
  async handleLeaveChannel(client: Socket, channelId: ChannelId) {
    const { id } = client;
    const userId = this.userMap.get(id);
    const type = ChannelType.NORMAL;

    const result = await this.channelService.leaveChannel(
      idOf(userId!),
      channelId,
    );

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    client.leave(type + channelId);
    this.removeUserFromChannel(this.channels[type][channelId.value], id);

    this.server
      .to(type + channelId)
      .emit('userLeft', `User ${id} left from ${channelId}`);
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
    const type = ChannelType.NORMAL;

    const result = await this.channelService.changeMemberStatus(
      idOf(userId!),
      channelId,
      toId,
      actionType,
    );

    if (!result.ok) {
      throw new WsException(result.error?.message!);
    }

    client.to(type + channelId.value).emit('kichUser', result);

    this.removeUserFromChannel(this.channels[type][channelId.value], id);

    this.server
      .to(type + channelId)
      .emit('userLeft', `User ${id} left from ${channelId}`);
  }

  private clientJoinChannel(type: string, channelId: string, userId: string) {
    if (!(channelId in this.channels[type])) {
      this.channels[type][channelId] = new Set();
    }
    this.channels[type][channelId].add(userId);
  }

  private clientLeaveChannel(type: string, channelId: string, userId: string) {
    if (channelId in this.channels[type]) {
      this.channels[type][channelId].delete(userId);
    }
  }

  private getCookie = (cookies: string, key: string) => {
    const cookieKeyValues = cookies.split('; ').map((el) => el.split('='));
    const jwtKeyValue = cookieKeyValues.find((el) => el[0] === key);
    return jwtKeyValue !== undefined ? jwtKeyValue[1] : null;
  };
  private getAllOnlineUsers = () => {
    return Array.from(this.userMap.values()).filter(
      (userId) => this.socketMap.get(userId)?.length,
    );
  };
  private isValidTypeOrThrow = (type: string) => {
    if (!([ChannelType.NORMAL, ChannelType.DM] as string[]).includes(type)) {
      throw new WsException(`유효하지 않은 type: ${type}`);
    }
  };
  private isValidJwtAndPhase = (client: Socket) => {
    // console.log(client.handshake.headers.cookie);
    if (client.handshake.headers.cookie === undefined) {
      throw new WsException('인증을 위해 쿠키 필수입니다.');
    }
    const jwt = this.getCookie(client.handshake.headers.cookie, 'jwt');
    if (jwt === null) {
      throw new WsException('jwt 토큰이 쿠키에 없습니다.');
    }

    const decoded = this.jwtService.verify<JwtPayload>(jwt, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    });

    if (decoded.phase !== 'complete') {
      throw new WsException(
        `jwt의 phase가 complete가 아닙니다. (${decoded.phase}).`,
      );
    }
    return decoded;
  };
  private addClient(client: Socket, userId: UserId) {
    const sockets: Socket[] = this.socketMap.get(userId.value) ?? [];
    if (sockets.length === 0) {
      this.notiUserOn(userId.value);
    }
    this.socketMap.set(userId.value, [...sockets, client]);
    this.userMap.set(client.id, userId.value);
  }
  private removeClient(clientId: string) {
    const userId = this.userMap.get(clientId);
    if (userId === undefined) {
      return;
    }
    const sockets = this.socketMap.get(userId);
    if (sockets?.length) {
      const newSockets = sockets.filter((socket) => socket.id !== clientId);
      if (newSockets.length === 0) {
        this.notiUserOff(userId);
      }
      this.socketMap.set(userId, newSockets);
    }
    this.userMap.delete(clientId);
  }
  private brodcastAll(eventName: string, data: any) {
    this.server.emit(eventName, data);
  }
  private notiUserStatusUpdate(status: string, userId: string) {
    this.brodcastAll('userStatus', { status, userId });
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
      // console.log('dm방 넣어주기 ', ChannelType.DM, ' ', dmChannel.id);
      client.join(dmChannel.id + dmChannel.id);
      if (!(ChannelType.DM in this.channels[ChannelType.DM])) {
        this.channels[ChannelType.DM][dmChannel.id] = new Set();
      }
      this.channels[ChannelType.DM][dmChannel.id].add(userId.value);
    });
    const channels = await this.channelService.findByUser(userId);
    channels.forEach((channel) => {
      // console.log('채널방 넣어주기 ', ChannelType.NORMAL, ' ', channel.id);
      client.join(ChannelType.NORMAL + channel.id);
      if (!(channel.id in this.channels[ChannelType.NORMAL])) {
        this.channels[ChannelType.DM][channel.id] = new Set();
      }
      this.channels[ChannelType.DM][channel.id].add(userId.value);
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
