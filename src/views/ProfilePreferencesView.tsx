import React, { useState } from 'react';
import { Check, RotateCcw, ArrowRight } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { AppView, AssistantLanguage } from '../types/saanjh';
import { SafeImage } from '../components/SafeImage';
import { ConfirmDialog } from '../components/ConfirmDialog';

const DEMO_STEPS: { id: string; label: string; targetView: AppView; role?: 'senior' | 'family' }[] = [
  { id: 'step-1', label: '1. Meera opens the Senior Dashboard.', targetView: 'senior-dashboard', role: 'senior' },
  { id: 'step-2', label: '2. Checks her daily medicine schedule.', targetView: 'medicines', role: 'senior' },
  { id: 'step-3', label: '3. Marks a reminder as completed.', targetView: 'medicines', role: 'senior' },
  { id: 'step-4', label: '4. Reviews an upcoming appointment.', targetView: 'appointments', role: 'senior' },
  { id: 'step-5', label: '5. Completes a daily wellbeing check-in.', targetView: 'wellbeing', role: 'senior' },
  { id: 'step-6', label: '6. Asks Saanjh a question using voice or text.', targetView: 'voice-assistant', role: 'senior' },
  { id: 'step-7', label: '7. Opens the Privacy & Consent Center.', targetView: 'privacy', role: 'senior' },
  { id: 'step-8', label: '8. Changes a family sharing permission.', targetView: 'privacy', role: 'senior' },
  { id: 'step-9', label: '9. Switches to Ananya’s Family Dashboard.', targetView: 'family-dashboard', role: 'family' },
  { id: 'step-10', label: '10. Verifies that only permitted information is visible.', targetView: 'family-dashboard', role: 'family' },
];

export const ProfilePreferencesView: React.FC = () => {
  const {
    state,
    updateSeniorProfile,
    toggleDemoStep,
    resetDemoData,
    navigate,
    switchRole,
  } = useSaanjh();

  const [name, setName] = useState(state.seniorProfile.name);
  const [city, setCity] = useState(state.seniorProfile.city);
  const [emergencyNote, setEmergencyNote] = useState(state.seniorProfile.emergencyNote);
  const [preferredLanguage, setPreferredLanguage] = useState<AssistantLanguage>(
    state.seniorProfile.preferredLanguage
  );
  const [savedMsg, setSavedMsg] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateSeniorProfile({
      name: name.trim(),
      city: city.trim(),
      emergencyNote: emergencyNote.trim(),
      preferredLanguage,
    });
    setSavedMsg('Profile preferences updated locally.');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Profile &amp; Demo Walkthrough
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage fictional demo profile details or follow the guided Meera &amp; Ananya flow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setResetDialogOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm font-medium text-[var(--text-primary)] hover:bg-[#F9F1ED] transition-colors whitespace-nowrap shrink-0"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reset Demo Data</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Profile Preferences Form */}
        <section className="lg:col-span-6 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
          <div className="flex items-center gap-4 pb-5 border-b border-[var(--border-hairline)]">
            <SafeImage
              src={state.seniorProfile.avatarUrl}
              alt={state.seniorProfile.name}
              className="w-16 h-16 rounded-full object-cover border border-[var(--border-hairline)]"
              fallbackLabel="M"
            />
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
                {state.seniorProfile.name}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Age {state.seniorProfile.age} · Family contact: {state.familyProfile.name}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
            <div>
              <label htmlFor="prof-name" className="block text-sm font-medium mb-1.5">
                Senior Display Name
              </label>
              <input
                id="prof-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div>
              <label htmlFor="prof-city" className="block text-sm font-medium mb-1.5">
                City
              </label>
              <input
                id="prof-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              />
            </div>

            <div>
              <label htmlFor="prof-lang" className="block text-sm font-medium mb-1.5">
                Preferred Assistant Language
              </label>
              <select
                id="prof-lang"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as AssistantLanguage)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)]"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>

            <div>
              <label htmlFor="prof-note" className="block text-sm font-medium mb-1.5">
                Personal Care Note
              </label>
              <textarea
                id="prof-note"
                rows={2}
                value={emergencyNote}
                onChange={(e) => setEmergencyNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C]"
              >
                Save Preferences
              </button>
              {savedMsg && <span className="text-sm text-[var(--deep-green)]">{savedMsg}</span>}
            </div>
          </form>
        </section>

        {/* Interactive 10-Step Demo Flow */}
        <section className="lg:col-span-6 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
          <div className="pb-4 border-b border-[var(--border-hairline)]">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Meera &amp; Ananya Demo Checklist
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1 tabular-nums">
              {state.demoChecklistCompleted.length} of {DEMO_STEPS.length} steps explored
            </p>
          </div>

          <div className="divide-y divide-[var(--border-hairline)] mt-2">
            {DEMO_STEPS.map((step) => {
              const checked = state.demoChecklistCompleted.includes(step.id);
              return (
                <div key={step.id} className="py-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleDemoStep(step.id)}
                    className="flex items-center gap-3 text-left min-w-0"
                  >
                    <span
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        checked
                          ? 'bg-[var(--deep-green)] border-[var(--deep-green)] text-white'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-ivory)]'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </span>
                    <span
                      className={`text-sm ${
                        checked
                          ? 'line-through text-[var(--text-secondary)]'
                          : 'text-[var(--text-primary)]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (step.role && step.role !== state.activeRole) {
                        switchRole(step.role);
                      }
                      navigate(step.targetView);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[var(--deep-green)] hover:underline whitespace-nowrap shrink-0"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        title="Reset demo data?"
        description="This restores Meera and Ananya's fictional sample medicines, appointments, wellbeing check-ins, and privacy permissions back to their starting state."
        confirmLabel="Reset Sample Data"
        destructive
        onCancel={() => setResetDialogOpen(false)}
        onConfirm={() => {
          resetDemoData();
          setResetDialogOpen(false);
        }}
      />
    </div>
  );
};
