import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../types';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket: Socket<SocketEvents> | null = null;

export function getSocket(): Socket<SocketEvents> {
  if (!socket) {
    const token = localStorage.getItem('token');
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      auth: {
        token,
      },
    }) as unknown as Socket<SocketEvents>;
  }
  return socket as Socket<SocketEvents>;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
