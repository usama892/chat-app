
/*import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') },
});

socket.on('connect_error', (err) => {
  console.error('Socket connect failed:', err.message);
});
*/
// src/utils/socket.js
import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

export const socket = io('http://localhost:5000', {
  auth: {
    token: token,
  },
});


