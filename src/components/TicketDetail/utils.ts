import { TicketEvent } from '@/types/ticket';

export const getEventDescription = (event: TicketEvent) => {
  switch (event.eventType) {
    case 'claimed':
      return 'claimed this ticket';
    case 'assigned':
      return 'assigned this ticket';
    case 'resolved':
      return 'marked as resolved';
    case 'snoozed':
      return 'snoozed this ticket';
    case 'escalated':
      return 'escalated priority to urgent';
    case 'not_our_team':
      return 'redirected to other teams';
    case 'status_changed':
      return `changed status from ${event.payload?.from} to ${event.payload?.to}`;
    case 'priority_changed':
      return `changed priority to ${event.payload?.to}`;
    case 'team_changed':
      return 'updated team assignments';
    case 'attachment_added':
      return `attached ${event.payload?.filename || 'a file'}`;
    case 'created':
      return 'created this ticket';
    default:
      return event.eventType;
  }
};

export const getInitials = (name?: string) => {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('');
};
