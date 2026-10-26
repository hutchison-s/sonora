import input from '@/content/grammar/readings.json';
import { grammarCatalog } from './lessons';
import { stories } from '@/lib/content/stories';
import { parseGrammarReadings } from './reading-schema';
import type { AnnotationLessonLinks } from '@/lib/types/grammar';

export const grammarReadings = parseGrammarReadings(input, new Set(grammarCatalog.lessons.map(l => l.id)), stories);
export function getGrammarReadings(lessonId: string) {
 return grammarReadings.references.filter(r => r.lessonId === lessonId).map(reference => {
  const story = stories.find(s => s.id === reference.storyId)!;
  const index = story.sentences.findIndex(s => s.id === reference.sentenceId);
  return { ...reference, title: story.title.es, sentence: story.sentences[index].es, sentenceNumber: index + 1 };
 });
}
/** Only this story's small link map is serialized to the client, never the whole grammar catalog. */
export function getStoryGrammarLinks(storyId: string): AnnotationLessonLinks {
 const links: AnnotationLessonLinks = {};
 for (const ref of grammarReadings.references.filter(r => r.storyId === storyId)) {
  const lesson = grammarCatalog.lessons.find(l => l.id === ref.lessonId)!;
  for (const annotationId of ref.annotationIds) {
   const list = links[annotationId] ??= [];
   if (!list.some(l => l.id === lesson.id)) list.push({ id: lesson.id, title: lesson.title });
  }
 }
 return links;
}
