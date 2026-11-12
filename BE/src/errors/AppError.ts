/**
 * Error operasional aplikasi.
 * Dilempar dari service/controller, lalu diformat oleh global error handler.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly isOperational = true;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  static badRequest(message: string, code = 'BAD_REQUEST', details?: unknown) {
    return new AppError(message, 400, code, details);
  }

  static unauthorized(message = 'Tidak terautentikasi.', code = 'UNAUTHORIZED', details?: unknown) {
    return new AppError(message, 401, code, details);
  }

  static forbidden(message = 'Akses ditolak.', code = 'FORBIDDEN', details?: unknown) {
    return new AppError(message, 403, code, details);
  }

  static notFound(message = 'Data tidak ditemukan.', code = 'NOT_FOUND', details?: unknown) {
    return new AppError(message, 404, code, details);
  }

  static conflict(message: string, code = 'CONFLICT', details?: unknown) {
    return new AppError(message, 409, code, details);
  }

  static unprocessable(message: string, code = 'UNPROCESSABLE_ENTITY', details?: unknown) {
    return new AppError(message, 422, code, details);
  }

  static internal(message = 'Terjadi kesalahan pada server.', code = 'INTERNAL_ERROR', details?: unknown) {
    return new AppError(message, 500, code, details);
  }
}

export const isAppError = (error: unknown): error is AppError => error instanceof AppError;
