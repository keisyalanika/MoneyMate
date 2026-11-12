import { Response } from 'express';

export type AppMeta = Record<string, unknown>;

/**
 * Formatter response API.
 * Semua controller memakai class ini agar bentuk response seragam:
 * { success, message, data } (+ field tambahan bila perlu).
 */
export class AppBaseResponse {
  /** 200 - response sukses standar. `extra` untuk field root tambahan (mis. totalBalance). */
  static success<T>(res: Response, data: T, message = 'Success', extra?: AppMeta) {
    return res.status(200).json({
      success: true,
      message,
      data,
      ...(extra ?? {}),
    });
  }

  /** 201 - resource berhasil dibuat. */
  static created<T>(res: Response, data: T, message = 'Created successfully') {
    return res.status(201).json({ success: true, message, data });
  }

  /** 200 - resource berhasil diperbarui. */
  static updated<T>(res: Response, data: T, message = 'Updated successfully') {
    return res.status(200).json({ success: true, message, data });
  }

  /** 200 - resource berhasil dihapus (tanpa payload data). */
  static deleted(res: Response, message = 'Deleted successfully') {
    return res.status(200).json({ success: true, message });
  }

  /** Error terformat (biasanya dipanggil global error handler). */
  static error(
    res: Response,
    message: string,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    details?: unknown
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      code,
      ...(details !== undefined ? { details } : {}),
    });
  }

  /**
   * Kirim payload apa adanya (tanpa envelope).
   * Dipakai endpoint legacy yang kontraknya flat, mis. `/auth/login`
   * yang mengembalikan `{ id, name, role, token }` di root.
   */
  static raw<T extends object>(res: Response, payload: T, statusCode = 200) {
    return res.status(statusCode).json(payload);
  }
}
