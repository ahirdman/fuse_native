import { Image } from 'expo-image';

import { Alert, Box, HStack, Pressable, Text, VStack } from 'native-base';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

import PageView from '@/components/atoms/PageView';
import { useGetUserSavedTracksQuery } from '@/services/tracks/tracks.endpoints';

import type { RootStackScreenProps } from '@/navigation.types';

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
        <VStack>
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
        </VStack>
      </VStack>
    </Box>
  );
}

function formatMsDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const styles = StyleSheet.create({
  albumImage: {
    width: '100%',
    height: 320,
  },
});

export default Track;
