import type { Metadata } from 'next';
import { ProfileClient } from '@/components/navigation/profile-client';
import { stories } from '@/lib/content/stories';
export const metadata: Metadata = { title: 'Your reading journey' };
export default function Profile() { return <ProfileClient stories={stories}/>; }
