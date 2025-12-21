import { DeleteIcon, Frown, Heart, Laugh, MessageSquare, ReplyIcon, Smile, SmilePlus, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Comment } from '@/types/ticket';
import { formatDistanceToNow } from 'date-fns';
import { getInitials } from '../utils';
import { useState } from 'react';

export type ReactionKey = 'smile' | 'thumbs-up' | 'thumbs-down' | 'frown' | 'heart' | 'laugh';

interface CommentsTabProps {
  comments: Comment[];
  loading: boolean;
  userId?: string;
  onToggleReaction: (commentId: string, reaction: ReactionKey) => Promise<void> | void;
  onReply: (parentId: string, body: string) => Promise<void> | void;
  onDelete?: (commentId: string) => Promise<void> | void;
}

const reactionOptions: Array<{ key: ReactionKey; Icon: typeof Smile; className: string; label: string }> = [
  { key: 'smile', Icon: Smile, className: 'text-green-500', label: 'Smile' },
  { key: 'laugh', Icon: Laugh, className: 'text-amber-400', label: 'Laugh' },
  { key: 'heart', Icon: Heart, className: 'text-pink-500', label: 'Heart' },
  { key: 'thumbs-up', Icon: ThumbsUp, className: 'text-yellow-400', label: 'Thumbs up' },
  { key: 'thumbs-down', Icon: ThumbsDown, className: 'text-yellow-500', label: 'Thumbs down' },
  { key: 'frown', Icon: Frown, className: 'text-red-500', label: 'Frown' },
];

function CommentItem({ comment, parent, depth = 0, userId, onToggleReaction, onReply, onDelete }: { comment: Comment; parent?: Comment; depth?: number; userId?: string; onToggleReaction: (commentId: string, reaction: ReactionKey) => Promise<void> | void; onReply: (parentId: string, body: string) => Promise<void> | void; onDelete?: (commentId: string) => Promise<void> | void; }) {
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [showReactions, setShowReactions] = useState(false);

  const handleSubmit = async () => {
    if (!replyBody.trim()) return;
    await onReply(comment.id, replyBody.trim());
    setReplyBody('');
    setReplying(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    const confirmed = window.confirm('Delete this comment?');
    if (!confirmed) return;
    await onDelete(comment.id);
  };

  const reactionSummary = reactionOptions.map(({ key, Icon, className, label }) => {
    const reactors = (comment.reactions || []).filter((r) => r.reaction === key);
    const isMine = reactors.some((r) => r.userId === userId);
    const names = reactors.map((r) => r.userName || r.userEmail || 'Someone');
    return { key, Icon, className, label, reactors, isMine, count: reactors.length, names };
  });

  const sortedByCount = reactionSummary
    .filter((r) => r.count > 0)
    .sort((a, b) => (b.count === a.count ? a.label.localeCompare(b.label) : b.count - a.count));

  const topReactions = sortedByCount.slice(0, 2);
  const remaining = sortedByCount.slice(2);
  const remainingCount = remaining.reduce((sum, r) => sum + r.count, 0);
  const hasAnyReactions = sortedByCount.length > 0;

  const cardClasses = cn(
    'relative flex gap-3 rounded-lg bg-card p-3',
    depth > 0 && 'ml-4 border-l-[3px] border-border/70 pl-4'
  );

  const avatarClass = cn(
    'w-8 h-8 rounded-full bg-muted text-xs font-medium text-muted-foreground shrink-0',
    depth > 0 ? 'self-start mt-11 flex items-center justify-center' : 'flex mt-1 items-center justify-center'
  );

  return (
    <div className={cardClasses}>
      <div className={avatarClass}>
        {getInitials(comment.user?.name)}
      </div>
      <div className="flex-1 min-w-0">
{parent && (
  <div className="mb-2 pl-3 border-l-2 border-border/50 text-xs text-muted-foreground">
    <span className="font-medium text-foreground">{parent.user?.name || 'Comment'}</span>
    <div className="line-clamp-2">{parent.body}</div>
  </div>
)}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">
            {comment.user?.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{comment.body}</p>
<div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
  <button
    onClick={() => setReplying((prev) => !prev)}
    className="font-medium text-primary hover:underline hover:text-primary/80"
  >
    <ReplyIcon className="w-3.5 h-3.5 inline-block" />
  </button>

  {userId && comment.userId === userId && onDelete && (
    <button
      onClick={handleDelete}
      className="text-destructive hover:underline hover:text-destructive/80"
    >
      <Trash2 className="w-3.5 h-3.5 inline-block" />
    </button>
  )}

  <div className="flex items-center">
    <button
      className="hover:text-foreground transition"
      onClick={() => setShowReactions((prev) => !prev)}
    >
      <SmilePlus className='w-3.5 h-3.5' />
    </button>

    {showReactions && (
        <div className="absolute z-10 top-0 left-full ml-2 gap-2 rounded-md border border-border bg-popover p-3 shadow-lg min-w-[12rem]">
        {reactionOptions.map(({ key, Icon, className, label }) => (
          <button
            key={key}
            onClick={() => {
              setShowReactions(false);
              onToggleReaction(comment.id, key);
            }}
            className="flex items-center gap-2 px-3 py-1 rounded-md text-sm hover:bg-muted transition-colors whitespace-nowrap"
          >
            <Icon className={cn('h-4 w-4', className)} />
            <span className="leading-tight">{label}</span>
          </button>
        ))}
      </div>
    )}
  </div>

  <div className="flex items-center gap-2">
    {topReactions.map(({ key, Icon, className, count, isMine, names }) => (
      <Tooltip key={key}>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 border text-xs transition-colors",
              isMine
                ? "border-primary/60 bg-primary/10 text-primary"
                : "border-border hover:border-foreground/40 hover:text-foreground"
            )}
            onClick={() => onToggleReaction(comment.id, key)}
          >
            <Icon className={cn("h-3.5 w-3.5", className)} />
            {count}
          </button>
        </TooltipTrigger>

        <TooltipContent>
          <p className="text-xs">{names.join(", ")}</p>
        </TooltipContent>
      </Tooltip>
    ))}

    {remainingCount > 0 && (
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground transition">
            +{remainingCount}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {remaining.map((r) => (
            <div key={r.key} className="flex items-center gap-1 text-xs">
              <r.Icon className={cn("h-3.5 w-3.5", r.className)} />
              {r.count}
            </div>
          ))}
        </TooltipContent>
      </Tooltip>
    )}
  </div>
</div>

        {replying && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button
              className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs"
              onClick={handleSubmit}
              disabled={!replyBody.trim()}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentsTab({ comments, loading, userId, onToggleReaction, onReply, onDelete }: CommentsTabProps) {
  if (loading) {
    return <div className="p-4 text-center py-8 text-sm text-muted-foreground">Loading comments...</div>;
  }

  if (comments.length === 0) {
    return (
      <div className="p-4 text-center py-8">
        <MessageSquare className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No comments yet</p>
      </div>
    );
  }

  const flat: Array<{ comment: Comment; parent?: Comment; depth: number }> = [];
  const walk = (nodes: Comment[], parent?: Comment, depth = 0) => {
    nodes.forEach((c) => {
      flat.push({ comment: c, parent, depth });
      if (c.replies && c.replies.length) {
        walk(c.replies, c, depth + 1);
      }
    });
  };
  walk(comments);

  return (
    <div className="p-4 space-y-4">
      {flat.map(({ comment, parent, depth }) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          parent={parent}
          depth={depth}
          userId={userId}
          onToggleReaction={onToggleReaction}
          onReply={onReply}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
