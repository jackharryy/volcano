import { motion } from 'framer-motion';
import { 
  Inbox, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users, 
  Settings,
  Sparkles,
  User,
  Filter,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { teams, currentUser } from '@/data/mockData';
import { Status, Priority } from '@/types/ticket';

interface NavSidebarProps {
  statusFilter: Status[];
  priorityFilter: Priority[];
  teamFilter: string | null;
  assignedToMe: boolean;
  onStatusFilterChange: (status: Status[]) => void;
  onPriorityFilterChange: (priority: Priority[]) => void;
  onTeamFilterChange: (teamId: string | null) => void;
  onAssignedToMeChange: (value: boolean) => void;
}

const statusItems = [
  { id: 'open', label: 'Open', icon: Inbox, count: 3 },
  { id: 'in-progress', label: 'In Progress', icon: Clock, count: 1 },
  { id: 'resolved', label: 'Resolved', icon: CheckCircle2, count: 1 },
  { id: 'snoozed', label: 'Snoozed', icon: AlertCircle, count: 1 },
] as const;

const priorityItems = [
  { id: 'urgent', label: 'Urgent', color: 'bg-destructive' },
  { id: 'high', label: 'High', color: 'bg-orange-500' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { id: 'low', label: 'Low', color: 'bg-primary' },
] as const;

export function NavSidebar({
  statusFilter,
  priorityFilter,
  teamFilter,
  assignedToMe,
  onStatusFilterChange,
  onPriorityFilterChange,
  onTeamFilterChange,
  onAssignedToMeChange,
}: NavSidebarProps) {
  const toggleStatus = (status: Status) => {
    if (statusFilter.includes(status)) {
      onStatusFilterChange(statusFilter.filter(s => s !== status));
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  };

  const togglePriority = (priority: Priority) => {
    if (priorityFilter.includes(priority)) {
      onPriorityFilterChange(priorityFilter.filter(p => p !== priority));
    } else {
      onPriorityFilterChange([...priorityFilter, priority]);
    }
  };

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg text-foreground">Triage</span>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-6">
        {/* Assigned to Me */}
        <div>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onAssignedToMeChange(!assignedToMe)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              assignedToMe 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            )}
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">Assigned to me</span>
          </motion.button>
        </div>

        {/* Status Filter */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2">
            <Filter className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
          </div>
          <div className="space-y-1">
            {statusItems.map((item) => {
              const Icon = item.icon;
              const isActive = statusFilter.includes(item.id);
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => toggleStatus(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sidebar-accent">{item.count}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2">
            <AlertCircle className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</span>
          </div>
          <div className="space-y-1">
            {priorityItems.map((item) => {
              const isActive = priorityFilter.includes(item.id);
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => togglePriority(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full", item.color)} />
                  <span className="text-sm">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Teams */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Teams</span>
          </div>
          <div className="space-y-1">
            {teams.map((team) => {
              const isActive = teamFilter === team.id;
              return (
                <motion.button
                  key={team.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onTeamFilterChange(isActive ? null : team.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="text-sm">{team.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-medium text-primary-foreground">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
}
