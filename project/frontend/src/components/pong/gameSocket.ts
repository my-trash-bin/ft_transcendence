// gameSocket.ts
import { getSocket } from '@/lib/Socket';
// import { io, Socket } from 'socket.io-client';

// let gameSocket: Socket | null = null;

export function getGameSocket(){
// export function getGameSocket(): Socket {
  // if (!gameSocket) {
  //   gameSocket = io('http://localhost:80', { 
  //     reconnectionAttempts: 0,
  //     withCredentials: true
  //   });
  // }

  // return gameSocket;
  return getSocket();
}
