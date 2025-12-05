import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  XCircle,
  Sparkles,
  Send,
  Paperclip,
  ExternalLink,
  MessageSquare,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ticket, Comment, TicketEvent } from '@/types/ticket';
import { comments as mockComments, events as mockEvents, currentUser } from '@/data/mockData';
import { formatDistanceToNow, format } from 'date-fns';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TicketDetailProps {
  ticket: Ticket | null;
  onClose: () => void;
  onClaim: (ticketId: string) => void;
  onResolve: (ticketId: string) => void;
  onSnooze: (ticketId: string) => void;
}

const priorityConfig = {
  urgent: { label: 'Urgent', class: 'badge-priority-urgent' },
  high: { label: 'High', class: 'badge-priority-high' },
  medium: { label: 'Medium', class: 'badge-priority-medium' },
  low: { label: 'Low', class: 'badge-priority-low' },
};

const statusConfig = {
  open: { label: 'Open', class: 'badge-status-open' },
  'in-progress': { label: 'In Progress', class: 'badge-status-in-progress' },
  resolved: { label: 'Resolved', class: 'badge-status-resolved' },
  snoozed: { label: 'Snoozed', class: 'badge-status-snoozed' },
};

export function TicketDetail({ ticket, onClose, onClaim, onResolve, onSnooze }: TicketDetailProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');
  const [newComment, setNewComment] = useState('');

  const ticketComments = mockComments.filter(c => c.ticketId === ticket?.id);
  const ticketEvents = mockEvents.filter(e => e.ticketId === ticket?.id);

  const getEventDescription = (event: TicketEvent) => {
    switch (event.eventType) {
      case 'claimed':
        return 'claimed this ticket';
      case 'assigned':
        return 'assigned this ticket';
      case 'resolved':
        return 'marked as resolved';
      case 'snoozed':
        return 'snoozed this ticket';
      case 'status_changed':
        return `changed status from ${event.payload?.from} to ${event.payload?.to}`;
      case 'priority_changed':
        return `changed priority to ${event.payload?.to}`;
      default:
        return event.eventType;
    }
  };

  return (
    <AnimatePresence>
      {ticket && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed lg:relative right-0 top-0 h-screen w-full max-w-xl bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground font-mono">#{ticket.id}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs", statusConfig[ticket.status].class)}>
                      {statusConfig[ticket.status].label}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs", priorityConfig[ticket.priority].class)}>
                      {priorityConfig[ticket.priority].label}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{ticket.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* AI Summary */}
              {ticket.summary && (
                <div className="glass-card p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-medium text-secondary">AI Summary</span>
                  </div>
                  <p className="text-sm text-foreground">{ticket.summary}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                {!ticket.assigneeId && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onClaim(ticket.id)}
                    className="gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Claim
                  </Button>
                )}
                {ticket.status !== 'resolved' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onResolve(ticket.id)}
                    className="gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Resolve
                  </Button>
                )}
                {ticket.status !== 'snoozed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSnooze(ticket.id)}
                    className="gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Snooze
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowUpRight className="w-4 h-4" />
                  Escalate
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <XCircle className="w-4 h-4" />
                  Not our team
                </Button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="p-4 border-b border-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Reporter</p>
                <p className="text-sm text-foreground">{ticket.reporterEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Assignee</p>
                <p className="text-sm text-foreground">
                  {ticket.assignee?.name || 'Unassigned'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Team</p>
                <div className="flex items-center gap-2">
                  {ticket.team && (
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: ticket.team.color }}
                    />
                  )}
                  <p className="text-sm text-foreground">
                    {ticket.team?.name || 'Unassigned'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-sm text-foreground">
                  {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('comments')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === 'comments'
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare className="w-4 h-4" />
                Comments ({ticketComments.length})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === 'activity'
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Activity className="w-4 h-4" />
                Activity ({ticketEvents.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {activeTab === 'comments' ? (
                <div className="p-4 space-y-4">
                  {ticketComments.length > 0 ? (
                    ticketComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                          {comment.user?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">
                              {comment.user?.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.body}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No comments yet</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {ticketEvents.length > 0 ? (
                    ticketEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                          {event.actor?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-foreground">{event.actor?.name}</span>
                          <span className="text-muted-foreground"> {getEventDescription(event)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No activity yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <Button size="icon" disabled={!newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
