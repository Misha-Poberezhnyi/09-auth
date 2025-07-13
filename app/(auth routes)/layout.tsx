'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import QueryStatus from '@/components/QueryStatus/QueryStatus';

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.refresh();
    setLoading(false);
  }, [router]);

  return (
    <div>
      <header />
      {loading ? (
        <QueryStatus
          isLoading={true}
          isError={false}
          isEmpty={false}
          emptyMessage=""
        />
      ) : (
        children
      )}
    </div>
  );
}
