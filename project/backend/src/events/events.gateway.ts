import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChangeActionType } from '../channel/channel.service';
import { idOf } from '../common/Id';
import { GateWayEvents } from '../common/gateway-events.enum';
import { GameService, GameState } from '../pong/pong';
import {
  ChannelIdentityDto,
  ChannelMessageDto,
  CreateDmChannelDto,
  DmMessageDto,
} from './event-request.dto';
import { EventsService } from './events.service';

interface JwtPayload {
  phase: string;
  id: {
    value: string; // uuid
  };
  iat: number;
  exp: number;
}

export type UserSocket = Socket & {
  data: {
    userId: string;
  };
};

@WebSocketGateway(80, {
  cors: { origin: 'http://localhost:53000', credentials: true },
})

@Injectable()
export class EventsGateway
  implements OnGatewayConnection, OnGatewayConnection, OnGatewayInit, OnModuleInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventsService: EventsService,
    private gameService: GameService,
  ) {}

  // game
  onModuleInit() {
    this.gameService.onGameUpdate.on('gameState', (gameState: GameState) => {
      this.server.emit('gameUpdate', gameState);
    });
  }
  
  afterInit(server: Server) {
    this.eventsService.afterInit(server);
  }

  
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      new Logger().debug(`client connected ${client.id}`);
      const decoded = this.isValidJwtAndPhase(client);
      const userId = decoded.id.value;

      client.data.userId = userId;

      await this.eventsService.handleConnection(client as UserSocket);
    } catch (error) {
      const msg =
        error instanceof WsException ? error.message : 'Unknown Error';
      console.error(error);
      client.emit(GateWayEvents.Exception, { msg });
      console.log(`인증 실패: ${msg}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    new Logger().debug(`Client disconnected: ${client.id}`);
    this.eventsService.handleDisconnect(client);
  }

  // only DM채널
  @SubscribeMessage(GateWayEvents.ChannelMessage)
  async handleMessage(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: ChannelMessageDto,
  ) {
    const { channelId, msg } = data;
    await this.eventsService.sendMessage(client, idOf(channelId), msg);
  }

  // only dm
  @SubscribeMessage(GateWayEvents.DirectMessage)
  async handleDm(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: DmMessageDto,
  ) {
    const { memberId, msg } = data;
    await this.eventsService.handleSendDm(client, idOf(memberId), msg);
  }

  // only dmChannel
  @SubscribeMessage(GateWayEvents.CreateDmChannel)
  async handleCreateDmChannel(
    @ConnectedSocket() client: UserSocket,
    @MessageBody()
    data: CreateDmChannelDto,
  ) {
    const { nickname, memberId } = data.info;

    await this.eventsService.handleCreateDmChannel(client, nickname, memberId);
  }

  // only 일반채널
  @SubscribeMessage(GateWayEvents.Join)
  async handleJoin(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: ChannelIdentityDto,
  ) {
    const { channelId } = data;

    await this.eventsService.handleJoin(client, idOf(channelId));
  }

  // only 일반채널
  @SubscribeMessage(GateWayEvents.Leave)
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChannelIdentityDto,
  ) {
    const { channelId } = data;

    await this.eventsService.handleLeave(client, idOf(channelId));
  }

  // only 일반채널
  @SubscribeMessage(GateWayEvents.KickBanPromote)
  async handleKick(
    @ConnectedSocket() client: UserSocket,
    @MessageBody()
    data: { channelId: string; memberId: string; actionType: ChangeActionType },
  ) {
    const { channelId, memberId, actionType } = data;

    await this.eventsService.handleKickBanPromote(
      client,
      idOf(channelId),
      idOf(memberId),
      actionType,
    );
  }
  
  // game
  @SubscribeMessage('joinLobby')
  handleJoinLobby(@ConnectedSocket() client: Socket) {
    const playerRole = 'player1';  // 임시로 고정
    this.server.emit('playerRole', playerRole);
    // new Logger().debug(`request socket, ${client.id}`);
  }

  @SubscribeMessage('paddleMove')
  handlePaddleMove(@MessageBody() data: { direction: 'up' | 'down'; player: 'player1' | 'player2' }, @ConnectedSocket() client: Socket) {
    this.gameService.handlePaddleMove(data.direction, data.player);
  }

  @SubscribeMessage('restartGame')
  handleRestartGame(@ConnectedSocket() client: Socket) {
    this.gameService.resetGame();
  }

  // To test
  @SubscribeMessage('triggerNotification')
  handleNoti(@ConnectedSocket() client: UserSocket, @MessageBody() data: any) {
    this.server.emit(GateWayEvents.Notification, data);
  }

  // To test
  @SubscribeMessage(GateWayEvents.Exception)
  testException(
    @ConnectedSocket() _client: UserSocket,
    @MessageBody() data: any,
  ) {
    throw new WsException(`WsException 테스트 중입니다.`);
  }

  // To test
  @SubscribeMessage('invite')
  testOk(
    @ConnectedSocket() _client: UserSocket,
    @MessageBody() data: any,
  ): string {
    return `ok 테스트 중입니다.`;
  }

  private getCookie = (cookies: string, key: string) => {
    const cookieKeyValues = cookies.split('; ').map((el) => el.split('='));
    const jwtKeyValue = cookieKeyValues.find((el) => el[0] === key);
    return jwtKeyValue !== undefined ? jwtKeyValue[1] : null;
  };
  private isValidJwtAndPhase = (client: UserSocket) => {
    // console.log(client.handshake.headers.cookie);
    if (client.handshake.headers.cookie === undefined) {
      throw new WsException(
        '헤더에 쿠키가 존재하지 않습니다. 인증을 위해 쿠키 필수입니다.',
      );
    }
    const jwt = this.getCookie(client.handshake.headers.cookie, 'jwt');
    if (jwt === null) {
      throw new WsException(
        '헤더의 쿠키에서 jwt 토큰을 찾을 수 없습니다. 인증을 위해 jwt 토큰이 필요합니다.',
      );
    }

    const decoded = this.jwtService.verify<JwtPayload>(jwt, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    });

    if (decoded.phase !== 'complete') {
      throw new WsException(
        `jwt의 phase가 complete가 아닙니다. (${decoded.phase}). 인증된 유저만 접속할 수 있습니다.`,
      );
    }
    return decoded;
  };
}
