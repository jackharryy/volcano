import type { LucideIcon } from 'lucide-react';

export type OrgSettingsSectionId = 'organization' | 'teams' | 'users';

export interface OrgSettingsSection {
  id: OrgSettingsSectionId;
  label: string;
  helper: string;
  icon: LucideIcon;
}
