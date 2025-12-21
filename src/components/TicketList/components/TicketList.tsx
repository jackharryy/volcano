import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FilterChips } from '@/components/TicketList/components/FilterChips';
import { KanbanColumn } from '@/components/TicketList/components/KanbanColumn';
import { StatusTabs } from '@/components/TicketList/components/StatusTabs';
import { TicketCard } from '@/components/TicketList/components/TicketCard';
import { TicketListEmptyState } from '@/components/TicketList/components/TicketListEmptyState';
import { TicketListHeader } from '@/components/TicketList/components/TicketListHeader';
import { TicketListLoadingState } from '@/components/TicketList/components/TicketListLoadingState';
import { TicketTableView } from '@/components/TicketList/components/TicketTableView';
import { useTicketListView } from '@/components/TicketList/hooks/useTicketListView';
import { KANBAN_STATUSES } from '@/components/TicketList/utils/constants';
import { getStatusTabs } from '@/components/TicketList/utils/statusTabs';
import type { TicketListProps } from '@/components/TicketList/types';

export function TicketList({
  tickets,
  selectedTicketId,
  onSelectTicket,
  filterState,
  onFilterChange,
  teams,
  statusCounts,
  notifications,
  onNotificationsOpen,
  isLoading = false,
}: TicketListProps) {
  const {
    status: statusFilter,
    priority: priorityFilter,
    teamId: teamFilter,
    assignedToMe,
    raisedByMe,
    createdFrom,
    createdTo,
    search,
  } = filterState;

  const hideStatus = statusFilter.length > 0;
  const hidePriority = priorityFilter.length > 0;
  const hideTeam = Boolean(teamFilter);
  const unreadCount = notifications.filter((notification) => notification.unread).length;
  const activeStatusKey = statusFilter[0] || 'all';
  const statusTabs = getStatusTabs(statusCounts);

  const {
    sortKey,
    sortDirection,
    viewMode,
    setViewMode,
    toggleSort,
    sortedTickets,
  } = useTicketListView({ tickets });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResponsiveView = () => {
      if (window.innerWidth < 1024 && viewMode === 'table') {
        setViewMode('list');
      }
    };

    handleResponsiveView();
    window.addEventListener('resize', handleResponsiveView);
    return () => window.removeEventListener('resize', handleResponsiveView);
  }, [viewMode, setViewMode]);

  const renderTicketCards = () => (
    <AnimatePresence mode="popLayout">
      {sortedTickets.map((ticket) => (
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
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen border-r border-border">
      <div className="px-4 pt-4 border-b border-border space-y-3">
        <TicketListHeader
          search={search}
          onSearchChange={(value) => onFilterChange({ search: value })}
          viewMode={viewMode}
          onViewChange={setViewMode}
          unreadCount={unreadCount}
          notifications={notifications}
          onNotificationsOpen={onNotificationsOpen}
        />

        <FilterChips
          assignedToMe={assignedToMe}
          raisedByMe={raisedByMe}
          priorityFilter={priorityFilter}
          teamFilter={teamFilter}
          createdFrom={createdFrom}
          createdTo={createdTo}
          teams={teams}
          onFilterChange={onFilterChange}
        />

        <StatusTabs
          tabs={statusTabs}
          activeKey={activeStatusKey}
          onChange={(key) => onFilterChange({ status: key === 'all' ? [] : [key] })}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin p-4">
        {isLoading ? (
          <TicketListLoadingState />
        ) : sortedTickets.length === 0 ? (
          <TicketListEmptyState />
        ) : viewMode === 'table' ? (
          <div className="w-full space-y-3">
            <TicketTableView
              tickets={sortedTickets}
              selectedTicketId={selectedTicketId}
              onSelectTicket={onSelectTicket}
              hideStatus={hideStatus}
              hidePriority={hidePriority}
              hideTeam={hideTeam}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onToggleSort={toggleSort}
            />
            <div className="lg:hidden space-y-3">{renderTicketCards()}</div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">{renderTicketCards()}</div>
        ) : (
          <div className="flex-1 flex gap-3 overflow-x-auto pb-4 items-stretch min-h-full">
            {KANBAN_STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tickets={sortedTickets.filter((ticket) => ticket.status === status)}
                onSelectTicket={onSelectTicket}
                hidePriority={hidePriority}
                hideStatus={hideStatus}
                hideTeam={hideTeam}
                selectedTicketId={selectedTicketId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
