import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Languages,
  Mic,
  Eye,
  Menu,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  Shield,
  Heart,
} from 'lucide-react';
import { OfflineStatusBadge } from './OfflineStatusBadge';
import { AccessibilityToggle } from './AccessibilityToggle';

interface TopbarProps {
  onOpenMobileMenu: () => void;
  onOpenVoiceAssistant: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileMenu,
  onOpenVoiceAssistant,
}) => {
  const {
    role,
    seniorProfile,
    familyProfile,
    language,
    setLanguage,
    t,
    medicines,
    appointments,
    todayWellbeing,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);

  // Time-appropriate greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return t('greetingMorning');
    if (hours < 17) return t('greetingAfternoon');
    if (hours < 21) return t('greetingEvening');
    return t('greetingNight');
  };

  const formattedDate = new Date().toLocaleDateString(
    language === 'hi' ? 'hi-IN' : 'en-US',
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }
  );

  const isSenior = role === 'senior';
  const pendingMeds = medicines.filter((m) => m.status === 'upcoming');
  const notificationCount = pendingMeds.length + (todayWellbeing ? 0 : 1);

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E7E9E2] px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile burger + Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation menu"
          className="lg:hidden p-2 text-[#26372D] hover:bg-[#F8F7F1] rounded-xl border border-[#E7E9E2]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-[#778078]">
              {getGreeting()},
            </span>
            <h2 className="text-sm sm:text-lg font-bold text-[#26372D]">
              {isSenior
                ? language === 'hi'
                  ? seniorProfile.displayNameHi
                  : seniorProfile.displayName
                : language === 'hi'
                ? familyProfile.displayNameHi
                : familyProfile.displayName}
            </h2>
          </div>
          <p className="text-xs text-[#778078] capitalize">{formattedDate}</p>
        </div>
      </div>

      {/* Right: Quick Accessibility, Offline Status, Language, Voice & Alerts */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
        {/* Offline-First live status badge */}
        <OfflineStatusBadge />

        {/* Visible Accessibility Mode Toggle (Feature 6) */}
        <AccessibilityToggle compact />

        {/* Voice Quick Action Button for Seniors */}
        {isSenior && (
          <button
            onClick={onOpenVoiceAssistant}
            aria-label="Open Voice Assistant"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#294B3A] text-white font-semibold text-xs sm:text-sm hover:bg-[#1E372B] transition-all transform active:scale-95 shadow-xs"
          >
            <Mic className="w-4 h-4 text-[#F3DCCB]" />
            <span className="hidden sm:inline">{t('talkToSaanjh')}</span>
          </button>
        )}

        {/* Text Size / High Contrast Toggle */}
        <button
          onClick={() => {
            const nextSize =
              fontSize === 'standard' ? 'large' : fontSize === 'large' ? 'xlarge' : 'standard';
            setFontSize(nextSize);
          }}
          aria-label={`Toggle font size: current ${fontSize}`}
          className="p-2 sm:px-3 sm:py-2 text-xs font-bold rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-[#294B3A] hover:border-[#65866E]"
          title="Adjust Text Size"
        >
          <span className="font-extrabold text-sm sm:text-base">
            {fontSize === 'standard' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
          </span>
        </button>

        {/* Language switch */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-[#E7E9E2] bg-white text-[#26372D] hover:bg-[#F8F7F1]"
          title="Switch Language"
        >
          <Languages className="w-4 h-4 text-[#65866E]" />
          <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            className="relative p-2.5 rounded-xl border border-[#E7E9E2] bg-white text-[#26372D] hover:bg-[#F8F7F1]"
          >
            <Bell className="w-5 h-5 text-[#65866E]" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#65866E] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E7E9E2] p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E2]">
                <h4 className="font-bold text-sm text-[#26372D]">
                  {language === 'hi' ? 'आज की सूचनाएं' : 'Today’s Reminders'}
                </h4>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-[#778078] hover:text-[#26372D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                {pendingMeds.length > 0 ? (
                  pendingMeds.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-[#F8F7F1] border border-[#E7E9E2] flex items-start gap-3"
                    >
                      <div className="p-2 bg-[#65866E]/15 rounded-lg text-[#294B3A] shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#26372D]">
                          {m.name} ({m.reminderTime})
                        </p>
                        <p className="text-xs text-[#778078] mt-0.5">
                          {m.instructions || 'Scheduled reminder'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All medicines scheduled for today are taken!</span>
                  </div>
                )}

                {!todayWellbeing && (
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs flex items-center gap-2">
                    <Heart className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>You haven't recorded your daily wellbeing check-in yet.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
