import { io } from 'socket.io-client';
import config from '../config/index.js';

let socket = null;

/**
 * Initialize Socket.io connection
 * @param {string} token - JWT token for authentication
 */
export const initSocket = (token) => {
  if (socket) {
    return socket;
  }

  socket = io(config.socket.url, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

/**
 * Disconnect Socket.io
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get current socket instance
 */
export const getSocket = () => {
  return socket;
};

