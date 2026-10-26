'use client';

import { Fragment, useId, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import type { GrammarVisual } from '@/lib/grammar/visual-schema';

/** All sequencing is local and learner-controlled: no timers, autoplay or network calls. */
export function GrammarVisualTool({ visual }: { visual: GrammarVisual }) {
 const uid = useId();
 const reducedMotion = useReducedMotion();
 const [scenarioIndex, setScenarioIndex] = useState(0);
 const [step, setStep] = useState<number | null>(null);
 const sample = visual.scenarios[scenarioIndex];
 // A useful, completed example is visible before the learner starts the walkthrough.
 const index = step ?? sample.frames.length - 1;
 const current = sample.frames[index];
 const duration = reducedMotion ? 0 : 0.35;
 const titleId = `${uid}-title`;
 const selectId = `${uid}-sample`;

 return <figure className="grammar-visual" aria-labelledby={titleId} data-visual-kind={visual.kind}>
  <figcaption>
   <p className="overline">See the pattern</p>
   <h4 className="font-serif" id={titleId}>{visual.title}</h4>
   <p className="grammar-visual-goal">{visual.goal}</p>
  </figcaption>
  {visual.scenarios.length > 1 && <div className="grammar-visual-select">
   <label htmlFor={selectId}>Example</label>
   <select id={selectId} value={scenarioIndex} onChange={event => {
    setScenarioIndex(Number(event.target.value)); setStep(null);
   }}>{visual.scenarios.map((item, i) => <option key={item.id} value={i}>{item.label}</option>)}</select>
  </div>}
  <LayoutGroup id={uid}>
   <div className="grammar-visual-stage" aria-hidden="true">
    {'tokens' in current && <div className="grammar-token-line" lang="es">
     {current.tokens.reduce<(typeof current.tokens)[]>((groups, token) => {
      if (token.joinLeft && groups.length) groups[groups.length - 1].push(token);
      else groups.push([token]);
      return groups;
     }, []).map((group, groupIndex) => <Fragment key={group[0].id}>{groupIndex > 0 ? ' ' : null}<span className="grammar-token-word">{group.map(token => <motion.span
      key={token.id} layout layoutId={`${uid}-${sample.id}-${token.id}`}
      initial={step === null || reducedMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration }}
      className={`grammar-token grammar-token-${token.role}${token.joinLeft ? ' grammar-token-joined' : ''}`}
     >{token.text}</motion.span>)}</span></Fragment>)}
    </div>}
    {'syllables' in current && <div className="grammar-syllable-line" lang="es">
     {current.syllables.map(syllable => <motion.span
      key={syllable.id} layout initial={false}
      animate={{ scale: syllable.stressed ? 1.12 : 1 }} transition={{ duration }}
      className={`grammar-syllable${syllable.stressed ? ' grammar-syllable-stressed' : ''}`}
     >{syllable.text}<span>{syllable.stressed ? 'stressed' : 'unstressed'}</span></motion.span>)}
    </div>}
    {'lanes' in current && visual.kind === 'timeline' && <div className="grammar-timeline">
     <div className="grammar-timeline-axis"><span>{visual.axisStart}</span><span>{visual.axisEnd}</span></div>
     {current.lanes.map(lane => <div className="grammar-timeline-lane" key={lane.id}>
      <span>{lane.label}</span><div className="grammar-timeline-track">
       <motion.div layout initial={step === null || reducedMotion ? false : { opacity: 0 }} transition={{ duration }}
        className={`grammar-timeline-mark grammar-timeline-${lane.kind}`}
        animate={{ opacity: 1, left: `${lane.start}%`, width: lane.kind === 'event' ? 12 : `${lane.end - lane.start}%` }} />
      </div>
     </div>)}
     <p className="grammar-timeline-note">Scene sketch · spacing does not measure duration</p>
    </div>}
   </div>
  </LayoutGroup>
  <div className="grammar-visual-description" aria-live="polite" aria-atomic="true">
   <p className="grammar-visual-position">{step === null ? 'Finished example' : `Step ${index + 1} of ${sample.frames.length}`} · {current.label}</p>
   <p className="sr-only" lang="es">{current.spanish}</p>
   {'lanes' in current && <p className="grammar-visual-sentence" lang="es">{current.spanish}</p>}
   {'lanes' in current && <ul className="sr-only">{current.lanes.map(lane => <li key={lane.id}>{lane.label}: {lane.kind === 'event' ? 'completed event' : 'background interval in the scene'}</li>)}</ul>}
   <p className="grammar-visual-translation">{current.english}</p>
   <p className="grammar-visual-explanation">{current.explanation}</p>
  </div>
  <div className="grammar-visual-controls">
   <button type="button" onClick={() => setStep(0)} className="grammar-visual-start">
    <RotateCcw size={15} aria-hidden="true" />{step === null ? 'Show me how' : 'Replay'}
   </button>
   {step !== null && <div className="grammar-visual-step-controls">
    <button type="button" disabled={index === 0} onClick={() => setStep(index - 1)}><ArrowLeft size={15} aria-hidden="true" />Back</button>
    <button type="button" disabled={index === sample.frames.length - 1} onClick={() => setStep(index + 1)}>Next step<ArrowRight size={15} aria-hidden="true" /></button>
   </div>}
  </div>
 </figure>;
}
