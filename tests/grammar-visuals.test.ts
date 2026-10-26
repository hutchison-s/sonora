import { describe, expect, it } from 'vitest';
import { zodToJsonSchema } from 'zod-to-json-schema';
import raw from '@/content/grammar/visuals.json';
import exportedSchema from '@/content/grammar/visuals.schema.json';
import lessons from '@/content/grammar/expanded-lessons.json';
import { grammarVisualCatalogSchema, parseGrammarVisuals } from '@/lib/grammar/visual-schema';

const counts = Object.fromEntries(Object.entries(lessons).map(([id, l]) => [id, l.build.length]));
const copy = () => structuredClone(raw);

describe('content-fed grammar visuals', () => {
 it('validates placements, tokens and scenarios for the entire published curriculum', () => {
  const result = parseGrammarVisuals(raw, counts);
  expect(Object.keys(result.lessons).sort()).toEqual(Object.keys(lessons).sort());
  expect(new Set(Object.values(result.lessons).flat().map(v => v.kind))).toEqual(new Set(['transformation', 'stress', 'timeline']));
 });
 it('keeps the portable generation schema in sync with the runtime schema', () => {
  expect(zodToJsonSchema(grammarVisualCatalogSchema, { name: 'GrammarVisualCatalog', target: 'jsonSchema7', $refStrategy: 'root' })).toEqual(exportedSchema);
 });
 it('rejects unknown lesson references and out-of-range build placements', () => {
  const bad = copy();
  bad.lessons.questions[0].afterBuildStep = 100;
  expect(() => parseGrammarVisuals(bad, counts)).toThrow(/Invalid build step/);
  expect(() => parseGrammarVisuals(raw, {})).toThrow(/Unknown lesson/);
 });
 it('rejects duplicate token identities and text that contradicts the displayed Spanish', () => {
  const bad = copy();
  const frame = bad.lessons.questions[0].scenarios[0].frames[0];
  frame.tokens[1].id = frame.tokens[0].id;
  expect(() => parseGrammarVisuals(bad, counts)).toThrow(/Duplicate visual ID/);
  frame.tokens[1].id = 'object';
  frame.spanish = 'Different text';
  expect(() => parseGrammarVisuals(bad, counts)).toThrow(/Tokens do not match/);
 });
 it('rejects multiple stressed syllables and invalid timeline intervals', () => {
  const badStress = copy();
  badStress.lessons.stress[0].scenarios[0].frames[0].syllables.forEach(s => { s.stressed = true; });
  expect(() => parseGrammarVisuals(badStress, counts)).toThrow(/Exactly one/);
  const badTime = copy();
  badTime.lessons['past-contrast'][0].scenarios[0].frames[0].lanes[0].end = 0;
  expect(() => parseGrammarVisuals(badTime, counts)).toThrow(/Invalid timeline/);
 });
 it('rejects unsupported tools and authored behavior fields instead of executing them', () => {
  const bad = copy() as unknown as { lessons: Record<string, Record<string, unknown>[]> };
  bad.lessons.questions[0].onClick = 'arbitrary code';
  expect(() => parseGrammarVisuals(bad, counts)).toThrow();
  delete bad.lessons.questions[0].onClick;
  bad.lessons.questions[0].kind = 'html';
  expect(() => parseGrammarVisuals(bad, counts)).toThrow();
 });
});
