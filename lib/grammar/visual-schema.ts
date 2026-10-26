import { z } from 'zod';

const text = z.string().trim().min(1).max(600);
const id = z.string().regex(/^[a-z][a-z0-9-]*$/);
const token = z.object({
 id, text: z.string().min(1).max(80),
 role: z.enum(['plain', 'stem', 'ending', 'subject', 'mark', 'focus']),
 joinLeft: z.boolean().optional(),
}).strict();
const frameBase = { label: text, explanation: text, spanish: text, english: text };
const tokenFrame = z.object({ ...frameBase, tokens: z.array(token).min(1).max(24) }).strict();
const stressFrame = z.object({
 ...frameBase,
 syllables: z.array(z.object({ id, text: z.string().min(1).max(40), stressed: z.boolean() }).strict()).min(1).max(12),
}).strict();
const timelineFrame = z.object({
 ...frameBase,
 lanes: z.array(z.object({
  id, label: text, start: z.number().min(0).max(100), end: z.number().min(0).max(100),
  kind: z.enum(['interval', 'event']),
 }).strict()).min(1).max(4),
}).strict();
const common = {
 id, title: text, goal: text,
 afterBuildStep: z.number().int().min(1),
};
const scenario = <T extends z.ZodTypeAny>(frame: T) => z.object({
 id, label: text, frames: z.array(frame).min(2).max(8),
}).strict();

/** Extend the discriminated union when adding a new teaching tool. No HTML or executable content. */
export const grammarVisualSchema = z.discriminatedUnion('kind', [
 z.object({ ...common, kind: z.literal('transformation'), scenarios: z.array(scenario(tokenFrame)).min(1).max(8) }).strict(),
 z.object({ ...common, kind: z.literal('stress'), scenarios: z.array(scenario(stressFrame)).min(1).max(8) }).strict(),
 z.object({ ...common, kind: z.literal('timeline'), axisStart: text, axisEnd: text, scenarios: z.array(scenario(timelineFrame)).min(1).max(8) }).strict(),
]);
export const grammarVisualCatalogSchema = z.object({
 schemaVersion: z.literal(1),
 lessons: z.record(id, z.array(grammarVisualSchema).max(4)),
}).strict();
export type GrammarVisual = z.infer<typeof grammarVisualSchema>;
export type GrammarVisualCatalog = z.infer<typeof grammarVisualCatalogSchema>;

const unique = (ids: string[], context: string) => {
 if (new Set(ids).size !== ids.length) throw new Error(`Duplicate visual ID in ${context}`);
};

/** Validate relationships that cannot be expressed by field types/JSON Schema alone. */
export function parseGrammarVisuals(input: unknown, buildSteps: Record<string, number>): GrammarVisualCatalog {
 const result = grammarVisualCatalogSchema.parse(input);
 for (const [lessonId, visuals] of Object.entries(result.lessons)) {
  if (!(lessonId in buildSteps)) throw new Error(`Unknown lesson: ${lessonId}`);
  unique(visuals.map(v => v.id), lessonId);
  for (const visual of visuals) {
   if (visual.afterBuildStep > buildSteps[lessonId]) throw new Error(`Invalid build step: ${lessonId}/${visual.id}`);
   unique(visual.scenarios.map(s => s.id), visual.id);
   for (const sample of visual.scenarios) {
    for (const frame of sample.frames) {
     if ('tokens' in frame) {
      unique(frame.tokens.map(t => t.id), `${visual.id}/${sample.id}`);
      const sentence = frame.tokens.map((t, i) => `${i && !t.joinLeft ? ' ' : ''}${t.text}`).join('');
      if (sentence !== frame.spanish) throw new Error(`Tokens do not match Spanish: ${visual.id}/${sample.id}/${frame.label}`);
     }
     if ('syllables' in frame) {
      unique(frame.syllables.map(s => s.id), visual.id);
      if (frame.syllables.filter(s => s.stressed).length !== 1) throw new Error(`Exactly one stressed syllable required: ${visual.id}`);
      if (frame.syllables.map(s => s.text).join('') !== frame.spanish) throw new Error(`Syllables do not match Spanish: ${visual.id}`);
     }
     if ('lanes' in frame) {
      unique(frame.lanes.map(l => l.id), visual.id);
      for (const lane of frame.lanes) {
       if (lane.end < lane.start || (lane.kind === 'event' && lane.start !== lane.end)) throw new Error(`Invalid timeline range: ${visual.id}`);
      }
     }
    }
   }
  }
 }
 return result;
}
