/**
 * Generate Grammar Studio sentence audio with ElevenLabs.
 * Run: ELEVENLABS_API_KEY=... npx tsx scripts/publish-grammar-audio.ts
 * Defaults to George (Latin American Spanish) and eleven_v4. Override with ELEVENLABS_VOICE_ID / ELEVENLABS_MODEL_ID.
 * Existing MP3 files are skipped. Remove a file to regenerate it.
 */
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
type Example={id:string;spanish:string;audioPath:string};
type Lesson={id:string;examples:Example[]};
const key=process.env.ELEVENLABS_API_KEY;
const voice=process.env.ELEVENLABS_VOICE_ID||'7GCLDRn3tm42Ra1CZCPL';
const model=process.env.ELEVENLABS_MODEL_ID||'eleven_v4';
if(!key)throw new Error('Set ELEVENLABS_API_KEY');
const data=JSON.parse(await readFile('content/grammar/lessons.json','utf8')) as {lessons:Lesson[]};
for(const lesson of data.lessons)for(const example of lesson.examples){
 const dest=join('public',example.audioPath);
 try{await access(dest);console.log('Skip',dest);continue;}catch{}
 console.log('Generate',dest);
 let bytes:Buffer|undefined;
 for(let attempt=0;attempt<5;attempt++){
  const response=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`,{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json','Accept':'audio/mpeg'},body:JSON.stringify({text:example.spanish,model_id:model})});
  if(response.ok){bytes=Buffer.from(await response.arrayBuffer());break;}
  const error=await response.text();
  if(![429,500,502,503,504].includes(response.status)||attempt===4)throw new Error(`${response.status}: ${error.slice(0,400)}`);
  await new Promise(resolve=>setTimeout(resolve,Math.min(30000,1000*2**attempt)));
 }
 if(!bytes?.length)throw new Error('Empty audio response');
 await mkdir(dirname(dest),{recursive:true});await writeFile(dest,bytes);
}
console.log('Grammar audio generation complete');
