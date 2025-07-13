import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CreateNoteValues } from '../api/clientApi';

type NoteDraftStore = {
  draft: CreateNoteValues;
  setDraft: (note: Partial<CreateNoteValues>) => void;
  clearDraft: () => void;
};

const initialDraft: CreateNoteValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set(() => ({
          draft: {
            ...get().draft,
            ...note,
          },
        })),
      clearDraft: () =>
        set(() => ({
          draft: initialDraft,
        })),
    }),
    {
      name: 'note-draft',
      partialize: (state) => ({
        draft: state.draft,
      }),
    }
  )
);
