import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import { AppointmentCard } from '../components/AppointmentCard';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { Plus, Calendar, Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getTodayDateString } from '../data/demoData';

export const Appointments: React.FC = () => {
  const {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    language,
    t,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);

  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    clinicName: '',
    date: getTodayDateString(2),
    time: '11:00 AM',
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setFormData({
      doctorName: '',
      specialty: '',
      clinicName: '',
      date: getTodayDateString(2),
      time: '11:00 AM',
      notes: '',
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (apt: Appointment) => {
    setEditingAppointment(apt);
    setFormData({
      doctorName: apt.doctorName,
      specialty: apt.specialty || '',
      clinicName: apt.clinicName,
      date: apt.date,
      time: apt.time,
      notes: apt.notes || '',
    });
    setFormError(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorName.trim() || !formData.clinicName.trim()) {
      setFormError(
        language === 'hi'
          ? 'डॉक्टर और क्लिनिक का नाम आवश्यक है'
          : 'Doctor name and Clinic/Hospital location are required'
      );
      return;
    }

    if (editingAppointment) {
      updateAppointment({
        ...editingAppointment,
        doctorName: formData.doctorName.trim(),
        specialty: formData.specialty.trim(),
        clinicName: formData.clinicName.trim(),
        date: formData.date,
        time: formData.time,
        notes: formData.notes.trim(),
      });
      setEditingAppointment(null);
    } else {
      addAppointment({
        doctorName: formData.doctorName.trim(),
        specialty: formData.specialty.trim(),
        clinicName: formData.clinicName.trim(),
        date: formData.date,
        time: formData.time,
        notes: formData.notes.trim(),
      });
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingAppointment) {
      deleteAppointment(deletingAppointment.id);
      setDeletingAppointment(null);
    }
  };

  const upcomingAppointments = appointments.filter((a) => a.status === 'upcoming');
  const pastAppointments = appointments.filter((a) => a.status === 'completed');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#E9E5F4] rounded-xl text-[#4A3E72]">
              <Calendar className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26372D]">
              {t('navAppointments')}
            </h1>
          </div>
          <p className="text-sm text-[#778078] mt-1">
            {language === 'hi'
              ? 'डॉक्टर की तारीखें, क्लिनिक का पता और आवश्यक जांच निर्देश।'
              : 'Keep track of medical checkups, clinic visits, and doctor recommendations.'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#294B3A] text-white font-bold text-sm sm:text-base hover:bg-[#1E372B] transition-all transform active:scale-95 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>{t('addAppointment')}</span>
        </button>
      </div>

      {/* Upcoming Section */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-[#26372D] flex items-center gap-2">
          <span>{t('upcomingVisits')}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#65866E]/15 text-[#294B3A]">
            {upcomingAppointments.length}
          </span>
        </h3>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-3.5">
            {upcomingAppointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onEdit={openEditModal}
                onDelete={setDeletingAppointment}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Calendar className="w-10 h-10" />}
            title={t('noUpcomingVisits')}
            description={
              language === 'hi'
                ? 'आपके पास कोई आगामी डॉक्टर मुलाकात निर्धारित नहीं है।'
                : 'You have no scheduled doctor consultations coming up.'
            }
            actionText={t('addAppointment')}
            onAction={openAddModal}
          />
        )}
      </div>

      {/* Past Consultations Section */}
      {pastAppointments.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#E7E9E2]">
          <h3 className="text-lg sm:text-xl font-bold text-[#778078] flex items-center gap-2">
            <span>{t('pastVisits')}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E7E9E2] text-[#778078]">
              {pastAppointments.length}
            </span>
          </h3>

          <div className="space-y-3.5">
            {pastAppointments.map((apt) => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onEdit={openEditModal}
                onDelete={setDeletingAppointment}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hospital Booking Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#E7E9E2] text-xs text-[#778078] leading-relaxed">
        <strong>Demo Reminder:</strong> Saanjh coordinates appointments for your personal schedule and does not represent direct tele-consultation booking with clinic API systems.
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || editingAppointment !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAppointment(null);
        }}
        title={editingAppointment ? t('editAppointment') : t('addAppointment')}
        subtitle={
          language === 'hi'
            ? 'डॉक्टर और क्लिनिक विवरण दर्ज करें।'
            : 'Enter doctor details, appointment time and location.'
        }
      >
        <form onSubmit={handleSaveForm} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
              {t('doctorName')} *
            </label>
            <input
              type="text"
              required
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              placeholder="e.g., Dr. Rajesh Kulkarni"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
                {t('specialty')}
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                placeholder="e.g., Cardiologist, General Physician"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
                {t('clinicLocation')} *
              </label>
              <input
                type="text"
                required
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                placeholder="e.g., Fortis Clinic, Saket"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
                {t('appointmentDate')} *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
                {t('appointmentTime')} *
              </label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 11:30 AM"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
              {t('notesInstructions')}
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g., Fasting 10 hours before test, carry blood sugar report"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E9E2]">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingAppointment(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-[#E7E9E2] text-sm font-semibold text-[#778078] hover:bg-[#F8F7F1]"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#294B3A] text-white text-sm font-bold hover:bg-[#1E372B] shadow-sm"
            >
              Save Appointment
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deletingAppointment && (
        <Modal
          isOpen={deletingAppointment !== null}
          onClose={() => setDeletingAppointment(null)}
          title={t('deleteAppointment')}
          subtitle={t('confirmDelete')}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm">
              Appointment with <span className="font-bold">{deletingAppointment.doctorName}</span> on {deletingAppointment.date} will be removed.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAppointment(null)}
                className="px-4 py-2 rounded-xl border border-[#E7E9E2] text-sm font-semibold text-[#778078] hover:bg-[#F8F7F1]"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 shadow-xs"
              >
                {t('deleteAction')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
