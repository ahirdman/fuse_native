import { Image } from 'expo-image';

import {
  Alert,
  Badge,
  Box,
  HStack,
  Pressable,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';

import PageView from '@/components/atoms/PageView';
import { useGetUserSavedTracksQuery } from '@/services/tracks/tracks.endpoints';
import { supabase } from '@/lib/supabase/supabase.init';
import InputField from '@/components/atoms/InputField';
import SecondaryButton from '@/components/atoms/SecondaryButton';
import useQuery from '@/hooks/useQuery';

import type { RootStackScreenProps } from '@/navigation.types';

export interface Tag {
  color: string;
  name: string;
}

function Track({ route, navigation }: RootStackScreenProps<'Track'>) {
  const { params } = route;

  const { data: userSavedTrack } = useGetUserSavedTracksQuery(
    {
      ...params.originalArgs,
    },
    {
      selectFromResult: ({ data, ...props }) => ({
        data: data?.find((track) => track.id === params.trackId),
        ...props,
      }),
    },
  );

  function handleClosePress() {
    navigation.goBack();
  }

  const getUserTags = useCallback(
    async () =>
      await supabase
        .from('trackTags')
        .select(`tags ( name, color)`)
        .eq('track_id', params.trackId),
    [params.trackId],
  );

  const { data, isError, isLoading } = useQuery(getUserTags);

  if (!userSavedTrack) {
    return (
      <PageView>
        <Alert />
      </PageView>
    );
  }

  const { explicit, duration, albumCovers, name, artist } = userSavedTrack;

  return (
    <Box bg="primary.700" boxSize="full">
      <Box position="relative">
        <Pressable
          accessibilityRole="button"
          position="absolute"
          zIndex={1}
          right="1"
          top="1"
          onPress={handleClosePress}
        >
          <Ionicons name="close-circle-outline" size={32} color="black" />
        </Pressable>

        <Image
          source={albumCovers[0]?.url}
          alt="album-image"
          accessibilityIgnoresInvertColors
          style={styles.albumImage}
        />
      </Box>

      <VStack p="4">
        <VStack mb="4">
          <Text
            fontSize="2xl"
            fontWeight={800}
            color="singelton.white"
            numberOfLines={1}
          >
            {name}
          </Text>

          <HStack justifyContent="space-between" alignItems="center" mt="2">
            <Text fontSize="xl" fontWeight={600} color="singelton.lightHeader">
              {artist}
            </Text>
            {explicit && (
              <MaterialIcons name="explicit" size={24} color="white" />
            )}
          </HStack>

          <Text>{formatMsDuration(duration)}</Text>
          <InputForm
            trackId={params.trackId}
            artist={userSavedTrack.artist}
            title={userSavedTrack.name}
          />
        </VStack>
      </VStack>

      <HStack px="4">
        {isLoading && <Spinner color="red.500" />}
        {isError && (
          <Alert status="error" bg="error.500">
            Error fetching tags
          </Alert>
        )}
        {data &&
          data.map((tag, index: number) => {
            if (tag.tags) {
              return (
                <Badge
                  color={tag.tags.color}
                  key={tag.tags.name + index}
                  mx="2"
                >
                  {tag.tags.name}
                </Badge>
              );
            }

            return null;
          })}
      </HStack>
    </Box>
  );
}

function formatMsDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

interface InputFormProps {
  trackId: string;
  artist?: string | undefined;
  title?: string | undefined;
}

function InputForm({ trackId, artist, title }: InputFormProps) {
  const [tagNameValue, setTagNameValue] = useState('');

  async function tagTrack(): Promise<void> {
    const { data: tag, error: tagError } = await supabase
      .from('tags')
      .insert({ color: '#FFFFFF', name: tagNameValue })
      .select()
      .single();

    if (tagError) {
      return;
    }

    const { data: trackData, error: trackError } = await supabase
      .from('tracks')
      .upsert(
        {
          id: trackId,
          artist: artist,
          title: title,
        },
        { onConflict: 'id' },
      )
      .select()
      .single();

    if (trackError) {
      return;
    }

    await supabase
      .from('trackTags')
      .insert({
        tag_id: tag.id,
        track_id: trackData.id,
      })
      .select()
      .single();
  }

  return (
    <>
      <InputField value={tagNameValue} setValue={setTagNameValue} />

      <SecondaryButton label="Create Tag" onPress={tagTrack} />
    </>
  );
}

const styles = StyleSheet.create({
  albumImage: {
    width: '100%',
    height: 320,
  },
});

export default Track;
