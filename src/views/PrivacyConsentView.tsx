import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, ArrowRight, Info } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { PrivacyPermissions } from '../types/saanjh';
import { ConfirmDialog } from '../components/ConfirmDialog';

const PERMISSION_ITEMS: {
  key: keyof PrivacyPermissions;
  title: string;
  sharedDescription: string;
}[] = [
  {
    key: 'medicines',
    title: 'Medicine Updates',
    sharedDescription:
      'Allows family to see which scheduled medicines are active and whether you confirmed them today.',
  },
  {
    key: 'appointments',
    title: 'Appointment Information',
    sharedDescription:
      'Shares upcoming doctor names, clinic locations, times, and preparation notes.',
  },
  {
    key: 'wellbeing',
    title: 'Wellbeing Check-ins',
    sharedDescription:
      'Shares your daily mood selections and optional reflection notes with family.',
  },
  {
    key: 'insights',
    title: 'Routine Insights',
    sharedDescription:
      'Shares gentle pattern summaries such as weekly check-in frequency or reminder completion rates.',
  },
  {
    key: 'documents',
    title: 'Health Document Vault',
    sharedDescription:
      'Allows family to view prescriptions and lab reports you marked as shared in your Document Vault.',
  },
  {
    key: 'careCircle',
    title: 'Family Care Circle Coordination',
    sharedDescription:
      'Allows invited family members to coordinate caregiving tasks and shared visit calendars.',
  },
  {
    key: 'generalActivity',
    title: 'General Activity Updates',
    sharedDescription:
      'Shares a brief timeline of recent confirmations and updates across permitted categories.',
  },
];

export const PrivacyConsentView: React.FC = () => {
  const {
    state,
    togglePrivacyPermission,
    revokeAllPrivacyPermissions,
    switchRole,
  } = useSaanjh();
  const [revokeAllDialog, setRevokeAllDialog] = useState(false);

  const totalCategories = PERMISSION_ITEMS.length;
  const sharedCount = Object.values(state.privacy).filter(Boolean).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Privacy &amp; Consent Center
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Decide exactly what {state.familyProfile.name} and your Care Circle can view.
          </p>
        </div>

        <button
          type="button"
          onClick={() => switchRole('family')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] transition-colors whitespace-nowrap shrink-0"
        >
          <span>Verify in Family View</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </header>

      <div className="rounded-2xl bg-[var(--secondary-sage)] border border-[var(--border-hairline)] px-5 py-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[var(--deep-green)] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
          <span className="font-semibold">Immediate consent enforcement:</span> Turning off any
          switch below immediately hides that category across Family views. In this local
          prototype, permissions are enforced in client state; production deployment requires
          server-side authorization and authenticated API access checks.
        </p>
      </div>

      {/* Privacy Summary Strip */}
      <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-[var(--deep-green)] shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Privacy Summary
            </h2>
            <p className="text-sm text-[var(--text-secondary)] tabular-nums">
              Currently sharing {sharedCount} of {totalCategories} categories with family
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRevokeAllDialog(true)}
          disabled={sharedCount === 0}
          className="px-4 py-2.5 rounded-xl border border-[#E8D5CD] bg-[#F9F1ED] text-sm font-medium text-[#9B543C] hover:bg-[#F3E5DE] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
        >
          Revoke All Access
        </button>
      </section>

      {/* Granular Sharing Toggles */}
      <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
        {PERMISSION_ITEMS.map((item) => {
          const enabled = state.privacy[item.key];
          return (
            <div
              key={item.key}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  {enabled ? (
                    <Eye className="w-4 h-4 text-[var(--deep-green)]" aria-hidden="true" />
                  ) : (
                    <Lock className="w-4 h-4 text-[var(--text-secondary)]" aria-hidden="true" />
                  )}
                  <h3 className="font-display text-base font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <span
                    className={`text-xs font-medium ${
                      enabled ? 'text-[var(--deep-green)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    · {enabled ? 'Shared' : 'Private'}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.sharedDescription}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`Toggle sharing for ${item.title}`}
                onClick={() => togglePrivacyPermission(item.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  enabled
                    ? 'bg-[var(--deep-green)] text-white hover:bg-[#2A493C]'
                    : 'border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-[var(--text-primary)] hover:bg-[var(--secondary-sage)]'
                }`}
              >
                {enabled ? 'Shared · Pause Access' : 'Private · Allow Sharing'}
              </button>
            </div>
          );
        })}
      </section>

      {/* Recent Consent Log */}
      <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6">
        <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] pb-3 border-b border-[var(--border-hairline)]">
          Recent Consent Changes
        </h2>
        <div className="divide-y divide-[var(--border-hairline)] mt-2">
          {state.privacyLogs.slice(0, 6).map((log) => (
            <div
              key={log.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
            >
              <span className="text-[var(--text-primary)]">{log.note}</span>
              <span className="text-xs text-[var(--text-secondary)] tabular-nums shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </section>

      <ConfirmDialog
        open={revokeAllDialog}
        title="Pause all family sharing?"
        description={`This will immediately hide all seven care categories from ${state.familyProfile.name} and your Care Circle until you turn them back on.`}
        confirmLabel="Revoke All Access"
        destructive
        onCancel={() => setRevokeAllDialog(false)}
        onConfirm={() => {
          revokeAllPrivacyPermissions();
          setRevokeAllDialog(false);
        }}
      />
    </div>
  );
};
