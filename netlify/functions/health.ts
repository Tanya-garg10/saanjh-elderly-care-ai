import { GoogleGenAI } from '@google/genai';
import type { Handler } from '@netlify/functions';

// Official current Gemini models in priority order
const MODEL_CANDIDATES = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export const handler: Handler = async () => {
  const ai = getGeminiClient();
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      ok: true,
      geminiConfigured: Boolean(ai),
      model: MODEL_CANDIDATES[0],
    }),
  };
};
