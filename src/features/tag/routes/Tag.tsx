import {
  AlertOctagon,
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  SearchX,
  XOctagon,
} from '@tamagui/lucide-icons';
import * as Linking from 'expo-linking';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { RefreshControl } from 'react-native';
import {
  Button,
  H4,
  ListItem,
  Paragraph,
  Separator,
  Spinner,
  View,
  XStack,
  YStack,
} from 'tamagui';

import type { Tables } from 'lib/supabase/database-generated.types';
import type { TagTabScreenProps } from 'navigation.types';
import { formatMsDuration } from 'util/index';
import { showToast } from 'util/toast';

import { useNavigation } from '@react-navigation/native';
import { selectUserId } from 'auth/auth.slice';
import { Alert } from 'components/Alert';
import { BottomSheet, type BottomSheetMethods } from 'components/BottomSheet';
import { ListFooterComponent } from 'components/ListFooter';
import { Text } from 'components/Text';
import { useCreateFuseTag } from 'fuse/queries/createFuse';
import { useAppSelector } from 'store/hooks';
import { TagBadge } from 'tag/components/TagBadge';
import { TagRow } from 'tag/components/TagRow';
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

  const { data: selectedTag, isLoading: selectedTagLoading } = useGetTag({
    id: params.id,
  });
  const {
    data: selectedTagTracks,
    refetch: refetchTracks,
    isRefetching: isRefetchingTracks,
    isError: isTracksError,
    isFetching: isFetchingTracks,
  } = useGetTagTracks({ tagId: params.id });

  const infoBottomSheet = useRef<BottomSheetMethods>(null);
  const fuseBottomSheet = useRef<BottomSheetMethods>(null);

  const listDuration = formatMsDuration(
    selectedTagTracks
      ?.map((track) => track.duration)
      .reduce((acc, curr) => acc + curr, 0) ?? 0,
  );

  if (selectedTagLoading) {
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

  if (!selectedTag) {
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

  const isFriendsTag = selectedTag.user_id !== userId;

  return (
    <YStack bg="$primary700" flex={1}>
      <YStack gap={16} px={12} pt={12}>
        <TagRow color={selectedTag.color} name={selectedTag.name} />

        {selectedTagTracks && !isFriendsTag && (
          <TagSyncSection
            tag={selectedTag}
            tagTracks={selectedTagTracks}
            openInfoSheet={() => infoBottomSheet.current?.expand()}
          />
        )}

        {isFriendsTag && (
          <Button onPress={() => fuseBottomSheet.current?.expand()}>
            Fuse Tag
          </Button>
        )}
      </YStack>

      <YStack mt={16}>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          px={12}
          gap={16}
        >
          <H4>Tracks</H4>

          <Paragraph>{`${listDuration} min`}</Paragraph>
        </XStack>

        <Separator mx={12} />

        <View h="86%">
          <TracksList
            tracks={selectedTagTracks}
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
      </YStack>

      {!isFriendsTag && <EditTagSheet tag={selectedTag} />}

      {isFriendsTag && (
        <BottomSheet ref={fuseBottomSheet}>
          <FuseSheet tagId={selectedTag.id} />
        </BottomSheet>
      )}

      <BottomSheet ref={infoBottomSheet}>
        <YStack gap={12}>
          <H4>Syncing Playlists</H4>

          <Paragraph>
            Fuse exports and syncs tracks that have been tagged in Fuse. Any
            track added or removed in Spotify is not considered
          </Paragraph>
        </YStack>
      </BottomSheet>
    </YStack>
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
  tagTracks: SpotifyTrack[];
  openInfoSheet(): void;
}

function TagSyncSection({
  tag,
  tagTracks,
  openInfoSheet,
}: TagSyncSectionProps) {
  const [tagStatus, setTagStatus] = useState<TagSyncStatus>();

  const { mutateAsync: syncPlaylist } = useSyncPlaylist({ tagStatus });

  useEffect(() => {
    const tagSyncStatus = getTagSyncStatus({ ...tag });

    setTagStatus(tagSyncStatus);
  }, [tag]);

  function renderStatusIcon(status?: TagSyncStatus): ReactNode {
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

  return (
    <YStack gap={12}>
      <ListItem
        icon={() => renderStatusIcon(tagStatus)}
        title={tagStatus}
        iconAfter={<HelpCircle size={16} />}
        onPress={openInfoSheet}
        radiused
      />

      <XStack justifyContent="space-between" gap={16}>
        <Button
          flex={1}
          bg="$brandDark"
          iconAfter={RefreshCw}
          onPress={() =>
            syncPlaylist(
              {
                name: tag.name,
                tracks: tagTracks.map((track) => track.uri) ?? [],
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
                  setTagStatus('Synced');
                },
              },
            )
          }
          disabled={tagStatus === 'Synced'}
        >
          {tagStatus === 'Unexported' ? 'Export to Spotify' : 'Sync'}
        </Button>

        {tag?.spotify_playlist_uri && tag.spotify_playlist_uri !== null && (
          <Button
            flex={1}
            onPress={() => Linking.openURL(tag.spotify_playlist_uri ?? '')}
            iconAfter={ArrowUpRight}
          >
            Open in Spotify
          </Button>
        )}
      </XStack>
    </YStack>
  );
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
