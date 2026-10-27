import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { rLesson, vowelLesson } from '../content/pronunciation/lessons';
import lessons from '../content/grammar/lessons.json';
import expanded from '../content/grammar/expanded-lessons.json';

describe('pronunciation lesson narration', () => {
  it('uses existing recordings that match the displayed sentences', () => {
    for (const [lesson, grammarId] of [[rLesson, 'rr'], [vowelLesson, 'vowels']] as const) {
      const grammar = lessons.lessons.find(item => item.id === grammarId)!;
      const examples = [...grammar.examples, ...expanded[grammarId].extraExamples];
      expect(lesson.examples.length).toBeGreaterThanOrEqual(4);
      for (const example of lesson.examples) {
      expect(existsSync(join(process.cwd(), 'public', example.audio))).toBe(true);
      expect(examples.some(item => item.spanish === example.spanish && 'audioPath' in item && `/${item.audioPath}` === example.audio)).toBe(true);
      }
    }
  });
});
