import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTeamIcon } from '@/lib/teamIcons';
import { priorityConfig, statusConfig } from '../utils/constants';
import type { SortKey, TicketTableViewProps } from '../types';

const columnClasses: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
  7: 'col-span-7',
};

const SortIcon = ({ active, direction }: { active: boolean; direction: 'asc' | 'desc' }) => {
  const activeClass = 'text-orange-500';
  const inactiveClass = 'text-muted-foreground';
  if (!active) return <ArrowUpDown className={cn('w-4 h-4', inactiveClass)} />;
  return direction === 'asc' ? (
    <ArrowUp className={cn('w-4 h-4', activeClass)} />
  ) : (
    <ArrowDown className={cn('w-4 h-4', activeClass)} />
  );
};

const baseSpans = {
  number: 1,
  title: 3,
  status: 1,
  priority: 1,
  team: 2,
  assignee: 2,
  createdAt: 1,
  updatedAt: 1,
} as const;

const getColumns = (hideStatus: boolean, hidePriority: boolean, hideTeam: boolean) => {
  const titleSpan = baseSpans.title + (hideStatus ? baseSpans.status : 0) + (hidePriority ? baseSpans.priority : 0) + (hideTeam ? baseSpans.team : 0);

  const columns: { key: SortKey; label: string; span: number }[] = [
    { key: 'number', label: '#', span: baseSpans.number },
    { key: 'title', label: 'Title', span: titleSpan },
    ...(hideStatus ? [] : [{ key: 'status' as SortKey, label: 'Status', span: baseSpans.status }]),
    ...(hidePriority ? [] : [{ key: 'priority' as SortKey, label: 'Priority', span: baseSpans.priority }]),
    ...(hideTeam ? [] : [{ key: 'team' as SortKey, label: 'Team', span: baseSpans.team }]),
    { key: 'assignee', label: 'Assignee', span: baseSpans.assignee },
    { key: 'createdAt', label: 'Created', span: baseSpans.createdAt },
    { key: 'updatedAt', label: 'Updated', span: baseSpans.updatedAt },
  ];

  return { columns, titleSpan };
};

export const TicketTableView = memo(({ tickets, selectedTicketId, onSelectTicket, hideStatus, hidePriority, hideTeam, sortKey, sortDirection, onToggleSort }: TicketTableViewProps) => {
  const { columns, titleSpan } = getColumns(hideStatus, hidePriority, hideTeam);

  return (
    <div className="hidden lg:block overflow-x-auto">
      <div className="min-w-[1100px]">
        <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground px-3 pb-2">
          {columns.map(({ key, label, span }) => {
            const isActive = sortKey === key;
            return (
              <button
                key={key}
                className={cn(
                  'flex items-center gap-1 justify-start py-1 transition-colors',
                  columnClasses[span],
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => onToggleSort(key)}
              >
                <span>{label}</span>
                <SortIcon active={isActive} direction={sortDirection} />
              </button>
            );
          })}
        </div>

        <div className="divide-y divide-border/60 rounded-lg border border-border/60 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {tickets.map((ticket) => {
              const teams = ticket.teams || (ticket.team ? [ticket.team] : []);

              return (
                <motion.div
                  key={ticket.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onSelectTicket(ticket.id)}
                  className={cn(
                    'grid grid-cols-12 items-center px-3 py-3 text-sm cursor-pointer hover:bg-muted/40 transition-colors',
                    selectedTicketId === ticket.id && 'bg-muted/60'
                  )}
                >
                  <div className={cn(columnClasses[baseSpans.number], 'font-mono text-xs text-muted-foreground')}>
                    #{ticket.ticketNumber ?? ticket.id.slice(0, 8)}
                  </div>
                  <div className={cn(columnClasses[titleSpan], 'font-medium text-foreground line-clamp-2')}>
                    {ticket.title}
                  </div>
                  {!hideStatus && (
                    <div className={columnClasses[baseSpans.status]}>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs', statusConfig[ticket.status].class)}>
                        {statusConfig[ticket.status].label}
                      </span>
                    </div>
                  )}
                  {!hidePriority && (
                    <div className={columnClasses[baseSpans.priority]}>
                      <span className={cn('px-2 py-0.5 rounded-full text-xs', priorityConfig[ticket.priority].class)}>
                        {priorityConfig[ticket.priority].label}
                      </span>
                    </div>
                  )}
                  {!hideTeam && (
                    <div className={columnClasses[baseSpans.team]}>
                      {teams.length ? (
                        <div className="flex flex-wrap gap-2 text-muted-foreground">
                          {teams.map((team) => {
                            const Icon = getTeamIcon(team.icon);
                            return (
                              <span key={team.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border/60 text-xs">
                                <Icon className="w-4 h-4" />
                                {team.name}
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  )}
                  <div className={cn(columnClasses[baseSpans.assignee], 'text-muted-foreground')}>
                    {ticket.assignee ? ticket.assignee.name : 'Unassigned'}
                  </div>
                  <div className={cn(columnClasses[baseSpans.createdAt], 'text-muted-foreground text-xs')}>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </div>
                  <div className={cn(columnClasses[baseSpans.updatedAt], 'text-muted-foreground text-xs')}>
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});

TicketTableView.displayName = 'TicketTableView';
