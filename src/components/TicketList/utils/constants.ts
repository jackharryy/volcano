import type { Priority, Status, Ticket } from '@/types/ticket';

export const priorityConfig = {
  urgent: { label: 'Urgent', class: 'badge-priority-urgent' },
  high: { label: 'High', class: 'badge-priority-high' },
  medium: { label: 'Medium', class: 'badge-priority-medium' },
  low: { label: 'Low', class: 'badge-priority-low' },
} as const;

export const statusConfig = {
  open: { label: 'Open', class: 'badge-status-open' },
  'in-progress': { label: 'In Progress', class: 'badge-status-in-progress' },
  resolved: { label: 'Resolved', class: 'badge-status-resolved' },
  snoozed: { label: 'Snoozed', class: 'badge-status-snoozed' },
} as const;

export const priorityOrder: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const KANBAN_STATUSES: Status[] = ['open', 'in-progress', 'snoozed', 'resolved'];

export const getTicketNumber = (ticket: Ticket) => ticket.ticketNumber ?? ticket.id.slice(0, 8);
