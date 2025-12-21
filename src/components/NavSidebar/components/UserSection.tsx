import { Settings, LogOut } from 'lucide-react';

interface UserSectionProps {
  userName?: string;
  userEmail?: string;
  onLogout: () => Promise<void> | void;
}

export function UserSection({ userName, userEmail, onLogout }: UserSectionProps) {
  return (
    <div className="p-3 border-t border-sidebar-border">
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-medium text-primary-foreground">
          {userEmail?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {userName || 'User'}
          </p>
          <p className="text-xs text-muted-foreground truncate">{userEmail || ''}</p>
        </div>
        <button
          onClick={onLogout}
          className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
