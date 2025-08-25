// app/notes/filter/[...slug]/page.tsx
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import type { NotesResponse, NoteTag } from '@/types/note';
import type { Metadata } from 'next';

import { dehydrate, QueryClient, HydrationBoundary } from '@tanstack/react-query';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-vercel-domain.vercel.app';

function isNoteTag(value: string | undefined): value is NoteTag {
  return ['Work', 'Personal', 'Meeting', 'Shopping', 'Todo'].includes(value ?? '');
}

interface NotesFilterPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

// --- Метадані для SEO ---
export async function generateMetadata({ params }: NotesFilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] ?? 'All';
  const tagText = tag === 'All' ? 'All Notes' : `Notes tagged "${tag}"`;

  return {
    title: `Filter: ${tagText} | NoteHub`,
    description: `Browse and search ${tagText} in NoteHub — filter, find, and manage your notes efficiently.`,
    openGraph: {
      title: `Filter: ${tagText} | NoteHub`,
      description: `Browse and search ${tagText} in NoteHub — filter, find, and manage your notes efficiently.`,
      url: `${SITE_URL}/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1280,
          height: 720,
          alt: 'NoteHub Filter Notes OG Image',
        },
      ],
    },
  };
}

// --- Компонент сторінки ---
export default async function NotesFilterPage({ params, searchParams }: NotesFilterPageProps) {
  const { slug } = await params;
  const { page: rawPage, search: rawSearch } = await searchParams;

  const page = Number(rawPage) || 1;
  const search = rawSearch || '';
  let tag: string | undefined = slug[0];
  if (tag === 'All') tag = undefined;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<NotesResponse>({
    queryKey: ['notes', page, search, tag],
    queryFn: () => fetchNotes(page, search, 12, tag),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NotesClient
        initialPage={page}
        initialSearch={search}
        initialTag={isNoteTag(tag) ? tag : 'All'}
        initialData={queryClient.getQueryData(['notes', page, search, tag])}
      />
    </HydrationBoundary>
  );
}
