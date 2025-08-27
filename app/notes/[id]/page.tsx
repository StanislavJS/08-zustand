import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Metadata } from "next";
import NotePreview from '../../@modal/(.)notes/[id]/NotePreview.client';

type Props = { params: { id: string } };

// Генерація метаданих для сторінки нотатки
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const note = await fetchNoteById(id);

  return {
    title: note.title,
    description: note.content.slice(0, 160),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 160),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

interface NotePageProps {
  params: { id: string };
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview noteId={id} />
    </HydrationBoundary>
  );
}

