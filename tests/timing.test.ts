import { describe, expect, it } from 'vitest';
import { clampSeek, findSentenceAt, findWordAt, nextSpeed, sentenceSeekTime } from '@/lib/audio/timing';
import type { StorySentence } from '@/lib/types/story';
const sentences: StorySentence[] = [
  { id:'a', es:'Hola mundo', en:'Hello world',annotations:[],audio:{start:0,end:2,words:[{text:'Hola', charStart:0,charEnd:4,start:0,end:0.8},{text:'mundo',charStart:5,charEnd:10,start:1,end:2}]} },
  { id:'b', es:'¿Qué tal?', en:'How are you?',annotations:[],audio:{start:2.5,end:4,words:[{text:'¿Qué',charStart:0,charEnd:4,start:2.5,end:3},{text:'tal?',charStart:5,charEnd:9,start:3.1,end:4}]} },
];
describe('audio synchronization', () => {
  it('finds exact sentence at boundaries, but not in silence', () => {
    expect(findSentenceAt(sentences,0)).toBe(0);
    expect(findSentenceAt(sentences,2)).toBe(-1);
    expect(findSentenceAt(sentences,2.5)).toBe(1);
    expect(findSentenceAt(sentences,4)).toBe(-1);
  });
  it('highlights only words whose recording time has arrived', () => {
    expect(findWordAt(sentences[0].audio!.words,0.4)).toBe(0);
    expect(findWordAt(sentences[0].audio!.words,0.9)).toBe(-1);
    expect(findWordAt(sentences[0].audio!.words,1.2)).toBe(1);
  });
  it('clamps seeks and replays at sentence start', () => {
    expect(clampSeek(-3,4)).toBe(0); expect(clampSeek(25,4)).toBe(4);
    expect(sentenceSeekTime(sentences[1])).toBe(2.5);
    expect(sentenceSeekTime({...sentences[0],audio:null})).toBeNull();
  });
  it('cycles supported speeds without unsupported values', () => {
    expect(nextSpeed(1)).toBe(1.25);
    expect(nextSpeed(1.25)).toBe(0.75);
    expect(nextSpeed(0.75)).toBe(1);
  });
});
