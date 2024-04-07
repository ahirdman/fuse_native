import { FlashList } from '@shopify/flash-list';
import { Plus, X } from '@tamagui/lucide-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AnimatePresence,
  Button,
  Heading,
  ScrollView,
  Spinner,
  View,
  XStack,
  YStack,
} from 'tamagui';

import { Alert } from 'components/Alert';
import { Text } from 'components/Text';
import type { RootStackScreenProps } from 'navigation.types';
import { showAlert } from 'util/toast';

import { useCreateFuseTag } from 'fuse/queries/createFuse';
import {
  useGetInitialTagsWithMatches,
  useGetMatchedTags,
} from 'fuse/queries/getFuseMatch';
import { useGetFuseTracksPreview } from 'fuse/queries/getFuseTracks';
import { TagBadge } from 'tag/components/TagBadge';
import type { Tag } from 'tag/tag.interface';
import TrackRow from 'track/components/TrackRow';

const AnimatedPager = Animated.createAnimatedComponent(PagerView);
type Props = RootStackScreenProps<'AddFuseTag'>;

export function AddFuseTag({ navigation }: Props) {
  const [selectedInitialTag, setSelectedInitialTag] = useState<Tag>();
  const [selectedMatchedTag, setSelectedMatchedTag] = useState<Tag>();

  const { mutate: createFuseTag } = useCreateFuseTag();

  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);

  function handleClose() {
    if (selectedInitialTag) {
      setSelectedInitialTag(undefined);
    }

    if (selectedMatchedTag) {
      setSelectedMatchedTag(undefined);
    }

    navigation.goBack();
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        selectedInitialTag ? (
          <Text
            fontWeight="bold"
            selectable={false}
            pressStyle={{
              color: '$border300',
            }}
            onPress={clearSelection}
          >
            Clear
          </Text>
        ) : undefined,
      headerLeft: () => (
        <XStack onPress={handleClose}>
          <X
            pressStyle={{
              color: '$border300',
            }}
          />
        </XStack>
      ),
    });
  }, [selectedInitialTag, navigation.setOptions]);

  const setPage = useCallback(
    (page: number) => pagerRef.current?.setPage(page),
    [],
  );

  function clearSelection() {
    setSelectedInitialTag(undefined);
    setSelectedMatchedTag(undefined);
    setPage(0);
  }

  function handleInitialTagPress(tag: Tag) {
    setSelectedInitialTag(tag);
    setPage(1);
  }

  function handleCreateFuseList(initialTagId: number, matchedTagId: number) {
    createFuseTag(
      {
        initialTagId: initialTagId,
        matchedTagId: matchedTagId,
      },
      {
        onSuccess: () => {
          showAlert({
            title: 'Fuse List Created!',
            preset: 'custom',
            duration: 3,
            icon: {
              ios: {
                name: 'tag',
                color: '#FFFFFF',
              },
            },
          });
          navigation.goBack();
        },
      },
    );
  }

  return (
    <YStack
      fullscreen
      bg="$primary700"
      px={12}
      pt={12}
      gap={12}
      pb={insets.bottom}
    >
      <XStack
        bg="$primary800"
        borderRadius={12}
        alignItems="center"
        h={60}
        gap={12}
      >
        <XStack flex={1} justifyContent="center">
          <AnimatePresence>
            {selectedInitialTag && (
              <TagBadge
                name={selectedInitialTag.name}
                color={selectedInitialTag.color}
                animation="quick"
                enterStyle={{ x: -50, opacity: 0 }}
                exitStyle={{ x: -50, opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </XStack>

        <Plus color="$brandDark" size={28} />

        <XStack flex={1} justifyContent="center">
          <AnimatePresence>
            {selectedMatchedTag && (
              <TagBadge
                name={selectedMatchedTag.name}
                color={selectedMatchedTag.color}
                animation="quick"
                enterStyle={{ x: 50, opacity: 0 }}
                exitStyle={{ x: 50, opacity: 0 }}
              />
            )}
          </AnimatePresence>
        </XStack>
      </XStack>

      <AnimatedPager
        style={{ flex: 1 }}
        initialPage={0}
        ref={pagerRef}
        scrollEnabled={false}
      >
        <InitialTagView onTagPress={handleInitialTagPress} />
        <MatchTagView
          onTagPress={(tag) => setSelectedMatchedTag(tag)}
          selectedInitialTag={selectedInitialTag}
          selectedMatchedTag={selectedMatchedTag}
          handleCreateFuseList={handleCreateFuseList}
        />
      </AnimatedPager>
    </YStack>
  );
}

interface PagerTagViewProps {
  onTagPress(tag: Tag): void;
}

function InitialTagView({ onTagPress }: PagerTagViewProps) {
  const { data: tagsWithMatches } = useGetInitialTagsWithMatches();

  return (
    <View key="initial-tag" gap={12} flex={1}>
      <Heading textAlign="center">Choose an initial tag to fuse</Heading>

      <TagBadgeView data={tagsWithMatches} onTagPress={onTagPress} />
    </View>
  );
}

interface MatchTagViewProps extends PagerTagViewProps {
  handleCreateFuseList(initialTagId: number, matchedTagId: number): void;
  selectedInitialTag?: Tag | undefined;
  selectedMatchedTag?: Tag | undefined;
}

function MatchTagView({
  onTagPress,
  selectedInitialTag,
  selectedMatchedTag,
  handleCreateFuseList,
}: MatchTagViewProps) {
  const { data: matchedTags } = useGetMatchedTags(selectedInitialTag?.id);

  const {
    data: previewTracks,
    isLoading: previewTracksLoading,
    isError: previewTracksError,
  } = useGetFuseTracksPreview(
    selectedInitialTag?.id && selectedMatchedTag?.id
      ? {
          initialTagId: selectedInitialTag.id,
          matchedTagId: selectedMatchedTag.id,
        }
      : undefined,
  );

  return (
    <View key="second-tag" gap={12} flex={1}>
      <Heading textAlign="center">Match with another tag</Heading>
      <TagBadgeView
        data={selectedInitialTag ? matchedTags : undefined}
        onTagPress={onTagPress}
      />

      <YStack gap={12}>
        <YStack bg="$primary800" borderRadius={12} p={12} height={200} w="100%">
          <FlashList
            data={previewTracks}
            estimatedItemSize={44}
            ListEmptyComponent={
              previewTracksLoading ? (
                <Spinner />
              ) : previewTracksError ? (
                <Alert label="Something went wrong" />
              ) : undefined
            }
            renderItem={(item) => <TrackRow track={item.item} height={44} />}
          />
        </YStack>
        <AnimatePresence>
          {selectedInitialTag && selectedMatchedTag && (
            <Button
              onPress={() =>
                handleCreateFuseList(
                  selectedInitialTag.id,
                  selectedMatchedTag.id,
                )
              }
              bg="$brandDark"
              fontWeight="bold"
              animation="bouncy"
              enterStyle={{ y: 50, opacity: 0 }}
              exitStyle={{ y: 50, opacity: 0 }}
            >
              Create Fuse List
            </Button>
          )}
        </AnimatePresence>
      </YStack>
    </View>
  );
}

interface TagBadgeViewProps {
  onTagPress(tag: Tag): void;
  data?: Tag[];
}

function TagBadgeView({ data, onTagPress }: TagBadgeViewProps) {
  return (
    <ScrollView>
      <View
        flex={1}
        gap={8}
        bg="$primary800"
        borderRadius={12}
        p={12}
        key="1"
        flexDirection="row"
        flexWrap="wrap"
      >
        {data?.map((tag) => {
          return (
            <TagBadge
              key={`${tag.id}-initial`}
              name={tag.name}
              color={tag.color}
              onPress={() => onTagPress(tag)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}
