export const toUpdatedSince = (
  updatedSince?: string | Date
): string | undefined =>
  updatedSince instanceof Date ? updatedSince.toISOString() : updatedSince;
