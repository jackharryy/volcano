import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Status } from '@/types/ticket';
import { StatusItem } from '../types';

interface StatusFilterSectionProps {
  items: StatusItem[];
  activeStatuses: Status[];
  statusCounts: Record<Status, number>;
  onToggle: (status: Status) => void;
}

export function StatusFilterSection({ items, activeStatuses, statusCounts, onToggle }: StatusFilterSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 px-3 mb-2">
        <Filter className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</span>
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeStatuses.includes(item.id);
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onToggle(item.id)}
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
              <span className="text-xs px-2 py-0.5 rounded-full bg-sidebar-accent">{statusCounts[item.id]}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
