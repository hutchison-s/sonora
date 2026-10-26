import { z } from 'zod';
import type { Story } from '@/lib/types/story';

const id = z.string().min(1);
export const grammarReadingSchema = z.object({
 schemaVersion: z.literal(1),
 references: z.array(z.object({
  lessonId: id, storyId: id, sentenceId: id, focus: z.string().min(1), annotationIds: z.array(id),
 }).strict()),
}).strict();
export function parseGrammarReadings(input: unknown, lessonIds: Set<string>, stories: Story[]) {
 const result = grammarReadingSchema.parse(input);
 const seen = new Set<string>();
 for (const reference of result.references) {
  if (!lessonIds.has(reference.lessonId)) throw new Error(`Unknown reading lesson: ${reference.lessonId}`);
  const story = stories.find(s => s.id === reference.storyId);
  const sentence = story?.sentences.find(s => s.id === reference.sentenceId);
  if (!sentence || sentence.es.split(reference.focus).length !== 2) throw new Error(`Missing or ambiguous story focus: ${reference.lessonId}`);
  const key = JSON.stringify([reference.lessonId, reference.storyId, reference.sentenceId, reference.focus]);
  if (seen.has(key)) throw new Error(`Duplicate grammar reading: ${key}`);
  seen.add(key);
  if (new Set(reference.annotationIds).size !== reference.annotationIds.length) throw new Error('Duplicate reading annotation');
  for (const id of reference.annotationIds) {
   const annotation = sentence.annotations.find(a => a.id === id);
   if (!annotation || (!annotation.text.includes(reference.focus) && !reference.focus.includes(annotation.text))) throw new Error(`Invalid reading annotation: ${id}`);
  }
 }
 return result;
}
