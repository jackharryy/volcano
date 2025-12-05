import { motion } from 'framer-motion';
import { Clock, User, Sparkles, MessageSquare, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Ticket } from '@/types/ticket';
import { formatDistanceToNow } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
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

export function TicketCard({ ticket, isSelected, onClick }: TicketCardProps) {
  const priority = priorityConfig[ticket.priority];
  const status = statusConfig[ticket.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={cn(
        "glass-card p-4 cursor-pointer transition-all",
        isSelected && "ring-1 ring-primary/50 glow-cyan"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-medium text-foreground line-clamp-2 flex-1">
          {ticket.title}
        </h3>
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium shrink-0", priority.class)}>
          {priority.label}
        </span>
      </div>

      {/* Description Preview */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
        {ticket.description}
      </p>

      {/* AI Suggestion */}
      {ticket.suggestedTeam && ticket.suggestedConfidence && (
        <div className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span className="text-xs text-secondary">
            Suggested: {ticket.suggestedTeam} — {Math.round(ticket.suggestedConfidence * 100)}%
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn("px-2 py-0.5 rounded-full text-xs", status.class)}>
            {status.label}
          </span>
          {ticket.team && (
            <div className="flex items-center gap-1.5">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: ticket.team.color }}
              />
              <span className="text-xs text-muted-foreground">{ticket.team.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {ticket.assignee ? (
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                {ticket.assignee.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          ) : (
            <User className="w-4 h-4 text-muted-foreground/50" />
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">
              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {ticket.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
          {ticket.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {ticket.tags.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
              +{ticket.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
