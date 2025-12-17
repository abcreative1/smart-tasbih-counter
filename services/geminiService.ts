import { GoogleGenAI, Type } from "@google/genai";
import { AIInsightResponse } from "../types";

// Always initialize with API key from process.env.API_KEY using named parameter as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTasbihInsight = async (tasbihName: string): Promise<AIInsightResponse | null> => {
  try {
    // Using gemini-3-flash-preview for basic text tasks (e.g., summarization, simple Q&A)
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
              description: 'The English translation/meaning of the Dhikr.'
            },
            benefit: { 
              type: Type.STRING,
              description: 'Spiritual benefit or reward in Islam.'
            },
            source: { 
              type: Type.STRING,
              description: 'Canonical source or reference.'
            },
          },
          required: ["meaning", "benefit"],
          propertyOrdering: ["meaning", "benefit", "source"]
        }
      }
    });

    // Access the .text property directly (do not call as a method)
    const jsonStr = response.text?.trim();
    if (jsonStr) {
        return JSON.parse(jsonStr) as AIInsightResponse;
    }
    return null;
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    return null;
  }
};