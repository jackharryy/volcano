import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Priority, Status, Team } from '@/types/ticket';

export interface FilterState {
  status: Status[];
  priority: Priority[];
  teamId: string | null;
  assignedToMe: boolean;
  raisedByMe: boolean;
  createdFrom: string | null;
  createdTo: string | null;
  search: string;
}

export function useTicketFilters(teams: Team[]) {
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [raisedByMe, setRaisedByMe] = useState(false);
  const [createdFrom, setCreatedFrom] = useState<string | null>(null);
  const [createdTo, setCreatedTo] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filtersLoaded = useRef(false);

  useEffect(() => {
    if (filtersLoaded.current) return;
    const raw = localStorage.getItem('cq.filterConfig');
    if (!raw) {
      filtersLoaded.current = true;
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<FilterState>;
      if (Array.isArray(parsed.status)) setStatusFilter(parsed.status as Status[]);
      if (Array.isArray(parsed.priority)) setPriorityFilter(parsed.priority as Priority[]);
      if (typeof parsed.teamId === 'string' || parsed.teamId === null) setTeamFilter(parsed.teamId ?? null);
      if (typeof parsed.assignedToMe === 'boolean') setAssignedToMe(parsed.assignedToMe);
      if (typeof parsed.raisedByMe === 'boolean') setRaisedByMe(parsed.raisedByMe);
      if (typeof parsed.createdFrom === 'string') setCreatedFrom(parsed.createdFrom);
      if (typeof parsed.createdTo === 'string') setCreatedTo(parsed.createdTo);
      if (typeof parsed.search === 'string') setSearchQuery(parsed.search);
    } catch (error) {
      console.warn('Failed to parse saved filters', error);
    } finally {
      filtersLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!filtersLoaded.current) return;
    const payload: Partial<FilterState> = {
      status: statusFilter,
      priority: priorityFilter,
      teamId: teamFilter,
      assignedToMe,
      raisedByMe,
      search: searchQuery,
      createdFrom,
      createdTo,
    };
    localStorage.setItem('cq.filterConfig', JSON.stringify(payload));
  }, [statusFilter, priorityFilter, teamFilter, assignedToMe, raisedByMe, createdFrom, createdTo, searchQuery]);

  useEffect(() => {
    if (!teamFilter || teams.length === 0) return;
    const exists = teams.some((team) => team.id === teamFilter);
    if (!exists) {
      setTeamFilter(null);
    }
  }, [teamFilter, teams]);

  const handleFilterChange = useCallback((next: Partial<FilterState>) => {
    if ('status' in next && next.status) setStatusFilter(next.status);
    if ('priority' in next && next.priority) setPriorityFilter(next.priority);
    if ('teamId' in next) setTeamFilter(next.teamId ?? null);
    if ('assignedToMe' in next) setAssignedToMe(Boolean(next.assignedToMe));
    if ('raisedByMe' in next) setRaisedByMe(Boolean(next.raisedByMe));
    if ('createdFrom' in next) setCreatedFrom(next.createdFrom ? next.createdFrom : null);
    if ('createdTo' in next) setCreatedTo(next.createdTo ? next.createdTo : null);
    if ('search' in next && typeof next.search === 'string') setSearchQuery(next.search);
  }, []);

  const filterState = useMemo(
    () => ({
      status: statusFilter,
      priority: priorityFilter,
      teamId: teamFilter,
      assignedToMe,
      raisedByMe,
      createdFrom,
      createdTo,
      search: searchQuery,
    }),
    [statusFilter, priorityFilter, teamFilter, assignedToMe, raisedByMe, createdFrom, createdTo, searchQuery]
  );

  return {
    statusFilter,
    priorityFilter,
    teamFilter,
    assignedToMe,
    raisedByMe,
    createdFrom,
    createdTo,
    searchQuery,
    setSearchQuery,
    handleFilterChange,
    filterState,
  };
}
