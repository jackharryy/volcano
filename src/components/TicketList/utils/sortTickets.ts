import type { Ticket } from '@/types/ticket';
import type { SortDirection, SortKey } from '../types';
import { priorityOrder } from './constants';

const getSortValue = (ticket: Ticket, key: SortKey) => {
  switch (key) {
    case 'number':
      return ticket.ticketNumber ?? Number.MAX_SAFE_INTEGER;
    case 'title':
      return ticket.title.toLowerCase();
    case 'status':
      return ticket.status;
    case 'priority':
      return priorityOrder[ticket.priority];
    case 'team':
      return ticket.teams?.[0]?.name?.toLowerCase() || ticket.team?.name?.toLowerCase() || '';
    case 'assignee':
      return ticket.assignee?.name?.toLowerCase() || '';
    case 'updatedAt':
      return new Date(ticket.updatedAt).getTime();
    case 'createdAt':
    default:
      return new Date(ticket.createdAt).getTime();
  }
};

export const sortTickets = (tickets: Ticket[], sortKey: SortKey, direction: SortDirection) => {
  return [...tickets].sort((a, b) => {
    const va = getSortValue(a, sortKey);
    const vb = getSortValue(b, sortKey);

    if (va === vb) return 0;
    if (direction === 'asc') return va > vb ? 1 : -1;
    return va < vb ? 1 : -1;
  });
};
