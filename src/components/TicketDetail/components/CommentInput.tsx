import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function CommentInput({ value, onChange, onSubmit, submitting }: CommentInputProps) {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
        <Button size="icon" disabled={!value.trim() || submitting} onClick={onSubmit}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
