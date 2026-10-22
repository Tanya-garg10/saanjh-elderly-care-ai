import React from 'react';
import { Appointment } from '../types';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, CheckCircle, RotateCcw, Edit2, Trash2 } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  compact?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
  compact = false,
}) => {
  const { toggleAppointmentCompleted, t } = useApp();
  const isCompleted = appointment.status === 'completed';

  return (
    <div
      className={`relative bg-[#FFFFFF] rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
        isCompleted
          ? 'border-[#E7E9E2] bg-[#FAF9F6] opacity-85'
          : 'border-[#E7E9E2] hover:border-[#65866E]/40'
      } p-5 sm:p-6`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left details */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3.5 rounded-2xl shrink-0 ${
              isCompleted
                ? 'bg-[#E7E9E2] text-[#778078]'
                : 'bg-[#E9E5F4] text-[#4A3E72]'
            }`}
          >
            <Calendar className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-lg sm:text-xl font-bold text-[#26372D]">
                {appointment.doctorName}
              </h4>
              {appointment.specialty && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#F8F7F1] text-[#778078] border border-[#E7E9E2]">
                  {appointment.specialty}
                </span>
              )}
              {isCompleted ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E7E9E2] text-[#778078]">
                  {t('markCompleted')}
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#65866E]/15 text-[#294B3A]">
                  {t('statusUpcoming')}
                </span>
              )}
            </div>

            {/* Clinic / Location */}
            <div className="flex items-center gap-2 mt-1.5 text-sm text-[#778078]">
              <MapPin className="w-4 h-4 text-[#65866E] shrink-0" />
              <span>{appointment.clinicName}</span>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-4 mt-2 text-sm font-semibold text-[#294B3A]">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#65866E]" />
                {appointment.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#65866E]" />
                {appointment.time}
              </span>
            </div>

            {/* Prep notes */}
            {appointment.notes && (
              <p className="mt-2.5 text-sm text-[#778078] bg-[#F8F7F1] p-3 rounded-xl border border-[#E7E9E2]/60">
                <span className="font-semibold text-[#26372D]">Note: </span>
                {appointment.notes}
              </p>
            )}
          </div>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2 self-end sm:self-start mt-2 sm:mt-0">
          <button
            onClick={() => toggleAppointmentCompleted(appointment.id)}
            aria-label={isCompleted ? 'Mark upcoming' : 'Mark completed'}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              isCompleted
                ? 'bg-[#FFFFFF] border-[#E7E9E2] text-[#778078] hover:bg-[#F8F7F1]'
                : 'bg-[#65866E]/10 border-[#65866E]/30 text-[#294B3A] hover:bg-[#65866E]/20'
            }`}
          >
            {isCompleted ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-open</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-[#65866E]" />
                <span>{t('markCompleted')}</span>
              </>
            )}
          </button>

          {!compact && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(appointment)}
                  aria-label={`Edit appointment with ${appointment.doctorName}`}
                  className="p-2 text-[#778078] hover:text-[#26372D] hover:bg-[#F8F7F1] rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(appointment)}
                  aria-label={`Delete appointment with ${appointment.doctorName}`}
                  className="p-2 text-[#778078] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
