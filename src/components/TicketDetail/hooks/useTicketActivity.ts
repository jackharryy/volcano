import { useCallback, useState } from 'react';
import { Comment, TicketEvent } from '@/types/ticket';
import { addComment, deleteComment, fetchCommentsByTicket, fetchEventsByTicket } from '@/services/tickets/ticketService';

export function useTicketActivity(ticketId: string | undefined) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [events, setEvents] = useState<TicketEvent[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const loadActivity = useCallback(async () => {
    if (!ticketId) {
      setComments([]);
      setEvents([]);
      return;
    }

    setLoadingComments(true);
    setLoadingEvents(true);
    try {
      const [commentData, eventData] = await Promise.all([
        fetchCommentsByTicket(ticketId),
        fetchEventsByTicket(ticketId),
      ]);
      setComments(commentData);
      setEvents(eventData);
    } catch (err) {
      console.error('Failed to load ticket activity', err);
    } finally {
      setLoadingComments(false);
      setLoadingEvents(false);
    }
  }, [ticketId]);

  const addCommentToTicket = useCallback(async (body: string, parentId?: string | null) => {
    if (!ticketId) return null;
    await addComment(ticketId, body, parentId);
    const commentData = await fetchCommentsByTicket(ticketId);
    setComments(commentData);
    return commentData;
  }, [ticketId]);

  const deleteCommentFromTicket = useCallback(async (commentId: string) => {
    if (!ticketId) return null;
    await deleteComment(commentId);
    const commentData = await fetchCommentsByTicket(ticketId);
    setComments(commentData);
    return commentData;
  }, [ticketId]);

  return {
    comments,
    events,
    loadingComments,
    loadingEvents,
    loadActivity,
    addCommentToTicket,
    deleteCommentFromTicket,
    setComments,
  };
}
