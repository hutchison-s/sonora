import { z } from 'zod';
import type { Story } from '../types/story';

// Directions are editorial metadata, never learner-visible transcript text.
const allowed = ['curious', 'warmly', 'softly', 'quietly', 'uneasy', 'thoughtful', 'concerned', 'disappointed', 'reassuringly', 'lightly amused'] as const;
const cueSchema = z.object({ storyId: z.string(), cues: z.record(z.enum(allowed)) }).strict();
export type NarrationCues = z.infer<typeof cueSchema>;

export function parseNarrationCues(input: unknown, story: Story): NarrationCues {
  const result = cueSchema.parse(input);
  if (result.storyId !== story.id) throw new Error(`Narration cues storyId mismatch: ${result.storyId} vs ${story.id}`);
  const ids = new Set(story.sentences.map(s => s.id));
  const entries = Object.entries(result.cues);
  for (const [id] of entries) if (!ids.has(id)) throw new Error(`Unknown sentence for narration cue: ${story.id}/${id}`);
  if (entries.length > Math.ceil(story.sentences.length / 4)) throw new Error(`${story.id}: too many emotional cues; keep delivery understated`);
  return result;
}

export function buildNarrationScript(story: Story, data: NarrationCues): string {
  return story.sentences.map(s => `${data.cues[s.id] ? `[${data.cues[s.id]}] ` : ''}${s.es}`).join(' ');
}
