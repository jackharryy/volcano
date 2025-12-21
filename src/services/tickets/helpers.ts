import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { defaultTeamColor } from '@/lib/organizationHelpers';
import { normalizeTeamIcon } from '@/lib/teamIcons';
import { getUserIdentity } from '@/lib/userHelpers';
import type {
  Attachment,
  Comment,
  CommentReaction,
  Priority,
  Status,
  Team,
  Ticket,
  TicketEvent,
  User,
} from '@/types/ticket';
import type {
  ActionActor,
  AttachmentRow,
  CommentRowWithRelations,
  EventRow,
  ProblemRowWithRelations,
  ProblemTeamInsert,
  ReactionRow,
} from './types';

export const ATTACHMENT_BUCKET = 'ticket-attachments';

export const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || name;

export const toPayloadRecord = (payload: EventRow['payload']): Record<string, unknown> | undefined => {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload as Record<string, unknown>;
  }
  return undefined;
};

export const mapTeam = (teamRow?: Tables<'teams'> | null): Team | undefined => {
  if (!teamRow) return undefined;

  return {
    id: teamRow.id,
    name: teamRow.name,
    slug: toSlug(teamRow.name),
    color: teamRow.color ?? defaultTeamColor,
    icon: normalizeTeamIcon(teamRow.icon),
  };
};

export const mapAssignee = (row: ProblemRowWithRelations): User | undefined => {
  if (!row.assignee_id && !row.assignee_email) return undefined;
  return {
    id: row.assignee_id || '',
    email: row.assignee_email || '',
    name: row.assignee_name || row.assignee_email?.split('@')[0] || 'User',
    role: 'member',
    teamId: row.team_id || '',
  };
};

export const mapTicket = (row: ProblemRowWithRelations): Ticket => {
  const teams = (row.problem_teams || [])
    .map((pt) => mapTeam(pt.teams))
    .filter((t): t is Team => Boolean(t));
  const team = teams[0] || mapTeam(row.teams);
  const reporterName = row.reporter_name || undefined;
  const teamIds = teams.map((t) => t.id);
  const primaryTeamId = team?.id || row.team_id || undefined;
  const assignee = mapAssignee(row);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    reporterEmail: row.reporter_email || '',
    reporterName,
    category: row.category || 'Bug',
    priority: (row.priority as Priority) || 'medium',
    status: (row.status as Status) || 'open',
    teamId: primaryTeamId,
    team,
    teams,
    teamIds,
    assigneeId: row.assignee_id || undefined,
    assignee,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    source: 'web',
    suggestedTeam: team?.slug,
    tags: [],
  };
};

export const mapReaction = (row: ReactionRow): CommentReaction => ({
  id: row.id,
  commentId: row.comment_id,
  userId: row.user_id || '',
  userName: row.user_name || row.user_email || undefined,
  userEmail: row.user_email || undefined,
  reaction: row.reaction_type as CommentReaction['reaction'],
  createdAt: row.created_at,
});

export const mapComment = (row: CommentRowWithRelations): Comment => {
  const user: User | undefined = row.user_id || row.user_email
    ? {
        id: row.user_id || '',
        email: row.user_email || '',
        name: row.user_name || row.user_email?.split('@')[0] || 'User',
        role: 'member',
        teamId: '',
      }
    : undefined;

  return {
    id: row.id,
    ticketId: row.problem_id,
    userId: row.user_id || '',
    user,
    body: row.body,
    createdAt: row.created_at,
    reactions: (row.problem_comment_reactions || []).map(mapReaction),
    parentId: row.parent_comment_id || null,
    replies: [],
  };
};

export const mapAttachment = (row: AttachmentRow): Attachment => {
  const { data } = supabase.storage.from(ATTACHMENT_BUCKET).getPublicUrl(row.storage_path);
  return {
    id: row.id,
    ticketId: row.problem_id,
    filename: row.filename,
    contentType: row.content_type,
    url: data.publicUrl,
  };
};

export const mapEvent = (row: EventRow): TicketEvent => {
  const actor: User | undefined = row.actor_id || row.actor_email
    ? {
        id: row.actor_id || '',
        email: row.actor_email || '',
        name: row.actor_name || row.actor_email?.split('@')[0] || 'User',
        role: 'member',
        teamId: '',
      }
    : undefined;

  return {
    id: row.id,
    ticketId: row.problem_id,
    actorId: row.actor_id || '',
    actor,
    eventType: row.event_type as TicketEvent['eventType'],
    payload: toPayloadRecord(row.payload),
    createdAt: row.created_at,
  };
};

export const describeEvent = (eventType: TicketEvent['eventType'], payload?: Record<string, unknown>) => {
  switch (eventType) {
    case 'claimed':
      return 'claimed your ticket';
    case 'assigned':
      return 'assigned your ticket';
    case 'resolved':
      return 'marked your ticket resolved';
    case 'snoozed':
      return 'snoozed your ticket';
    case 'escalated':
      return 'escalated your ticket to urgent';
    case 'not_our_team':
      return 'redirected your ticket';
    case 'status_changed':
      return `changed status to ${payload?.to ?? 'updated'}`;
    case 'priority_changed':
      return `changed priority to ${payload?.to ?? 'updated'}`;
    case 'team_changed':
      return 'updated the assigned teams';
    case 'commented':
      return 'added a comment';
    case 'attachment_added':
      return `attached ${payload?.filename || 'a file'}`;
    default:
      return 'updated your ticket';
  }
};

export const getCurrentActor = async (): Promise<ActionActor> => {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const identity = getUserIdentity(user ?? null);
  const name = identity.displayName || user?.email || null;

  return {
    id: user?.id || null,
    name,
    email: identity.email || null,
  };
};

export const insertEvent = async (
  problemId: string,
  actor: ActionActor,
  eventType: EventRow['event_type'],
  payload?: EventRow['payload']
) => {
  await supabase.from('problem_events').insert({
    problem_id: problemId,
    actor_id: actor.id,
    actor_name: actor.name,
    actor_email: actor.email,
    event_type: eventType,
    payload: payload ?? null,
  });
};

export const syncProblemTeams = async (problemId: string, teamIds: string[]) => {
  await supabase.from('problem_teams').delete().eq('problem_id', problemId);
  if (!teamIds.length) return;
  const rows: ProblemTeamInsert[] = teamIds.map((team_id) => ({ problem_id: problemId, team_id }));
  await supabase.from('problem_teams').insert(rows);
};

export const updateTicket = async (problemId: string, updates: Partial<Tables<'problems'>>): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('problems')
    .update(updates)
    .eq('id', problemId)
    .select('*, teams:teams!problems_team_id_fkey(*), problem_teams:problem_teams(team_id, teams:teams(*))')
    .single();

  if (error || !data) throw error || new Error('Ticket not found');
  return mapTicket(data as ProblemRowWithRelations);
};
