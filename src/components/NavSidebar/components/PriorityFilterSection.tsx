import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Priority } from '@/types/ticket';
import { PriorityItem } from '../types';

interface PriorityFilterSectionProps {
  items: PriorityItem[];
  activePriorities: Priority[];
  onToggle: (priority: Priority) => void;
}

export function PriorityFilterSection({ items, activePriorities, onToggle }: PriorityFilterSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 px-3 mb-2">
        <AlertCircle className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</span>
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = activePriorities.includes(item.id);
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onToggle(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? item.activeClass
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full", item.dotClass)} />
              <span className="text-sm">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
