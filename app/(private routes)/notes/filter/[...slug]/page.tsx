import { fetchNotes } from '@/lib/api/clientApi';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Note } from '@/types/note';
import { Metadata } from 'next';

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: NotesProps): Promise<Metadata> {
  const { slug } = await params;

  const title = slug[0] === 'all' ? 'All notes' : slug[0];
  const description = `This page contains notes from the category ${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-beige.vercel.app/notes/filter/${slug[0]}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Notes',
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;

  const queryClient = new QueryClient();
  const initialQuery: string = '';
  const initialPage: number = 1;
  const tag: string = slug[0] === 'all' ? '' : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ['notes', initialQuery, initialPage, tag],
    queryFn: () => fetchNotes(initialQuery, initialPage, tag),
  });

  const initialData = queryClient.getQueryData(['notes', initialQuery, initialPage, tag]) as {
    notes: Note[];
    totalPages: number;
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient query={initialQuery} page={initialPage} initialData={initialData} tag={tag} />
    </HydrationBoundary>
  );
}

export const dynamic = 'force-dynamic';
