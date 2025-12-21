import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Team } from '@/types/ticket';
import type { TicketDraft } from '@/types/ticket';
import { SubmitForm } from './SubmitForm';

interface QuickSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Team[];
  onSubmit: (data: TicketDraft) => Promise<void> | void;
}

const initialTicketState: TicketDraft = {
  title: '',
  description: '',
  category: 'Bug',
  priority: 'medium',
  teamIds: [],
};

export function QuickSubmitModal({ isOpen, onClose, onSubmit, teams }: QuickSubmitModalProps) {
  const [ticketState, setTicketState] = useState<TicketDraft>(initialTicketState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!teams.length) {
      setTicketState((prev) => ({ ...prev, teamIds: [] }));
      return;
    }

    setTicketState((prev) => {
      const validTeamIds = prev.teamIds.filter((id) => teams.some((team) => team.id === id));
      if (validTeamIds.length) {
        if (validTeamIds.length === prev.teamIds.length && validTeamIds.every((id, idx) => id === prev.teamIds[idx])) {
          return prev;
        }
        return { ...prev, teamIds: validTeamIds };
      }

      return { ...prev, teamIds: [teams[0].id] };
    });
  }, [teams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(ticketState);

      setTicketState((prev) => ({
        ...prev,
        title: '',
        description: '',
        category: 'Bug',
        priority: 'medium',
      }));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid =
    ticketState.title.trim().length > 0 &&
    ticketState.description.trim().length > 0 &&
    ticketState.teamIds.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
          >
            <div className="pointer-events-auto w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card-elevated p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Report a problem</h2>
                <p className="text-sm text-muted-foreground">Filed under your account</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <SubmitForm
              ticketState={ticketState}
              setTicketState={setTicketState}
              teams={teams}
              isValid={isValid}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onClose={onClose}
            />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
