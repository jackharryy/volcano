import { useMemo } from 'react';
import { Priority, Status, Ticket } from '@/types/ticket';

interface Params {
  tickets: Ticket[];
  statusFilter: Status[];
  priorityFilter: Priority[];
  teamFilter: string | null;
  assignedToMe: boolean;
  raisedByMe: boolean;
  searchQuery: string;
  userId?: string;
  reporterEmail?: string | null;
  createdFrom?: string | null;
  createdTo?: string | null;
}

export function useFilteredTickets({
  tickets,
  statusFilter,
  priorityFilter,
  teamFilter,
  assignedToMe,
  raisedByMe,
  searchQuery,
  userId,
  reporterEmail,
  createdFrom,
  createdTo,
}: Params) {
  const fromTime = createdFrom ? new Date(createdFrom).setHours(0, 0, 0, 0) : null;
  const toTime = createdTo ? new Date(createdTo).setHours(23, 59, 59, 999) : null;

  const baseFilteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (priorityFilter.length > 0 && !priorityFilter.includes(ticket.priority)) {
        return false;
      }

      if (teamFilter) {
        const ticketTeamIds = ticket.teamIds || (ticket.teamId ? [ticket.teamId] : []);
        if (!ticketTeamIds.includes(teamFilter)) {
          return false;
        }
      }

      if (assignedToMe && ticket.assigneeId !== userId) {
        return false;
      }

      if (raisedByMe) {
        if (!reporterEmail) return false;
        if (ticket.reporterEmail.toLowerCase() !== reporterEmail.toLowerCase()) {
          return false;
        }
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.reporterEmail.toLowerCase().includes(query) ||
          ticket.tags.some((tag) => tag.toLowerCase().includes(query));

        if (!matchesSearch) {
          return false;
        }
      }

      if (fromTime !== null || toTime !== null) {
        const createdAtTime = new Date(ticket.createdAt).getTime();
        if (Number.isFinite(createdAtTime)) {
          if (fromTime !== null && createdAtTime < fromTime) {
            return false;
          }
          if (toTime !== null && createdAtTime > toTime) {
            return false;
          }
        }
      }

      return true;
    });
  }, [tickets, priorityFilter, teamFilter, assignedToMe, raisedByMe, searchQuery, userId, reporterEmail, fromTime, toTime]);

  const filteredTickets = useMemo(() => {
    return baseFilteredTickets.filter((ticket) => {
      if (statusFilter.length > 0 && !statusFilter.includes(ticket.status)) {
        return false;
      }
      return true;
    });
  }, [baseFilteredTickets, statusFilter]);

  const statusCounts = useMemo(() => {
    return baseFilteredTickets.reduce(
      (acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
      },
      { open: 0, 'in-progress': 0, resolved: 0, snoozed: 0 } as Record<Status, number>
    );
  }, [baseFilteredTickets]);

  return { baseFilteredTickets, filteredTickets, statusCounts };
}
