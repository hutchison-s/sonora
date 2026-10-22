'use client';
import { BookOpen, AudioLines, Languages, LibraryBig } from 'lucide-react';
import { useRef, useState } from 'react';
const items = [
  { label: 'Story Room', icon: BookOpen, active: true },
  { label: 'Grammar Studio', icon: LibraryBig, active: false },
  { label: 'Pronunciation', icon: AudioLines, active: false },
  { label: 'Translation', icon: Languages, active: false },
];
export function ToolGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState('');
  return <nav className="tool-gallery" aria-label="Learning studios"><div className="tool-scroll" ref={ref} onKeyDown={e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const buttons = [...(ref.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    e.preventDefault(); buttons[(index + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length]?.focus();
  }}>{items.map(({ label, icon: Icon, active }) => <button key={label} type="button" className={`tool-item ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined} aria-label={active ? label : `${label} — coming soon`} title={active ? label : `${label} — coming soon`} onClick={() => { if (active) { setNotice(''); window.scrollTo({ top: 0, behavior: 'smooth' }); } else { setNotice(`${label} is coming soon. For now, explore the Story Room.`); } }}><Icon size={19} strokeWidth={1.55}/><span>{label}</span>{!active && <small>Soon</small>}</button>)}</div>{notice && <p className="tool-notice" role="status">{notice}</p>}</nav>;
}
