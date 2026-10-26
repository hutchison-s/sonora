import raw from '@/content/grammar/visuals.json';
import lessons from '@/content/grammar/expanded-lessons.json';
import { parseGrammarVisuals } from './visual-schema';

const catalog = parseGrammarVisuals(raw, Object.fromEntries(
 Object.entries(lessons).map(([id, lesson]) => [id, lesson.build.length]),
));
export function getGrammarVisuals(lessonId: string) {
 return catalog.lessons[lessonId] ?? [];
}
