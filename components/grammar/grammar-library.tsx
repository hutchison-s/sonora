'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search, BookOpen, ArrowUpRight } from 'lucide-react';

type Example = { id:string; spanish:string; english:string; explanation:string; audioPath?:string };
type Lesson = { exampleCount?:number; id:string; categoryId:string; level:string; title:string; summary:string; grammarTerm:string; keywords:string[]; examples:Example[]; vocabulary:{surface:string;lemma:string;meaning:string}[] };
type Catalog = { categories:{id:string;title:string}[]; lessons:Lesson[] };
export function GrammarLibrary({catalog}:{catalog:Catalog}) {
  const [query,setQuery]=useState('');
  const [level,setLevel]=useState('All');
  const [category,setCategory]=useState('All');
  const [sort,setSort]=useState('level');
  const lessons=useMemo(()=>catalog.lessons.filter(l=>(level==='All'||l.level===level)&&(category==='All'||l.categoryId===category)&&[l.title,l.summary,l.grammarTerm,...l.keywords,...l.examples.map(e=>e.spanish)].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())).sort((a,b)=>sort==='title'?a.title.localeCompare(b.title):sort==='category'?a.categoryId.localeCompare(b.categoryId)||a.title.localeCompare(b.title):['A1','A2','B1','B2','C1','C2'].indexOf(a.level)-['A1','A2','B1','B2','C1','C2'].indexOf(b.level)||a.title.localeCompare(b.title)),[catalog,query,level,category,sort]);
  return <section className="grammar-library" aria-label="Grammar reference">
    <div className="grammar-search"><Search size={18}/><input aria-label="Search grammar lessons" placeholder="Search a rule, phrase, or question..." value={query} onChange={e=>setQuery(e.target.value)}/></div>
    <div className="grammar-controls"><label>Level <select value={level} onChange={e=>setLevel(e.target.value)}>{['All','A1','A2','B1','B2','C1','C2'].map(x=><option key={x}>{x}</option>)}</select></label><label>Topic <select value={category} onChange={e=>setCategory(e.target.value)}><option value="All">All topics</option>{catalog.categories.map(c=><option value={c.id} key={c.id}>{c.title}</option>)}</select></label><label>Sort <select value={sort} onChange={e=>setSort(e.target.value)}><option value="level">Difficulty</option><option value="title">Alphabetical</option><option value="category">Topic</option></select></label></div>
    <p className="grammar-count">{lessons.length} {lessons.length===1?'lesson':'lessons'}</p>
    <div className="grammar-grid">{lessons.map(l=><Link className="grammar-card" key={l.id} href={`/grammar/${l.id}`}><div className="grammar-card-top"><span>{catalog.categories.find(c=>c.id===l.categoryId)?.title}</span><span className="grammar-level">{l.level}</span></div><h2 className="font-serif">{l.title}</h2><p>{l.summary}</p><div className="grammar-card-bottom"><span><BookOpen size={14}/> {l.exampleCount ?? l.examples.length} examples{l.examples.some(e=>e.audioPath) ? ` · ${l.examples.filter(e=>e.audioPath).length} with audio` : ''}</span><ArrowUpRight size={18}/></div></Link>)}</div>
    {lessons.length===0&&<p className="empty-note">No matching lessons. Try another term or level.</p>}
  </section>;
}
