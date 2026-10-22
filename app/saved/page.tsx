import type { Metadata } from 'next';
import { SavedClient } from '@/components/navigation/saved-client';
import { stories } from '@/lib/content/stories';
export const metadata: Metadata = { title: 'Saved phrases' };
export default function SavedPage() { return <SavedClient stories={stories}/>; }
