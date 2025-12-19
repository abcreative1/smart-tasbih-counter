
import { GoogleGenAI, Type } from "@google/genai";
import { AIInsightResponse } from "../types";

export const getTasbihInsight = async (tasbihName: string): Promise<AIInsightResponse | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key missing. Insights disabled.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-3-flash-preview';
    const prompt = `Provide a spiritual insight for the Dhikr: "${tasbihName}". 
    Return a JSON object with:
    - "meaning": The English translation/meaning.
    - "benefit": A 1-2 sentence explanation of its spiritual benefit or reward in Islam.
    - "source": Optional reference (e.g., "Sahih Bukhari" or "Quran 2:152") if applicable, else null.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meaning: { 
              type: Type.STRING,
              description: 'The English translation or meaning.'
            },
            benefit: { 
              type: Type.STRING,
              description: 'A brief spiritual benefit or reward.'
            },
            source: { 
              type: Type.STRING,
              description: 'A citation or source for the Dhikr.'
            },
          },
          required: ["meaning", "benefit"],
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    return null;
  }
};
