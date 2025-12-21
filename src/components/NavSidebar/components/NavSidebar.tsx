import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getUserIdentity } from '@/lib/userHelpers';
import { NavSidebarProps } from '../types';
import { priorityItems } from '../constants';
import { toggleSingleFilter } from '../utils';
import { Brand } from './Brand';
import { OrgSection } from './OrgSection';
import { AssignedToggle, RaisedByMeToggle } from './AssignedToggle';
import { PriorityFilterSection } from './PriorityFilterSection';
import { TeamsSection } from './TeamsSection';
import { UserSection } from './UserSection';

export function NavSidebar({
  filterState,
  onFilterChange,
  teams,
  isAdmin,
  onManageTeams,
  organizationName,
  onOrgSettings,
  onLeaveOrganization,
  isTeamsLoading = false,
  viewMode,
  onViewChange,
}: NavSidebarProps) {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const {
    priority: priorityFilter,
    teamId: teamFilter,
    assignedToMe,
    raisedByMe,
    createdFrom,
    createdTo,
  } = filterState;

  const handleLogout = async () => {
    localStorage.removeItem('cq.filterConfig');
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handlePriorityToggle = (priority: typeof priorityFilter[number]) => {
    onFilterChange({ priority: toggleSingleFilter(priority, priorityFilter) });
  };

  const { displayName: userName, email: userEmail } = getUserIdentity(user);

  const renderSidebarContent = () => (
    <>
      <OrgSection
        organizationName={organizationName}
        isAdmin={isAdmin}
        onOrgSettings={onOrgSettings}
        onLeaveOrganization={onLeaveOrganization}
        borderPosition="bottom"
      />

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-6">

        <div className="space-y-2">
          <AssignedToggle active={assignedToMe} onToggle={() => onFilterChange({ assignedToMe: !assignedToMe })} />
          <RaisedByMeToggle active={raisedByMe} onToggle={() => onFilterChange({ raisedByMe: !raisedByMe })} />
        </div>

        {/** Todo: Date filter works, but I'd like to find a better way to style this */}
        {/* <div className="space-y-2 px-2">
          <div className="flex gap-x-2 items-center">
            <Calendar className="w-3 h-3 text-white" />
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Created</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span>From</span>
              <input
                type="date"
                value={createdFrom ?? ''}
                onChange={(event) => onFilterChange({ createdFrom: event.target.value || null })}
                className="date-input"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span>To</span>
              <input
                type="date"
                value={createdTo ?? ''}
                onChange={(event) => onFilterChange({ createdTo: event.target.value || null })}
                className="date-input"
              />
            </label>
          </div>
        </div> */}

        <PriorityFilterSection
          items={priorityItems}
          activePriorities={priorityFilter}
          onToggle={handlePriorityToggle}
        />

        <TeamsSection
          teams={teams}
          activeTeamId={teamFilter}
          isAdmin={isAdmin}
          isLoading={isTeamsLoading}
          onSelect={(teamId) => onFilterChange({ teamId })}
          onManageTeams={onManageTeams}
        />
      </div>

      <UserSection userName={userName} userEmail={userEmail} onLogout={handleLogout} />
    </>
  );

  return (
    <>
      <button
        className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border text-left"
        onClick={() => setIsOpen(true)}
      >
        <Brand />
        <Filter className="w-4 h-4 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden bg-background/80 backdrop-blur-sm"
          >
            <div className="w-full h-full bg-sidebar border-r border-sidebar-border flex flex-col">
              <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
                <Brand />
                <button
                  className="p-2 rounded-lg hover:bg-sidebar-accent"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {renderSidebarContent()}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex w-64 h-screen bg-sidebar border-r border-sidebar-border flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <Brand />
        </div>

        {renderSidebarContent()}
      </aside>
    </>
  );
}
