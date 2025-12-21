import { supabase } from '@/integrations/supabase/client';
import type { Notification, TicketEvent } from '@/types/ticket';
import { describeEvent, toPayloadRecord } from './helpers';
import type { NotificationRow } from './types';

export async function fetchNotificationsForReporter(reporterEmail: string): Promise<Notification[]> {
  if (!reporterEmail) return [];

  const { data, error } = await supabase
    .from('problem_events')
    .select('id, problem_id, event_type, payload, created_at, actor_name, actor_email, problems!inner(title, reporter_email)')
    .eq('problems.reporter_email', reporterEmail)
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) throw error;
  if (!data) return [];

  return data
    .filter((row) => row.actor_email !== reporterEmail)
    .map<Notification>((row) => ({
      id: row.id,
      ticketId: row.problem_id,
      ticketTitle: row.problems?.title || 'Ticket',
      message: describeEvent(row.event_type as TicketEvent['eventType'], toPayloadRecord(row.payload)),
      createdAt: row.created_at,
      actorName: row.actor_name || row.actor_email || 'Someone',
      unread: true,
    }));
}
