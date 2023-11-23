import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(80, {
  cors: { origin: 'http://localhost:53000', credentials: true },
})
@Injectable()
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    try {
      console.log(client.handshake.headers.cookie);
      if (client.handshake.headers.cookie === undefined) {
        throw new WsException('인증을 위해 쿠키 필수입니다.');
      }
      const jwt = this.getCookie(client.handshake.headers.cookie, 'jwt');
      if (jwt === null) {
        throw new WsException('jwt 토큰이 쿠키에 없습니다.');
      }
      const secret = this.configService.getOrThrow<string>('JWT_SECRET');
      console.log('decoded');
      const decoded = this.jwtService.verify(jwt, { secret });
      console.log(decoded);
      // {
      //   phase: 'complete',
      //   id: { value: 'f2e26329-8209-4d33-869b-de72ec8cf46a' },
      //   iat: 1700626642,
      //   exp: 1700713042
      // }
      console.log('인증 성공');
      // 여기서 인증된 사용자에 대한 로직 처리
    } catch (error) {
      let msg = 'Unknown Error';
      if (error instanceof WsException) {
        msg = error.message;
      }
      client.emit('exception', { msg });
      console.log(`인증 실패: ${msg}`);
      client.disconnect(); // 인증 실패 시 연결 종료
    }
  }

  // 사용자가 채팅방에 참여할 때
  @SubscribeMessage('JOIN')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;
    console.log(
      `Client ${
        client.id
      } joined room ${roomId}. data: ${typeof data}, ${data}`,
    );
    if (roomId) {
      console.log('전파');
      client.join(roomId);
      this.server
        .to(roomId)
        .emit('notification', `User ${client.id} has joined the room.`);
    }
  }

  // 사용자가 채팅방에서 나갈 때
  @SubscribeMessage('LEAVE')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId } = data;

    console.log(`Client ${client.id} left room ${roomId}`);

    if (roomId) {
      client.leave(roomId);
      this.server
        .to(roomId)
        .emit('notification', `User ${client.id} has left the room.`);
    }
  }

  // 채팅 메시지 처리 (예시)
  @SubscribeMessage('SEND')
  handleChatMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { roomId, message } = data;
    this.server.to(roomId).emit('chatMessage', { userId: client.id, message });
  }

  @SubscribeMessage('ECHO') // 아래 처럼 받을 수도
  handleMessage(
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
}

// @SubscribeMessage('events') // 메시지 구독 시작
// findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
//   return from([1, 2, 3]).pipe(
//     map((item) => ({ event: 'events', data: item })),
//   );
// }

// @SubscribeMessage('identity')
// async identity(@MessageBody() data: number): Promise<number> {
//   return data;
// }

// @SubscribeMessage('whaami') // 아래 처럼 받을 수도
// async sample(@MessageBody('id') id: number): Promise<number> {
//   return id;
// }
