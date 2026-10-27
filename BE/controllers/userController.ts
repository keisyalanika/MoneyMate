import { Request, Response } from 'express';

// In-memory persistent array for users
let usersDb = [
  { id: 1, name: 'Keisya Lanika', email: 'KeisyaExaHaniyah@gmail.com', saldo: 'Rp 2.450.000', status: 'Aktif' },
  { id: 2, name: 'Bima Santoso', email: 'bima.santoso@student.ac.id', saldo: 'Rp 1.150.000', status: 'Aktif' },
  { id: 3, name: 'Aulia Rahma', email: 'aulia.r@student.ac.id', saldo: 'Rp 4.800.000', status: 'Aktif' },
  { id: 4, name: 'Rizky Aditya', email: 'rizky.a@student.ac.id', saldo: 'Rp 850.000', status: 'Aktif' },
  { id: 5, name: 'Nadia Putri', email: 'nadia.p@student.ac.id', saldo: 'Rp 3.200.000', status: 'Aktif' },
  { id: 6, name: 'Ahmad Fauzi', email: 'ahmad.fauzi@student.ac.id', saldo: 'Rp 1.750.000', status: 'Aktif' },
  { id: 7, name: 'Bambang Santoso', email: 'bambang.s@student.ac.id', saldo: 'Rp 2.100.000', status: 'Aktif' },
  { id: 8, name: 'Dewi Lestari', email: 'dewi.lestari@student.ac.id', saldo: 'Rp 3.900.000', status: 'Aktif' },
  { id: 9, name: 'Reza Hardiansyah', email: 'reza.h@student.ac.id', saldo: 'Rp 1.350.000', status: 'Aktif' }
];

export const getUsers = (req: Request, res: Response) => {
  res.json({
    status: 'success',
    data: usersDb
  });
};

export const createUser = (req: Request, res: Response) => {
  const { name, email, nim, prodi, saldo, status } = req.body;
  if (!name || !email || !nim) {
    return res.status(400).json({ status: 'error', message: 'Nama, email, dan nim wajib diisi.' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    nim,
    prodi: prodi || 'Informatika',
    saldo: saldo || 'Rp 0',
    status: status || 'Aktif'
  };

  usersDb.unshift(newUser);

  res.status(201).json({
    status: 'success',
    message: 'Pengguna baru berhasil ditambahkan ke database',
    data: newUser
  });
};
