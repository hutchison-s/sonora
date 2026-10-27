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
