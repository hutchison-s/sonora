/**
 * Offline ElevenLabs publishing tool. No API requests happen in the application.
 * Usage: ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... npm run narrate -- --story=la-llave-azul
 * IMPORTANT: Do not commit generated MP3 files without verifying narration rights/quality.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { parseStory } from '../lib/content/schema';
import { buildNarrationScript, parseNarrationCues } from '../lib/audio/narration-cues';
import type { Story, StorySentence, WordTiming } from '../lib/types/story';

interface Alignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}
interface ElevenResponse {
  audio_base64: string;
  alignment?: Alignment;
  normalized_alignment?: Alignment;
}

function validateAlignment(a: Alignment, exactText: string): Alignment {
  // Normalized alignment changes the character sequence, so use original alignment.
  if (a.characters.join('') !== exactText) {
    throw new Error('ElevenLabs original alignment does not exactly match the narrated text. Nothing was published. Review the content and the returned alignment before proceeding.');
  }
  if (a.characters.length !== a.character_start_times_seconds.length || a.characters.length !== a.character_end_times_seconds.length) {
    throw new Error('ElevenLabs returned incomplete alignment arrays.');
  }
  let previous = 0;
  for (let i=0; i<a.characters.length; i++) {
    const start = a.character_start_times_seconds[i], end = a.character_end_times_seconds[i];
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || start < previous - 0.015) {
      throw new Error(`Invalid ElevenLabs timing at character ${i}`);
    }
    previous = Math.max(previous, end);
  }
  return a;
}

function requireAlignment(payload: ElevenResponse, exactText: string): Alignment {
  if (!payload.alignment) throw new Error('ElevenLabs returned no original alignment. Nothing was published.');
  return validateAlignment(payload.alignment, exactText);
}

export function narrationText(story: Story): string { return story.sentences.map(s => s.es).join(' '); }

export function removeCueTimings(alignment: Alignment, taggedText: string, cleanText: string): Alignment {
  validateAlignment(alignment, taggedText);
  const cleaned: Alignment = { characters: [], character_start_times_seconds: [], character_end_times_seconds: [] };
  let taggedIndex = 0;
  let cleanIndex = 0;
  while (taggedIndex < taggedText.length) {
    if (cleanIndex < cleanText.length && taggedText[taggedIndex] === cleanText[cleanIndex]) {
      cleaned.characters.push(alignment.characters[taggedIndex]);
      cleaned.character_start_times_seconds.push(alignment.character_start_times_seconds[taggedIndex]);
      cleaned.character_end_times_seconds.push(alignment.character_end_times_seconds[taggedIndex]);
      taggedIndex++;
      cleanIndex++;
      continue;
    }
    const cueEnd = taggedText.indexOf('] ', taggedIndex);
    const cue = cueEnd < 0 ? '' : taggedText.slice(taggedIndex, cueEnd + 2);
    if (!/^\[[a-z]+(?: [a-z]+)*\] $/.test(cue)) {
      throw new Error(`ElevenLabs alignment differs from the clean transcript at tagged character ${taggedIndex}. Nothing was published.`);
    }
    taggedIndex = cueEnd + 2;
  }
  if (cleanIndex !== cleanText.length) {
    throw new Error('ElevenLabs alignment ended before the clean transcript. Nothing was published.');
  }
  return validateAlignment(cleaned, cleanText);
}
export function deriveTimings(sentences: StorySentence[], alignment: Alignment): { sentences: StorySentence[], duration: number } {
  const all = sentences.map(s => s.es).join(' ');
  if (alignment.characters.join('') !== all) throw new Error('Alignment text mismatch.');
  let global = 0;
  const updated = sentences.map((sentence, i) => {
    const sentenceOffset = global;
    const tokenMatches = [...sentence.es.matchAll(/\S+/gu)];
    const words: WordTiming[] = tokenMatches.map(match => {
      const text = match[0]; const charStart = match.index ?? 0;
      const first = sentenceOffset + charStart;
      const last = first + text.length - 1;
      const start = alignment.character_start_times_seconds[first];
      const end = alignment.character_end_times_seconds[last];
      if (end <= start) throw new Error(`Non-positive duration for word '${text}' in ${sentence.id}`);
      return { text, charStart, charEnd: charStart + text.length, start, end };
    });
    if (!words.length) throw new Error(`No words found in sentence ${sentence.id}`);
    const start = words[0].start;
    const end = words[words.length-1].end;
    global += sentence.es.length + (i === sentences.length - 1 ? 0 : 1);
    return { ...sentence, audio: { start, end, words } };
  });
  const duration = Math.max(...alignment.character_end_times_seconds);
  return { sentences: updated, duration };
}

async function publish() {
  const id = process.argv.find(arg => arg.startsWith('--story='))?.split('=')[1];
  if (!id || !/^[a-z0-9-]+$/.test(id)) throw new Error('Provide an ID: npm run narrate -- --story=la-llave-azul');
  const dryRun = process.argv.includes('--dry-run');
  const key = process.env.ELEVENLABS_API_KEY;
  const voice = process.env.ELEVENLABS_VOICE_ID;
  const path = resolve(process.cwd(), 'content', 'stories', `${id}.json`);
  const raw = JSON.parse(await readFile(path, 'utf8'));
  const original = parseStory(raw);
  const text = narrationText(original);
  const cuesPath = resolve(process.cwd(), 'content', 'narration', `${id}.json`);
  const cues = parseNarrationCues(JSON.parse(await readFile(cuesPath, 'utf8')), original);
  const script = buildNarrationScript(original, cues);
  if (dryRun) { console.info(script); return; }
  if (!key || !voice) throw new Error('ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID must be set in the environment. The app works without them.');
  const model = process.env.ELEVENLABS_MODEL_ID || 'eleven_v4';
  if (Object.keys(cues.cues).length && !['eleven_v3', 'eleven_v4', 'eleven_v4_turbo'].includes(model)) throw new Error(`Emotive cues require ElevenLabs v3/v4, not ${model}`);
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}/with-timestamps?output_format=mp3_44100_128`;
  console.info(`Generating narration for ${id} (${text.length} clean characters, ${Object.keys(cues.cues).length} gentle cues)...`);
  const response = await fetch(url, { method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ text: script, model_id: model, language_code: 'es' }) });
  if (!response.ok) throw new Error(`ElevenLabs responded with ${response.status}: ${(await response.text()).slice(0, 350)}`);
  const payload = await response.json() as ElevenResponse;
  if (!payload.audio_base64 || !/^[A-Za-z0-9+/=\s]+$/.test(payload.audio_base64)) throw new Error('ElevenLabs returned no valid base64 audio.');
  const audio = Buffer.from(payload.audio_base64, 'base64');
  if (audio.length < 1000) throw new Error('Encoded audio is unexpectedly empty.');
  // ElevenLabs aligns delivery tags too. Remove only verified cue entries while preserving its clean-character timings.
  const taggedAlignment = requireAlignment(payload, script);
  const alignment = script === text ? taggedAlignment : removeCueTimings(taggedAlignment, script, text);
  const mapped = deriveTimings(original.sentences, alignment);
  const audioUrl = `/audio/${id}.mp3`;
  const updated = { ...raw, sentences: mapped.sentences, narration: { status: 'ready', audioUrl, durationSeconds: mapped.duration, alignment: 'words' } };
  parseStory(updated); // Reject invalid synchronization before writing anything.
  const outDir = resolve(process.cwd(), 'public/audio');
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, `${id}.mp3`), audio);
  await writeFile(path, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
  console.info(`Published ${audioUrl}, ${audio.length} bytes, ${mapped.sentences.length} synchronized sentences.`);
  console.info('Review the narration, run npm run validate:stories, and commit both the story JSON and MP3 together.');
}

if (process.argv[1]?.includes('publish-audio')) publish().catch(err => { console.error(err instanceof Error ? err.message : err); process.exitCode = 1; });
