// Browser Web Speech API wrappers with full error handling and fallback

// SpeechRecognition type declarations for browsers
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class VoiceService {
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static voicesLoaded: boolean = false;

  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    const win = window as unknown as IWindow;
    return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  public static isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  public static startListening(
    lang: 'en' | 'hi',
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (errorMessage: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser. Please use text input.');
      return false;
    }

    try {
      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch {
          // ignore
        }
      }

      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => {
        this.isListening = true;
      };

      rec.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onResult(text, Boolean(finalTranscript));
      };

      rec.onerror = (event: any) => {
        console.warn('[Saanjh Voice] Recognition error:', event.error);
        this.isListening = false;
        if (event.error === 'not-allowed') {
          onError('Microphone permission was denied. Please allow microphone access or type your question below.');
        } else if (event.error === 'no-speech') {
          onError('No speech was detected. Please try speaking again.');
        } else {
          onError(`Voice input error: ${event.error}. You can type below.`);
        }
      };

      rec.onend = () => {
        this.isListening = false;
        onEnd();
      };

      this.recognition = rec;
      rec.start();
      return true;
    } catch (err: any) {
      console.error('[Saanjh Voice] Start listening error:', err);
      onError(err?.message || 'Could not start voice recognition.');
      return false;
    }
  }

  public static stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('[Saanjh Voice] Stop error:', err);
      }
      this.isListening = false;
    }
  }

  public static speak(text: string, lang: 'en' | 'hi', onFinish?: () => void): void {
    if (!this.isSpeechSynthesisSupported()) {
      if (onFinish) onFinish();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any ongoing speech

      const cleanText = text.replace(/[*_#`]/g, ''); // strip markdown chars
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Calibrate speech for seniors: gentle, soothing, slightly slower rate for high comprehension
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const targetLangPrefix = lang === 'hi' ? 'hi' : 'en';

      // Find an appropriate voice
      const preferredVoice = voices.find(
        (v) => v.lang.startsWith(targetLangPrefix) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('India'))
      ) || voices.find((v) => v.lang.startsWith(targetLangPrefix));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      utterance.onend = () => {
        if (onFinish) onFinish();
      };
      utterance.onerror = (e) => {
        console.warn('[Saanjh Voice] TTS utterance error:', e);
        if (onFinish) onFinish();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[Saanjh Voice] TTS failed:', err);
      if (onFinish) onFinish();
    }
  }

  public static stopSpeaking(): void {
    if (this.isSpeechSynthesisSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }
}
