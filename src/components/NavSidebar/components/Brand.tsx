import { Mountain, Sparkles } from 'lucide-react';

interface BrandProps {
  name?: string;
}

export function Brand({ name = 'Volcano' }: BrandProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <Mountain className="w-4 h-4 text-primary-foreground" />
      </div>
      <span className="font-semibold text-lg text-foreground">{name}</span>
    </div>
  );
}
