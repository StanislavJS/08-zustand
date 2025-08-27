import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import type { Metadata } from "next";
import NotePreview from '../../@modal/(.)notes/[id]/NotePreview.client';

interface NotePageProps {
  params: Promise<{ id: string }>; // <- обязательно Promise
}

// Генерация метаданных
export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params; // <- await обязательно
  const note = await fetchNoteById(id);

  return {
    title: note.title + " | NoteHub",
    description: note.content.slice(0, 160),
    openGraph: {
      title: note.title + " | NoteHub",
      description: note.content.slice(0, 160),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/notes/${id}`,
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

// Основной компонент страницы
export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params; // <- await обязательно

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
