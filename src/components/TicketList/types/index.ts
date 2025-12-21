import type { Notification, Priority, Status, Team, Ticket } from '@/types/ticket';

export type SortKey = 'number' | 'title' | 'status' | 'priority' | 'team' | 'assignee' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'table' | 'list' | 'kanban';

export type FilterState = {
  status: Status[];
  priority: Priority[];
  teamId: string | null;
  assignedToMe: boolean;
  raisedByMe: boolean;
  createdFrom: string | null;
  createdTo: string | null;
  search: string;
};

export interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  filterState: FilterState;
  onFilterChange: (next: Partial<FilterState>) => void;
  teams: Team[];
  statusCounts: Record<Status, number>;
  notifications: Notification[];
  onNotificationsOpen: () => void;
  isLoading?: boolean;
}

export interface TicketListHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  unreadCount: number;
  notifications: Notification[];
  onNotificationsOpen: () => void;
}

export interface StatusTab {
  key: Status | 'all';
  label: string;
  count: number;
}

export interface StatusTabsProps {
  tabs: StatusTab[];
  activeKey: Status | 'all';
  onChange: (key: Status | 'all') => void;
}

export interface FilterChipsProps {
  assignedToMe: boolean;
  raisedByMe: boolean;
  priorityFilter: Priority[];
  teamFilter: string | null;
  createdFrom: string | null;
  createdTo: string | null;
  teams: Team[];
  onFilterChange: (next: Partial<FilterState>) => void;
}

export interface TicketCardProps {
  ticket: Ticket;
  hidePriority: boolean;
  hideStatus: boolean;
  hideTeam: boolean;
  isSelected: boolean;
  onSelect: (ticketId: string) => void;
}

export interface TicketTableViewProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (ticketId: string) => void;
  hideStatus: boolean;
  hidePriority: boolean;
  hideTeam: boolean;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onToggleSort: (key: SortKey) => void;
}

export interface KanbanColumnProps {
  status: Status;
  tickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  hidePriority: boolean;
  hideStatus: boolean;
  hideTeam: boolean;
  selectedTicketId: string | null;
}
