import { supabase } from '@/integrations/supabase/client';
import type { Attachment } from '@/types/ticket';
import { ATTACHMENT_BUCKET, getCurrentActor, insertEvent, mapAttachment } from './helpers';
import type { AttachmentRow } from './types';

export async function fetchAttachmentsByTicket(ticketId: string): Promise<Attachment[]> {
  const { data, error } = await supabase
    .from('problem_attachments')
    .select('*')
    .eq('problem_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapAttachment);
}

export async function uploadAttachment(ticketId: string, file: File): Promise<Attachment> {
  const actor = await getCurrentActor();
  if (!actor.id) throw new Error('User not authenticated');

  const path = `${ticketId}/${Date.now()}-${file.name}`;
  const uploadResult = await supabase.storage
    .from(ATTACHMENT_BUCKET)
    .upload(path, file, {
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    });

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  const { data, error } = await supabase
    .from('problem_attachments')
    .insert({
      problem_id: ticketId,
      filename: file.name,
      content_type: file.type || 'application/octet-stream',
      storage_path: path,
    })
    .select('*')
    .single();

  if (error || !data) {
    await supabase.storage.from(ATTACHMENT_BUCKET).remove([path]);
    throw error || new Error('Attachment insert failed');
  }

  const attachment = mapAttachment(data);
  await insertEvent(ticketId, actor, 'attachment_added', {
    attachment_id: attachment.id,
    filename: attachment.filename,
    content_type: attachment.contentType,
  });

  return attachment;
}
