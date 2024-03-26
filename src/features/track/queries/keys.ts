export const trackKeys = {
  all: ['tracks'] as const,
  infinite: () => [...trackKeys.all, 'infinite'] as const,
  detail: (id: string) => [...trackKeys.all, id] as const,
};

export const trackTagKeys = {
  all: ['trackTags'] as const,
  list: () => [...trackTagKeys.all, 'track'] as const,
  track: (trackId: string) => [...trackTagKeys.list(), trackId] as const,
  tag: (tagId: string) => [...trackTagKeys.list(), tagId] as const,
};
