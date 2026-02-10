import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { patient } = req.body;

    if (!patient) {
      return res.status(400).json({ error: 'Patient data is required' });
    }

    // Initialize OpenAI with server-side API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
    As a clinical decision support assistant for the NHS, analyze this referral:
    Patient: ${patient.name}
    GP Note: ${patient.gpNote}
    History: ${patient.history}
    Comorbidities: ${patient.comorbidities.join(', ')}

    Please provide:
    1. A concise clinical summary.
    2. A safety-first assessment of urgency (Urgent, Routine, or Two-Week Wait).
    3. Suggested next step (Clinic, Biopsy, Surgery).
    4. Safety warnings (e.g. regarding medications or comorbidities).

    Respond in JSON format with the following structure:
    {
      "summary": "string",
      "urgencyRecommendation": "string",
      "suggestedPathway": "string",
      "safetyAlerts": ["string"]
    }
  `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a clinical decision support assistant for the NHS. Provide accurate, safety-focused medical triage recommendations in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const content = response.choices[0]?.message?.content;
    const result = content ? JSON.parse(content) : null;

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('OpenAI analysis failed:', error);
    return res.status(500).json({
      error: 'Analysis failed',
      message: error?.message || 'Unknown error'
    });
  }
}
