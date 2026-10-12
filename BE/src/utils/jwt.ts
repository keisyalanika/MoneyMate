import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';

export const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d',
  });
};
