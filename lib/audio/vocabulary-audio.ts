import type { Story, StorySentence } from '@/lib/types/story';
import type { StoryVocabulary } from '@/lib/content/vocabulary';

export type VocabularyAudioClip = {
  audioUrl: string;
  start: number;
  end: number;
  sentenceId: string;
};
export type VocabularyAudioMap = Record<string, VocabularyAudioClip>;

export function vocabularyAudioKey(text: string): string {
  return text.normalize('NFC').toLocaleLowerCase('es').trim().replace(/\s+/g, ' ');
}

function spokenToken(text: string): string {
  return vocabularyAudioKey(text).replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, '');
}

function termTokens(text: string): string[] {
  return text.split(/\s+/u).map(spokenToken).filter(Boolean);
}

type Candidate = VocabularyAudioClip & { score: number };

function findCandidates(sentence: StorySentence, requested: string[], audioUrl: string): Candidate[] {
  const audio = sentence.audio;
  if (!audio?.words.length || requested.length === 0) return [];
  const spoken = audio.words.map(word => spokenToken(word.text));
  const matches: Candidate[] = [];
  for (let index = 0; index <= spoken.length - requested.length; index++) {
    if (!requested.every((token, offset) => spoken[index + offset] === token)) continue;
    const first = audio.words[index];
    const last = audio.words[index + requested.length - 1];
    const previous = audio.words[index - 1];
    const next = audio.words[index + requested.length];
    const leftGap = Math.max(0, first.start - (previous?.end ?? audio.start));
    const rightGap = Math.max(0, (next?.start ?? audio.end) - last.end);
    // Padding stays inside half of the available silence so adjacent words are not included.
    const start = Math.max(audio.start, first.start - Math.min(0.07, leftGap / 2));
    const end = Math.min(audio.end, last.end + Math.min(0.09, rightGap / 2));
    const boundaryBonus = (index === 0 ? 0.25 : 0) + (index + requested.length === spoken.length ? 0.25 : 0);
    matches.push({ audioUrl, sentenceId: sentence.id, start: Number(start.toFixed(3)), end: Number(end.toFixed(3)), score: leftGap + rightGap + boundaryBonus });
  }
  return matches;
}

export function buildVocabularyAudioMap(story: Story, vocabulary: StoryVocabulary): VocabularyAudioMap {
  if (story.narration.status !== 'ready' || story.narration.alignment !== 'words') return {};
  const audioUrl = story.narration.audioUrl;
  const texts = new Set<string>();
  for (const section of [vocabulary.nouns, vocabulary.verbs, vocabulary.prepositions, vocabulary.expressions]) {
    for (const term of section) texts.add(term.es);
  }
  for (const verb of vocabulary.verbs) for (const form of verb.present) texts.add(form);

  const clips: VocabularyAudioMap = {};
  for (const text of texts) {
    const tokens = termTokens(text);
    const candidates = story.sentences.flatMap(sentence => findCandidates(sentence, tokens, audioUrl));
    const best = candidates.sort((a, b) => b.score - a.score || a.start - b.start)[0];
    if (best) {
      const { score: _score, ...clip } = best;
      clips[vocabularyAudioKey(text)] = clip;
    }
  }
  return clips;
}

export function clipForText(audio: VocabularyAudioMap, text: string): VocabularyAudioClip | undefined {
  return audio[vocabularyAudioKey(text)];
}
