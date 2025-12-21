import { useCallback, useState } from 'react';

export function useActionHandler(ticketId: string | undefined, refresh: () => Promise<void>) {
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = useCallback(async (fn: (id: string) => Promise<void> | void) => {
    if (!ticketId) return;
    setActionLoading(true);
    try {
      await fn(ticketId);
      await refresh();
    } finally {
      setActionLoading(false);
    }
  }, [ticketId, refresh]);

  return { actionLoading, handleAction };
}
