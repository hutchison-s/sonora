'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, AudioLines, Languages, LibraryBig } from 'lucide-react';
const items = [
 {label:'Story Room',icon:BookOpen,href:'/'},
 {label:'Grammar Studio',icon:LibraryBig,href:'/grammar'},
 {label:'Pronunciation',icon:AudioLines},
 {label:'Translation',icon:Languages}
];
export function ToolGallery(){
 const pathname=usePathname();
 return <nav className="tool-gallery" aria-label="Learning studios"><div className="tool-scroll">{items.map(({label,icon:Icon,href})=>{const active=href==='/'?pathname==='/'||pathname.startsWith('/stories'):href?pathname.startsWith(href):false;return href?<Link key={label} href={href} className={`tool-item ${active?'active':''}`} aria-current={active?'page':undefined}><Icon size={19} strokeWidth={1.55}/><span>{label}</span></Link>:<span key={label} className="tool-item" aria-label={`${label} coming soon`}><Icon size={19} strokeWidth={1.55}/><span>{label}</span><small>Soon</small></span>;})}</div></nav>;
}