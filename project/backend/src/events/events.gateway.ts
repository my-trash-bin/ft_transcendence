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

interface JwtPayload {
  phase: string;
  id: {
    value: string; // uuid
  };
  iat: number;
  exp: number;
}

@WebSocketGateway(80, {
  cors: { origin: 'http://localhost:53000', credentials: true },
})
@Injectable()
export class EventsGateway
  implements OnGatewayConnection, OnGatewayConnection, OnGatewayInit
{
  @WebSocketServer()
  server!: Server;

  private channels!: Record<string, Record<string, string[]>>;
  private user!: Record<string, any>;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    // 서버 초기화 시 변수 설정
    this.channels = {
      normal: {},
      dm: {},
    };
    this.channels.normal['1'] = [];
    this.channels.normal['2'] = [];
    this.channels.normal['3'] = [];
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const decoded = this.isValidJwtAndPhase(client);

      console.log('인증 성공');
      // 여기서 인증된 사용자에 대한 로직 처리
    } catch (error) {
      const msg =
        error instanceof WsException ? error.message : 'Unknown Error';
      client.emit('exception', { msg });
      console.log(`인증 실패: ${msg}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const { id } = client;
    Object.entries(this.channels).forEach(([_channelType, channels]) => {
      this.removeUserFormChannels(channels, id);
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { type: string; channelId: string; msg: string },
  ): void {
    const { id } = client;
    const { type, channelId, msg } = data;
    if (!this.isUserInChannel(type, channelId, id)) {
      throw new WsException(`Fail on message: (${type}, ${channelId}, ${msg})`);
    }
    this.server.to(channelId).emit('message', msg);
  }

  @SubscribeMessage('join')
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { type: string; channelId: string },
  ): void {
    const { id } = client;
    const { type, channelId } = data;

    if (this.isUserInChannel(type, channelId, id)) {
      throw new WsException(`Fail on join: (${type}, ${channelId})`);
    }

    client.join(channelId);
    this.channels[type][channelId].push(id);

    this.server
      .to(channelId)
      .emit('newUser', `New user ${id} joined in ${channelId}`);
  }

  @SubscribeMessage('leave')
  handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { type: string; channelId: string },
  ): void {
    const { id } = client;
    const { type, channelId } = data;

    if (!this.isUserInChannel(type, channelId, id)) {
      throw new WsException(`Fail on leave: (${type}, ${channelId})`);
    }

    client.leave(channelId);
    this.removeUserFormChannel(this.channels[type][channelId], id);

    this.server
      .to(channelId)
      .emit('userLeft', `User ${id} left from ${channelId}`);
  }

  @SubscribeMessage('ECHO') // 아래 처럼 받을 수도
  handleEcho(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): void {
    this.server;
    console.log(`onMessage at api/chat: ${data}`);
    console.log('------------------------');
    console.log(client);
    console.log('------------------------');
    this.server.emit('returnEcho', data);
  }

  private getCookie = (cookies: string, key: string) => {
    const cookieKeyValues = cookies.split('; ').map((el) => el.split('='));
    const jwtKeyValue = cookieKeyValues.find((el) => el[0] === key);
    return jwtKeyValue !== undefined ? jwtKeyValue[1] : null;
  };
  private isValidJwtAndPhase = (client: Socket) => {
    console.log(client.handshake.headers.cookie);
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
  private removeUserFormChannels = (
    channels: Record<string, string[]>,
    id: string,
  ) => {
    Object.entries(channels).forEach(([_channelId, channel]) =>
      this.removeUserFormChannel(channel, id),
    );
  };
  private removeUserFormChannel = (channel: string[], id: string) => {
    const index = channel.indexOf(id);
    if (index !== -1) {
      channel.splice(index, 1);
    }
  };
  private isUserInChannel = (
    type: string,
    channelId: string,
    clientId: string,
  ) => {
    if (!(type in this.channels)) {
      throw new WsException(`유효하지 않은 type: ${type}`);
    }

    const channels = this.channels[type];

    if (!(channelId in channels)) {
      throw new WsException(`유효하지 않은 channelId: ${channelId}`);
    }

    const channel = channels[channelId];

    return channel.includes(clientId);
  };
}
