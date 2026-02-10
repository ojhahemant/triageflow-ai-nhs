
import OpenAI from "openai";
import { Patient } from "../types";

export const analyzeReferral = async (patient: Patient) => {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY || '',
    dangerouslyAllowBrowser: true // Required for client-side usage
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

  try {
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
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("OpenAI analysis failed", error);
    return null;
  }
};
