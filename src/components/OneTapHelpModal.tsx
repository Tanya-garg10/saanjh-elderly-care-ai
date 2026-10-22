import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import {
  LifeBuoy,
  PhoneCall,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  User,
  HeartHandshake,
} from 'lucide-react';

interface OneTapHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OneTapHelpModal: React.FC<OneTapHelpModalProps> = ({ isOpen, onClose }) => {
  const {
    seniorProfile,
    activeHelpRequest,
    triggerHelpRequest,
    resolveHelpRequest,
    cancelHelpRequest,
    language,
    t,
  } = useApp();

  const [noteText, setNoteText] = useState('');
  const [simulatedCallActive, setSimulatedCallActive] = useState(false);

  const handleTriggerAlert = () => {
    triggerHelpRequest(noteText.trim());
    setNoteText('');
  };

  const handleSimulateCall = () => {
    setSimulatedCallActive(true);
    setTimeout(() => {
      setSimulatedCallActive(false);
    }, 3500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('helpModalTitle')}
      subtitle={t('helpModalSubtitle')}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Active Help Banner if request currently open */}
        {activeHelpRequest ? (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 shadow-sm animate-pulse-none">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-200/80 rounded-xl text-amber-800 shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-extrabold text-base text-amber-900">
                  {t('helpActiveBanner')}
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {t('helpActiveSub')}
                </p>
                <div className="mt-2 text-xs text-amber-950 font-semibold">
                  Logged at: {new Date(activeHelpRequest.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      resolveHelpRequest(activeHelpRequest.id);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('resolveHelpRequest')}</span>
                  </button>

                  <button
                    onClick={() => {
                      cancelHelpRequest(activeHelpRequest.id);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-semibold text-xs hover:bg-amber-100 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{t('cancelHelpRequest')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Initial Action Screen */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3">
              <LifeBuoy className="w-6 h-6 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-rose-900">
                  {language === 'hi' ? 'क्या आप असहज या परेशान महसूस कर रही हैं?' : 'Need reassurance or assistance?'}
                </h4>
                <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                  {language === 'hi'
                    ? 'कृपया आराम से बैठें। आप नीचे दिए गए विकल्पों से अपनी बेटी अनन्या को सूचित कर सकती हैं।'
                    : 'Sit down comfortably, take slow breaths, and choose one of the options below to connect with family.'}
                </p>
              </div>
            </div>

            {/* Configured Emergency Contact Details */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#E7E9E2] shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#294B3A] text-white flex items-center justify-center font-bold text-sm">
                    <User className="w-5 h-5 text-[#F3DCCB]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#778078] block">
                      {t('helpContactLabel')}
                    </span>
                    <h4 className="text-base font-bold text-[#26372D]">
                      {seniorProfile.emergencyContact.name} ({seniorProfile.emergencyContact.relationship})
                    </h4>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Authorized Contact
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#E7E9E2] flex items-center justify-between text-xs text-[#778078]">
                <span>Configured Phone: <strong>{seniorProfile.emergencyContact.phone}</strong></span>
                <span>Location: Mumbai</span>
              </div>
            </div>

            {/* Optional message input */}
            <div>
              <label className="block text-xs font-bold text-[#26372D] mb-1">
                {language === 'hi' ? 'वैकल्पिक संदेश (जैसे: चक्कर आ रहे हैं, बात करनी है):' : 'Optional note for Ananya (e.g., feeling dizzy, please call):'}
              </label>
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="e.g., Feeling a little weak, resting in my bedroom..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E9E2] bg-[#F8F7F1] text-sm text-[#26372D] focus:outline-hidden focus:ring-2 focus:ring-[#65866E]"
              />
            </div>

            {/* Simulation Notice Disclaimer */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>{t('helpDemoNoticeTitle')}: </strong>
                <span>{t('helpDemoNoticeBody')}</span>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleTriggerAlert}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-rose-700 text-white font-bold text-sm hover:bg-rose-800 shadow-md transition-all active:scale-95"
              >
                <LifeBuoy className="w-4 h-4 text-rose-200" />
                <span>{t('triggerSimulatedAlert')}</span>
              </button>

              <button
                onClick={handleSimulateCall}
                disabled={simulatedCallActive}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#294B3A] text-white font-bold text-sm hover:bg-[#1E372B] shadow-md transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-[#F3DCCB]" />
                <span>
                  {simulatedCallActive
                    ? language === 'hi' ? 'कॉल सिमुलेशन जारी...' : 'Simulating Call...'
                    : t('simulateDirectCall')}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-[#E7E9E2]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#E7E9E2] text-xs sm:text-sm font-semibold text-[#778078] hover:bg-[#F8F7F1]"
          >
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
