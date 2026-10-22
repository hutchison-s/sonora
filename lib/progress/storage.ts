import { z } from 'zod';
import type { Level, Mode } from '@/lib/types/story';

const progressSchema = z.object({
  sentenceIndex: z.number().int().nonnegative().default(0),
  audioSeconds: z.number().nonnegative().default(0),
  completed: z.boolean().default(false),
  lastRead: z.string().default(''),
  completedQuestions: z.array(z.number().int().min(0).max(2)).default([]),
}).strict();
const settingsSchema = z.object({
  level: z.enum(['All', 'A1', 'A2', 'B1', 'B2']).default('All'),
  translation: z.boolean().default(false), mode: z.enum(['read', 'listen']).default('read'),
  speed: z.union([z.literal(0.75), z.literal(1), z.literal(1.25)]).default(1),
}).strict();
const stateSchema = z.object({
  version: z.literal(1), settings: settingsSchema,
  reading: z.record(progressSchema).default({}),
  savedPhrases: z.array(z.string()).default([]),
  lastStory: z.string().nullable().default(null),
  listeningSeconds: z.number().nonnegative().default(0),
}).strict();
export type ProgressState = z.infer<typeof stateSchema>;
export type ReadingState = z.infer<typeof progressSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export const KEY = 'sonora:progress';
let volatileFallback: ProgressState | null = null;
export const DEFAULT_PROGRESS: ProgressState = {
  version: 1, settings: { level: 'All', translation: false, mode: 'read', speed: 1 },
  reading: {}, savedPhrases: [], lastStory: null, listeningSeconds: 0,
};

// Central entry point for future schema migrations. Unsupported/faulty data safely resets.
export function migrateProgress(raw: unknown): ProgressState {
  if (!raw || typeof raw !== 'object') return structuredClone(DEFAULT_PROGRESS);
  const old = raw as Record<string, unknown>;
  if (old.version === 0 && typeof old.settings === 'object') {
    return stateSchema.parse({ ...DEFAULT_PROGRESS, ...old, version: 1 });
  }
  const result = stateSchema.safeParse(raw);
  return result.success ? result.data : structuredClone(DEFAULT_PROGRESS);
}
export function readProgress(storage?: Pick<Storage, 'getItem'>): ProgressState {
  try {
    const target = storage ?? (typeof window === 'undefined' ? undefined : window.localStorage);
    const value = target?.getItem(KEY);
    return value ? migrateProgress(JSON.parse(value)) : (storage ? structuredClone(DEFAULT_PROGRESS) : structuredClone(volatileFallback ?? DEFAULT_PROGRESS));
  } catch { return structuredClone(volatileFallback ?? DEFAULT_PROGRESS); }
}
export function writeProgress(next: ProgressState, storage?: Pick<Storage, 'setItem'>): void {
  const valid = stateSchema.parse(next);
  if (!storage) volatileFallback = valid;
  try {
    const target = storage ?? (typeof window === 'undefined' ? undefined : window.localStorage);
    target?.setItem(KEY, JSON.stringify(valid));
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('sonora:updated'));
  } catch { /* private browsing/quota error: in-memory UI still works */ }
}
export function updateProgress(update: (previous: ProgressState) => ProgressState): ProgressState {
  const next = update(readProgress());
  writeProgress(next);
  return next;
}
export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
  updateProgress(s => ({ ...s, settings: { ...s.settings, [key]: value } }));
}
export function visitStory(id: string, sentenceIndex?: number): void {
  updateProgress(s => ({ ...s, lastStory: id, reading: { ...s.reading, [id]: {
    ...{ sentenceIndex: 0, audioSeconds: 0, completed: false, lastRead: '', completedQuestions: [] },
    ...s.reading[id],
    ...(sentenceIndex === undefined ? {} : { sentenceIndex }),
    lastRead: new Date().toISOString(),
  } } }));
}
export function recordAudioPosition(id: string, seconds: number, listenedSeconds = 0): void {
  updateProgress(s => ({ ...s, listeningSeconds: s.listeningSeconds + Math.max(0, listenedSeconds),
    reading: { ...s.reading, [id]: { ...{ sentenceIndex: 0, audioSeconds: 0, completed: false, lastRead: '', completedQuestions: [] }, ...s.reading[id], audioSeconds: Math.max(0, seconds), lastRead: new Date().toISOString() } } }));
}
export function finishStory(id: string, answers: number[]): void {
  updateProgress(s => ({ ...s, reading: { ...s.reading, [id]: { ...{ sentenceIndex: 0, audioSeconds: 0, completed: false, lastRead: '', completedQuestions: [] }, ...s.reading[id], completed: true, completedQuestions: answers, lastRead: new Date().toISOString() } } }));
}
export function setSaved(id: string, saved: boolean): void {
  updateProgress(s => ({ ...s, savedPhrases: saved ? Array.from(new Set([...s.savedPhrases, id])) : s.savedPhrases.filter(p => p !== id) }));
}
export function isSaved(state: ProgressState, id: string): boolean { return state.savedPhrases.includes(id); }
export function selectRecommendedLevel(level: Level | 'All'): Level { return level === 'All' ? 'A2' : level; }
