import { accessSync } from 'node:fs';
import { join } from 'node:path';
import { grammarCatalog } from '../lib/grammar/lessons';
import { getGrammarVisuals } from '../lib/grammar/visuals';
import { grammarReadings } from '../lib/grammar/readings';

for (const lesson of grammarCatalog.lessons) {
 for (const example of lesson.examples) {
  if (example.audioPath) accessSync(join('public', example.audioPath));
 }
 if (!getGrammarVisuals(lesson.id).length) throw new Error(`Missing teaching visual: ${lesson.id}`);
}
console.log(`Validated ${grammarCatalog.lessons.length} grammar lessons, visuals, media and ${grammarReadings.references.length} story references.`);
