'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNoteStore } from '@/lib/store/noteStore';
import { createNote } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose?: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const { draft, setDraft, clearDraft } = useNoteStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft(); // очищаємо draft після успішного створення
      onClose?.();   // повертаємося назад
    },
    onError: (error: Error) => {
      console.error('Failed to create note:', error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({
      title: draft.title,
      content: draft.content,
      tag: draft.tag,
    });
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <label htmlFor="title" className={css.label}>
        Title
        <input
          id="title"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          required
        />
      </label>

      <label htmlFor="content" className={css.label}>
        Content
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          required
        />
      </label>

      <label htmlFor="tag" className={css.label}>
        Tag
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </label>

      <div className={css.buttons}>
        <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save'}
        </button>
        {onClose && (
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
