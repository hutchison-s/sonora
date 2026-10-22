import { z } from 'zod';
import type { Annotation, Story, StorySentence } from '@/lib/types/story';

const wordSchema = z.object({ text: z.string().min(1), start: z.number().nonnegative(), end: z.number().positive(), charStart: z.number().int().nonnegative(), charEnd: z.number().int().positive() }).strict();
const grammarSchema = z.object({
  infinitive: z.string().optional(), tense: z.string().optional(), mood: z.string().optional(),
  person: z.string().optional(), structure: z.string().optional(), pronouns: z.string().optional(),
  breakdown: z.array(z.object({ part: z.string(), explanation: z.string() }).strict()).optional(),
  examples: z.array(z.object({ es: z.string(), en: z.string() }).strict()).optional(),
}).strict();
const annotationSchema = z.object({
  id: z.string().min(1), text: z.string().min(1), type: z.enum(['grammar', 'vocabulary', 'expression', 'culture']),
  meaning: z.string().min(1), explanation: z.string().min(1), grammar: grammarSchema.optional(),
  tip: z.string().optional(), occurrence: z.number().int().nonnegative().optional(),
  start: z.number().int().nonnegative().optional(), end: z.number().int().positive().optional(),
}).strict();
const sentenceSchema = z.object({
  id: z.string().min(1), es: z.string().min(1), en: z.string().min(1),
  annotations: z.array(annotationSchema),
  audio: z.object({ start: z.number().nonnegative(), end: z.number().positive(), words: z.array(wordSchema) }).strict().nullable(),
}).strict();
const unavailableSchema = z.object({ status: z.literal('unavailable'), audioUrl: z.null(), durationSeconds: z.null(), alignment: z.literal('none') }).strict();
const readySchema = z.object({ status: z.literal('ready'), audioUrl: z.string().startsWith('/audio/'), durationSeconds: z.number().positive(), alignment: z.enum(['words', 'sentences']) }).strict();
const questionSchema = z.object({ question: z.string().min(1), options: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]), correctIndex: z.union([z.literal(0), z.literal(1), z.literal(2)]), explanation: z.string().min(1) }).strict();
export const storySchema = z.object({
  schemaVersion: z.literal(1), id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.object({ es: z.string().min(1), en: z.string().min(1) }).strict(),
  level: z.enum(['A1', 'A2', 'B1', 'B2']), dialect: z.string().min(1), genre: z.string().min(1),
  synopsis: z.string().min(1), series: z.string().nullable(), episode: z.number().int().positive().nullable(),
  grammarFocus: z.string().min(1), secondaryGrammar: z.array(z.string()),
  estimatedDurationSeconds: z.number().int().positive(), wordCount: z.number().int().positive(),
  coverImagePrompt: z.string().min(1), coverImage: z.string().startsWith('/images/'),
  sentences: z.array(sentenceSchema).min(1), comprehension: z.tuple([questionSchema, questionSchema, questionSchema]),
  narration: z.union([readySchema, unavailableSchema]),
}).strict();

// Editorial offsets are Unicode JS string indices, matching String.slice in the browser.
// Repeated phrase text must specify occurrence or exact start/end to avoid accidentally explaining the wrong phrase.
export function resolveAnnotation(sentence: string, annotation: Annotation): Annotation {
  const matches: number[] = [];
  let from = 0;
  while (from <= sentence.length - annotation.text.length) {
    const idx = sentence.indexOf(annotation.text, from);
    if (idx < 0) break;
    matches.push(idx);
    from = idx + 1;
  }
  let start: number;
  if (annotation.start !== undefined || annotation.end !== undefined) {
    if (annotation.start === undefined || annotation.end === undefined) throw new Error(`Both offsets required: ${annotation.id}`);
    start = annotation.start;
    if (annotation.end !== start + annotation.text.length || sentence.slice(start, annotation.end) !== annotation.text) throw new Error(`Invalid offsets for ${annotation.id}: '${annotation.text}'`);
  } else if (annotation.occurrence !== undefined) {
    const matched = matches[annotation.occurrence];
    if (matched === undefined) throw new Error(`Occurrence out of range for ${annotation.id}`);
    start = matched;
  } else {
    if (matches.length !== 1) throw new Error(`Ambiguous or missing '${annotation.text}' for ${annotation.id}: found ${matches.length} matches; specify occurrence or offsets`);
    start = matches[0];
  }
  const end = start + annotation.text.length;
  if (start > 0 && /[\p{L}\p{N}]/u.test(sentence[start - 1]) && /[\p{L}\p{N}]/u.test(sentence[start])) throw new Error(`Annotation ${annotation.id} starts inside word`);
  if (end < sentence.length && /[\p{L}\p{N}]/u.test(sentence[end - 1]) && /[\p{L}\p{N}]/u.test(sentence[end])) throw new Error(`Annotation ${annotation.id} ends inside word`);
  return { ...annotation, start, end };
}

export function resolveSentence(sentence: StorySentence): StorySentence {
  const annotations = sentence.annotations.map(a => resolveAnnotation(sentence.es, a));
  const ordered = [...annotations].sort((a, b) => a.start! - b.start!);
  for (let i = 1; i < ordered.length; i++) {
    if (ordered[i].start! < ordered[i - 1].end!) throw new Error(`Overlapping annotations in sentence '${sentence.id}': ${ordered[i - 1].id} and ${ordered[i].id}`);
  }
  return { ...sentence, annotations };
}

export function parseStory(input: unknown): Story {
  const data = storySchema.parse(input);
  const sentences = data.sentences.map(s => resolveSentence(s));
  const sentenceIds = new Set<string>();
  const annotationIds = new Set<string>();
  let prevSentenceEnd = 0;
  const ready = data.narration.status === 'ready';
  let timedWords = 0;
  for (const sentence of sentences) {
    if (sentenceIds.has(sentence.id)) throw new Error(`${data.id}: duplicate sentence id ${sentence.id}`);
    sentenceIds.add(sentence.id);
    for (const annotation of sentence.annotations) {
      if (annotationIds.has(annotation.id)) throw new Error(`${data.id}: duplicate annotation id ${annotation.id}`);
      annotationIds.add(annotation.id);
    }
    if (!ready && sentence.audio !== null) throw new Error(`${data.id}: unavailable narration must not contain invented timestamps`);
    if (sentence.audio) {
      const audio = sentence.audio;
      if (data.narration.status === 'ready' && data.narration.alignment === 'words') {
        const expectedTokens = [...sentence.es.matchAll(/\S+/gu)];
        if (expectedTokens.length !== audio.words.length || expectedTokens.some((token, i) => token[0] !== audio.words[i]?.text || token.index !== audio.words[i]?.charStart)) {
          throw new Error(`${data.id}/${sentence.id}: word alignment must cover every narrated word`);
        }
      }
      if (audio.start < prevSentenceEnd - 0.0001 || audio.end <= audio.start) throw new Error(`${data.id}/${sentence.id}: invalid sentence timing order`);
      const duration = data.narration.durationSeconds;

      if (ready && duration !== null && audio.end > duration + 0.025) {
        throw new Error(
          `${data.id}/${sentence.id}: timing exceeds audio duration`
        );
      }
      prevSentenceEnd = audio.end;
      let prevWordEnd = audio.start;
      let prevCharEnd = 0;
      for (const word of audio.words) {
        if (word.start < prevWordEnd - 0.0001 || word.end <= word.start || word.end > audio.end + 0.025) throw new Error(`${data.id}/${sentence.id}: invalid word timing for ${word.text}`);
        if (word.charStart < prevCharEnd || word.charEnd > sentence.es.length || sentence.es.slice(word.charStart, word.charEnd) !== word.text) throw new Error(`${data.id}/${sentence.id}: invalid word character offsets for ${word.text}`);
        prevWordEnd = word.end;
        prevCharEnd = word.charEnd;
        timedWords++;
      }
    }
  }
  if (ready && sentences.some(s => s.audio === null)) throw new Error(`${data.id}: ready narration requires every sentence timed`);
  if (ready && data.narration.alignment === 'words' && timedWords === 0) throw new Error(`${data.id}: word alignment declared but missing`);
  if (ready && data.narration.alignment === 'sentences' && timedWords > 0) throw new Error(`${data.id}: sentence alignment declared but word timestamps present`);
  const actualCount = sentences.reduce((n, s) => n + (s.es.match(/\S+/g)?.length ?? 0), 0);
  if (actualCount !== data.wordCount) throw new Error(`${data.id}: word count ${data.wordCount} != actual ${actualCount}`);
  return { ...data, sentences };
}

export function parseStories(input: unknown[]): Story[] {
  const stories = input.map(parseStory);
  const ids = new Set<string>();
  for (const story of stories) {
    if (ids.has(story.id)) throw new Error(`Duplicate story id: ${story.id}`);
    ids.add(story.id);
  }
  return stories;
}
