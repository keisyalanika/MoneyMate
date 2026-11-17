import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { AppError } from '../errors/AppError';

export const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');
export const AVATAR_DIR = path.join(UPLOADS_ROOT, 'avatars');

fs.mkdirSync(AVATAR_DIR, { recursive: true });

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    const userId = (req as unknown as { user?: { id?: number } }).user?.id ?? 'unknown';
    const ext = EXTENSIONS[file.mimetype] ?? path.extname(file.originalname) ?? '.jpg';
    cb(null, `user-${userId}-${Date.now()}${ext}`);
  },
});

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      cb(AppError.badRequest('Foto harus berformat JPG, PNG, atau WEBP.', 'INVALID_FILE_TYPE'));
      return;
    }
    cb(null, true);
  },
});
