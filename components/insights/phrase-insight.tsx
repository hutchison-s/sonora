'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { Bookmark, BookmarkCheck, Play, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Annotation } from '@/lib/types/story';

type Props = { annotation: Annotation | null; open: boolean; saved: boolean; onClose: () => void; onSave: () => void; onReplay?: () => void };
type Tab = 'explanation' | 'breakdown' | 'examples';
export function PhraseInsight({ annotation, open, saved, onClose, onSave, onReplay }: Props) {
  const [tab, setTab] = useState<Tab>('explanation');
  useEffect(() => { setTab('explanation'); }, [annotation?.id]);
  if (!annotation) return null;
  const grammar = annotation.grammar;
  const breakdown = grammar?.breakdown ?? [];
  const examples = grammar?.examples ?? [];
  const metadata = grammar ? Object.entries(grammar).filter(([key,value]) => !['breakdown','examples'].includes(key) && typeof value === 'string') as [string,string][] : [];
  const tabs: { id: Tab; label: string }[] = [{ id: 'explanation', label: 'Explanation' }];
  if (breakdown.length || metadata.length) tabs.push({ id:'breakdown', label:'Breakdown' });
  if (examples.length) tabs.push({ id:'examples', label:'Examples' });
  return <Dialog.Root open={open} onOpenChange={value => { if (!value) onClose(); }}><Dialog.Portal><Dialog.Overlay className="insight-overlay"/><Dialog.Content className="insight-panel" aria-describedby="insight-description"><div className="sheet-grip" aria-hidden="true"/><div className="insight-inner"><div className="insight-top"><span className="overline">A CLOSER LOOK <span aria-hidden="true">/</span> {annotation.partOfSpeech.toUpperCase()}</span><Dialog.Close className="icon-close" aria-label="Close phrase explanation"><X size={19}/></Dialog.Close></div>
  <Dialog.Title className="insight-title font-serif" lang="es">{annotation.text}</Dialog.Title><p className="insight-meaning">{annotation.meaning}</p><p id="insight-description" className="sr-only">Contextual Spanish language explanation</p>
  {tabs.length > 1 && <div className="insight-tabs" role="tablist" aria-label="Insight sections" onKeyDown={e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault(); const idx = tabs.findIndex(t => t.id === tab);
    const next = tabs[(idx + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    setTab(next.id); document.getElementById(`insight-tab-${next.id}`)?.focus();
  }}>{tabs.map(t => <button role="tab" id={`insight-tab-${t.id}`} aria-controls="insight-tabpanel" tabIndex={tab === t.id ? 0 : -1} aria-selected={tab === t.id} className={tab === t.id ? 'current' : ''} key={t.id} onClick={() => setTab(t.id)}>{t.label}</button>)}</div>}
  <div className="insight-body" id="insight-tabpanel" role="tabpanel" aria-labelledby={tabs.length > 1 ? `insight-tab-${tab}` : undefined}>
    {tab === 'explanation' && <><p className="insight-explanation">{annotation.explanation}</p>{annotation.tip && <div className="insight-tip"><span>REMEMBER THIS</span><p>{annotation.tip}</p></div>}</>}
    {tab === 'breakdown' && <><div className="grammar-metadata">{metadata.map(([key,value]) => <div key={key}><span>{key === 'pronouns' ? 'Pronouns' : key}</span><strong>{value}</strong></div>)}</div>{breakdown.length > 0 && <div className="breakdown-list">{breakdown.map(item => <div key={item.part}><strong lang="es">{item.part}</strong><span>{item.explanation}</span></div>)}</div>}</>}
    {tab === 'examples' && <div className="example-list">{examples.map((item,i) => <div key={i}><p lang="es">{item.es}</p><small>{item.en}</small></div>)}</div>}
  </div>
  <div className="insight-actions"><button type="button" className={`save-phrase-button ${saved ? 'saved' : ''}`} onClick={onSave}>{saved ? <BookmarkCheck size={18}/> : <Bookmark size={18}/>} {saved ? 'Saved to phrases' : 'Save phrase'}</button>{onReplay && <button className="replay-phrase-button" onClick={onReplay}><Play size={17}/> Replay sentence</button>}</div>
  </div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
