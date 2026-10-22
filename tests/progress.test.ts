import { describe, expect, it } from 'vitest';
import { DEFAULT_PROGRESS, KEY, migrateProgress, readProgress, writeProgress } from '@/lib/progress/storage';
import { answerIsCorrect, correctAnswers } from '@/lib/content/comprehension';
import { stories } from '@/lib/content/stories';
describe('versioned learner progress', () => {
  it('restores saved translation visibility and reading state', () => {
    let stored = '';
    const state = structuredClone(DEFAULT_PROGRESS);
    state.settings.translation = true;
    state.settings.speed = 1.25;
    state.lastStory = 'la-llave-azul';
    state.reading['la-llave-azul'] = { sentenceIndex:3,audioSeconds:18.25,completed:false,lastRead:'2026-10-19T10:00:00.000Z',completedQuestions:[] };
    writeProgress(state, {setItem(k,v){expect(k).toBe(KEY);stored=v;}});
    const restored=readProgress({getItem(){return stored;}});
    expect(restored.settings.translation).toBe(true);
    expect(restored.settings.speed).toBe(1.25);
    expect(restored.reading['la-llave-azul'].sentenceIndex).toBe(3);
    expect(restored.reading['la-llave-azul'].audioSeconds).toBe(18.25);
  });
  it('rejects corrupt or future schema versions safely', () => {
    expect(migrateProgress({version:99})).toEqual(DEFAULT_PROGRESS);
    expect(readProgress({getItem(){return '{broken';}})).toEqual(DEFAULT_PROGRESS);
  });
});
describe('story comprehension', () => {
  const questions=stories[0].comprehension;
  it('judges the correct answer with explanation', () => {
    expect(answerIsCorrect(questions[0],questions[0].correctIndex)).toBe(true);
    expect(answerIsCorrect(questions[0],(questions[0].correctIndex + 1)%3)).toBe(false);
    expect(questions[0].explanation.length).toBeGreaterThan(8);
  });
  it('counts correct answers while allowing questions to be skipped', () => {
    expect(correctAnswers(questions,questions.map(q => q.correctIndex))).toBe(3);
    expect(correctAnswers(questions,[])).toBe(0);
    expect(correctAnswers(questions,[-1,-1,-1])).toBe(0);
  });
});
