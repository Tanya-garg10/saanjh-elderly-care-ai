import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-[#FFFFFF] rounded-2xl border border-dashed border-[#E7E9E2] my-4">
      <div className="p-4 bg-[#F8F7F1] rounded-2xl text-[#65866E] mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-[#26372D] mb-1">{title}</h4>
      <p className="text-sm text-[#778078] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-[#294B3A] text-white font-semibold text-sm hover:bg-[#1E372B] transition-colors shadow-xs active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
