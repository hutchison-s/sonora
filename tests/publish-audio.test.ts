import { describe, expect, it } from 'vitest';
import { removeCueTimings } from '@/scripts/publish-audio';

function alignmentFor(text: string) {
  return {
    characters: [...text],
    character_start_times_seconds: [...text].map((_, index) => index / 10),
    character_end_times_seconds: [...text].map((_, index) => (index + 1) / 10),
  };
}

describe('timestamped narration cues', () => {
  it('removes cue characters while retaining timings for clean Spanish', () => {
    const tagged = '[uneasy] Esa madrugada. [softly] Todo estaba quieto.';
    const clean = 'Esa madrugada. Todo estaba quieto.';
    const result = removeCueTimings(alignmentFor(tagged), tagged, clean);

    expect(result.characters.join('')).toBe(clean);
    expect(result.character_start_times_seconds[0]).toBe(0.9);
    expect(result.character_start_times_seconds[15]).toBe(3.3);
  });

  it('rejects any non-cue difference from the clean transcript', () => {
    const tagged = '[uneasy] Texto cambiado.';
    expect(() => removeCueTimings(alignmentFor(tagged), tagged, 'Texto limpio.')).toThrow(/differs from the clean transcript/);
  });
});
