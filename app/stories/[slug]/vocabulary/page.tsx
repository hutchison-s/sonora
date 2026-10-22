import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getStory, stories } from '@/lib/content/stories';
import { getStoryVocabulary } from '@/lib/content/vocabulary';
import { VocabularyBrowser } from '@/components/story/vocabulary-browser';
import { buildVocabularyAudioMap } from '@/lib/audio/vocabulary-audio';

export function generateStaticParams() { return stories.map(story => ({ slug: story.id })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  return { title: story ? `Vocabulary · ${story.title.es}` : 'Vocabulary' };
}

export default async function VocabularyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  const vocabulary = getStoryVocabulary(slug);
  if (!story || !vocabulary) return notFound();
  const vocabularyAudio = buildVocabularyAudioMap(story, vocabulary);
  return <main className="vocab-page"><header className="vocab-page-header"><Link href={`/stories/${story.id}`}><ArrowLeft size={18}/> Back to story</Link><span className="wordmark">sonora<span>.</span></span></header>
    <div className="vocab-page-intro"><span className="overline">FULL VOCABULARY LIST · {story.level}</span><h1 className="font-serif" lang="es">{story.title.es}</h1><p>Nouns, verbs, prepositions, and useful expressions from the story. Verb tables show the present tense.</p></div>
    <VocabularyBrowser vocabulary={vocabulary} audio={vocabularyAudio}/>
    <footer className="vocab-page-footer"><Link href={`/stories/${story.id}`}>← Return to {story.title.es}</Link></footer>
  </main>;
}
