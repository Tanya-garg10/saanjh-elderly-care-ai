import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WellbeingMood, WellbeingCheckIn } from '../types';
import { Modal } from '../components/Modal';
import {
  Heart,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  AlertCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';

export const Wellbeing: React.FC = () => {
  const {
    wellbeingLogs,
    todayWellbeing,
    addWellbeingCheckIn,
    seniorProfile,
    consentSettings,
    language,
    t,
  } = useApp();

  const [selectedMood, setSelectedMood] = useState<WellbeingMood | null>(
    todayWellbeing?.response || null
  );
  const [note, setNote] = useState<string>(todayWellbeing?.note || '');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    addWellbeingCheckIn(selectedMood, note.trim());

    if (selectedMood === 'support') {
      setIsSupportModalOpen(true);
    }
  };

  // Calculate mood stats
  const totalLogs = wellbeingLogs.length;
  const wellCount = wellbeingLogs.filter((w) => w.response === 'well').length;
  const okayCount = wellbeingLogs.filter((w) => w.response === 'okay').length;
  const supportCount = wellbeingLogs.filter((w) => w.response === 'support').length;

  const wellPct = totalLogs > 0 ? Math.round((wellCount / totalLogs) * 100) : 0;
  const okayPct = totalLogs > 0 ? Math.round((okayCount / totalLogs) * 100) : 0;
  const supportPct = totalLogs > 0 ? Math.round((supportCount / totalLogs) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#F3DCCB] rounded-xl text-[#7A431D]">
            <Heart className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26372D]">
            {t('navWellbeing')}
          </h1>
        </div>
        <p className="text-sm text-[#778078] mt-1">
          {language === 'hi'
            ? 'दैनिक मनोदशा व शारीरिक स्थिति को दर्ज करें ताकि आप और आपके अपने आश्वस्त रहें।'
            : 'Check in with yourself each day to foster calm routines and track your holistic comfort.'}
        </p>
      </div>

      {/* Main Check-In Form Card */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E7E9E2] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#26372D]">
              {t('howAreYouFeeling')}
            </h2>
            <p className="text-xs sm:text-sm text-[#778078] mt-1">
              {todayWellbeing
                ? language === 'hi'
                  ? 'आज की स्थिति दर्ज है। आप चाहें तो इसे बदल सकती हैं।'
                  : 'Check-in recorded for today. You can update it anytime.'
                : language === 'hi'
                ? 'नीचे दिए गए 3 विकल्पों में से एक चुनें।'
                : 'Select one of the 3 feelings below that best reflects you today.'}
            </p>
          </div>

          {todayWellbeing && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#65866E]/15 text-[#294B3A] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('checkInSaved')}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* 3 Large Accessible Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Well */}
            <button
              type="button"
              onClick={() => setSelectedMood('well')}
              className={`p-6 rounded-2xl border-2 text-left transition-all transform active:scale-95 flex flex-col justify-between ${
                selectedMood === 'well'
                  ? 'border-[#65866E] bg-[#65866E]/10 ring-2 ring-[#65866E]'
                  : 'border-[#E7E9E2] hover:border-[#65866E]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">😊</span>
                <Smile
                  className={`w-6 h-6 ${
                    selectedMood === 'well' ? 'text-[#65866E]' : 'text-[#778078]'
                  }`}
                />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-bold text-[#26372D]">
                  {t('feelingWell')}
                </h4>
                <p className="text-xs text-[#778078] mt-1">{t('wellDesc')}</p>
              </div>
            </button>

            {/* Okay */}
            <button
              type="button"
              onClick={() => setSelectedMood('okay')}
              className={`p-6 rounded-2xl border-2 text-left transition-all transform active:scale-95 flex flex-col justify-between ${
                selectedMood === 'okay'
                  ? 'border-[#7A431D] bg-[#F3DCCB]/40 ring-2 ring-[#7A431D]'
                  : 'border-[#E7E9E2] hover:border-[#7A431D]/50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">😐</span>
                <Meh
                  className={`w-6 h-6 ${
                    selectedMood === 'okay' ? 'text-[#7A431D]' : 'text-[#778078]'
                  }`}
                />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-bold text-[#26372D]">
                  {t('feelingOkay')}
                </h4>
                <p className="text-xs text-[#778078] mt-1">{t('okayDesc')}</p>
              </div>
            </button>

            {/* Support */}
            <button
              type="button"
              onClick={() => setSelectedMood('support')}
              className={`p-6 rounded-2xl border-2 text-left transition-all transform active:scale-95 flex flex-col justify-between ${
                selectedMood === 'support'
                  ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600'
                  : 'border-[#E7E9E2] hover:border-amber-500 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">🫂</span>
                <Frown
                  className={`w-6 h-6 ${
                    selectedMood === 'support' ? 'text-amber-700' : 'text-[#778078]'
                  }`}
                />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-bold text-amber-900">
                  {t('feelingSupport')}
                </h4>
                <p className="text-xs text-[#778078] mt-1">{t('supportDesc')}</p>
              </div>
            </button>
          </div>

          {/* Optional Note Field */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#26372D] mb-1.5">
              {language === 'hi'
                ? 'कोई निजी टिप्पणी (वैकल्पिक):'
                : 'Personal notes or symptoms (optional):'}
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('addOptionalNote')}
              className="w-full px-4 py-3 rounded-2xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
            />
            <p className="mt-1 text-xs text-[#778078]">
              {consentSettings.wellbeingSummarySharing
                ? 'Note: Only high-level mood status is shared with family, never raw notes unless explicitly permitted.'
                : 'Note: Kept 100% private. Wellbeing sharing is currently disabled in your Privacy Settings.'}
            </p>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={!selectedMood}
              className="px-8 py-3.5 rounded-2xl bg-[#294B3A] text-white font-bold text-sm sm:text-base hover:bg-[#1E372B] disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
            >
              {t('logCheckIn')}
            </button>
          </div>
        </form>
      </div>

      {/* Trend Visualization & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#778078]">
                Feeling Well
              </span>
              <span className="text-xl font-black text-[#294B3A]">{wellPct}%</span>
            </div>
            <div className="w-full bg-[#F8F7F1] h-3 rounded-full mt-3 overflow-hidden border border-[#E7E9E2]">
              <div
                className="bg-[#65866E] h-full rounded-full transition-all duration-500"
                style={{ width: `${wellPct}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-[#778078] mt-4">
            {wellCount} of {totalLogs} recorded check-ins
          </p>
        </div>

        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#778078]">
                Feeling Okay
              </span>
              <span className="text-xl font-black text-[#7A431D]">{okayPct}%</span>
            </div>
            <div className="w-full bg-[#F8F7F1] h-3 rounded-full mt-3 overflow-hidden border border-[#E7E9E2]">
              <div
                className="bg-[#F3DCCB] h-full rounded-full transition-all duration-500"
                style={{ width: `${okayPct}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-[#778078] mt-4">
            {okayCount} of {totalLogs} recorded check-ins
          </p>
        </div>

        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#778078]">
                Need Support
              </span>
              <span className="text-xl font-black text-amber-700">{supportPct}%</span>
            </div>
            <div className="w-full bg-[#F8F7F1] h-3 rounded-full mt-3 overflow-hidden border border-[#E7E9E2]">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${supportPct}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-[#778078] mt-4">
            {supportCount} of {totalLogs} recorded check-ins
          </p>
        </div>
      </div>

      {/* History Log view */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#26372D]">
          {t('recentCheckIns')}
        </h3>

        <div className="space-y-3">
          {wellbeingLogs.map((log) => {
            const isWell = log.response === 'well';
            const isOkay = log.response === 'okay';

            return (
              <div
                key={log.id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#E7E9E2] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-2xl text-2xl shrink-0 ${
                      isWell
                        ? 'bg-[#65866E]/15'
                        : isOkay
                        ? 'bg-[#F3DCCB]/50'
                        : 'bg-amber-100'
                    }`}
                  >
                    {isWell ? '😊' : isOkay ? '😐' : '🫂'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-[#26372D]">
                        {isWell
                          ? t('feelingWell')
                          : isOkay
                          ? t('feelingOkay')
                          : t('feelingSupport')}
                      </span>
                      <span className="text-xs font-semibold text-[#778078] px-2 py-0.5 rounded-md bg-[#F8F7F1] border border-[#E7E9E2]">
                        {log.date}
                      </span>
                    </div>

                    {log.note && (
                      <p className="mt-1.5 text-sm text-[#778078] bg-[#F8F7F1] px-3 py-1.5 rounded-xl border border-[#E7E9E2]/60">
                        "{log.note}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-[#778078] self-end sm:self-center shrink-0">
                  {new Date(log.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-Diagnostic Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#E7E9E2] text-xs text-[#778078] leading-relaxed">
        <strong>Safety Note:</strong> Saanjh wellbeing check-ins are self-reported reflections to help maintain daily awareness and family coordination. Saanjh does not provide medical diagnoses or clinical assessments.
      </div>

      {/* Support / Contact Modal */}
      {isSupportModalOpen && (
        <Modal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
          title={t('supportAlertTitle')}
          subtitle={t('supportAlertBody')}
        >
          <div className="space-y-4">
            <p className="text-sm text-[#778078] leading-relaxed">
              {language === 'hi'
                ? 'आपने दर्ज किया है कि आपको थोड़ी मदद या देखभाल की आवश्यकता है। अपनी बेटी अनन्या से संपर्क करें या थोड़ा आराम करें।'
                : 'You recorded that you need support. Staying connected with family brings reassurance and peace of mind.'}
            </p>

            <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#E7E9E2]">
              <span className="text-xs text-[#778078]">Connected Family Member:</span>
              <p className="text-base font-bold text-[#294B3A] mt-0.5">
                {seniorProfile.emergencyContact.name} ({seniorProfile.emergencyContact.relationship})
              </p>
              <p className="text-xs text-[#778078]">
                {seniorProfile.emergencyContact.phone}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`[Demo Mode] Simulated call placed to ${seniorProfile.emergencyContact.name}`);
                  setIsSupportModalOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#294B3A] text-white font-bold text-sm shadow-md"
              >
                <PhoneCall className="w-4 h-4 text-[#F3DCCB]" />
                <span>{t('callDaughter')}</span>
              </button>

              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="px-4 py-3 rounded-xl border border-[#E7E9E2] text-[#26372D] font-semibold text-sm hover:bg-[#F8F7F1]"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
