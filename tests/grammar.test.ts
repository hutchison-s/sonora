import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import catalog from '@/content/grammar/lessons.json';
import expanded from '@/content/grammar/expanded-lessons.json';

const text = z.string().trim().min(1);
const example = z.object({ spanish: text, english: text, explanation: text });
const lesson = z.object({
 bigIdea: text, goal: text,
 build: z.array(z.object({ title: text, body: text })).min(2),
 extraExamples: z.array(example).min(2),
 contrast: z.object({ title: text, items: z.array(example).length(2) }),
 closerLook: z.array(z.object({ title: text, body: text })).min(1),
 mistakes: z.array(z.object({ incorrect: text, correct: text, explanation: text })).min(2),
 practice: z.array(z.object({ prompt: text, answer: text, explanation: text })).min(3),
 takeaways: z.array(text).min(2),
}).strict();

describe('expanded grammar content', () => {
 it('provides complete, structured teaching content for every published route', () => {
  expect(Object.keys(expanded).sort()).toEqual(catalog.lessons.map(item => item.id).sort());
  for (const [id, content] of Object.entries(expanded)) {
   expect(lesson.safeParse(content).success, id).toBe(true);
   expect(new Set(content.practice.map(item => item.prompt)).size, id).toBe(content.practice.length);
  }
 });
 it('keeps existing recorded examples available and additional examples text-only', () => {
  for (const item of catalog.lessons) {
   for (const example of item.examples) {
    expect(existsSync(join(process.cwd(), 'public', example.audioPath)), example.audioPath).toBe(true);
   }
   const content = expanded[item.id as keyof typeof expanded];
   expect(content.extraExamples.every(example => !('audioPath' in example))).toBe(true);
  }
 });
});
