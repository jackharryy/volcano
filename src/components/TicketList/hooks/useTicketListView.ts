import { useCallback, useMemo, useState } from 'react';
import type { Ticket } from '@/types/ticket';
import type { SortDirection, SortKey, ViewMode } from '../types';
import { sortTickets } from '../utils/sortTickets';

interface UseTicketListViewParams {
  tickets: Ticket[];
  initialSortKey?: SortKey;
  initialSortDirection?: SortDirection;
  initialViewMode?: ViewMode;
}

export const useTicketListView = ({
  tickets,
  initialSortKey = 'createdAt',
  initialSortDirection = 'desc',
  initialViewMode = 'table',
}: UseTicketListViewParams) => {
  const [sortKey, setSortKey] = useState<SortKey>(initialSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const sortedTickets = useMemo(() => sortTickets(tickets, sortKey, sortDirection), [tickets, sortKey, sortDirection]);

  const toggleSort = useCallback((key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }, [sortKey]);

  return {
    sortKey,
    sortDirection,
    viewMode,
    setViewMode,
    toggleSort,
    sortedTickets,
  };
};
