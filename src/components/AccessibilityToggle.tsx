import React from 'react';
import { useApp } from '../context/AppContext';
import { Eye, Check, Sparkles } from 'lucide-react';

interface AccessibilityToggleProps {
  compact?: boolean;
}

export const AccessibilityToggle: React.FC<AccessibilityToggleProps> = ({ compact = false }) => {
  const { accessibilityMode, setAccessibilityMode, language, t } = useApp();

  if (compact) {
    return (
      <button
        onClick={() => setAccessibilityMode(!accessibilityMode)}
        role="switch"
        aria-checked={accessibilityMode}
        aria-label={`${t('accessibilityModeLabel')}: ${accessibilityMode ? 'Enabled' : 'Disabled'}`}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
          accessibilityMode
            ? 'bg-[#294B3A] text-white border-[#294B3A] ring-2 ring-[#65866E]'
            : 'bg-[#FFFFFF] text-[#26372D] border-[#E7E9E2] hover:bg-[#F8F7F1]'
        }`}
        title="Toggle Senior Accessibility Mode"
      >
        <Eye className={`w-3.5 h-3.5 ${accessibilityMode ? 'text-[#F3DCCB]' : 'text-[#65866E]'}`} />
        <span>
          {accessibilityMode ? t('accessibilityActiveBadge') : t('accessibilityStandardBadge')}
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#E7E9E2]">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-xl ${accessibilityMode ? 'bg-[#294B3A] text-white' : 'bg-[#65866E]/15 text-[#294B3A]'}`}>
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm sm:text-base text-[#26372D]">
            {t('accessibilityModeLabel')}
          </h4>
          <p className="text-xs text-[#778078] mt-0.5 max-w-sm">
            {t('accessibilityModeDesc')}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={accessibilityMode}
        onClick={() => setAccessibilityMode(!accessibilityMode)}
        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-4 focus:ring-[#65866E] ${
          accessibilityMode ? 'bg-[#294B3A]' : 'bg-[#D1D8D0]'
        }`}
      >
        <span className="sr-only">Toggle accessibility mode</span>
        <span
          className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            accessibilityMode ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
