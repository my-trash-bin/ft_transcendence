import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChangeActionType, ChannelService } from '../channel/channel.service';
import { idOf, UserId } from '../common/Id';
import { DmService } from '../dm/dm.service';
import { UserFollowService } from '../user-follow/user-follow.service';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';

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

@WebSocketGateway(80, {
  cors: { origin: 'http://localhost:53000', credentials: true },
})
@Injectable()
export class EventsGateway
  implements OnGatewayConnection, OnGatewayConnection, OnGatewayInit
{
  @WebSocketServer()
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
    this.channels = {
      normal: {},
      dm: {},
    };
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const decoded = this.isValidJwtAndPhase(client);
      const userId = decoded.id.value;

      this.addClient(client, userId);
      const { dmChannels, channels } = await this.addUserJoinedChannels(
        client,
        userId,
      );
      // TODO: Game 상태까지 고려하기
      const allOnlineUsers = this.getAllOnlineUsers();
      client.emit('events', { userId, dmChannels, channels, allOnlineUsers });
    } catch (error) {
      const msg =
        error instanceof WsException ? error.message : 'Unknown Error';
      console.error(error);
      client.emit('exception', { msg });
      console.log(`인증 실패: ${msg}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const { id } = client;
    const userId = this.userMap.get(id)!;
    const noti = this.removeClient(id);
    this.removeUserFromAllChannels(id);
  }

  // no dm
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; msg: string },
  ) {
    const { id } = client;
    const { channelId, msg } = data;
    const type = ChannelType.NORMAL;

    const result = await this.channelService.sendMessage(
      idOf(this.userMap.get(id)!),
      idOf(channelId),
      msg,
    );

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    const blockList = await this.userFollowService.findByUsers(
      idOf(this.userMap.get(id)!),
      true,
    );

    Array.from(this.channels[type][channelId])
      .filter(
        (userId) =>
          blockList.findIndex(({ followee }) => followee.id === userId) !== -1,
      )
      .forEach((userId) => {
        this.socketMap
          .get(userId)!
          .forEach((client) => client.emit('message', result));
      });

    this.server.to(type + channelId).emit('message', result);
  }

  // only dm
  @SubscribeMessage('dm')
  async handleDm(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { memberId: string; msg: string },
  ) {
    const { id } = client;
    const { memberId, msg } = data;
    const type = ChannelType.DM;

    const result = await this.dmService.createDm(
      idOf(this.userMap.get(id)!),
      idOf(memberId),
      msg,
    );

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    const userFollow = await this.userFollowService.findOne(
      idOf(memberId),
      idOf(this.userMap.get(id)!),
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

  // no dmChannel, 방금 생성된 채널에 오너만 소켓통신 위해 추가 처리하는 코드, 일반 채널 생성은 유효성 검사를 위해 API에서만....
  // @SubscribeMessage('createChannel')
  // async handleCreateChannel(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody()
  //   data: { channelId: string },
  // ) {
  //   const { id } = client;
  //   const { channelId } = data;
  //   const type = ChannelType.NORMAL;

  //   const channel = await this.channelService.findOne(idOf(channelId));
  //   if (channel === null) {
  //     throw new WsException(`유효하지않은 channelId: ${channelId}`);
  //   }
  //   const userId = this.userMap.get(id);
  //   if (channel.ownerId === null || channel.ownerId !== userId) {
  //     throw new WsException(`채널 생성 시, 소유자를 위한 메서드입니다.`);
  //   }

  //   client.join(type + channelId);
  //   this.channels[type][channelId].push(id);

  //   this.server
  //     .to(type + channelId)
  //     .emit('newUser', `New user ${id} joined in ${channelId}`);
  // }

  // API 호출에 의해 생성 시, 집어 넣기
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
  @SubscribeMessage('createDmChannel')
  async handleCreateDmChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { info: { nickname?: string; memberId?: string } },
  ) {
    const { id } = client;
    const { nickname, memberId } = data.info;
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

  // no dmChannel
  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const { id } = client;
    const { channelId } = data;
    const type = ChannelType.NORMAL;

    const result = await this.channelService.joinChannel(
      idOf(this.userMap.get(id)!),
      idOf(channelId),
    );
    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    client.join(type + channelId);
    this.clientJoinChannel(type, channelId, this.userMap.get(id)!);

    this.server.to(type + channelId).emit('newUser', { data: result.data! });
    this.channels[type][channelId];
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

  // no dmChannel
  @SubscribeMessage('leave')
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const { id } = client;
    const { channelId } = data;
    const type = ChannelType.NORMAL;

    const result = await this.channelService.leaveChannel(
      idOf(this.userMap.get(id)!),
      idOf(channelId),
    );

    if (!result.ok) {
      throw new WsException(result.error!.message);
    }

    client.leave(type + channelId);
    this.removeUserFromChannel(this.channels[type][channelId], id);

    this.server
      .to(type + channelId)
      .emit('userLeft', `User ${id} left from ${channelId}`);
  }

  // no dmChannel
  @SubscribeMessage('kickBanPromote')
  async handleKick(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { channelId: string; memberId: string; actionType: ChangeActionType },
  ) {
    const { id } = client;
    const { channelId, memberId, actionType } = data;
    const type = ChannelType.NORMAL;

    const result = await this.channelService.changeMemberStatus(
      idOf(this.userMap.get(id)!),
      idOf(channelId),
      idOf(memberId),
      actionType,
    );

    if (!result.ok) {
      throw new WsException(result.error?.message!);
    }

    client.to(type + channelId).emit('kichUser', result);

    this.removeUserFromChannel(this.channels[type][channelId], id);

    this.server
      .to(type + channelId)
      .emit('userLeft', `User ${id} left from ${channelId}`);
  }

  // To test
  @SubscribeMessage('triggerNotification')
  han(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.server.emit('noti', data);
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
  private addClient(client: Socket, userId: string) {
    const sockets: Socket[] = this.socketMap.get(userId) ?? [];
    if (sockets.length === 0) {
      this.notiUserOn(userId);
    }
    this.socketMap.set(userId, [...sockets, client]);
    this.userMap.set(client.id, userId);
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
  private async addUserJoinedChannels(client: Socket, userId: string) {
    const dmChannels = await this.dmService.getDMChannelsWithMessages(
      idOf(userId),
    );
    dmChannels.forEach((el) => client.join(ChannelType.DM + el.id));
    const channels = await this.channelService.findByUser(idOf(userId));
    channels.forEach((el) => client.join(ChannelType.NORMAL + el.id));
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
  // private isUserInChannel(type: string, channelId: string, clientId: string) {
  //   if (!(type in this.channels)) {
  //     throw new WsException(`유효하지 않은 type: ${type}`);
  //   }

  //   const channels = this.channels[type];

  //   if (!(channelId in channels)) {
  //     throw new WsException(`유효하지 않은 channelId: ${channelId}`);
  //   }

  //   const channel = channels[channelId];

  //   return channel.includes(clientId);
  // }
}
