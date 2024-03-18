import {
  AlertOctagon,
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  XCircle,
  XOctagon,
} from '@tamagui/lucide-icons';
import * as Linking from 'expo-linking';
import { type ReactNode, useEffect, useState } from 'react';
import {
  Button,
  H4,
  ListItem,
  Paragraph,
  Separator,
  Sheet,
  View,
  XStack,
  YStack,
} from 'tamagui';

import type { Tables } from 'lib/supabase/database-generated.types';
import type { TagListScreenProps } from 'navigation.types';
import { formatMsDuration } from 'util/index';
import { showToast } from 'util/toast';

import { Alert } from 'components/Alert';
import { TagForm } from 'tag/components/Tagform';
import { TagEditMenu } from 'tag/components/tag.menu';
import { useDeleteTag } from 'tag/queries/deleteTag';
import { useGetTagTracks } from 'tag/queries/getTagTracks';
import { useGetTag } from 'tag/queries/getTags';
import { TagSyncStatus, useSyncPlaylist } from 'tag/queries/playlist';
import { useUpdateTag } from 'tag/queries/updateTag';
import { TracksList } from 'track/components/TrackList';

export function TagView({
  navigation,
  route: { params },
}: TagListScreenProps<'Tag'>) {
  const [editTagSheetVisible, setEditTagSheetVisible] = useState(false);
  const [infoSheetVisible, setInfoSheetVisible] = useState(false);
  const [tagStatus, setTagStatus] = useState<TagSyncStatus>();

  const { data: selectedTag, isLoading: selectedTagLoading } = useGetTag({
    id: params.id,
  });
  const { mutate: updateTagMutation, isPending } = useUpdateTag();
  const { mutate: deleteTagMutation } = useDeleteTag();
  const { mutateAsync: syncPlaylist } = useSyncPlaylist({ tagStatus });
  const {
    data: selectedTagTracks,
    refetch: refetchTracks,
    isRefetching: isRefreshingTracks,
  } = useGetTagTracks({ tagId: params.id });

  useEffect(() => {
    if (!selectedTag) {
      return;
    }

    const tagSyncStatus = getTagSyncStatus({ ...selectedTag });

    setTagStatus(tagSyncStatus);
  }, [selectedTag]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TagEditMenu
          onEditPress={() => setEditTagSheetVisible(true)}
          onDeletePress={() =>
            deleteTagMutation(params.id, {
              onSuccess: () => {
                navigation.goBack();
              },
            })
          }
        />
      ),
    });
  }, [navigation, deleteTagMutation, params.id]);

  const listDuration = formatMsDuration(
    selectedTagTracks
      ?.map((track) => track.duration)
      .reduce((acc, curr) => acc + curr, 0) ?? 0,
  );

  if (!selectedTagLoading && !selectedTag) {
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

  return (
    <YStack bg="$primary700" flex={1}>
      <YStack gap={16} px={12} pt={12}>
        <ListItem
          icon={() => renderStatusIcon(tagStatus)}
          title={tagStatus}
          iconAfter={<HelpCircle size={16} />}
          onPress={() => setInfoSheetVisible(true)}
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
                  name: params.name,
                  tracks: selectedTagTracks?.map((track) => track.uri) ?? [],
                  tagId: params.id.toString(),
                  snapshot_id: selectedTag?.latest_snapshot_id,
                  playlistId: selectedTag?.spotify_playlist_id,
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

          {selectedTag?.spotify_playlist_uri &&
            selectedTag.spotify_playlist_uri !== null && (
              <Button
                flex={1}
                onPress={() =>
                  Linking.openURL(selectedTag.spotify_playlist_uri ?? '')
                }
                iconAfter={ArrowUpRight}
              >
                Open in Spotify
              </Button>
            )}
        </XStack>
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

        {selectedTagTracks && (
          <View h="86%">
            <TracksList
              tracks={selectedTagTracks}
              onTrackPress={(trackId) =>
                navigation.navigate('Track', {
                  trackId,
                })
              }
              onRefetch={refetchTracks}
              onEndReached={() => {}}
              isRefreshing={isRefreshingTracks}
              listStyle={{
                paddingTop: 4,
                paddingHorizontal: 4,
                paddingBottom: 8,
              }}
            />
          </View>
        )}
      </YStack>

      <Sheet
        modal
        moveOnKeyboardChange
        open={editTagSheetVisible}
        animation="quick"
        snapPointsMode="fit"
        disableDrag
      >
        <Sheet.Overlay
          onPress={() => setEditTagSheetVisible(false)}
          animation="quick"
          enterStyle={{ opacity: 0.5 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame padding={20} borderRadius={28} pb={48}>
          <TagForm
            label="Edit Tag"
            confirmAction={(data) =>
              updateTagMutation(
                {
                  id: params.id,
                  color: data.color,
                  name: data.name,
                },
                {
                  onSuccess: (_, { name, color }) => {
                    navigation.setParams({ name, color });
                    setEditTagSheetVisible(false);
                  },
                },
              )
            }
            closeAction={() => setEditTagSheetVisible(false)}
            existingTag={{ color: selectedTag?.color, name: selectedTag?.name }}
            isLoading={isPending}
          />
        </Sheet.Frame>
      </Sheet>

      <Sheet
        modal
        moveOnKeyboardChange
        open={infoSheetVisible}
        animation="quick"
        snapPointsMode="fit"
        disableDrag
      >
        <Sheet.Overlay
          onPress={() => setInfoSheetVisible(false)}
          animation="quick"
          enterStyle={{ opacity: 0.5 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Frame padding={20} borderRadius={28} pb={48} gap={16}>
          <XStack justifyContent="space-between" alignItems="center">
            <H4>Syncing Playlists</H4>
            <XCircle onPress={() => setInfoSheetVisible(false)} />
          </XStack>

          <Paragraph>
            Fuse exports and syncs tracks that have been tagged in Fuse. Any
            track added or removed in Spotify is not considered
          </Paragraph>
        </Sheet.Frame>
      </Sheet>
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
