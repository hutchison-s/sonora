# Authoring visual grammar content

## Files and validation

- `content/grammar/visuals.json`: versioned, data-only visual catalog. Existing `expanded-lessons.json` remains the teaching-text source; no migration of lesson prose or audio is required.
- `lib/grammar/visual-schema.ts`: authoritative Zod contract, inferred TypeScript types, and cross-field validation.
- `content/grammar/visuals.schema.json`: generated Draft 7 JSON Schema for content-generation tools. Run `npm run schema:grammar` after changing the Zod fields; a test prevents drift.
- `docs/grammar-visual-map.md`: the exact Build It placement and intended demonstration for all 37 lessons.

Run `npm test` and `npm run typecheck` after authoring. The production content loader validates the catalog before rendering. A build fails for invalid content instead of silently omitting a broken diagram.

## Shared envelope

The root is `{ "schemaVersion": 1, "lessons": { "existing-lesson-slug": [visual] } }`.

Every visual has:

| Field | Meaning |
|---|---|
| `id` | Stable ASCII identifier, unique within its lesson. |
| `kind` | `transformation`, `stress`, or `timeline`. This selects a reusable renderer. |
| `title` | A specific learner-facing heading. |
| `goal` | The one change or relationship this demonstration explains. |
| `afterBuildStep` | One-based index in the existing lesson's `build` array. Must reference a real step. |
| `scenarios` | One or more selectable examples. Each has a stable `id`, visible `label`, and 2–8 `frames`. |

Every frame has `label`, `spanish`, `english`, and `explanation`. The initial view shows the last frame as a useful completed example. **Show me how** goes to the first frame; **Back**, **Next step**, and **Replay** are explicit controls. Changing examples resets to the finished view. No frame advances automatically.

Fields are plain text, not HTML, CSS, scripts or Markdown. React renders them as escaped text. Unknown fields and tool types are rejected. Keep explanations concise and give a translation or a meaningful description for an isolated building piece. An intermediate stem such as `habl` must be explicitly described as a fragment, not presented as a usable sentence.

## Tool-specific fields

### Transformation

Each frame supplies `tokens`, in reading order. Each token has:

- `id`: identity of the same moving/changing piece across frames. Keep `object` stable when moving an object pronoun. Keep `ending` stable when replacing a verb ending. IDs must be unique within a frame.
- `text`: actual Spanish text. Punctuation belongs in the text too.
- `role`: `plain`, `stem`, `ending`, `subject`, `mark`, or `focus`. The role adds visual emphasis; explanations must state the actual grammatical relationship. Do not label an object or experiencer as a subject.
- Optional `joinLeft: true`: attach without a space to the preceding piece. Use for an ending or closing punctuation; omit for separate words. Joined fragments stay together as one word when wrapping.

The validator joins tokens with spaces except where `joinLeft` is true and requires the result to equal `spanish` exactly. This prevents the diagram and accessible text from disagreeing.

Example (a complete catalog fragment):

```json
{
  "schemaVersion": 1,
  "lessons": {
    "questions": [{
      "id": "question-frame",
      "kind": "transformation",
      "title": "Frame the question",
      "goal": "Add both question marks while keeping the words.",
      "afterBuildStep": 1,
      "scenarios": [{
        "id": "hablar",
        "label": "Hablas español",
        "frames": [{
          "label": "A statement",
          "spanish": "Hablas español.",
          "english": "You speak Spanish.",
          "explanation": "The words state something.",
          "tokens": [
            {"id": "verb", "text": "Hablas", "role": "plain"},
            {"id": "object", "text": "español", "role": "plain"},
            {"id": "close", "text": ".", "role": "mark", "joinLeft": true}
          ]
        }, {
          "label": "A question",
          "spanish": "¿Hablas español?",
          "english": "Do you speak Spanish?",
          "explanation": "Add both marks without adding an English-style helper verb.",
          "tokens": [
            {"id": "open", "text": "¿", "role": "mark"},
            {"id": "verb", "text": "Hablas", "role": "plain", "joinLeft": true},
            {"id": "object", "text": "español", "role": "plain"},
            {"id": "close", "text": "?", "role": "mark", "joinLeft": true}
          ]
        }]
      }]
    }]
  }
}
```

### Stress

Each frame supplies `syllables`: `{ id, text, stressed }`. Exactly one syllable must be stressed, IDs must be unique in each frame, and concatenating the syllable text must equal `spanish` exactly. Include accents in the actual text. The display enlarges and underlines the prominent syllable, labels stressed/unstressed, and keeps a full-word accessible equivalent.

Use valid contrasting forms such as `hablo` → `habló`; do not imply that adding an accent is freely interchangeable or that it only changes loudness. A spelling diagram does not replace audio or physical pronunciation coaching.

### Timeline

The visual additionally needs `axisStart` and `axisEnd`. Each frame supplies `lanes`: `{ id, label, start, end, kind }`. Coordinates are percentages from 0 to 100. Use `kind: "interval"` for a background span and `kind: "event"` for a completed-event marker with equal start/end. Reversed intervals are rejected.

Label these as scene sketches, not quantitative durations. The visible edges of a background span are the illustrated scene window, not necessarily the actual start or end of the action. The caption and accessible lane labels must preserve that distinction.

## Prompt for generating additional content

Supply the target lesson ID and its current numbered Build It steps, this guide, and `visuals.schema.json` to the generation tool. Ask:

> Return a JSON catalog with schemaVersion 1 and only the requested existing lesson keys. Select the appropriate supported kind. Teach one specific relationship per visual and attach it after the Build It step that introduces it. Supply valid Spanish, accurate English, short explanations, and at least two deliberate frames. Keep stable token IDs when moving or changing the same piece. Make token spacing and syllable segmentation reconstruct the exact Spanish text. Use plain text only. Treat grammatical defaults as defaults, explain fragments as fragments, and do not invent audio, timing, executable fields, HTML, or unsupported tool kinds. The final frame must be a useful completed example. Return JSON only.

Review language accuracy and the teaching sequence before merging the result into the catalog. JSON Schema checks structure; `parseGrammarVisuals` additionally checks references, duplicate identities, reconstructed text, stress and timeline relationships. Neither validator can prove a grammatical explanation is correct.

## Extending tools

Add a new discriminant and typed payload to the Zod union, implement its renderer with the same learner-controlled controls and accessible textual equivalent, export JSON Schema again, and add validation and interaction coverage. Existing visual entries need no code changes to add scenarios or steps within the supported tools.

Reduced-motion preference removes animation duration while preserving every step, caption and control. Existing sentence audio is untouched; diagrams do not generate speech or request new recordings.
