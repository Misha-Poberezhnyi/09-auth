import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi'; 
import NotePreviewClient from '@/app/@modal/(.)notes/[id]/NotePreview.client'; 

interface NotePageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePage(props: NotePageProps) {
  const resolvedParams = await props.params;
  const { id } = resolvedParams;
  const queryClient = new QueryClient();


  await queryClient.prefetchQuery({
    queryKey: ['note', id], 
    queryFn: () => fetchNoteById(id), 
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />  
    </HydrationBoundary>
  );
}
