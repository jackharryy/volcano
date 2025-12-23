import { useCallback, useState } from 'react';
import { Attachment } from '@/types/ticket';
import { fetchAttachmentsByTicket, uploadAttachment } from '@/services/tickets/ticketService';

export function useTicketAttachments(ticketId: string | undefined) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadAttachments = useCallback(async () => {
    if (!ticketId) {
      setAttachments([]);
      return;
    }
    setLoading(true);
    try {
      const rows = await fetchAttachmentsByTicket(ticketId);
      setAttachments(rows);
    } catch (err) {
      console.error('Failed to load attachments', err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  const uploadAttachmentForTicket = useCallback(async (file: File) => {
    if (!ticketId) return null;
    setUploading(true);
    try {
      const saved = await uploadAttachment(ticketId, file);
      setAttachments((prev) => [...prev, saved]);
      return saved;
    } finally {
      setUploading(false);
    }
  }, [ticketId]);

  return {
    attachments,
    loading,
    uploading,
    loadAttachments,
    uploadAttachmentForTicket,
  };
}
