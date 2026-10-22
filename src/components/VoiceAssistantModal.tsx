import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AssistantService } from '../services/assistantService';
import { VoiceService } from '../services/voiceService';
import { AssistantMessage } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Heart,
  Pill,
  X,
  Languages,
} from 'lucide-react';
import { OneTapHelpModal } from './OneTapHelpModal';

interface VoiceAssistantProps {
  onClose?: () => void;
  isStandalonePage?: boolean;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantProps> = ({
  onClose,
  isStandalonePage = false,
}) => {
  const {
    language,
    setLanguage,
    t,
    medicines,
    appointments,
    wellbeingLogs,
    consentSettings,
    seniorProfile,
    voiceSpeechEnabled,
    setVoiceSpeechEnabled,
    setActivePage,
    toggleMedicineTaken,
    showToast,
  } = useApp();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    {
      id: 'init_1',
      sender: 'assistant',
      text:
        language === 'hi'
          ? `नमस्ते मीरा जी! मैं आपकी सांझ सहायक हूँ। आप मुझसे बोलकर या लिखकर कुछ भी पूछ सकती हैं।`
          : `Hello Meera ji! I’m your Saanjh assistant. You can speak to me or type to ask about your medicines, routine, or health.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      VoiceService.stopListening();
      VoiceService.stopSpeaking();
    };
  }, []);

  const handleStartVoice = () => {
    setVoiceError(null);
    VoiceService.stopSpeaking();

    const success = VoiceService.startListening(
      language,
      (text: string, isFinal: boolean) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 0) {
          handleUserQuery(text);
          setTranscript('');
        }
      },
      (err: string) => {
        setVoiceError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (success) {
      setIsListening(true);
    }
  };

  const handleStopVoice = () => {
    VoiceService.stopListening();
    setIsListening(false);
    if (transcript.trim().length > 0) {
      handleUserQuery(transcript);
      setTranscript('');
    }
  };

  const handleUserQuery = async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    // Add user message
    const userMsg: AssistantMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Process with context
    const response = await AssistantService.processQuery(trimmed, {
      medicines,
      appointments,
      wellbeingLogs,
      consentSettings,
      seniorName: seniorProfile.displayName,
      language,
    });

    setMessages((prev) => [...prev, response]);

    // Optional TTS response
    if (voiceSpeechEnabled) {
      setIsSpeaking(true);
      VoiceService.speak(response.text, language, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserQuery(inputText);
    }
  };

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleActionClick = (action: NonNullable<AssistantMessage['actionSuggested']>) => {
    if (action.type === 'navigate' && action.payload) {
      setActivePage(action.payload as any);
      if (onClose) onClose();
    } else if (action.type === 'medicine' && action.payload) {
      toggleMedicineTaken(action.payload);
      showToast(language === 'hi' ? 'दवा ले ली गई' : 'Medicine marked taken', 'success');
    } else if (action.type === 'checkin') {
      setActivePage('wellbeing');
      if (onClose) onClose();
    } else if (action.type === 'privacy') {
      setActivePage('privacy');
      if (onClose) onClose();
    } else if (action.type === 'help' || action.type === 'emergency') {
      setIsHelpOpen(true);
    }
  };

  const samplePrompts = [
    {
      en: 'When is my next medicine reminder?',
      hi: 'Mera next medicine kab lena hai?',
    },
    {
      en: 'What is my schedule for today?',
      hi: 'Aaj ka schedule kya hai?',
    },
    {
      en: 'Aaj tabiyat thodi off lag rahi hai',
      hi: 'आज मेरी तबीयत ठीक नहीं लग रही है',
    },
    {
      en: 'Doc appointment kab hai?',
      hi: 'Doctor se kab milna hai?',
    },
    {
      en: 'Ananya ko kya data dikh raha hai?',
      hi: 'Who can see my health records?',
    },
    {
      en: 'I need help / Emergency',
      hi: 'Mujhe help chahiye',
    },
  ];

  return (
    <div
      className={`flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#E7E9E2] shadow-xl overflow-hidden ${
        isStandalonePage ? 'h-[calc(100vh-140px)]' : 'h-[620px] max-w-2xl w-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E9E2] bg-[#F8F7F1]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#294B3A] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-[#F3DCCB]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#26372D] flex items-center gap-2">
              {t('assistantTitle')}
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#65866E]/15 text-[#294B3A] font-semibold">
                AI Voice
              </span>
            </h3>
            <p className="text-xs text-[#778078]">
              {language === 'hi' ? 'हिंदी व अंग्रेजी में सहायक' : 'Speaks Hindi & English'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[#E7E9E2] bg-white text-[#294B3A] hover:bg-[#F8F7F1]"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-[#65866E]" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* TTS Mute Toggle */}
          <button
            onClick={() => {
              if (isSpeaking) VoiceService.stopSpeaking();
              setVoiceSpeechEnabled(!voiceSpeechEnabled);
            }}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
              voiceSpeechEnabled
                ? 'bg-[#65866E]/10 border-[#65866E]/30 text-[#294B3A]'
                : 'bg-white border-[#E7E9E2] text-[#778078]'
            }`}
            title={voiceSpeechEnabled ? 'Spoken response active' : 'Spoken response muted'}
          >
            {voiceSpeechEnabled ? (
              <Volume2 className="w-4 h-4 text-[#294B3A]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#778078]" />
            )}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-[#778078] hover:text-[#26372D] hover:bg-[#E7E9E2] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Voice Banner / Ripple when listening */}
      {isListening && (
        <div className="bg-[#294B3A] text-white p-4 flex flex-col items-center justify-center transition-all animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F3DCCB] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#F3DCCB]"></span>
            </span>
            <span className="font-semibold text-sm tracking-wide">
              {t('listeningState')}
            </span>
          </div>
          {transcript && (
            <p className="mt-2 text-sm italic text-[#F3DCCB] max-w-md text-center">
              "{transcript}"
            </p>
          )}
        </div>
      )}

      {/* Error alert if mic denied */}
      {voiceError && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-800 flex items-center justify-between">
          <span>{voiceError}</span>
          <button
            onClick={() => setVoiceError(null)}
            className="text-amber-900 font-bold ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F8F7F1]/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm sm:text-base leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#294B3A] text-white rounded-br-xs'
                  : 'bg-[#FFFFFF] text-[#26372D] border border-[#E7E9E2] rounded-bl-xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              
              {/* Action chip if provided */}
              {msg.actionSuggested && (
                <div className="mt-3 pt-3 border-t border-[#E7E9E2]">
                  <button
                    onClick={() => handleActionClick(msg.actionSuggested!)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#65866E] text-white text-xs sm:text-sm font-bold hover:bg-[#526f59] transition-transform active:scale-95 shadow-xs"
                  >
                    <span>{msg.actionSuggested.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <span className="text-[11px] text-[#778078] mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts suggestions */}
      <div className="px-4 py-2 border-t border-[#E7E9E2] bg-[#FFFFFF] overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <span className="text-xs font-semibold text-[#778078] shrink-0">
          {t('sampleQuestions')}
        </span>
        {samplePrompts.map((p, idx) => {
          const text = language === 'hi' ? p.hi : p.en;
          return (
            <button
              key={idx}
              onClick={() => handleUserQuery(text)}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#F8F7F1] hover:bg-[#E7E9E2] text-[#294B3A] border border-[#E7E9E2] transition-colors shrink-0"
            >
              {text}
            </button>
          );
        })}
      </div>

      {/* Input controls: Large Mic + Text Field */}
      <div className="p-4 bg-[#FFFFFF] border-t border-[#E7E9E2]">
        <div className="flex items-center gap-3">
          {/* Big Voice Button */}
          <button
            onClick={isListening ? handleStopVoice : handleStartVoice}
            aria-label={isListening ? 'Stop listening' : 'Start voice recording'}
            className={`relative p-4 rounded-2xl flex items-center justify-center shrink-0 transition-all transform active:scale-90 shadow-md ${
              isListening
                ? 'bg-red-600 text-white animate-voice-ripple'
                : 'bg-[#65866E] text-white hover:bg-[#526f59]'
            }`}
          >
            {isListening ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          {/* Text Input Fallback */}
          <form onSubmit={handleFormSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'hi' ? 'यहाँ बोलें या लिखें...' : 'Type or ask anything...'}
              className="flex-1 px-4 py-3.5 bg-[#F8F7F1] border border-[#E7E9E2] rounded-xl text-sm sm:text-base text-[#26372D] placeholder-[#778078] focus:outline-hidden focus:ring-2 focus:ring-[#65866E] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Send message"
              className="p-3.5 bg-[#294B3A] text-white rounded-xl hover:bg-[#1E372B] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* One-Tap Help Modal triggered from Voice */}
      <OneTapHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};
