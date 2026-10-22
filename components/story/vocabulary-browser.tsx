'use client';
import { Search, Square, Volume2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StoryVocabulary, VocabularyTerm } from '@/lib/content/vocabulary';
import { searchVocabulary } from '@/lib/content/vocabulary-search';
import { clipForText, vocabularyAudioKey, type VocabularyAudioMap } from '@/lib/audio/vocabulary-audio';

const conjugationRows = [
  { person: 'First person', singular: ['yo', 0] as const, plural: ['nosotros', 3] as const },
  { person: 'Second person', singular: ['tú', 1] as const, plural: ['ustedes', 4] as const },
  { person: 'Third person', singular: ['él / ella', 2] as const, plural: ['ellos / ellas', 4] as const },
];

type Playback = { playing: string | null; play: (text: string) => void };

function useVocabularyPlayback(audio: VocabularyAudioMap): Playback {
  const elementRef = useRef<HTMLAudioElement | null>(null);
  const frameRef = useRef(0);
  const requestRef = useRef(0);
  const playingRef = useRef<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  const stop = useCallback(() => {
    requestRef.current++;
    cancelAnimationFrame(frameRef.current);
    elementRef.current?.pause();
    playingRef.current = null;
    setPlaying(null);
  }, []);

  useEffect(() => stop, [stop]);

  const play = useCallback((text: string) => {
    const clip = clipForText(audio, text);
    if (!clip) return;
    const key = vocabularyAudioKey(text);
    if (playingRef.current === key && elementRef.current && !elementRef.current.paused) {
      stop();
      return;
    }
    const request = ++requestRef.current;
    cancelAnimationFrame(frameRef.current);
    const element = elementRef.current ?? new Audio();
    elementRef.current = element;
    element.pause();
    if (element.dataset.vocabularySource !== clip.audioUrl) {
      element.src = clip.audioUrl;
      element.preload = 'auto';
      element.dataset.vocabularySource = clip.audioUrl;
      element.load();
    }
    const begin = async () => {
      if (request !== requestRef.current) return;
      element.currentTime = clip.start;
      try {
        await element.play();
        if (request !== requestRef.current) { element.pause(); return; }
        playingRef.current = key;
        setPlaying(key);
        const monitor = () => {
          if (request !== requestRef.current || element.paused || element.currentTime >= clip.end - 0.012) {
            if (request === requestRef.current) stop();
            return;
          }
          frameRef.current = requestAnimationFrame(monitor);
        };
        frameRef.current = requestAnimationFrame(monitor);
      } catch {
        if (request === requestRef.current) stop();
      }
    };
    if (element.readyState >= HTMLMediaElement.HAVE_METADATA) void begin();
    else element.addEventListener('loadedmetadata', () => void begin(), { once: true });
  }, [audio, stop]);

  return { playing, play };
}

function AudioGlyph({ active }: { active: boolean }) {
  return <span className={`vocab-audio-glyph ${active ? 'playing' : ''}`} aria-hidden="true">{active ? <Square size={11} fill="currentColor"/> : <Volume2 size={14}/>}</span>;
}

function TermList({ terms, audio, playback }: { terms: VocabularyTerm[]; audio: VocabularyAudioMap; playback: Playback }) {
  return <div className="vocab-reference-list">{terms.map(term => {
    const playable = Boolean(clipForText(audio, term.es));
    const active = playback.playing === vocabularyAudioKey(term.es);
    const contents = <><span className="vocab-term-copy"><strong lang="es">{term.es}</strong><span>{term.en}</span></span>{playable && <AudioGlyph active={active}/>}</>;
    return playable
      ? <button type="button" className={`vocab-audio-entry ${active ? 'playing' : ''}`} key={term.es} onClick={() => playback.play(term.es)} aria-label={`${active ? 'Stop' : 'Hear'} ${term.es} from the story recording`}>{contents}</button>
      : <div key={term.es}>{contents}</div>;
  })}</div>;
}

function SectionHeading({ children, count }: { children: string; count: number }) {
  return <h2 className="font-serif">{children}<span>{count}</span></h2>;
}

export function VocabularyBrowser({ vocabulary, audio }: { vocabulary: StoryVocabulary; audio: VocabularyAudioMap }) {
  const [query, setQuery] = useState('');
  const playback = useVocabularyPlayback(audio);
  const results = useMemo(() => searchVocabulary(vocabulary, query), [query, vocabulary]);
  const total = Object.values(vocabulary).reduce((sum, terms) => sum + terms.length, 0);
  const resultCount = Object.values(results).reduce((sum, terms) => sum + terms.length, 0);
  const filtering = query.trim().length > 0;

  return <>
    {Object.keys(audio).length > 0 && <div className="vocab-audio-guide"><Volume2 size={17}/><span>Tap speaker-marked entries or conjugations to hear them in the original story recording.</span></div>}
    <div className="vocab-search" role="search">
      <Search size={18} aria-hidden="true"/>
      <label className="sr-only" htmlFor="vocabulary-search">Search vocabulary</label>
      <input id="vocabulary-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search Spanish, English, or a verb form" autoComplete="off" spellCheck={false}/>
      {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear vocabulary search"><X size={17}/></button>}
      <span className="vocab-result-count" aria-live="polite">{filtering ? `${resultCount} ${resultCount === 1 ? 'result' : 'results'}` : `${total} terms`}</span>
    </div>
    {results.nouns.length > 0 && <section className="vocab-reference-section"><SectionHeading count={results.nouns.length}>Nouns</SectionHeading><TermList terms={results.nouns} audio={audio} playback={playback}/></section>}
    {results.verbs.length > 0 && <section className="vocab-reference-section"><SectionHeading count={results.verbs.length}>Verbs</SectionHeading><div className="verb-reference-list">{results.verbs.map(item => {
      const headerPlayable = Boolean(clipForText(audio, item.es));
      const headerActive = playback.playing === vocabularyAudioKey(item.es);
      const header = <><span className="verb-reference-copy"><strong lang="es">{item.es}</strong><span>{item.en}</span></span>{headerPlayable && <AudioGlyph active={headerActive}/>}</>;
      const conjugation = (form: string) => {
        const playable = Boolean(clipForText(audio, form));
        const active = playback.playing === vocabularyAudioKey(form);
        return playable ? <button type="button" className={`conjugation-audio ${active ? 'playing' : ''}`} onClick={() => playback.play(form)} aria-label={`${active ? 'Stop' : 'Hear'} ${form} from the story recording`}><b lang="es">{form}</b><AudioGlyph active={active}/></button> : <b lang="es">{form}</b>;
      };
      return <article key={item.es}>{headerPlayable ? <button type="button" className={`verb-reference-title vocab-audio-entry ${headerActive ? 'playing' : ''}`} onClick={() => playback.play(item.es)} aria-label={`${headerActive ? 'Stop' : 'Hear'} ${item.es} from the story recording`}>{header}</button> : <div className="verb-reference-title">{header}</div>}<table className="conjugation-table"><thead><tr><th scope="col"><span className="sr-only">Person</span></th><th scope="col">Singular</th><th scope="col">Plural</th></tr></thead><tbody>{conjugationRows.map(row => <tr key={row.person}><th scope="row">{row.person}</th><td><small>{row.singular[0]}</small>{conjugation(item.present[row.singular[1]])}</td><td><small>{row.plural[0]}</small>{conjugation(item.present[row.plural[1]])}</td></tr>)}</tbody></table></article>;
    })}</div></section>}
    {results.prepositions.length > 0 && <section className="vocab-reference-section"><SectionHeading count={results.prepositions.length}>Prepositions</SectionHeading><TermList terms={results.prepositions} audio={audio} playback={playback}/></section>}
    {results.expressions.length > 0 && <section className="vocab-reference-section"><SectionHeading count={results.expressions.length}>Expressions</SectionHeading><TermList terms={results.expressions} audio={audio} playback={playback}/></section>}
    {filtering && resultCount === 0 && <div className="vocab-empty" role="status"><Search size={24}/><h2 className="font-serif">No vocabulary found.</h2><p>Try another Spanish or English word.</p><button type="button" onClick={() => setQuery('')}>Clear search</button></div>}
  </>;
}
