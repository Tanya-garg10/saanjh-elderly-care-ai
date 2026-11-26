import { GoogleGenAI } from '@google/genai';
import type { Handler } from '@netlify/functions';

const MODEL_CANDIDATES = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];

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
    const { appointment, concerns, questions, activeMedicines } = JSON.parse(event.body || '{}');
    if (!appointment || typeof appointment.doctorName !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Appointment details are required.' }),
      };
    }

    const systemInstruction = `You organize a senior user's personal notes before a doctor appointment.
Rules:
- Combine the user's concerns, questions, appointment details, and active medicine names into a clear, polite, easy-to-read preparation note (4 to 6 short sentences, plain text, no markdown bullets or asterisks).
- STRICTLY DO NOT generate any medical diagnosis, possible causes, or treatment/dosage recommendations.
- Clearly frame everything as the user's own topics to discuss with their doctor.`;

    let summaryText = '';
    let usedModel = '';
    let lastError: unknown = null;

    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: JSON.stringify({
            appointment,
            userConcerns: Array.isArray(concerns) ? concerns : [],
            userQuestions: Array.isArray(questions) ? questions : [],
            activeMedicines: Array.isArray(activeMedicines) ? activeMedicines : [],
          }),
          config: {
            systemInstruction,
          },
        });
        const text = response.text?.trim();
        if (text) {
          summaryText = text;
          usedModel = model;
          break;
        }
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Model ${model} failed in visit-prep:`, err);
      }
    }

    if (!summaryText) {
      const errorMsg = lastError instanceof Error ? lastError.message : String(lastError);
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: errorMsg }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ summary: summaryText, model: usedModel }),
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
