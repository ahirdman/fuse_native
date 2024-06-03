import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import {
  AlertOctagon,
  CheckCircle2,
  Merge,
  Plus,
  RefreshCw,
  SearchX,
  Upload,
  XOctagon,
} from '@tamagui/lucide-icons';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useRef } from 'react';
import { RefreshControl } from 'react-native';
import { H4, Separator, Spinner, View, XStack, YStack } from 'tamagui';

import type { Tables, TagOrFuseEntry } from 'lib/supabase/database.interface';
import type { TagTabScreenProps } from 'navigation.types';
import { formatMsDuration } from 'util/index';
import { showToast } from 'util/toast';

import { selectUserId } from 'auth/auth.slice';
import { Alert } from 'components/Alert';
import { DetachedModal } from 'components/BottomSheetV2';
import { CircleBUtton } from 'components/CircleButton';
import { StyledImage } from 'components/Image';
import { ListFooterComponent } from 'components/ListFooter';
import { SectionBox } from 'components/SecitonBox';
import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import { useCreateFuseTag } from 'fuse/queries/createFuse';
import { useAppSelector } from 'store/hooks';
import { TagBadge } from 'tag/components/TagBadge';
import { TagForm } from 'tag/components/Tagform';
import { TagEditMenu } from 'tag/components/tag.menu';
import { useDeleteTag } from 'tag/queries/deleteTag';
import { useGetTagCreators } from 'tag/queries/getTagCreators';
import { useGetTagTracks } from 'tag/queries/getTagTracks';
import { useGetTag, useGetTags } from 'tag/queries/getTags';
import { type TagSyncStatus, useSyncPlaylist } from 'tag/queries/playlist';
import { useUpdateTag } from 'tag/queries/updateTag';
import { TracksList } from 'track/components/TrackList';
import type { SpotifyTrack } from 'track/track.interface';

export function TagView({
  navigation,
  route: { params },
}: TagTabScreenProps<'Tag'>) {
  const userId = useAppSelector(selectUserId);
  const { data: tag, isLoading: isTagLoading } = useGetTag({
    id: params.id,
    type: params.type,
  });

  const {
    data: tracks,
    refetch: refetchTracks,
    isRefetching: isRefetchingTracks,
    isError: isTracksError,
    isFetching: isFetchingTracks,
  } = useGetTagTracks({
    tagIds: params.type === 'tag' ? [params.id] : params.tagIds,
  });

  if (isTagLoading) {
    return (
      <YStack
        bg="$primary700"
        fullscreen
        justifyContent="center"
        alignItems="center"
      >
        <Spinner />
      </YStack>
    );
  }

  if (!tag) {
    return (
      <YStack
        bg="$primary700"
        fullscreen
        justifyContent="center"
        alignItems="center"
      >
        <Alert label="Unable to find tag" />
      </YStack>
    );
  }

  const isFriendsTag = tag.created_by !== userId;
  const listDuration = formatMsDuration(
    tracks
      ?.map((track) => track.duration)
      .reduce((acc, curr) => acc + curr, 0) ?? 0,
  );

  return (
    <YStack bg="$primary700" flex={1}>
      <TagMetaData
        tag={tag}
        listDuration={listDuration}
        isFriendsTag={isFriendsTag}
      />

      <TagActions tag={tag} tracks={tracks} isFriendsTag={isFriendsTag} />

      <Separator m={12} />

      <TracksList
        tracks={tracks}
        tagId={params.id}
        isSwipeable
        //onEndReachedThreshold={0.3} - TODO: Paginate response from SupaBase
        ListEmptyComponent={
          <TagTracksListEmptyComponent
            isError={isTracksError}
            isFetching={isFetchingTracks}
          />
        }
        ListFooterComponent={
          isFetchingTracks && !isRefetchingTracks ? (
            <ListFooterComponent />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingTracks}
            onRefresh={refetchTracks}
            tintColor="#F4753F"
          />
        }
        onTrackPress={(trackId) =>
          navigation.navigate('Track', {
            trackId,
          })
        }
        listStyle={{
          paddingTop: 4,
          paddingBottom: 8,
        }}
      />

      {!isFriendsTag && <EditTagSheet tag={tag} />}
    </YStack>
  );
}

interface TagMetaDataProps {
  tag: TagOrFuseEntry;
  listDuration: string;
  isFriendsTag: boolean;
}

function TagMetaData({ tag, listDuration, isFriendsTag }: TagMetaDataProps) {
  const tagSyncStatus = getTagSyncStatus({ ...tag });
  const badgeColor =
    tag.type === 'tag'
      ? { color: tag.color, type: tag.type }
      : { type: tag.type, colors: tag.tags.map((tag) => tag.color) };

  const tagIds = tag.type === 'tag' ? [tag.id] : tag.tags.map((tag) => tag.id);

  const { data: profiles } = useGetTagCreators(tagIds);

  return (
    <YStack gap={8} mx={12}>
      <XStack jc="space-between" gap={8}>
        <SectionBox>
          <Text fontWeight="bold">Created by</Text>
          <XStack justifyContent="flex-end" gap={4}>
            {profiles?.map((profile) => {
              return (
                <UserAvatar
                  imageUrl={profile?.avatar_url ?? undefined}
                  size="small"
                  key={profile.id}
                />
              );
            })}
          </XStack>
        </SectionBox>

        <SectionBox>
          <Text fontWeight="bold">{tag.type === 'tag' ? 'Tag' : 'Fuse'}</Text>
          <TagBadge name={tag.name} color={badgeColor} alignSelf="flex-end" />
        </SectionBox>
      </XStack>

      <XStack jc="space-between" gap={8}>
        <SectionBox>
          <Text fontWeight="bold">Duration</Text>
          <Text alignSelf="flex-end">{listDuration}</Text>
        </SectionBox>

        {isFriendsTag ? (
          <SectionBox bg="$colorTransparent" />
        ) : (
          <SectionBox jc="space-between">
            <Text fontWeight="bold">Status</Text>
            <XStack jc="space-between">
              <Text>{tagSyncStatus}</Text>
              <TagStatusIcon status={tagSyncStatus} />
            </XStack>
          </SectionBox>
        )}
      </XStack>
    </YStack>
  );
}

interface TagTracksListEmptyComponentProps {
  isFetching: boolean;
  isError: boolean;
}

function TagTracksListEmptyComponent({
  isFetching,
  isError,
}: TagTracksListEmptyComponentProps) {
  if (isFetching) {
    return <Spinner />;
  }

  if (isError) {
    return <Alert label="Could not get users" type="error" />;
  }

  return (
    <View flex={1} h="$full" jc="center" ai="center" my="30%" gap={12}>
      <SearchX size={58} color="$border300" />
      <Text fontSize="$8" fontWeight="bold" color="$border300">
        No tracks tagged
      </Text>
    </View>
  );
}

interface TagSyncSectionProps {
  tag: TagOrFuseEntry;
  tracks?: SpotifyTrack[] | undefined;
  isFriendsTag: boolean;
}

function TagActions({ tag, tracks, isFriendsTag }: TagSyncSectionProps) {
  const tagStatus = getTagSyncStatus({ ...tag });
  const { mutateAsync: syncPlaylist } = useSyncPlaylist({ tagStatus });
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <YStack gap={16} px={12} pt={12}>
      <XStack justifyContent="space-evenly">
        {isFriendsTag && (
          <CircleBUtton
            onPress={handlePresentModalPress}
            label="Fuse"
            icon={<Merge />}
          />
        )}

        {!isFriendsTag &&
          tag?.spotify_playlist_uri &&
          tag.spotify_playlist_uri !== null && (
            <CircleBUtton
              onPress={() => Linking.openURL(tag.spotify_playlist_uri ?? '')}
              icon={
                <XStack>
                  <StyledImage
                    source={require('../../../../assets/icons/Spotify_Icon_White.png')}
                    h={30}
                    width="$full"
                    contentFit="contain"
                  />
                </XStack>
              }
              label=" Open Spotify"
            />
          )}

        {!isFriendsTag && !!tracks?.length && tagStatus !== 'Synced' && (
          <CircleBUtton
            label={tagStatus === 'Unexported' ? 'Export' : 'Sync'}
            icon={tagStatus === 'Unexported' ? <Upload /> : <RefreshCw />}
            onPress={() =>
              syncPlaylist(
                {
                  name: tag.name,
                  tracks: tracks.map((track) => track.uri) ?? [],
                  id: tag.id,
                  type: 'tags',
                  snapshot_id: tag.latest_snapshot_id,
                  playlistId: tag.spotify_playlist_id,
                },
                {
                  onSuccess: () => {
                    showToast({
                      title:
                        tagStatus === 'Unexported'
                          ? 'Playlist created'
                          : 'Playlist synced',
                      preset: 'done',
                    });
                  },
                },
              )
            }
          />
        )}

        {!isFriendsTag && tag.type === 'tag' && (
          <CircleBUtton
            onPress={() => console.log('Not implemented')}
            label="Add Tracks"
            icon={<Plus />}
          />
        )}
        {isFriendsTag && (
          <DetachedModal ref={bottomSheetRef} snapPoints={['20%']}>
            <FuseForm tag={tag} />
          </DetachedModal>
        )}
      </XStack>
    </YStack>
  );
}

function TagStatusIcon({ status }: { status?: TagSyncStatus }) {
  switch (status) {
    case 'Unexported':
      return <XOctagon color="$error600" />;
    case 'Unsynced':
      return <AlertOctagon color="$warning600" />;
    case 'Synced':
      return <CheckCircle2 color="$success500" />;
    default:
      return null;
  }
}

interface TagSyncStatusArgs
  extends Pick<
    Tables<'tags'>,
    'latest_snapshot_id' | 'spotify_playlist_id' | 'synced_at'
  > {
  updated_at?: string;
}

function getTagSyncStatus({
  latest_snapshot_id,
  spotify_playlist_id,
  updated_at,
  synced_at,
}: TagSyncStatusArgs): TagSyncStatus {
  if (!spotify_playlist_id || !latest_snapshot_id || !synced_at) {
    return 'Unexported';
  }

  if (!updated_at) {
    return 'Unsynced'; // TODO: Missing property in fusetags
  }

  return synced_at.slice(0, 19) >= updated_at.slice(0, 19)
    ? 'Synced'
    : 'Unsynced';
}

function EditTagSheet({ tag }: { tag: TagOrFuseEntry }) {
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { mutate: updateTagMutation, isPending } = useUpdateTag();
  const { mutate: deleteTagMutation } = useDeleteTag();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TagEditMenu
          onEditPress={tag.type === 'tag' ? handlePresentModalPress : undefined}
          onDeletePress={() =>
            deleteTagMutation(tag.id, {
              onSuccess: () => {
                navigation.goBack();
              },
            })
          }
        />
      ),
    });
  }, [
    navigation,
    deleteTagMutation,
    tag.id,
    tag.type,
    handlePresentModalPress,
  ]);

  if (tag.type === 'fuse') {
    return null;
  }

  return (
    <DetachedModal ref={bottomSheetRef}>
      <TagForm
        label="Edit Tag"
        confirmAction={(data) =>
          updateTagMutation(
            {
              id: tag.id,
              color: data.color,
              name: data.name,
            },
            {
              onSuccess: (_, { name, color }) => {
                //@ts-ignore
                navigation.setParams({ name, color });
                bottomSheetRef.current?.close();
              },
            },
          )
        }
        closeAction={() => bottomSheetRef.current?.close()}
        existingTag={{ color: tag.color }}
        isLoading={isPending}
      />
    </DetachedModal>
  );
}

function FuseForm({ tag: currentTag }: { tag: TagOrFuseEntry }) {
  const userId = useAppSelector(selectUserId);
  const { mutate: createFuse } = useCreateFuseTag();
  const { data } = useGetTags(userId);

  return (
    <YStack gap={12}>
      <H4>Select Tag to Fuse with</H4>

      <XStack gap={12}>
        {data?.map((tag) => (
          <TagBadge
            name={tag.name}
            color={{ type: 'tag', color: tag.color }}
            key={tag.id}
            onPress={() =>
              createFuse({
                tagIds: [currentTag.id, tag.id],
                name: `${currentTag.name} ${tag.name}`,
              })
            }
          />
        ))}
      </XStack>
    </YStack>
  );
}
