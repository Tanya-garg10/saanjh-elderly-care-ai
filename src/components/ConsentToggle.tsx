import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ShieldAlert, Check, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { ConsentSettings } from '../types';

interface ConsentToggleProps {
  settingKey: keyof Omit<ConsentSettings, 'authorizedFamilyMember' | 'relationship' | 'lastUpdated'>;
  title: string;
  description: string;
  categoryIcon: React.ReactNode;
}

export const ConsentToggle: React.FC<ConsentToggleProps> = ({
  settingKey,
  title,
  description,
  categoryIcon,
}) => {
  const { consentSettings, updateConsent, language, t } = useApp();
  const isEnabled = Boolean(consentSettings[settingKey]);

  // Explicit allowed vs withheld details
  const permissionDetails: Record<
    string,
    { allowed: string; allowedHi: string; withheld: string; withheldHi: string }
  > = {
    medicineStatusSharing: {
      allowed: 'Allows viewing daily medicine names and confirmed taken timestamps.',
      allowedHi: 'दवा के नाम और दवा लेने के समय की पुष्टि देखने की अनुमति।',
      withheld: 'Never exposes external doctor prescription records.',
      withheldHi: 'डॉक्टर की निजी प्रिस्क्रिप्शन कभी साझा नहीं की जाती।',
    },
    wellbeingSummarySharing: {
      allowed: 'Allows viewing daily mood status (Well / Okay / Need Support).',
      allowedHi: 'दैनिक स्वास्थ्य स्थिति (ठीक / सामान्य / मदद चाहिए) देखने की अनुमति।',
      withheld: 'Private notes and symptom reflections are NEVER shared.',
      withheldHi: 'आपकी निजी टिप्पणियाँ और लक्षण कभी साझा नहीं किए जाते।',
    },
    appointmentSharing: {
      allowed: 'Allows viewing doctor name, clinic address, and visit date/time.',
      allowedHi: 'डॉक्टर का नाम, क्लिनिक का पता और मुलाकात की तारीख/समय देखने की अनुमति।',
      withheld: 'Private consultation prep notes remain strictly private.',
      withheldHi: 'मुलाकात की निजी टिप्पणियां पूर्णतः गोपनीय रहती हैं।',
    },
    activitySharing: {
      allowed: 'Allows viewing routine confirmation timestamps on the family timeline.',
      allowedHi: 'समयरेखा पर दिनचर्या की पुष्टि के समय देखने की अनुमति।',
      withheld: 'Voice conversations and audio transcripts are NEVER shared.',
      withheldHi: 'वॉयस बातचीत और ऑडियो रिकॉर्डिंग कभी भी साझा नहीं की जाती।',
    },
  };

  const details = permissionDetails[settingKey];

  return (
    <div
      className={`relative bg-[#FFFFFF] rounded-2xl border transition-all duration-200 p-5 sm:p-6 shadow-xs ${
        isEnabled ? 'border-[#65866E] shadow-sm' : 'border-[#E7E9E2]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-2xl shrink-0 transition-colors ${
              isEnabled
                ? 'bg-[#65866E] text-white shadow-xs'
                : 'bg-[#F8F7F1] text-[#778078] border border-[#E7E9E2]'
            }`}
          >
            {categoryIcon}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="text-lg font-bold text-[#26372D]">{title}</h4>
              {isEnabled ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#65866E]/15 text-[#294B3A]">
                  <Unlock className="w-3 h-3" />
                  {t('sharingEnabled')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F8F7F1] text-[#778078] border border-[#E7E9E2]">
                  <Lock className="w-3 h-3" />
                  {t('sharingDisabled')}
                </span>
              )}
            </div>

            <p className="text-sm text-[#778078] leading-relaxed">
              {description}
            </p>

            {/* Granular What is Allowed vs What is Withheld */}
            {details && (
              <div className="mt-2.5 p-3 rounded-xl bg-[#F8F7F1] border border-[#E7E9E2]/70 text-xs space-y-1.5">
                <div className="flex items-start gap-2 text-[#294B3A]">
                  <Eye className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#65866E]" />
                  <span>
                    <strong>{language === 'hi' ? 'क्या साझा होता है:' : 'What is shared:'} </strong>
                    {language === 'hi' ? details.allowedHi : details.allowed}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-rose-800">
                  <EyeOff className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                  <span>
                    <strong>{language === 'hi' ? 'क्या कभी साझा नहीं होता:' : 'What is NEVER shared:'} </strong>
                    {language === 'hi' ? details.withheldHi : details.withheld}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-medium text-[#294B3A] bg-[#FFFFFF] py-1 px-2.5 rounded-lg w-fit border border-[#E7E9E2]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#65866E]" />
              <span>
                {t('authorizedViewer')}{' '}
                <strong>
                  {consentSettings.authorizedFamilyMember} ({consentSettings.relationship})
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Toggle Switch & Action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E7E9E2]">
          <button
            type="button"
            role="switch"
            aria-checked={isEnabled}
            onClick={() => updateConsent(settingKey, !isEnabled)}
            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-4 focus:ring-[#65866E] ${
              isEnabled ? 'bg-[#65866E]' : 'bg-[#D1D8D0]'
            }`}
          >
            <span className="sr-only">Toggle {title}</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>

          <span className="text-xs font-bold text-[#26372D]">
            {isEnabled ? t('revokeSharing') : t('grantSharing')}
          </span>
        </div>
      </div>
    </div>
  );
};
