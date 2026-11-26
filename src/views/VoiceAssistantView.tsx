import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Volume2, Send, Info, Check, X, Sparkles } from 'lucide-react';
import { useSaanjh } from '../context/SaanjhContext';
import { AssistantLanguage, RoutineActivityCategory } from '../types/saanjh';
import {
  cleanTextForSpeech,
  parseSmartTaskFromText,
  ProposedSmartTask,
} from '../utils/assistantEngine';
import { formatDisplayDate, formatTime12h } from '../data/seedData';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

const EXAMPLE_PROMPTS: { label: string; lang: AssistantLanguage }[] = [
  { label: 'What medicines do I need to take today?', lang: 'en' },
  { label: 'Mera next doctor appointment kab hai?', lang: 'hinglish' },
  { label: 'How am I feeling this week?', lang: 'en' },
  { label: 'What should I do next?', lang: 'en' },
];

const TASK_EXAMPLES: string[] = [
  'Remind me to drink warm water tomorrow at 4 PM',
  'Kal subah 8 baje balcony walk ke liye yaad dilana',
  'Evening herbal tea today at 5:30 PM',
];

export const VoiceAssistantView: React.FC = () => {
  const { state, sendAssistantMessage, updateAccessibility, addRoutineActivity, navigate } =
    useSaanjh();
  const [mode, setMode] = useState<'chat' | 'smart-task'>('chat');
  const [language, setLanguage] = useState<AssistantLanguage>(
    state.seniorProfile.preferredLanguage || 'en'
  );
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  // Proposed smart task confirmation state
  const [proposedTask, setProposedTask] = useState<ProposedSmartTask | null>(null);
  const [taskSavedNotice, setTaskSavedNotice] = useState('');

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const SpeechRecognitionCtor =
    typeof window !== 'undefined'
      ? ((window as unknown as Record<string, unknown>).SpeechRecognition ||
          (window as unknown as Record<string, unknown>).webkitSpeechRecognition)
      : undefined;

  const speechRecognitionSupported = typeof SpeechRecognitionCtor === 'function';
  const speechSynthesisSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: state.accessibility.reducedMotion ? 'auto' : 'smooth',
    });
  }, [state.assistantMessages, state.accessibility.reducedMotion]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const speakText = (rawText: string, lang: AssistantLanguage) => {
    if (!speechSynthesisSupported) return;
    window.speechSynthesis.cancel();

    const spokenText = cleanTextForSpeech(rawText);
    const utterance = new SpeechSynthesisUtterance(spokenText);
    const targetLang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = targetLang;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase() === targetLang.toLowerCase()) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(lang === 'hi' ? 'hi' : 'en'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const looksLikeReminderIntent = (text: string) => {
    const lower = text.toLowerCase();
    return (
      lower.includes('remind') ||
      lower.includes('yaad') ||
      lower.includes('add task') ||
      lower.includes('set reminder') ||
      lower.includes('add reminder')
    );
  };

  const handleSubmitText = (query: string, overrideLang?: AssistantLanguage) => {
    const clean = query.trim();
    if (!clean) return;
    const activeLang = overrideLang ?? language;
    setTaskSavedNotice('');

    if (mode === 'smart-task' || looksLikeReminderIntent(clean)) {
      const proposal = parseSmartTaskFromText(clean);
      if (proposal) {
        setProposedTask(proposal);
        setInputText('');
        if (state.accessibility.voiceAutoRead) {
          speakText(
            `I prepared a reminder for ${proposal.title} on ${formatDisplayDate(proposal.date)} at ${formatTime12h(proposal.time)}. Please confirm below before saving.`,
            activeLang
          );
        }
        return;
      }
    }

    const reply = sendAssistantMessage(clean, activeLang);
    setInputText('');
    if (reply && state.accessibility.voiceAutoRead) {
      speakText(reply, activeLang);
    }
  };

  const handleConfirmSmartTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedTask || !proposedTask.title.trim()) return;

    addRoutineActivity({
      title: proposedTask.title.trim(),
      category: proposedTask.category,
      date: proposedTask.date,
      time: proposedTask.time,
      notes: proposedTask.notes,
      status: 'pending',
    });

    const confirmationText = `Saved "${proposedTask.title}" to your Routine Planner for ${formatDisplayDate(proposedTask.date)} at ${formatTime12h(proposedTask.time)}.`;
    setTaskSavedNotice(confirmationText);
    setProposedTask(null);

    if (state.accessibility.voiceAutoRead) {
      speakText(confirmationText, language);
    }
  };

  const handleToggleMic = () => {
    setVoiceError('');
    if (!speechRecognitionSupported) {
      setVoiceError(
        'Browser speech recognition is not supported here. Please type your question or voice note below.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const Ctor = SpeechRecognitionCtor as new () => SpeechRecognitionLike;
      const recognition = new Ctor();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        setIsListening(false);
        if (transcript.trim()) {
          handleSubmitText(transcript);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setVoiceError(
          `Could not capture voice (${event.error}). You can type your request below anytime.`
        );
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setVoiceError(
        'Microphone access was unavailable. Please use the text input fallback below.'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[var(--border-hairline)]">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Talk to Saanjh
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Ask about your schedule or speak a reminder to create a confirmed smart task.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switch */}
          <div
            role="group"
            aria-label="Assistant mode"
            className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-white)] border border-[var(--border-hairline)]"
          >
            <button
              type="button"
              onClick={() => setMode('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                mode === 'chat'
                  ? 'bg-[var(--deep-green)] text-white'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              Ask Saanjh
            </button>
            <button
              type="button"
              onClick={() => setMode('smart-task')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                mode === 'smart-task'
                  ? 'bg-[var(--deep-green)] text-white'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              Voice Note to Task
            </button>
          </div>

          {/* Language Selector */}
          <div
            role="group"
            aria-label="Assistant language"
            className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-white)] border border-[var(--border-hairline)]"
          >
            {(
              [
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'Hindi' },
                { id: 'hinglish', label: 'Hinglish' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLanguage(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  language === opt.id
                    ? 'bg-[var(--deep-green)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              updateAccessibility({ voiceAutoRead: !state.accessibility.voiceAutoRead })
            }
            aria-pressed={state.accessibility.voiceAutoRead}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap ${
              state.accessibility.voiceAutoRead
                ? 'border-[var(--deep-green)] bg-[var(--secondary-sage)] text-[var(--deep-green)]'
                : 'border-[var(--border-hairline)] bg-[var(--surface-white)] text-[var(--text-secondary)]'
            }`}
          >
            <Volume2 className="w-4 h-4" aria-hidden="true" />
            <span>Read aloud: {state.accessibility.voiceAutoRead ? 'On' : 'Off'}</span>
          </button>
        </div>
      </header>

      {/* Transparent Local Rule-Based Disclosure */}
      <div className="rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] px-5 py-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[var(--deep-green)] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Transparent local assistant: Saanjh uses an offline rule-based assistant connected to
          your saved records and cleans punctuation automatically for clear voice read-aloud.
          Smart task proposals always wait for your confirmation before saving.
        </p>
      </div>

      {/* Proposed Smart Task Confirmation Card */}
      {proposedTask && (
        <section
          aria-labelledby="proposed-task-heading"
          className="rounded-2xl bg-[var(--secondary-sage)] border border-[var(--deep-green)]/30 p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--deep-green)]" aria-hidden="true" />
              <h2
                id="proposed-task-heading"
                className="font-display text-lg font-semibold text-[var(--deep-green)]"
              >
                Confirm Proposed Smart Task
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setProposedTask(null)}
              aria-label="Discard proposed task"
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-white/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-1 text-xs text-[var(--text-primary)]">
            Detected from: &ldquo;{proposedTask.detectedFrom}&rdquo; — review or edit before saving
            to your Daily Routine Planner.
          </p>

          <form onSubmit={handleConfirmSmartTask} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="st-title" className="block text-xs font-medium mb-1">
                Task Title
              </label>
              <input
                id="st-title"
                type="text"
                value={proposedTask.title}
                onChange={(e) =>
                  setProposedTask({ ...proposedTask, title: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm"
              />
            </div>

            <div>
              <label htmlFor="st-date" className="block text-xs font-medium mb-1">
                Date
              </label>
              <input
                id="st-date"
                type="date"
                value={proposedTask.date}
                onChange={(e) =>
                  setProposedTask({ ...proposedTask, date: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="st-time" className="block text-xs font-medium mb-1">
                Time
              </label>
              <input
                id="st-time"
                type="time"
                value={proposedTask.time}
                onChange={(e) =>
                  setProposedTask({ ...proposedTask, time: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm tabular-nums"
              />
            </div>

            <div>
              <label htmlFor="st-cat" className="block text-xs font-medium mb-1">
                Category
              </label>
              <select
                id="st-cat"
                value={proposedTask.category}
                onChange={(e) =>
                  setProposedTask({
                    ...proposedTask,
                    category: e.target.value as RoutineActivityCategory,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm"
              >
                <option value="hydration">Hydration</option>
                <option value="activity">Daily Activity</option>
                <option value="rest">Rest</option>
                <option value="custom">Reminder</option>
              </select>
            </div>

            <div className="md:col-span-3 flex flex-wrap items-end justify-end gap-3">
              <button
                type="button"
                onClick={() => setProposedTask(null)}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--surface-white)] text-sm font-medium"
              >
                Discard
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C]"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Confirm &amp; Save to Routine</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {taskSavedNotice && (
        <div
          role="status"
          className="rounded-2xl bg-[var(--surface-white)] border border-[var(--deep-green)]/40 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--deep-green)]"
        >
          <span>{taskSavedNotice}</span>
          <button
            type="button"
            onClick={() => navigate('routine-planner')}
            className="font-medium underline"
          >
            View in Routine Planner
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Microphone & Prompt Suggestions */}
        <section className="lg:col-span-5 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] p-6 text-center">
          <div className="py-4 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              {isListening && !state.accessibility.reducedMotion && (
                <span
                  aria-hidden="true"
                  className="absolute w-32 h-32 rounded-full bg-[var(--secondary-sage)] animate-ping opacity-70"
                />
              )}
              <button
                type="button"
                onClick={handleToggleMic}
                aria-label={isListening ? 'Stop listening' : 'Tap to speak to Saanjh'}
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
                  isListening
                    ? 'bg-[var(--accent-terracotta)] text-white'
                    : 'bg-[var(--deep-green)] text-white hover:bg-[#2A493C]'
                }`}
              >
                {isListening ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9" />}
              </button>
            </div>

            <p className="mt-5 font-display text-lg font-semibold text-[var(--text-primary)]">
              {isListening
                ? 'Listening gently...'
                : speechRecognitionSupported
                  ? mode === 'smart-task'
                    ? 'Speak a reminder to create a task'
                    : 'Tap microphone to speak'
                  : 'Voice input unavailable in this browser'}
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {speechRecognitionSupported
                ? `Language: ${language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish' : 'English'}`
                : 'Use the text box or quick prompts anytime.'}
            </p>

            {voiceError && (
              <p
                role="status"
                className="mt-4 text-sm text-[#9B543C] bg-[#F9F1ED] border border-[#E8D5CD] rounded-xl px-4 py-2.5 text-left"
              >
                {voiceError}
              </p>
            )}
          </div>

          <div className="mt-4 pt-5 border-t border-[var(--border-hairline)] text-left space-y-4">
            <div>
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                {mode === 'smart-task' ? 'Try a voice note reminder' : 'Try asking Saanjh'}
              </p>
              <div className="space-y-2">
                {mode === 'smart-task'
                  ? TASK_EXAMPLES.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => handleSubmitText(label)}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] transition-colors"
                      >
                        {label}
                      </button>
                    ))
                  : EXAMPLE_PROMPTS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setLanguage(item.lang);
                          handleSubmitText(item.label, item.lang);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-sm text-[var(--text-primary)] hover:bg-[var(--secondary-sage)] transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Conversation Area & Text Input Fallback */}
        <section className="lg:col-span-7 rounded-2xl bg-[var(--surface-white)] border border-[var(--border-hairline)] flex flex-col min-h-[520px]">
          <div className="px-6 py-4 border-b border-[var(--border-hairline)] flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
              Conversation
            </h2>
            <span className="text-xs text-[var(--text-secondary)] tabular-nums">
              {state.assistantMessages.length} messages
            </span>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[420px]">
            {state.assistantMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-base leading-relaxed ${
                      isUser
                        ? 'bg-[var(--deep-green)] text-white'
                        : 'bg-[var(--bg-ivory)] border border-[var(--border-hairline)] text-[var(--text-primary)]'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-[var(--text-secondary)] tabular-nums">
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.dataSources && msg.dataSources.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>Source: {msg.dataSources.join(', ')}</span>
                      </>
                    )}
                    {!isUser && speechSynthesisSupported && (
                      <>
                        <span aria-hidden="true">·</span>
                        <button
                          type="button"
                          onClick={() => speakText(msg.text, msg.language)}
                          className="inline-flex items-center gap-1 text-[var(--deep-green)] hover:underline"
                        >
                          <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Listen</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputText.trim()) handleSubmitText(inputText);
            }}
            className="p-4 border-t border-[var(--border-hairline)] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <label htmlFor="assistant-text-input" className="sr-only">
              Ask Saanjh or type a reminder
            </label>
            <input
              id="assistant-text-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === 'smart-task'
                  ? 'e.g. Remind me to drink water tomorrow at 4 PM...'
                  : 'Ask a question or type a reminder in English, Hindi, or Hinglish...'
              }
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-ivory)] text-base text-[var(--text-primary)]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--deep-green)] text-white text-sm font-medium hover:bg-[#2A493C] disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>{mode === 'smart-task' ? 'Extract Task' : 'Send'}</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
