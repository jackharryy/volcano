import type { Status } from '@/types/ticket';
import type { StatusTab } from '../types';
import { statusConfig } from './constants';

export const getStatusTabs = (statusCounts: Record<Status, number>): StatusTab[] => {
  const total = statusCounts.open + statusCounts['in-progress'] + statusCounts.resolved + statusCounts.snoozed;

  return [
    { key: 'open' as Status | 'all', label: statusConfig.open.label, count: statusCounts.open },
    { key: 'in-progress' as Status | 'all', label: statusConfig['in-progress'].label, count: statusCounts['in-progress'] },
    { key: 'resolved' as Status | 'all', label: statusConfig.resolved.label, count: statusCounts.resolved },
    { key: 'snoozed' as Status | 'all', label: statusConfig.snoozed.label, count: statusCounts.snoozed },
    { key: 'all' as const, label: 'All', count: total },
  ];
};
