import Link from 'next/link';
import { ProfileLink } from '@/components/navigation/profile-link';
import { ToolGallery } from '@/components/navigation/tool-gallery';
import { PronunciationLesson } from '@/components/pronunciation/pronunciation-lesson';
import './pronunciation.css';

export default function PronunciationPage() {
  return <><main className="home-shell"><header className="home-header"><div><Link href="/" className="wordmark">Sonora<span>.</span></Link><p className="tiny-subtitle">Stories that teach you Spanish.</p></div><ProfileLink /></header><PronunciationLesson /></main><ToolGallery /></>;
}
