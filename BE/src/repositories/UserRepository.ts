import { Prisma } from '../generated/prisma/client';
import { User } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { CreateUserData, IUserRepository, UpdateUserData, UserWithBalance } from './interfaces/IUserRepository';
import { toNumber } from './mappers/MapperHelpers';
import { toUser, toUserWithPassword, UserWithPassword } from './mappers/UserMapper';

export class UserRepository extends BaseRepository implements IUserRepository {
  async findAll(): Promise<UserWithBalance[]> {
    const users = await this.db.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { wallets: { select: { balance: true } } },
    });

    return users.map((user) => ({
      ...toUser(user),
      saldo: user.wallets.reduce((sum, wallet) => sum + toNumber(wallet.balance), 0),
    }));
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { id } });
    return user ? toUser(user) : null;
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await this.db.user.findUnique({ where: { email } });
    return user ? toUserWithPassword(user) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const user = await this.db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        phone: data.phone ?? null,
        role: data.role ?? 'student',
      },
    });
    return toUser(user);
  }

  async update(id: number, data: UpdateUserData): Promise<User | null> {
    const payload: Prisma.UserUpdateInput = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.phone !== undefined) payload.phone = data.phone;
    if (data.avatar_url !== undefined) payload.avatarUrl = data.avatar_url;

    if (Object.keys(payload).length === 0) return null;

    try {
      const user = await this.db.user.update({ where: { id }, data: payload });
      return toUser(user);
    } catch {
      return null;
    }
  }

  async setActive(id: number, isActive: boolean): Promise<User | null> {
    try {
      const user = await this.db.user.update({ where: { id }, data: { isActive } });
      return toUser(user);
    } catch {
      return null;
    }
  }

  async setPassword(id: number, passwordHash: string): Promise<void> {
    await this.db.user.update({ where: { id }, data: { password: passwordHash } });
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.db.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  count(): Promise<number> {
    return this.db.user.count();
  }
}
