import { supabase } from '@/integrations/supabase/client';
import type { Ticket } from '@/types/ticket';
import {
  getCurrentActor,
  insertEvent,
  mapTicket,
  syncProblemTeams,
  updateTicket,
} from './helpers';
import type { CreateTicketInput, ProblemRowWithRelations } from './types';

export async function fetchTicketsByOrganization(orgId: string): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('problems')
    .select('*, teams:teams!problems_team_id_fkey(*), problem_teams:problem_teams(team_id, teams:teams(*))')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    if (error) throw error;
    return [];
  }

  return (data as ProblemRowWithRelations[]).map(mapTicket);
}

export async function createTicket(orgId: string, input: CreateTicketInput): Promise<Ticket> {
  const actor = await getCurrentActor();
  const primaryTeamId = input.teamIds[0] || null;

  const { data, error } = await supabase
    .from('problems')
    .insert({
      organization_id: orgId,
      team_id: primaryTeamId,
      title: input.title,
      description: input.description,
      reporter_email: input.reporterEmail,
      reporter_name: actor.name,
      category: input.category,
      priority: input.priority,
      status: 'open',
    })
    .select('*, teams:teams!problems_team_id_fkey(*), problem_teams:problem_teams(team_id, teams:teams(*))')
    .single();

  if (error || !data) throw error || new Error('Unable to create ticket');
  await syncProblemTeams(data.id, input.teamIds);

  const { data: refreshed, error: refreshedError } = await supabase
    .from('problems')
    .select('*, teams:teams!problems_team_id_fkey(*), problem_teams:problem_teams(id, problem_id, team_id, teams:teams(*))')
    .eq('id', data.id)
    .single();

  if (refreshedError || !refreshed) throw refreshedError || new Error('Unable to load ticket');
  const ticket = mapTicket(refreshed);
  await insertEvent(ticket.id, actor, 'created');
  return ticket;
}

export async function claimTicket(ticketId: string): Promise<Ticket> {
  const actor = await getCurrentActor();
  const updated = await updateTicket(ticketId, {
    assignee_id: actor.id,
    assignee_name: actor.name,
    assignee_email: actor.email,
    status: 'in-progress',
  });
  await insertEvent(ticketId, actor, 'claimed');
  return updated;
}

export async function resolveTicket(ticketId: string): Promise<Ticket> {
  const actor = await getCurrentActor();
  const updated = await updateTicket(ticketId, { status: 'resolved' });
  await insertEvent(ticketId, actor, 'resolved');
  return updated;
}

export async function reopenTicket(ticketId: string): Promise<Ticket> {
  const actor = await getCurrentActor();
  const updated = await updateTicket(ticketId, {
    status: 'in-progress',
    assignee_id: actor.id,
    assignee_name: actor.name,
    assignee_email: actor.email,
  });
  await insertEvent(ticketId, actor, 'status_changed', { from: 'resolved', to: 'in-progress', reopened_by: actor.email });
  return updated;
}

export async function snoozeTicket(ticketId: string): Promise<Ticket> {
  const actor = await getCurrentActor();
  const updated = await updateTicket(ticketId, { status: 'snoozed' });
  await insertEvent(ticketId, actor, 'snoozed');
  return updated;
}

export async function unsnoozeTicket(ticketId: string): Promise<Ticket> {
  const actor = await getCurrentActor();
  const updated = await updateTicket(ticketId, { status: 'in-progress' });
  await insertEvent(ticketId, actor, 'status_changed', { from: 'snoozed', to: 'in-progress', unsnoozed_by: actor.email });
  return updated;
}

export async function unassignTicket(ticketId: string): Promise<Ticket> {
  const actor = await getCurrentActor();
  const updated = await updateTicket(ticketId, {
    assignee_id: null,
    assignee_name: null,
    assignee_email: null,
    status: 'open',
  });
  await insertEvent(ticketId, actor, 'status_changed', { from: 'in-progress', to: 'open', unassigned_by: actor.email });
  return updated;
}

export async function escalateTicket(ticketId: string): Promise<Ticket> {
  const actor = await getCurrentActor();
  const updated = await updateTicket(ticketId, { priority: 'urgent' });
  await insertEvent(ticketId, actor, 'escalated');
  return updated;
}

export async function updateTicketTeams(ticketId: string, teamIds: string[]): Promise<Ticket> {
  const actor = await getCurrentActor();
  const primaryTeamId = teamIds[0] || null;
  await syncProblemTeams(ticketId, teamIds);
  const updated = await updateTicket(ticketId, { team_id: primaryTeamId });
  await insertEvent(ticketId, actor, 'team_changed', { to: teamIds });
  return updated;
}

export async function deleteTicket(ticketId: string): Promise<void> {
  const actor = await getCurrentActor();
  if (!actor.email) {
    throw new Error('You must be logged in to delete a ticket.');
  }

  const { error, data } = await supabase
    .from('problems')
    .delete()
    .eq('id', ticketId)
    .eq('reporter_email', actor.email)
    .select('id')
    .single();

  if (error || !data) {
    throw error || new Error('Ticket not found or you are not allowed to delete it.');
  }
}
