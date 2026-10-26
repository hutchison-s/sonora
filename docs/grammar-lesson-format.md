# Grammar lesson format

Every published lesson has a matching entry in `content/grammar/expanded-lessons.json`. The original catalog remains the source for slugs, levels, categories, vocabulary, and recorded examples; expanding content must not change a recording's sentence or path.

## Teaching sequence

- **The Big Idea** (`bigIdea`, `goal`): explain the concept and the learner's intended skill.
- **Build It** (`build`): teach the steps, with descriptive, topic-specific subtitles.
- **See It Work** (`extraExamples` plus catalog examples): vary the situation and explain how the pattern applies. Existing examples retain audio. Additional examples are text-only until separately recorded.
- **Spot the Difference** (`contrast`): compare two examples chosen to isolate a meaningful difference. Include translations and explain the consequence of the change.
- **A Closer Look** (`closerLook`): optional, expandable notes for qualifications, exceptions, and related constructions.
- **Watch Your Step** (`mistakes`): show a misleading form or shortcut, its correction, and the reason. Label qualified examples clearly rather than claiming a valid construction is universally wrong.
- **Make It Yours** (`practice`): three short applications with answers and reasoning hidden until requested. Accept valid alternatives where relevant.
- **Take It With You** (`takeaways`): short reminders that support applying the rule to an unfamiliar sentence.

Use plain English, preserve Spanish accents, and distinguish useful defaults from absolute rules. Regional forms should be described as variants rather than errors. Each lesson needs its own explanations and deliberate examples; shared headings are a navigation convention, not reusable filler.

## Validation

`npm test` checks coverage, content structure, practice prompts, and availability of original MP3 files. `npm run build` statically generates the lesson routes. `npx playwright test tests/e2e/grammar.spec.ts` checks the lesson reading interactions, playback request, anchors, and every route at desktop and mobile widths. The Playwright checks require its Chromium browser installation.

## Visual teaching tools

Build It can embed a content-fed walkthrough after any teaching step. See [the lesson-by-lesson visual map](grammar-visual-map.md) for placements and [the visual authoring contract](grammar-visual-authoring.md) for data fields, generation prompts, validation and extension guidance. `content/grammar/visuals.schema.json` is the portable JSON Schema; regenerate it with `npm run schema:grammar` after changing the authoritative Zod contract.
