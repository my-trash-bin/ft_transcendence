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
import { PrismaService } from '../base/prisma.service';
import { ChangeActionType } from '../channel/channel.service';
import { GateWayEvents } from '../common/gateway-events.enum';
import { idOf } from '../common/Id';
import { Pong } from '../pong/pong';
import {
  ChannelIdentityDto,
  CreateDmChannelDto,
  DmMessageDto,
  SendMessageDto,
  UserStatusDto,
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

@WebSocketGateway(parseInt(process.env.WS_PORT as string), {
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

  @SubscribeMessage('leaveGameBoard')
  async handleLeaveGameBoard(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client left game board: ${client.id}`);
    await this.eventsService.finalizeGame(client);
    this.eventsService.handleDisconnect(client);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.eventsService.finalizeGame(client);
    this.eventsService.handleDisconnect(client);
  }

  @SubscribeMessage(GateWayEvents.UserStatus)
  async userStatusRequest(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: UserStatusDto,
  ) {
    const { userId } = data;
    this.logger.debug(`userStatusRequest: ${userId}`);
    this.eventsService.handleUserStatusRequest(client, idOf(userId));
  }

  /**
   *  ***************** 채팅 코드 영역 ****************
   */

  // only 일반채널
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

  /**
   *  ***************** 게임 코드 영역 ****************
   */

  // game
  @SubscribeMessage('joinNormalMatch')
  handleJoinNormalMatch(@ConnectedSocket() client: Socket) {
    const itemMode = false;
    this.eventsService.tryMatch(client, itemMode);
  }

  @SubscribeMessage('joinItemMatch')
  handleJoinItemMatch(@ConnectedSocket() client: Socket) {
    const itemMode = true;
    this.eventsService.tryMatch(client, itemMode);
  }

  // 초대 요청 처리
  @SubscribeMessage('inviteNormalMatch')
  async inviteNormalMatchRequest(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: { friendId: string },
  ) {
    const isItemMode = false;
    this.eventsService.handleInviteMatch(client, data.friendId, isItemMode);
  }

  @SubscribeMessage('inviteItemMatch')
  async inviteItemMatchRequest(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: { friendId: string },
  ) {
    const isItemMode = true;
    this.eventsService.handleInviteMatch(client, data.friendId, isItemMode);
  }

  // 초대 수락 처리
  @SubscribeMessage('acceptNormalMatch')
  async handleAcceptNormalMatch(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: { inviterId: string },
  ) {
    this.eventsService.handleAcceptMatch(client, data.inviterId);
  }

  @SubscribeMessage('acceptItemMatch')
  async handleAcceptItemMatch(
    @ConnectedSocket() client: UserSocket,
    @MessageBody() data: { inviterId: string },
  ) {
    this.eventsService.handleAcceptMatch(client, data.inviterId);
  }

  @SubscribeMessage('paddleMove')
  handlePaddleMove(
    @MessageBody()
    data: boolean,
    @ConnectedSocket() client: UserSocket,
  ) {
    this.eventsService.handlePaddleMove(client, data);
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
