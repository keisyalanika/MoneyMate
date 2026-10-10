import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
}

// Dummy data for testing
const generateHash = (password: string) => bcrypt.hashSync(password, 10);

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@moneymate.com',
    passwordHash: generateHash('admin123'),
    role: 'admin',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@moneymate.com',
    passwordHash: generateHash('user123'),
    role: 'user',
  }
];
