import { cookies } from 'next/headers';
import { nextServer } from './api';
import { SessionValidationResult } from '@/types/noteApi'; 
import { Note } from '@/types/note';
import { User } from '@/types/user';

export async function fetchServerNoteById(id: string): Promise<Note> {
	const cookieStore = await cookies();

	const { data } = await nextServer.get<Note>(`/notes/${id}`, {
		headers: {
			Cookie: cookieStore.toString(),
		},
	});

	return data;
}

export const validateUserSession = async () => {
	const cookieStore = await cookies();
	const res = await nextServer.get<SessionValidationResult>('/auth/session', {
		headers: {
			Cookie: cookieStore.toString(),
		},
	});
	return res;
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};