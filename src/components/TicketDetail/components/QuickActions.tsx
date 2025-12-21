import { ArrowUpRight, CheckCircle2, Clock, Trash2, UserPlus, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ticket, Team } from '@/types/ticket';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface QuickActionsProps {
  ticket: Ticket;
  userId?: string;
  actionLoading: boolean;
  handleAction: (fn: (id: string) => Promise<void> | void) => Promise<void> | void;
  onClaim: (ticketId: string) => Promise<void> | void;
  onResolve: (ticketId: string) => Promise<void> | void;
  onSnooze: (ticketId: string) => Promise<void> | void;
  onUnsnooze: (ticketId: string) => Promise<void> | void;
  onEscalate: (ticketId: string) => Promise<void> | void;
  onRedirectTeams?: (ticketId: string, teamIds?: string[]) => Promise<void> | void;
  onReopen: (ticketId: string) => Promise<void> | void;
  onUnassign: (ticketId: string) => Promise<void> | void;
  onDelete?: (ticketId: string) => Promise<void> | void;
  canDelete?: boolean;
  deleteLoading?: boolean;
  teams?: Team[];
}

export function QuickActions({
  ticket,
  userId,
  actionLoading,
  handleAction,
  onClaim,
  onResolve,
  onSnooze,
  onUnsnooze,
  onEscalate,
  onRedirectTeams,
  onReopen,
  onUnassign,
  onDelete,
  canDelete = false,
  deleteLoading = false,
  teams = [],
}: QuickActionsProps) {
  const deleteButton = canDelete && onDelete ? (
    <Button
      variant="destructive"
      size="sm"
      className="gap-2"
      onClick={() => onDelete(ticket.id)}
      disabled={deleteLoading || actionLoading}
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </Button>
  ) : null;

  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [initialTeamIds, setInitialTeamIds] = useState<string[]>([]);

  const toggleTeam = (id: string) => {
    setSelectedTeamIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const sameSet = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const s = new Set(a);
    return b.every((v) => s.has(v));
  };

  const openRedirectModal = () => {
    const current = ticket?.teamIds?.length
      ? ticket.teamIds
      : ticket?.team
        ? [ticket.team.id]
        : [];
    setInitialTeamIds(current || []);
    setSelectedTeamIds(current || []);
    setShowRedirectModal(true);
  };

  if (ticket.status === 'resolved') {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => handleAction(onReopen)}
          className="gap-2"
          disabled={actionLoading}
        >
          <ArrowUpRight className="w-4 h-4" />
          Reopen
        </Button>
        {deleteButton}
      </div>
    );
  }

  if (ticket.status === 'snoozed') {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => handleAction(onUnsnooze)}
          className="gap-2"
          disabled={actionLoading}
        >
          <Clock className="w-4 h-4" />
          Resume Work
        </Button>
        {deleteButton}
      </div>
    );
  }

  if (ticket.status === 'open' && ticket.assigneeId !== userId) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => handleAction(onClaim)}
          className="gap-2"
          disabled={actionLoading}
        >
          <UserPlus className="w-4 h-4" />
          Claim
        </Button>
        {deleteButton}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {!ticket.assigneeId && (
        <Button
          variant="default"
          size="sm"
          onClick={() => handleAction(onClaim)}
          className="gap-2"
          disabled={actionLoading}
        >
          <UserPlus className="w-4 h-4" />
          Claim
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction(onResolve)}
        className="gap-2 text-green-500 border-green-500 hover:bg-green-500 hover:border-green-500 hover:text-gray-900"
        disabled={actionLoading}
      >
        <CheckCircle2 className="w-4 h-4" />
        Resolve
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction(onSnooze)}
        className="gap-2"
        disabled={actionLoading}
      >
        <Clock className="w-4 h-4" />
        Snooze
      </Button>
      {ticket.priority !== 'urgent' && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => handleAction(onEscalate)}
          disabled={actionLoading}
        >
          <ArrowUpRight className="w-4 h-4" />
          Escalate
        </Button>
      )}
      <div className="flex gap-2">
        {ticket.assigneeId === userId && ticket.status === 'in-progress' && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => handleAction(onUnassign)}
            disabled={actionLoading}
          >
            <UserPlus className="w-4 h-4 rotate-45" />
            Unassign
          </Button>
        )}
        <>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={openRedirectModal}
            disabled={actionLoading}
          >
            <XCircle className="w-4 h-4" />
            Redirect
          </Button>

          <Dialog open={showRedirectModal} onOpenChange={setShowRedirectModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Redirect ticket</DialogTitle>
                <DialogDescription>Select the team(s) to redirect this ticket to.</DialogDescription>
              </DialogHeader>

              <div className="space-y-2 mt-4 max-h-60 overflow-auto">
                {teams.length === 0 && <p className="text-sm text-muted-foreground">No teams available.</p>}
                {teams.map((team) => (
                  <label key={team.id} className="flex items-center gap-2">
                    <Checkbox checked={selectedTeamIds.includes(team.id)} onCheckedChange={() => toggleTeam(team.id)} />
                    <div className="flex flex-col">
                      <Label className="text-sm">{team.name}</Label>
                    </div>
                  </label>
                ))}
              </div>

              <DialogFooter>
                <div className="flex gap-2 w-full justify-end">
                  <Button variant="outline" onClick={() => setShowRedirectModal(false)} disabled={actionLoading}>
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      setShowRedirectModal(false);
                      handleAction(async (id) => {
                        if (onRedirectTeams) {
                          await onRedirectTeams(id, selectedTeamIds);
                        }
                      });
                      setSelectedTeamIds([]);
                      setInitialTeamIds([]);
                    }}
                    disabled={
                      actionLoading || selectedTeamIds.length === 0 || sameSet(selectedTeamIds, initialTeamIds)
                    }
                  >
                    Redirect
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      </div>
      {deleteButton}
    </div>
  );
}
