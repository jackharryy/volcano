import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { NavSidebar } from '@/components/NavSidebar/components/NavSidebar';
import { TicketList } from '@/components/TicketList/components/TicketList';
import { TicketDetail } from '@/components/TicketDetail/components/TicketDetail';
import { QuickSubmitModal } from '@/components/QuickSubmitModal/QuickSubmitModal';
import { OrgSettingsDialog } from '@/components/AdminSettings/OrgSettingsDialog';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { toast } from '@/hooks/use-toast';
import { createOrganization, joinOrganization, leaveOrganization } from '@/lib/organizationHelpers';
import { supabase } from '@/integrations/supabase/client';
import { OrganizationSetup } from '@/pages/OrganizationSetup';
import { useOrganizationData } from '@/hooks/useOrganizationData';
import { useTicketFilters } from '@/hooks/useTicketFilters';
import { useTicketsData } from '@/hooks/useTicketsData';
import { useFilteredTickets } from '@/hooks/useFilteredTickets';
import { getErrorMessage } from '@/lib/errorHelpers';
import { getUserIdentity } from '@/lib/userHelpers';
import type { OrgSettingsSectionId } from '@/components/AdminSettings/types';

const Index = () => {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'tickets' | 'stats'>('tickets');
  const [orgSettingsSection, setOrgSettingsSection] = useState<OrgSettingsSectionId>('organization');
  const {
    organization,
    setOrganization,
    loadingOrg,
    teams,
    loadingTeams,
    isAdmin,
    isOrgSettingsOpen,
    setIsOrgSettingsOpen,
    handleRenameOrganization,
    handleCreateTeamDialog,
    handleUpdateTeamDialog,
    handleDeleteTeamDialog,
    refreshOrganization,
  } = useOrganizationData();

  const {
    statusFilter,
    priorityFilter,
    teamFilter,
    assignedToMe,
    raisedByMe,
    createdFrom,
    createdTo,
    searchQuery,
    handleFilterChange,
    filterState,
  } = useTicketFilters(teams);

  const {
    tickets,
    loadingTickets,
    selectedTicketId,
    setSelectedTicketId,
    notifications,
    handleNotificationsOpened,
    handleSubmitTicket,
    handleClaim,
    handleResolve,
    handleSnooze,
    handleEscalate,
    handleRedirectTeams,
    handleUnsnooze,
    handleUnassign,
    handleReopen,
    handleDeleteTicket,
    selectedTicket,
  } = useTicketsData({ organization, teams, user: user ?? null });

  const { filteredTickets, statusCounts } = useFilteredTickets({
    tickets,
    statusFilter,
    priorityFilter,
    teamFilter,
    assignedToMe,
    raisedByMe,
    searchQuery,
    userId: user?.id,
    reporterEmail: user?.email,
    createdFrom,
    createdTo,
  });

  const { displayName: userName, email: userEmail } = getUserIdentity(user);

  const handleLogout = async () => {
    localStorage.removeItem('cq.filterConfig');
    await supabase.auth.signOut();
    navigate('/login');
  };

  const openOrgSettings = (section: OrgSettingsSectionId = 'organization') => {
    setOrgSettingsSection(section);
    setIsOrgSettingsOpen(true);
  };

  const handleCreateOrg = async (name: string) => {
    try {
      const org = await createOrganization(name.trim());
      setOrganization(org);
      toast({
        title: 'Organization created!',
        description: `Invite code: ${org.invite_code}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error) || 'Failed to create organization',
        variant: 'destructive',
      });
    }
  };

  const handleJoinOrg = async (code: string) => {
    try {
      await joinOrganization(code.trim());
      await refreshOrganization();
      toast({
        title: 'Joined organization!',
        description: 'You are now part of the organization',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: getErrorMessage(error) || 'Failed to join organization',
        variant: 'destructive',
      });
    }
  };

  const handleLeaveOrganization = async () => {
    if (!organization?.id) return;
    try {
      await leaveOrganization(organization.id);
      toast({
        title: 'Left organization',
        description: `You have left ${organization.name}.`,
      });
      setSelectedTicketId(null);
      setOrganization(null);
      await refreshOrganization();
    } catch (error) {
      toast({
        title: 'Error leaving organization',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (loadingOrg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <OrganizationSetup
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
        onCreateOrg={handleCreateOrg}
        onJoinOrg={handleJoinOrg}
      />
    );
  }

  return (
    <div className="relative flex h-screen bg-background overflow-hidden flex-col lg:flex-row">
      <NavSidebar
        filterState={filterState}
        onFilterChange={handleFilterChange}
        teams={teams}
        statusCounts={statusCounts}
        isAdmin={isAdmin}
        organizationName={organization?.name}
        onOrgSettings={() => openOrgSettings('organization')}
        onManageTeams={() => openOrgSettings('teams')}
        onLeaveOrganization={handleLeaveOrganization}
        isTeamsLoading={loadingTeams}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {viewMode === 'tickets' ? (
        <>
          <div className="flex flex-1 min-w-0 flex-col lg:flex-row">
            <TicketList
              tickets={filteredTickets}
              selectedTicketId={selectedTicketId}
              onSelectTicket={setSelectedTicketId}
              filterState={filterState}
              onFilterChange={handleFilterChange}
              teams={teams}
              statusCounts={statusCounts}
              notifications={notifications}
              onNotificationsOpen={handleNotificationsOpened}
              isLoading={loadingTickets || loadingTeams}
            />

            <TicketDetail
              ticket={selectedTicket}
              onClose={() => setSelectedTicketId(null)}
              onClaim={handleClaim}
              onResolve={handleResolve}
              onSnooze={handleSnooze}
              onUnsnooze={handleUnsnooze}
              onEscalate={handleEscalate}
              onRedirectTeams={handleRedirectTeams}
              onReopen={handleReopen}
              onUnassign={handleUnassign}
              onDelete={handleDeleteTicket}
              teams={teams}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSubmitModalOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg glow-cyan z-40"
          >
            <Plus className="w-6 h-6 text-primary-foreground" />
          </motion.button>

          <QuickSubmitModal
            isOpen={isSubmitModalOpen}
            onClose={() => setIsSubmitModalOpen(false)}
            teams={teams}
            onSubmit={handleSubmitTicket}
          />
        </>
      ) : (
        <>Not Implemented</>
      )}

      <OrgSettingsDialog
        open={isOrgSettingsOpen}
        onClose={() => setIsOrgSettingsOpen(false)}
        organization={organization}
        teams={teams}
        onRenameOrg={handleRenameOrganization}
        onCreateTeam={handleCreateTeamDialog}
        onUpdateTeam={handleUpdateTeamDialog}
        onDeleteTeam={handleDeleteTeamDialog}
        initialSection={orgSettingsSection}
      />
    </div>
  );
};

export default Index;
