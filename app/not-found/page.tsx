import type { Metadata } from 'next';
import NotFoundClient from './NotFoundClient';

export const metadata: Metadata = {
  title: 'Page Not Found - NoteHub',
  description: 'The page you are looking for does not exist in NoteHub.',
  openGraph: {
    title: 'Page Not Found - NoteHub',
    description: 'The page you are looking for does not exist in NoteHub.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/not-found`,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function NotFoundPage() {
  
  return <NotFoundClient />;
}
