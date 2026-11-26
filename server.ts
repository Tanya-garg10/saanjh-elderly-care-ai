import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastErr = err;
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status?: unknown }).status)
          : 0;
      if (attempt < retries && (status === 429 || status === 503 || status === 0)) {
        await new Promise((r) => setTimeout(r, 400 * Math.pow(2, attempt)));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

function formatGeminiError(err: unknown): { status: number; message: string; code: string } {
  const rawMsg =
    err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown Gemini API error';
  const status =
    typeof err === 'object' && err !== null && 'status' in err
      ? Number((err as { status?: unknown }).status) || 500
      : 500;

  if (status === 403 || rawMsg.includes('PERMISSION_DENIED') || rawMsg.includes('API_KEY_INVALID')) {
    return {
      status: 403,
      code: 'GEMINI_AUTH_ERROR',
      message: 'Gemini API key was rejected. Please verify GEMINI_API_KEY in Settings > Secrets.',
    };
  }
  if (status === 429 || rawMsg.includes('RESOURCE_EXHAUSTED')) {
    return {
      status: 429,
      code: 'GEMINI_QUOTA_EXCEEDED',
      message: 'Gemini API rate limit reached temporarily. Please try again in a moment.',
    };
  }
  return {
    status,
    code: 'GEMINI_UPSTREAM_ERROR',
    message: rawMsg,
  };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    const ai = getGeminiClient();
    res.json({
      ok: true,
      geminiConfigured: Boolean(ai),
      model: MODEL_NAME,
    });
  });

  // 1. Talk to Saanjh Conversational Endpoint
  app.post('/api/saanjh/chat', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        code: 'GEMINI_KEY_MISSING',
        error: 'GEMINI_API_KEY is not configured on the server. Using local rule-based fallback.',
      });
    }

    const { message, language, context } = req.body ?? {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A non-empty message is required.' });
    }

    const langLabel =
      language === 'hi'
        ? 'Hindi (clear, respectful, conversational Devanagari or easy Hindi)'
        : language === 'hinglish'
          ? 'Hinglish (natural warm mix of Hindi and English in Latin script)'
          : 'English (warm, clear, unhurried)';

    const systemInstruction = `You are Saanjh, a calm, respectful, voice-first elderly care companion assisting Meera Sharma (age 68).
Respond in ${langLabel}.
Keep responses concise (2 to 4 short sentences) and easy to listen to when read aloud by a voice synthesizer:
- NEVER use middle dots (·), bullet symbols, asterisks (*), markdown formatting, or parentheses.
- Write medicine dosages in plain spoken words like "5 milligrams" or "500 milligrams" instead of "5 mg · 1 tablet".
- Answer ONLY using the provided JSON care context below. Never invent medicines, appointments, or test values that are not in the context.
- Never give medical diagnoses, clinical opinions, or treatment changes; encourage consulting her doctor for medical questions.
- Preserve Meera's dignity and independence at all times.`;

    try {
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Care Context JSON:\n${JSON.stringify(context ?? {})}\n\nUser Question: ${message.trim()}`,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        })
      );

      const replyText = response.text?.trim();
      if (!replyText) {
        return res.status(502).json({
          code: 'GEMINI_EMPTY_RESPONSE',
          error: 'Gemini returned an empty response.',
        });
      }

      return res.json({
        reply: replyText,
        model: MODEL_NAME,
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      return res.status(formatted.status).json({
        code: formatted.code,
        error: formatted.message,
      });
    }
  });

  // 2. Voice Notes to Smart Tasks Extraction Endpoint
  app.post('/api/saanjh/parse-task', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        code: 'GEMINI_KEY_MISSING',
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const { text, todayDate } = req.body ?? {};
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Voice note text is required.' });
    }

    const referenceDate =
      typeof todayDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(todayDate)
        ? todayDate
        : new Date().toISOString().slice(0, 10);

    try {
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Today's date is ${referenceDate}. Extract a structured daily reminder task from this spoken or typed note (which may be English, Hindi, or Hinglish): "${text.trim()}".`,
          config: {
            systemInstruction:
              'Extract a concise task title in clean natural language, resolve relative dates like today/aaj or tomorrow/kal against the given reference date into YYYY-MM-DD, convert times like "4 PM" or "shaam 6 baje" into 24-hour HH:mm (default 17:00 if no time given), and classify category as hydration, activity, rest, or custom.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Clean concise task title.' },
                date: { type: Type.STRING, description: 'Date in YYYY-MM-DD format.' },
                time: { type: Type.STRING, description: '24-hour time in HH:mm format.' },
                category: {
                  type: Type.STRING,
                  description: 'One of: hydration, activity, rest, custom',
                },
                notes: { type: Type.STRING, description: 'Short helpful note.' },
              },
              required: ['title', 'date', 'time', 'category', 'notes'],
            },
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        })
      );

      const rawJson = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawJson) as {
        title?: string;
        date?: string;
        time?: string;
        category?: string;
        notes?: string;
      };

      const validCategories = ['hydration', 'activity', 'rest', 'custom'];
      const category = validCategories.includes(parsed.category ?? '')
        ? parsed.category
        : 'custom';

      return res.json({
        task: {
          title: (parsed.title || text).trim(),
          date:
            parsed.date && /^\d{4}-\d{2}-\d{2}$/.test(parsed.date)
              ? parsed.date
              : referenceDate,
          time:
            parsed.time && /^\d{2}:\d{2}$/.test(parsed.time) ? parsed.time : '17:00',
          category,
          notes: parsed.notes || `Extracted from note: "${text.trim()}"`,
          detectedFrom: text.trim(),
        },
        model: MODEL_NAME,
      });
    } catch (err) {
      const formatted = formatGeminiError(err);
      return res.status(formatted.status).json({
        code: formatted.code,
        error: formatted.message,
      });
    }
  });

  // 3. Doctor Visit Preparation Summary Endpoint
  app.post('/api/saanjh/visit-prep', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        code: 'GEMINI_KEY_MISSING',
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const { appointment, concerns, questions, activeMedicines } = req.body ?? {};
    if (!appointment || typeof appointment.doctorName !== 'string') {
      return res.status(400).json({ error: 'Appointment details are required.' });
    }

    const systemInstruction = `You organize a senior user's personal notes before a doctor appointment.
Rules:
- Combine the user's concerns, questions, appointment details, and active medicine names into a clear, polite, easy-to-read preparation note (4 to 6 short sentences, plain text, no markdown bullets or asterisks).
- STRICTLY DO NOT generate any medical diagnosis, possible causes, or treatment/dosage recommendations.
- Clearly frame everything as the user's own topics to discuss with their doctor.`;

    try {
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: JSON.stringify({
            appointment,
            userConcerns: Array.isArray(concerns) ? concerns : [],
            userQuestions: Array.isArray(questions) ? questions : [],
            activeMedicines: Array.isArray(activeMedicines) ? activeMedicines : [],
          }),
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        })
      );

      const summary = response.text?.trim();
      if (!summary) {
        return res.status(502).json({
          code: 'GEMINI_EMPTY_RESPONSE',
          error: 'Gemini returned an empty summary.',
        });
      }

      return res.json({ summary, model: MODEL_NAME });
    } catch (err) {
      const formatted = formatGeminiError(err);
      return res.status(formatted.status).json({
        code: formatted.code,
        error: formatted.message,
      });
    }
  });

  // Mount Vite middleware in development or serve static dist/ in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Saanjh server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start Saanjh server:', err);
  process.exit(1);
});
