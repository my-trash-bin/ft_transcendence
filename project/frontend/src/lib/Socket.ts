// socketManager.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io('http://localhost:60080', {
      query: {
        username: 'test',
      },
      reconnectionAttempts: 0,
    });
  }

  return socket;
}
