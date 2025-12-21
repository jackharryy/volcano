import { TeamIcon } from '@/types/team';

export interface Organization {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  organization_id: string;
  name: string;
  color?: string | null;
  icon: TeamIcon;
  created_at: string;
  updated_at: string;
}

export type OrganizationRole = 'admin' | 'member';

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationRole;
  joined_at: string;
  user_email?: string | null;
  user_name?: string | null;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  joined_at: string;
}

export interface OrganizationWithMembers extends Organization {
  members?: OrganizationMember[];
  teams?: Team[];
}

export interface TeamWithMembers extends Team {
  members?: TeamMember[];
}
