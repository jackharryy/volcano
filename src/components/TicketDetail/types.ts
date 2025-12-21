import { Ticket, Team } from '@/types/ticket';

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

export type TicketDetailTab = 'comments' | 'activity';

export interface TicketDetailProps {
  ticket: Ticket | null;
  onClose: () => void;
  onClaim: (ticketId: string) => Promise<void> | void;
  onResolve: (ticketId: string) => Promise<void> | void;
  onSnooze: (ticketId: string) => Promise<void> | void;
  onUnsnooze: (ticketId: string) => Promise<void> | void;
  onEscalate: (ticketId: string) => Promise<void> | void;
  onRedirectTeams: (ticketId: string, teamIds?: string[]) => Promise<void> | void;
  onReopen: (ticketId: string) => Promise<void> | void;
  onUnassign: (ticketId: string) => Promise<void> | void;
  onDelete: (ticketId: string) => Promise<void> | void;
  teams: Team[];
}
