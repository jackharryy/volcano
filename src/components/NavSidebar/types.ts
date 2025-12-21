import { Status, Priority, Team } from '@/types/ticket';
import { LucideIcon } from 'lucide-react';

export type FilterState = {
  status: Status[];
  priority: Priority[];
  teamId: string | null;
  assignedToMe: boolean;
  raisedByMe: boolean;
  createdFrom: string | null;
  createdTo: string | null;
};

export interface NavSidebarProps {
  filterState: FilterState;
  onFilterChange: (next: Partial<FilterState>) => void;
  teams: Team[];
  statusCounts: Record<Status, number>;
  isAdmin: boolean;
  onManageTeams?: () => void;
  organizationName?: string;
  onOrgSettings?: () => void;
  onLeaveOrganization?: () => Promise<void> | void;
  isTeamsLoading?: boolean;
  viewMode: 'tickets' | 'stats';
  onViewChange?: (view: 'tickets' | 'stats') => void;
}

export interface StatusItem {
  id: Status;
  label: string;
  icon: LucideIcon;
}

export interface PriorityItem {
  id: Priority;
  label: string;
  dotClass: string;
  activeClass: string;
}

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}
