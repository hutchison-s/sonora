import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getStory, stories } from '@/lib/content/stories';
import { getStoryGrammarLinks } from '@/lib/grammar/readings';
import { StoryReader } from '@/components/story/story-reader';
export function generateStaticParams() { return stories.map(s => ({ slug: s.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const story = getStory(slug);
  return { title: story?.title.es ?? 'Story', description: story?.synopsis };
}
export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const story = getStory(slug); if (!story) return notFound();
  return <StoryReader story={story} grammarLinks={getStoryGrammarLinks(story.id)}/>;
}
