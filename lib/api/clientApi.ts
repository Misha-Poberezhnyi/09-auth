'use client';

import { Note } from '@/types/note';
import { EditUserPayload, User } from '@/types/noteApi';
import { nextServer } from './api';

export interface CreateNoteValues {
  title: string;
  content?: string;
  tag: 'Work' | 'Personal' | 'Meeting' | 'Shopping' | 'Todo';
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface SearchParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

interface SignUpData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateUserData {
  username: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type UserEditData = {
	email: string;
	username: string;
};

export async function fetchNotes(search: string, page: number, tag?: string): Promise<NotesResponse> {
  const perPage = 12;
  const params: SearchParams = { page, perPage };

  if (search) params.search = search;
  if (tag) params.tag = tag;

  try {
    const res = await nextServer.get<NotesResponse>('/notes', { params });
    return res.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw new Error('Failed to fetch notes');
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
	const res = await nextServer.get<Note>(`/notes/${id}`);
	return res.data;
}

export async function createNote(values: CreateNoteValues): Promise<Note> {
  const res = await nextServer.post<Note>('/notes', values);
  return res.data;
}

export async function deleteNote(id: number): Promise<Note> {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
}


export async function signUpUser(data: SignUpData): Promise<User> {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
}

export async function loginUser(data: LoginData): Promise<User> {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
}

export async function getUserProfile(): Promise<User> {
  const res = await nextServer.get<User>('/auth/users/me');
  return res.data;
}

export async function updateUserProfile(data: UpdateUserData): Promise<User> {
  const res = await nextServer.patch<User>('/auth/users/me', data);
  return res.data;
}

export const logout = async () => {
	const { data } = await nextServer.post('/auth/logout');
	return data;
};

export async function signIn(data: SignUpRequest) {
	const res = await nextServer.post<User>('/auth/login', data);
	return res;
}

export async function signUp(data: LoginRequest) {
	const res = await nextServer.post<User>('/auth/register', data);
	return res;
}

export const editUserData = async (userData: UserEditData) => {
	const { data } = await nextServer.patch<User>('/users/me', userData);
	return data;
};

export const editUser = async (userData: EditUserPayload) => {
	const { data } = await nextServer.patch<User>('/users/me', userData);
	return data;
};