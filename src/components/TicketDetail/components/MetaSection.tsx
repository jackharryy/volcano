import { format } from 'date-fns';
import { Ticket } from '@/types/ticket';
import { getTeamIcon } from '@/lib/teamIcons';

interface MetaSectionProps {
  ticket: Ticket;
}

export function MetaSection({ ticket }: MetaSectionProps) {
  const teams = ticket.teams || (ticket.team ? [ticket.team] : []);
  const reporterName = ticket.reporterName || ticket.reporterEmail?.split('@')[0] || 'Reporter';

  return (
    <div className="p-4 border-b border-border grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Reporter</p>
        <p className="text-sm text-foreground">{reporterName}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">Assignee</p>
        <p className="text-sm text-foreground">
          {ticket.assignee?.name || 'Unassigned'}
        </p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">{teams.length > 1 ? 'Teams' : 'Team'}</p>
        {teams.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {teams.map((team) => {
              const TeamIcon = getTeamIcon(team.icon);
              return (
                <span key={team.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-border/60 text-xs">
                  <TeamIcon className="w-4 h-4" />
                  {team.name}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-foreground">Unassigned</p>
        )}
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">Created</p>
        <p className="text-sm text-foreground">
          {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}
        </p>
      </div>
    </div>
  );
}
