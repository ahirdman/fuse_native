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
import type { TagTabScreenProps } from 'navigation.types';
import { formatMsDuration } from 'util/index';

import { Alert } from 'components/Alert';
import { ListEmptyComponent } from 'components/ListEmptyComponent';
import { ListFooterComponent } from 'components/ListFooter';
import { useDeleteFuse } from 'fuse/queries/deleteFuse';
import { useGetFuseList } from 'fuse/queries/getFuseLists';
import { useGetFuseTracks } from 'fuse/queries/getFuseTracks';
import { RefreshControl } from 'react-native';
import { TagRow } from 'tag/components/TagRow';
import { TagEditMenu } from 'tag/components/tag.menu';
import { type TagSyncStatus, useSyncPlaylist } from 'tag/queries/playlist';
import { TracksList } from 'track/components/TrackList';
import { showToast } from 'util/toast';

export function FuseListView({
  navigation,
  route: { params },
}: TagTabScreenProps<'FuseList'>) {
  const [infoSheetVisible, setInfoSheetVisible] = useState(false);
  const [fuseStatus, setFuseStatus] = useState<TagSyncStatus>();

  const { data: selectedFuse, isLoading: selectedFuseLoading } = useGetFuseList(
    {
      id: params.id,
    },
  );

  const { mutate: deleteFuseMutation } = useDeleteFuse();
  const { mutateAsync: syncPlaylist } = useSyncPlaylist({
    tagStatus: fuseStatus,
  });
  const {
    data: fuseTracks,
    refetch: refetchTracks,
    isRefetching: isRefetchingTracks,
    isError: isTracksError,
    isFetching: isFetchingTracks,
  } = useGetFuseTracks({ id: params.id });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TagEditMenu
          onDeletePress={() =>
            deleteFuseMutation(params.id, {
              onSuccess: () => {
                navigation.goBack();
              },
            })
          }
        />
      ),
    });
  }, [navigation, deleteFuseMutation, params.id]);

  useEffect(() => {
    if (!selectedFuse) {
      return;
    }

    const tagSyncStatus = getTagSyncStatus({
      ...selectedFuse,
      updated_at: selectedFuse.created_at,
    }); // TODO: Fix

    setFuseStatus(tagSyncStatus);
  }, [selectedFuse]);

  const listDuration = formatMsDuration(
    fuseTracks
      ?.map((track) => track.duration)
      .reduce((acc, curr) => acc + curr, 0) ?? 0,
  );

  if (!selectedFuseLoading && !selectedFuse) {
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
        {selectedFuse && (
          <TagRow color={selectedFuse.tag1.color} name={selectedFuse.name} />
        )}

        <ListItem
          icon={() => renderStatusIcon(fuseStatus)}
          title={fuseStatus}
          iconAfter={<HelpCircle size={16} />}
          onPress={() => setInfoSheetVisible(true)}
          radiused
        />

        <XStack justifyContent="space-between" gap={16}>
          <Button
            flex={1}
            bg="$brandDark"
            iconAfter={RefreshCw}
            onPress={() => {
              syncPlaylist(
                {
                  name: params.name,
                  tracks: fuseTracks?.map((track) => track.uri) ?? [],
                  id: params.id,
                  type: 'fuseTags',
                  snapshot_id: selectedFuse?.latest_snapshot_id,
                  playlistId: selectedFuse?.spotify_playlist_id,
                },
                {
                  onSuccess: () => {
                    showToast({
                      title:
                        fuseStatus === 'Unexported'
                          ? 'Playlist created'
                          : 'Playlist synced',
                      preset: 'done',
                    });
                    setFuseStatus('Synced');
                  },
                },
              );
            }}
            disabled={fuseStatus === 'Synced'}
          >
            {fuseStatus === 'Unexported' ? 'Export to Spotify' : 'Sync'}
          </Button>

          {selectedFuse?.spotify_playlist_uri &&
            selectedFuse.spotify_playlist_uri !== null && (
              <Button
                flex={1}
                onPress={() =>
                  Linking.openURL(selectedFuse.spotify_playlist_uri ?? '')
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

        <View h="86%">
          <TracksList
            tracks={fuseTracks}
            tagId={params.id}
            isSwipeable={false}
            ListEmptyComponent={
              isFetchingTracks ? null : (
                <ListEmptyComponent
                  isError={isTracksError}
                  isFiltered={false}
                  defaultLabel={`No tracks tagged with ${params.name}`}
                />
              )
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
              paddingHorizontal: 8,
            }}
          />
        </View>
      </YStack>

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
