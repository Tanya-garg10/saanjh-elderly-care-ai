import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import type { Handler } from '@netlify/functions';

const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-3.8-flash'];

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  const ai = getGeminiClient();
  if (!ai) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        code: 'GEMINI_KEY_MISSING',
        error: 'GEMINI_API_KEY is not configured in Netlify environment variables.',
      }),
    };
  }

  try {
    const { text, todayDate } = JSON.parse(event.body || '{}');
    if (typeof text !== 'string' || !text.trim()) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Voice note text is required.' }),
      };
    }

    const referenceDate =
      typeof todayDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(todayDate)
        ? todayDate
        : new Date().toISOString().slice(0, 10);

    let parsedResult: {
      title?: string;
      date?: string;
      time?: string;
      category?: string;
      notes?: string;
    } | null = null;
    let usedModel = '';
    let lastError: unknown = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
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
        });

        const rawJson = (response.text ?? '{}').trim();
        parsedResult = JSON.parse(rawJson);
        usedModel = model;
        break;
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Model ${model} failed in parse-task, trying next:`, err);
      }
    }

    if (!parsedResult) {
      const errorMsg = lastError instanceof Error ? lastError.message : String(lastError);
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: errorMsg || 'All models temporarily unavailable.' }),
      };
    }

    const validCategories = ['hydration', 'activity', 'rest', 'custom'];
    const category = validCategories.includes(parsedResult.category ?? '')
      ? parsedResult.category
      : 'custom';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        task: {
          title: (parsedResult.title || text).trim(),
          date:
            parsedResult.date && /^\d{4}-\d{2}-\d{2}$/.test(parsedResult.date)
              ? parsedResult.date
              : referenceDate,
          time:
            parsedResult.time && /^\d{2}:\d{2}$/.test(parsedResult.time) ? parsedResult.time : '17:00',
          category,
          notes: parsedResult.notes || `Extracted from note: "${text.trim()}"`,
          detectedFrom: text.trim(),
        },
        model: usedModel,
      }),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: errorMsg }),
    };
  }
};
