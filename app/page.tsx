import { LibraryClient } from '@/components/library/library-client';
import { stories } from '@/lib/content/stories';
export default function Home() { return <LibraryClient stories={stories}/>; }
