import { Priority } from "@/types/ticket";

export const categories = [
  'Bug',
  'Feature Request',
  'Performance',
  'Infrastructure',
  'Security',
  'Other',
];

export const priorities: { id: Priority; label: string; color: string }[] = [
  { id: 'urgent', label: 'Urgent', color: 'bg-destructive' },
  { id: 'high', label: 'High', color: 'bg-orange-500' },
  { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { id: 'low', label: 'Low', color: 'bg-blue-500' },
];
