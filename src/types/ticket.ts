import { TeamIcon } from '@/types/team';

export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type Status = 'open' | 'in-progress' | 'resolved' | 'snoozed';
export type Source = 'web' | 'email';

export interface Team {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  slackWebhookUrl?: string;
  icon: TeamIcon;
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
  ticketNumber?: number;
  title: string;
  description: string;
  reporterEmail: string;
  reporterName?: string;
  category: string;
  priority: Priority;
  status: Status;
  assigneeId?: string;
  assignee?: User;
  teamId?: string;
  team?: Team;
  teams: Team[];
  teamIds: string[];
  createdAt: string;
  updatedAt: string;
  source: Source;
  suggestedTeam?: string;
  suggestedConfidence?: number;
  summary?: string;
  tags: string[];
  attachments?: Attachment[];
}

export interface TicketDraft {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  teamIds: string[];
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  user?: User;
  body: string;
  createdAt: string;
  reactions?: CommentReaction[];
  parentId?: string | null;
  replies?: Comment[];
}

export interface CommentReaction {
  id: string;
  commentId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  reaction: 'smile' | 'thumbs-up' | 'thumbs-down' | 'frown' | 'heart' | 'laugh';
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
  eventType: 'created' | 'assigned' | 'claimed' | 'commented' | 'resolved' | 'snoozed' | 'escalated' | 'priority_changed' | 'status_changed' | 'team_changed' | 'not_our_team' | 'attachment_added';
  payload?: Record<string, unknown>;
  createdAt: string;
}

export interface Notification {
  id: string;
  ticketId: string;
  ticketTitle: string;
  message: string;
  createdAt: string;
  actorName?: string;
  unread: boolean;
}

export interface TicketFilters {
  status?: Status[];
  priority?: Priority[];
  teamIds?: string[];
  teamId?: string;
  assigneeId?: string;
  search?: string;
}
