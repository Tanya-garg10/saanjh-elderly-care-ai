import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { ASSETS } from '../data/seedData';
import { SafeImage } from '../components/SafeImage';

export const AuthView: React.FC = () => {
  const { navigate, loginAsDemo } = useSaanjh();
  const [nameInput, setNameInput] = useState('');
  const [formError, setFormError] = useState('');

  const handleCustomContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setFormError('Please enter your name or choose one of the ready demo profiles below.');
      return;
    }
    setFormError('');
    navigate('role-select');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-ivory)] flex flex-col justify-between px-6 py-8">
      <div className="max-w-[1000px] w-full mx-auto">
        <button
          type="button"
          onClick={() => navigate('landing')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--deep-green)]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Saanjh</span>
        </button>
      </div>

      <div className="max-w-[960px] w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-8">
          <p className="text-sm font-medium text-[var(--deep-green)]">Local Demo Access</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-[var(--text-primary)]">
            Welcome to Saanjh
          </h1>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
            Choose a fictional demo profile to explore the complete Senior and Family coordination
            flow right away.
          </p>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={() => loginAsDemo('senior')}
              className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] hover:border-[var(--deep-green)] hover:bg-[var(--secondary-sage)] transition-colors text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <SafeImage
                  src={ASSETS.meeraAvatar}
                  alt="Meera Sharma"
                  className="w-12 h-12 rounded-full object-cover border border-[var(--border-hairline)] shrink-0"
                  fallbackLabel="M"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-primary)]">
                    Continue as Meera Sharma
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Senior · Age 68 · Pune
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--deep-green)] shrink-0" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => loginAsDemo('family')}
              className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] hover:border-[var(--deep-green)] hover:bg-[var(--secondary-sage)] transition-colors text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                <SafeImage
                  src={ASSETS.ananyaAvatar}
                  alt="Ananya Sharma"
                  className="w-12 h-12 rounded-full object-cover border border-[var(--border-hairline)] shrink-0"
                  fallbackLabel="A"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-primary)]">
                    Continue as Ananya Sharma
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Family Member · Daughter · Bengaluru
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--deep-green)] shrink-0" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--border-hairline)] flex items-start gap-3 text-xs text-[var(--text-secondary)] leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-[var(--deep-green)] shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              Offline-first MVP: Demo profiles and changes are persisted in your browser&apos;s{' '}
              <code>localStorage</code>. Production deployment requires server-side authentication.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-8">
          <h2 className="font-display text-xl font-semibold text-[var(--text-primary)]">
            Or select a role step-by-step
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            Want to preview the Role Selection screen before entering? Enter a quick session label
            or continue directly to role selection.
          </p>

          <form onSubmit={handleCustomContinue} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="demo-name"
                className="block text-sm font-medium text-[var(--text-primary)] mb-1.5"
              >
                Your Name (optional for demo)
              </label>
              <input
                id="demo-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Meera Sharma"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-[var(--text-primary)]"
              />
              {formError && <p className="mt-2 text-sm text-[#A6513A]">{formError}</p>}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] transition-colors"
              >
                Continue to Role Selection
              </button>
              <button
                type="button"
                onClick={() => navigate('role-select')}
                className="px-5 py-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] transition-colors"
              >
                Skip to Role Selection
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-[1000px] w-full mx-auto text-center text-xs text-[var(--text-secondary)]">
        Saanjh · Care without constant surveillance
      </div>
    </div>
  );
};
