import { motion } from 'framer-motion';
import { CheckIcon, ChevronDown, X } from 'lucide-react';
import type { FormEvent, Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import type { Team, TicketDraft } from '@/types/ticket';
import { categories, priorities } from './types';

interface SubmitFormProps {
  ticketState: TicketDraft;
  setTicketState: Dispatch<SetStateAction<TicketDraft>>;
  teams: Team[];
  handleSubmit: (e: FormEvent) => Promise<void>;
  isValid?: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
}

export function SubmitForm({
  ticketState,
  setTicketState,
  teams,
  handleSubmit,
  isValid = true,
  isSubmitting = false,
  onClose,
}: SubmitFormProps) {
  const { title, description, category, priority, teamIds } = ticketState;

  const updateTicketState = <K extends keyof TicketDraft>(key: K, value: TicketDraft[K]) => {
    setTicketState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTeam = (id: string) => {
    setTicketState((prev) => ({
      ...prev,
      teamIds: prev.teamIds.includes(id)
        ? prev.teamIds.filter((teamId) => teamId !== id)
        : [...prev.teamIds, id],
    }));
  };

  const selectedTeams = teams.filter((team) => teamIds.includes(team.id));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => updateTicketState('title', e.target.value)}
          placeholder="Brief summary of the issue"
          className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => updateTicketState('description', e.target.value)}
          placeholder="Detailed description of the issue, steps to reproduce, expected behavior..."
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => updateTicketState('category', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => updateTicketState('priority', e.target.value as TicketDraft['priority'])}
            className="w-full px-4 py-2.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer"
          >
            {priorities.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Teams <span className="text-destructive">*</span>
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              disabled={teams.length === 0}
            >
              <span className="text-sm text-left">
                {selectedTeams.length > 0
                  ? `${selectedTeams.length} team${selectedTeams.length > 1 ? 's' : ''} selected`
                  : 'Select teams'}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-72">
            <Command>
              <CommandInput placeholder="Filter teams..." />
              <CommandList>
                <CommandEmpty>No teams found</CommandEmpty>
                <CommandGroup>
                  {teams.map((team) => {
                    const checked = teamIds.includes(team.id);
                    return (
                      <CommandItem key={team.id} onSelect={() => toggleTeam(team.id)} className="gap-2">
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded border border-border">
                          {checked && <CheckIcon className="w-3 h-3" />}
                        </span>
                        <span className="text-sm">{team.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedTeams.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTeams.map((team) => (
              <Badge key={team.id} variant="secondary" className="flex items-center gap-1">
                {team.name}
                <button
                  type="button"
                  onClick={() => toggleTeam(team.id)}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid || isSubmitting || teams.length === 0} className="flex-1 gap-2">
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full"
              />
              Submitting...
            </>
          ) : (
            'Submit Ticket'
          )}
        </Button>
      </div>
    </form>
  );
}