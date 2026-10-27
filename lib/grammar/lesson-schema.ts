import { z } from 'zod';

const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
export const grammarExampleSchema = z.object({
 id, spanish: text, english: text, explanation: text,
 audioPath: z.string().regex(/^audio\/grammar\/[a-z0-9-]+\/[0-9]+\.mp3$/).optional(),
}).strict();
export const grammarLessonSchema = z.object({
 id, categoryId: id, level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
 title: text, summary: text, grammarTerm: text, keywords: z.array(text),
 examples: z.array(grammarExampleSchema).min(2),
 vocabulary: z.array(z.object({ surface: text, lemma: text, meaning: text }).strict()),
 relatedLessons: z.array(id).default([]),
}).strict();
export const grammarCatalogSchema = z.object({
 schemaVersion: z.literal(1),
 categories: z.array(z.object({ id, title: text }).strict()).min(1),
 lessons: z.array(grammarLessonSchema).min(1),
}).strict();
const example = z.object({ spanish: text, english: text, explanation: text, audioPath: grammarExampleSchema.shape.audioPath }).strict();
export const expandedGrammarLessonSchema = z.object({
 bigIdea: text, goal: text,
 build: z.array(z.object({ title: text, body: text }).strict()).min(2),
 extraExamples: z.array(example).min(2),
 contrast: z.object({ title: text, items: z.array(example).length(2) }).strict(),
 closerLook: z.array(z.object({ title: text, body: text }).strict()).min(1),
 mistakes: z.array(z.object({ incorrect: text, correct: text, explanation: text }).strict()).min(2),
 practice: z.array(z.object({ prompt: text, answer: text, explanation: text }).strict()).min(3),
 takeaways: z.array(text).min(2),
}).strict();
export const expandedGrammarCatalogSchema = z.record(id, expandedGrammarLessonSchema);
export type GrammarLesson = z.infer<typeof grammarLessonSchema>;
export type ExpandedGrammarLesson = z.infer<typeof expandedGrammarLessonSchema>;

export function parseGrammarLessons(catalogInput: unknown, expandedInput: unknown) {
 const catalog = grammarCatalogSchema.parse(catalogInput);
 const expanded = expandedGrammarCatalogSchema.parse(expandedInput);
 const ids = new Set(catalog.lessons.map(l => l.id));
 if (ids.size !== catalog.lessons.length) throw new Error('Duplicate grammar lesson ID');
 const categories = new Set(catalog.categories.map(c => c.id));
 if (categories.size !== catalog.categories.length) throw new Error('Duplicate grammar category ID');
 if (Object.keys(expanded).length !== ids.size || Object.keys(expanded).some(key => !ids.has(key))) throw new Error('Grammar catalog and expanded content must have identical lesson IDs');
 const exampleIds = new Set<string>();
 for (const lesson of catalog.lessons) {
  if (!categories.has(lesson.categoryId)) throw new Error(`Unknown category: ${lesson.id}`);
  for (const ref of lesson.relatedLessons) if (!ids.has(ref) || ref === lesson.id) throw new Error(`Invalid related lesson: ${lesson.id}/${ref}`);
  if (new Set(lesson.relatedLessons).size !== lesson.relatedLessons.length) throw new Error(`Duplicate related lesson: ${lesson.id}`);
  for (const example of lesson.examples) {
   if (exampleIds.has(example.id)) throw new Error(`Duplicate grammar example ID: ${example.id}`);
   exampleIds.add(example.id);
  }
 }
 return { catalog, expanded };
}
