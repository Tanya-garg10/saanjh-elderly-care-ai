import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Pill,
  Heart,
  Calendar,
  Activity,
  PhoneCall,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquareHeart,
  RefreshCw,
  LifeBuoy,
} from 'lucide-react';
import { RoutineInsightsCard } from '../components/RoutineInsightsCard';

export const FamilyDashboard: React.FC = () => {
  const {
    seniorProfile,
    familyProfile,
    consentSettings,
    medicines,
    appointments,
    wellbeingLogs,
    activityLogs,
    activeHelpRequest,
    language,
    t,
    showToast,
  } = useApp();

  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteMessage, setNoteMessage] = useState('');

  // Calculate authorized statistics
  const totalMeds = medicines.length;
  const takenMeds = medicines.filter((m) => m.status === 'taken').length;
  const adherencePct = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 0;

  const todayWellbeing = wellbeingLogs[0];
  const upcomingAppointments = appointments.filter((a) => a.status === 'upcoming');

  // Filter activity logs based on consent settings
  const authorizedActivities = activityLogs.filter((act) => {
    if (act.visibilityCategory === 'medicine' && !consentSettings.medicineStatusSharing) {
      return false;
    }
    if (act.visibilityCategory === 'wellbeing' && !consentSettings.wellbeingSummarySharing) {
      return false;
    }
    if (act.visibilityCategory === 'appointment' && !consentSettings.appointmentSharing) {
      return false;
    }
    if (act.visibilityCategory === 'system' && !consentSettings.activitySharing) {
      return false;
    }
    return true;
  });

  const handleSendCareNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteMessage.trim()) return;
    showToast(
      language === 'hi'
        ? `मीरा जी को संदेश भेज दिया गया: "${noteMessage}"`
        : `Care note sent to Meera: "${noteMessage}"`,
      'success'
    );
    setNoteMessage('');
    setIsNoteModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Active Help Alert for Family Member (Simulated Demo) */}
      {activeHelpRequest && (
        <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-400 text-rose-950 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-rose-200 rounded-xl text-rose-900 shrink-0 mt-0.5">
              <LifeBuoy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-rose-950">
                  {language === 'hi' ? 'मीरा जी द्वारा सहायता अनुरोध (सिमुलेटेड डेमो)' : 'Meera Sharma Logged a Help Request (Simulated Demo)'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-rose-300 text-rose-800">
                  Active Notice
                </span>
              </div>
              <p className="text-xs text-rose-900 mt-1">
                Requested at: {new Date(activeHelpRequest.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {activeHelpRequest.note ? ` • Note: "${activeHelpRequest.note}"` : ''}
              </p>
              <p className="text-[11px] text-rose-800/80 mt-1">
                Demo Notice: In this local prototype, no real cellular call was placed. You can simulate calling Meera below.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCallModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-800 text-white font-bold text-xs hover:bg-rose-900 transition-colors shadow-xs flex items-center gap-2 shrink-0 self-end sm:self-auto"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Meera (Demo)</span>
          </button>
        </div>
      )}
      {/* Top Header Card */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#E9E5F4] text-[#4A3E72]">
              Family Member View
            </span>
            <span className="text-xs text-[#778078]">
              Signed in as {familyProfile.displayName} ({familyProfile.relationship})
            </span>
          </div>

          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold text-[#26372D] tracking-tight">
            {t('familyTitle')}
          </h1>

          <p className="mt-1 text-sm sm:text-base text-[#778078]">
            {t('familySubtitle')}
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs text-[#778078]">
            <span className="flex items-center gap-1 font-semibold text-[#294B3A]">
              <ShieldCheck className="w-4 h-4 text-[#65866E]" />
              Consent-Gated Data Active
            </span>
            <span>•</span>
            <span>Last checked: Just now</span>
          </div>
        </div>

        {/* Action Buttons: Contact Meera & Send Care Note */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#294B3A] text-white font-bold text-sm hover:bg-[#1E372B] shadow-md transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-[#F3DCCB]" />
            <span>{t('callMeera')}</span>
          </button>

          <button
            onClick={() => setIsNoteModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#65866E] bg-white text-[#294B3A] font-bold text-sm hover:bg-[#65866E]/10 transition-colors"
          >
            <MessageSquareHeart className="w-4 h-4 text-[#65866E]" />
            <span>{t('sendGentleNote')}</span>
          </button>
        </div>
      </div>

      {/* Consent Status Strip */}
      <div className="p-4 rounded-2xl bg-[#F8F7F1] border border-[#E7E9E2] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#65866E]" />
          <span className="font-bold text-[#26372D]">Current Shared Permissions:</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${consentSettings.medicineStatusSharing ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
            {consentSettings.medicineStatusSharing ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            Medicines
          </span>

          <span className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${consentSettings.wellbeingSummarySharing ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
            {consentSettings.wellbeingSummarySharing ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            Wellbeing
          </span>

          <span className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${consentSettings.appointmentSharing ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
            {consentSettings.appointmentSharing ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            Appointments
          </span>

          <span className={`px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 ${consentSettings.activitySharing ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'}`}>
            {consentSettings.activitySharing ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            Timeline
          </span>
        </div>
      </div>

      {/* 3 Core Overview Cards with STRICT Consent Gating */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Shared Medicine Adherence */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E2]">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#65866E]" />
                <h3 className="font-bold text-[#26372D] text-base">
                  {t('sharedAdherence')}
                </h3>
              </div>
              {consentSettings.medicineStatusSharing ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> Shared
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Restricted
                </span>
              )}
            </div>

            <div className="mt-4">
              {consentSettings.medicineStatusSharing ? (
                <div>
                  <div className="text-3xl font-extrabold text-[#294B3A]">
                    {adherencePct}%
                  </div>
                  <p className="text-xs text-[#778078] mt-1 font-medium">
                    {takenMeds} of {totalMeds} medicines confirmed taken today
                  </p>

                  <div className="w-full bg-[#F8F7F1] h-3 rounded-full mt-3 overflow-hidden border border-[#E7E9E2]">
                    <div
                      className="bg-[#65866E] h-full rounded-full transition-all duration-500"
                      style={{ width: `${adherencePct}%` }}
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    {medicines.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between text-xs py-1 border-b border-[#E7E9E2]/50 last:border-0"
                      >
                        <span className="font-semibold text-[#26372D]">{m.name}</span>
                        {m.status === 'taken' ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Taken {m.takenAt}
                          </span>
                        ) : (
                          <span className="text-amber-700 font-medium">
                            Upcoming ({m.reminderTime})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Consent Restricted State */
                <div className="py-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F7F1] text-[#778078] mx-auto flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-[#778078]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#26372D]">
                    {t('familyRestrictedNotice')}
                  </h4>
                  <p className="text-xs text-[#778078] mt-1 leading-relaxed">
                    {t('familyRestrictedSub')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Shared Wellbeing Status */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E2]">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#65866E]" />
                <h3 className="font-bold text-[#26372D] text-base">
                  {t('sharedWellbeing')}
                </h3>
              </div>
              {consentSettings.wellbeingSummarySharing ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> Shared
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Restricted
                </span>
              )}
            </div>

            <div className="mt-4">
              {consentSettings.wellbeingSummarySharing ? (
                <div>
                  {todayWellbeing ? (
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">
                          {todayWellbeing.response === 'well'
                            ? '😊'
                            : todayWellbeing.response === 'okay'
                            ? '😐'
                            : '🫂'}
                        </span>
                        <div>
                          <div className="text-xl font-bold text-[#26372D]">
                            {todayWellbeing.response === 'well'
                              ? 'Feeling Well'
                              : todayWellbeing.response === 'okay'
                              ? 'Feeling Okay'
                              : 'Need Support'}
                          </div>
                          <p className="text-xs text-[#778078]">
                            Recorded today at{' '}
                            {new Date(todayWellbeing.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-3 rounded-xl bg-[#F8F7F1] text-xs text-[#26372D] border border-[#E7E9E2]">
                        <span className="font-bold">Summary: </span>
                        {todayWellbeing.response === 'well'
                          ? 'Meera is feeling rested, energized, and engaged in regular routine.'
                          : todayWellbeing.response === 'okay'
                          ? 'Normal day, proceeding comfortably at a moderate pace.'
                          : 'May appreciate a gentle check-in or phone call.'}
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-[#778078]">
                      No check-in submitted for today yet.
                    </div>
                  )}
                </div>
              ) : (
                /* Consent Restricted State */
                <div className="py-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F7F1] text-[#778078] mx-auto flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-[#778078]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#26372D]">
                    {t('familyRestrictedNotice')}
                  </h4>
                  <p className="text-xs text-[#778078] mt-1 leading-relaxed">
                    {t('familyRestrictedSub')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Shared Appointments */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E2]">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#65866E]" />
                <h3 className="font-bold text-[#26372D] text-base">
                  {t('sharedAppointments')}
                </h3>
              </div>
              {consentSettings.appointmentSharing ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Unlock className="w-3 h-3" /> Shared
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Restricted
                </span>
              )}
            </div>

            <div className="mt-4">
              {consentSettings.appointmentSharing ? (
                <div>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-3.5 rounded-xl bg-[#F8F7F1] border border-[#E7E9E2]"
                        >
                          <h4 className="text-sm font-bold text-[#26372D]">
                            {apt.doctorName}
                          </h4>
                          <p className="text-xs text-[#778078] mt-0.5">
                            {apt.clinicName}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-[#294B3A]">
                            <span>{apt.date}</span>
                            <span>•</span>
                            <span>{apt.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#778078] py-4 text-center">
                      No upcoming appointments shared.
                    </p>
                  )}
                </div>
              ) : (
                /* Consent Restricted State */
                <div className="py-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F7F1] text-[#778078] mx-auto flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-[#778078]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#26372D]">
                    {t('familyRestrictedNotice')}
                  </h4>
                  <p className="text-xs text-[#778078] mt-1 leading-relaxed">
                    {t('familyRestrictedSub')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Routine Change Insights (Consent Gated for Family) */}
      <RoutineInsightsCard isFamilyView />

      {/* Authorized Care Timeline */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E9E2]">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#65866E]" />
            <h3 className="text-lg font-bold text-[#26372D]">
              {t('authorizedTimeline')}
            </h3>
          </div>
          <span className="text-xs text-[#778078]">
            Filtered according to Meera's privacy choices
          </span>
        </div>

        {authorizedActivities.length > 0 ? (
          <div className="space-y-3">
            {authorizedActivities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-[#F8F7F1] border border-[#E7E9E2] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#65866E]" />
                  <span className="font-semibold text-[#26372D]">
                    {language === 'hi' && act.descriptionHi
                      ? act.descriptionHi
                      : act.description}
                  </span>
                </div>
                <span className="text-[#778078] shrink-0 ml-2">
                  {new Date(act.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-[#778078]">
            {language === 'hi'
              ? 'वर्तमान में कोई गतिविधि साझा नहीं की गई है।'
              : 'No activities are currently authorized for display under active privacy rules.'}
          </div>
        )}
      </div>

      {/* Demo Call Modal */}
      {isCallModalOpen && (
        <Modal
          isOpen={isCallModalOpen}
          onClose={() => setIsCallModalOpen(false)}
          title="Direct Contact (Demo Action)"
          subtitle={`Calling Meera Sharma at ${seniorProfile.city}`}
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F8F7F1] border border-[#E7E9E2] text-sm">
              <p className="font-bold text-[#26372D]">{seniorProfile.displayName}</p>
              <p className="text-xs text-[#778078] mt-1">
                Demo Phone: +91 98765 43210 (South Delhi)
              </p>
            </div>

            <p className="text-xs text-[#778078] leading-relaxed">
              In a production version, this initiates a secure WebRTC voice bridge or regular cellular call directly from the family coordinator app.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  showToast('Simulated call initiated to Meera', 'info');
                  setIsCallModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#294B3A] text-white font-bold text-sm"
              >
                Simulate Call
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Send Note Modal */}
      {isNoteModalOpen && (
        <Modal
          isOpen={isNoteModalOpen}
          onClose={() => setIsNoteModalOpen(false)}
          title={t('sendGentleNote')}
          subtitle="Send an encouraging, loving care message to Meera"
        >
          <form onSubmit={handleSendCareNote} className="space-y-4">
            <textarea
              rows={3}
              required
              value={noteMessage}
              onChange={(e) => setNoteMessage(e.target.value)}
              placeholder="e.g., Thinking of you Maa! Drink lots of water today."
              className="w-full px-4 py-3 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E7E9E2] text-sm text-[#778078]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#294B3A] text-white font-bold text-sm flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Note</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
