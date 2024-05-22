export const tagKeys = {
  all: ['tags'] as const,
  lists: (userId: string) => [...tagKeys.all, 'tag', userId] as const,
  list: (userId: string, filter: string) =>
    [...tagKeys.lists(userId), { filter }] as const,
  details: () => [...tagKeys.all, 'detail'] as const,
  detail: (id: number) => [...tagKeys.details(), id] as const,
};
