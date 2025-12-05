import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { TicketCard } from './TicketCard';
import { Ticket, TicketFilters } from '@/types/ticket';
import { useState } from 'react';

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  filters: TicketFilters;
  onSearchChange: (search: string) => void;
}

type SortOption = 'newest' | 'oldest' | 'priority' | 'updated';

export function TicketList({ 
  tickets, 
  selectedTicketId, 
  onSelectTicket,
  filters,
  onSearchChange 
}: TicketListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const sortedTickets = [...tickets].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'priority': {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      default:
        return 0;
    }
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Ticket Queue</h1>
            <p className="text-sm text-muted-foreground">{tickets.length} tickets</p>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="priority">Priority</option>
            <option value="updated">Recently updated</option>
          </select>
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedTickets.length > 0 ? (
            sortedTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                isSelected={ticket.id === selectedTicketId}
                onClick={() => onSelectTicket(ticket.id)}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No tickets found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
