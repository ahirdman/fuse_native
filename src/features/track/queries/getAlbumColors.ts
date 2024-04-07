import { useQuery } from '@tanstack/react-query';
import { getColors } from 'react-native-image-colors';

export const useAlbumCoverColors = (albumCoverUrl: string) =>
  useQuery({
    queryKey: ['alubmColors', albumCoverUrl],
    queryFn: async () => {
      const result = await getColors(albumCoverUrl);

      if (result.platform !== 'ios') {
        throw new Error('Image color result platform missmatch');
      }

      return result;
    },
    enabled: !!albumCoverUrl,
  });
