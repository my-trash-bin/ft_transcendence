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
import { v4 as uuidv4 } from 'uuid';
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
  @SubscribeMessage('joinNormalMatch')
  handleJoinNormalMatch(@ConnectedSocket() client: Socket) {
    this.normalMatchQueue.add(client);
    this.tryNormalMatch();
  }
  
  @SubscribeMessage('joinItemMatch')
  handleJoinItemMatch(@ConnectedSocket() client: Socket) {
    this.itemMatchQueue.add(client);
    this.tryItemMatch();
  }

  // 초대 로직 (나중에!)
  // @SubscribeMessage('inviteToMatch')
  // handleInviteToMatch(@MessageBody() data: { inviteeId: string }, @ConnectedSocket() client: Socket) {
  // }
  
  private normalMatchQueue = new Set<Socket>();
  private itemMatchQueue = new Set<Socket>();
  
  tryNormalMatch() {
    console.log('tryNormalMatch');
    if (this.normalMatchQueue.size >= 2) {
      console.log('Matched!');
      const playersIterator = this.normalMatchQueue.values();
      const player1 = playersIterator.next().value;
      const player2 = playersIterator.next().value;
  
      this.normalMatchQueue.delete(player1);
      this.normalMatchQueue.delete(player2);
  
      const roomName = this.createGameRoom(player1, player2);
  
      // 일반 매치 시작 알림
      this.server.to(roomName).emit('normalMatchStart', { room: roomName });
    }
  }
  
  tryItemMatch() {
    if (this.itemMatchQueue.size >= 2) {
      const playersIterator = this.itemMatchQueue.values();
      const player1 = playersIterator.next().value;
      const player2 = playersIterator.next().value;
  
      this.itemMatchQueue.delete(player1);
      this.itemMatchQueue.delete(player2);
  
      const roomName = this.createGameRoom(player1, player2);
  
      // 아이템 매치 시작 알림
      this.server.to(roomName).emit('itemMatchStart', { room: roomName });
    }
  }

  private roomReadyStatus: Record<string, Set<string>> = {};

  private createGameRoom(player1: Socket, player2: Socket): string {
    const roomName = generateUniqueRoomName();
    // 룸 생성
    player1.join(roomName);
    player2.join(roomName);

    // 룸별 준비 상태 초기화
    this.roomReadyStatus[roomName] = new Set([player1.id, player2.id]);

    // 방에 클라이언트 추가
    this.server.to(roomName).emit('GoPong', { room: roomName });

    // playerRole 알림
    this.server.to(player1.id).emit('playerRole', 'player1');
    this.server.to(player2.id).emit('playerRole', 'player2');
    this.gameService.resetGame();
    return roomName;
  }


  // 이 방식도 생각해보기!
  // const roomName = 'chatRoom1';
  // io.in(roomName).on('newMessage', (message) => {
  //   console.log(`New message in ${roomName}: ${message}`);
  // });
    @SubscribeMessage('ready')
  handlePlayerReady(@MessageBody() data: { room: string; isPlayer1: boolean }, @ConnectedSocket() client: Socket) {
    const room = data.room;
    
    // 해당 룸의 준비된 플레이어 목록에서 현재 플레이어를 제거
    this.roomReadyStatus[room]?.delete(client.id);
  
    // 특정 룸의 모든 플레이어가 준비되었는지 확인
    if (this.isRoomReady(room)) {
      this.server.to(room).emit('gameStart'); // 해당 룸에 게임 시작 알림
      delete this.roomReadyStatus[room]; // 게임 시작 후 준비 상태 초기화
    }
  }
  
  private isRoomReady(room: string): boolean {
    return this.roomReadyStatus[room] && this.roomReadyStatus[room].size === 0;
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

function generateUniqueRoomName(): string {
  return uuidv4();
}