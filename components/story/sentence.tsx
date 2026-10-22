'use client';
import type { Annotation, StorySentence } from '@/lib/types/story';

type Props = { sentence: StorySentence; index: number; selectedId: string | null; active: boolean; activeWord: number; showTranslation: boolean; onSelect: (a: Annotation, index: number) => void; onReplay: (index: number) => void; replayAvailable: boolean };
export function Sentence({ sentence, index, selectedId, active, activeWord, showTranslation, onSelect, onReplay, replayAvailable }: Props) {
  const wordTimes = sentence.audio?.words ?? [];
  const segments: { start: number; end: number; annotation?: Annotation }[] = [];
  let cursor = 0;
  for (const a of [...sentence.annotations].sort((x,y) => x.start! - y.start!)) {
    if (a.start! > cursor) segments.push({start:cursor,end:a.start!});
    segments.push({start:a.start!,end:a.end!,annotation:a}); cursor = a.end!;
  }
  if (cursor < sentence.es.length) segments.push({start:cursor,end:sentence.es.length});
  const tokens = (start: number, end: number) => {
    const chunk = sentence.es.slice(start, end);
    return [...chunk.matchAll(/\S+|\s+/g)].map((match,k) => {
      const token = match[0]; const charStart = start + (match.index ?? 0);
      const wordIndex = wordTimes.findIndex(w => w.charStart === charStart && w.text === token);
      const current = active && wordIndex >= 0 && activeWord === wordIndex;
      return <span key={`${charStart}-${k}`} className={current ? 'current-word' : undefined}>{token}</span>;
    });
  };
  return <div className={`reader-sentence ${active ? 'spoken-sentence' : ''}`} data-sentence-index={index} id={`sentence-${index}`}>
    <div className="sentence-copy"><p lang="es">{segments.map((seg,i) => seg.annotation ? <button className={`annotated-phrase ${selectedId === seg.annotation.id ? 'phrase-selected' : ''}`} type="button" key={i} aria-label={`Explain phrase: ${seg.annotation.text}`} aria-haspopup="dialog" onClick={() => onSelect(seg.annotation!,index)}>{tokens(seg.start,seg.end)}</button> : <span key={i}>{tokens(seg.start,seg.end)}</span>)}</p>
      {showTranslation && <p className="sentence-english" lang="en">{sentence.en}</p>}
    </div>
    {replayAvailable && <button type="button" className="sentence-replay" onClick={() => onReplay(index)} aria-label={`Replay sentence ${index+1}`} title="Replay this sentence"><span aria-hidden="true">↺</span></button>}
    {active && <span className="sr-only">Now playing sentence {index+1}.</span>}
  </div>;
}
