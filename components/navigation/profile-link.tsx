import Link from 'next/link';
import { UserRound } from 'lucide-react';
export function ProfileLink() { return <Link href="/profile" className="avatar" aria-label="Open learner profile"><UserRound size={18} strokeWidth={1.65}/></Link>; }
