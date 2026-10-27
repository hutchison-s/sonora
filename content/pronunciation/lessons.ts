export const rLesson = {
  id: 'r',
  title: 'One tap or a trill?',
  contrast: [{ word: 'pero', description: 'but · one tap' }, { word: 'perro', description: 'dog · trill' }],
  note: 'Between vowels, a single r is usually a tap; rr is a trill. A word-initial r is also a strong sound.',
  grammarPath: '/grammar/rr',
  grammarLabel: 'Explore the two r sounds in Grammar Studio',
  summary: 'Hear and practice the two Spanish r sounds in complete sentences.',
  cues: [
    { title: 'Make a quick tap', text: 'Touch the tip of your tongue briefly to the ridge just behind your upper front teeth. The middle sound in American English “butter” can be a starting point.' },
    { title: 'Try the trill', text: 'Keep the tongue tip relaxed near the same ridge and let airflow make it vibrate. It can take time to learn; avoid forcing it.' },
  ],
  examples: [
    { id: 'rr-02', spanish: 'Quiero pero no puedo.', english: 'I want to, but I cannot.', hint: 'Listen for the quick taps in quiero and pero.', audio: '/audio/grammar/rr/02.mp3' },
    { id: 'rr-01', spanish: 'El perro corre.', english: 'The dog runs.', hint: 'Listen for the longer vibration in perro and corre.', audio: '/audio/grammar/rr/01.mp3' },
    { id: 'rr-03', spanish: 'El coche es caro.', english: 'The car is expensive.', hint: 'Listen for the single tap between the vowels in caro.', audio: '/audio/grammar/rr/03.mp3' },
    { id: 'rr-04', spanish: 'El carro es rojo.', english: 'The car is red.', hint: 'Listen for the trill in carro and the strong r at the start of rojo.', audio: '/audio/grammar/rr/04.mp3' },
  ],
} as const;

export const vowelLesson = {
  id: 'vowels',
  title: 'The five clear vowels',
  summary: 'Notice and practice the five Spanish vowel sounds in complete sentences.',
  contrast: [
    { word: 'a', description: 'Open your mouth: casa' },
    { word: 'e', description: 'Mid-open, lips relaxed: mesa' },
    { word: 'i', description: 'Tongue high and forward: libro' },
    { word: 'o', description: 'Mid-high, rounded lips: tomo' },
    { word: 'u', description: 'Tongue high, rounded lips: luna' },
  ],
  note: 'Spanish vowels generally stay steady. Listen for a clear vowel rather than adding a glide at the end; sounds vary somewhat with context and region.',
  grammarPath: '/grammar/vowels',
  grammarLabel: 'Explore Spanish vowels in Grammar Studio',
  cues: [
    { title: 'Open and relaxed: a', text: 'Open your jaw comfortably and keep your tongue low. Try the a in casa without adding another sound.' },
    { title: 'Forward: e and i', text: 'For e, keep your tongue toward the front and your mouth mid-open. For i, raise the tongue and bring the lips slightly wider.' },
    { title: 'Round: o and u', text: 'Round your lips for both. For u, raise the back of your tongue and round a little more than for o.' },
    { title: 'Keep the sound steady', text: 'Listen for a consistent vowel from beginning to end. Unstressed vowels generally stay clear instead of becoming an English-like “uh.”' },
  ],
  examples: [
    { id: 'vowels-01', spanish: 'Mi casa es pequeña.', english: 'My house is small.', hint: 'Listen for the clear a sounds in casa, and the e sounds in pequeña.', audio: '/audio/grammar/vowels/01.mp3' },
    { id: 'vowels-02', spanish: 'La luna ilumina el patio.', english: 'The moon lights up the patio.', hint: 'Listen for the rounded u in luna and the clear i in ilumina.', audio: '/audio/grammar/vowels/02.mp3' },
    { id: 'vowels-03', spanish: 'No tomo café.', english: 'I do not drink coffee.', hint: 'Listen for the steady o in no and tomo, and the stressed e in café.', audio: '/audio/grammar/vowels/03.mp3' },
    { id: 'vowels-04', spanish: 'Tu libro está aquí.', english: 'Your book is here.', hint: 'Listen for the u in tu and the i in libro and aquí.', audio: '/audio/grammar/vowels/04.mp3' },
  ],
} as const;

export const tLesson = {
  id: 't', title: 'A dental T',
  summary: 'Move the tongue forward for a crisp Spanish t.',
  contrast: [{ word: 't', description: 'Tongue at the upper teeth' }, { word: 'tú', description: 'you · a clear, unaspirated t' }],
  note: 'Spanish t is generally dental: the tongue touches the upper teeth. English t is often made farther back at the ridge and can release a puff of air, especially at the start of a stressed syllable.',
  grammarPath: '/grammar/alphabet', grammarLabel: 'Explore Spanish letters in Grammar Studio',
  cues: [
    { title: 'Move forward', text: 'Place the tip or blade of your tongue against the back of your upper front teeth, rather than farther back on the ridge used for English t.' },
    { title: 'Release gently', text: 'Briefly stop the airflow, then release it without the strong puff common in English “top.” Try holding a hand in front of your mouth to notice the difference.' },
  ],
  examples: [
    { id: 't-01', spanish: 'Tú tienes tu libro.', english: 'You have your book.', hint: 'Listen for the clear t in tú, tienes and tu, without a strong puff.', audio: '/audio/grammar/accent-marks/01.mp3' },
    { id: 't-02', spanish: '¿Tú trabajas aquí?', english: 'Do you work here? (informal)', hint: 'Bring your tongue forward for the t in tú and trabajas.', audio: '/audio/grammar/tu-usted/03.mp3' },
    { id: 't-03', spanish: 'No tengo tiempo.', english: 'I do not have time.', hint: 'Listen for the t in tengo and tiempo, then imitate the release.', audio: '/audio/grammar/negatives/01.mp3' },
    { id: 't-04', spanish: 'Tengo tantas preguntas como tú.', english: 'I have as many questions as you.', hint: 'Keep each t crisp as the sentence speeds up.', audio: '/audio/grammar/comparisons/04.mp3' },
  ],
} as const;

export const dLesson = {
  id: 'd', title: 'A softer Spanish D',
  summary: 'Feel how Spanish d changes with its position.',
  contrast: [{ word: 'd', description: 'Often dental, sometimes soft' }, { word: 'cansada', description: 'Soft d between vowels' }],
  note: 'Spanish d is typically a stop after a pause, n or l. In many other positions, including between vowels, it is usually softer; pronunciation varies by speaker and region.',
  grammarPath: '/grammar/alphabet', grammarLabel: 'Explore Spanish letters in Grammar Studio',
  cues: [
    { title: 'Move to the teeth', text: 'For the stop, touch the tongue to the back of the upper front teeth, rather than the ridge typically used for English d. Release with your voice on.' },
    { title: 'Soften between vowels', text: 'Bring the tongue near or lightly against the upper teeth without a full stop, letting air and voice continue. It can resemble the sound in English “this,” though it is often gentler.' },
  ],
  examples: [
    { id: 'd-01', spanish: 'Dijo que llegaría tarde.', english: 'She said she would arrive late.', hint: 'Hear the firmer initial d in dijo and the softer d in tarde.', audio: '/audio/grammar/conditional/04.mp3' },
    { id: 'd-02', spanish: 'Estoy cansada.', english: 'I am tired.', hint: 'Listen for the soft d between vowels in cansada.', audio: '/audio/grammar/ser-estar/01.mp3' },
    { id: 'd-03', spanish: 'Quiero pero no puedo.', english: 'I want to, but I cannot.', hint: 'Listen for the soft d in puedo without a complete stop.', audio: '/audio/grammar/rr/02.mp3' },
    { id: 'd-04', spanish: 'El sábado fuimos al museo.', english: 'On Saturday we went to the museum.', hint: 'Notice the gentle d between vowels in sábado.', audio: '/audio/grammar/preterite/03.mp3' },
  ],
} as const;

export const bvLesson = {
  id: 'bv', title: 'B and V together',
  summary: 'Use your lips for both letters and notice their two common sounds.',
  contrast: [{ word: 'b', description: 'Both lips' }, { word: 'v', description: 'Both lips, too' }],
  note: 'Spanish b and v generally represent the same sounds; spelling alone does not determine which sound you hear. Neither normally uses the English v made with upper teeth on the lower lip.',
  grammarPath: '/grammar/alphabet', grammarLabel: 'Explore Spanish letters in Grammar Studio',
  cues: [
    { title: 'Firm after a pause or nasal sound', text: 'Close both lips briefly, let your voice start, then release. The opening b in bueno is a useful example.' },
    { title: 'Soft between vowels', text: 'Bring both lips close together, without fully closing, and let voiced air pass. Avoid pressing the upper teeth against the lower lip, as in English v.' },
  ],
  examples: [
    { id: 'bv-01', spanish: 'Este café es tan bueno como aquel.', english: 'This coffee is as good as that one.', hint: 'Listen for the b in bueno after n, with both lips closing.', audio: '/audio/grammar/comparisons/02.mp3' },
    { id: 'bv-02', spanish: 'Ella vive aquí.', english: 'She lives here.', hint: 'Listen for the soft v in vive. Use both lips, not your teeth.', audio: '/audio/grammar/present-er-ir/01.mp3' },
    { id: 'bv-03', spanish: 'Vivimos en México.', english: 'We live in Mexico.', hint: 'Notice the initial v and the softer v between vowels in vivimos.', audio: '/audio/grammar/subject-pronouns/02.mp3' },
    { id: 'bv-04', spanish: 'Vamos a visitar a mis abuelos.', english: 'We are going to visit my grandparents.', hint: 'Listen for both-lip sounds in vamos, visitar and abuelos.', audio: '/audio/grammar/ir-future/02.mp3' },
  ],
} as const;

export const diphthongLesson = {
  id: 'diphthongs', title: 'Vowels moving together',
  summary: 'Hear two vowels moving within one syllable.',
  contrast: [{ word: 'tiem-po', description: 'ie shares one syllable' }, { word: 'rí-o', description: 'í and o form two syllables' }],
  note: 'A diphthong joins two vowel sounds within one syllable; a hiatus separates them. A written accent on stressed í or ú can signal separation, as in río.',
  grammarPath: '/grammar/vowel-combinations', grammarLabel: 'Explore vowel combinations in Grammar Studio',
  cues: [
    { title: 'Move smoothly', text: 'For ie in tiempo, move from the i-like position toward e in one syllable. For ue in bueno, move from rounded lips toward e.' },
    { title: 'Listen for syllable beats', text: 'Compare one beat in tiem-po with separate vowel beats in rí-o. Keep the vowel sounds audible without inserting an extra consonant.' },
  ],
  examples: [
    { id: 'dip-01', spanish: 'No tengo tiempo.', english: 'I do not have time.', hint: 'Listen for ie moving together in the first syllable of tiempo.', audio: '/audio/grammar/negatives/01.mp3' },
    { id: 'dip-02', spanish: 'Este café es tan bueno como aquel.', english: 'This coffee is as good as that one.', hint: 'Listen for ue moving together in the first syllable of bueno.', audio: '/audio/grammar/comparisons/02.mp3' },
    { id: 'dip-03', spanish: 'Quiero pero no puedo.', english: 'I want to, but I cannot.', hint: 'Hear ie in quiero and ue in puedo; each pair moves within a syllable.', audio: '/audio/grammar/rr/02.mp3' },
    { id: 'dip-04', spanish: 'La luna ilumina el patio.', english: 'The moon lights up the patio.', hint: 'Listen for io together in the final syllable of patio.', audio: '/audio/grammar/vowels/02.mp3' },
  ],
} as const;
