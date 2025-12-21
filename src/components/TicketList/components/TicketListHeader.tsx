import { memo } from 'react';
import { Bell, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { TicketListHeaderProps, ViewMode } from '../types';
import { cn } from '@/lib/utils';

const ViewToggle = ({ viewMode, onViewChange }: { viewMode: ViewMode; onViewChange: (mode: ViewMode) => void }) => (
  <div className="flex items-center gap-2 rounded-lg border border-border px-1 py-1 bg-muted/40">
    {([
      { key: 'table', label: 'Table' },
      { key: 'list', label: 'List' },
    ] as const).map(({ key, label }) => (
      <button
        key={key}
        onClick={() => onViewChange(key)}
        className={cn(
          'px-3 py-1 text-xs rounded-md transition-colors',
          viewMode === key
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )}
      >
        {label}
      </button>
    ))}
  </div>
);

export const TicketListHeader = memo(({ search, onSearchChange, viewMode, onViewChange, unreadCount, notifications, onNotificationsOpen }: TicketListHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3 w-full justify-between">
        <div className="w-full lg:max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search || ''}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="flex gap-x-3">
          <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />
          <DropdownMenu onOpenChange={(open) => open && onNotificationsOpen()}>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-lg border border-border hover:bg-muted/60 transition-colors">
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-destructive ring-2 ring-background" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <span className="text-xs text-muted-foreground">{notifications.length}</span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">No notifications</div>
              )}
              {notifications.map((note) => (
                <DropdownMenuItem key={note.id} className="whitespace-normal focus:bg-muted/60">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full" style={{ backgroundColor: note.unread ? '#ef4444' : '#9ca3af' }} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium line-clamp-1">{note.ticketTitle}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {note.actorName ? `${note.actorName} ` : ''}
                        {note.message}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
});

TicketListHeader.displayName = 'TicketListHeader';
