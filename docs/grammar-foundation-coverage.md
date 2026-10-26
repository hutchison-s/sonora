# Grammar foundation gap coverage

This expansion addresses the reading-focused audit and the follow-up on tilde, stress and emphasis. It adds 26 lessons (63 total), updates 10 existing lessons or their related-reading routes, and supplies 64 visual walkthroughs across all 63 lessons. Every new lesson follows the eight-section teaching format, with four worked examples and three explained practice prompts.

## New lessons

| Lesson | Level | Reading skill | Exact story reference |
|---|---|---|---|
| Read Spanish Letter Combinations (`letter-combinations`) | A1 | Recognize common consonant spellings in the stories, including ll. | la-llave-azul / s2: llave |
| Find the Beat in a Word (`syllables`) | A1 | Divide common words into syllables and distinguish syllable boundaries from word stress. | la-llave-azul / s1: edificio |
| When Vowels Meet (`vowel-combinations`) | A2 | Recognize common diphthongs and explain the accents in día and río. | el-mapa-en-la-pared / s6: río |
| Put the Focus Where You Mean It (`sentence-emphasis`) | A2 | Distinguish lexical stress, written accents and conversational emphasis. | un-mensaje-equivocado / s9: soy Nico |
| Find Your Way Through a Sentence (`location-prepositions`) | A1 | Read basic location and movement phrases, including multiword prepositions. | el-mapa-en-la-pared / s3: debajo del mapa |
| Place Events in Time (`time-prepositions`) | A1 | Use common time phrases and connect an action to before or after another. | un-mensaje-equivocado / s6: A las doce |
| Who Receives It? (`indirect-objects`) | A1 | Identify recipients and choose me, te, le, nos or les. | la-mesa-para-dos / s4: le ofrece |
| Put the Pronouns Together (`pronoun-combinations`) | A2 | Build combinations such as me lo and se la and place them with a verb. | Curricular foundation; no exact occurrence claimed in the current stories |
| Recognize Verbs That Change Inside (`irregular-present`) | A1 | Recognize common stem changes and irregular yo forms in the present. | el-ultimo-cafe / s8: quiere volver |
| Recognize Unexpected Past Forms (`irregular-preterite`) | A2 | Read frequent irregular preterites and distinguish stem changes from spelling changes. | el-tren-de-las-seis / s6: dijo |
| Point to This, That, and the Other One (`demonstratives`) | A1 | Match demonstratives to nouns and recover omitted nouns from context. | un-mensaje-equivocado / s3: ese número |
| Describe the Person or Thing You Mean (`relative-clauses`) | A2 | Identify an antecedent and bracket its attached relative clause. | cuando-volvio-la-luz / s9: que sostenía una vela |
| Read What Someone Says or Thinks (`content-clauses`) | A2 | Distinguish content clauses, indirect questions and relative descriptions. | la-mesa-para-dos / s5: que espera a alguien |
| Recognize Actions Turned into Forms (`participles`) | A2 | Form common participles and decide whether agreement is required. | cuando-volvio-la-luz / s20: escrito a mano |
| Connect a Past Event to Now (`present-perfect`) | A2 | Recognize and form haber + participle without treating English tense choices as exact rules. | Curricular foundation; no exact occurrence claimed in the current stories |
| Go Back Before the Story’s Past (`pluperfect`) | B1 | Recognize the earlier past and track its relationship to the story’s reference point. | la-habitacion-doce / s2: Había viajado |
| Watch an Action Unfold (`progressive`) | A2 | Form common gerunds and interpret present and past progressive constructions. | cuando-volvio-la-luz / s2: estaba preparando |
| Read Two Verbs as One Pattern (`verb-patterns`) | A2 | Decode frequent infinitive patterns found in the stories. | cuando-volvio-la-luz / s2: dejó de funcionar |
| Measure Time from the Right Moment (`duration`) | B1 | Use desde, hace and llevar to locate a situation in time. | cuando-volvio-la-luz / s6: desde hacía ocho años |
| Follow Words Retold by Someone Else (`reported-speech`) | B1 | Read statements and questions reported from a past viewpoint. | la-habitacion-doce / s16: Le explicó que |
| Recognize Wishes and Requests in the Past (`past-subjunctive`) | B1 | Form common -ra forms and relate them to a past governing verb. | cuando-volvio-la-luz / s3: regresara |
| Wait Until It Happens (`subjunctive-time`) | B1 | Compare factual and anticipated time clauses, including before and until. | las-marcas-del-agua / s6: hasta que entiendas |
| After a Preposition: Mí, Ti, Él (`prepositional-pronouns`) | A2 | Choose common prepositional pronouns and distinguish them from possessives and object pronouns. | el-ultimo-cafe / s6: para mí |
| Follow the Thread of a Story (`narrative-connectors`) | A2 | Use narrative markers to track sequence and expectations. | cuando-volvio-la-luz / s16: sin embargo |
| When Se Does More Than Mean Self (`pronominal-verbs`) | A2 | Distinguish reflexive actions, lexical pronominal verbs and common changes of state. | la-llave-azul / s7: se llama |
| Read Some, Every, Another, and None (`quantifiers`) | A2 | Read common quantifiers and recognize noun omission in story references. | el-mapa-en-la-pared / s12: la otra |

## Existing foundations updated

- Letters now explicitly teaches ll/ch and links to common spelling patterns; an additional ll walkthrough is placed in the original overview.
- Stress now starts with syllables and distinguishes spoken stress from written marks and sentence emphasis.
- Accent marks now explains agudas, llanas, esdrújulas, written tilde, hiatus and diacritic accents; existing slugs and recorded examples remain stable.
- Direct objects includes me/te/nos/os and contrasts direct versus indirect roles.
- Possessives teaches standalone mío/mía and agreement with an understood noun.
- Word order teaches sentence unpacking, personal a and postverbal subjects.
- Vowels, reflexives, subjunctive and connectors link to the new focused follow-ups.

## Connection to stories

`content/grammar/readings.json` contains 30 curated references with exact story/sentence IDs and focus text. Where an existing annotation covers that focus, the phrase sheet links to the relevant lesson. Lesson pages display the source sentence and link back to the story. This is an incremental bridge, not automatic annotation of every grammar structure. No story text, annotation offsets, translations or audio timing were rewritten.

The present-perfect and pronoun-combination lessons are necessary foundations without a fabricated direct story occurrence. Their related-lesson links provide the learning connection.

## Audio and validation

Original catalog examples retain their 77 recorded sentence/path pairs. New examples are text-only, without fake audio paths or speaker buttons. The audio publisher skips text-only entries; a future reviewed recording pass can assign and publish their paths. No ElevenLabs calls are made by this change.

Production loaders validate catalog/expanded parity, categories, related lessons and exact source references. JSON Schemas for catalog, expanded content and source references are generated from Zod with `npm run schema:lessons`. `npm run validate:grammar` also checks visual presence and referenced media assets. The visual schema remains compatible with the previous version.

Levels are editorial learning targets, not a claim of full CEFR certification coverage. Further B2 expansion can deepen concessive/relative mood choices and passive constructions beyond the foundations and optional notes included here.
