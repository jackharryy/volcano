import type { User } from '@supabase/supabase-js';

type UserMetadataRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UserMetadataRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getMetadataValue = (record: UserMetadataRecord, key: string): string => {
  const value = record[key];
  return typeof value === 'string' ? value : '';
};

export const getUserIdentity = (user: User | null | undefined) => {
  const metadata = isRecord(user?.user_metadata) ? user?.user_metadata : {};

  const first = (getMetadataValue(metadata, 'first_name') || getMetadataValue(metadata, 'firstName')).trim();
  const last = (getMetadataValue(metadata, 'last_name') || getMetadataValue(metadata, 'lastName')).trim();
  const combined = `${first} ${last}`.trim();
  const metadataName = getMetadataValue(metadata, 'name');

  const email = user?.email || '';
  const fallbackFromEmail = email ? email.split('@')[0] : '';
  const displayName = combined || metadataName || fallbackFromEmail || 'User';

  return {
    firstName: first,
    lastName: last,
    fullName: combined,
    displayName,
    email,
  };
};
