export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type Status = 'open' | 'in-progress' | 'resolved' | 'snoozed';
export type Source = 'web' | 'email';

export interface Team {
  id: string;
  name: string;
  slug: string;
  slackWebhookUrl?: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'admin' | 'member';
  teamId: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  reporterEmail: string;
  category: string;
  priority: Priority;
  status: Status;
  assigneeId?: string;
  assignee?: User;
  teamId?: string;
  team?: Team;
  createdAt: string;
  updatedAt: string;
  source: Source;
  suggestedTeam?: string;
  suggestedConfidence?: number;
  summary?: string;
  tags: string[];
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  user?: User;
  body: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  ticketId: string;
  url: string;
  filename: string;
  contentType: string;
}

export interface TicketEvent {
  id: string;
  ticketId: string;
  actorId: string;
  actor?: User;
  eventType: 'created' | 'assigned' | 'claimed' | 'commented' | 'resolved' | 'snoozed' | 'escalated' | 'priority_changed' | 'status_changed';
  payload?: Record<string, unknown>;
  createdAt: string;
}

export interface TicketFilters {
  status?: Status[];
  priority?: Priority[];
  teamId?: string;
  assigneeId?: string;
  search?: string;
}
