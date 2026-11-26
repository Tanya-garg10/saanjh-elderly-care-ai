import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import type { Handler } from '@netlify/functions';

const MODEL_NAME = 'gemini-3.8-flash';

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
    let lastError: unknown = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Today's date is ${referenceDate}. Extract a structured daily reminder task from this spoken or typed note (which may be English, Hindi, or Hinglish): "${text.trim()}".`,
          config: {
            systemInstruction:
              'Extract a concise task title, resolve relative dates like today/aaj or tomorrow/kal to YYYY-MM-DD, convert times to HH:mm (default 17:00), and classify category as hydration, activity, rest, or custom.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                date: { type: Type.STRING },
                time: { type: Type.STRING },
                category: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ['title', 'date', 'time', 'category', 'notes'],
            },
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const rawJson = (response.text ?? '{}').trim();
        parsedResult = JSON.parse(rawJson);
        break;
      } catch (err: unknown) {
        lastError = err;
        const errMsg = String(err);
        if (errMsg.includes('503') || errMsg.includes('high demand') || errMsg.includes('UNAVAILABLE')) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }
        throw err;
      }
    }

    if (!parsedResult) {
      const errorMsg = lastError instanceof Error ? lastError.message : String(lastError);
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: errorMsg }),
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
        model: MODEL_NAME,
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
