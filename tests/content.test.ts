import { describe, expect, it } from 'vitest';
import { parseStories, parseStory, resolveAnnotation, resolveSentence } from '@/lib/content/schema';
import { stories } from '@/lib/content/stories';
import { getStoryVocabulary } from '@/lib/content/vocabulary';
import { searchVocabulary } from '@/lib/content/vocabulary-search';
import { buildVocabularyAudioMap, clipForText } from '@/lib/audio/vocabulary-audio';
import type { Annotation, StorySentence } from '@/lib/types/story';

const annotation: Annotation = { id:'x', text:'dijo', type:'grammar', partOfSpeech:'verb', meaning:'said', explanation:'Pretérito of decir.' };
const sentence: StorySentence = { id:'first', es:'Ella dijo que dijo la verdad.', en:'She said she told the truth.', annotations:[], audio:null };
describe('story contract', () => {
  it('validates the complete story library', () => {
    expect(stories).toHaveLength(11);
    expect(stories.filter(s => s.level === 'A1')).toHaveLength(6);
    expect(stories.filter(s => s.level === 'B2')).toHaveLength(1);
    expect(stories.filter(s => s.level === 'A2')).toHaveLength(2);
    expect(stories.filter(s => s.level === 'B1')).toHaveLength(2);
    for (const story of stories) { expect(story.comprehension).toHaveLength(3); expect(story.sentences.length).toBeGreaterThan(3); }
  });
  it('provides a complete vocabulary reference for every story', () => {
    for (const story of stories) {
      const vocabulary = getStoryVocabulary(story.id);
      expect(vocabulary).toBeDefined();
      expect(vocabulary!.nouns.length).toBeGreaterThanOrEqual(10);
      expect(vocabulary!.verbs.length).toBeGreaterThanOrEqual(6);
      expect(vocabulary!.prepositions.length).toBeGreaterThan(0);
      expect(vocabulary!.expressions.length).toBeGreaterThan(0);
      for (const verb of vocabulary!.verbs) expect(verb.present).toHaveLength(5);
    }
  });
  it('searches vocabulary without case or accent sensitivity and includes conjugations', () => {
    const vocabulary = getStoryVocabulary('el-ultimo-cafe')!;
    expect(searchVocabulary(vocabulary, 'CAFÉ').nouns.map(term => term.es)).toContain('el café');
    expect(searchVocabulary(vocabulary, 'estas').verbs.map(term => term.es)).toContain('estar');
    expect(searchVocabulary(vocabulary, 'not present').nouns).toHaveLength(0);
  });
  it('maps exact vocabulary and conjugation text to existing narration', () => {
    const story = stories.find(item => item.id === 'el-ultimo-cafe')!;
    const audio = buildVocabularyAudioMap(story, getStoryVocabulary(story.id)!);
    const noun = clipForText(audio, 'el camarero');
    const conjugation = clipForText(audio, 'está');
    expect(noun?.audioUrl).toBe(story.narration.status === 'ready' ? story.narration.audioUrl : undefined);
    expect(noun && noun.end).toBeGreaterThan(noun?.start ?? Infinity);
    expect(conjugation && conjugation.end).toBeGreaterThan(conjugation?.start ?? Infinity);
    expect(clipForText(audio, 'not in the story')).toBeUndefined();
  });
  it('rejects ambiguous repeated phrases', () => expect(() => resolveAnnotation(sentence.es, annotation)).toThrow(/Ambiguous/));
  it('resolves second occurrence deterministically', () => {
    const result = resolveAnnotation(sentence.es, { ...annotation, occurrence: 1 });
    expect(sentence.es.slice(result.start,result.end)).toBe('dijo');
    expect(result.start).toBe(14);
  });
  it('rejects invalid explicit character offsets', () => expect(() => resolveAnnotation(sentence.es, {...annotation, start:0,end:4})).toThrow(/Invalid offsets/));
  it('rejects annotation boundaries inside words', () => expect(() => resolveAnnotation('camino', {...annotation, text:'amino'})).toThrow(/inside word/));
  it('rejects overlapping interactive phrases', () => expect(() => resolveSentence({ ...sentence, annotations:[{...annotation, id:'first',text:'Ella dijo'}, {...annotation,id:'second', text:'dijo', occurrence:0}] })).toThrow(/Overlapping/));
  it('rejects duplicate story IDs', () => expect(() => parseStories([stories[0],stories[0]])).toThrow(/Duplicate story id/));
  it('rejects duplicate sentence IDs', () => expect(() => parseStory({ ...stories[0], sentences:[stories[0].sentences[0],stories[0].sentences[0]] })).toThrow(/duplicate sentence id/));
  it('rejects missing narration timing if narration marked ready', () => expect(() => parseStory({ ...stories[0], sentences:[{...stories[0].sentences[0], audio:null},...stories[0].sentences.slice(1)] })).toThrow(/requires every sentence timed/));
  it('rejects invalid comprehension indexes', () => expect(() => parseStory({ ...stories[0], comprehension: stories[0].comprehension.map((q,i) => i===0 ? {...q, correctIndex: 3}:q) })).toThrow());
  it('rejects invented timings for text-only stories', () => expect(() => parseStory({...stories[0],narration:{status:'unavailable',audioUrl:null,durationSeconds:null,alignment:'none'}})).toThrow(/unavailable narration/));
});
