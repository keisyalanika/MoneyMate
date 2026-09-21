import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { PORT } from './config/constants';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'MoneyMate Backend REST API',
    version: '1.0.0',
    documentation: '/docs/API.md'
  });
});

// API Routes
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 MoneyMate API Server running on port ${PORT}`);
  console.log(`🌐 Endpoint: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
