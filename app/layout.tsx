import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'Sonora — Stories that teach you Spanish', template: '%s · Sonora' },
  description: 'Discover Spanish through beautiful stories, natural translations, and contextual language insights.',
  applicationName: 'Sonora',
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#171C1F' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="ambient-light" aria-hidden="true" />{children}</body></html>;
}
