import { NextFunction, Request, Response } from 'express';
import { AppError, isAppError } from '../errors/AppError';
import { mapPrismaError } from '../errors/PrismaErrorMapper';
import { AppBaseResponse } from '../responses/AppBaseResponse';
import { NODE_ENV } from '../config/constants';

/** Handler 404 untuk route yang tidak cocok dengan router mana pun. */
export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(
    AppError.notFound(
      `Route ${req.method} ${req.originalUrl} tidak ditemukan.`,
      'ROUTE_NOT_FOUND'
    )
  );
};

const isJsonSyntaxError = (error: unknown): boolean => {
  return (
    error instanceof SyntaxError &&
    'body' in (error as unknown as Record<string, unknown>)
  );
};

/**
 * Global error handler.
 * Wajib 4 argumen agar Express mengenalinya sebagai error middleware.
 */
export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(error);
  }

  if (isJsonSyntaxError(error)) {
    return AppBaseResponse.error(res, 'Format JSON pada request tidak valid.', 400, 'INVALID_JSON');
  }

  if ((error as { name?: string })?.name === 'MulterError') {
    const code = (error as { code?: string }).code ?? 'UPLOAD_ERROR';
    const message =
      code === 'LIMIT_FILE_SIZE'
        ? 'Ukuran foto maksimal 5 MB.'
        : 'Upload foto gagal. Periksa kembali file yang dipilih.';
    return AppBaseResponse.error(res, message, 400, code);
  }

  const appError: AppError | null = isAppError(error)
    ? error
    : mapPrismaError(error);

  if (appError) {
    return AppBaseResponse.error(
      res,
      appError.message,
      appError.statusCode,
      appError.code,
      appError.details
    );
  }

  const err = error as Error;
  console.error('[UNHANDLED ERROR]', err?.stack || err);

  const message =
    NODE_ENV === 'production' ? 'Terjadi kesalahan pada server.' : err?.message || 'Terjadi kesalahan pada server.';

  return AppBaseResponse.error(res, message, 500, 'INTERNAL_ERROR');
};
