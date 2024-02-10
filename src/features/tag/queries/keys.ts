export const tagKeys = {
  all: ['tags'] as const,
  lists: () => [...tagKeys.all, 'tag'] as const,
  list: (filter: string) => [...tagKeys.lists(), { filter }] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: number) => [...tagKeys.details(), id] as const,
};
