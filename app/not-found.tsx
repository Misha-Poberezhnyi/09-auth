import type { Metadata } from 'next';
import css from './page.module.css';

export const metadata: Metadata = {
	title: '404 - Page Not Found | NoteHub',
	description: 'This page does not exist. You might have followed a broken link or entered a URL that doesn’t exist on this site.',
	metadataBase: new URL('https://notehub.example.com'),
	openGraph: {
		title: '404 - Page Not Found | NoteHub',
		description: 'This page does not exist. You might have followed a broken link or entered a URL that doesn’t exist on this site.',
		url: 'https://notehub.example.com/404',
		images: [
			{
				url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
				width: 1200,
				height: 630,
				alt: 'NoteHub 404 Error',
			},
		],
	},
};

export default function NotFound() {
	return (
		<div className={css.container}>
			<h1 className={css.title}>404 - Page not found</h1>
			<p className={css.description}>Sorry, the page you are looking for does not exist.</p>
		</div>
	);
}
