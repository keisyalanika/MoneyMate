import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json({
      status: 'success',
      data: users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '-',
        role: u.role || 'user',
        status: u.is_active ? 'Aktif' : 'Nonaktif',
        userId: `USR-${String(u.id).padStart(3, '0')}`,
        created_at: u.created_at
      }))
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ status: 'error', message: 'Nama dan email wajib diisi.' });
    }

    const created = await userService.createUser({
      name,
      email,
      password: password || 'MoneyMate123!',
      phone: phone || null
    });

    res.status(201).json({
      status: 'success',
      message: 'Pengguna baru berhasil ditambahkan ke database',
      data: created
    });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
