import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { upsertCommentReaction, removeCommentReaction } from '@/services/ticketService';
import { ActivityTab } from './ActivityTab';
import { AttachmentsSection } from './AttachmentsSection';
import { CommentInput } from './CommentInput';
import { CommentsTab, ReactionKey } from './CommentsTab';
import { DescriptionSection } from './DescriptionSection';
import { Header } from './Header';
import { MetaSection } from './MetaSection';
import { QuickActions } from './QuickActions';
import { TabsBar } from './TabsBar';
import { useActionHandler } from '../hooks/useActionHandler';
import { useTicketActivity } from '../hooks/useTicketActivity';
import { useTicketAttachments } from '../hooks/useTicketAttachments';
import { TicketDetailProps, TicketDetailTab } from '../types';

export function TicketDetail({
  ticket,
  onClose,
  onClaim,
  onResolve,
  onSnooze,
  onUnsnooze,
  onEscalate,
  onRedirectTeams,
  onReopen,
  onUnassign,
  onDelete,
  teams,
}: TicketDetailProps) {
  const [activeTab, setActiveTab] = useState<TicketDetailTab>('comments');
  const [newComment, setNewComment] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useCurrentUser();

  const {
    comments,
    events,
    loadingComments,
    loadingEvents,
    loadActivity,
    addCommentToTicket,
    deleteCommentFromTicket,
    setComments,
  } = useTicketActivity(ticket?.id);

  const {
    attachments,
    loading: loadingAttachments,
    uploading,
    loadAttachments,
    uploadAttachmentForTicket,
  } = useTicketAttachments(ticket?.id);

  const { actionLoading, handleAction } = useActionHandler(ticket?.id, loadActivity);

  useEffect(() => {
    loadActivity();
    loadAttachments();
    setActiveTab('comments');
    setNewComment('');
    setDeleteLoading(false);
  }, [ticket?.id, loadActivity, loadAttachments]);

  const handleAddComment = async () => {
    if (!ticket?.id || !newComment.trim()) return;
    setCommentSubmitting(true);
    try {
      await addCommentToTicket(newComment.trim(), null);
      setNewComment('');
      await loadActivity();
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, body: string) => {
    if (!ticket?.id || !body.trim()) return;
    await addCommentToTicket(body.trim(), parentId);
    await loadActivity();
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!ticket?.id) return;
    await deleteCommentFromTicket(commentId);
    await loadActivity();
  };

  const canDeleteTicket = Boolean(
    ticket?.reporterEmail &&
    user?.email &&
    ticket.reporterEmail.toLowerCase() === user.email.toLowerCase()
  );

  const handleDeleteTicket = async () => {
    if (!ticket?.id || !canDeleteTicket) return;
    const confirmed = window.confirm(
      'Delete this ticket permanently? This cannot be undone.'
    );
    if (!confirmed) return;

    setDeleteLoading(true);
    try {
      await onDelete(ticket.id);
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleReaction = async (commentId: string, reaction: ReactionKey) => {
    if (!user?.id) return;
    const comment = comments.find((c) => c.id === commentId);
    const existing = comment?.reactions?.find((r) => r.userId === user.id);

    try {
      if (existing && existing.reaction === reaction) {
        await removeCommentReaction(commentId);
        setComments((prev) => prev.map((c) =>
          c.id === commentId
            ? { ...c, reactions: (c.reactions || []).filter((r) => r.userId !== user.id) }
            : c
        ));
      } else {
        const saved = await upsertCommentReaction(commentId, reaction);
        setComments((prev) => prev.map((c) => {
          if (c.id !== commentId) return c;
          const others = (c.reactions || []).filter((r) => r.userId !== user.id);
          return { ...c, reactions: [...others, saved] };
        }));
      }
    } catch (err) {
      console.error('Failed to update reaction', err);
    }
  };

  const handleUploadAttachment = async (file: File) => {
    await uploadAttachmentForTicket(file);
  };

  return (
    <AnimatePresence>
      {ticket && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          />

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed lg:relative right-0 top-0 h-screen w-full max-w-xl bg-card border-l border-border z-50 flex flex-col"
          >
            <div className="p-4 border-b border-border">
              <Header ticket={ticket} onClose={onClose} />
              <QuickActions
                ticket={ticket}
                userId={user?.id}
                actionLoading={actionLoading}
                handleAction={handleAction}
                onClaim={onClaim}
                onResolve={onResolve}
                onSnooze={onSnooze}
                onUnsnooze={onUnsnooze}
                onEscalate={onEscalate}
                onRedirectTeams={onRedirectTeams}
                teams={teams}
                onReopen={onReopen}
                onUnassign={onUnassign}
                canDelete={canDeleteTicket}
                onDelete={handleDeleteTicket}
                deleteLoading={deleteLoading}
              />
            </div>

            <MetaSection ticket={ticket} />
            <DescriptionSection ticket={ticket} />

            {/* <AttachmentsSection
              attachments={attachments}
              loading={loadingAttachments}
              uploading={uploading}
              onUpload={handleUploadAttachment}
            /> */}

            <TabsBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              commentsCount={comments.length}
              eventsCount={events.length}
            />

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {activeTab === 'comments' ? (
                <CommentsTab
                  comments={comments}
                  loading={loadingComments}
                  userId={user?.id}
                  onToggleReaction={toggleReaction}
                  onReply={handleReply}
                  onDelete={handleDeleteComment}
                />
              ) : (
                <ActivityTab events={events} loading={loadingEvents} />
              )}
            </div>


            <CommentInput
              value={newComment}
              onChange={setNewComment}
              onSubmit={handleAddComment}
              submitting={commentSubmitting}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
