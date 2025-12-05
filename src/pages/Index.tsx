import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { NavSidebar } from '@/components/NavSidebar';
import { TicketList } from '@/components/TicketList';
import { TicketDetail } from '@/components/TicketDetail';
import { QuickSubmitModal } from '@/components/QuickSubmitModal';
import { tickets as mockTickets, currentUser } from '@/data/mockData';
import { Ticket, Status, Priority, TicketFilters } from '@/types/ticket';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<Status[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filters: TicketFilters = {
    status: statusFilter,
    priority: priorityFilter,
    teamId: teamFilter || undefined,
    assigneeId: assignedToMe ? currentUser.id : undefined,
    search: searchQuery,
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (statusFilter.length > 0 && !statusFilter.includes(ticket.status)) {
        return false;
      }
      
      // Priority filter
      if (priorityFilter.length > 0 && !priorityFilter.includes(ticket.priority)) {
        return false;
      }
      
      // Team filter
      if (teamFilter && ticket.teamId !== teamFilter) {
        return false;
      }
      
      // Assigned to me
      if (assignedToMe && ticket.assigneeId !== currentUser.id) {
        return false;
      }
      
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          ticket.title.toLowerCase().includes(query) ||
          ticket.description.toLowerCase().includes(query) ||
          ticket.reporterEmail.toLowerCase().includes(query) ||
          ticket.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [tickets, statusFilter, priorityFilter, teamFilter, assignedToMe, searchQuery]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || null;

  const handleClaim = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, assigneeId: currentUser.id, assignee: currentUser, status: 'in-progress' as Status }
          : t
      )
    );
    toast({
      title: 'Ticket claimed',
      description: 'You are now the owner of this ticket.',
    });
  };

  const handleResolve = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'resolved' as Status, updatedAt: new Date().toISOString() }
          : t
      )
    );
    toast({
      title: 'Ticket resolved',
      description: 'The ticket has been marked as resolved.',
    });
  };

  const handleSnooze = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'snoozed' as Status, updatedAt: new Date().toISOString() }
          : t
      )
    );
    toast({
      title: 'Ticket snoozed',
      description: 'The ticket has been snoozed.',
    });
  };

  const handleSubmit = (data: { title: string; description: string; reporterEmail: string; category: string; priority: Priority }) => {
    const newTicket: Ticket = {
      id: String(tickets.length + 1),
      title: data.title,
      description: data.description,
      reporterEmail: data.reporterEmail,
      category: data.category,
      priority: data.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'web',
      tags: [],
      suggestedTeam: 'frontend',
      suggestedConfidence: 0.75,
      summary: 'New ticket awaiting triage.',
    };
    
    setTickets((prev) => [newTicket, ...prev]);
    toast({
      title: 'Ticket submitted',
      description: 'Your ticket has been created successfully.',
    });
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <NavSidebar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        teamFilter={teamFilter}
        assignedToMe={assignedToMe}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
        onTeamFilterChange={setTeamFilter}
        onAssignedToMeChange={setAssignedToMe}
      />

      {/* Main Content */}
      <div className="flex flex-1 min-w-0">
        {/* Ticket List */}
        <TicketList
          tickets={filteredTickets}
          selectedTicketId={selectedTicketId}
          onSelectTicket={setSelectedTicketId}
          filters={filters}
          onSearchChange={setSearchQuery}
        />

        {/* Ticket Detail */}
        <TicketDetail
          ticket={selectedTicket}
          onClose={() => setSelectedTicketId(null)}
          onClaim={handleClaim}
          onResolve={handleResolve}
          onSnooze={handleSnooze}
        />
      </div>

      {/* Quick Submit FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSubmitModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg glow-cyan z-40"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </motion.button>

      {/* Submit Modal */}
      <QuickSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Index;
