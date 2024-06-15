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
import { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl } from 'react-native';
import { Button, H4, Separator, Spinner, View, XStack, YStack } from 'tamagui';

import type { Tables, TagOrFuseEntry } from 'lib/supabase/database.interface';
import type {
  TagScreenNavigationProp,
  TagTabScreenProps,
} from 'navigation.types';
import { formatMsDuration } from 'util/index';
import { showToast } from 'util/toast';

import { selectUserId } from 'auth/auth.slice';
import { Alert } from 'components/Alert';
import { CircleBUtton } from 'components/CircleButton';
import { DetachedModal } from 'components/DetachedModal';
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
    return <Alert label="Error getting tracks" type="error" mx={12} />;
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

interface CreateFuseArgs {
  currentTag: Tables<'tags'>;
  selectedTag: Tables<'tags'>;
}

function TagActions({ tag, tracks, isFriendsTag }: TagSyncSectionProps) {
  const tagStatus = getTagSyncStatus({ ...tag });
  const { mutateAsync: syncPlaylist } = useSyncPlaylist({ tagStatus });
  const { mutate: createFuse } = useCreateFuseTag();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation<TagScreenNavigationProp>();

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  function onCreateFuse({ currentTag, selectedTag }: CreateFuseArgs) {
    createFuse(
      {
        tagIds: [currentTag.id, selectedTag.id],
        name: `${currentTag.name} ${selectedTag.name}`,
      },
      {
        onSuccess: (data, args) => {
          navigation.setParams({
            type: 'fuse',
            tagIds: [currentTag.id, selectedTag.id],
            name: args.name,
            id: data.id,
          });
        },
      },
    );
  }

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
                  type: tag.type === 'fuse' ? 'fuseTags' : 'tags',
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
            onPress={() => navigation.navigate('AddTracks', { tagId: tag.id })}
            label="Add Tracks"
            icon={<Plus />}
          />
        )}
        {isFriendsTag && tag.type === 'tag' && (
          <DetachedModal ref={bottomSheetRef}>
            <FuseForm tag={tag} onCreateFuse={onCreateFuse} />
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
    return 'Unsynced';
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

function FuseForm({
  tag: currentTag,
  onCreateFuse,
}: { tag: Tables<'tags'>; onCreateFuse(args: CreateFuseArgs): void }) {
  const userId = useAppSelector(selectUserId);
  const { data } = useGetTags(userId);
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(
    undefined,
  );

  function handleCreateFuse() {
    const selected = data?.find((tag) => tag.id === selectedTagId);

    if (!selected) {
      return;
    }

    onCreateFuse({ currentTag, selectedTag: selected });
  }

  return (
    <YStack gap={12} justifyContent="space-between" pb={12}>
      <H4>{`Select Tag to Fuse with ${currentTag.name}`}</H4>

      <XStack gap={12}>
        {data?.map((tag) => (
          <TagBadge
            name={tag.name}
            color={{ type: 'tag', color: tag.color }}
            key={tag.id}
            selected={tag.id === selectedTagId}
            onPress={() => setSelectedTagId(tag.id)}
          />
        ))}
      </XStack>

      <Button disabled={!selectedTagId} onPress={handleCreateFuse}>
        Create Fuse
      </Button>
    </YStack>
  );
}
