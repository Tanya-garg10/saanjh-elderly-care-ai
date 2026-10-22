import React from 'react';
import { Medicine } from '../types';
import { useApp } from '../context/AppContext';
import { Clock, Check, RotateCcw, Edit2, Trash2, Pill } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
  onEdit?: (medicine: Medicine) => void;
  onDelete?: (medicine: Medicine) => void;
  compact?: boolean;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const { toggleMedicineTaken, language, t } = useApp();
  const isTaken = medicine.status === 'taken';

  return (
    <div
      className={`relative bg-[#FFFFFF] rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
        isTaken
          ? 'border-[#65866E]/40 bg-[#F5F8F6]'
          : 'border-[#E7E9E2] hover:border-[#65866E]/50'
      } p-5 sm:p-6`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Medicine info */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3.5 rounded-2xl shrink-0 transition-colors ${
              isTaken
                ? 'bg-[#65866E] text-white shadow-xs'
                : 'bg-[#65866E]/10 text-[#294B3A]'
            }`}
          >
            <Pill className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`text-lg sm:text-xl font-bold tracking-tight ${
                  isTaken ? 'text-[#294B3A] line-through opacity-75' : 'text-[#26372D]'
                }`}
              >
                {medicine.name}
              </h4>
              {medicine.dosage && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F8F7F1] text-[#778078] border border-[#E7E9E2]">
                  {medicine.dosage}
                </span>
              )}
              {isTaken ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#65866E]/15 text-[#294B3A]">
                  <Check className="w-3.5 h-3.5" />
                  {t('statusTaken')} {medicine.takenAt && `• ${medicine.takenAt}`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F3DCCB]/60 text-[#7A431D]">
                  <Clock className="w-3 h-3" />
                  {t('statusUpcoming')}
                </span>
              )}
            </div>

            {/* Timing */}
            <div className="flex items-center gap-2 mt-1.5 text-sm font-semibold text-[#294B3A]">
              <Clock className="w-4 h-4 text-[#65866E]" />
              <span>{medicine.reminderTime}</span>
              <span className="text-xs font-normal text-[#778078] capitalize">
                ({medicine.timeSlot})
              </span>
            </div>

            {/* User instructions */}
            {medicine.instructions && (
              <p className="mt-2 text-sm text-[#778078] leading-relaxed bg-[#F8F7F1] px-3 py-1.5 rounded-lg border border-[#E7E9E2]/60">
                {medicine.instructions}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center mt-2 sm:mt-0 w-full sm:w-auto">
          {/* Primary Action Button: Large and accessible for seniors */}
          <button
            onClick={() => toggleMedicineTaken(medicine.id)}
            aria-label={isTaken ? `Undo taken for ${medicine.name}` : `Mark ${medicine.name} as taken`}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm sm:text-base transition-all transform active:scale-95 shadow-xs focus:ring-2 focus:ring-[#65866E] ${
              isTaken
                ? 'bg-[#E7E9E2] text-[#26372D] hover:bg-[#D8DCD4]'
                : 'bg-[#294B3A] text-white hover:bg-[#1E372B] shadow-md hover:shadow-lg'
            }`}
          >
            {isTaken ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>{t('markAsUntaken')}</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5 text-[#F3DCCB]" />
                <span>{t('markAsTaken')}</span>
              </>
            )}
          </button>

          {/* Edit / Delete actions */}
          {!compact && (
            <div className="flex items-center gap-1 shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(medicine)}
                  aria-label={`Edit ${medicine.name}`}
                  className="p-2.5 text-[#778078] hover:text-[#26372D] hover:bg-[#F8F7F1] rounded-xl border border-transparent hover:border-[#E7E9E2] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(medicine)}
                  aria-label={`Delete ${medicine.name}`}
                  className="p-2.5 text-[#778078] hover:text-red-700 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
