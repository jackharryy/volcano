import { supabase } from '@/integrations/supabase/client';
import { Organization, Team, OrganizationMember, OrganizationRole } from '@/types/organization';
import { TeamIcon } from '@/types/team';
import { defaultTeamIcon, normalizeTeamIcon } from '@/lib/teamIcons';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export const defaultTeamColor = '#FF7043';

export async function createOrganization(name: string): Promise<Organization> {
  const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const { data, error } = await supabase
    .from('organizations')
    .insert({ name, invite_code: inviteCode })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function joinOrganization(inviteCode: string): Promise<string> {
  const { data, error } = await supabase
    .rpc('join_organization', { invite_code: inviteCode });

  if (error) throw error;
  return data;
}

export async function getMyOrganizations(): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('organizations')
    .select(`
      *,
      organization_members!inner(user_id)
    `)
    .eq('organization_members.user_id', (await supabase.auth.getUser()).data.user?.id);

  if (error) throw error;
  return data;
}

export async function getOrganizationById(orgId: string): Promise<Organization> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrganization(orgId: string, updates: Partial<Organization>): Promise<Organization> {
  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', orgId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOrganization(orgId: string): Promise<void> {
  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', orgId);

  if (error) throw error;
}

export async function getOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
  const { data, error } = await supabase
    .from('organization_members')
    .select('*')
    .eq('organization_id', orgId);

  if (error) throw error;

  return (data || []).map(member => ({
    ...member,
    role: member.role as OrganizationRole
  }));
}

export async function updateMemberRole(memberId: string, role: 'admin' | 'member'): Promise<void> {
  const { error } = await supabase
    .from('organization_members')
    .update({ role })
    .eq('id', memberId);

  if (error) throw error;
}

export async function removeMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('organization_members')
    .delete()
    .eq('id', memberId);

  if (error) throw error;
}

export async function leaveOrganization(orgId: string): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  const { error } = await supabase
    .from('organization_members')
    .delete()
    .eq('organization_id', orgId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function isOrgAdmin(orgId: string): Promise<boolean> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  
  const { data, error } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', orgId)
    .eq('user_id', userId)
    .single();

  if (error) return false;
  return data?.role === 'admin';
}

const extractTeamColor = (team: Tables<'teams'>) => {
  const withColor = team as Tables<'teams'> & { color?: string | null };
  return withColor.color ?? defaultTeamColor;
};

export async function createTeam(orgId: string, name: string, icon: TeamIcon = defaultTeamIcon): Promise<Team> {
  const payload: TablesInsert<'teams'> = {
    organization_id: orgId,
    name,
    icon,
  };
  const { data, error } = await supabase
    .from('teams')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return { ...data, icon: normalizeTeamIcon(data.icon), color: extractTeamColor(data) };
}

export async function getTeamsByOrganization(orgId: string): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('organization_id', orgId)
    .order('name');

  if (error) throw error;
  return (data || []).map((team) => ({ ...team, icon: normalizeTeamIcon(team.icon), color: extractTeamColor(team) }));
}

export async function updateTeam(teamId: string, updates: { name?: string; icon?: TeamIcon }): Promise<Team> {
  const payload: TablesUpdate<'teams'> = {
    name: updates.name,
    icon: updates.icon,
  };
  const { data, error } = await supabase
    .from('teams')
    .update(payload)
    .eq('id', teamId)
    .select()
    .single();

  if (error) throw error;
  return { ...data, icon: normalizeTeamIcon(data.icon), color: extractTeamColor(data) };
}

export async function deleteTeam(teamId: string): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', teamId);

  if (error) throw error;
}

export async function addTeamMember(teamId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .insert({ team_id: teamId, user_id: userId });

  if (error) throw error;
}

export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function getTeamMembers(teamId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('user_id')
    .eq('team_id', teamId);

  if (error) throw error;
  return data.map(m => m.user_id);
}
