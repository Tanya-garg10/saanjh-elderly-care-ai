import { GoogleGenAI } from '@google/genai';
import type { Handler } from '@netlify/functions';

const MODEL_NAME = 'gemini-2.5-flash';

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
      model: MODEL_NAME,
    }),
  };
};
