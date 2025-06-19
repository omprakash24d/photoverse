export type PoemLanguage = "English" | "Hindi" | "Hinglish";
export type PoemStyle = "Haiku" | "Free Verse" | "Romantic" | "Motivational" | "Sonnet" | "Limerick";
export type PoemTone = "Joyful" | "Calm" | "Melancholic" | "Nostalgic" | "Reflective" | "Humorous" | "Inspired";

export interface PoemSettings {
  language: PoemLanguage;
  style: PoemStyle;
  tone: PoemTone;
}

export const LANGUAGES: PoemLanguage[] = ["English", "Hindi", "Hinglish"];
export const STYLES: PoemStyle[] = ["Haiku", "Free Verse", "Romantic", "Motivational", "Sonnet", "Limerick"];
export const TONES: PoemTone[] = ["Joyful", "Calm", "Melancholic", "Nostalgic", "Reflective", "Humorous", "Inspired"];

export type AppStep = "upload" | "describe" | "customize" | "display";
