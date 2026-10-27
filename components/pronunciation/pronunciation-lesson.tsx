'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { rLesson } from '@/content/pronunciation/lessons';

type Example = (typeof rLesson.examples)[number];

function Practice({ example }: { example: Example }) {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [speed, setSpeed] = useState(1);
  const model = useRef<HTMLAudioElement>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const currentUrl = useRef<string | null>(null);
  const alive = useRef(true);
  const requesting = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (recorder.current?.state === 'recording') recorder.current.stop();
      stream.current?.getTracks().forEach(track => track.stop());
      if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
    };
  }, []);

  async function start() {
    if (requesting.current) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Recording is unavailable in this browser. Try a supported browser over HTTPS.'); return;
    }
    requesting.current = true;
    setError('');
    try {
      const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current) { microphone.getTracks().forEach(track => track.stop()); return; }
      stream.current = microphone;
      const next = new MediaRecorder(microphone);
      recorder.current = next;
      const chunks: Blob[] = [];
      next.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      next.onerror = () => { if (alive.current) { setError('Recording failed. Please try again.'); setRecording(false); } microphone.getTracks().forEach(track => track.stop()); };
      next.onstop = () => {
        microphone.getTracks().forEach(track => track.stop());
        stream.current = null;
        if (!alive.current) return;
        setRecording(false);
        if (!chunks.length) { setError('No audio was captured. Please try again.'); return; }
        if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
        currentUrl.current = URL.createObjectURL(new Blob(chunks, { type: next.mimeType || 'audio/webm' }));
        setUrl(currentUrl.current);
      };
      next.start(); setRecording(true);
    } catch {
      stream.current?.getTracks().forEach(track => track.stop());
      if (alive.current) setError('Could not access the microphone. Check browser permissions and try again.');
    } finally { requesting.current = false; }
  }

  function changeSpeed(value: number) { setSpeed(value); if (model.current) model.current.playbackRate = value; }
  return <section className="pron-practice" aria-label={`Practice ${example.spanish}`}>
    <p className="pron-label">LISTEN FOR</p><p>{example.hint}</p>
    <p className="pron-sentence" lang="es">{example.spanish}</p><p className="pron-translation">{example.english}</p>
    <div className="pron-audio"><label htmlFor={`model-${example.id}`}>1. Listen to the model</label><audio id={`model-${example.id}`} ref={model} controls preload="metadata" src={example.audio}>Your browser does not support audio playback.</audio><div className="pron-speed">Playback speed: <button type="button" aria-pressed={speed === 1} onClick={() => changeSpeed(1)}>Normal</button><button type="button" aria-pressed={speed === 0.75} onClick={() => changeSpeed(0.75)}>0.75×</button></div></div>
    <div className="pron-record"><p><strong>2. Record yourself</strong></p><button type="button" className="pron-button" onClick={() => recording ? recorder.current?.stop() : void start()}>{recording ? '■ Stop recording' : url ? '● Record again' : '● Start recording'}</button>{recording && <span className="pron-status" role="status"> Recording…</span>}{error && <p role="alert">{error}</p>}</div>
    {url && <div className="pron-audio"><label htmlFor={`take-${example.id}`}>3. Listen to your recording</label><audio id={`take-${example.id}`} controls src={url}>Your browser does not support audio playback.</audio><p className="pron-note">Play the model and your recording in turn. {example.hint}</p></div>}
  </section>;
}

export function PronunciationLesson() {
  const [index, setIndex] = useState(0);
  return <><div className="home-lede"><span className="overline">PRONUNCIATION STUDIO ✦ LISTEN &amp; PRACTICE</span><h1 className="font-serif">Find your <em>voice.</em></h1><p className="tiny-subtitle">Notice the sound, shape it, and practice in context.</p></div><div className="pron-lesson"><p className="pron-label">SOUND STUDY · A1</p><h2 className="font-serif">{rLesson.title}</h2><p>{rLesson.summary}</p><div className="pron-contrast"><div><b lang="es">pe<span>r</span>o</b><small>but · one tap</small></div><div><b lang="es">pe<span>rr</span>o</b><small>dog · trill</small></div></div><p className="pron-note">Between vowels, a single r is usually a tap; rr is a trill. A word-initial r is also a strong sound.</p><h3>Shape the sound</h3><div className="pron-cues">{rLesson.cues.map(cue => <div key={cue.title}><strong>{cue.title}</strong><p>{cue.text}</p></div>)}</div><h3>Practice in sentences</h3><p className="pron-note">Compare by listening to the model and your own recording. Your recording stays in this browser session and is not assessed.</p><div className="pron-selector" aria-label="Choose a practice sentence">{rLesson.examples.map((example, i) => <button key={example.id} type="button" aria-pressed={index === i} onClick={() => setIndex(i)}>Sentence {i + 1}</button>)}</div><Practice key={rLesson.examples[index].id} example={rLesson.examples[index]} /><p className="pron-note">Switching sentences clears your recording. <Link href="/grammar/rr">Explore the two r sounds in Grammar Studio →</Link></p></div></>;
}
