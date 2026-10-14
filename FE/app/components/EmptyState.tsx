import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak Ada Data Ditemukan',
  description = 'Belum ada entri catatan finansial yang tersimpan dalam sistem saat ini.',
  onAction,
  actionText = 'Segarkan Data'
}) => {
  return (
    <div className="bg-white border border-[#E5DDD8] rounded-2xl p-8 shadow-xs text-center space-y-3 my-4">
      <div className="w-12 h-12 rounded-2xl bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] font-bold flex items-center justify-center text-xl mx-auto">
        📭
      </div>
      <h3 className="font-extrabold text-sm text-[#2D2825]">{title}</h3>
      <p className="text-xs text-[#8C7A70] max-w-md mx-auto">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
