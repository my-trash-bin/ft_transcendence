// gameSocket.ts
import { io, Socket } from 'socket.io-client';

let gameSocket: Socket | null = null;

export function getGameSocket(): Socket {
  if (!gameSocket) {
    gameSocket = io('http://localhost:80', { 
      withCredentials: true
    });
  }

  return gameSocket;
}
