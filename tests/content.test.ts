import { describe, expect, it } from 'vitest';
import { parseStories, parseStory, resolveAnnotation, resolveSentence } from '@/lib/content/schema';
import { stories } from '@/lib/content/stories';
import type { Annotation, StorySentence } from '@/lib/types/story';

const annotation: Annotation = { id:'x', text:'dijo', type:'grammar', meaning:'said', explanation:'Pretérito of decir.' };
const sentence: StorySentence = { id:'first', es:'Ella dijo que dijo la verdad.', en:'She said she told the truth.', annotations:[], audio:null };
describe('story contract', () => {
  it('validates all six original stories', () => {
    expect(stories).toHaveLength(6);
    expect(stories.filter(s => s.level === 'A1')).toHaveLength(2);
    expect(stories.filter(s => s.level === 'A2')).toHaveLength(2);
    expect(stories.filter(s => s.level === 'B1')).toHaveLength(2);
    for (const story of stories) { expect(story.comprehension).toHaveLength(3); expect(story.sentences.length).toBeGreaterThan(3); }
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
  it('rejects missing narration timing if narration marked ready', () => expect(() => parseStory({ ...stories[0], narration:{status:'ready',audioUrl:'/audio/a.mp3',durationSeconds:10,alignment:'words'} })).toThrow(/requires every sentence timed/));
  it('rejects invalid comprehension indexes', () => expect(() => parseStory({ ...stories[0], comprehension: stories[0].comprehension.map((q,i) => i===0 ? {...q, correctIndex: 3}:q) })).toThrow());
  it('rejects invented timings for text-only stories', () => expect(() => parseStory({...stories[0],sentences:[{...stories[0].sentences[0], audio:{start:0,end:1,words:[]}},...stories[0].sentences.slice(1)]})).toThrow(/unavailable narration/));
});
