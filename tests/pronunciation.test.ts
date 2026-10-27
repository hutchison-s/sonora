import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { rLesson, vowelLesson, tLesson, dLesson, bvLesson, diphthongLesson } from '../content/pronunciation/lessons';
import lessons from '../content/grammar/lessons.json';
import expanded from '../content/grammar/expanded-lessons.json';

describe('pronunciation lesson narration', () => {
  it('uses existing recordings that match the displayed sentences', () => {
    const allExamples = [
      ...lessons.lessons.flatMap(lesson => lesson.examples),
      ...Object.values(expanded).flatMap(lesson => lesson.extraExamples || []),
    ];
    for (const lesson of [rLesson, vowelLesson, tLesson, dLesson, bvLesson, diphthongLesson]) {
      expect(lesson.examples.length).toBeGreaterThanOrEqual(4);
      for (const example of lesson.examples) {
        expect(existsSync(join(process.cwd(), 'public', example.audio))).toBe(true);
        expect(allExamples.some(item => item.spanish === example.spanish && 'audioPath' in item && `/${item.audioPath}` === example.audio)).toBe(true);
      }
    }
  });
});
