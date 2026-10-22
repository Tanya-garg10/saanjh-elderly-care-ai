import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Medicine, MedicineTimeSlot } from '../types';
import { MedicineCard } from '../components/MedicineCard';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import {
  Plus,
  Pill,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const Medicines: React.FC = () => {
  const {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    language,
    t,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'taken'>('all');
  const [activeSlot, setActiveSlot] = useState<'all' | MedicineTimeSlot>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [deletingMedicine, setDeletingMedicine] = useState<Medicine | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    reminderTime: '08:30 AM',
    timeSlot: 'morning' as MedicineTimeSlot,
    instructions: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const openAddModal = () => {
    setFormData({
      name: '',
      dosage: '',
      reminderTime: '08:30 AM',
      timeSlot: 'morning',
      instructions: '',
    });
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({
      name: med.name,
      dosage: med.dosage || '',
      reminderTime: med.reminderTime,
      timeSlot: med.timeSlot,
      instructions: med.instructions || '',
    });
    setFormError(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError(language === 'hi' ? 'दवा का नाम आवश्यक है' : 'Medicine name is required');
      return;
    }

    if (editingMedicine) {
      updateMedicine({
        ...editingMedicine,
        name: formData.name.trim(),
        dosage: formData.dosage.trim(),
        reminderTime: formData.reminderTime,
        timeSlot: formData.timeSlot,
        instructions: formData.instructions.trim(),
      });
      setEditingMedicine(null);
    } else {
      addMedicine({
        name: formData.name.trim(),
        dosage: formData.dosage.trim(),
        reminderTime: formData.reminderTime,
        timeSlot: formData.timeSlot,
        instructions: formData.instructions.trim(),
      });
      setIsAddModalOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingMedicine) {
      deleteMedicine(deletingMedicine.id);
      setDeletingMedicine(null);
    }
  };

  // Filter medicines
  const filteredMedicines = medicines.filter((m) => {
    if (activeFilter === 'upcoming' && m.status !== 'upcoming') return false;
    if (activeFilter === 'taken' && m.status !== 'taken') return false;
    if (activeSlot !== 'all' && m.timeSlot !== activeSlot) return false;
    return true;
  });

  const takenCount = medicines.filter((m) => m.status === 'taken').length;
  const pendingCount = medicines.filter((m) => m.status === 'upcoming').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Heading & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#65866E]/15 rounded-xl text-[#294B3A]">
              <Pill className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26372D]">
              {t('navMedicines')}
            </h1>
          </div>
          <p className="text-sm text-[#778078] mt-1">
            {language === 'hi'
              ? 'दैनिक दवाओं का समय निर्धारित करें और ली गई दवाओं को चिह्नित करें।'
              : 'Keep track of scheduled routines, instructions, and adherence timestamps.'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#294B3A] text-white font-bold text-sm sm:text-base hover:bg-[#1E372B] transition-all transform active:scale-95 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>{t('addMedicine')}</span>
        </button>
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E7E9E2] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#778078] font-medium">Total Scheduled</span>
            <p className="text-2xl font-bold text-[#26372D]">{medicines.length}</p>
          </div>
          <Pill className="w-8 h-8 text-[#65866E]/30" />
        </div>
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E7E9E2] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#778078] font-medium">Confirmed Taken</span>
            <p className="text-2xl font-bold text-[#294B3A]">{takenCount}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-[#65866E]/30" />
        </div>
        <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E7E9E2] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#778078] font-medium">Pending Reminders</span>
            <p className="text-2xl font-bold text-amber-800">{pendingCount}</p>
          </div>
          <Clock className="w-8 h-8 text-amber-500/30" />
        </div>
      </div>

      {/* Filters: Status and Time of Day */}
      <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E7E9E2] flex flex-wrap items-center justify-between gap-3">
        {/* Status filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-[#778078] mr-1 hidden sm:inline">
            Status:
          </span>
          {(['all', 'upcoming', 'taken'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-colors ${
                activeFilter === filter
                  ? 'bg-[#294B3A] text-white'
                  : 'bg-[#F8F7F1] text-[#778078] hover:bg-[#E7E9E2]'
              }`}
            >
              {filter === 'all'
                ? 'All'
                : filter === 'upcoming'
                ? t('statusUpcoming')
                : t('statusTaken')}
            </button>
          ))}
        </div>

        {/* Time slot filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-[#778078] mr-1 hidden sm:inline">
            Time Slot:
          </span>
          {(['all', 'morning', 'afternoon', 'evening', 'night'] as const).map((slot) => (
            <button
              key={slot}
              onClick={() => setActiveSlot(slot)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                activeSlot === slot
                  ? 'bg-[#65866E] text-white'
                  : 'bg-[#F8F7F1] text-[#778078] hover:bg-[#E7E9E2]'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines List */}
      {filteredMedicines.length > 0 ? (
        <div className="space-y-3.5">
          {filteredMedicines.map((med) => (
            <MedicineCard
              key={med.id}
              medicine={med}
              onEdit={openEditModal}
              onDelete={setDeletingMedicine}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Pill className="w-10 h-10" />}
          title={language === 'hi' ? 'कोई दवा नहीं मिली' : 'No medicines found'}
          description={
            language === 'hi'
              ? 'वर्तमान फ़िल्टर के लिए कोई दवा उपलब्ध नहीं है।'
              : 'There are no medicine reminders matching your filter criteria.'
          }
          actionText={t('addMedicine')}
          onAction={openAddModal}
        />
      )}

      {/* Medical Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#E7E9E2] text-xs text-[#778078] leading-relaxed">
        <strong>Important Healthcare Notice:</strong> Saanjh is a reminder assistant and does not prescribe, adjust, or diagnose medical treatments. Always consult your personal physician regarding prescription changes or dosage instructions.
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddModalOpen || editingMedicine !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingMedicine(null);
        }}
        title={editingMedicine ? t('editMedicine') : t('addMedicine')}
        subtitle={
          language === 'hi'
            ? 'दवा का नाम और याद दिलाने का समय दर्ज करें।'
            : 'Enter medicine details and schedule your daily reminder.'
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
              {t('medicineName')} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Metformin, Amlodipine, Vitamin D"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
                {t('dosage')}
              </label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 500 mg, 1 tablet"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
                {t('reminderTime')} *
              </label>
              <input
                type="text"
                required
                value={formData.reminderTime}
                onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                placeholder="e.g., 08:30 AM, 02:00 PM"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
              {t('timeSlot')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['morning', 'afternoon', 'evening', 'night'] as const).map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setFormData({ ...formData, timeSlot: slot })}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl capitalize border transition-colors ${
                    formData.timeSlot === slot
                      ? 'bg-[#294B3A] text-white border-[#294B3A]'
                      : 'bg-[#F8F7F1] text-[#778078] border-[#E7E9E2]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1">
              {t('instructions')}
            </label>
            <textarea
              rows={2}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="e.g., Take after breakfast with warm water"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E7E9E2]">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingMedicine(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-[#E7E9E2] text-sm font-semibold text-[#778078] hover:bg-[#F8F7F1]"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#294B3A] text-white text-sm font-bold hover:bg-[#1E372B] shadow-sm"
            >
              {t('saveMedicine')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deletingMedicine && (
        <Modal
          isOpen={deletingMedicine !== null}
          onClose={() => setDeletingMedicine(null)}
          title={t('deleteMedicine')}
          subtitle={t('confirmDelete')}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm">
              <span className="font-bold">{deletingMedicine.name}</span> (
              {deletingMedicine.reminderTime}) will be permanently removed from your daily routine.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMedicine(null)}
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
