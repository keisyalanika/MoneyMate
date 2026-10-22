import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { PORT } from './config/constants';

const primaryPort = Number(PORT) || 5000;

const startServer = (port: number) => {
  const server = app.listen(port, () => {
    console.log(`===============================================`);
    console.log(`🚀 MoneyMate API Server running on port ${port}`);
    console.log(`🌐 Base URL: http://localhost:${port}/api`);
    console.log(`📋 Documentation: /docs/API.md`);
    console.log(`===============================================`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE' && port === 5000) {
      console.warn(`⚠️  Port 5000 is occupied (e.g. by macOS AirPlay Receiver).`);
      console.log(`🔄 Automatically falling back to Port 5001...`);
      startServer(5001);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(primaryPort);
