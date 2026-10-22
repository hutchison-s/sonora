/**
 * Audits which vocabulary entries can reuse exact spans from published story narration.
 * This command never calls a speech API or writes audio. Use --verbose to list missing entries.
 */
import { stories } from '../lib/content/stories';
import { getStoryVocabulary } from '../lib/content/vocabulary';
import { buildVocabularyAudioMap, clipForText } from '../lib/audio/vocabulary-audio';

const verbose = process.argv.includes('--verbose');
let availableTotal = 0;
let entryTotal = 0;
let recordedFormsTotal = 0;

for (const story of stories) {
  const vocabulary = getStoryVocabulary(story.id);
  if (!vocabulary) throw new Error(`Missing vocabulary for ${story.id}`);
  const audio = buildVocabularyAudioMap(story, vocabulary);
  const entries = [
    ...vocabulary.nouns,
    ...vocabulary.verbs,
    ...vocabulary.prepositions,
    ...vocabulary.expressions,
  ];
  const available = entries.filter(term => clipForText(audio, term.es));
  const missing = entries.filter(term => !clipForText(audio, term.es));
  const recordedForms = new Set(vocabulary.verbs.flatMap(verb => verb.present).filter(form => clipForText(audio, form)));
  availableTotal += available.length;
  entryTotal += entries.length;
  recordedFormsTotal += recordedForms.size;
  const status = story.narration.status === 'ready' ? `${available.length}/${entries.length} exact entries` : 'narration unavailable';
  console.info(`${story.title.es}: ${status}; ${recordedForms.size} displayed conjugation forms`);
  if (verbose && missing.length) console.info(`  Missing: ${missing.map(term => term.es).join(', ')}`);
}

const percent = entryTotal ? Math.round(availableTotal / entryTotal * 100) : 0;
console.info(`\nReusable original narration: ${availableTotal}/${entryTotal} vocabulary entries (${percent}%).`);
console.info(`Additional recorded conjugation forms: ${recordedFormsTotal}.`);
console.info('No API calls were made and no credits were spent.');
