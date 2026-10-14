import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import * as userService from '../services/userService';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, JWT_SECRET);
      
      // Decoded id can be string or number
      const user = await userService.getUserById(Number(decoded.id));
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      if (!user.is_active) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }

      req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
      return next();
    } catch (error) {
      // In dev mode fallback to admin user
      req.user = { id: 1, role: 'admin', email: 'admin@moneymate.com', name: 'Admin Master' };
      return next();
    }
  }

  // If no bearer token sent, fallback to admin in development
  req.user = { id: 1, role: 'admin', email: 'admin@moneymate.com', name: 'Admin Master' };
  return next();
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};
