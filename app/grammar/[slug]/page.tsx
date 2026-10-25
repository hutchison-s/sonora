import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ProfileLink } from '@/components/navigation/profile-link';
import { ToolGallery } from '@/components/navigation/tool-gallery';
import { GrammarExamples } from '@/components/grammar/grammar-examples';
import catalog from '@/content/grammar/lessons.json';

export function generateStaticParams(){return catalog.lessons.map(l=>({slug:l.id}));}
export default async function GrammarLessonPage({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params; const lesson=catalog.lessons.find(l=>l.id===slug); if(!lesson)notFound();
 const category=catalog.categories.find(c=>c.id===lesson.categoryId)?.title;
 return <><main className="home-shell"><header className="home-header"><div><Link href="/" className="wordmark">Sonora<span>.</span></Link><p className="tiny-subtitle">Stories that teach you Spanish.</p></div><ProfileLink/></header><article className="grammar-detail"><Link className="grammar-back" href="/grammar"><ArrowLeft size={17}/> Grammar Studio</Link><div className="overline">{category} · {lesson.level}</div><h1 className="font-serif">{lesson.title}<span className="accent-period">.</span></h1><p className="grammar-intro">{lesson.summary}</p><h2 className="font-serif">See it in action</h2><GrammarExamples examples={lesson.examples}/><h2 className="font-serif">Vocabulary in these examples</h2>{lesson.vocabulary.length?<div className="grammar-vocab">{lesson.vocabulary.map(v=><div key={v.surface}><strong>{v.surface}</strong><span>{v.lemma!==v.surface?`${v.lemma} · `:''}{v.meaning}</span></div>)}</div>:<p className="grammar-muted">Review the words in the example sentences above.</p>}</article></main><ToolGallery/></>;
}
