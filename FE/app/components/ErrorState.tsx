import React from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Terjadi kesalahan koneksi saat memuat data dari server SIAKAD.',
  onRetry
}) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3 my-4">
      <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-lg mx-auto">
        ⚠️
      </div>
      <h3 className="font-bold text-xs text-rose-900">Gagal Memuat Data</h3>
      <p className="text-xs text-rose-700 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-1.5 bg-rose-800 hover:bg-rose-900 text-white text-xs font-bold rounded-xl shadow"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
};
