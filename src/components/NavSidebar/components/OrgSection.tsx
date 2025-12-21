import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface OrgSectionProps {
  organizationName?: string;
  isAdmin: boolean;
  onOrgSettings?: () => void;
  onLeaveOrganization?: () => Promise<void> | void;
  borderPosition?: 'top' | 'bottom' | 'both' | 'none';
}

const borderClass = {
  top: 'border-t border-sidebar-border',
  bottom: 'border-b border-sidebar-border',
  both: 'border-y border-sidebar-border',
  none: '',
} as const;

export function OrgSection({
  organizationName,
  isAdmin,
  onOrgSettings,
  onLeaveOrganization,
  borderPosition = 'bottom',
}: OrgSectionProps) {
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleConfirmLeave = async () => {
    if (!onLeaveOrganization) return;
    setIsLeaving(true);
    try {
      await onLeaveOrganization();
      setLeaveDialogOpen(false);
    } catch (error) {
      console.error('Failed to leave organization', error);
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <div className={`p-4 flex items-center justify-between gap-3 ${borderClass[borderPosition]}`}>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Organization</p>
        <p className="text-sm font-medium text-foreground truncate">{organizationName || 'Organization'}</p>
      </div>
      <div className="flex items-center gap-2">
        {onLeaveOrganization && !isAdmin && (
          <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                className="text-xs px-2 py-1 rounded-md border border-destructive/40 text-destructive hover:border-destructive hover:text-destructive transition-colors"
              >
                Leave
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave organization?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will lose access to all teams and tickets in this organization. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLeaving}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmLeave}
                  disabled={isLeaving}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isLeaving ? 'Leaving…' : 'Leave organization'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {isAdmin && (
          <button
            onClick={onOrgSettings}
            disabled={!onOrgSettings}
            className="text-xs px-2 py-1 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-60"
            title={onOrgSettings ? 'Open org settings' : 'Org settings coming soon'}
          >
            Settings
          </button>
        )}
      </div>
    </div>
  );
}
