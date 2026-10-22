import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TextSize, Language } from '../types';
import { Modal } from '../components/Modal';
import {
  Settings as SettingsIcon,
  Languages,
  Eye,
  Volume2,
  VolumeX,
  User,
  Users,
  RotateCcw,
  ShieldCheck,
  Check,
  Sparkles,
  HardDrive,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { AccessibilityToggle } from '../components/AccessibilityToggle';

export const Settings: React.FC = () => {
  const {
    seniorProfile,
    familyProfile,
    language,
    setLanguage,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    voiceSpeechEnabled,
    setVoiceSpeechEnabled,
    resetDemoData,
    setActivePage,
    t,
  } = useApp();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#F8F7F1] rounded-xl text-[#294B3A] border border-[#E7E9E2]">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26372D]">
            {t('settingsTitle')}
          </h1>
        </div>
        <p className="text-sm text-[#778078] mt-1">
          {language === 'hi'
            ? 'अपनी पसंद की भाषा, अक्षरों का आकार और आवाज विकल्प चुनें।'
            : 'Personalize language, text sizing, accessibility preferences, and audio synthesis.'}
        </p>
      </div>

      {/* 1. Language Preference */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <Languages className="w-5 h-5 text-[#65866E]" />
          <h3 className="text-lg font-bold text-[#26372D]">{t('languagePref')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setLanguage('en')}
            className={`p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
              language === 'en'
                ? 'border-[#294B3A] bg-[#65866E]/10 ring-2 ring-[#294B3A]'
                : 'border-[#E7E9E2] hover:border-[#65866E] bg-white'
            }`}
          >
            <div>
              <span className="font-bold text-base text-[#26372D]">English</span>
              <p className="text-xs text-[#778078] mt-0.5">
                Application and voice in English
              </p>
            </div>
            {language === 'en' && <Check className="w-5 h-5 text-[#294B3A]" />}
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
              language === 'hi'
                ? 'border-[#294B3A] bg-[#65866E]/10 ring-2 ring-[#294B3A]'
                : 'border-[#E7E9E2] hover:border-[#65866E] bg-white'
            }`}
          >
            <div>
              <span className="font-bold text-base text-[#26372D]">हिन्दी (Hindi)</span>
              <p className="text-xs text-[#778078] mt-0.5">
                एप्लिकेशन और आवाज सहायता हिंदी में
              </p>
            </div>
            {language === 'hi' && <Check className="w-5 h-5 text-[#294B3A]" />}
          </button>
        </div>
      </div>

      {/* 2. Accessibility & Typography Readability */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Eye className="w-5 h-5 text-[#65866E]" />
            <h3 className="text-lg font-bold text-[#26372D]">{t('textSizePref')}</h3>
          </div>
          <p className="text-xs text-[#778078]">
            Enhance reading comfort across all screens and medicine cards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(
            [
              { id: 'standard', label: t('textStandard'), sample: '16px Default' },
              { id: 'large', label: t('textLarge'), sample: '18px Comfortable' },
              { id: 'xlarge', label: t('textXLarge'), sample: '20px Senior Readability' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFontSize(item.id as TextSize)}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                fontSize === item.id
                  ? 'border-[#294B3A] bg-[#65866E]/10 ring-2 ring-[#294B3A]'
                  : 'border-[#E7E9E2] hover:border-[#65866E] bg-white'
              }`}
            >
              <div className="font-bold text-base text-[#26372D]">{item.label}</div>
              <div className="text-xs text-[#778078] mt-1">{item.sample}</div>
            </button>
          ))}
        </div>

        {/* Accessibility Mode Toggle (Feature 6) */}
        <AccessibilityToggle />

        {/* High contrast switch */}
        <div className="pt-4 border-t border-[#E7E9E2] flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#26372D]">{t('contrastPref')}</h4>
            <p className="text-xs text-[#778078]">
              Deepens text colors and outlines for enhanced visual clarity.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={highContrast}
            onClick={() => setHighContrast(!highContrast)}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              highContrast ? 'bg-[#294B3A]' : 'bg-[#D1D8D0]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                highContrast ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 3. Audio & Voice Responses */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#65866E]/15 rounded-2xl text-[#294B3A]">
            {voiceSpeechEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#26372D]">
              {t('spokenAudioPref')}
            </h3>
            <p className="text-xs sm:text-sm text-[#778078] mt-0.5">
              Read responses aloud automatically using calming Indian English or Hindi speech synthesis.
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={voiceSpeechEnabled}
          onClick={() => setVoiceSpeechEnabled(!voiceSpeechEnabled)}
          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            voiceSpeechEnabled ? 'bg-[#294B3A]' : 'bg-[#D1D8D0]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              voiceSpeechEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 4. Profile & Connected Family Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-[#65866E]" />
            <h3 className="text-base font-bold text-[#26372D]">{t('profileDetails')}</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-[#E7E9E2]">
              <span className="text-[#778078]">Full Name:</span>
              <span className="font-bold text-[#26372D]">{seniorProfile.displayName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E7E9E2]">
              <span className="text-[#778078]">Age:</span>
              <span className="font-bold text-[#26372D]">{seniorProfile.age} years</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E7E9E2]">
              <span className="text-[#778078]">Location:</span>
              <span className="font-bold text-[#26372D]">{seniorProfile.city}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-[#65866E]" />
            <h3 className="text-base font-bold text-[#26372D]">Family Contact</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-[#E7E9E2]">
              <span className="text-[#778078]">Designated Member:</span>
              <span className="font-bold text-[#26372D]">{familyProfile.displayName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E7E9E2]">
              <span className="text-[#778078]">Relationship:</span>
              <span className="font-bold text-[#26372D]">{familyProfile.relationship}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#E7E9E2]">
              <span className="text-[#778078]">Location:</span>
              <span className="font-bold text-[#26372D]">{familyProfile.city}</span>
            </div>
          </div>
          <button
            onClick={() => setActivePage('privacy')}
            className="mt-4 text-xs font-bold text-[#294B3A] hover:underline flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#65866E]" />
            <span>Manage sharing permissions in Privacy Center</span>
          </button>
        </div>
      </div>

      {/* 5. Offline-First Storage Architecture (Feature 2) */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-800">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#26372D]">
              Offline-First Local Data Storage
            </h3>
            <p className="text-xs text-[#778078] mt-0.5">
              {t('offlineStorageExplained')}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#E7E9E2] text-xs space-y-2 text-[#26372D]">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Local Persistence Engine:</span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-[#E7E9E2] font-mono text-[11px]">
              Browser localStorage
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Offline Access Support:</span>
            <span className="text-emerald-700 font-bold">100% Functional Without Internet</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">Backend Cloud Synchronization:</span>
            <span className="text-[#778078]">Local Demo Mode (No Remote DB Claimed)</span>
          </div>
        </div>
      </div>

      {/* 6. Reset Demo Data */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#26372D]">{t('resetDemoData')}</h3>
          <p className="text-xs text-[#778078] mt-0.5">
            Restores initial sample medicines, upcoming appointments, and default privacy settings.
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-700 font-bold text-xs sm:text-sm hover:bg-red-50 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <Modal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          title={t('resetDemoData')}
          subtitle={t('resetConfirm')}
        >
          <div className="space-y-4">
            <p className="text-sm text-[#778078]">
              All local modifications will be cleared and reset to Meera Sharma's default demo records.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E7E9E2] text-sm text-[#778078]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
