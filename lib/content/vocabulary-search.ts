import type { StoryVocabulary, VocabularyTerm, VerbTerm } from './vocabulary';

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}

function matches(values: string[], tokens: string[]): boolean {
  const searchable = normalize(values.join(' '));
  return tokens.every(token => searchable.includes(token));
}

export function searchVocabulary(vocabulary: StoryVocabulary, query: string): StoryVocabulary {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return vocabulary;
  const filterTerms = <T extends VocabularyTerm>(terms: T[], values: (term: T) => string[] = term => [term.es, term.en]) =>
    terms.filter(term => matches(values(term), tokens));
  return {
    nouns: filterTerms(vocabulary.nouns),
    verbs: filterTerms<VerbTerm>(vocabulary.verbs, term => [term.es, term.en, ...term.present]),
    prepositions: filterTerms(vocabulary.prepositions),
    expressions: filterTerms(vocabulary.expressions),
  };
}
