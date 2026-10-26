import Link from 'next/link';
import { ProfileLink } from '@/components/navigation/profile-link';
import { ToolGallery } from '@/components/navigation/tool-gallery';
import { GrammarLibrary } from '@/components/grammar/grammar-library';
import { grammarLibraryCatalog as catalog } from '@/lib/grammar/lessons';

export default function GrammarPage() {
  return <><main className="home-shell"><header className="home-header"><div><Link href="/" className="wordmark">Sonora<span>.</span></Link><p className="tiny-subtitle">Stories that teach you Spanish.</p></div><ProfileLink/></header><div className="home-lede"><span className="overline">GRAMMAR STUDIO ✦ YOUR SPANISH, EXPLAINED</span><h1 className="font-serif">Understand the <em>why.</em></h1><p className="tiny-subtitle">Short explanations, spoken examples, and useful vocabulary.</p></div><GrammarLibrary catalog={catalog}/></main><ToolGallery/></>;
}
