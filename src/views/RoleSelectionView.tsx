import React from 'react';
import { ArrowLeft, UserCheck, Users, ArrowRight } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { ASSETS } from '../data/seedData';
import { SafeImage } from '../components/SafeImage';

export const RoleSelectionView: React.FC = () => {
  const { navigate, loginAsDemo } = useSaanjh();

  return (
    <div className="min-h-screen bg-[var(--bg-ivory)] px-6 py-10">
      <div className="max-w-[960px] mx-auto">
        <button
          type="button"
          onClick={() => navigate('auth')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--deep-green)]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Sign In</span>
        </button>

        <div className="mt-8 max-w-2xl">
          <p className="text-sm font-medium text-[var(--deep-green)]">Choose Experience</p>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
            How would you like to view Saanjh?
          </h1>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
            You can switch seamlessly between Meera&apos;s senior experience and Ananya&apos;s
            family view at any time to verify how privacy permissions work in real time.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4">
                <SafeImage
                  src={ASSETS.meeraAvatar}
                  alt="Meera Sharma"
                  className="w-16 h-16 rounded-full object-cover border border-[var(--border-hairline)]"
                  fallbackLabel="Meera"
                />
                <UserCheck className="w-6 h-6 text-[var(--deep-green)]" aria-hidden="true" />
              </div>

              <h2 className="mt-6 font-display text-2xl font-semibold text-[var(--text-primary)]">
                Senior Experience
              </h2>
              <p className="mt-1 text-sm font-medium text-[var(--deep-green)]">
                Meera Sharma · Age 68
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                View today&apos;s medicine reminders, manage upcoming doctor appointments, log a
                daily wellbeing reflection, talk to the voice assistant, and control exactly what
                Ananya can see.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loginAsDemo('senior')}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[var(--deep-green)] text-white text-base font-medium hover:bg-[#2A493C] transition-colors"
            >
              <span>Enter Senior Dashboard</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4">
                <SafeImage
                  src={ASSETS.ananyaAvatar}
                  alt="Ananya Sharma"
                  className="w-16 h-16 rounded-full object-cover border border-[var(--border-hairline)]"
                  fallbackLabel="Ananya"
                />
                <Users className="w-6 h-6 text-[var(--accent-terracotta)]" aria-hidden="true" />
              </div>

              <h2 className="mt-6 font-display text-2xl font-semibold text-[var(--text-primary)]">
                Family Coordination View
              </h2>
              <p className="mt-1 text-sm font-medium text-[var(--accent-terracotta)]">
                Ananya Sharma · Daughter
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)]">
                Check shared care updates, upcoming visits, and gentle routine summaries—only for
                categories Meera has explicitly chosen to share.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loginAsDemo('family')}
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-[var(--text-primary)] text-base font-medium hover:bg-[var(--secondary-sage)] transition-colors"
            >
              <span>Enter Family Dashboard</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
