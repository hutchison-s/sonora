import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { zodToJsonSchema } from 'zod-to-json-schema';
import raw from '@/content/grammar/lessons.json';
import expanded from '@/content/grammar/expanded-lessons.json';
import lessonSchema from '@/content/grammar/lessons.schema.json';
import expandedSchema from '@/content/grammar/expanded-lessons.schema.json';
import readingsSchema from '@/content/grammar/readings.schema.json';
import readingInput from '@/content/grammar/readings.json';
import { grammarCatalogSchema, expandedGrammarCatalogSchema, parseGrammarLessons } from '@/lib/grammar/lesson-schema';
import { grammarReadingSchema, parseGrammarReadings } from '@/lib/grammar/reading-schema';
import { grammarCatalog, grammarLibraryCatalog } from '@/lib/grammar/lessons';
import { getGrammarReadings, getStoryGrammarLinks } from '@/lib/grammar/readings';
import { stories } from '@/lib/content/stories';

const lessonIds = new Set(grammarCatalog.lessons.map(l => l.id));
describe('reading-focused grammar foundations', () => {
 it('preserves every previously recorded Spanish sentence and its exact audio path', () => {
  const pairs = grammarCatalog.lessons.flatMap(l => l.examples.filter(e => e.audioPath).map(e => ({ id: e.id, spanish: e.spanish, audioPath: e.audioPath }))).sort((a,b) => a.id.localeCompare(b.id));
  expect(pairs).toHaveLength(77);
  expect(createHash('sha256').update(JSON.stringify(pairs)).digest('hex')).toBe('0584e11b0a4db94bb47b20fd4172b543f43b83bafee94ff23315bdcf4d364904');
 });
 it('accepts text-only examples and counts both catalog and expanded examples accurately', () => {
  const letters = grammarLibraryCatalog.lessons.find(l => l.id === 'letter-combinations')!;
  expect(letters.exampleCount).toBe(4);
  expect(letters.examples.every(e => !e.audioPath)).toBe(true);
  const original = grammarLibraryCatalog.lessons.find(l => l.id === 'questions')!;
  expect(original.exampleCount).toBe(4);
  expect(original.examples.filter(e => e.audioPath)).toHaveLength(2);
 });
 it('rejects missing expanded content, duplicate IDs and dangling related-lesson links', () => {
  const incomplete = { ...expanded } as Record<string, unknown>;
  delete incomplete.alphabet;
  expect(() => parseGrammarLessons(raw, incomplete)).toThrow(/identical lesson IDs/);
  const duplicate = structuredClone(raw);
  duplicate.lessons.push(duplicate.lessons[0]);
  expect(() => parseGrammarLessons(duplicate, expanded)).toThrow(/Duplicate grammar lesson ID/);
  const dangling = grammarCatalogSchema.parse(raw);
  dangling.lessons[0].relatedLessons = ['not-a-lesson'];
  expect(() => parseGrammarLessons(dangling, expanded)).toThrow(/Invalid related lesson/);
 });
 it('rejects malformed media references while allowing a genuine absence of recording', () => {
  const invalid = grammarCatalogSchema.parse(raw);
  invalid.lessons[0].examples[0].audioPath = '../outside.mp3';
  expect(() => parseGrammarLessons(invalid, expanded)).toThrow();
 });
 it('keeps all generated authoring schemas synchronized with runtime contracts', () => {
  for (const [schema, name, exported] of [[grammarCatalogSchema, 'GrammarCatalog', lessonSchema], [expandedGrammarCatalogSchema, 'ExpandedGrammarCatalog', expandedSchema], [grammarReadingSchema, 'GrammarReadings', readingsSchema]] as const) {
   expect(zodToJsonSchema(schema, { name, target: 'jsonSchema7', $refStrategy: 'root' })).toEqual(exported);
  }
 });
 it('connects a real annotated phrase to its rule and returns the exact source sentence', () => {
  const links = getStoryGrammarLinks('la-mesa-para-dos');
  expect(links['la-mesa-para-dos-a4-1'].map(l => l.id)).toContain('indirect-objects');
  expect(getGrammarReadings('indirect-objects')[0].sentence).toBe('Rosa le ofrece agua.');
  expect(getStoryGrammarLinks('not-a-story')).toEqual({});
 });
 it('rejects stale source phrases, foreign annotations and unknown lessons', () => {
  const bad = structuredClone(readingInput);
  bad.references[0].focus = 'not in this story';
  expect(() => parseGrammarReadings(bad, lessonIds, stories)).toThrow(/story focus/);
  const wrong = structuredClone(readingInput);
  wrong.references[0].annotationIds = ['other-story-annotation'];
  expect(() => parseGrammarReadings(wrong, lessonIds, stories)).toThrow(/Invalid reading annotation/);
  expect(() => parseGrammarReadings(readingInput, new Set(), stories)).toThrow(/Unknown reading lesson/);
 });
});
