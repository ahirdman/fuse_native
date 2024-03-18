export const trackKeys = {
  all: ['tracks'] as const,
  infinite: () => [...trackKeys.all, 'infinite'] as const,
  detail: (id: string) => [...trackKeys.all, id] as const,
};

export const trackTagKeys = {
  all: ['trackTags'] as const,
  track: (trackId: string) => [...trackTagKeys.all, 'track', trackId] as const,
  tag: (tagId: string) => [...trackTagKeys.all, tagId] as const,
};
