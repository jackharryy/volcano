import {
  Activity as ActivityIcon,
  MessageSquare,
  HandHeart,
  CheckCircle2,
  AlarmClockOff,
  ArrowUpRight,
  RefreshCw,
  Flame,
  Upload,
  Users,
  CircleAlert,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { TicketEvent } from '@/types/ticket';
import { getEventDescription, getInitials } from '../utils';
import { cn } from '@/lib/utils';

interface ActivityTabProps {
  events: TicketEvent[];
  loading: boolean;
}

export function ActivityTab({ events, loading }: ActivityTabProps) {
  const eventIconMap: Record<
    TicketEvent['eventType'],
    { Icon: typeof ActivityIcon; className?: string }
  > = {
    created: { Icon: ActivityIcon, className: 'text-primary' },
    commented: { Icon: MessageSquare, className: 'text-primary' },
    claimed: { Icon: HandHeart, className: 'text-emerald-500' },
    resolved: { Icon: CheckCircle2, className: 'text-emerald-500' },
    snoozed: { Icon: AlarmClockOff, className: 'text-amber-500' },
    escalated: { Icon: Flame, className: 'text-red-500' },
    not_our_team: { Icon: ArrowUpRight, className: 'text-blue-500' },
    status_changed: { Icon: RefreshCw, className: 'text-muted-foreground' },
    priority_changed: { Icon: RefreshCw, className: 'text-muted-foreground' },
    team_changed: { Icon: Users, className: 'text-indigo-500' },
    assigned: { Icon: HandHeart, className: 'text-emerald-500' },
    attachment_added: { Icon: Upload, className: 'text-primary' },
  };

  if (loading) {
    return <div className="p-4 text-center py-8 text-sm text-muted-foreground">Loading activity...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="p-4 text-center py-8">
        <ActivityIcon className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {events.map((event) => (
        <div key={event.id} className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
            {getInitials(event.actor?.name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {(() => {
                const entry = eventIconMap[event.eventType] || { Icon: CircleAlert, className: 'text-muted-foreground' };
                const { Icon, className } = entry;
                return <Icon className={cn('w-4 h-4 text-muted-foreground', className)} />;
              })()}
              <div>
                <span className="font-medium text-foreground">{event.actor?.name}</span>
                <span className="text-muted-foreground"> {getEventDescription(event)}</span>
              </div>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
          </span>
        </div>
      ))}
    </div>
  );
}
