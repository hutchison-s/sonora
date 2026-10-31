/**
 * Generate standalone vocabulary audio using ElevenLabs.
 * Usage: ELEVENLABS_API_KEY=... MONICA_VOICE_ID=... GEORGE_VOICE_ID=... npm run narrate:vocabulary
 * --dry-run lists work without calling ElevenLabs. Existing files are never regenerated.
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { vocabularyByStory } from '../lib/content/vocabulary';

type Category = 'noun' | 'verb' | 'preposition' | 'expression';
type Item = { text: string; category: Category; voice: 'monica' | 'george'; file: string };
const normalize = (text: string) => text.normalize('NFC').trim().replace(/\s+/gu, ' ');
const voiceFor = (category: Category, text: string): Item['voice'] =>
  category === 'verb' ? 'george' : category === 'noun' || category === 'preposition' ? 'monica'
    : (parseInt(createHash('sha256').update(text).digest('hex').slice(0, 2), 16) % 2 ? 'george' : 'monica');
const items = new Map<string, Item>();
function add(text: string, category: Category) {
  const clean = normalize(text);
  // Category is part of the key: the same spelling can be a noun or verb.
  const key = category + ':' + clean.toLocaleLowerCase('es');
  if (items.has(key)) return;
  const voice = voiceFor(category, clean);
  const hash = createHash('sha256').update(key).digest('hex').slice(0, 16);
  items.set(key, { text: clean, category, voice, file: `/audio/vocabulary/${hash}.mp3` });
}
for (const vocab of Object.values(vocabularyByStory)) {
  for (const term of vocab.nouns) add(term.es, 'noun');
  for (const term of vocab.verbs) {
    add(term.es, 'verb');
    for (const form of term.present) add(form, 'verb');
  }
  for (const term of vocab.prepositions) add(term.es, 'preposition');
  for (const term of vocab.expressions) add(term.es, 'expression');
}
const manifest = Object.fromEntries([...items.entries()].sort(([a], [b]) => a.localeCompare(b)));
const dryRun = process.argv.includes('--dry-run');
const batchArg = process.argv.find(arg => arg.startsWith('--batch-size='));
const batchSize = batchArg ? Number(batchArg.split('=')[1]) : Infinity;
if (!(batchSize > 0)) throw new Error('--batch-size must be positive');
const output = path.join(process.cwd(), 'public/audio/vocabulary');
let generated = 0;
let skipped = 0;
for (const item of Object.values(manifest)) {
  const target = path.join(process.cwd(), 'public', item.file.slice(1));
  try { await access(target); skipped++; continue; } catch { /* missing */ }
  if (dryRun) continue;
  if (generated >= batchSize) break;
  const voiceId = item.voice === 'monica' ? process.env.MONICA_VOICE_ID : process.env.GEORGE_VOICE_ID;
  if (!process.env.ELEVENLABS_API_KEY || !voiceId) throw new Error('Missing ELEVENLABS_API_KEY or ' + item.voice.toUpperCase() + '_VOICE_ID');
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text: item.text, model_id: process.env.ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2' }),
  });
  if (!response.ok) throw new Error(`ElevenLabs failed for "${item.text}": ${response.status} ${await response.text()}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 100) throw new Error('Suspiciously small audio for ' + item.text);
  await mkdir(output, { recursive: true });
  await writeFile(target, bytes, { flag: 'wx' });
  generated++;
}
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.info(`${items.size} unique category/form entries; ${skipped} existing; ${generated} generated; ${dryRun ? 'dry run' : 'complete'}.`);
