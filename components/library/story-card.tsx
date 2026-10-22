import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, BookOpen, Clock3, Headphones } from 'lucide-react';
import type { Story } from '@/lib/types/story';
export function StoryCard({ story, progress }: { story: Story; progress?: number }) {
  return <Link href={`/stories/${story.id}`} className="story-card" aria-label={`Read ${story.title.es}, level ${story.level}`}>
    <div className="story-card-art"><Image src={story.coverImage} alt={`Atmospheric illustration for ${story.title.en}`} fill sizes="(max-width: 768px) 100vw, 480px"/><div className="art-fade"/><div className="card-level">{story.level} <span aria-hidden="true">·</span> {Math.ceil(story.estimatedDurationSeconds / 60)} min</div></div>
    <div className="story-card-content"><div className="card-heading-row"><h3 className="font-serif">{story.title.es}</h3><span className="card-arrow"><ArrowUpRight size={19}/></span></div><p>{story.synopsis}</p><div className="meta-row"><span>{story.narration.status === 'ready' ? <Headphones size={13}/> : <Clock3 size={13}/>} {story.narration.status === 'ready' ? 'Audio & text' : 'Interactive reading'}</span><span><BookOpen size={13}/> {story.grammarFocus}</span></div>{typeof progress === 'number' && progress > 0 && <div className="card-progress" aria-label={`${Math.round(progress*100)} percent reading progress`} role="progressbar" aria-valuenow={Math.round(progress*100)} aria-valuemin={0} aria-valuemax={100}><div style={{width: `${Math.round(progress * 100)}%`}}/></div>}</div>
  </Link>;
}
