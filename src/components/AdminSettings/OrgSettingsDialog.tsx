import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Organization, OrganizationMember } from '@/types/organization';
import { Team } from '@/types/ticket';
import { TeamIcon } from '@/types/team';
import { Building2, Users } from 'lucide-react';
import { getOrganizationMembers, removeMember, updateMemberRole } from '@/lib/organizationHelpers';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/errorHelpers';
import type { OrgSettingsSection, OrgSettingsSectionId } from './types';
import { OrgSettingsSectionNav } from './SectionNav';
import { OrganizationSection } from './OrganizationSection';
import { TeamsSection } from './TeamsSection';
import { UsersSection } from './UsersSection';

interface OrgSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  organization: Organization | null;
  teams: Team[];
  onRenameOrg: (name: string) => Promise<void> | void;
  onCreateTeam: (name: string, icon?: TeamIcon) => Promise<void> | void;
  onUpdateTeam: (teamId: string, updates: { name?: string; icon?: TeamIcon }) => Promise<void> | void;
  onDeleteTeam: (teamId: string) => Promise<void> | void;
  initialSection?: OrgSettingsSectionId;
}

export function OrgSettingsDialog({
  open,
  onClose,
  organization,
  teams,
  onRenameOrg,
  onCreateTeam,
  onUpdateTeam,
  onDeleteTeam,
  initialSection = 'organization',
}: OrgSettingsDialogProps) {
  const [orgName, setOrgName] = useState(organization?.name || '');
  const [activeSection, setActiveSection] = useState<OrgSettingsSectionId>(initialSection);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const sections: OrgSettingsSection[] = [
    {
      id: 'organization',
      label: 'Organization',
      helper: 'Name & invite code',
      icon: Building2,
    },
    {
      id: 'teams',
      label: 'Teams',
      helper: 'Create, edit, delete',
      icon: Users,
    }
  ];

  useEffect(() => {
    setOrgName(organization?.name || '');
  }, [organization?.name]);

  useEffect(() => {
    if (open) {
      setActiveSection(initialSection);
    }
  }, [open, initialSection]);

  useEffect(() => {
    const loadMembers = async () => {
      if (!organization?.id) return;
      setLoadingMembers(true);
      try {
        const data = await getOrganizationMembers(organization.id);
        setMembers(data);
      } catch (error) {
        toast({
          title: 'Error loading members',
          description: getErrorMessage(error),
          variant: 'destructive',
        });
      } finally {
        setLoadingMembers(false);
      }
    };

    if (open) loadMembers();
  }, [open, organization?.id]);

  const handleToggleRole = async (member: OrganizationMember) => {
    const nextRole = member.role === 'admin' ? 'member' : 'admin';
    try {
      await updateMemberRole(member.id, nextRole);
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, role: nextRole } : m)));
      toast({ title: 'Role updated', description: `${member.user_id} is now ${nextRole}.` });
    } catch (error) {
      toast({ title: 'Error updating role', description: getErrorMessage(error), variant: 'destructive' });
    }
  };

  const handleRemoveMember = async (member: OrganizationMember) => {
    try {
      await removeMember(member.id);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      toast({ title: 'Member removed', description: `${member.user_id} was removed from the org.` });
    } catch (error) {
      toast({ title: 'Error removing member', description: getErrorMessage(error), variant: 'destructive' });
    }
  };

  const handleCopy = async () => {
    if (!organization?.invite_code) return;
    await navigator.clipboard.writeText(organization.invite_code);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent noPadding className="max-w-2xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Organization Settings</DialogTitle>
          <DialogDescription>Manage your organization details and teams.</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6">
          <div className="md:min-h-[520px] space-y-6">
            <OrgSettingsSectionNav
              sections={sections}
              activeSection={activeSection}
              onSelect={setActiveSection}
            />

            <div className="space-y-6">
              {activeSection === 'organization' && (
                <OrganizationSection
                  orgName={orgName}
                  inviteCode={organization?.invite_code}
                  onOrgNameChange={setOrgName}
                  onSave={() => onRenameOrg(orgName)}
                  onCopyInvite={handleCopy}
                  saveDisabled={!orgName.trim() || orgName.trim() === (organization?.name || '').trim()}
                />
              )}

              {activeSection === 'teams' && (
                <TeamsSection
                  teams={teams}
                  onCreateTeam={onCreateTeam}
                  onUpdateTeam={onUpdateTeam}
                  onDeleteTeam={onDeleteTeam}
                />
              )}

              {/* {activeSection === 'users' && (
                <UsersSection
                  members={members}
                  loadingMembers={loadingMembers}
                  onToggleRole={handleToggleRole}
                  onRemoveMember={handleRemoveMember}
                />
              )} */}
            </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
