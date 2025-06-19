
export type PoemLanguage = "English" | "Hindi" | "Hinglish";
export type PoemStyle = "Haiku" | "Free Verse" | "Romantic" | "Motivational" | "Sonnet" | "Limerick" | "Ode" | "Ballad" | "Elegy" | "Narrative";
export type PoemTone = "Joyful" | "Calm" | "Melancholic" | "Nostalgic" | "Reflective" | "Humorous" | "Inspired" | "Mysterious" | "Hopeful" | "Wistful" | "Playful" | "Dramatic";
export type PoemLength = "Short" | "Medium" | "Long";

export interface PoemSettings {
  language: PoemLanguage;
  style: PoemStyle;
  tone: PoemTone;
  poemLength: PoemLength;
  customInstruction?: string;
}

export const LANGUAGES: PoemLanguage[] = ["English", "Hindi", "Hinglish"];
export const STYLES: PoemStyle[] = ["Haiku", "Free Verse", "Romantic", "Motivational", "Sonnet", "Limerick", "Ode", "Ballad", "Elegy", "Narrative"];
export const TONES: PoemTone[] = ["Joyful", "Calm", "Melancholic", "Nostalgic", "Reflective", "Humorous", "Inspired", "Mysterious", "Hopeful", "Wistful", "Playful", "Dramatic"];
export const LENGTHS: PoemLength[] = ["Short", "Medium", "Long"];

export type AppStep = "upload" | "describe" | "customize" | "display";
