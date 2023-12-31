import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../base/prisma.service';
import { ChangeActionType, ChannelService } from '../channel/channel.service';
import { ChangeMemberStatusResultDto } from '../channel/dto/change-member-status-result.dto';
import { JoinedChannelInfoDto } from '../channel/dto/joined-channel-info.dto';
import { LeavingChannelResponseDto } from '../channel/dto/leave-channel-response.dto';
import { GateWayEvents } from '../common/gateway-events.enum';
import { ChannelId, ClientId, idOf, UserId } from '../common/Id';
import { DmService } from '../dm/dm.service';
import { MessageWithMemberDto } from '../dm/dto/message-with-member';
import { NotificationService } from '../notification/notification.service';
import { PongLogService } from '../pong-log/pong-log.service';
import { GameState, Pong } from '../pong/pong';
import { UserFollowService } from '../user-follow/user-follow.service';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { DmChannelInfoType } from './event-response.dto';
import { UserSocket } from './events.gateway';
const GAME_OVER = 7;
export enum ChannelRoomType {
  NORMAL = 'normal',
  DM = 'dm',
}

type ChannelRoomTypeKey = string;
type ChannelIdKey = string;
type UserIdKey = string; // 유저 아이디(uuid)
type ClientIdKey = string; // 소켓아이디
type ChannelRecordType = Record<ChannelIdKey, Set<UserIdKey>>;

export enum EnumUserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ONGAME = 'ongame',
}

type InvitationType = {
  inviterSocket: UserSocket;
  inviteeId: UserIdKey;
  isItemMode: boolean;
};

@Injectable()
export class EventsService {
  server!: Server;

  private logger = new Logger('EventsService');
  private channels!: Record<ChannelRoomTypeKey, ChannelRecordType>;
  private socketMap = new Map<UserIdKey, UserSocket[]>(); // 소켓맵은 이곳에서 초기화 상태

  private pongMap = new Map<UserIdKey, Pong>();
  private activeInvitations = new Map<UserIdKey, InvitationType>();
  private normalMatchQueue = new Set<Socket>();
  private itemMatchQueue = new Set<Socket>();
  private readyUsers = new Map<UserIdKey, UserSocket>();

  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
    private dmService: DmService,
    private channelService: ChannelService,
    private userFollowService: UserFollowService,
    private notificationService: NotificationService,
    private pongLogService: PongLogService,
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

    this.logger.verbose(`allOnlineUsers: ${allOnlineUsers}`);

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
      this.removeClientAtSocketMap(idOf(client.id), idOf(userId));
    }
  }

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
    this.logger.debug(`handleSendDm: ${toId.value}`);

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

    const blockedIdList = relationship?.isBlock ? [toId.value] : [];

    const channelId = result.data!.channelId;

    const eventName = GateWayEvents.DirectMessage;

    const data: MessageWithMemberDto = result.data!;

    this.handleUserJoinChannel(
      ChannelRoomType.DM,
      idOf(channelId),
      idOf(userId),
    );
    this.handleUserJoinChannel(ChannelRoomType.DM, idOf(channelId), toId);

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

    const data = result.data!;

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

    const eventName = GateWayEvents.Leave;
    const data: LeavingChannelResponseDto = result.data!;
    this.broadcastToChannel(type, channelId, [], eventName, {
      type: eventName,
      data,
    });

    this.handleUserLeaveChannel(type, channelId, idOf(userId));
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

    const data: ChangeMemberStatusResultDto = result.data!;

    this.broadcastToChannel(type, channelId, [], eventName, {
      type: eventName,
      data,
    }); // 채널에 통보

    if ([ChangeActionType.BANNED, ChangeActionType.KICK].includes(actionType)) {
      this.removeUserFromChannel(
        this.channels[type][channelId.value],
        idOf(toId.value),
      ); // BAN or KICK => 채널에서 나가짐 반영
    }
  }

  handleUserJoinChannel(
    type: ChannelRoomType,
    channelId: ChannelId,
    userId: UserId,
  ) {
    if (!(channelId.value in this.channels[type])) {
      this.channels[type][channelId.value] = new Set();
    }
    const isNewUser = !this.channels[type][channelId.value].has(userId.value);
    this.channels[type][channelId.value].add(userId.value);
    return isNewUser;
  }

  handleUserLeaveChannel(
    type: ChannelRoomType,
    channelId: ChannelId,
    userId: UserId,
  ) {
    const newUserOut =
      channelId.value in this.channels[type] &&
      this.channels[type][channelId.value].has(userId.value);
    if (newUserOut) {
      this.channels[type][channelId.value].delete(userId.value);
    }
    return newUserOut;
  }

  handleNotificationToUser(userId: UserId, data: any) {
    const eventName = GateWayEvents.Notification;
    this.broadcastToUserClients(userId, eventName, data);
  }

  onJoinByApi(
    type: ChannelRoomType,
    channelId: ChannelId,
    userId: UserId,
    data: JoinedChannelInfoDto,
  ) {
    const isNewUser = this.handleUserJoinChannel(type, channelId, userId);

    if (isNewUser) {
      const eventName = GateWayEvents.Join;
      this.broadcastToChannel(type, channelId, [], eventName, {
        type: eventName,
        data,
      });
    }
  }

  onLeaveByApi(
    type: ChannelRoomType,
    channelId: ChannelId,
    userId: UserId,
    data: LeavingChannelResponseDto,
  ) {
    const newUserOut = this.handleUserLeaveChannel(type, channelId, userId);

    if (newUserOut) {
      const eventName = GateWayEvents.Leave;
      this.broadcastToChannel(type, channelId, [], eventName, {
        type: eventName,
        data,
      });
    }
  }

  onKickBanPromoteByApi(
    type: ChannelRoomType,
    channelId: ChannelId,
    userId: UserId,
    actionType: ChangeActionType,
    data: ChangeMemberStatusResultDto,
  ) {
    let isNeedBroadCast = true;
    if ([ChangeActionType.BANNED, ChangeActionType.KICK].includes(actionType)) {
      const newUserOut = this.handleUserLeaveChannel(type, channelId, userId);
      isNeedBroadCast = newUserOut;
    }
    this.logger.debug(`kickbanpromote 브로드캐스트 여부: ${isNeedBroadCast}`);
    if (isNeedBroadCast) {
      const eventName = GateWayEvents.KickBanPromote;
      this.broadcastToChannel(type, channelId, [], eventName, {
        type: eventName,
        data: {
          ...data,
          actionType,
        },
      });
    }
  }

  private getAllOnlineUsers = () => {
    return Array.from(this.socketMap.entries())
      .filter(([_userId, sockets]) => sockets.length)
      .map(([userId, _sockets]) => userId);
  };
  private getUserStatus = (id: UserId): EnumUserStatus => {
    // TODO: 이것으로 게임상태 표현으로 충분한지.
    const isUserOnline = !!this.socketMap.get(id.value)?.length;
    const isOnGame = isUserOnline && this.pongMap.has(id.value);
    return isOnGame
      ? EnumUserStatus.ONGAME
      : isUserOnline
      ? EnumUserStatus.ONLINE
      : EnumUserStatus.OFFLINE;
  };
  private addClientAtSocketMap(client: UserSocket) {
    const userId = client.data.userId as string;
    const sockets: UserSocket[] = this.socketMap.get(userId) ?? [];
    if (sockets.length === 0) {
      this.notiUserOn(userId);
    }
    this.socketMap.set(userId, [...sockets, client]);
    this.logger.debug(
      `addClientAtSocketMap(${userId}): ${this.socketMap.get(userId)?.length}`,
    );
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
    this.logger.log(`blockedIdList: ${blockedIdList}`);
    this.logger.log(this.getChannelArray(type, channelId));
    this.getChannelArray(type, channelId)
      ?.filter((userId) => !blockedIdList.includes(userId))
      .forEach((userId) =>
        this.broadcastToUserClients(idOf(userId), eventName, data),
      );
  }
  private broadcastToUserClients(userId: UserId, eventName: string, data: any) {
    this.logger.debug(`broadcastToUserClients: ${userId.value}, ${eventName}`);
    this.socketMap
      .get(userId.value)
      ?.forEach((client) => client.emit(eventName, data));
  }
  private broadcastAll(eventName: string, data: any) {
    this.server.emit(eventName, data);
  }
  private notiUserStatusUpdate(status: string, userId: string) {
    this.broadcastAll(GateWayEvents.UserStatus, { status, userId });
  }
  private notiUserOn(userId: string) {
    this.notiUserStatusUpdate(EnumUserStatus.ONLINE, userId);
  }
  private notiUserOff(userId: string) {
    this.notiUserStatusUpdate(EnumUserStatus.OFFLINE, userId);
  }
  private notiUserGame(userId: string) {
    this.notiUserStatusUpdate(EnumUserStatus.ONGAME, userId);
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

  /*
   * 게임 코드 영역
   */
  tryMatch(client: UserSocket, itemMode: boolean) {
    const userId = client.data.userId as string;

    if (this.pongMap.has(userId) || this.readyUsers.has(userId)) {
      this.logger.log(
        `tryMatch 실패: on게임 || on대기열(초대상태 포함) ${[
          this.pongMap.has(userId),
          this.readyUsers.has(userId),
        ]}`,
      );
      client.emit('GoPong', {
        ok: false,
        msg: '게임중이거나 이미 대기열(초대상태 포함)에 있습니다.',
        clientIds: [client.id],
      });
      return; // 이미 게임중이거나, 대기열에있음 (초대 포함)
    }

    this.logger.log(`tryMatch 등록: ${client.id}`);

    this.readyUsers.set(userId, client);
    const q = itemMode ? this.itemMatchQueue : this.normalMatchQueue;
    q.add(client);

    if (q.size >= 2) {
      this.logger.debug(`${itemMode ? 'itemGame' : 'normalGame'} Matched!`);

      const playersIterator = q.values();
      const player1 = playersIterator.next().value;
      const player2 = playersIterator.next().value;

      this.createGameRoom(player1, player2, itemMode);
    }
  }

  private async alarmInvited(
    myId: UserId,
    friendId: UserId,
    isItemMode: boolean,
  ) {
    const eventName = 'newGameInvitaion';
    const prismaUser = await this.prismaService.user.findUnique({
      where: { id: friendId.value },
    });

    const myPrismaUser = await this.prismaService.user.findUnique({
      where: { id: myId.value },
    });

    if (!prismaUser || !myPrismaUser) {
      // error
      this.logger.error(`alarmInvited: 유저 조회 실패`);
      return;
    }

    await this.notificationService.create(
      friendId,
      JSON.stringify({
        type: eventName,
        sourceId: myId.value,
        sourceName: myPrismaUser.nickname,
        mode: isItemMode ? 'item' : 'normal',
      }),
    );

    const data = {
      nickname: myPrismaUser.nickname,
      mode: isItemMode ? 'item' : 'normal',
    };
    this.broadcastToUserClients(friendId, 'noti', data);
  }

  handleInviteMatch(client: UserSocket, friendId: string, isItemMode: boolean) {
    const userId = client.data.userId as string;
    const eventName = isItemMode ? 'invitedItemMatch' : 'invitedNormalMatch';
    const mode = isItemMode ? 'item' : 'normal';

    console.log('handleInviteMatch', userId, friendId, eventName, mode);

    if (this.pongMap.has(userId) || this.readyUsers.has(userId)) {
      this.logger.log(
        `tryMatch 실패: on게임 || on대기열(초대상태 포함) ${[
          this.pongMap.has(userId),
          this.readyUsers.has(userId),
        ]}`,
      );
      client.emit('failToInvite', {
        msg: '이미 게임중이거나 대기열에 있습니다.(초대상태 포함)',
      });
      return; // 이미 게임중이거나, 대기열에있음
    }

    if (this.pongMap.has(friendId)) {
      client.emit('failToInvite', {
        msg: '해당 유저는 이미 게임중입니다.', // 대기열에 포함된 상대에게의 초대까지는 허용.
      });
      return;
    }

    const friendSockets = this.socketMap.get(friendId);
    if (!friendSockets || friendSockets.length === 0) {
      client.emit('failToInvite', { msg: '친구가 오프라인이에요 ㅠ' });
      return; // 오프라인도 당연히 불허
    }

    this.logger.log(`handleInviteMatch 등록: ${client.id}`);
    // 기다리기 시작, 해당 유저의 모든 소켓에 알림 전달됨.
    client.emit('waitingFriend');
    this.alarmInvited(idOf(userId), idOf(friendId), isItemMode);

    this.readyUsers.set(userId, client);
    this.activeInvitations.set(userId, {
      inviterSocket: client,
      inviteeId: friendId,
      isItemMode,
    });
  }

  handleCancelInvite(client: UserSocket) {
    const userId = client.data.userId as string;
    const eventName = 'canceledInvite';

    const invitation = this.activeInvitations.get(userId);
    if (invitation) {
      this.activeInvitations.delete(userId);
      this.readyUsers.delete(userId);
      this.broadcastToUserClients(idOf(invitation.inviteeId), eventName, {
        userId,
      }); // 프론트에서 canceledInvite 소켓 이벤트를 사용하고 있진 않음
    }
  }

  // 매칭을 취소하거나, 게임에 들어갔을때, 큐에서 꺼내는 동작을 추상화한다.
  removeFromQueue(clients: UserSocket[], itemMode?: boolean) {
    const qs =
      itemMode === undefined
        ? [this.itemMatchQueue, this.normalMatchQueue]
        : itemMode === true
        ? [this.itemMatchQueue]
        : [this.normalMatchQueue];
    clients.forEach((client) => {
      qs.forEach((q) => q.delete(client));
      this.readyUsers.delete(client.data.userId as string);
    });
  }

  handleCancelMatch(client: UserSocket, itemMode: boolean) {
    this.removeFromQueue([client], itemMode);
  }

  handleAcceptMatch(
    client: UserSocket,
    inviterId: string,
    isItemMode: boolean,
  ) {
    const userId = client.data.userId as string;
    const invitation = this.activeInvitations.get(inviterId);
    if (!invitation) {
      client.emit('failToAccepInvitation', { msg: '만료된 초대장이에요!' });
      return; // 만료된 초대장
    }
    if (this.pongMap.has(userId) || this.readyUsers.has(userId)) {
      this.logger.log(
        `tryMatch 실패: on게임 || on대기열(초대상태 포함) ${[
          this.pongMap.has(userId),
          this.readyUsers.has(userId),
        ]}`,
      );
      client.emit('failToAccepInvitation', {
        msg: '이미 게임중이거나 대기열에 있습니다.(초대상태 포함)',
      });
      return; // 이미 게임중이거나, 대기열에있음
    }
    this.activeInvitations.delete(inviterId);
    this.readyUsers.delete(inviterId);
    this.createGameRoom(client, invitation.inviterSocket, isItemMode);
  }

  private async fetchPlayerInfo(
    playerId: string,
  ): Promise<{ nickname: string; avatarUrl: string }> {
    try {
      const prismaUser = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: playerId,
        },
      });
      return {
        nickname: prismaUser.nickname,
        avatarUrl: prismaUser.profileImageUrl ?? '',
      };
    } catch (error) {
      console.error('플레이어 정보를 가져오는 데 실패했습니다:', error);
      return {
        nickname: 'player',
        avatarUrl: '../frontend/public/avatar/avartar-black.svg',
      };
    }
  }

  private async emitPlayerInfo(
    player1Id: string,
    player2Id: string,
    roomName: string,
  ) {
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
    const roomName = uuidv4();
    player1.join(roomName);
    player2.join(roomName);

    // 클라이언트가 준비되면 게임 초기화
    const player1Id = player1.data.userId as string;
    const player2Id = player2.data.userId as string;

    const player1SocketId = player1.id;
    const player2SocketId = player2.id;

    this.server.to(roomName).emit('GoPong', {
      ok: true,
      msg: '룸생성',
      clientIds: [player1SocketId, player2SocketId],
    });

    // playerRole 알림
    this.server.to(player1.id).emit('playerRole', 'player1');
    this.server.to(player2.id).emit('playerRole', 'player2');

    // Pong 인스턴스 생성
    const pong = new Pong(
      this.prismaService,
      player1Id,
      player2Id,
      player1SocketId,
      player2SocketId,
      mode,
      (data: {
        player1Id: UserId;
        player2Id: UserId;
        player1Score: number;
        player2Score: number;
        isPlayer1win: boolean;
      }) => {
        this.endGame(data);
        this.handleOffGame(data.player1Id);
        this.handleOffGame(data.player2Id);
      },
    );

    // 1. 먼저 pongMap에 각각 set한다.
    this.handleOnGame(idOf(player1Id), pong);
    this.handleOnGame(idOf(player2Id), pong);

    // 2. 게임에 참여하게 된 각 유저를 큐와 대기 유저 목록에서 제거한다.
    this.removeFromQueue([player1, player2], mode);

    player1.on('clientReady', (gameState: GameState) => {
      this.emitPlayerInfo(player1Id, player2Id, roomName);
      player1.emit('gameUpdate', gameState);
    });

    player2.on('clientReady', (gameState: GameState) => {
      this.emitPlayerInfo(player1Id, player2Id, roomName);
      player2.emit('gameUpdate', gameState);
    });

    let cancelGame = false;
    let startGame = false;
    setTimeout(() => {
      if (cancelGame) {
        console.log('Game canceled');
        return;
      }
      if (!startGame) {
        startGame = true;
      }
      console.log('Game starting...');
      pong.startGameLoop();
    }, 3000);

    pong.onGameUpdate.on('gameState', (gameState: GameState) => {
      player1.emit('gameUpdate', gameState);
      player2.emit('gameUpdate', gameState);
    });

    player1.on('leaveGameBoard', async () => {
      cancelGame = true;
      const gameState = pong.getGameState();
      if (!gameState.gameOver) {
        gameState.score2 = GAME_OVER;
        player2.emit('gameUpdate', gameState);
        if (!startGame) {
          await this.storeGameStateToDB(gameState, pong);
          startGame = true;
        }
      }
    });

    player2.on('leaveGameBoard', async () => {
      cancelGame = true;
      const gameState = pong.getGameState();
      if (!gameState.gameOver) {
        gameState.score1 = GAME_OVER;
        player1.emit('gameUpdate', gameState);
        if (!startGame) {
          await this.storeGameStateToDB(gameState, pong);
          startGame = true;
        }
      }
    });
  }

  handlePaddleMove(client: UserSocket, directionIsUp: boolean) {
    const userId = client.data.userId as string | undefined;

    if (userId === undefined) {
      this.logger.error(`paddleMove시 userId가 없음: ${userId}`);
      return;
    }
    const inGame = this.pongMap.get(userId);

    if (inGame === undefined) {
      this.logger.error(
        `paddleMove시 userId에 해당하는 pong이 없음: ${userId}`,
      );
      return;
    }

    if (!inGame.getGameState().gameStart) {
      return;
    }
    const isPlayer1 = userId === inGame.player1Id;
    inGame.handlePaddleMove(directionIsUp, isPlayer1);
  }

  private handleOnGame(id: UserId, pong: Pong) {
    this.pongMap.set(id.value, pong);
    this.notiUserStatusUpdate(EnumUserStatus.ONGAME, id.value);
  }

  private handleOffGame(id: UserId) {
    this.pongMap.delete(id.value);
    this.notiUserStatusUpdate(this.getUserStatus(id), id.value);
  }

  private async storeGameStateToDB(
    gameState: GameState,
    pong: Pong,
  ): Promise<void> {
    try {
      await this.endGame({
        player1Id: idOf(pong.player1Id),
        player2Id: idOf(pong.player2Id),
        player1Score: gameState.score1,
        player2Score: gameState.score2,
        isPlayer1win: gameState.score1 > gameState.score2,
      });
      this.logger.log('Game state saved to DB');
    } catch (error) {
      this.logger.error('Failed to save game state to DB:', error);
    }
  }

  async removeClientFromQueueOrInvitationOrGame(client: UserSocket) {
    const userId = client.data.userId as string;
    const clientId = client.id;
    const readyUserClient = this.readyUsers.get(userId);
    const pongGame = this.pongMap.get(userId);
    const invitation = this.activeInvitations.get(userId);

    this.logger.verbose(`사라져라.... ${client.data.userId}`);
    this.logger.verbose(`readyUserClient ${readyUserClient}`);
    this.logger.verbose(`pongGame ${pongGame}`);
    this.logger.verbose(`invitation ${invitation}`);

    if (readyUserClient?.id === clientId) {
      // 대기열에서 내보내기
      this.removeFromQueue([readyUserClient]);
      this.logger.verbose(`대기열에서 내보니기 성공`);
    } else if (invitation?.inviterSocket?.id === clientId) {
      // 초대장 끝내기
      this.logger.verbose(`초대장 끝내야함`);
    } else if (
      [pongGame?.player1SocketId, pongGame?.player2SocketId].includes(clientId)
    ) {
      await this.finalizeGame(client);
    }
  }

  async finalizeGame(client: UserSocket) {
    // 1. leaveGameBoard 수신시
    // 2. handleDisconnect 이벤트시
    // client의 패배로 결정
    const userId = client.data.userId as string;
    const cliendId = client.id;
    const pong = this.pongMap.get(client.data.userId);

    if (
      pong === undefined ||
      ![pong.player1SocketId, pong.player2SocketId].includes(cliendId)
    ) {
      return; // 해당 소켓이 진행중이던 게임 없음
    }

    if (!pong.getGameState().gameStart) {
      pong.setGameStart();
    }

    const isPlayer1win = userId !== pong.player1Id;
    pong.setGameOver(isPlayer1win, true);

    this.logger.verbose(`finalizeGame 성공: isPlayer1win is ${isPlayer1win}`);

    // 상대방에게 연결종료 알림
    const opponentSocketId =
      pong.player1SocketId === cliendId
        ? pong.player2SocketId
        : pong.player1SocketId;
    this.server.to(opponentSocketId).emit('opponentDisconnected');
    console.log('opponentId', opponentSocketId);

    this.pongMap.delete(pong.player1Id);
    this.pongMap.delete(pong.player2Id);
  }

  async endGame(data: {
    player1Id: UserId;
    player2Id: UserId;
    player1Score: number;
    player2Score: number;
    isPlayer1win: boolean;
  }) {
    await this.pongLogService.create(
      data.player1Id,
      data.player2Id,
      data.player1Score,
      data.player2Score,
      data.isPlayer1win,
    );
  }

  handleUserStatusRequest(client: UserSocket, targetUserId: UserId) {
    client.emit(GateWayEvents.UserStatus, {
      status: this.getUserStatus(targetUserId),
      userId: targetUserId.value,
    });
  }

  debugData() {
    this.logger.error('-------------tryMatch 디버깅---------');
    this.logger.error('pongMap');
    this.logger.verbose([...this.pongMap.keys()]);
    this.logger.error('readyUsers');
    this.logger.verbose([...this.readyUsers.keys()]);
    this.logger.error('=====================================');
  }

  noti(id: UserId, data: any) {
    const eventName = 'noti';
    this.broadcastToUserClients(id, eventName, data);
  }
}
