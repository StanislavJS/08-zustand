import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';
import css from './Home.module.css';

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
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => setCountdown(prev => prev - 1), 1000);
    const timer = setTimeout(() => router.push('/'), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>404 - Page not found</h1>
        <p className={css.description}>
          Sorry, the page you are looking for does not exist.
        </p>
        <p className={css.description}>Redirecting to homepage in {countdown}...</p>
        <button onClick={() => router.push('/')} className={css.button}>
          Go Home
        </button>
      </div>
    </main>
  );
}
