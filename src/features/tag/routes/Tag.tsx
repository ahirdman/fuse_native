import {
  AlertOctagon,
  CheckCircle2,
  Disc,
  Disc3,
  Merge,
  Plus,
  RefreshCw,
  SearchX,
  Send,
  Upload,
  XOctagon,
} from '@tamagui/lucide-icons';
import * as Linking from 'expo-linking';
import { useEffect, useRef } from 'react';
import { RefreshControl } from 'react-native';
import {
  H4,
  Separator,
  Spinner,
  View,
  XStack,
  YStack,
  type YStackProps,
} from 'tamagui';

import type { Tables } from 'lib/supabase/database-generated.types';
import type { TagTabScreenProps } from 'navigation.types';
import { formatMsDuration } from 'util/index';
import { showToast } from 'util/toast';

import { useNavigation } from '@react-navigation/native';
import { selectUserId } from 'auth/auth.slice';
import { Alert } from 'components/Alert';
import { BottomSheet, type BottomSheetMethods } from 'components/BottomSheet';
import { CircleBUtton } from 'components/CircleButton';
import { StyledImage } from 'components/Image';
import { ListFooterComponent } from 'components/ListFooter';
import { SectionBox } from 'components/SecitonBox';
import { Text } from 'components/Text';
import { UserAvatar } from 'components/UserAvatar';
import { useCreateFuseTag } from 'fuse/queries/createFuse';
import { useGetAvatarUrl } from 'social/queries/getSignedAvatarUrl';
import { useGetUser } from 'social/queries/getUser';
import { useAppSelector } from 'store/hooks';
import { TagBadge } from 'tag/components/TagBadge';
import { TagForm } from 'tag/components/Tagform';
import { TagEditMenu } from 'tag/components/tag.menu';
import { useDeleteTag } from 'tag/queries/deleteTag';
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
  });
  const {
    data: tracks,
    refetch: refetchTracks,
    isRefetching: isRefetchingTracks,
    isError: isTracksError,
    isFetching: isFetchingTracks,
  } = useGetTagTracks({ tagId: params.id });

  const fuseBottomSheet = useRef<BottomSheetMethods>(null);

  const listDuration = formatMsDuration(
    tracks
      ?.map((track) => track.duration)
      .reduce((acc, curr) => acc + curr, 0) ?? 0,
  );

  if (isTagLoading) {
    return (
      <YStack
        bg="%primary700"
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
        bg="%primary700"
        fullscreen
        justifyContent="center"
        alignItems="center"
      >
        <Alert label="Unable to find tag" />
      </YStack>
    );
  }

  const isFriendsTag = tag.user_id !== userId;

  return (
    <YStack bg="$primary700" flex={1}>
      <TagMetaData
        tag={tag}
        listDuration={listDuration}
        isFriendsTag={isFriendsTag}
      />

      <YStack gap={16} px={12} pt={12}>
        <TagActions
          tag={tag}
          tracks={tracks}
          isFriendsTag={isFriendsTag}
          openFuseSheet={() => fuseBottomSheet.current?.expand()}
        />
      </YStack>

      <Separator m={12} />

      <View h="86%">
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
      </View>

      {!isFriendsTag && <EditTagSheet tag={tag} />}

      {isFriendsTag && (
        <BottomSheet ref={fuseBottomSheet}>
          <FuseSheet tagId={tag.id} />
        </BottomSheet>
      )}
    </YStack>
  );
}

interface TagMetaDataProps extends Omit<YStackProps, 'tag'> {
  tag: Tables<'tags'>;
  listDuration: string;
  isFriendsTag: boolean;
}

function TagMetaData({
  tag,
  listDuration,
  isFriendsTag,
  ...props
}: TagMetaDataProps) {
  const { data: profile } = useGetUser(tag.user_id);
  const { data: avatarUrl } = useGetAvatarUrl(profile?.avatar_url);
  const tagSyncStatus = getTagSyncStatus({ ...tag });

  return (
    <YStack gap={8} mx={12} {...props}>
      <XStack jc="space-between" gap={8}>
        <SectionBox>
          <Text fontWeight="bold">Created by</Text>
          <UserAvatar imageUrl={avatarUrl} size="small" alignSelf="flex-end" />
        </SectionBox>

        <SectionBox>
          <Text fontWeight="bold">Tag</Text>
          <TagBadge name={tag.name} color={tag.color} alignSelf="flex-end" />
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
  tag: Tables<'tags'>;
  tracks?: SpotifyTrack[] | undefined;
  isFriendsTag: boolean;
  openFuseSheet(): void;
}

function TagActions({
  tag,
  tracks,
  isFriendsTag,
  openFuseSheet,
}: TagSyncSectionProps) {
  const tagStatus = getTagSyncStatus({ ...tag });
  const { mutateAsync: syncPlaylist } = useSyncPlaylist({ tagStatus });

  return (
    <XStack justifyContent="space-evenly">
      {isFriendsTag && (
        <CircleBUtton onPress={openFuseSheet} label="Fuse" icon={<Merge />} />
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

      {!isFriendsTag && (
        <CircleBUtton
          onPress={() => console.log('Not implemented')}
          label="Add Tracks"
          icon={<Plus />}
        />
      )}
    </XStack>
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

type TagSyncStatusArgs = Pick<
  Tables<'tags'>,
  'latest_snapshot_id' | 'spotify_playlist_id' | 'updated_at' | 'synced_at'
>;

function getTagSyncStatus({
  latest_snapshot_id,
  spotify_playlist_id,
  updated_at,
  synced_at,
}: TagSyncStatusArgs): TagSyncStatus {
  if (!spotify_playlist_id || !latest_snapshot_id || !synced_at) {
    return 'Unexported';
  }

  return synced_at.slice(0, 19) >= updated_at.slice(0, 19)
    ? 'Synced'
    : 'Unsynced';
}

interface EditTagSheetProps {
  tag: Tables<'tags'>;
}

function EditTagSheet({ tag }: EditTagSheetProps) {
  const navigation = useNavigation();
  const editBottomSheet = useRef<BottomSheetMethods>(null);

  const { mutate: updateTagMutation, isPending } = useUpdateTag();
  const { mutate: deleteTagMutation } = useDeleteTag();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TagEditMenu
          onEditPress={() => editBottomSheet.current?.expand()}
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
  }, [navigation, deleteTagMutation, tag.id]);

  return (
    <BottomSheet ref={editBottomSheet}>
      <YStack gap={12} w="$full">
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
                  editBottomSheet.current?.close();
                },
              },
            )
          }
          closeAction={() => editBottomSheet.current?.close()}
          existingTag={{ color: tag.color, name: tag.name }}
          isLoading={isPending}
        />
      </YStack>
    </BottomSheet>
  );
}

interface FuseSheetProps {
  tagId: number;
}

function FuseSheet({ tagId }: FuseSheetProps) {
  const userId = useAppSelector(selectUserId);
  const { mutate: createFuse } = useCreateFuseTag();
  const { data } = useGetTags(userId);

  return (
    <YStack gap={12}>
      <H4>Select Tag to Fuse with</H4>

      {data?.map((tag) => (
        <TagBadge
          name={tag.name}
          color={tag.color}
          key={tag.id}
          onPress={() =>
            createFuse({ initialTagId: tagId, matchedTagId: tag.id })
          }
        />
      ))}
    </YStack>
  );
}
