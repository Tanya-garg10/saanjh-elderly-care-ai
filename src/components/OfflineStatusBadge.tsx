import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, WifiOff, HardDrive, Info, X } from 'lucide-react';

export const OfflineStatusBadge: React.FC = () => {
  const { isOnline, language, t } = useApp();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowInfo(!showInfo)}
        aria-label={`Connection status: ${isOnline ? 'Online' : 'Offline'}. Tap for local storage details.`}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
          isOnline
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
        }`}
        title="Offline-First Local Storage Status"
      >
        {isOnline ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">{t('statusOnline')}</span>
            <span className="text-[10px] text-emerald-700/80 font-normal">● Local Storage</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-amber-800" />
            <span>{t('statusOffline')}</span>
          </>
        )}
      </button>

      {/* Info Popover */}
      {showInfo && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#E7E9E2] p-4 z-50 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-[#E7E9E2]">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#65866E]" />
              <h4 className="font-bold text-xs sm:text-sm text-[#26372D]">
                Offline-First Architecture
              </h4>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="text-[#778078] hover:text-[#26372D] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2.5 space-y-2 text-xs text-[#778078] leading-relaxed">
            <p>
              {language === 'hi'
                ? 'सांझ ऑफलाइन-फर्स्ट काम करता है। सभी दवाएं, रिमाइंडर और स्वास्थ्य रिकॉर्ड सीधे आपके डिवाइस के ब्राउज़र स्टोरेज (localStorage) में सुरक्षित रहते हैं।'
                : 'Saanjh operates offline-first. All medicine reminders, check-ins, and appointments are stored safely in local browser memory.'}
            </p>
            <div className="p-2 rounded-xl bg-[#F8F7F1] border border-[#E7E9E2] text-[11px] text-[#294B3A]">
              <strong>Honest Demo Boundary:</strong> All data is local to this browser session. In this demo MVP, no remote server sync or cross-device cloud persistence is claimed.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
