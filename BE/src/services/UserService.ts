import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories';
import { User } from '../types';

export class UserService {
  constructor(private readonly users = userRepository) {}

  /** GET all users (admin) */
  getAllUsers() {
    return this.users.findAll();
  }

  /** GET user by ID */
  getUserById(id: number) {
    return this.users.findById(id);
  }

  /** GET user by email (dipakai auth) */
  getUserByEmail(email: string) {
    return this.users.findByEmail(email);
  }

  /** CREATE user (register) */
  async createUser(data: { name: string; email: string; password: string; phone?: string | null }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.users.create({
      name: data.name,
      email: data.email,
      passwordHash,
      phone: data.phone,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  /** UPDATE user profile */
  updateUser(id: number, data: { name?: string; phone?: string | null; avatar_url?: string | null }) {
    return this.users.update(id, data);
  }

  /** TOGGLE user active status (admin) */
  toggleUserActive(id: number, isActive: boolean) {
    return this.users.setActive(id, isActive);
  }

  /** DELETE user (admin) */
  deleteUser(id: number) {
    return this.users.remove(id);
  }

  /** COUNT users */
  countUsers() {
    return this.users.count();
  }

  /** CHANGE password */
  async changePassword(id: number, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.users.setPassword(id, passwordHash);
  }
}

export const userService = new UserService();
