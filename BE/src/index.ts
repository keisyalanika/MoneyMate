import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { PORT } from './config/constants';

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 MoneyMate API Server running on port ${PORT}`);
  console.log(`🌐 Endpoint: http://localhost:${PORT}/api`);
  console.log(`===============================================`);
});
