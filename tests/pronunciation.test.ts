import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { rLesson } from '../content/pronunciation/lessons';
import lessons from '../content/grammar/lessons.json';
import expanded from '../content/grammar/expanded-lessons.json';

describe('pronunciation lesson narration', () => {
  it('uses existing recordings that match the displayed sentences', () => {
    const grammar = lessons.lessons.find(lesson => lesson.id === 'rr')!;
    const examples = [...grammar.examples, ...expanded.rr.extraExamples];
    expect(rLesson.examples.length).toBeGreaterThanOrEqual(4);
    for (const example of rLesson.examples) {
      expect(existsSync(join(process.cwd(), 'public', example.audio))).toBe(true);
      expect(examples.some(item => item.spanish === example.spanish && `/${item.audioPath}` === example.audio)).toBe(true);
    }
  });
});
