import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { expandedGrammarLessonSchema as lesson } from '@/lib/grammar/lesson-schema';
import catalog from '@/content/grammar/lessons.json';
import expanded from '@/content/grammar/expanded-lessons.json';

describe('expanded grammar content', () => {
 it('provides complete, structured teaching content for every published route', () => {
  expect(Object.keys(expanded).sort()).toEqual(catalog.lessons.map(item => item.id).sort());
  for (const [id, content] of Object.entries(expanded)) {
   expect(lesson.safeParse(content).success, id).toBe(true);
   expect(new Set(content.practice.map(item => item.prompt)).size, id).toBe(content.practice.length);
  }
 });
 it('keeps existing and newly linked recordings available', () => {
  for (const item of catalog.lessons) {
   for (const example of item.examples) {
    if ('audioPath' in example && example.audioPath) expect(existsSync(join(process.cwd(), 'public', example.audioPath)), example.audioPath).toBe(true);
   }
   const content = expanded[item.id as keyof typeof expanded];
   for (const example of content.extraExamples) {
    if ('audioPath' in example && example.audioPath) expect(existsSync(join(process.cwd(), 'public', example.audioPath)), example.audioPath).toBe(true);
   }
  }
 });
});
