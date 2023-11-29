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
import { GameService, GameState } from './events.game';
import { EventsService } from './events.service';

interface JwtPayload {
  phase: string;
  id: {
    value: string; // uuid
  };
  iat: number;
  exp: number;
}

@Injectable()
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
      new Logger().debug('client connected');
      // new Logger().debug(client.id);
      const decoded = this.isValidJwtAndPhase(client);
      const userId = decoded.id.value;

      await this.eventsService.handleConnection(client, idOf(userId));
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
    new Logger().debug(`Client disconnected: ${client.id}`);
    this.eventsService.handleDisconnect(client);
  }

  // no dm
  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; msg: string },
  ) {
    const { channelId, msg } = data;
    await this.eventsService.sendMessage(client, idOf(channelId), msg);
  }

  // only dm
  @SubscribeMessage('dm')
  async handleDm(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { memberId: string; msg: string },
  ) {
    const { memberId, msg } = data;
    await this.eventsService.handleSendDm(client, idOf(memberId), msg);
  }

  // only dmChannel
  @SubscribeMessage('createDmChannel')
  async handleCreateDmChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { info: { nickname?: string; memberId?: string } },
  ) {
    const { nickname, memberId } = data.info;

    await this.eventsService.handleCreateDmChannel(client, nickname, memberId);
  }

  // no dmChannel
  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const { channelId } = data;

    await this.eventsService.handleJoinChannel(client, idOf(channelId));
  }

  // no dmChannel
  @SubscribeMessage('leave')
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string },
  ) {
    const { channelId } = data;

    await this.eventsService.handleLeaveChannel(client, idOf(channelId));
  }

  // no dmChannel
  @SubscribeMessage('kickBanPromote')
  async handleKick(
    @ConnectedSocket() client: Socket,
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
    // new Logger().debug(`request socket, ${client.id}`);
    // new Logger().debug(`${client.connected}`);
    client.to(client.id).emit('playerRole', "hihi");
    // new Logger().debug(`${client.connected}`);
  }

  @SubscribeMessage('paddleMove')
  handlePaddleMove(@MessageBody() data: { direction: 'up' | 'down'; player: 'player1' | 'player2' }, @ConnectedSocket() client: Socket) {
    // new Logger().debug(`paddle move`);
    this.gameService.handlePaddleMove(data.direction, data.player);
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
}
