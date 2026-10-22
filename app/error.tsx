'use client';
import Link from 'next/link';
export default function Error({ reset }: { error: Error; reset: () => void }) { return <main className="centered-message"><h1 className="font-serif">Something interrupted the story.</h1><button className="outline-cta" onClick={reset}>Try again</button><Link href="/">Back to the library</Link></main>; }
