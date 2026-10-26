import { writeFileSync } from 'node:fs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { grammarReadingSchema } from '../lib/grammar/reading-schema';
import { grammarCatalogSchema, expandedGrammarCatalogSchema } from '../lib/grammar/lesson-schema';
for (const [file, name, schema] of [
 ['lessons.schema.json', 'GrammarCatalog', grammarCatalogSchema],
 ['expanded-lessons.schema.json', 'ExpandedGrammarCatalog', expandedGrammarCatalogSchema],
 ['readings.schema.json', 'GrammarReadings', grammarReadingSchema],
] as const) {
 writeFileSync(`content/grammar/${file}`, JSON.stringify(zodToJsonSchema(schema, { name, target: 'jsonSchema7', $refStrategy: 'root' }), null, 2) + '\n');
}
console.log('Exported grammar lesson schemas');
