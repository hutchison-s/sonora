# Sonora

**Understand the language. Find your voice.** A mobile-first, editorial Spanish story-reading app made with Next.js App Router, TypeScript, Tailwind, Zod, and accessible Radix primitives.

## Getting started

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run validate:stories
npm run dev
```

Open **http://localhost:3000**. For an optimized build:

```bash
npm run build
npm start
```

Deploy to **Vercel** by importing the repository and using default Next.js build settings. No database, login, API keys, or service configuration is necessary. Images are local SVG art; all six stories are self-contained JSON files.

## What works

- Browse six original short stories (two each at A1, A2, B1) and filter by CEFR level.
- Read Spanish sentences; reveal or hide full-sentence natural English translations.
- Tap annotated words or phrases to open an accessible bottom sheet (mobile) or dialog (desktop) with meaning, grammar, examples (when authored), and a save action.
- Review saved phrases, resume the most recently opened story, and see completion and listening progress in the learner profile.
- Answer three optional comprehension questions per story; skipping is allowed and completion persists locally.
- Play **real prerecorded narration** with HTMLAudioElement, seek, choose speed, replay a sentence, and highlight words based on validated timestamp alignment **when a story has published narration**.

**Audio availability:** The six seed stories deliberately ship in **text-only mode**. This is not a simulated voice demo. Their JSON `narration.status` is `unavailable`, they contain no timestamps, and the Listen action is visibly disabled. Use the optional publisher below to produce and enable narration with actual word timestamps.

## Optional ElevenLabs publishing

1. Create an ElevenLabs API key and choose a Spanish-speaking voice ID.
2. Set environment variables (see `.env.example`) in your terminal; do not use a `NEXT_PUBLIC_` prefix. No application runtime needs this key.
3. Run:

```bash
ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... npm run narrate -- --story=la-llave-azul
npm run validate:stories
```

The script validates the source story, joins its Spanish sentences into an exact narrated string, calls ElevenLabs' `/with-timestamps` endpoint, verifies character alignment, maps each recorded word and sentence, validates the updated story, then writes `public/audio/<id>.mp3` and updates the source JSON. It refuses unexpected text normalization, missing arrays, invalid timings, and failed HTTP responses rather than inventing alignment. **Preview audio and inspect word alignment after publishing**; TTS timing is not a guarantee of perfect pronunciation. Commit the JSON and audio file together.

Published files are static. Sonora makes **no** browser-side ElevenLabs requests.

## Content editing

Each `content/stories/*.json` story follows `lib/content/schema.ts`, including title, CEFR level, sentence-aligned English translations, annotations, comprehension questions, and narration metadata. `lib/content/stories.ts` imports and validates all JSON at module initialization. `npm run validate:stories` validates every story and referenced media asset before production builds.

Annotations are never located by a guessed substring at render time. A unique phrase is resolved to a deterministic UTF-16 character offset; repeated phrases must supply an `occurrence` or explicit `start`/`end` offsets. Overlapping annotation hit targets are rejected. Audio word offsets are also validated against the exact Spanish sentence.

Do not regenerate authored seed stories without reviewing translations and explanations.

## Local data

`lib/progress/storage.ts` owns the versioned localStorage format (`sonora:progress`) and validation/migration entry point. Saved progress belongs to the browser/device, not an account. Clearing browser storage deletes progress. The profile counts completed stories and recorded listening time only; it does not assert proficiency.

## Testing

```bash
npm run typecheck
npm test
npx playwright install chromium   # first time only
npx playwright test
```

Unit tests cover editorial validation, audio timing, storage, scoring, and speed controls. The Playwright suite exercises reading and persistence on an iPhone-sized viewport. Tests involving actual narration should use a real published audio asset; none is bundled with this seed content.

## Layout

- `app/`: home, reader route, profile, saved phrases
- `components/`: library, story, phrase-insights, audio, navigation
- `content/stories/`: versioned JSON narratives
- `lib/content/`: Zod validation, annotation resolution, loaders
- `lib/audio/`: timestamp lookup and seeking functions
- `lib/progress/`: validated localStorage persistence
- `scripts/`: optional offline narration publishing and content validation
- `tests/`: unit and mobile browser tests

## Design approach

Dark charcoal, warm ivory, amber controls, sea-glass secondary accents, generous serif narrative typography, image-led discovery, and an unobtrusive reading toolbar. All gallery studios besides the Story Room are explicitly labeled upcoming.
