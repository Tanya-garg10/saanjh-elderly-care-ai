import React from 'react';
import { useApp } from '../context/AppContext';
import { ConsentToggle } from '../components/ConsentToggle';
import {
  ShieldCheck,
  Shield,
  Lock,
  Unlock,
  Pill,
  Heart,
  Calendar,
  Activity,
  UserCheck,
  History,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export const PrivacyCenter: React.FC = () => {
  const { consentSettings, updateConsent, activityLogs, seniorProfile, language, t } = useApp();

  const isAnyShared =
    consentSettings.medicineStatusSharing ||
    consentSettings.wellbeingSummarySharing ||
    consentSettings.appointmentSharing ||
    consentSettings.activitySharing;

  const handleRevokeAll = () => {
    updateConsent('medicineStatusSharing', false);
    updateConsent('wellbeingSummarySharing', false);
    updateConsent('appointmentSharing', false);
    updateConsent('activitySharing', false);
  };

  const handleAllowAll = () => {
    updateConsent('medicineStatusSharing', true);
    updateConsent('wellbeingSummarySharing', true);
    updateConsent('appointmentSharing', true);
    updateConsent('activitySharing', true);
  };

  const consentLogs = activityLogs.filter((a) => a.visibilityCategory === 'consent');

  return (
    <div className="space-y-8 pb-12">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-[#294B3A] to-[#1E372B] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#F3DCCB] text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#F3DCCB]" />
            <span>Consent Before Care</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t('privacyTitle')}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-emerald-100/90 leading-relaxed">
            {t('privacySubtitle')}
          </p>

          {/* Quick status summary chip */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#F3DCCB]" />
              <span>
                Authorized Recipient: <strong>{consentSettings.authorizedFamilyMember} ({consentSettings.relationship})</strong>
              </span>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold flex items-center gap-2">
              {isAnyShared ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-300" />
                  <span>Some sharing active</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#F3DCCB]" />
                  <span>100% Private (No data shared)</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Global Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-xs">
        <div>
          <h3 className="text-base font-bold text-[#26372D]">
            {language === 'hi' ? 'त्वरित अनुमति नियंत्रण' : 'Quick Access Controls'}
          </h3>
          <p className="text-xs text-[#778078] mt-0.5">
            {language === 'hi'
              ? 'एक क्लिक में सभी अनुमतियां चालू या बंद करें।'
              : 'Switch all category permissions on or off at once.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRevokeAll}
            className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs sm:text-sm font-bold hover:bg-red-100 transition-colors"
          >
            {language === 'hi' ? 'सभी अनुमतियां रद्द करें (निजी)' : 'Revoke All (Make Private)'}
          </button>
          <button
            onClick={handleAllowAll}
            className="px-4 py-2 rounded-xl bg-[#294B3A] text-white text-xs sm:text-sm font-bold hover:bg-[#1E372B] transition-colors"
          >
            {language === 'hi' ? 'सभी साझा करें' : 'Share All with Ananya'}
          </button>
        </div>
      </div>

      {/* 4 Granular Category Toggles */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#26372D]">
          {language === 'hi' ? 'श्रेणीवार सहमति सेटिंग्स' : 'Category Sharing Permissions'}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {/* 1. Medicine Status Sharing */}
          <ConsentToggle
            settingKey="medicineStatusSharing"
            title={t('medicineSharingTitle')}
            description={t('medicineSharingDesc')}
            categoryIcon={<Pill className="w-5 h-5" />}
          />

          {/* 2. Wellbeing Summary Sharing */}
          <ConsentToggle
            settingKey="wellbeingSummarySharing"
            title={t('wellbeingSharingTitle')}
            description={t('wellbeingSharingDesc')}
            categoryIcon={<Heart className="w-5 h-5" />}
          />

          {/* 3. Appointment Sharing */}
          <ConsentToggle
            settingKey="appointmentSharing"
            title={t('appointmentSharingTitle')}
            description={t('appointmentSharingDesc')}
            categoryIcon={<Calendar className="w-5 h-5" />}
          />

          {/* 4. Activity Sharing */}
          <ConsentToggle
            settingKey="activitySharing"
            title={t('activitySharingTitle')}
            description={t('activitySharingDesc')}
            categoryIcon={<Activity className="w-5 h-5" />}
          />
        </div>
      </div>

      {/* Voice Transcript Non-Sharing Safeguard */}
      <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E9E2] shadow-xs flex items-start gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl shrink-0">
          <Lock className="w-6 h-6 text-[#65866E]" />
        </div>
        <div>
          <h4 className="text-base font-bold text-[#26372D]">
            Voice Transcripts & Raw Audio Recordings: Never Shared
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-[#778078] leading-relaxed">
            Your conversations with Saanjh stay entirely between you and your device. Raw speech transcripts and intimate assistant audio are never broadcast to family members or shared across accounts.
          </p>
        </div>
      </div>

      {/* Consent Audit Trail */}
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#E7E9E2] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#65866E]" />
          <h3 className="text-lg font-bold text-[#26372D]">
            {language === 'hi' ? 'सहमति परिवर्तन ऑडिट लॉग' : 'Consent Change Audit Log'}
          </h3>
        </div>

        <p className="text-xs text-[#778078]">
          Transparent record of every time permissions were updated.
        </p>

        <div className="space-y-2 mt-4">
          {consentLogs.length > 0 ? (
            consentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#F8F7F1] border border-[#E7E9E2] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#65866E] shrink-0" />
                  <span className="font-semibold text-[#26372D]">
                    {language === 'hi' && log.descriptionHi
                      ? log.descriptionHi
                      : log.description}
                  </span>
                </div>
                <span className="text-[#778078]">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#778078]">No recent permission changes logged.</p>
          )}
        </div>
      </div>

      {/* Production vs Demo Disclaimer */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Hackathon Security Notice:</strong>
          In this local demonstration, consent settings control frontend rendering directly via shared application state. In a full production deployment, authorization is enforced cryptographically at the database and API layer using Firebase Authentication & Firestore Security Rules, ensuring unauthorized family members cannot fetch restricted records.
        </div>
      </div>
    </div>
  );
};
