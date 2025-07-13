'use client';

import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import QueryStatus from '../QueryStatus/QueryStatus';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNoteDraftStore } from '@/lib/store/noteStore';

type Tag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

interface NoteFormValues {
  title: string;
  content?: string;
  tag: Tag;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title is too long'),
  content: Yup.string().max(500, 'Content is too long'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'], 'Invalid tag value')
    .required('Tag is required'),
});

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [validationError, setValidationError] = useState<string | null>(null);
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const mutation = useMutation({
    mutationFn: async (note: NoteFormValues) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'], exact: false });
      clearDraft();
      router.push('/notes/filter/all');
    },
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setDraft({
      ...draft,
      [name]: value,
    });
  }

  async function validateNote(data: NoteFormValues): Promise<string | null> {
    try {
      await validationSchema.validate(data, { abortEarly: false });
      return null;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        return err.errors[0];
      }
      return 'Unknown validation error';
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data: NoteFormValues = {
      title: formData.get('title') as string,
      content: (formData.get('content') as string) || undefined,
      tag: formData.get('tag') as Tag,
    };

    const error = await validateNote(data);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    mutation.mutate(data);
  }

  return (
    <>
      {validationError && (
        <p className={`${css.error} ${css.statusMessage}`}>
          {validationError}
        </p>
      )}
      <QueryStatus
        isLoading={mutation.status === 'pending'}
        isError={mutation.isError}
        error={mutation.error as Error | null}
        isEmpty={false}
        emptyMessage=""
      />

      <form className={css.form} onSubmit={handleSubmit} noValidate>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            className={css.input}
            defaultValue={draft.title}
            onChange={handleChange}
            minLength={3}
            maxLength={50}
            required
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
            defaultValue={draft.content}
            onChange={handleChange}
            maxLength={500}
          />
        </div>
        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <select
            id="tag"
            name="tag"
            className={css.select}
            defaultValue={draft.tag}
            onChange={handleChange}
            required
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={() => router.push('/notes/filter/all')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.status === 'pending'}
          >
            {mutation.status === 'pending' ? 'Loading...' : 'Create note'}
          </button>
        </div>
      </form>
    </>
  );
}
