'use client';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bookmark, Trash2 } from 'lucide-react';
import type { Story } from '@/lib/types/story';
import { useProgress } from '@/lib/progress/use-progress';
import { setSaved } from '@/lib/progress/storage';
export function SavedClient({ stories }: { stories: Story[] }) {
  const [progress] = useProgress();
  const phrases = stories.flatMap(s => s.sentences.flatMap(sentence => sentence.annotations.filter(a => progress.savedPhrases.includes(a.id)).map(a => ({ ...a, story:s }))));
  return <main className="subpage-shell"><header className="subpage-header"><Link href="/profile" className="back-link"><ArrowLeft size={19}/> Profile</Link><Link href="/" className="reader-logo">sonora<span>.</span></Link><div className="header-empty"/></header><div className="profile-hero"><span className="overline">YOUR PERSONAL COLLECTION</span><h1 className="font-serif">Phrases worth <em>keeping.</em></h1><p>Small discoveries you can return to at any time.</p></div>
    {phrases.length === 0 ? <div className="saved-empty"><Bookmark size={23}/><h2 className="font-serif">Your collection begins with curiosity.</h2><p>Tap underlined phrases while reading, then save the ones that stay with you.</p><Link href="/">Explore stories <ArrowRight size={16}/></Link></div> : <div className="saved-list">{phrases.map(phrase => <article className="saved-item" key={phrase.id}><span className="overline">{phrase.type} · {phrase.story.title.es}</span><h2 className="font-serif" lang="es">{phrase.text}</h2><strong>{phrase.meaning}</strong><p>{phrase.explanation}</p><div className="saved-actions"><Link href={`/stories/${phrase.story.id}`}>Read in context <ArrowRight size={15}/></Link><button onClick={() => setSaved(phrase.id, false)} aria-label={`Remove ${phrase.text} from saved phrases`}><Trash2 size={16}/> Remove</button></div></article>)}</div>}
  </main>;
}
