import { Note } from "./note"

export type EditUserPayload = {
  email: string;
  username: string;
};

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type User = {
  username: string;
  email: string;
  avatar: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
}

export interface RegisterFormValues {
  email: string;
  password: string;
}

export type SessionValidationResult = {
  success: boolean;
};

export type FormType = {
  username: string;
};