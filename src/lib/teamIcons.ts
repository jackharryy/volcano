import { Bolt, BookText, ChartLine, Compass, Database, Eye, Flame, Laptop, LucideIcon, MessageSquare, PhoneCall, Rocket,  Shield, Smartphone, Sparkles, Star, Target, Workflow } from 'lucide-react';
import { DEFAULT_TEAM_ICON, TEAM_ICON_CHOICES, TeamIcon } from '@/types/team';

const iconMap: Record<TeamIcon, LucideIcon> = {
  shield: Shield,
  bolt: Bolt,
  flame: Flame,
  rocket: Rocket,
  star: Star,
  target: Target,
  compass: Compass,
  sparkles: Sparkles,
  laptop: Laptop,
  message: MessageSquare,
  eye: Eye,
  workflow: Workflow,
  mobile: Smartphone,
  'phone-call': PhoneCall,
  book: BookText,
  database: Database,
  chart: ChartLine

};

export const teamIconOptions: { value: TeamIcon; label: string; Icon: LucideIcon }[] = [
  { value: 'shield', label: 'Shield', Icon: Shield },
  { value: 'bolt', label: 'Bolt', Icon: Bolt },
  { value: 'flame', label: 'Flame', Icon: Flame },
  { value: 'rocket', label: 'Rocket', Icon: Rocket },
  { value: 'star', label: 'Star', Icon: Star },
  { value: 'target', label: 'Target', Icon: Target },
  { value: 'compass', label: 'Compass', Icon: Compass },
  { value: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { value: 'laptop', label: 'Laptop', Icon: Laptop },
  { value: 'message', label: 'Message', Icon: MessageSquare },
  { value: 'eye', label: 'Eye', Icon: Eye },
  { value: 'workflow', label: 'Workflow', Icon: Workflow },
  { value: 'mobile', label: 'Mobile', Icon: Smartphone },
  { value: 'phone-call', label: 'Phone Call', Icon: PhoneCall },
  { value: 'book', label: 'Book', Icon: BookText },
  { value: 'database', label: 'Database', Icon: Database },
  { value: 'chart', label: 'Chart', Icon: ChartLine },
];

export const defaultTeamIcon = DEFAULT_TEAM_ICON;

export function getTeamIcon(icon?: string | null): LucideIcon {
  if (!icon) return iconMap[DEFAULT_TEAM_ICON];
  return iconMap[icon as TeamIcon] || iconMap[DEFAULT_TEAM_ICON];
}

export function normalizeTeamIcon(icon?: string | null): TeamIcon {
  return TEAM_ICON_CHOICES.includes(icon as TeamIcon) ? (icon as TeamIcon) : DEFAULT_TEAM_ICON;
}
