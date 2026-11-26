import { GoogleGenAI, ThinkingLevel } from '@google/genai';
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

    const response = await ai.models.generateContent({
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
    });

    const summary = response.text?.trim();
    if (!summary) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Gemini returned an empty summary.' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ summary, model: MODEL_NAME }),
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
