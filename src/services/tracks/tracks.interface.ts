import { z } from 'zod';

const albumImageDTO = z.object({
  url: z.string().url(),
  height: z.number().nullable(),
  width: z.number().nullable(),
});

const artistDTO = z.object({
  name: z.string(),
});

const trackDTO = z.object({
  name: z.string(),
  album: z.object({
    images: z.array(albumImageDTO),
    name: z.string(),
  }),
  artists: z.array(artistDTO),
  id: z.string(),
});

const track = z.object({
  mainArtist: z.string().optional(),
  albumImageUrl: z.string().optional(),
  albumName: z.string(),
  name: z.string(),
  id: z.string(),
});

export type Track = z.infer<typeof track>;
export type TrackDTO = z.infer<typeof trackDTO>;

const savedTrackDTO = z.object({
  added_at: z.string().datetime(),
  track: trackDTO,
});
const savedTrack = savedTrackDTO.omit({ track: true }).extend({ track });

export type SavedTrackDTO = z.infer<typeof savedTrackDTO>;
export type SavedTrack = z.infer<typeof savedTrack>;

export const userTracksDTO = z.object({
  href: z.string().url(),
  limit: z.number(),
  next: z.string().url(),
  offset: z.number(),
  previous: z.string().url(),
  total: z.number(),
  items: z.array(savedTrackDTO),
});

export type UserTracksDTO = z.infer<typeof userTracksDTO>;

const userTracksReq = z.object({
  market: z.string().optional(),
  limit: z.number().default(20).optional(),
  offset: z.number().default(0),
});

export type UserTracksReq = z.infer<typeof userTracksReq>;
