import { X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { priorityConfig, statusConfig } from '../types';
import { Ticket } from '@/types/ticket';

interface HeaderProps {
  ticket: Ticket;
  onClose: () => void;
}

export function Header({ ticket, onClose }: HeaderProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground font-mono">
              #{ticket.ticketNumber ?? ticket.id.slice(0, 8)}
            </span>
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

      {ticket.summary && (
        <div className="glass-card p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-xs font-medium text-secondary">AI Summary</span>
          </div>
          <p className="text-sm text-foreground">{ticket.summary}</p>
        </div>
      )}
    </>
  );
}
