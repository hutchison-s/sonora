'use client';
import { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import type { Story } from '@/lib/types/story';
import { finishStory } from '@/lib/progress/storage';
import Link from 'next/link';
import { answerIsCorrect } from '@/lib/content/comprehension';
export function Comprehension({ story, completed, nextStoryId }: { story: Story; completed: boolean; nextStoryId?: string }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const question = story.comprehension[index];
  const complete = () => { finishStory(story.id, answers); setDone(true); };
  return <section className="comprehension" aria-label="Story comprehension"><div className="finish-rule"/><p className="overline">A MOMENT TO REFLECT</p><h2 className="font-serif">How much did you <em>understand?</em></h2><p className="comprehension-description">Three quick questions, just for you. No scores, no pressure.</p>
    {!done ? <div className="question-box"><div className="question-counter">QUESTION {index+1} <span>/ 03</span></div><h3>{question.question}</h3><div className="answer-choices">{question.options.map((option,i) => <button type="button" key={i} aria-pressed={answer === i} disabled={answer !== null} className={`${answer === i ? 'chosen' : ''} ${answer !== null && i === question.correctIndex ? 'right-answer' : ''}`} onClick={() => { setAnswer(i); setAnswers(old => [...old.slice(0,index),i]); }}><span className="option-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{answer !== null && i === question.correctIndex && <Check size={17} className="answer-tick"/>}{answer === i && i !== question.correctIndex && <X size={16} className="answer-cross"/>}</button>)}</div>
      {answer !== null && <div className="answer-feedback" role="status"><strong>{answerIsCorrect(question, answer) ? 'That’s right.' : 'Not quite—and that’s okay.'}</strong><p>{question.explanation}</p><button className="next-question" type="button" onClick={() => { if (index === 2) complete(); else { setIndex(i=>i+1); setAnswer(null); } }}>{index === 2 ? 'Finish story' : 'Next question'} <ArrowRight size={16}/></button></div>}
      <button type="button" className="skip-question" onClick={() => { finishStory(story.id, answers); setDone(true); }}>Skip questions and finish</button>
    </div> : <div className="completion-state" role="status"><span className="completion-glyph">✦</span><h3 className="font-serif">Another story, <em>well read.</em></h3><p>You made room for a little more Spanish today. That matters.</p><div className="completion-links"><Link href="/">Back to library <ArrowRight size={16}/></Link>{nextStoryId && <Link href={`/stories/${nextStoryId}`}>Next story <ArrowRight size={16}/></Link>}</div></div>}
    {completed && !done && <p className="read-before">You&apos;ve completed this story before. Revisit it whenever you like.</p>}
  </section>;
}
