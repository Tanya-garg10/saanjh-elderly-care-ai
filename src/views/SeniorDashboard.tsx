import React, { useState } from 'react';
import {
  Bell,
  Mic,
  Pill,
  Calendar,
  LifeBuoy,
  Check,
  Plus,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { formatDisplayDate, formatTime12h, getOffsetDateISO } from '../data/seedData';
import { MoodOption } from '../types/saanjh';
import { SafeImage } from '../components/SafeImage';

const MOODS: { value: MoodOption; label: string; hint: string }[] = [
  { value: 'peaceful', label: 'Peaceful', hint: 'Calm and settled' },
  { value: 'good', label: 'Good', hint: 'Comfortable energy' },
  { value: 'tired', label: 'Tired', hint: 'Need extra rest' },
  { value: 'low', label: 'Low', hint: 'Quiet or down' },
  { value: 'anxious', label: 'Anxious', hint: 'A bit worried' },
];

export const SeniorDashboard: React.FC = () => {
  const { state, navigate, toggleMedicineTaken, saveWellbeingCheckIn } = useSaanjh();
  const [notifOpen, setNotifOpen] = useState(false);

  const today = getOffsetDateISO(0);
  const todayCheckIn = state.wellbeingHistory.find((w) => w.date === today);

  const [selectedMood, setSelectedMood] = useState<MoodOption>(todayCheckIn?.mood ?? 'peaceful');
  const [moodNote, setMoodNote] = useState(todayCheckIn?.note ?? '');
  const [checkInSavedMessage, setCheckInSavedMessage] = useState('');

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const activeMeds = state.medicines
    .filter((m) => m.active)
    .sort((a, b) => a.time.localeCompare(b.time));
  const takenCount = activeMeds.filter((m) => m.takenToday).length;
  const pendingMeds = activeMeds.filter((m) => !m.takenToday);

  const upcomingAppointments = state.appointments
    .filter((a) => a.status === 'upcoming' && a.date >= today)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const pendingTasksCount = pendingMeds.length + (todayCheckIn ? 0 : 1);

  const handleSaveWellbeing = (e: React.FormEvent) => {
    e.preventDefault();
    saveWellbeingCheckIn(selectedMood, moodNote);
    setCheckInSavedMessage('Saved today’s wellbeing reflection.');
    setTimeout(() => setCheckInSavedMessage(''), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div className="flex items-center gap-4">
          <SafeImage
            src={state.seniorProfile.avatarUrl}
            alt={state.seniorProfile.name}
            className="w-14 h-14 rounded-full object-cover border border-[var(--border-hairline)] shrink-0"
            fallbackLabel={state.seniorProfile.name[0]}
          />
          <div>
            <p className="text-sm text-[var(--text-secondary)]">{formattedToday}</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {greeting}, {state.seniorProfile.name.split(' ')[0]}
            </h1>
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('privacy')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />
            <span>Privacy Controls</span>
          </button>

          <button
            type="button"
            onClick={() => setNotifOpen((prev) => !prev)}
            aria-expanded={notifOpen}
            aria-label={`Notifications (${pendingTasksCount} pending today)`}
            className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] transition-colors whitespace-nowrap"
          >
            <Bell className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />
            <span className="tabular-nums">{pendingTasksCount}</span>
          </button>

          {notifOpen && (
            <div
              role="region"
              aria-label="Today's reminders"
              className="absolute right-0 top-12 z-30 w-80 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                  Today&apos;s Reminders
                </h2>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-[var(--text-secondary)] underline"
                >
                  Close
                </button>
              </div>
              <div className="mt-3 space-y-2.5 text-sm">
                {pendingMeds.length === 0 && todayCheckIn ? (
                  <p className="text-[var(--text-secondary)]">
                    All reminders and check-ins for today are complete.
                  </p>
                ) : (
                  <>
                    {pendingMeds.map((m) => (
                      <div
                        key={m.id}
                        className="pb-2 border-b border-[var(--border-hairline)] last:border-b-0"
                      >
                        <p className="font-medium text-[var(--text-primary)]">{m.name}</p>
                        <p className="text-xs text-[var(--text-secondary)] tabular-nums">
                          Scheduled at {formatTime12h(m.time)} · {m.dosage}
                        </p>
                      </div>
                    ))}
                    {!todayCheckIn && (
                      <p className="text-xs text-[var(--text-secondary)]">
                        Daily Wellbeing reflection has not been saved yet today.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => navigate('voice-assistant')}
            className="p-5 rounded-2xl bg-[var(--deep-green)] text-white text-left hover:bg-[#2A493C] transition-colors flex flex-col justify-between min-h-[116px]"
          >
            <Mic className="w-6 h-6" aria-hidden="true" />
            <div className="mt-4">
              <p className="font-display text-base font-semibold">Talk to Saanjh</p>
              <p className="text-xs text-white/80 mt-0.5">Voice or text companion</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('routine-planner')}
            className="p-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] text-left hover:bg-[var(--secondary-sage)] transition-colors flex flex-col justify-between min-h-[116px]"
          >
            <Pill className="w-6 h-6 text-[var(--deep-green)]" aria-hidden="true" />
            <div className="mt-4">
              <p className="font-display text-base font-semibold text-[var(--text-primary)]">
                Daily Routine
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums">
                {pendingMeds.length} medicines pending
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('appointments')}
            className="p-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] text-left hover:bg-[var(--secondary-sage)] transition-colors flex flex-col justify-between min-h-[116px]"
          >
            <Calendar className="w-6 h-6 text-[var(--deep-green)]" aria-hidden="true" />
            <div className="mt-4">
              <p className="font-display text-base font-semibold text-[var(--text-primary)]">
                My Appointments
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums">
                {upcomingAppointments.length} upcoming
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('help')}
            className="p-5 rounded-2xl bg-[#F9F1ED] border border-[#E8D5CD] text-left hover:bg-[#F3E5DE] transition-colors flex flex-col justify-between min-h-[116px]"
          >
            <LifeBuoy className="w-6 h-6 text-[#9B543C]" aria-hidden="true" />
            <div className="mt-4">
              <p className="font-display text-base font-semibold text-[var(--text-primary)]">
                I Need Help
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Calm support request
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Today's Overview Strip */}
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="text-sm font-medium text-[var(--text-secondary)] mb-3">
          Today&apos;s Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
            <p className="text-xs text-[var(--text-secondary)]">Today&apos;s Medicines</p>
            <p className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)] tabular-nums">
              {takenCount} / {activeMeds.length}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">User-confirmed today</p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
            <p className="text-xs text-[var(--text-secondary)]">Next Appointment</p>
            <p className="mt-2 font-display text-lg font-semibold text-[var(--text-primary)] truncate">
              {upcomingAppointments[0] ? upcomingAppointments[0].doctorName : 'None scheduled'}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)] tabular-nums">
              {upcomingAppointments[0]
                ? `${formatDisplayDate(upcomingAppointments[0].date)} · ${formatTime12h(upcomingAppointments[0].time)}`
                : 'Add in Appointments'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
            <p className="text-xs text-[var(--text-secondary)]">Wellbeing Check-in</p>
            <p className="mt-2 font-display text-lg font-semibold text-[var(--text-primary)] capitalize">
              {todayCheckIn ? todayCheckIn.mood : 'Not saved yet'}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)] tabular-nums">
              {todayCheckIn ? `Saved at ${formatTime12h(todayCheckIn.time)}` : 'Quick note below'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)]">
            <p className="text-xs text-[var(--text-secondary)]">Pending Tasks</p>
            <p className="mt-2 font-display text-2xl font-bold text-[var(--text-primary)] tabular-nums">
              {pendingTasksCount}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {pendingTasksCount === 0 ? 'All caught up' : 'Reminders & check-in'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Medicine Schedule */}
        <section
          aria-labelledby="med-schedule-heading"
          className="lg:col-span-7 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6"
        >
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
            <div>
              <h2
                id="med-schedule-heading"
                className="font-display text-xl font-semibold text-[var(--text-primary)]"
              >
                Today&apos;s Medicine Schedule
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Tap &ldquo;Mark as Taken&rdquo; to record your confirmation
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('medicines')}
              className="text-sm font-medium text-[var(--deep-green)] hover:underline whitespace-nowrap shrink-0"
            >
              Manage all
            </button>
          </div>

          {activeMeds.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-base text-[var(--text-secondary)]">
                No active medicines in your schedule.
              </p>
              <button
                type="button"
                onClick={() => navigate('medicines')}
                className="mt-4 px-4 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium"
              >
                Add Medicine
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-hairline)]">
              {activeMeds.map((med) => (
                <div
                  key={med.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">
                        {med.name}
                      </h3>
                      <span className="text-sm text-[var(--text-secondary)]">{med.dosage}</span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{med.instructions}</p>
                    <p className="mt-1.5 text-xs text-[var(--text-secondary)] tabular-nums">
                      {formatTime12h(med.time)} · {med.timeSlot}
                      <span aria-hidden="true"> · </span>
                      {med.takenToday
                        ? `User-confirmed at ${formatTime12h(med.completedAt || med.time)}`
                        : 'Pending'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleMedicineTaken(med.id)}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                      med.takenToday
                        ? 'bg-[var(--secondary-sage)] text-[var(--deep-green)] hover:bg-[#DCE7E0]'
                        : 'bg-[var(--deep-green)] text-white hover:bg-[#2A493C]'
                    }`}
                  >
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>{med.takenToday ? 'Taken (Undo)' : 'Mark as Taken'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Daily Wellbeing & Upcoming Appointments */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Wellbeing Card */}
          <section
            aria-labelledby="wellbeing-heading"
            className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[var(--accent-terracotta)]" aria-hidden="true" />
                <h2
                  id="wellbeing-heading"
                  className="font-display text-lg font-semibold text-[var(--text-primary)]"
                >
                  How are you feeling today?
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('wellbeing')}
                className="text-xs font-medium text-[var(--deep-green)] hover:underline whitespace-nowrap"
              >
                History
              </button>
            </div>

            <form onSubmit={handleSaveWellbeing} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MOODS.map((m) => {
                  const active = selectedMood === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setSelectedMood(m.value)}
                      aria-pressed={active}
                      className={`px-3 py-2.5 rounded-xl border text-left transition-colors ${
                        active
                          ? 'border-[var(--deep-green)] bg-[var(--secondary-sage)] text-[var(--deep-green)]'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-[var(--text-primary)] hover:bg-[#F1F3EF]'
                      }`}
                    >
                      <span className="block text-sm font-medium">{m.label}</span>
                      <span className="block text-xs text-[var(--text-secondary)]">{m.hint}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label
                  htmlFor="dashboard-mood-note"
                  className="block text-xs font-medium text-[var(--text-secondary)] mb-1"
                >
                  Optional reflection note
                </label>
                <textarea
                  id="dashboard-mood-note"
                  rows={2}
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  placeholder="How did you sleep, or anything you'd like to remember..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm text-[var(--text-primary)]"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] transition-colors whitespace-nowrap"
                >
                  {todayCheckIn ? 'Update Check-in' : 'Save Check-in'}
                </button>
                {checkInSavedMessage && (
                  <span className="text-xs font-medium text-[var(--deep-green)]">
                    {checkInSavedMessage}
                  </span>
                )}
              </div>
            </form>
          </section>

          {/* Upcoming Appointments Card */}
          <section
            aria-labelledby="appointments-heading"
            className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6"
          >
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--border-hairline)]">
              <h2
                id="appointments-heading"
                className="font-display text-lg font-semibold text-[var(--text-primary)]"
              >
                Upcoming Appointments
              </h2>
              <button
                type="button"
                onClick={() => navigate('appointments')}
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--deep-green)] hover:underline whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add Appointment</span>
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <p className="py-6 text-sm text-[var(--text-secondary)]">
                No upcoming appointments scheduled.
              </p>
            ) : (
              <div className="divide-y divide-[var(--border-hairline)]">
                {upcomingAppointments.slice(0, 2).map((apt) => (
                  <div key={apt.id} className="py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">
                        {apt.doctorName}
                      </h3>
                      <span className="text-xs text-[var(--text-secondary)] tabular-nums shrink-0">
                        {formatDisplayDate(apt.date)}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5 tabular-nums">
                      {apt.specialty} · {formatTime12h(apt.time)} · {apt.clinic}
                    </p>
                    {apt.notes && (
                      <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                        {apt.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
