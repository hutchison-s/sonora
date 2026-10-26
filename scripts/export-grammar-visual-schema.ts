import { writeFileSync } from 'node:fs';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { grammarVisualCatalogSchema } from '../lib/grammar/visual-schema';

const schema = zodToJsonSchema(grammarVisualCatalogSchema, {
 name: 'GrammarVisualCatalog', target: 'jsonSchema7', $refStrategy: 'root',
});
writeFileSync('content/grammar/visuals.schema.json', JSON.stringify(schema, null, 2) + '\n');
console.log('Exported grammar visual JSON Schema');
