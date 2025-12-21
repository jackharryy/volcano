import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Team } from '@/types/ticket';
import { getTeamIcon } from '@/lib/teamIcons';

interface TeamsSectionProps {
  teams: Team[];
  activeTeamId: string | null;
  isAdmin: boolean;
  isLoading?: boolean;
  onSelect: (teamId: string | null) => void;
  onManageTeams?: () => void;
}

export function TeamsSection({ teams, activeTeamId, isAdmin, isLoading = false, onSelect, onManageTeams }: TeamsSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 px-3 mb-2">
        <Users className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Teams</span>
        {isAdmin && onManageTeams && (
          <button
            onClick={onManageTeams}
            className="ml-auto text-xs text-primary hover:underline"
            title="Create team"
          >
            + Team
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-1">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 rounded-lg">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {teams.map((team) => {
            const isActive = activeTeamId === team.id;
            const Icon = getTeamIcon(team.icon);
            return (
              <motion.button
                key={team.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelect(isActive ? null : team.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-white/5 text-foreground border border-white/10 backdrop-blur-sm shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{team.name}</span>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
