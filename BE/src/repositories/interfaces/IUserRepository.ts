import { User, UserRole } from '../../types';
import { UserWithPassword } from '../mappers/UserMapper';

export interface UserWithBalance extends User {
  saldo: number;
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role?: UserRole;
}

export interface UpdateUserData {
  name?: string;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface IUserRepository {
  findAll(): Promise<UserWithBalance[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<UserWithPassword | null>;
  create(data: CreateUserData): Promise<User>;
  update(id: number, data: UpdateUserData): Promise<User | null>;
  setActive(id: number, isActive: boolean): Promise<User | null>;
  setPassword(id: number, passwordHash: string): Promise<void>;
  remove(id: number): Promise<boolean>;
  count(): Promise<number>;
}
