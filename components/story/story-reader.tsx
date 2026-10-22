'use client';
import Image from 'next/image';
import Link from 'next/link';
import * as Switch from '@radix-ui/react-switch';
import { ArrowLeft, ArrowRight, BookMarked, BookOpen, ChevronDown, Headphones, Languages, MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Annotation, Mode, Story } from '@/lib/types/story';
import { useProgress } from '@/lib/progress/use-progress';
import { isSaved, setSaved, setSetting, visitStory, finishStory, type ProgressState } from '@/lib/progress/storage';
import { useStoryAudio } from '@/components/audio/use-story-audio';
import { AudioToolbar } from '@/components/audio/audio-toolbar';
import { Sentence } from './sentence';
import { PhraseInsight } from '@/components/insights/phrase-insight';
import { Comprehension } from './comprehension';
import { stories } from '@/lib/content/stories';

export function StoryReader({ story }: { story: Story }) {
  const [progress, hydrated] = useProgress();
  if (!hydrated) return <main className="reader-loading"><span className="wordmark">sonora<span>.</span></span><p>Opening your story…</p></main>;
  return <StoryReaderInner story={story} initial={progress} />;
}

function StoryReaderInner({ story, initial }: { story: Story; initial: ProgressState }) {
  const [progress] = useProgress();
  const initialReading = initial.reading[story.id];
  const [mode, setMode] = useState<Mode>(story.narration.status === 'ready' ? initial.settings.mode : 'read');
  const [translation, setTranslation] = useState(initial.settings.translation);
  const [autoScroll, setAutoScroll] = useState(initial.settings.autoScroll);
  const [manualScrolling, setManualScrolling] = useState(false);
  const [insight, setInsight] = useState<{ annotation: Annotation; sentence: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const restoredRef = useRef(false);
  const nextIndex = stories.findIndex(s => s.id === story.id);
  const next = stories[(nextIndex+1) % stories.length];
  const audio = useStoryAudio(story, mode === 'listen', initialReading?.audioSeconds ?? 0, initial.settings.speed, () => finishStory(story.id, []));
  const available = story.narration.status === 'ready' && audio.status !== 'error';
  const listening = available && mode === 'listen';

  useEffect(() => {
    visitStory(story.id);
    setHasMounted(true);
    if (restoredRef.current) return;
    restoredRef.current = true;
    const index = initialReading?.sentenceIndex ?? 0;
    if (index <= 0) return;
    // Resume deliberately only when revisiting the previously opened story.
    if (initial.lastStory !== story.id) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => {
      document.getElementById(`sentence-${Math.min(index, story.sentences.length-1)}`)?.scrollIntoView({ block:'center', behavior: 'instant' });
    }));
    return () => cancelAnimationFrame(frame);
  // only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story.id]);
  useEffect(() => {
    if (!hasMounted) return;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-sentence-index]'));
    if (!targets.length) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const index = Number((entry.target as HTMLElement).dataset.sentenceIndex);
          if (Number.isInteger(index)) visitStory(story.id, index);
        }
      }
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [hasMounted, story.id]);
  useEffect(() => {
    if (!listening || !autoScroll) {
      setManualScrolling(false);
      return;
    }
    let manualInput = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const scheduleResume = () => {
      manualInput = true;
      setManualScrolling(true);
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        manualInput = false;
        setManualScrolling(false);
      }, 900);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) scheduleResume();
    };
    const onScroll = () => { if (manualInput) scheduleResume(); };
    const onPointerDown = (event: PointerEvent) => {
      if (event.clientX >= document.documentElement.clientWidth - 16) scheduleResume();
    };
    window.addEventListener('wheel', scheduleResume, { passive: true });
    window.addEventListener('touchmove', scheduleResume, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => {
      if (settleTimer) clearTimeout(settleTimer);
      window.removeEventListener('wheel', scheduleResume);
      window.removeEventListener('touchmove', scheduleResume);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [autoScroll, listening]);
  useEffect(() => {
    if (!listening || !audio.playing || !autoScroll || manualScrolling || audio.activeSentence < 0 || insight) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(`sentence-${audio.activeSentence}`);
      if (!target) return;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [audio.activeSentence, audio.playing, autoScroll, insight, listening, manualScrolling]);

  const changeMode = (nextMode: Mode) => {
    if (nextMode === 'listen' && !available) return;
    if (nextMode === 'read') audio.pause();
    setMode(nextMode); setSetting('mode', nextMode);
  };
  const onSelect = useCallback((annotation: Annotation, sentence: number) => { audio.pause(); setInsight({ annotation, sentence }); }, [audio]);
  const saved = insight ? isSaved(progress, insight.annotation.id) : false;
  const toggleTranslation = (value: boolean) => { setTranslation(value); setSetting('translation', value); };
  const toggleAutoScroll = (value: boolean) => { setAutoScroll(value); setSetting('autoScroll', value); };

  return <main className={`reader-shell ${listening ? 'has-audio-toolbar' : ''}`}>
    <header className="reader-header"><Link className="back-link" href="/" aria-label="Back to story library"><ArrowLeft size={19} strokeWidth={1.7}/><span>Library</span></Link><div className="reader-header-title"><h1 lang="es" className="font-serif">{story.title.es}</h1><small>{story.level} · {Math.ceil(story.estimatedDurationSeconds/60)} min</small></div><div className="reader-menu-wrap"><button className="reader-menu-button" type="button" aria-label="Story settings" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}><MoreHorizontal size={22}/></button>{menuOpen && <div className="reader-popup"><span className="overline">STORY DETAILS</span><p>{story.level} · {story.genre}</p><p>{story.grammarFocus}</p><div className="reader-setting"><div><strong>Auto-scroll</strong><small>Follow the narration as it plays</small></div><Switch.Root className="switch-track" checked={autoScroll} onCheckedChange={toggleAutoScroll} aria-label="Auto-scroll with narration"><Switch.Thumb className="switch-thumb"/></Switch.Root></div><button onClick={() => { toggleTranslation(!translation); setMenuOpen(false); }}>Turn translations {translation ? 'off' : 'on'}</button></div>}</div></header>
    <div className="reader-intro"><div className="reader-art"><Image src={story.coverImage} alt={`Illustrated cover for ${story.title.en}`} fill priority sizes="(max-width: 768px) 100vw, 720px"/><div className="reader-art-vignette"/></div><div className="reader-intro-text"><div className="reader-story-top"><span className="overline">AN ORIGINAL SHORT STORY</span><span className="reader-level">{story.level}</span></div><h2 lang="es" className="font-serif">{story.title.es}</h2><p className="reader-english-title">{story.title.en}</p><div className="reader-intro-meta"><span>{story.genre}</span><span className="dot">·</span><span>{Math.ceil(story.estimatedDurationSeconds/60)} min read</span><span className="dot">·</span><span>{story.wordCount} words</span></div></div></div>
    <div className="reader-content"><div className="reader-preface"><p className="reader-synopsis">{story.synopsis}</p><div className="reader-focus"><span>LANGUAGE FOCUS</span><strong>{story.grammarFocus}</strong></div></div>
      <div className="reader-utilities"><div className="reading-modes" role="group" aria-label="Reading mode"><button className={mode === 'read' ? 'on' : ''} type="button" onClick={() => changeMode('read')} aria-pressed={mode === 'read'}><BookOpen size={16}/> Read</button><button className={mode === 'listen' ? 'on' : ''} type="button" disabled={!available} aria-label={!available ? 'Listen — narration coming soon' : 'Listen to story'} title={!available ? 'Narration coming soon' : undefined} aria-pressed={mode === 'listen'} onClick={() => changeMode('listen')}><Headphones size={16}/> Listen</button></div><label className="translation-switch"><Languages size={16}/><span>English</span><Switch.Root className="switch-track" checked={translation} onCheckedChange={toggleTranslation} aria-label="Show English translations"><Switch.Thumb className="switch-thumb"/></Switch.Root></label></div>
      {!available && <div className="text-edition-note"><BookOpen size={16}/><div><strong>Text edition</strong><span>Narration is being prepared. Every phrase is ready to explore.</span></div></div>}
      <div className="reading-guide"><span className="decorative-star">✳</span><span>Tap <span className="guide-underlined">underlined phrases</span> to uncover the Spanish.</span></div>
      <article className="narrative" aria-label={`${story.title.es} story text`}>{story.sentences.map((sentence,i) => <Sentence key={sentence.id} sentence={sentence} index={i} active={listening && audio.activeSentence === i} activeWord={listening && audio.activeSentence === i ? audio.activeWord : -1} selectedId={insight?.annotation.id ?? null} showTranslation={translation} onSelect={onSelect} onReplay={i => void audio.replay(i)} replayAvailable={listening && sentence.audio !== null}/>)}</article>
      <div className="story-end-mark" aria-hidden="true">✦</div>
      <Link className="vocabulary-link" href={`/stories/${story.id}/vocabulary`}><BookMarked size={22}/><span><strong>View full vocabulary list</strong><small>Nouns, verbs, prepositions, expressions, and present-tense conjugations</small></span><ArrowRight size={18}/></Link>
      <Comprehension story={story} completed={progress.reading[story.id]?.completed ?? initialReading?.completed ?? false} nextStoryId={next.id}/>
      <div className="reader-end"><Link href="/">← Explore more stories</Link><span>sonora<span className="accent-period">.</span></span></div>
    </div>
    <PhraseInsight annotation={insight?.annotation ?? null} open={insight !== null} onClose={() => setInsight(null)} saved={saved} onSave={() => { if (insight) setSaved(insight.annotation.id, !saved); }} onReplay={listening && insight?.sentence !== undefined && story.sentences[insight.sentence].audio ? () => { const index = insight.sentence; setInsight(null); void audio.replay(index); } : undefined}/>
    {listening && <AudioToolbar controller={audio} replaySentence={audio.activeSentence >= 0 ? audio.activeSentence : 0}/>}
  </main>;
}
