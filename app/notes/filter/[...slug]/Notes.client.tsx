'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import type { NotesResponse, NoteTag } from '@/types/note';

import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';
import css from '@/components/NotePage/NotePage.module.css';

type NotesClientProps = {
  initialPage: number;
  initialSearch: string;
  initialTag: 'All' | NoteTag;
  initialData?: NotesResponse;
};

export default function NotesClient({
  initialPage,
  initialSearch,
  initialTag,
  initialData,
}: NotesClientProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentTag, setCurrentTag] = useState(initialTag);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const perPage = 12;

  useEffect(() => {
    setCurrentTag(initialTag);
    setCurrentPage(1);
    setSearchTerm('');
  }, [initialTag]);

  const query = useQuery({
    queryKey: ['notes', debouncedSearchTerm, currentPage, currentTag],
    queryFn: () =>
      fetchNotes(
        currentPage,
        debouncedSearchTerm,
        perPage,
        currentTag === 'All' ? undefined : currentTag
      ),
    initialData: initialData ?? undefined,
  });

  const data = query.data as NotesResponse | undefined;

  const handleSearchChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    setCurrentPage(1);
  };

  const notesExist = !!data?.notes?.length;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchTerm} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            pageCount={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {query.isLoading && <p>Loading notes...</p>}
      {query.isError && <p>Error loading notes.</p>}

      {notesExist ? (
        <NoteList notes={data!.notes} onSelectNote={() => {}} />
      ) : (
        !query.isLoading && <p className={css.emptyMessage}>No notes found.</p>
      )}
    </div>
  );
}
