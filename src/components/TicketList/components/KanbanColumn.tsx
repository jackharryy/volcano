import { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { KanbanColumnProps } from '../types';
import { statusConfig } from '../utils/constants';
import { TicketCard } from './TicketCard';

export const KanbanColumn = memo(({ status, tickets, onSelectTicket, hidePriority, hideStatus, hideTeam, selectedTicketId }: KanbanColumnProps) => (
  <div className="min-w-[280px] max-w-[340px] flex-1 bg-muted/40 rounded-lg border border-border/70 p-3 flex flex-col gap-3 h-full">
    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wide">
      <span>{statusConfig[status].label}</span>
      <span className="px-2 py-0.5 rounded-full bg-background text-foreground text-[11px]">{tickets.length}</span>
    </div>
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            hidePriority={hidePriority}
            hideStatus={hideStatus}
            hideTeam={hideTeam}
            isSelected={selectedTicketId === ticket.id}
            onSelect={onSelectTicket}
          />
        ))}
      </AnimatePresence>
    </div>
  </div>
));

KanbanColumn.displayName = 'KanbanColumn';
