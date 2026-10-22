import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { charcoal: '#171C1F', surface: '#252D30', ivory: '#F0E5D6', sage: '#A4B2AE', clay: '#D99B73', glass: '#7DADA9' },
    fontFamily: { serif: ['var(--font-serif)', 'Georgia', 'serif'], sans: ['var(--font-sans)', 'Arial', 'sans-serif'] },
    maxWidth: { reader: '720px' },
  } }, plugins: []
} satisfies Config;
