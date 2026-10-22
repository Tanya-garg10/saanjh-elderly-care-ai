import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { MedicineCard } from '../components/MedicineCard';
import { AppointmentCard } from '../components/AppointmentCard';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';
import { Modal } from '../components/Modal';
import { OneTapHelpModal } from '../components/OneTapHelpModal';
import { RoutineInsightsCard } from '../components/RoutineInsightsCard';
import { WellbeingMood } from '../types';
import {
  Mic,
  CalendarDays,
  Pill,
  Calendar,
  Heart,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Lock,
  Unlock,
  LifeBuoy,
} from 'lucide-react';

export const SeniorDashboard: React.FC = () => {
  const {
    seniorProfile,
    medicines,
    appointments,
    wellbeingLogs,
    todayWellbeing,
    addWellbeingCheckIn,
    consentSettings,
    activeHelpRequest,
    resolveHelpRequest,
    setActivePage,
    language,
    t,
  } = useApp();

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<WellbeingMood | null>(null);
  const [wellbeingNote, setWellbeingNote] = useState('');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Derive stats dynamically from state
  const totalMedsToday = medicines.length;
  const takenMedsToday = medicines.filter((m) => m.status === 'taken').length;
  const pendingMedsToday = medicines.filter((m) => m.status === 'upcoming').length;
  const upcomingAppointments = appointments.filter((a) => a.status === 'upcoming');

  const handleSaveWellbeing = (mood: WellbeingMood) => {
    addWellbeingCheckIn(mood, wellbeingNote);
    setSelectedMood(null);
    setWellbeingNote('');
  };

  const activeSharedCount = [
    consentSettings.medicineStatusSharing,
    consentSettings.wellbeingSummarySharing,
    consentSettings.appointmentSharing,
    consentSettings.activitySharing,
  ].filter(Boolean).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Active Help Request Status Banner (Feature 1) */}
      {activeHelpRequest && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-200/80 rounded-xl text-rose-800 shrink-0">
              <LifeBuoy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-rose-900">
                  {t('helpActiveBanner')}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-800">
                  Demo
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                {t('helpActiveSub')} (Requested at {new Date(activeHelpRequest.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => resolveHelpRequest(activeHelpRequest.id)}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors shadow-xs"
            >
              {t('resolveHelpRequest')}
            </button>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-900 font-semibold text-xs hover:bg-rose-100"
            >
              View Options
            </button>
          </div>
        </div>
      )}

      {/* 1. Main Welcome Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#294B3A] to-[#1E372B] text-white rounded-3xl p-6 sm:p-10 shadow-lg">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#65866E]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F3DCCB] text-xs font-bold tracking-wide uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'नमस्ते मीरा जी' : 'Welcome Home, Meera ji'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {t('welcomeHeading')}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal">
            {t('welcomeSubheading')}
          </p>

          {/* Primary & Secondary Actions + ONE-TAP HELP BUTTON */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => setIsVoiceOpen(true)}
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#65866E] text-white font-bold text-base sm:text-lg hover:bg-[#53725b] transition-all transform active:scale-95 shadow-lg border border-white/20"
            >
              <Mic className="w-6 h-6 text-[#F3DCCB]" />
              <span>{t('talkToSaanjh')}</span>
            </button>

            {/* ONE-TAP HELP (Feature 1) */}
            <button
              onClick={() => setIsHelpModalOpen(true)}
              aria-label="I Need Help - Open Assistance Confirmation"
              className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-base sm:text-lg shadow-lg border border-rose-400/40 transition-all transform active:scale-95"
            >
              <LifeBuoy className="w-6 h-6 text-rose-200" />
              <span>{t('iNeedHelp')}</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('today-medicines-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/15 transition-colors"
            >
              <CalendarDays className="w-5 h-5" />
              <span>{t('todaySchedule')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={t('medicinesToday')}
          value={totalMedsToday}
          subtitle={`${takenMedsToday} taken • ${pendingMedsToday} pending`}
          icon={<Pill className="w-6 h-6" />}
          accentColor="sage"
          onClick={() => setActivePage('medicines')}
          badge="Routine"
        />

        <StatCard
          title={t('takenToday')}
          value={takenMedsToday}
          subtitle={
            totalMedsToday > 0
              ? `${Math.round((takenMedsToday / totalMedsToday) * 100)}% completed today`
              : 'No medicines'
          }
          icon={<CheckCircle2 className="w-6 h-6" />}
          accentColor="forest"
          onClick={() => setActivePage('medicines')}
        />

        <StatCard
          title={t('appointmentsUpcoming')}
          value={upcomingAppointments.length}
          subtitle={
            upcomingAppointments.length > 0
              ? `${upcomingAppointments[0].doctorName}`
              : 'None scheduled'
          }
          icon={<Calendar className="w-6 h-6" />}
          accentColor="lavender"
          onClick={() => setActivePage('appointments')}
        />

        <StatCard
          title={t('wellbeingStatus')}
          value={
            todayWellbeing
              ? todayWellbeing.response === 'well'
                ? 'Well 😊'
                : todayWellbeing.response === 'okay'
                ? 'Okay 😐'
                : 'Need Support 🫂'
              : 'Pending'
          }
          subtitle={todayWellbeing ? 'Checked in today' : 'Tap to record mood'}
          icon={<Heart className="w-6 h-6" />}
          accentColor="peach"
          onClick={() => setActivePage('wellbeing')}
          badge={todayWellbeing ? 'Recorded' : 'Action needed'}
        />
      </div>

      {/* 3. Daily Wellbeing Check-in Card */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E9E2] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#65866E]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#26372D]">
                {t('howAreYouFeeling')}
              </h2>
            </div>
            <p className="text-sm text-[#778078] mt-1">
              {todayWellbeing
                ? language === 'hi'
                  ? 'आपने आज का स्वास्थ्य हाल-चाल दर्ज कर लिया है।'
                  : 'You have already recorded your check-in for today.'
                : language === 'hi'
                ? 'कृपया एक विकल्प चुनें और अपनी सेहत का हाल बताएं।'
                : 'Tap a button below to let Saanjh know how your day is going.'}
            </p>
          </div>

          {todayWellbeing && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#65866E]/15 text-[#294B3A] text-xs font-bold self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4" />
              {todayWellbeing.response === 'well'
                ? t('feelingWell')
                : todayWellbeing.response === 'okay'
                ? t('feelingOkay')
                : t('feelingSupport')}
            </span>
          )}
        </div>

        {/* 3 Accessible Mood Options */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Well */}
          <button
            onClick={() => handleSaveWellbeing('well')}
            className={`p-5 rounded-2xl border-2 text-left transition-all transform active:scale-95 flex flex-col justify-between ${
              todayWellbeing?.response === 'well'
                ? 'border-[#65866E] bg-[#65866E]/10 ring-2 ring-[#65866E]'
                : 'border-[#E7E9E2] hover:border-[#65866E] bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">😊</span>
              <Smile className="w-5 h-5 text-[#65866E]" />
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-bold text-[#26372D]">{t('feelingWell')}</h4>
              <p className="text-xs text-[#778078] mt-1">{t('wellDesc')}</p>
            </div>
          </button>

          {/* Okay */}
          <button
            onClick={() => handleSaveWellbeing('okay')}
            className={`p-5 rounded-2xl border-2 text-left transition-all transform active:scale-95 flex flex-col justify-between ${
              todayWellbeing?.response === 'okay'
                ? 'border-[#7A431D] bg-[#F3DCCB]/30 ring-2 ring-[#7A431D]'
                : 'border-[#E7E9E2] hover:border-[#7A431D] bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">😐</span>
              <Meh className="w-5 h-5 text-[#7A431D]" />
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-bold text-[#26372D]">{t('feelingOkay')}</h4>
              <p className="text-xs text-[#778078] mt-1">{t('okayDesc')}</p>
            </div>
          </button>

          {/* Need Support */}
          <button
            onClick={() => {
              handleSaveWellbeing('support');
              setIsEmergencyModalOpen(true);
            }}
            className={`p-5 rounded-2xl border-2 text-left transition-all transform active:scale-95 flex flex-col justify-between ${
              todayWellbeing?.response === 'support'
                ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600'
                : 'border-[#E7E9E2] hover:border-amber-500 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">🫂</span>
              <Frown className="w-5 h-5 text-amber-700" />
            </div>
            <div className="mt-4">
              <h4 className="text-lg font-bold text-amber-900">{t('feelingSupport')}</h4>
              <p className="text-xs text-[#778078] mt-1">{t('supportDesc')}</p>
            </div>
          </button>
        </div>

        {/* Existing note or input note */}
        {todayWellbeing?.note && (
          <div className="mt-4 p-3 rounded-xl bg-[#F8F7F1] text-xs sm:text-sm text-[#26372D] border border-[#E7E9E2]">
            <span className="font-bold text-[#778078]">Note: </span>
            {todayWellbeing.note}
          </div>
        )}
      </div>

      {/* Routine Change Insights (Feature 3) */}
      <RoutineInsightsCard />

      {/* 4. Today's Medicine Schedule */}
      <div id="today-medicines-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-6 h-6 text-[#65866E]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#26372D]">
              {language === 'hi' ? 'आज की दवाइयां' : 'Today’s Medicines'}
            </h2>
          </div>
          <button
            onClick={() => setActivePage('medicines')}
            className="flex items-center gap-1 text-sm font-bold text-[#294B3A] hover:underline"
          >
            <span>{language === 'hi' ? 'सभी प्रबंधित करें' : 'Manage All'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {medicines.map((med) => (
            <MedicineCard key={med.id} medicine={med} compact />
          ))}
        </div>
      </div>

      {/* 5. Two Column Split: Upcoming Appointment & Family Privacy Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments preview */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#65866E]" />
                <h3 className="text-lg font-bold text-[#26372D]">
                  {language === 'hi' ? 'आगामी डॉक्टर मुलाकात' : 'Next Doctor Visit'}
                </h3>
              </div>
              <button
                onClick={() => setActivePage('appointments')}
                className="text-xs font-bold text-[#294B3A] hover:underline"
              >
                {language === 'hi' ? 'कैलेंडर देखें' : 'View All'}
              </button>
            </div>

            {upcomingAppointments.length > 0 ? (
              <AppointmentCard appointment={upcomingAppointments[0]} compact />
            ) : (
              <div className="p-6 text-center text-sm text-[#778078] bg-[#F8F7F1] rounded-2xl border border-dashed border-[#E7E9E2]">
                No upcoming appointments.
              </div>
            )}
          </div>
        </div>

        {/* Family & Consent Summary Card */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#65866E]" />
                <h3 className="text-lg font-bold text-[#26372D]">
                  {language === 'hi' ? 'परिवार संपर्क व गोपनीयता' : 'Family & Privacy Status'}
                </h3>
              </div>
              <button
                onClick={() => setActivePage('privacy')}
                className="text-xs font-bold text-[#294B3A] hover:underline"
              >
                {language === 'hi' ? 'अनुमतियाँ बदलें' : 'Privacy Settings'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#E7E9E2]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#778078]">Connected Contact:</span>
                  <p className="text-sm font-bold text-[#26372D]">
                    {seniorProfile.emergencyContact.name} ({seniorProfile.emergencyContact.relationship})
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#65866E]/15 text-[#294B3A]">
                  Active Link
                </span>
              </div>

              {/* Consent items indicator */}
              <div className="mt-4 pt-3 border-t border-[#E7E9E2] grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  {consentSettings.medicineStatusSharing ? (
                    <Unlock className="w-3.5 h-3.5 text-[#65866E]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#778078]" />
                  )}
                  <span className={consentSettings.medicineStatusSharing ? 'font-bold text-[#294B3A]' : 'text-[#778078]'}>
                    Medicines: {consentSettings.medicineStatusSharing ? 'Shared' : 'Private'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {consentSettings.wellbeingSummarySharing ? (
                    <Unlock className="w-3.5 h-3.5 text-[#65866E]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#778078]" />
                  )}
                  <span className={consentSettings.wellbeingSummarySharing ? 'font-bold text-[#294B3A]' : 'text-[#778078]'}>
                    Wellbeing: {consentSettings.wellbeingSummarySharing ? 'Shared' : 'Private'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {consentSettings.appointmentSharing ? (
                    <Unlock className="w-3.5 h-3.5 text-[#65866E]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#778078]" />
                  )}
                  <span className={consentSettings.appointmentSharing ? 'font-bold text-[#294B3A]' : 'text-[#778078]'}>
                    Visits: {consentSettings.appointmentSharing ? 'Shared' : 'Private'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {consentSettings.activitySharing ? (
                    <Unlock className="w-3.5 h-3.5 text-[#65866E]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#778078]" />
                  )}
                  <span className={consentSettings.activitySharing ? 'font-bold text-[#294B3A]' : 'text-[#778078]'}>
                    Timeline: {consentSettings.activitySharing ? 'Shared' : 'Private'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-[#778078] leading-relaxed">
            {language === 'hi'
              ? 'आप जब चाहें अपनी बेटी अनन्या के साथ साझा की जाने वाली जानकारी को बंद कर सकती हैं।'
              : 'You control what Ananya can see. Change or revoke any permission anytime in Privacy Center.'}
          </p>
        </div>
      </div>

      {/* Voice Assistant Modal when triggered */}
      {isVoiceOpen && (
        <Modal
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
          title={t('assistantTitle')}
          subtitle={t('assistantSubtitle')}
          maxWidth="max-w-2xl"
        >
          <VoiceAssistantModal onClose={() => setIsVoiceOpen(false)} />
        </Modal>
      )}

      {/* Support / Need Assistance Modal */}
      {isEmergencyModalOpen && (
        <Modal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          title={t('supportAlertTitle')}
          subtitle={t('supportAlertBody')}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  {language === 'hi'
                    ? 'यदि आप असहज महसूस कर रही हैं, तो थोड़ा पानी पिएं और बैठ जाएं। नीचे दिए गए बटन से अपनी बेटी अनन्या को फोन कर सकती हैं।'
                    : 'If you feel lightheaded or uncomfortable, please sit down and take slow breaths. You can contact your family member right now.'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#E7E9E2]">
              <h4 className="font-bold text-sm text-[#26372D]">Designated Contact:</h4>
              <p className="text-base font-bold text-[#294B3A] mt-1">
                {seniorProfile.emergencyContact.name} ({seniorProfile.emergencyContact.relationship})
              </p>
              <p className="text-xs text-[#778078] mt-0.5">
                {seniorProfile.emergencyContact.phone}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`[Demo Mode] Simulated call triggered to ${seniorProfile.emergencyContact.name}`);
                  setIsEmergencyModalOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#294B3A] text-white font-bold text-sm shadow-md hover:bg-[#1E372B]"
              >
                <PhoneCall className="w-4 h-4 text-[#F3DCCB]" />
                <span>{t('callDaughter')}</span>
              </button>

              <button
                onClick={() => setIsEmergencyModalOpen(false)}
                className="px-5 py-3.5 rounded-xl border border-[#E7E9E2] text-[#26372D] font-semibold text-sm hover:bg-[#F8F7F1]"
              >
                {language === 'hi' ? 'ठीक है, मैं आराम कर रही हूँ' : 'I am resting now'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Dedicated One-Tap Help Modal (Feature 1) */}
      <OneTapHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};
