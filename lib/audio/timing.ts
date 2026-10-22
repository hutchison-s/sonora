import type { StorySentence, WordTiming } from '@/lib/types/story';
// Inclusive at start, exclusive at end; a quiet gap leaves no fake active word.
export function findSentenceAt(sentences: StorySentence[], time: number): number {
  if (!Number.isFinite(time)) return -1;
  let lo = 0, hi = sentences.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const audio = sentences[mid].audio;
    if (!audio) return -1;
    if (time < audio.start) hi = mid - 1;
    else if (time >= audio.end) lo = mid + 1;
    else return mid;
  }
  return -1;
}
export function findWordAt(words: WordTiming[], time: number): number {
  if (!Number.isFinite(time)) return -1;
  let lo = 0, hi = words.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (time < words[mid].start) hi = mid - 1;
    else if (time >= words[mid].end) lo = mid + 1;
    else return mid;
  }
  return -1;
}
export function sentenceSeekTime(sentence: StorySentence): number | null { return sentence.audio?.start ?? null; }
export function clampSeek(seconds: number, duration: number): number { return Math.min(Math.max(0, seconds), Math.max(0, duration)); }
export const SPEEDS = [0.75, 1, 1.25] as const;
export function nextSpeed(current: number): typeof SPEEDS[number] {
  const idx = SPEEDS.findIndex(n => n === current);
  return SPEEDS[(idx + 1) % SPEEDS.length];
}
