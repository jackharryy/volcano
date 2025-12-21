import { memo } from 'react';
import { motion } from 'framer-motion';
import { getTeamIcon } from '@/lib/teamIcons';
import { cn } from '@/lib/utils';
import { priorityConfig, statusConfig, getTicketNumber } from '../utils/constants';
import type { TicketCardProps } from '../types';

export const TicketCard = memo(({ ticket, hidePriority, hideStatus, hideTeam, isSelected, onSelect }: TicketCardProps) => {
  const teamsForCard = ticket.teams || (ticket.team ? [ticket.team] : []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={() => onSelect(ticket.id)}
      className={cn(
        'p-3 rounded-lg border border-border/60 bg-card/70 backdrop-blur-sm cursor-pointer transition-colors',
        isSelected && 'ring-1 ring-primary/50 bg-card'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono text-muted-foreground">#{getTicketNumber(ticket)}</span>
        {!hidePriority && (
          <span className={cn('px-2 py-0.5 rounded-full text-xs', priorityConfig[ticket.priority].class)}>
            {priorityConfig[ticket.priority].label}
          </span>
        )}
      </div>
      <div className="text-sm font-semibold text-foreground mb-1">{ticket.title}</div>
      <div className="text-xs text-muted-foreground line-clamp-2 mb-2">{ticket.description}</div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {!hideStatus && (
          <span className={cn('px-2 py-0.5 rounded-full text-xs', statusConfig[ticket.status].class)}>
            {statusConfig[ticket.status].label}
          </span>
        )}
        {!hideTeam && teamsForCard.length > 0 && (
          <span className="flex items-center gap-2">
            {teamsForCard.map((team) => {
              const Icon = getTeamIcon(team.icon);
              return (
                <span key={team.id} className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border/60">
                  <Icon className="w-4 h-4" />
                  {team.name}
                </span>
              );
            })}
          </span>
        )}
        <span>{ticket.assignee ? ticket.assignee.name : 'Unassigned'}</span>
        <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
});

TicketCard.displayName = 'TicketCard';
