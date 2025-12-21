import { Ticket } from '@/types/ticket';

interface DescriptionSectionProps {
  ticket: Ticket;
}

export function DescriptionSection({ ticket }: DescriptionSectionProps) {
  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
        {ticket.description}
      </p>
    </div>
  );
}
