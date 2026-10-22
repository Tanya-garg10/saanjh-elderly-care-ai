import React from 'react';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';
import { useApp } from '../context/AppContext';
import { Sparkles, Mic, Volume2 } from 'lucide-react';

export const VoiceAssistantPage: React.FC = () => {
  const { language, t } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#65866E]/15 rounded-xl text-[#294B3A]">
            <Mic className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#26372D]">
            {t('assistantTitle')}
          </h1>
        </div>
        <p className="text-sm text-[#778078] mt-1">
          {t('assistantSubtitle')}
        </p>
      </div>

      <VoiceAssistantModal isStandalonePage />
    </div>
  );
};
