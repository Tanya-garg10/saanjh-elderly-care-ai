import React, { useMemo, useState } from 'react';
import {
  Check,
  Clock,
  Plus,
  Droplets,
  Pill,
  Calendar,
  Sun,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { formatDisplayDate, formatTime12h, getOffsetDateISO } from '../data/seedData';
import { RoutineActivity, RoutineActivityCategory } from '../types/saanjh';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface TimelineEntry {
  id: string;
  sourceType: 'medicine' | 'appointment' | 'routine';
  time: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  completed: boolean;
  postponed?: boolean;
  rawMedId?: string;
  rawRoutine?: RoutineActivity;
}

export const RoutinePlannerView: React.FC = () => {
  const {
    state,
    toggleMedicineTaken,
    addRoutineActivity,
    updateRoutineActivity,
    postponeRoutineActivity,
    deleteRoutineActivity,
    navigate,
  } = useSaanjh();

  const today = getOffsetDateISO(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineActivity | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RoutineActivityCategory>('hydration');
  const [time, setTime] = useState('16:00');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<RoutineActivity | null>(null);

  const timeline = useMemo<TimelineEntry[]>(() => {
    const items: TimelineEntry[] = [];

    state.medicines
      .filter((m) => m.active)
      .forEach((m) => {
        items.push({
          id: `tl-med-${m.id}`,
          sourceType: 'medicine',
          time: m.time,
          title: `${m.name} (${m.dosage})`,
          subtitle: m.instructions,
          categoryLabel: 'Medicine',
          completed: m.takenToday,
          rawMedId: m.id,
        });
      });

    state.appointments
      .filter((a) => a.date === today && a.status !== 'cancelled')
      .forEach((a) => {
        items.push({
          id: `tl-apt-${a.id}`,
          sourceType: 'appointment',
          time: a.time,
          title: `${a.doctorName} · ${a.specialty}`,
          subtitle: a.clinic,
          categoryLabel: 'Appointment',
          completed: a.status === 'completed',
        });
      });

    state.routineActivities
      .filter((r) => r.date === today)
      .forEach((r) => {
        items.push({
          id: `tl-ra-${r.id}`,
          sourceType: 'routine',
          time: r.time,
          title: r.title,
          subtitle: r.notes || 'Daily routine reminder',
          categoryLabel:
            r.category === 'hydration'
              ? 'Hydration'
              : r.category === 'activity'
                ? 'Activity'
                : r.category === 'rest'
                  ? 'Rest'
                  : 'Task',
          completed: r.status === 'completed',
          postponed: r.status === 'postponed',
          rawRoutine: r,
        });
      });

    return items.sort((a, b) => a.time.localeCompare(b.time));
  }, [state.medicines, state.appointments, state.routineActivities, today]);

  const completedCount = timeline.filter((i) => i.completed).length;
  const totalCount = timeline.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const openAdd = () => {
    setEditingRoutine(null);
    setTitle('');
    setCategory('hydration');
    setTime('16:00');
    setNotes('');
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (r: RoutineActivity) => {
    setEditingRoutine(r);
    setTitle(r.title);
    setCategory(r.category);
    setTime(r.time);
    setNotes(r.notes);
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !time) {
      setFormError('Please enter an activity title and time.');
      return;
    }
    if (editingRoutine) {
      updateRoutineActivity(editingRoutine.id, {
        title: title.trim(),
        category,
        time,
        notes: notes.trim(),
      });
    } else {
      addRoutineActivity({
        title: title.trim(),
        category,
        date: today,
        time,
        notes: notes.trim(),
        status: 'pending',
      });
    }
    setFormOpen(false);
    setEditingRoutine(null);
  };

  const renderIcon = (item: TimelineEntry) => {
    if (item.sourceType === 'medicine') {
      return <Pill className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />;
    }
    if (item.sourceType === 'appointment') {
      return <Calendar className="w-4 h-4 text-[var(--accent-terracotta)]" aria-hidden="true" />;
    }
    if (item.rawRoutine?.category === 'hydration') {
      return <Droplets className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />;
    }
    return <Sun className="w-4 h-4 text-[var(--primary-sage)]" aria-hidden="true" />;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Smart Daily Routine Planner
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {formatDisplayDate(today)} · Medicines, hydration reminders, appointments, and daily
            activities in one calm timeline.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Activity / Hydration</span>
        </button>
      </header>

      {/* Daily Completion Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
          <p className="text-xs text-[var(--text-secondary)]">Today&apos;s Completion</p>
          <p className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)] tabular-nums">
            {completedCount} / {totalCount}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)] tabular-nums">
            {completionPct}% of recorded actions completed
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
          <p className="text-xs text-[var(--text-secondary)]">Hydration &amp; Habits</p>
          <p className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)] tabular-nums">
            {
              state.routineActivities.filter(
                (r) => r.date === today && r.status === 'completed'
              ).length
            }{' '}
            / {state.routineActivities.filter((r) => r.date === today).length}
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Water, rest &amp; walks</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] flex flex-col justify-between">
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Quick Voice Shortcut</p>
            <p className="mt-1.5 text-sm text-[var(--text-primary)]">
              Create reminders naturally in Talk to Saanjh.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('voice-assistant')}
            className="mt-3 text-left text-xs font-medium text-[var(--deep-green)] hover:underline"
          >
            Open Voice to Smart Tasks &rarr;
          </button>
        </div>
      </section>

      {/* Add / Edit Activity Form */}
      {formOpen && (
        <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            {editingRoutine ? 'Edit Routine Activity' : 'Add Hydration or Routine Activity'}
          </h2>
          <form onSubmit={handleSave} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ra-title" className="block text-sm font-medium mb-1">
                Activity Title *
              </label>
              <input
                id="ra-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Drink a glass of warm water"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div>
              <label htmlFor="ra-cat" className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                id="ra-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as RoutineActivityCategory)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              >
                <option value="hydration">Hydration Reminder</option>
                <option value="activity">Daily Activity / Walk</option>
                <option value="rest">Rest / Quiet Time</option>
                <option value="custom">Personal Reminder</option>
              </select>
            </div>

            <div>
              <label htmlFor="ra-time" className="block text-sm font-medium mb-1">
                Scheduled Time *
              </label>
              <input
                id="ra-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="ra-notes" className="block text-sm font-medium mb-1">
                Notes
              </label>
              <input
                id="ra-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional note..."
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            {formError && <p className="md:col-span-2 text-sm text-[#A6513A]">{formError}</p>}

            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-hairline)] text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium"
              >
                {editingRoutine ? 'Save Changes' : 'Add to Timeline'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Unified Daily Timeline */}
      <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
        {timeline.length === 0 ? (
          <p className="p-10 text-center text-sm text-[var(--text-secondary)]">
            Your timeline for today is clear. Add a hydration reminder or activity above.
          </p>
        ) : (
          timeline.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="pt-1 tabular-nums text-sm font-semibold text-[var(--deep-green)] w-20 shrink-0">
                  {formatTime12h(item.time)}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {renderIcon(item)}
                    <h2
                      className={`font-display text-base font-semibold ${
                        item.completed
                          ? 'line-through text-[var(--text-secondary)]'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {item.title}
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)]">
                      · {item.categoryLabel}
                      {item.postponed && !item.completed ? ' · Postponed' : ''}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {item.sourceType === 'medicine' && item.rawMedId && (
                  <button
                    type="button"
                    onClick={() => toggleMedicineTaken(item.rawMedId!)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium ${
                      item.completed
                        ? 'bg-[var(--secondary-sage)] text-[var(--deep-green)]'
                        : 'bg-[var(--deep-green)] text-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{item.completed ? 'Taken (Undo)' : 'Mark Taken'}</span>
                  </button>
                )}

                {item.sourceType === 'routine' && item.rawRoutine && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        updateRoutineActivity(item.rawRoutine!.id, {
                          status: item.completed ? 'pending' : 'completed',
                        })
                      }
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium ${
                        item.completed
                          ? 'bg-[var(--secondary-sage)] text-[var(--deep-green)]'
                          : 'bg-[var(--deep-green)] text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{item.completed ? 'Completed (Undo)' : 'Complete'}</span>
                    </button>

                    {!item.completed && (
                      <button
                        type="button"
                        onClick={() => postponeRoutineActivity(item.rawRoutine!.id, 60)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[var(--border-hairline)] text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)]"
                      >
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Postpone 1h</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => openEdit(item.rawRoutine!)}
                      aria-label={`Edit ${item.title}`}
                      className="p-2 rounded-xl border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:bg-[var(--secondary-sage)]"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item.rawRoutine!)}
                      aria-label={`Delete ${item.title}`}
                      className="p-2 rounded-xl border border-[var(--border-hairline)] text-[#A6513A] hover:bg-[#F9F1ED]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}

                {item.sourceType === 'appointment' && (
                  <button
                    type="button"
                    onClick={() => navigate('appointments')}
                    className="px-3.5 py-2 rounded-xl border border-[var(--border-hairline)] text-xs font-medium text-[var(--deep-green)] hover:bg-[var(--secondary-sage)]"
                  >
                    Open Visit Prep
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove routine activity?"
        description={`Remove "${deleteTarget?.title ?? ''}" from today's timeline?`}
        confirmLabel="Remove"
        destructive
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteRoutineActivity(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};
