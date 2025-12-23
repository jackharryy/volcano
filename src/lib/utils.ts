import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { Ticket, Team } from '@/types/ticket';
import { normalizeTeamIcon } from '@/lib/teamIcons';
import { defaultTeamColor } from '@/lib/organizationHelpers';

export const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || name;

export type RawTeam = { id: string; name: string; icon?: string | null; color?: string | null };

export const normalizeTeams = (incoming: RawTeam[]): Team[] =>
  incoming.map((team) => ({
    id: team.id,
    name: team.name,
    slug: toSlug(team.name),
    color: team.color ?? defaultTeamColor,
    icon: normalizeTeamIcon(team.icon),
  }));

export const assignTicketNumbers = (items: Ticket[]): Ticket[] => {
  if (!items.length) return items;
  const sorted = [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const numberMap = new Map<string, number>();
  sorted.forEach((t, idx) => numberMap.set(t.id, idx + 1));
  return items.map((t) => ({ ...t, ticketNumber: numberMap.get(t.id) }));
};

