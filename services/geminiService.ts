
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GeminiWordResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Fetches translation, phonetic info, and example using Gemini 3 Flash
 */
export const fetchWordInfo = async (word: string): Promise<GeminiWordResponse> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Translate the English word "${word}" to Persian. 
               Provide:
               1. The Persian meaning.
               2. The Persian phonetic pronunciation (e.g., apple -> اَپِل).
               3. A short 5-word prompt for a simple, clean clipart illustration of this word.
               4. A short, common English example sentence using the word.
               5. The Persian translation of that example sentence.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          persianMeaning: { type: Type.STRING },
          persianPhonetic: { type: Type.STRING },
          illustrationPrompt: { type: Type.STRING },
          exampleSentence: { type: Type.STRING },
          exampleTranslation: { type: Type.STRING },
        },
        required: ["persianMeaning", "persianPhonetic", "illustrationPrompt", "exampleSentence", "exampleTranslation"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text);
};

/**
 * Generates an image using Gemini 2.5 Flash Image
 */
export const generateWordImage = async (prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A clean, professional clipart illustration of ${prompt} on a pure white background, minimal vector style.` },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Image generation failed");
};

/**
 * Generates audio TTS using Gemini 2.5 Flash TTS
 */
export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  return base64Audio;
};
