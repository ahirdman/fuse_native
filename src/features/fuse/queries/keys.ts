export const fuseKeys = {
  all: ['fuseLists'] as const,
  lists: () => [...fuseKeys.all, 'fuse'] as const,
  list: (filter: string) => [...fuseKeys.lists(), { filter }] as const,
  details: () => [...fuseKeys.all, 'detail'] as const,
  detail: (id: number) => [...fuseKeys.details(), id] as const,
};
