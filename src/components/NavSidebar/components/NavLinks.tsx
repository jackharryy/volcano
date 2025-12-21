import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavItem } from '../types';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  navItems: NavItem[];
  onNavigate?: () => void;
}

export function NavLinks({ navItems, onNavigate }: NavLinksProps) {
  const location = useLocation();

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
