import { memo } from 'react';
import { Calendar, CircleAlert, Megaphone, X } from 'lucide-react';
import { getTeamIcon } from '@/lib/teamIcons';
import type { FilterChipsProps } from '../types';

export const FilterChips = memo(({ assignedToMe, raisedByMe, priorityFilter, teamFilter, createdFrom, createdTo, teams, onFilterChange }: FilterChipsProps) => {
  const activeTeam = teamFilter ? teams.find((team) => team.id === teamFilter) : null;
  const ActiveTeamIcon = activeTeam ? getTeamIcon(activeTeam.icon) : null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {assignedToMe && (
        <span className="px-3 py-1 rounded-full border text-xs transition-colors bg-primary/10 text-primary border-primary/40 flex items-center gap-2">
          Assigned to me
          <button
            onClick={(event) => {
              event.stopPropagation();
              onFilterChange({ assignedToMe: false });
            }}
            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {raisedByMe && (
        <span className="px-3 py-1 rounded-full border text-xs transition-colors bg-primary/10 text-primary border-primary/40 flex items-center gap-2">
          <Megaphone className="w-4 h-4" />
          Raised by me
          <button
            onClick={(event) => {
              event.stopPropagation();
              onFilterChange({ raisedByMe: false });
            }}
            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {priorityFilter.length > 0 && (
        <span className="px-3 py-1 rounded-full border text-xs transition-colors bg-primary/10 text-primary border-primary/40 flex items-center gap-2">
          <CircleAlert className="w-4 h-4" />
          {priorityFilter[0].charAt(0).toUpperCase() + priorityFilter[0].slice(1)}
          <button
            onClick={(event) => {
              event.stopPropagation();
              onFilterChange({ priority: [] });
            }}
            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {teamFilter && (
        <span className="px-3 py-1 rounded-full border text-xs transition-colors bg-primary/10 text-primary border-primary/40 flex items-center gap-2">
          {ActiveTeamIcon && <ActiveTeamIcon className="w-4 h-4" />}
          <span>{activeTeam?.name || 'Selected team'}</span>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onFilterChange({ teamId: null });
            }}
            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {(createdFrom || createdTo) && (
        <span className="px-3 py-1 rounded-full border text-xs transition-colors bg-primary/10 text-primary border-primary/40 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {createdFrom ? createdFrom : 'Any'}
            {' '}–{' '}
            {createdTo ? createdTo : 'Any'}
          </span>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onFilterChange({ createdFrom: null, createdTo: null });
            }}
            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}
    </div>
  );
});

FilterChips.displayName = 'FilterChips';
