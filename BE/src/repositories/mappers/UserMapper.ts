import { DbBool, User, UserRole } from '../../types';
import { nullable, toFlag } from './MapperHelpers';

export interface UserRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  avatarUrl: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

export const toUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: nullable(row.phone),
  avatar_url: nullable(row.avatarUrl),
  role: row.role,
  is_active: toFlag(row.isActive) as DbBool,
  created_at: row.createdAt,
  updated_at: row.updatedAt,
});

export const toUserWithPassword = (row: UserRow): UserWithPassword => ({
  ...toUser(row),
  password: row.password,
});
