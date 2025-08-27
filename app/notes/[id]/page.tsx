import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NotePreview from '../../@modal/(.)notes/[id]/NotePreview.client';
// import type { Metadata } from 'next';
import type { Metadata } from 'next';


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-vercel-domain.vercel.app';


export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const note = await fetchNoteById(params.id);

  return {
    title: note.title + ' | NoteHub',
    description: note.content.slice(0, 160),
    openGraph: {
      title: note.title + ' | NoteHub',
      description: note.content.slice(0, 160),
      url: `${SITE_URL}/notes/${params.id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Note OG Image',
        },
      ],
    },
  };
}


export default async function NotePage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', params.id],
    queryFn: () => fetchNoteById(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={params.id} />
    </HydrationBoundary>
  );
}