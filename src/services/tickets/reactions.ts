import { supabase } from '@/integrations/supabase/client';
import type { CommentReaction } from '@/types/ticket';
import { getCurrentActor, mapReaction } from './helpers';
import type { ReactionRow } from './types';

export async function upsertCommentReaction(commentId: string, reaction: CommentReaction['reaction']): Promise<CommentReaction> {
  const actor = await getCurrentActor();
  if (!actor.id) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('problem_comment_reactions')
    .upsert(
      {
        comment_id: commentId,
        user_id: actor.id,
        user_name: actor.name,
        user_email: actor.email,
        reaction_type: reaction,
      },
      { onConflict: 'comment_id,user_id' }
    )
    .select('*')
    .single();

  if (error || !data) throw error || new Error('Unable to update reaction');
  return mapReaction(data);
}

export async function removeCommentReaction(commentId: string): Promise<void> {
  const actor = await getCurrentActor();
  if (!actor.id) return;

  const { error } = await supabase
    .from('problem_comment_reactions')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', actor.id);

  if (error) throw error;
}
