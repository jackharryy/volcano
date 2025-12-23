import { useCallback, useEffect, useState } from 'react';
import { Organization } from '@/types/organization';
import { Team } from '@/types/ticket';
import { TeamIcon } from '@/types/team';
import {
  createTeam,
  deleteTeam,
  getMyOrganizations,
  getTeamsByOrganization,
  isOrgAdmin,
  updateOrganization,
  updateTeam,
} from '@/lib/organizationHelpers';
import { normalizeTeamIcon, defaultTeamIcon } from '@/lib/teamIcons';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/errorHelpers';
import { normalizeTeams, toSlug } from '@/lib/utils';

export function useOrganizationData() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [isOrgSettingsOpen, setIsOrgSettingsOpen] = useState(false);

  const loadOrganization = useCallback(async () => {
    setLoadingOrg(true);
    try {
      const orgs = await getMyOrganizations();
      setOrganization(orgs?.[0] ?? null);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoadingOrg(false);
    }
  }, []);

  const loadTeams = useCallback(async () => {
    if (!organization?.id) {
      setTeams([]);
      return;
    }
    setLoadingTeams(true);
    try {
      const orgTeams = await getTeamsByOrganization(organization.id);
      setTeams(normalizeTeams(orgTeams));
    } catch (error) {
      toast({
        title: 'Error loading teams',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setLoadingTeams(false);
    }
  }, [organization?.id]);

  const checkAdmin = useCallback(async () => {
    if (!organization?.id) {
      setIsAdmin(false);
      return;
    }
    const admin = await isOrgAdmin(organization.id);
    setIsAdmin(admin);
  }, [organization?.id]);

  useEffect(() => {
    loadOrganization();
  }, [loadOrganization]);

  useEffect(() => {
    checkAdmin();
  }, [checkAdmin]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleRenameOrganization = useCallback(async (name: string) => {
    if (!organization?.id) return;
    try {
      const updated = await updateOrganization(organization.id, { name });
      setOrganization(updated);
      toast({ title: 'Organization updated', description: 'Name saved successfully.' });
    } catch (error) {
      toast({
        title: 'Error updating organization',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [organization?.id]);

  const handleCreateTeam = useCallback(async () => {
    if (!organization?.id || !isAdmin) return;

    const name = window.prompt('Team name');
    if (!name || !name.trim()) return;

    try {
      const team = await createTeam(organization.id, name.trim(), defaultTeamIcon);
      const normalized: Team = {
        id: team.id,
        name: team.name,
        slug: toSlug(team.name),
        icon: normalizeTeamIcon(team.icon),
      };
      setTeams((prev) => [...prev, normalized]);
      toast({ title: 'Team created', description: `${team.name} was added to your org` });
    } catch (error) {
      toast({
        title: 'Error creating team',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [organization?.id, isAdmin]);

  const handleCreateTeamDialog = useCallback(async (name: string, icon: TeamIcon = defaultTeamIcon) => {
    if (!organization?.id) return;
    try {
      const team = await createTeam(organization.id, name, icon);
      const normalized: Team = {
        id: team.id,
        name: team.name,
        slug: toSlug(team.name),
        icon: normalizeTeamIcon(team.icon),
      };
      setTeams((prev) => [...prev, normalized]);
      toast({ title: 'Team created', description: `${team.name} was added to your org` });
    } catch (error) {
      toast({
        title: 'Error creating team',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [organization?.id]);

  const handleUpdateTeamDialog = useCallback(async (teamId: string, updates: { name?: string; icon?: TeamIcon }) => {
    try {
      const updated = await updateTeam(teamId, updates);
      const normalized: Team = {
        id: updated.id,
        name: updated.name,
        slug: toSlug(updated.name),
        icon: normalizeTeamIcon(updated.icon),
      };
      setTeams((prev) => prev.map((t) => (t.id === teamId ? normalized : t)));
      toast({ title: 'Team updated', description: `${updated.name} saved.` });
    } catch (error) {
      toast({
        title: 'Error updating team',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, []);

  const handleDeleteTeamDialog = useCallback(async (teamId: string) => {
    try {
      await deleteTeam(teamId);
      setTeams((prev) => prev.filter((t) => t.id !== teamId));
      toast({ title: 'Team deleted', description: 'Team removed from organization.' });
    } catch (error) {
      toast({
        title: 'Error deleting team',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, []);

  const refreshOrganization = useCallback(() => loadOrganization(), [loadOrganization]);

  return {
    organization,
    setOrganization,
    loadingOrg,
    teams,
    setTeams,
    loadingTeams,
    isAdmin,
    isOrgSettingsOpen,
    setIsOrgSettingsOpen,
    handleCreateTeam,
    handleRenameOrganization,
    handleCreateTeamDialog,
    handleUpdateTeamDialog,
    handleDeleteTeamDialog,
    refreshOrganization,
  };
}
