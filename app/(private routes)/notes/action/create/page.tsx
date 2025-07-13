import CreateNote from '@/components/CreateNote/CreateNote';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Create New Note',
	description: 'Fill out the form to add a new note. Capture your thoughts, ideas, or tasks quickly and easily.',
	openGraph: {
		title: 'Create New Note',
		description: 'Fill out the form to add a new note. Capture your thoughts, ideas, or tasks quickly and easily.',
		url: 'https://08-zustand-beige.vercel.app/notes/action/create',
		images: [
			{
				url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
				width: 1200,
				height: 630,
				alt: 'Create Note',
			},
		],
	},
};

export default function CreateNotePage() {
	return <CreateNote />;
}