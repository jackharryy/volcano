import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import type { Priority } from '@/types/ticket';

export interface CreateTicketInput {
  title: string;
  description: string;
  reporterEmail: string;
  category: string;
  priority: Priority;
  teamIds: string[];
}

export type ProblemTeamRow = Tables<'problem_teams'> & {
  teams?: Tables<'teams'> | null;
};

export type ProblemRowWithRelations = Tables<'problems'> & {
  teams?: Tables<'teams'> | null;
  problem_teams?: ProblemTeamRow[] | null;
};

export type CommentRow = Tables<'problem_comments'>;
export type CommentRowWithRelations = CommentRow & {
  problem_comment_reactions?: Tables<'problem_comment_reactions'>[] | null;
};

export type EventRow = Tables<'problem_events'>;
export type AttachmentRow = Tables<'problem_attachments'>;
export type ReactionRow = Tables<'problem_comment_reactions'>;

export type NotificationRow = Tables<'problem_events'> & {
  problems: Pick<Tables<'problems'>, 'title' | 'reporter_email'> | null;
};

export type ProblemTeamInsert = TablesInsert<'problem_teams'>;

export interface ActionActor {
  id: string | null;
  name: string | null;
  email: string | null;
}
