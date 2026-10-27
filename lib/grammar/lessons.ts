import catalogInput from '@/content/grammar/lessons.json';
import expandedInput from '@/content/grammar/expanded-lessons.json';
import { parseGrammarLessons } from './lesson-schema';

export const { catalog: grammarCatalog, expanded: expandedGrammarLessons } = parseGrammarLessons(catalogInput, expandedInput);
export const grammarLibraryCatalog = { ...grammarCatalog, lessons: grammarCatalog.lessons.map(lesson => ({
 ...lesson, recordedExampleCount: lesson.examples.filter(example => example.audioPath).length + expandedGrammarLessons[lesson.id].extraExamples.filter(example => example.audioPath).length,
 exampleCount: lesson.examples.length + expandedGrammarLessons[lesson.id].extraExamples.length,
})) };
