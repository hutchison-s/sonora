'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Story } from '@/lib/types/story';
import { clampSeek, findSentenceAt, findWordAt, sentenceSeekTime } from '@/lib/audio/timing';
import { nextSpeed } from '@/lib/audio/timing';
import { recordAudioPosition, setSetting } from '@/lib/progress/storage';

type AudioStatus = 'unavailable' | 'loading' | 'ready' | 'buffering' | 'error';
export type AudioController = {
  status: AudioStatus; playing: boolean; time: number; duration: number; speed: 0.75 | 1 | 1.25;
  activeSentence: number; activeWord: number; error: string | null;
  toggle: () => Promise<void>; pause: () => void; seek: (seconds: number) => void;
  replay: (index: number) => Promise<void>; changeSpeed: () => void;
};

export function useStoryAudio(story: Story, enabled: boolean, initialTime: number, initialSpeed: 0.75 | 1 | 1.25, onEnded?: () => void): AudioController {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>(0);
  const lastVisualRef = useRef({ sentence: -1, word: -1, roundedTime: -1 });
  const timeRef = useRef(0);
  const speedRef = useRef(initialSpeed);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;
  const [status, setStatus] = useState<AudioStatus>(story.narration.status === 'ready' ? 'loading' : 'unavailable');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(story.narration.durationSeconds ?? 0);
  const [speed, setSpeed] = useState(initialSpeed);
  const [activeSentence, setActiveSentence] = useState(-1);
  const [activeWord, setActiveWord] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const wasPlayingAtRef = useRef<number | null>(null);
  const audioUrl = story.narration.audioUrl;
  const storyId = story.id;
  const sentences = story.sentences;
  const declaredDuration = story.narration.durationSeconds ?? 0;

  const persist = useCallback((force = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    // Count time actually spent listening, not seek jumps or playback position.
    let elapsed = 0;
    if (wasPlayingAtRef.current !== null) {
      const now = performance.now();
      elapsed = Math.min(20, Math.max(0, (now - wasPlayingAtRef.current) / 1000));
      wasPlayingAtRef.current = audio.paused ? null : now;
    }
    if (force || elapsed > 0) recordAudioPosition(storyId, audio.currentTime, elapsed);
  }, [storyId]);

  useEffect(() => {
    if (!audioUrl) { setStatus('unavailable'); return; }
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.src = audioUrl;
    audio.playbackRate = speedRef.current;
    audioRef.current = audio;
    setStatus('loading');
    let lastSaved = 0;
    const refresh = () => {
      if (!audioRef.current) return;
      timeRef.current = audio.currentTime;
      const sentence = findSentenceAt(sentences, audio.currentTime);
      const word = sentence >= 0 ? findWordAt(sentences[sentence].audio?.words ?? [], audio.currentTime) : -1;
      const rounded = Math.floor(audio.currentTime * 3);
      const prev = lastVisualRef.current;
      if (prev.sentence !== sentence) { setActiveSentence(sentence); prev.sentence = sentence; }
      if (prev.word !== word || prev.sentence !== sentence) { setActiveWord(word); prev.word = word; }
      if (prev.roundedTime !== rounded) { setTime(audio.currentTime); prev.roundedTime = rounded; }
      if (audio.currentTime - lastSaved >= 5) { persist(); lastSaved = audio.currentTime; }
      if (!audio.paused && !audio.ended) animationRef.current = requestAnimationFrame(refresh);
    };
    const stopAnimation = () => { cancelAnimationFrame(animationRef.current); };
    const started = () => { setPlaying(true); setStatus('ready'); wasPlayingAtRef.current = performance.now(); stopAnimation(); animationRef.current = requestAnimationFrame(refresh); };
    const stopped = () => { setPlaying(false); stopAnimation(); refresh(); persist(true); };
    const ended = () => { stopped(); onEndedRef.current?.(); };
    const metadata = () => {
      const actual = Number.isFinite(audio.duration) ? audio.duration : declaredDuration;
      setDuration(actual);
      audio.currentTime = clampSeek(initialTime, actual);
      setStatus('ready'); refresh();
    };
    const waiting = () => setStatus('buffering');
    const canPlay = () => setStatus('ready');
    const onError = () => { setStatus('error'); setError('Narration is unavailable. You can still read the entire story.'); stopped(); };
    audio.addEventListener('loadedmetadata', metadata);
    audio.addEventListener('play', started);
    audio.addEventListener('pause', stopped);
    audio.addEventListener('ended', ended);
    audio.addEventListener('waiting', waiting);
    audio.addEventListener('canplay', canPlay);
    audio.addEventListener('error', onError);
    const seekRefresh = () => { stopAnimation(); refresh(); };
    audio.addEventListener('seeking', seekRefresh);
    audio.load();
    return () => { stopAnimation(); audio.pause(); persist(true); audio.removeAttribute('src'); audio.load(); audioRef.current = null;
      audio.removeEventListener('loadedmetadata', metadata); audio.removeEventListener('play', started); audio.removeEventListener('pause', stopped); audio.removeEventListener('ended', ended); audio.removeEventListener('waiting', waiting); audio.removeEventListener('canplay', canPlay); audio.removeEventListener('error', onError); audio.removeEventListener('seeking', seekRefresh);
    };
  // initialize only when a different audio asset is loaded; refs handle callbacks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, storyId]);

  useEffect(() => { if (!enabled) audioRef.current?.pause(); }, [enabled]);
  const pause = useCallback(() => audioRef.current?.pause(), []);
  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    try { await audio.play(); setError(null); } catch { setError('Your browser blocked playback. Tap play again to start.'); }
  }, []);
  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current; if (!audio) return;
    audio.currentTime = clampSeek(seconds, Number.isFinite(audio.duration) ? audio.duration : declaredDuration);
    setTime(audio.currentTime);
    const sentence = findSentenceAt(sentences, audio.currentTime);
    setActiveSentence(sentence);
    setActiveWord(sentence >= 0 ? findWordAt(sentences[sentence].audio?.words ?? [], audio.currentTime) : -1);
    recordAudioPosition(storyId, audio.currentTime);
  }, [declaredDuration, sentences, storyId]);
  const replay = useCallback(async (index: number) => {
    const destination = sentenceSeekTime(sentences[index]);
    if (destination === null) { setError('This sentence has no synchronization timestamps.'); return; }
    seek(destination);
    const audio = audioRef.current;
    if (audio) { try { await audio.play(); } catch { setError('Tap the play button to begin narration.'); } }
  }, [seek, sentences]);
  const changeSpeed = useCallback(() => {
    const next = nextSpeed(speedRef.current);
    speedRef.current = next; if (audioRef.current) audioRef.current.playbackRate = next;
    setSpeed(next);
    setSetting('speed', next);
  }, []);
  return { status, playing, time, duration, speed, activeSentence, activeWord, error, toggle, pause, seek, replay, changeSpeed };
}
