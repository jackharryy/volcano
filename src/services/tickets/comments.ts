import { supabase } from '@/integrations/supabase/client';
import type { Comment } from '@/types/ticket';
import { getCurrentActor, insertEvent, mapComment } from './helpers';
import type { CommentRow, CommentRowWithRelations } from './types';

export async function fetchCommentsByTicket(ticketId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('problem_comments')
    .select('*, problem_comment_reactions(*)')
    .eq('problem_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  const flat = (data || []).map(mapComment);

  const byId = new Map<string, Comment>();
  flat.forEach((c) => byId.set(c.id, { ...c, replies: [] }));
  const roots: Comment[] = [];

  byId.forEach((comment) => {
    if (comment.parentId && byId.has(comment.parentId)) {
      byId.get(comment.parentId)!.replies!.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}

export async function addComment(ticketId: string, body: string, parentId?: string | null): Promise<Comment> {
  const actor = await getCurrentActor();
  const { data, error } = await supabase
    .from('problem_comments')
    .insert({
      problem_id: ticketId,
      body,
      user_id: actor.id,
      user_name: actor.name,
      user_email: actor.email,
      parent_comment_id: parentId || null,
    })
    .select('*')
    .single();

  if (error || !data) throw error || new Error('Unable to add comment');
  const comment = mapComment({ ...data, problem_comment_reactions: [] });
  await insertEvent(ticketId, actor, 'commented', { comment_id: comment.id });
  return comment;
}

export async function deleteComment(commentId: string): Promise<void> {
  const actor = await getCurrentActor();
  if (!actor.id) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('problem_comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', actor.id);

  if (error) throw error;
}
