'use client';

import { Note } from '@/types/note';
import { EditUserPayload } from '@/types/noteApi';
import { nextServer } from './api';
import { User } from '@/types/user';

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

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateUserData {
  username: string;
}

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

export async function deleteNote(id: string): Promise<Note> {
  const res = await nextServer.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function registerUser(data: SignUpRequest): Promise<User> {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
}

export async function loginUser(data: LoginRequest): Promise<User> {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
}

export async function logout(): Promise<void> {
  await nextServer.post('/auth/logout');
}

export async function checkSession(): Promise<User> {
  const res = await nextServer.get<User>('/auth/session');
  return res.data;
}

export async function getUserProfile(): Promise<User> {
  const res = await nextServer.get<User>('/users/me');
  return res.data;
}

export async function updateUserProfile(data: UpdateUserData): Promise<User> {
  const res = await nextServer.patch<User>('/users/me', data);
  return res.data;
}

export async function editUser(data: EditUserPayload): Promise<User> {
  const res = await nextServer.patch<User>('/users/me', data);
  return res.data;
}

