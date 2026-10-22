export type Level = 'A1' | 'A2' | 'B1' | 'B2';
export type Mode = 'read' | 'listen';
export type AnnotationType = 'grammar' | 'vocabulary' | 'expression' | 'culture';
export type Grammar = { infinitive?: string; tense?: string; mood?: string; person?: string; structure?: string; pronouns?: string; breakdown?: { part: string; explanation: string }[]; examples?: { es: string; en: string }[] };
export type Annotation = { id: string; text: string; type: AnnotationType; meaning: string; explanation: string; grammar?: Grammar; tip?: string; occurrence?: number; start?: number; end?: number };
export type WordTiming = { text: string; start: number; end: number; charStart: number; charEnd: number };
export type SentenceAudio = { start: number; end: number; words: WordTiming[] } | null;
export type StorySentence = { id: string; es: string; en: string; annotations: Annotation[]; audio: SentenceAudio };
export type Question = { question: string; options: [string, string, string]; correctIndex: 0 | 1 | 2; explanation: string };
export type Narration = { status: 'unavailable'; audioUrl: null; durationSeconds: null; alignment: 'none' } | { status: 'ready'; audioUrl: string; durationSeconds: number; alignment: 'words' | 'sentences' };
export type Story = {
  schemaVersion: 1; id: string; title: { es: string; en: string }; level: Level;
  dialect: string; genre: string; synopsis: string; series: string | null; episode: number | null;
  grammarFocus: string; secondaryGrammar: string[]; estimatedDurationSeconds: number;
  wordCount: number; coverImagePrompt: string; coverImage: string;
  sentences: StorySentence[]; comprehension: [Question, Question, Question]; narration: Narration;
};
