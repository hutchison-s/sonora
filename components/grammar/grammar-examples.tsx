'use client';
import { useEffect,useRef,useState } from 'react';
import { Volume2, Pause } from 'lucide-react';
type Example={id:string;spanish:string;english:string;explanation:string;audioPath?:string};
export function GrammarExamples({examples}:{examples:Example[]}){
 const audio=useRef<HTMLAudioElement|null>(null);
 const [active,setActive]=useState<string|null>(null);
 const [unavailable,setUnavailable]=useState<string|null>(null);
 useEffect(()=>()=>{audio.current?.pause();audio.current=null;},[]);
 const play=async (ex:Example)=>{
  if (!ex.audioPath) return;
  audio.current?.pause();audio.current=null;
  if(active===ex.id){setActive(null);return;}
  setUnavailable(null);
  const player=new Audio('/'+ex.audioPath);
  audio.current=player;setActive(ex.id);
  player.onended=()=>setActive(current=>current===ex.id?null:current);
  player.onerror=()=>{setUnavailable(ex.id);setActive(null);};
  try{await player.play();}catch{setUnavailable(ex.id);setActive(null);}
 };
 return <div className="grammar-examples">{examples.map(ex=><section className="grammar-example" key={ex.id}>{ex.audioPath ? <button className="grammar-sentence" type="button" onClick={()=>void play(ex)} aria-label={`Play Spanish sentence: ${ex.spanish}`}><span lang="es">{ex.spanish}</span>{active===ex.id?<Pause size={21}/>:<Volume2 size={21}/>}</button> : <p className="grammar-sentence grammar-text-example" lang="es">{ex.spanish}</p>}<p className="grammar-translation">{ex.english}</p><div className="grammar-why"><strong>Why it works</strong><p>{ex.explanation}</p></div>{unavailable===ex.id&&<p className="grammar-audio-note" role="status">This recording couldn’t play. Please try again.</p>}</section>)}</div>;
}
