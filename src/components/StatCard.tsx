import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  accentColor?: 'sage' | 'peach' | 'lavender' | 'forest';
  onClick?: () => void;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = 'sage',
  onClick,
  badge,
}) => {
  const colorStyles = {
    sage: 'bg-[#65866E]/10 text-[#294B3A]',
    peach: 'bg-[#F3DCCB] text-[#7A431D]',
    lavender: 'bg-[#E9E5F4] text-[#4A3E72]',
    forest: 'bg-[#294B3A]/10 text-[#294B3A]',
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-[#FFFFFF] p-5 sm:p-6 rounded-2xl border border-[#E7E9E2] shadow-xs hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-[#65866E]/40 focus:ring-2 focus:ring-[#65866E]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colorStyles[accentColor]}`}>
          {icon}
        </div>
        {badge && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F8F7F1] text-[#778078] border border-[#E7E9E2]">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="text-3xl sm:text-4xl font-extrabold text-[#26372D] tracking-tight">
          {value}
        </div>
        <div className="mt-1 text-sm sm:text-base font-semibold text-[#26372D]">
          {title}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-[#778078] line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
