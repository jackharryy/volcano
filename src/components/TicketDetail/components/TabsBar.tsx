import { Activity, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TicketDetailTab } from '../types';

interface TabsBarProps {
  activeTab: TicketDetailTab;
  onTabChange: (tab: TicketDetailTab) => void;
  commentsCount: number;
  eventsCount: number;
}

export function TabsBar({ activeTab, onTabChange, commentsCount, eventsCount }: TabsBarProps) {
  return (
    <div className="flex border-b border-border">
      <button
        onClick={() => onTabChange('comments')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
          activeTab === 'comments'
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <MessageSquare className="w-4 h-4" />
        Comments ({commentsCount})
      </button>
      <button
        onClick={() => onTabChange('activity')}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
          activeTab === 'activity'
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Activity className="w-4 h-4" />
        Activity ({eventsCount})
      </button>
    </div>
  );
}
