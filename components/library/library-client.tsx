'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, BookOpen, Headphones, Play } from 'lucide-react';
import type { Story, Level } from '@/lib/types/story';
import { useProgress } from '@/lib/progress/use-progress';
import { setSetting } from '@/lib/progress/storage';
import { ProfileLink } from '@/components/navigation/profile-link';
import { ToolGallery } from '@/components/navigation/tool-gallery';
import { StoryCard } from './story-card';

const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2'] as const;
export function LibraryClient({ stories }: { stories: Story[] }) {
  const [progress, ready] = useProgress();
  const [override, setOverride] = useState<Level | 'All' | null>(null);
  const level = override ?? progress.settings.level;
  const filtered = useMemo(() => stories.filter(s => level === 'All' || s.level === level), [stories, level]);
  const featured = filtered[0];
  const others = filtered.slice(1);
  const latest = ready && progress.lastStory ? stories.find(s => s.id === progress.lastStory) : null;
  const hasAudio = featured?.narration.status === 'ready';
  return <><main className="home-shell">
    <header className="home-header"><div><Link href="/" className="wordmark">Sonora<span>.</span></Link><p className="tiny-subtitle">Stories that teach you Spanish.</p></div><ProfileLink/></header>
    <div className="home-lede"><span className="overline">THE STORY ROOM <span className="warm-dot">✦</span> YOUR SPANISH, UNFOLDING</span><h1 className="font-serif">A world of stories.<br/><em>A language within reach.</em></h1></div>
    {latest && <section className="continue-strip" aria-label="Continue reading"><div className="continue-art"><Image src={latest.coverImage} alt="" fill sizes="72px"/></div><div className="continue-copy"><span className="overline">PICK UP WHERE YOU LEFT OFF</span><strong className="font-serif">{latest.title.es}</strong><small>{progress.reading[latest.id]?.completed ? 'Read again' : 'Continue reading'}</small></div><Link href={`/stories/${latest.id}`} className="circle-action" aria-label={`Continue ${latest.title.es}`}><ArrowRight size={20}/></Link></section>}
    <section className="library-section" aria-label="Story library">
      <div className="library-heading"><div><span className="overline">FIND YOUR NEXT STORY</span><h2 className="font-serif">The library<span className="accent-period">.</span></h2></div><span className="story-count">{filtered.length} {filtered.length === 1 ? 'story' : 'stories'}</span></div>
      <div className="filter-row" role="group" aria-label="Filter stories by difficulty">{LEVELS.map(l => <button key={l} type="button" onClick={() => { setOverride(l); setSetting('level', l); }} className={`filter-chip ${level === l ? 'selected' : ''}`} aria-pressed={level === l}>{l === 'All' ? 'All stories' : l}</button>)}</div>
      {featured ? <><Link href={`/stories/${featured.id}`} className="feature-hero" aria-label={`Read ${featured.title.es}`}><div className="feature-background"><Image src={featured.coverImage} alt="" fill priority sizes="(max-width: 768px) 100vw, 1100px"/><div className="feature-shade"/></div><div className="feature-inside"><span className="feature-label">{featured.level} <span aria-hidden="true">·</span> {Math.ceil(featured.estimatedDurationSeconds/60)} min {hasAudio ? 'listen' : 'read'}</span><div className="feature-title-wrap"><span className="overline">FEATURED STORY</span><h3 className="font-serif">{featured.title.es}</h3><p>{featured.synopsis}</p><div className="feature-bottom"><span className="feature-metadata"><BookOpen size={15}/>{featured.grammarFocus}</span><span className="feature-play">{hasAudio ? <Play size={20} fill="currentColor" aria-hidden="true"/> : <ArrowUpRight size={23} aria-hidden="true"/>}</span></div></div></div></Link>
        <div className="story-grid">{others.map(story => <StoryCard key={story.id} story={story} progress={progress.reading[story.id]?.completed ? 1 : progress.reading[story.id] ? Math.max(0.05, progress.reading[story.id].sentenceIndex/story.sentences.length) : undefined}/>)}</div>
      </> : <p className="empty-note">Stories for this level are on their way. Explore another level in the meantime.</p>}
      <p className="library-footnote"><Headphones size={14}/> Narration is available on stories with the headphone label. All stories include interactive reading and contextual explanations.</p>
    </section>
    <footer className="home-footer"><span>Sonora<span className="accent-period">.</span></span><p>Understand the language. Find your voice.</p></footer>
  </main><ToolGallery/></>;
}
