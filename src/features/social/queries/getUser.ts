import { useQuery } from '@tanstack/react-query';
import type { Tables } from 'lib/supabase/database.interface';

import { supabase } from 'lib/supabase/supabase.init';
import type { UsersView } from './getUsers';

async function getUser(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.avatar_url) {
    throw new Error('No avatar url for profile');
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(data.avatar_url);

  return { ...data, avatar_url: publicUrl } satisfies Tables<'profiles'>;
}

export const useGetUser = (userId: string) =>
  useQuery({
    queryKey: ['getUser', userId],
    queryFn: () => getUser(userId),
  });

async function getUsers(userIds: string[]): Promise<Tables<'profiles'>[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', userIds);

  if (error) throw error;

  const userProfiles = data.map((profile) => {
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

export const useGetUsers = (userIds: string[]) =>
  useQuery({
    queryKey: ['users', ...userIds],
    queryFn: () => getUsers(userIds),
  });

async function getUserWithRelation(userId: string): Promise<UsersView> {
  const { data, error } = await supabase
    .from('users_with_relation')
    .select()
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.avatar_url) {
    throw new Error('No avatar url for profile');
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('avatars').getPublicUrl(data.avatar_url);

  return { ...data, avatar_url: publicUrl } as UsersView;
}

export const useGetUserWithRelation = (userId: string) =>
  useQuery({
    queryKey: ['getUserWithRelation', userId],
    queryFn: () => getUserWithRelation(userId),
  });
