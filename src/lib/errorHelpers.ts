export const getErrorMessage = (error: unknown, fallback = 'Unexpected error'): string => {
  if (error instanceof Error) {
    return error.message || fallback;
  }
  if (typeof error === 'string') {
    return error;
  }
  return fallback;
};
