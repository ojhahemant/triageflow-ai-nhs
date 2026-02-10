
import { Patient } from "../types";

export const analyzeReferral = async (patient: Patient) => {
  try {
    // Call the backend API instead of OpenAI directly
    // This keeps the API key secure on the server
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ patient })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Analysis failed", error);
    return null;
  }
};
