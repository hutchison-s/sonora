export const rLesson = {
  title: 'One tap or a trill?',
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
