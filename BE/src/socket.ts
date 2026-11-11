import http from 'http';

let io: any = null;

export const initSocket = (server: http.Server) => {
  try {
    // Dynamic import to avoid build errors when socket.io package is not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Server } = require('socket.io');
    io = new Server(server, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
    });
    io.on('connection', (socket: any) => {
      const userId = socket.handshake?.query?.userId as string;
      if (userId) socket.join(`user-${userId}`);
    });
    console.log('📡 Real-time Socket service initialized');
  } catch (err: any) {
    console.warn('⚠️ socket.io package not found, real-time push disabled (falling back to REST sync):', err.message);
  }
};

export const emitBalance = (userId: number, balance: number) => {
  if (io) {
    try {
      io.to(`user-${userId}`).emit('balanceUpdated', { balance });
    } catch (_) { }
  }
};

export const emitGoal = (userId: number, goal: any) => {
  if (io) {
    try {
      io.to(`user-${userId}`).emit('goalChanged', goal);
    } catch (_) { }
  }
};

export const emitBudget = (userId: number, budget: any) => {
  if (io) {
    try {
      io.to(`user-${userId}`).emit('budgetChanged', budget);
    } catch (_) { }
  }
};

export const emitNotification = (userId: number, notification: any) => {
  if (io) {
    try {
      io.to(`user-${userId}`).emit('notification', notification);
    } catch (_) { }
  }
};
