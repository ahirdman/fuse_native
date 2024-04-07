import { useQuery } from '@tanstack/react-query';
import { supabase } from 'lib/supabase/supabase.init';
import { fuseKeys } from './keys';

export interface FuseTagRowRes {
  id: number;
  name: string;
  created_at: string;
  latest_snapshot_id: string | null;
  spotify_playlist_id: string | null;
  spotify_playlist_uri: string | null;
  synced_at: string | null;
  tag1: {
    color: string;
    name: string;
    id: number;
  };
  tag2: {
    color: string;
    name: string;
    id: number;
  };
}

async function getFuseLists(): Promise<FuseTagRowRes[]> {
  const { data, error } = await supabase
    .from('fuseTags')
    .select(`
    *,
    tag1:tags!tag_id_1(name, color, id),
    tag2:tags!tag_id_2(name, color, id)
  `)
    .returns<FuseTagRowRes[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const useGetFuseLists = <T = FuseTagRowRes[]>(
  select?: (data: FuseTagRowRes[]) => T,
) =>
  useQuery({
    queryKey: fuseKeys.lists(),
    queryFn: getFuseLists,
    select,
  });

export const useGetFuseList = ({ id }: { id: number }) =>
  useGetFuseLists((data) => data.find((fuse) => fuse.id === id));
