import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

import { Roboto } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-roboto',
	display: 'swap'
})

export const metadata: Metadata = {
	title: 'NoteHub',
	description: 'A note-taking app built with Next.js',
	openGraph: {
		title: 'NoteHub',
		description: 'A note-taking app built with Next.js',
		url: 'https://notehub.example.com',
		images: [
			{
				url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
				width: 1200,
				height: 630,
				alt: 'NoteHub Open Graph Image',
			},
		],
	},
};

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<html lang="en" className={roboto.variable}>
			<body>
				<TanStackProvider>
					<AuthProvider>
						<Header />
						{children}
						{modal}
						<Footer />
					</AuthProvider>
				</TanStackProvider>
			</body>
		</html>
	);
}
