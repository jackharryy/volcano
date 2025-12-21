import { useCallback, useEffect, useMemo, useState } from 'react';
import { Organization } from '@/types/organization';
import { Notification, Team, Ticket } from '@/types/ticket';
import { toast } from '@/hooks/use-toast';
import {
  claimTicket,
  createTicket,
  escalateTicket,
  deleteTicket,
  fetchNotificationsForReporter,
  fetchTicketsByOrganization,
  reopenTicket,
  resolveTicket,
  snoozeTicket,
  unsnoozeTicket,
  unassignTicket,
  updateTicketTeams,
} from '@/services/ticketService';
import type { User } from '@supabase/supabase-js';
import { assignTicketNumbers } from '../utils';
import type { TicketDraft } from '@/types/ticket';
import { getErrorMessage } from '@/lib/errorHelpers';

interface UseTicketsDataParams {
  organization: Organization | null;
  teams: Team[];
  user: User | null;
}

export function useTicketsData({ organization, teams, user }: UseTicketsDataParams) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadTickets = useCallback(async () => {
    if (!organization?.id) {
      setTickets([]);
      return;
    }
    setLoadingTickets(true);
    try {
      const data = await fetchTicketsByOrganization(organization.id);
      setTickets(assignTicketNumbers(data));
    } catch (error) {
      toast({
        title: 'Error loading tickets',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setLoadingTickets(false);
    }
  }, [organization?.id]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.email) {
        setNotifications([]);
        return;
      }
      try {
        const data = await fetchNotificationsForReporter(user.email);
        setNotifications((prev) => {
          const readMap = new Map(prev.map((n) => [n.id, n.unread]));
          return data.map((n) => ({ ...n, unread: readMap.get(n.id) ?? n.unread }));
        });
      } catch (error) {
        console.error('Failed to load notifications', error);
      }
    };

    loadNotifications();
    const intervalId = window.setInterval(loadNotifications, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [user?.email]);

  const updateTicketInState = useCallback((updated: Ticket) => {
    setTickets((prev) => assignTicketNumbers(prev.map((t) => (t.id === updated.id ? updated : t))));
  }, []);

  const handleClaim = useCallback(async (ticketId: string) => {
    try {
      const updated = await claimTicket(ticketId);
      updateTicketInState(updated);
      toast({ title: 'Ticket claimed', description: 'You are now the owner of this ticket.' });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error) || 'Failed to claim ticket', variant: 'destructive' });
    }
  }, [updateTicketInState]);

  const handleResolve = useCallback(async (ticketId: string) => {
    try {
      const updated = await resolveTicket(ticketId);
      updateTicketInState(updated);
      toast({ title: 'Ticket resolved', description: 'The ticket has been marked as resolved.' });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error) || 'Failed to resolve ticket', variant: 'destructive' });
    }
  }, [updateTicketInState]);

  const handleSnooze = useCallback(async (ticketId: string) => {
    try {
      const updated = await snoozeTicket(ticketId);
      updateTicketInState(updated);
      toast({ title: 'Ticket snoozed', description: 'The ticket has been snoozed.' });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error) || 'Failed to snooze ticket', variant: 'destructive' });
    }
  }, [updateTicketInState]);

  const handleEscalate = useCallback(async (ticketId: string) => {
    try {
      const updated = await escalateTicket(ticketId);
      updateTicketInState(updated);
      toast({ title: 'Ticket escalated', description: 'Priority set to urgent.' });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error) || 'Failed to escalate ticket', variant: 'destructive' });
    }
  }, [updateTicketInState]);

  const handleUnsnooze = useCallback(async (ticketId: string) => {
    try {
      const updated = await unsnoozeTicket(ticketId);
      updateTicketInState(updated);
      toast({ title: 'Snooze cleared', description: 'Ticket reopened for work.' });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error) || 'Failed to unsnooze ticket', variant: 'destructive' });
    }
  }, [updateTicketInState]);

  const handleUnassign = useCallback(async (ticketId: string) => {
    try {
      const updated = await unassignTicket(ticketId);
      updateTicketInState(updated);
      toast({ title: 'Unassigned', description: 'Ticket moved back to Open.' });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error) || 'Failed to unassign ticket', variant: 'destructive' });
    }
  }, [updateTicketInState]);

  const handleReopen = useCallback(async (ticketId: string) => {
    try {
      const updated = await reopenTicket(ticketId);
      updateTicketInState(updated);
      toast({ title: 'Ticket reopened', description: 'Status moved to In Progress.' });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error) || 'Failed to reopen ticket', variant: 'destructive' });
    }
  }, [updateTicketInState]);

  const handleDeleteTicket = useCallback(async (ticketId: string) => {
    try {
      await deleteTicket(ticketId);
      setTickets((prev) => assignTicketNumbers(prev.filter((t) => t.id !== ticketId)));
      setSelectedTicketId((prev) => (prev === ticketId ? null : prev));
      toast({ title: 'Ticket deleted', description: 'The ticket has been removed successfully.' });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error) || 'Failed to delete ticket', variant: 'destructive' });
      throw error;
    }
  }, []);

  const handleRedirectTeams = useCallback(async (ticketId: string, teamIdsInput?: string[]) => {
    if (!teams.length) {
      toast({ title: 'No teams available', description: 'Create a team first.', variant: 'destructive' });
      return;
    }

    if (teamIdsInput && teamIdsInput.length) {
      const selected = teams.filter((t) => teamIdsInput.includes(t.id));
      try {
        const updated = await updateTicketTeams(ticketId, teamIdsInput);
        updateTicketInState(updated);
        toast({ title: 'Teams updated', description: `Redirected to ${selected.map((t) => t.name).join(', ')}.` });
      } catch (error) {
        toast({
          title: 'Error updating teams',
          description: getErrorMessage(error),
          variant: 'destructive',
        });
      }
      return;
    }

    const currentTicket = tickets.find((t) => t.id === ticketId);
    const available = teams.map((t) => `${t.name} (${t.slug})`).join(', ');
    const current = currentTicket?.teamIds?.length
      ? currentTicket.teamIds
      : currentTicket?.team
        ? [currentTicket.team.id]
        : [];

    const input = window.prompt(
      `Select teams by name, slug, or id (comma-separated).\nAvailable: ${available}`,
      current.join(',')
    );

    if (input === null) return;

    const tokens = input
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);

    if (!tokens.length) {
      toast({
        title: 'No teams selected',
        description: 'Please choose at least one team.',
        variant: 'destructive',
      });
      return;
    }

    const selected = teams.filter((t) =>
      tokens.includes(t.id.toLowerCase()) ||
      tokens.includes(t.slug.toLowerCase()) ||
      tokens.includes(t.name.toLowerCase())
    );

    if (!selected.length) {
      toast({ title: 'No matching teams', description: 'Check the names and try again.', variant: 'destructive' });
      return;
    }

    const teamIds = Array.from(new Set(selected.map((t) => t.id)));

    try {
      const updated = await updateTicketTeams(ticketId, teamIds);
      updateTicketInState(updated);
      toast({ title: 'Teams updated', description: `Redirected to ${selected.map((t) => t.name).join(', ')}.` });
    } catch (error) {
      toast({
        title: 'Error updating teams',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [teams, tickets, updateTicketInState]);

  const handleSubmitTicket = useCallback(async (data: TicketDraft) => {
    if (!organization?.id) {
      const error = new Error('No organization found');
      toast({
        title: 'No organization found',
        description: 'Create or join an organization to submit tickets.',
        variant: 'destructive',
      });
      throw error;
    }

    const reporterEmail = user?.email;
    if (!reporterEmail) {
      const error = new Error('Missing email');
      toast({
        title: 'Missing email',
        description: 'You must be logged in to submit a ticket.',
        variant: 'destructive',
      });
      throw error;
    }

    try {
      const newTicket = await createTicket(organization.id, { ...data, reporterEmail });
      setTickets((prev) => assignTicketNumbers([newTicket, ...prev]));
      toast({
        title: 'Ticket submitted',
        description: 'Your ticket has been created successfully.',
      });
    } catch (error) {
      toast({ title: 'Error', description: getErrorMessage(error) || 'Failed to create ticket', variant: 'destructive' });
      throw error;
    }
  }, [organization?.id, user?.email]);

  const handleNotificationsOpened = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const selectedTicket = useMemo(() => tickets.find((t) => t.id === selectedTicketId) || null, [tickets, selectedTicketId]);

  return {
    tickets,
    loadingTickets,
    selectedTicketId,
    setSelectedTicketId,
    notifications,
    handleNotificationsOpened,
    handleSubmitTicket,
    handleClaim,
    handleResolve,
    handleSnooze,
    handleEscalate,
    handleRedirectTeams,
    handleUnsnooze,
    handleUnassign,
    handleReopen,
    handleDeleteTicket,
    selectedTicket,
  };
}
