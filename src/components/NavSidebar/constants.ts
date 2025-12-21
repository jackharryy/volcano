import { Inbox, CheckCircle2, Clock, AlertCircle, Users, Building2, LayoutGrid } from 'lucide-react';
import { Priority, Status } from '@/types/ticket';
import { NavItem, PriorityItem, StatusItem } from './types';

export const statusItems: StatusItem[] = [
  { id: 'open', label: 'Open', icon: Inbox },
  { id: 'in-progress', label: 'In Progress', icon: Clock },
  { id: 'resolved', label: 'Resolved', icon: CheckCircle2 },
  { id: 'snoozed', label: 'Snoozed', icon: AlertCircle },
];

export const priorityItems: PriorityItem[] = [
  { id: 'urgent', label: 'Urgent', dotClass: 'bg-destructive', activeClass: 'bg-destructive/15 text-destructive border border-destructive/30' },
  { id: 'high', label: 'High', dotClass: 'bg-orange-500', activeClass: 'bg-orange-500/15 text-orange-400 border border-orange-500/30' },
  { id: 'medium', label: 'Medium', dotClass: 'bg-yellow-500', activeClass: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  { id: 'low', label: 'Low', dotClass: 'bg-blue-500', activeClass: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
];

export const navItems: NavItem[] = [
  { label: 'Tickets', to: '/', icon: LayoutGrid },
  { label: 'Organization', to: '/organization', icon: Building2 },
  { label: 'Teams', to: '/teams', icon: Users },
];
