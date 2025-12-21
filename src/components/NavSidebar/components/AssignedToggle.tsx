import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Megaphone, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  active: boolean;
  onToggle: () => void;
}

interface FilterToggleButtonProps extends ToggleProps {
  label: string;
  icon: LucideIcon;
}

function FilterToggleButton({ active, onToggle, label, icon: Icon }: FilterToggleButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onToggle}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
        active
          ? 'bg-white/5 text-foreground border border-white/10 backdrop-blur-sm shadow-sm'
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}

export function AssignedToggle(props: ToggleProps) {
  return <FilterToggleButton {...props} label="Assigned to me" icon={User} />;
}

export function RaisedByMeToggle(props: ToggleProps) {
  return <FilterToggleButton {...props} label="Raised by me" icon={Megaphone} />;
}
