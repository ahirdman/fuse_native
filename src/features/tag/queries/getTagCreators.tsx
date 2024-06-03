import { useQuery } from '@tanstack/react-query';
import type { Tables } from 'lib/supabase/database.interface';
import { supabase } from 'lib/supabase/supabase.init';

interface GetTagCreatorsArgs {
  tagIds: number[];
}

async function getTagCreators({
  tagIds,
}: GetTagCreatorsArgs): Promise<Tables<'profiles'>[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('created_by')
    .in('id', tagIds);

  if (error) throw error;

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select()
    .in(
      'id',
      data.map((dto) => dto.created_by),
    );

  if (profileError) throw profileError;

  const userProfiles = profiles.map((profile) => {
    if (!profile.avatar_url) throw new Error('No avatar url');

    const avatarUrl = supabase.storage
      .from('avatars')
      .getPublicUrl(profile.avatar_url).data.publicUrl;

    return {
      ...profile,
      avatar_url: avatarUrl,
    };
  });

  return userProfiles;
}

export const useGetTagCreators = (tagIds: number[]) =>
  useQuery({
    queryKey: ['tagCreators', ...tagIds],
    queryFn: () => getTagCreators({ tagIds }),
  });
