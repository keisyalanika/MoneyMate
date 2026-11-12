import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import { PORT } from './config/constants';
import { initSocket } from './socket';

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 MoneyMate API Server running on port ${PORT}`);
  console.log(`🌐 Endpoint: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
