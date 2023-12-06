import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../base/prisma.service';
import { ChangeActionType } from '../channel/channel.service';
import { idOf } from '../common/Id';
import { GateWayEvents } from '../common/gateway-events.enum';
import { GameState, Pong } from '../pong/pong';
import {
  ChannelIdentityDto,
  CreateDmChannelDto,
  DmMessageDto,
  SendMessageDto,
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
  cors: { origin: process.env.FRONTEND_ORIGIN, credentials: true },
})
@Injectable()
export class EventsGateway
  implements
    OnGatewayConnection,
    OnGatewayConnection,
    OnGatewayInit,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private pongMap: Map<string, Pong>;
  private logger = new Logger('eventsGateway');

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private eventsService: EventsService,
    private prisma: PrismaService,
  ) {
    this.pongMap = new Map();
  }

  afterInit(server: Server) {
    this.eventsService.afterInit(server);
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      this.logger.debug(`새로운 클라이언트 ${client.id} 접속 시도`);
      const decoded = this.isValidJwtAndPhase(client);
      const userId = decoded.id.value;

      client.data.userId = userId;

      await this.eventsService.handleConnection(client as UserSocket);

      this.logger.log(
        `유저(${userId})의 새로운 클라이언트 접속: client.id ${client.id}`,
      );
    } catch (error) {
      const msg =
        error instanceof WsException ? error.message : 'Unknown Error';
      this.logger.error(`핸드쉐이크 실패: client.id ${client.id}`);
      client.emit(GateWayEvents.Exception, { msg });
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.eventsService.handleDisconnect(client);
  }

  // only DM채널
  @SubscribeMessage(GateWayEvents.ChannelMessage)
  async handleMessage(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: SendMessageDto,
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

  private tryNormalMatch() {
    console.log('tryNormalMatch');
    if (this.normalMatchQueue.size >= 2) {
      console.log('Matched!');
      const playersIterator = this.normalMatchQueue.values();
      const player1 = playersIterator.next().value;
      const player2 = playersIterator.next().value;

      this.normalMatchQueue.delete(player1);
      this.normalMatchQueue.delete(player2);

      this.createGameRoom(player1, player2, false);
    }
  }

  private tryItemMatch() {
    if (this.itemMatchQueue.size >= 2) {
      const playersIterator = this.itemMatchQueue.values();
      const player1 = playersIterator.next().value;
      const player2 = playersIterator.next().value;

      this.itemMatchQueue.delete(player1);
      this.itemMatchQueue.delete(player2);

      this.createGameRoom(player1, player2, true);
    }
  }

  private async fetchPlayerInfo(
    playerId: string,
  ): Promise<{ nickname: string; avatarUrl: string }> {
    try {
      const prismaUser = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: playerId,
        },
      });
      console.log(prismaUser);
      return {
        nickname: prismaUser.nickname,
        avatarUrl: prismaUser.profileImageUrl ?? '',
      };
    } catch (error) {
      console.error('플레이어 정보를 가져오는 데 실패했습니다:', error);
      return { nickname: '', avatarUrl: '' };
    }
  }

  private async emitPlayerInfo(player1Id: string, player2Id: string, roomName: string) {
    const player1Info = await this.fetchPlayerInfo(player1Id);
    this.server.to(roomName).emit('player1Info', player1Info);

    const player2Info = await this.fetchPlayerInfo(player2Id);
    this.server.to(roomName).emit('player2Info', player2Info);
  }

  private createGameRoom(
    player1: Socket,
    player2: Socket,
    mode: boolean,
  ): void {
    // 룸 생성 및 클라이언트 추가
    const roomName = generateUniqueRoomName();
    player1.join(roomName);
    player2.join(roomName);
    this.server.to(roomName).emit('GoPong', { room: roomName });

    // playerRole 알림
    this.server.to(player1.id).emit('playerRole', 'player1');
    this.server.to(player2.id).emit('playerRole', 'player2');

    setTimeout(() => {
      const player1Id = player1.data.userId;
      const player2Id = player2.data.userId;
      const pong = new Pong(this.prisma, player1Id, player2Id, mode, () => {
        this.pongMap.delete(player1Id);
        this.pongMap.delete(player2Id);
      });
      this.emitPlayerInfo(player1Id, player2Id, roomName);
      pong.onGameUpdate.on('gameState', (gameState: GameState) => {
        player1.emit('gameUpdate', gameState);
        player2.emit('gameUpdate', gameState);
      });
      this.pongMap.set(player1Id, pong);
      this.pongMap.set(player2Id, pong);
    }, 3000);
  }

  @SubscribeMessage('paddleMove')
  handlePaddleMove(
    @MessageBody()
    data: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    if (client.data.userId === undefined) return;
    if (!this.pongMap.has(client.data.userId)) return;
    if (this.pongMap.get(client.data.userId) === undefined) return;
    if (
      this.pongMap.get(client.data.userId)?.getGameState().gameStart === false
    )
      return;
    const playerId = client.data.userId;
    const pong = this.pongMap.get(playerId);
    if (!pong) return;
    pong.handlePaddleMove(data === true, playerId === pong.player1Id);
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
