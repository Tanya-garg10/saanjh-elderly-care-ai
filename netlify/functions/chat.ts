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
    const { message, language, context } = JSON.parse(event.body || '{}');
    if (typeof message !== 'string' || !message.trim()) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'A non-empty message is required.' }),
      };
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

    const compactContext = {
      senior: context?.seniorName || 'Meera Sharma',
      medicines: context?.activeMedicines?.slice(0, 5),
      appointments: context?.upcomingAppointments?.slice(0, 3),
      recentWellbeing: context?.recentWellbeing?.slice(0, 2),
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Care Context JSON:\n${JSON.stringify(compactContext)}\n\nUser Question: ${message.trim()}`,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text?.trim();
    if (!replyText) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Gemini returned an empty response.' }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        reply: replyText,
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
