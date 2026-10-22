import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartHandshake,
  User,
  Users,
  ShieldCheck,
  Languages,
  Mic,
  CalendarCheck,
  Heart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import { OfflineStatusBadge } from '../components/OfflineStatusBadge';
import { AccessibilityToggle } from '../components/AccessibilityToggle';

export const Welcome: React.FC = () => {
  const { setRole, language, setLanguage, t, seniorProfile, familyProfile } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F7F1] flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Bar with Language Switcher & Accessibility & Offline Status */}
      <div className="max-w-5xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E9E2]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#294B3A] flex items-center justify-center text-white shadow-xs">
            <HeartHandshake className="w-5 h-5 text-[#F3DCCB]" />
          </div>
          <span className="text-2xl font-black text-[#26372D] tracking-tight">
            {t('appTitle')}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <OfflineStatusBadge />
          <AccessibilityToggle compact />

          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                language === 'en'
                  ? 'bg-[#294B3A] text-white shadow-xs'
                  : 'bg-white text-[#26372D] border border-[#E7E9E2]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                language === 'hi'
                  ? 'bg-[#294B3A] text-white shadow-xs'
                  : 'bg-white text-[#26372D] border border-[#E7E9E2]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto w-full my-auto py-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#65866E]/10 border border-[#65866E]/20 text-[#294B3A] text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#65866E]" />
          <span>Care that stays close, even when family can't</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#26372D] tracking-tight leading-tight">
          {language === 'hi' ? (
            <>
              अपनों की देखभाल, <br />
              <span className="text-[#65866E]">स्वतंत्रता और पूर्ण सहमति</span> के साथ।
            </>
          ) : (
            <>
              Gentle routine support for seniors. <br />
              <span className="text-[#65866E]">Peace of mind for families.</span>
            </>
          )}
        </h1>

        <p className="mt-5 text-base sm:text-xl text-[#778078] max-w-2xl mx-auto leading-relaxed">
          {t('subTagline')}
        </p>

        {/* Core Differentiator Callout: Consent Before Care */}
        <div className="mt-8 max-w-xl mx-auto p-4 rounded-2xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-xs flex items-center gap-3 text-left">
          <div className="p-3 bg-[#65866E]/15 rounded-xl text-[#294B3A] shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#65866E]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#26372D]">
              {language === 'hi' ? 'देखभाल से पहले सहमति (Consent Before Care)' : 'Core Principle: Consent Before Care'}
            </h4>
            <p className="text-xs text-[#778078] mt-0.5">
              {language === 'hi'
                ? 'वरिष्ठ नागरिक स्वयं तय करते हैं कि परिवार क्या देख सकता है और कब। कोई जासूसी या निरंतर निगरानी नहीं।'
                : 'The senior decides what information is shared, who can access it, and when sharing is permitted.'}
            </p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Card 1: Senior Role */}
          <div
            onClick={() => setRole('senior')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setRole('senior')}
            className="group relative bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#E7E9E2] hover:border-[#65866E] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#65866E]/15 text-[#294B3A] flex items-center justify-center group-hover:bg-[#294B3A] group-hover:text-white transition-colors">
                  <User className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F8F7F1] text-[#778078] border border-[#E7E9E2]">
                  Demo: {seniorProfile.displayName} (Age 74)
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#26372D] group-hover:text-[#294B3A] transition-colors">
                {t('seniorRole')}
              </h3>

              <p className="mt-2 text-sm sm:text-base text-[#778078] leading-relaxed">
                {t('seniorRoleDesc')}
              </p>

              {/* Feature pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F8F7F1] text-[#294B3A]">
                  <Mic className="w-3.5 h-3.5 text-[#65866E]" />
                  Voice Assistant
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F8F7F1] text-[#294B3A]">
                  <CalendarCheck className="w-3.5 h-3.5 text-[#65866E]" />
                  Large Buttons
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F8F7F1] text-[#294B3A]">
                  <Heart className="w-3.5 h-3.5 text-[#65866E]" />
                  Daily Wellbeing
                </span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#E7E9E2] flex items-center justify-between font-bold text-sm text-[#294B3A]">
              <span>{language === 'hi' ? 'वरिष्ठ नागरिक के रूप में प्रवेश करें' : 'Enter Senior Experience'}</span>
              <div className="w-8 h-8 rounded-full bg-[#65866E]/10 flex items-center justify-center group-hover:bg-[#294B3A] group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Family Member Role */}
          <div
            onClick={() => setRole('family')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setRole('family')}
            className="group relative bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#E7E9E2] hover:border-[#65866E] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#E9E5F4] text-[#4A3E72] flex items-center justify-center group-hover:bg-[#4A3E72] group-hover:text-white transition-colors">
                  <Users className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F8F7F1] text-[#778078] border border-[#E7E9E2]">
                  Demo: {familyProfile.displayName} ({familyProfile.relationship})
                </span>
              </div>

              <h3 className="mt-6 text-2xl font-bold text-[#26372D] group-hover:text-[#294B3A] transition-colors">
                {t('familyRole')}
              </h3>

              <p className="mt-2 text-sm sm:text-base text-[#778078] leading-relaxed">
                {t('familyRoleDesc')}
              </p>

              {/* Feature pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F8F7F1] text-[#294B3A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#65866E]" />
                  Consent Protected
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F8F7F1] text-[#294B3A]">
                  <CalendarCheck className="w-3.5 h-3.5 text-[#65866E]" />
                  Adherence Trends
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F8F7F1] text-[#294B3A]">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#65866E]" />
                  Care Coordination
                </span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-[#E7E9E2] flex items-center justify-between font-bold text-sm text-[#4A3E72]">
              <span>{language === 'hi' ? 'परिवार सदस्य के रूप में प्रवेश करें' : 'Enter Family Overview'}</span>
              <div className="w-8 h-8 rounded-full bg-[#E9E5F4] flex items-center justify-center group-hover:bg-[#4A3E72] group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Demo Mode Reassurance */}
        <p className="mt-10 text-xs text-[#778078] max-w-lg mx-auto">
          {language === 'hi'
            ? 'सांझ एक देखभाल-समन्वय सहायक है, यह आपातकालीन चिकित्सा सेवा या डॉक्टरों का विकल्प नहीं है।'
            : 'Saanjh is a care-coordination assistant, not a replacement for doctors or emergency services. Demo data is stored locally in your browser.'}
        </p>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full pt-6 border-t border-[#E7E9E2] flex flex-col sm:flex-row items-center justify-between text-xs text-[#778078] gap-3">
        <p>© 2026 Saanjh AI. Built for accessibility, dignity, and family harmony.</p>
        <div className="flex items-center gap-4">
          <span>Hindi & English Supported</span>
          <span>•</span>
          <span>Zero-tracking Privacy</span>
        </div>
      </div>
    </div>
  );
};
