'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import type { NotesResponse, NoteTag, Note } from '@/types/note';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';
import css from '@/components/NotePage/NotePage.module.css';

interface NotesClientProps {
  page: number;
  search: string;
  tag: 'All' | NoteTag;
  initialData?: NotesResponse;
}

export default function NotesClient({
  page,
  search,
  tag,
  initialData,
}: NotesClientProps) {
  const [searchTerm, setSearchTerm] = useState(search);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentTag, setCurrentTag] = useState(tag);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const perPage = 12;

  // якщо змінився тег — скидати сторінку
  useEffect(() => {
    setCurrentPage(1);
    setCurrentTag(tag);
  }, [tag]);

  const query = useQuery<NotesResponse, Error>({
    queryKey: ['notes', debouncedSearchTerm, currentPage, currentTag],
    queryFn: () =>
      fetchNotes(
        currentPage,
        debouncedSearchTerm,
        perPage,
        currentTag === 'All' ? undefined : currentTag
      ),
    initialData,
  });

  const data = query.data;
  const notesExist = !!data?.notes?.length;
  const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = (newTerm: string) => {
    setSearchTerm(newTerm);
    setCurrentPage(1);
  };

  const handleSelectNote = (note: Note) => {
    console.log('Open note:', note.id);
  };

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
      {query.isError && <p>Error loading notes: {query.error.message}</p>}

      {notesExist ? (
        <NoteList notes={data!.notes} onSelectNote={handleSelectNote} />
      ) : (
        !query.isLoading && <p className={css.emptyMessage}>No notes found.</p>
      )}
    </div>
  );
}
