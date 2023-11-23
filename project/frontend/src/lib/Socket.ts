// socketManager.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io('http://localhost:80', {
      reconnectionAttempts: 0,
      withCredentials: true,
    });
  }

  return socket;
}
