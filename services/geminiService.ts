import { GoogleGenAI, Type } from "@google/genai";
import { AIInsightResponse } from "../types";

// Helper to safely get the API Key without crashing initialization
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch {
    return '';
  }
};

export const getTasbihInsight = async (tasbihName: string): Promise<AIInsightResponse | null> => {
  const apiKey = getApiKey();
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
            meaning: { type: Type.STRING },
            benefit: { type: Type.STRING },
            source: { type: Type.STRING, nullable: true },
          },
          required: ["meaning", "benefit"],
        }
      }
    });

    const jsonStr = response.text?.trim();
    return jsonStr ? JSON.parse(jsonStr) : null;
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    return null;
  }
};