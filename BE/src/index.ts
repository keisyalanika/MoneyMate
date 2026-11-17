import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app';
import { PORT } from './config/constants';
import { initSocket } from './socket';

const server = http.createServer(app);
initSocket(server);

const aiEnabled = Boolean(process.env.GEMINI_API_KEY) && process.env.AI_MOCK !== 'true';
const aiModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
console.log(
  `🤖 AI Chatbot: ${aiEnabled ? `Gemini aktif (model=${aiModel})` : 'mock (GEMINI_API_KEY kosong / AI_MOCK=true)'}`
);

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 MoneyMate API Server running on port ${PORT}`);
  console.log(`🌐 Endpoint: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
