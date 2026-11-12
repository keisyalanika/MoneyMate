import express from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

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

// 404 + global error handler (harus paling akhir)
app.use(notFound);
app.use(errorHandler);

export default app;
