import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  CheckCircle2,
  ClipboardList,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { formatDisplayDate, formatTime12h, getOffsetDateISO } from '../data/seedData';
import { Appointment, AppointmentStatus } from '../types/saanjh';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const AppointmentsView: React.FC = () => {
  const {
    state,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    saveAppointmentPrep,
  } = useSaanjh();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  // Appointment Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [clinic, setClinic] = useState('');
  const [date, setDate] = useState(getOffsetDateISO(3));
  const [time, setTime] = useState('10:30');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>('upcoming');
  const [formError, setFormError] = useState('');

  // Visit Preparation workspace state
  const [prepApt, setPrepApt] = useState<Appointment | null>(null);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [newConcern, setNewConcern] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [summaryText, setSummaryText] = useState('');
  const [approved, setApproved] = useState(false);
  const [prepSavedNotice, setPrepSavedNotice] = useState('');
  const [isGeneratingPrep, setIsGeneratingPrep] = useState(false);
  const [prepApiNotice, setPrepApiNotice] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setDoctorName('');
    setSpecialty('');
    setClinic('');
    setDate(getOffsetDateISO(3));
    setTime('10:30');
    setNotes('');
    setStatus('upcoming');
    setFormError('');
    setFormOpen(false);
  };

  const openAdd = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    setDoctorName(apt.doctorName);
    setSpecialty(apt.specialty);
    setClinic(apt.clinic);
    setDate(apt.date);
    setTime(apt.time);
    setNotes(apt.notes);
    setStatus(apt.status);
    setFormError('');
    setFormOpen(true);
  };

  const openVisitPrep = (apt: Appointment) => {
    const existing = state.appointmentPreps.find((p) => p.appointmentId === apt.id);
    setPrepApt(apt);
    setConcerns(existing?.concerns ?? []);
    setQuestions(existing?.questions ?? []);
    setSummaryText(existing?.summaryText ?? '');
    setApproved(existing?.approved ?? false);
    setNewConcern('');
    setNewQuestion('');
    setPrepSavedNotice('');
    setPrepApiNotice('');
  };

  const buildLocalPrepSummary = (apt: Appointment) => {
    const activeMedNames = state.medicines
      .filter((m) => m.active)
      .map((m) => `${m.name} (${m.dosage.replace(/\s*·\s*/g, ', ')})`)
      .join('; ');

    const lines: string[] = [
      `Visit Preparation for ${apt.doctorName} (${apt.specialty}) on ${formatDisplayDate(apt.date)} at ${formatTime12h(apt.time)}.`,
    ];

    if (concerns.length > 0) {
      lines.push(`User-noted topics to discuss: ${concerns.join(' | ')}.`);
    } else {
      lines.push('No specific concerns added yet.');
    }

    if (questions.length > 0) {
      lines.push(`Questions for the doctor: ${questions.join(' | ')}.`);
    }

    if (activeMedNames) {
      lines.push(`Current active medicines listed by user: ${activeMedNames}.`);
    }

    lines.push('Note: Prepared strictly from user notes for discussion; not a diagnosis or medical advice.');
    return lines.join('\n\n');
  };

  const handleGeneratePrepSummary = async () => {
    if (!prepApt || isGeneratingPrep) return;
    setIsGeneratingPrep(true);
    setPrepApiNotice('');

    const activeMedicines = state.medicines
      .filter((m) => m.active)
      .map((m) => `${m.name} (${m.dosage.replace(/\s*·\s*/g, ', ')})`);

    try {
      const res = await fetch('/api/saanjh/visit-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointment: {
            doctorName: prepApt.doctorName,
            specialty: prepApt.specialty,
            clinic: prepApt.clinic,
            date: formatDisplayDate(prepApt.date),
            time: formatTime12h(prepApt.time),
          },
          concerns,
          questions,
          activeMedicines,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        summary?: string;
        model?: string;
        error?: string;
      };

      if (res.ok && data.summary) {
        setSummaryText(data.summary);
        setApproved(false);
        setPrepApiNotice(`Draft organized with Gemini (${data.model || 'gemini-4-hydrogen'}). Please review and approve below.`);
      } else {
        setSummaryText(buildLocalPrepSummary(prepApt));
        setApproved(false);
        setPrepApiNotice(
          data.error
            ? `${data.error} Generated summary using local template.`
            : 'Generated summary using local template.'
        );
      }
    } catch {
      setSummaryText(buildLocalPrepSummary(prepApt));
      setApproved(false);
      setPrepApiNotice('Server unavailable; generated summary using local template.');
    } finally {
      setIsGeneratingPrep(false);
    }
  };

  const handleSavePrep = (approveNow: boolean) => {
    if (!prepApt) return;
    saveAppointmentPrep({
      appointmentId: prepApt.id,
      concerns,
      questions,
      summaryText: summaryText.trim(),
      approved: approveNow,
    });
    setApproved(approveNow);
    setPrepSavedNotice(
      approveNow
        ? 'Preparation summary approved and saved locally.'
        : 'Draft saved locally.'
    );
    setTimeout(() => setPrepSavedNotice(''), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !clinic.trim() || !date || !time) {
      setFormError('Please enter the doctor name, hospital/clinic, date, and time.');
      return;
    }
    if (editingId) {
      updateAppointment(editingId, {
        doctorName: doctorName.trim(),
        specialty: specialty.trim() || 'Consultation',
        clinic: clinic.trim(),
        date,
        time,
        notes: notes.trim(),
        status,
      });
    } else {
      addAppointment({
        doctorName: doctorName.trim(),
        specialty: specialty.trim() || 'Consultation',
        clinic: clinic.trim(),
        date,
        time,
        notes: notes.trim(),
        status,
      });
    }
    resetForm();
  };

  const filtered = [...state.appointments]
    .filter((a) => {
      if (filter === 'upcoming') return a.status === 'upcoming';
      if (filter === 'past') return a.status !== 'upcoming';
      return true;
    })
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Appointments &amp; Visit Preparation
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage upcoming visits and prepare organized questions for your doctor without medical
            guesswork.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Appointment</span>
        </button>
      </header>

      {/* Doctor Visit Preparation Workspace */}
      {prepApt && (
        <section
          aria-labelledby="prep-workspace-title"
          className="rounded-2xl bg-[var(--surface-white)] border border-[var(--deep-green)]/40 p-6 space-y-5"
        >
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border-hairline)]">
            <div>
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[var(--deep-green)]" aria-hidden="true" />
                <h2
                  id="prep-workspace-title"
                  className="font-display text-xl font-semibold text-[var(--text-primary)]"
                >
                  Visit Preparation · {prepApt.doctorName}
                </h2>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 tabular-nums">
                {formatDisplayDate(prepApt.date)} at {formatTime12h(prepApt.time)} · {prepApt.clinic}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPrepApt(null)}
              aria-label="Close visit preparation"
              className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--secondary-sage)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-xl bg-[var(--bg-ivory)] border border-[var(--border-hairline)] px-4 py-3 flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
            <Info className="w-4 h-4 text-[var(--deep-green)] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              This preparation tool organizes your own concerns, questions, and saved medicine list
              for your appointment. Saanjh does not generate diagnoses or treatment recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Concerns */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Your Concerns or Symptoms to Mention
              </h3>
              <div className="flex gap-2">
                <label htmlFor="prep-concern-input" className="sr-only">
                  Add a concern
                </label>
                <input
                  id="prep-concern-input"
                  type="text"
                  value={newConcern}
                  onChange={(e) => setNewConcern(e.target.value)}
                  placeholder="e.g. Knee stiffness in the morning..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newConcern.trim()) {
                      setConcerns([...concerns, newConcern.trim()]);
                      setNewConcern('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--secondary-sage)]"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {concerns.map((item, idx) => (
                  <li
                    key={`${item}-${idx}`}
                    className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-ivory)] text-sm"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => setConcerns(concerns.filter((_, i) => i !== idx))}
                      aria-label="Remove concern"
                      className="text-xs text-[#A6513A]"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                Questions for {prepApt.doctorName}
              </h3>
              <div className="flex gap-2">
                <label htmlFor="prep-question-input" className="sr-only">
                  Add a question
                </label>
                <input
                  id="prep-question-input"
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. Should I repeat blood tests next month?"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newQuestion.trim()) {
                      setQuestions([...questions, newQuestion.trim()]);
                      setNewQuestion('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl border border-[var(--border-hairline)] text-xs font-medium hover:bg-[var(--secondary-sage)]"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {questions.map((item, idx) => (
                  <li
                    key={`${item}-${idx}`}
                    className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-ivory)] text-sm"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                      aria-label="Remove question"
                      className="text-xs text-[#A6513A]"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="prep-summary-textarea" className="text-sm font-semibold">
                Editable Preparation Summary{' '}
                <span className="font-normal text-xs text-[var(--text-secondary)]">
                  · Status: {approved ? 'Approved by user' : 'Draft'}
                </span>
              </label>
              <button
                type="button"
                disabled={isGeneratingPrep}
                onClick={() => void handleGeneratePrepSummary()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--secondary-sage)] text-[var(--deep-green)] text-xs font-medium hover:bg-[#DCE7E0] disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{isGeneratingPrep ? 'Generating...' : 'Generate Simple Summary'}</span>
              </button>
            </div>

            {prepApiNotice && (
              <p className="text-xs text-[var(--text-secondary)]">{prepApiNotice}</p>
            )}

            <textarea
              id="prep-summary-textarea"
              rows={5}
              value={summaryText}
              onChange={(e) => {
                setSummaryText(e.target.value);
                setApproved(false);
              }}
              placeholder="Click 'Generate Simple Summary' or write your own summary to take to your appointment..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                {prepSavedNotice && (
                  <span className="text-sm font-medium text-[var(--deep-green)]">
                    {prepSavedNotice}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSavePrep(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] text-sm font-medium hover:bg-[var(--secondary-sage)]"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePrep(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C]"
                >
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>Approve Summary</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Add / Edit Appointment Form */}
      {formOpen && (
        <section
          aria-labelledby="apt-form-title"
          className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6"
        >
          <h2
            id="apt-form-title"
            className="font-display text-lg font-semibold text-[var(--text-primary)]"
          >
            {editingId ? 'Edit Appointment' : 'Schedule Appointment'}
          </h2>

          <form onSubmit={handleSave} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="apt-doctor" className="block text-sm font-medium mb-1.5">
                Doctor Name *
              </label>
              <input
                id="apt-doctor"
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Arvind Kulkarni"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div>
              <label htmlFor="apt-specialty" className="block text-sm font-medium mb-1.5">
                Specialty
              </label>
              <input
                id="apt-specialty"
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. General Physician"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="apt-clinic" className="block text-sm font-medium mb-1.5">
                Hospital / Clinic *
              </label>
              <input
                id="apt-clinic"
                type="text"
                value={clinic}
                onChange={(e) => setClinic(e.target.value)}
                placeholder="e.g. Sahyadri Neighbourhood Clinic, Kothrud"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div>
              <label htmlFor="apt-date" className="block text-sm font-medium mb-1.5">
                Date *
              </label>
              <input
                id="apt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="apt-time" className="block text-sm font-medium mb-1.5">
                Time *
              </label>
              <input
                id="apt-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="apt-status" className="block text-sm font-medium mb-1.5">
                Status
              </label>
              <select
                id="apt-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="apt-notes" className="block text-sm font-medium mb-1.5">
                Appointment Notes
              </label>
              <textarea
                id="apt-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What to bring or questions to ask..."
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
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
                className="px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] text-sm font-medium hover:bg-[var(--secondary-sage)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C]"
              >
                {editingId ? 'Save Changes' : 'Save Appointment'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-white)] border border-[var(--border-hairline)] w-fit">
        {(['all', 'upcoming', 'past'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              filter === tab
                ? 'bg-[var(--deep-green)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab === 'past' ? 'Completed / Past' : tab}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <section className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-10 text-center">
            <p className="text-base text-[var(--text-secondary)]">
              No appointments found for this filter.
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="mt-4 px-4 py-2 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium"
            >
              Schedule an Appointment
            </button>
          </div>
        ) : (
          filtered.map((apt) => {
            const prep = state.appointmentPreps.find((p) => p.appointmentId === apt.id);
            return (
              <article
                key={apt.id}
                className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                      {apt.doctorName}
                    </h2>
                    <span className="text-sm text-[var(--text-secondary)]">{apt.specialty}</span>
                    <span
                      className={`text-xs font-medium capitalize ${
                        apt.status === 'upcoming'
                          ? 'text-[var(--deep-green)]'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      · {apt.status}
                    </span>
                    {prep && (
                      <span className="text-xs font-medium text-[var(--deep-green)]">
                        · {prep.approved ? 'Prep Approved' : 'Prep Draft'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[var(--text-secondary)] tabular-nums">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[var(--primary-sage)]" aria-hidden="true" />
                      {formatDisplayDate(apt.date)} at {formatTime12h(apt.time)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[var(--primary-sage)]" aria-hidden="true" />
                      {apt.clinic}
                    </span>
                  </div>

                  {apt.notes && (
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
                      {apt.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {apt.status === 'upcoming' && (
                    <>
                      <button
                        type="button"
                        onClick={() => openVisitPrep(apt)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--deep-green)] text-white text-xs font-medium hover:bg-[#2A493C] whitespace-nowrap"
                      >
                        <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{prep ? 'Edit Visit Prep' : 'Prepare Visit'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateAppointment(apt.id, { status: 'completed' })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--secondary-sage)] text-[var(--deep-green)] text-xs font-medium hover:bg-[#DCE7E0] whitespace-nowrap"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Mark Completed</span>
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => openEdit(apt)}
                    aria-label={`Edit appointment with ${apt.doctorName}`}
                    className="p-2 rounded-xl border border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--secondary-sage)]"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(apt)}
                    aria-label={`Delete appointment with ${apt.doctorName}`}
                    className="p-2 rounded-xl border border-[var(--border-hairline)] text-[#A6513A] hover:bg-[#F9F1ED]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete appointment?"
        description={`Remove the appointment with ${deleteTarget?.doctorName ?? ''} on ${deleteTarget ? formatDisplayDate(deleteTarget.date) : ''}?`}
        confirmLabel="Delete Appointment"
        destructive
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteAppointment(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};
