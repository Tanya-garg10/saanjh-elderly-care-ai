import React from 'react';
import { useSaanjh } from '../context/SaanjhContext';
import { AccessibilitySettings } from '../types/saanjh';

const A11Y_OPTIONS: {
  key: keyof AccessibilitySettings;
  title: string;
  description: string;
}[] = [
  {
    key: 'largeText',
    title: 'Larger Text',
    description: 'Increases base typography across headings, schedules, and buttons for comfortable reading.',
  },
  {
    key: 'highContrast',
    title: 'High Contrast',
    description: 'Deepens text, border, and focus outline contrast against clean white surfaces.',
  },
  {
    key: 'reducedMotion',
    title: 'Reduced Motion',
    description: 'Disables decorative animations and smooth scrolling for calm visual stability.',
  },
  {
    key: 'largeTouchTargets',
    title: 'Larger Touch Targets',
    description: 'Expands minimum button and control height to 48px for easier tapping.',
  },
  {
    key: 'simplifiedNav',
    title: 'Simplified Navigation',
    description: 'Shows only essential daily links in the navigation menu to reduce visual choices.',
  },
  {
    key: 'voiceAutoRead',
    title: 'Voice Assistance Read-Aloud',
    description: 'Automatically speaks Saanjh assistant replies aloud when browser speech synthesis is available.',
  },
];

export const AccessibilitySettingsView: React.FC = () => {
  const { state, updateAccessibility } = useSaanjh();

  return (
    <div className="space-y-8">
      <header className="pb-5 border-b border-[var(--border-hairline)]">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Accessibility Settings
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Customize text size, contrast, touch comfort, and navigation simplicity. Changes apply
          immediately and stay saved on this device.
        </p>
      </header>

      <section className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] divide-y divide-[var(--border-hairline)]">
        {A11Y_OPTIONS.map((opt) => {
          const enabled = state.accessibility[opt.key];
          return (
            <div
              key={opt.key}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="max-w-2xl">
                <h2 className="font-display text-base font-semibold text-[var(--text-primary)]">
                  {opt.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {opt.description}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={opt.title}
                onClick={() => updateAccessibility({ [opt.key]: !enabled })}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  enabled
                    ? 'bg-[var(--deep-green)] text-white'
                    : 'border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-[var(--text-primary)] hover:bg-[var(--secondary-sage)]'
                }`}
              >
                {enabled ? 'Enabled' : 'Off'}
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
};
