import React, { useState } from 'react';
import { Plus, Check, Pencil, Trash2, Info, Search } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { formatDisplayDate, formatTime12h } from '../data/seedData';
import { Medicine, TimeSlot } from '../types/saanjh';
import { ConfirmDialog } from '../components/ConfirmDialog';

const SLOTS: TimeSlot[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

export const MedicinesView: React.FC = () => {
  const { state, toggleMedicineTaken, addMedicine, updateMedicine, deleteMedicine } = useSaanjh();
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [time, setTime] = useState('08:30');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('Morning');
  const [active, setActive] = useState(true);
  const [formError, setFormError] = useState('');

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDosage('');
    setInstructions('');
    setTime('08:30');
    setTimeSlot('Morning');
    setActive(true);
    setFormError('');
    setFormOpen(false);
  };

  const openAddForm = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEditForm = (med: Medicine) => {
    setEditingId(med.id);
    setName(med.name);
    setDosage(med.dosage);
    setInstructions(med.instructions);
    setTime(med.time);
    setTimeSlot(med.timeSlot);
    setActive(med.active);
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim() || !time.trim()) {
      setFormError('Please enter the medicine name, dosage, and reminder time.');
      return;
    }
    if (editingId) {
      updateMedicine(editingId, {
        name: name.trim(),
        dosage: dosage.trim(),
        instructions: instructions.trim() || 'Follow prescription instructions.',
        time,
        timeSlot,
        active,
      });
    } else {
      addMedicine({
        name: name.trim(),
        dosage: dosage.trim(),
        instructions: instructions.trim() || 'Follow prescription instructions.',
        time,
        timeSlot,
        active,
      });
    }
    resetForm();
  };

  const filteredMeds = state.medicines
    .filter((m) => {
      if (filterStatus === 'active' && !m.active) return false;
      if (filterStatus === 'inactive' && m.active) return false;
      if (
        searchQuery.trim() &&
        !`${m.name} ${m.dosage} ${m.instructions}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  // Build recent daily history rows across medicines
  const recentHistoryRows = state.medicines
    .flatMap((med) =>
      med.history.map((entry) => ({
        id: `${med.id}-${entry.date}`,
        date: entry.date,
        medName: med.name,
        dosage: med.dosage,
        status: entry.status,
        confirmedAt: entry.confirmedAt,
        verificationMethod: entry.verificationMethod,
      }))
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 12);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Medicine Management
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage daily reminders, dosage notes, and your personal confirmation history.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Medicine</span>
        </button>
      </header>

      {/* Verification Transparency Banner */}
      <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] px-5 py-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[var(--deep-green)] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          <span className="font-semibold text-[var(--text-primary)]">
            User-confirmed vs. verified adherence:
          </span>{' '}
          Completions shown here reflect manual confirmation when you tap &ldquo;Mark as
          Taken&rdquo;. Saanjh does not connect to smart pillboxes or pharmacy verification hardware.
        </p>
      </div>

      {/* Add / Edit Form */}
      {formOpen && (
        <section
          aria-labelledby="med-form-title"
          className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6"
        >
          <h2
            id="med-form-title"
            className="font-display text-lg font-semibold text-[var(--text-primary)]"
          >
            {editingId ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>

          <form onSubmit={handleSave} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="med-name" className="block text-sm font-medium mb-1.5">
                Medicine Name *
              </label>
              <input
                id="med-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amlodipine"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div>
              <label htmlFor="med-dosage" className="block text-sm font-medium mb-1.5">
                Dosage *
              </label>
              <input
                id="med-dosage"
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 5 mg · 1 tablet"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div>
              <label htmlFor="med-time" className="block text-sm font-medium mb-1.5">
                Reminder Time *
              </label>
              <input
                id="med-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="med-slot" className="block text-sm font-medium mb-1.5">
                Time of Day
              </label>
              <select
                id="med-slot"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              >
                {SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="med-instructions" className="block text-sm font-medium mb-1.5">
                Instructions
              </label>
              <input
                id="med-instructions"
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Take after breakfast with water"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3 pt-1">
              <input
                id="med-active"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 accent-[var(--deep-green)]"
              />
              <label htmlFor="med-active" className="text-sm text-[var(--text-primary)]">
                Active schedule (include in daily reminders)
              </label>
            </div>

            {formError && (
              <p className="md:col-span-2 text-sm text-[#A6513A]" role="alert">
                {formError}
              </p>
            )}

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C]"
              >
                {editingId ? 'Save Changes' : 'Save Medicine'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-white)] border border-[var(--border-hairline)] w-fit">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-[var(--deep-green)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <label htmlFor="med-search" className="sr-only">
            Search medicines
          </label>
          <input
            id="med-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm"
          />
        </div>
      </div>

      {/* Medicine List */}
      <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
        {filteredMeds.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-base text-[var(--text-secondary)]">
              No medicines match the current filter.
            </p>
            <button
              type="button"
              onClick={openAddForm}
              className="mt-4 px-4 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium"
            >
              Add Your First Medicine
            </button>
          </div>
        ) : (
          filteredMeds.map((med) => (
            <div
              key={med.id}
              className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                    {med.name}
                  </h2>
                  <span className="text-sm text-[var(--text-secondary)]">{med.dosage}</span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    · {med.active ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{med.instructions}</p>
                <p className="mt-1.5 text-xs text-[var(--text-secondary)] tabular-nums">
                  {formatTime12h(med.time)} · {med.timeSlot}
                  <span aria-hidden="true"> · </span>
                  {med.takenToday
                    ? `User-confirmed today at ${formatTime12h(med.completedAt || med.time)}`
                    : 'Not yet confirmed today (Unverified)'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {med.active && (
                  <button
                    type="button"
                    onClick={() => toggleMedicineTaken(med.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                      med.takenToday
                        ? 'bg-[var(--secondary-sage)] text-[var(--deep-green)]'
                        : 'bg-[var(--deep-green)] text-white hover:bg-[#2A493C]'
                    }`}
                  >
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>{med.takenToday ? 'Confirmed (Undo)' : 'Mark as Taken'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => updateMedicine(med.id, { active: !med.active })}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] whitespace-nowrap"
                >
                  {med.active ? 'Pause' : 'Activate'}
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(med)}
                  aria-label={`Edit ${med.name}`}
                  className="p-2 rounded-xl border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--secondary-sage)]"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(med)}
                  aria-label={`Delete ${med.name}`}
                  className="p-2 rounded-xl border border-[var(--border-hairline)] text-[#A6513A] hover:bg-[#F9F1ED]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Daily Medicine History */}
      <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
          Recent Daily Medicine History
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Self-reported confirmations across the past 7 days.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] text-xs text-[var(--text-secondary)]">
                <th className="py-2.5 pr-4 font-medium">Date</th>
                <th className="py-2.5 pr-4 font-medium">Medicine</th>
                <th className="py-2.5 pr-4 font-medium">Recorded Status</th>
                <th className="py-2.5 font-medium">Verification Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {recentHistoryRows.map((row) => (
                <tr key={row.id} className="hover:bg-[var(--bg-ivory)]">
                  <td className="py-3 pr-4 tabular-nums text-[var(--text-secondary)] whitespace-nowrap">
                    {formatDisplayDate(row.date)}
                  </td>
                  <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">
                    {row.medName}{' '}
                    <span className="font-normal text-[var(--text-secondary)]">· {row.dosage}</span>
                  </td>
                  <td className="py-3 pr-4 capitalize">
                    {row.status === 'taken'
                      ? `Taken (${row.confirmedAt ? formatTime12h(row.confirmedAt) : 'Logged'})`
                      : row.status}
                  </td>
                  <td className="py-3 text-xs text-[var(--text-secondary)]">
                    {row.verificationMethod === 'user-confirmed'
                      ? 'User-confirmed (manual tap)'
                      : 'Not independently verified'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete medicine schedule?"
        description={`Are you sure you want to remove ${deleteTarget?.name ?? ''} from your medicine schedule? This cannot be undone.`}
        confirmLabel="Delete Medicine"
        destructive
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteMedicine(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};
