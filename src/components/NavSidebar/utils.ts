export const toggleSingleFilter = <T>(value: T, current: T[]): T[] => {
  if (current.includes(value)) {
    return [];
  }
  return [value];
};
