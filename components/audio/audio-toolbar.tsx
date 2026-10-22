'use client';
import { Headphones, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import type { AudioController } from './use-story-audio';
import { useState } from 'react';
function format(seconds: number) { const n = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0)); return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`; }
export function AudioToolbar({ controller, replaySentence }: { controller: AudioController; replaySentence: number }) {
  const { playing, time, duration, speed, status, error, toggle, seek, replay, changeSpeed } = controller;
  const [seeking, setSeeking] = useState<number | null>(null);
  const disabled = status === 'unavailable' || status === 'error' || status === 'loading';
  return <div className="audio-toolbar" aria-label="Audio playback controls"><div className="audio-toolbar-inner"><div className="audio-bar-top"><span className="audio-status"><Headphones size={15}/>{status === 'buffering' ? 'Buffering…' : status === 'loading' ? 'Loading audio…' : 'STORY NARRATION'}</span><span className="audio-duration">{format(seeking ?? time)} <span>/</span> {format(duration)}</span></div>
    <input type="range" className="audio-seek" aria-label="Seek narration" min={0} max={Math.max(1, duration)} step={0.1} value={seeking ?? Math.min(time, Math.max(1, duration))} disabled={disabled} onChange={e => setSeeking(Number(e.target.value))} onPointerUp={e => { if (seeking !== null) seek(seeking); setSeeking(null); }} onKeyUp={e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') { if (seeking !== null) seek(seeking); setSeeking(null); } }} style={{ '--audio-percent': `${Math.min(100, 100 * (seeking ?? time) / Math.max(1, duration))}%` } as React.CSSProperties}/>
    <div className="audio-bar-bottom"><button type="button" className="speed-button" onClick={changeSpeed} aria-label={`Playback speed ${speed} times; change speed`}>{speed}×</button><div className="transport-buttons"><button type="button" className="replay-button" disabled={disabled || replaySentence < 0} onClick={() => void replay(replaySentence)} aria-label="Replay current sentence"><RotateCcw size={19}/></button><button type="button" className="play-button" disabled={disabled} onClick={() => void toggle()} aria-label={playing ? 'Pause narration' : 'Play narration'}>{playing ? <Pause fill="currentColor" size={21}/> : <Play fill="currentColor" size={21}/>}</button><span aria-hidden="true" className="audio-spacer"><Volume2 size={18}/></span></div><span className="audio-spacer-right"/></div>
    {error && <p role="alert" className="audio-error">{error}</p>}
  </div></div>;
}
