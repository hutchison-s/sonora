import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ProfileLink } from '@/components/navigation/profile-link';
import { ToolGallery } from '@/components/navigation/tool-gallery';
import { GrammarExamples } from '@/components/grammar/grammar-examples';
import catalog from '@/content/grammar/lessons.json';
import expandedLessons from '@/content/grammar/expanded-lessons.json';

const sections = [
 ['big-idea', 'The Big Idea'], ['build-it', 'Build It'],
 ['see-it-work', 'See It Work'], ['spot-the-difference', 'Spot the Difference'],
 ['closer-look', 'A Closer Look'], ['watch-your-step', 'Watch Your Step'],
 ['make-it-yours', 'Make It Yours'], ['take-it-with-you', 'Take It With You'],
] as const;

export function generateStaticParams() {
 return catalog.lessons.map(lesson => ({ slug: lesson.id }));
}

export default async function GrammarLessonPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const lesson = catalog.lessons.find(item => item.id === slug);
 if (!lesson) notFound();
 const content = expandedLessons[lesson.id as keyof typeof expandedLessons];
 const category = catalog.categories.find(item => item.id === lesson.categoryId)?.title;
 const examples = [...lesson.examples, ...content.extraExamples.map((example, index) => ({
  ...example, id: `${lesson.id}-text-${index + 1}`,
 }))];
 const words = JSON.stringify(content).split(/\s+/).length;
 const minutes = Math.max(5, Math.ceil(words / 130));

 return <>
  <main className="home-shell">
   <header className="home-header">
    <div><Link href="/" className="wordmark">Sonora<span>.</span></Link><p className="tiny-subtitle">Stories that teach you Spanish.</p></div>
    <ProfileLink />
   </header>
   <article className="grammar-detail grammar-expanded">
    <Link className="grammar-back" href="/grammar"><ArrowLeft size={17} /> Grammar Studio</Link>
    <div className="overline">{category} · {lesson.level} · About {minutes} minutes</div>
    <h1 className="font-serif">{lesson.title}<span className="accent-period">.</span></h1>
    <p className="grammar-intro">{content.goal}</p>
    <div className="grammar-lesson-layout">
     <nav className="grammar-contents" aria-label="In this lesson">
      <p className="overline">In this lesson</p>
      <ol>{sections.map(([id, title]) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ol>
     </nav>
     <div className="grammar-lesson-body">
      <section id="big-idea" className="grammar-lesson-section" aria-labelledby="big-idea-title">
       <h2 id="big-idea-title" className="font-serif">The Big Idea</h2><p>{content.bigIdea}</p>
      </section>
      <section id="build-it" className="grammar-lesson-section" aria-labelledby="build-it-title">
       <h2 id="build-it-title" className="font-serif">Build It</h2>
       {content.build.map((step, index) => <div className="grammar-build-step" key={step.title}>
        <span className="grammar-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <div><h3 className="font-serif">{step.title}</h3><p>{step.body}</p></div>
       </div>)}
      </section>
      <section id="see-it-work" className="grammar-lesson-section" aria-labelledby="see-it-work-title">
       <h2 id="see-it-work-title" className="font-serif">See It Work</h2>
       <p className="grammar-section-intro">Follow the pattern through different sentences. Tap a speaker to listen.</p>
       <GrammarExamples examples={examples} />
       {lesson.vocabulary.length > 0 && <details className="grammar-disclosure grammar-vocabulary-notes">
        <summary>Vocabulary in these examples</summary>
        <div className="grammar-vocab">{lesson.vocabulary.map(word => <div key={word.surface}>
         <strong>{word.surface}</strong><span>{word.lemma !== word.surface ? `${word.lemma} · ` : ''}{word.meaning}</span>
        </div>)}</div>
       </details>}
      </section>
      <section id="spot-the-difference" className="grammar-lesson-section" aria-labelledby="contrast-title">
       <h2 id="contrast-title" className="font-serif">Spot the Difference</h2>
       <h3 className="font-serif">{content.contrast.title}</h3>
       <div className="grammar-comparison">{content.contrast.items.map(item => <div className="grammar-contrast-item" key={item.spanish}>
        <p className="grammar-contrast-spanish font-serif" lang="es">{item.spanish}</p>
        <p className="grammar-translation">{item.english}</p><p>{item.explanation}</p>
       </div>)}</div>
      </section>
      <section id="closer-look" className="grammar-lesson-section" aria-labelledby="closer-title">
       <h2 id="closer-title" className="font-serif">A Closer Look</h2>
       <p className="grammar-section-intro">Ready for a little more nuance? Open a note to explore.</p>
       {content.closerLook.map(note => <details className="grammar-disclosure" key={note.title}>
        <summary>{note.title}</summary><p>{note.body}</p>
       </details>)}
      </section>
      <section id="watch-your-step" className="grammar-lesson-section" aria-labelledby="mistakes-title">
       <h2 id="mistakes-title" className="font-serif">Watch Your Step</h2>
       {content.mistakes.map(mistake => <div className="grammar-mistake" key={mistake.incorrect}>
        <p className="grammar-incorrect"><span>Instead of</span> {mistake.incorrect}</p>
        <p className="grammar-correction"><span>Try</span> {mistake.correct}</p><p>{mistake.explanation}</p>
       </div>)}
      </section>
      <section id="make-it-yours" className="grammar-lesson-section" aria-labelledby="practice-title">
       <h2 id="practice-title" className="font-serif">Make It Yours</h2>
       <p className="grammar-section-intro">Try each prompt before revealing the answer. Compare the reasoning as well as the words.</p>
       {content.practice.map((practice, index) => <div className="grammar-practice" key={practice.prompt}>
        <span className="overline">Your turn · {String(index + 1).padStart(2, '0')}</span><p>{practice.prompt}</p>
        <details className="grammar-disclosure"><summary>Reveal answer</summary>
         <p className="grammar-answer font-serif">{practice.answer}</p><p>{practice.explanation}</p>
        </details>
       </div>)}
      </section>
      <section id="take-it-with-you" className="grammar-lesson-section" aria-labelledby="takeaway-title">
       <h2 id="takeaway-title" className="font-serif">Take It With You</h2>
       <ol className="grammar-takeaways">{content.takeaways.map(item => <li key={item}>{item}</li>)}</ol>
       <Link className="grammar-return" href="/grammar"><ArrowLeft size={16} /> Explore more lessons</Link>
      </section>
     </div>
    </div>
   </article>
  </main>
  <ToolGallery />
 </>;
}
