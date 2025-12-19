
export interface WordData {
  id: string;
  english: string;
  persianMeaning: string;
  persianPhonetic: string;
  imageUrl: string;
  audioBase64?: string;
  exampleSentence: string;
  exampleTranslation: string;
  createdAt: number;
}

export interface GeminiWordResponse {
  persianMeaning: string;
  persianPhonetic: string;
  illustrationPrompt: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export type AppTab = 'search' | 'saved';
