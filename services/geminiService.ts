import { GoogleGenAI, Type } from "@google/genai";
import { AIInsightResponse } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize conditionally to prevent crashes if key is missing during dev, 
// though the prompt says assume it's valid.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getTasbihInsight = async (tasbihName: string): Promise<AIInsightResponse | null> => {
  if (!ai) return null;

  try {
    const model = 'gemini-2.5-flash';
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
            meaning: { type: Type.STRING },
            benefit: { type: Type.STRING },
            source: { type: Type.STRING, nullable: true },
          },
          required: ["meaning", "benefit"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as AIInsightResponse;
    }
    return null;
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    return null;
  }
};
