import { supabase } from '@/integrations/supabase/client';
import type { TicketEvent } from '@/types/ticket';
import { mapEvent } from './helpers';
import type { EventRow } from './types';

export async function fetchEventsByTicket(ticketId: string): Promise<TicketEvent[]> {
  const { data, error } = await supabase
    .from('problem_events')
    .select('*')
    .eq('problem_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapEvent);
}
