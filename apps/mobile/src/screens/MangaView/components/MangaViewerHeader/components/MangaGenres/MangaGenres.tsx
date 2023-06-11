import Skeleton from '@components/Skeleton';
import Stack from '@components/Stack';
import Tag from '@components/Tag';
import useMangaSource from '@hooks/useMangaSource';
import React from 'react';
import { MangaGenresProps } from './MangaGenres.interfaces';
import useRootNavigation from '@hooks/useRootNavigation';

const MangaGenres: React.FC<MangaGenresProps> = (props) => {
  const { data, source } = props;
  const host = useMangaSource(source);
  const navigation = useRootNavigation();
  React.useEffect(() => {
    if (data != null)
      for (const genre of data) {
        if (host.getGenre(genre) == null)
          console.warn(
            `${genre} does not exist in host.getGenre(). Add it to the source genres.\nIndex in genres: ${host
              .getGenres()
              .indexOf(genre)}`,
          );
      }
  }, [data]);
  return (
    <Stack flex-direction="row" flex-wrap="wrap" space="s" align-items="center">
      {data != null ? (
        [...data].map((x) => (
          <Tag
            key={x}
            label={host.getGenre(x) || x}
            color={host.getGenre(x) ? undefined : 'error'}
            onPress={() => {
              navigation.navigate('InfiniteMangaList', {
                source,
                genre: x,
              });
            }}
          />
        ))
      ) : (
        <>
          <Skeleton>
            <Tag label="Action" />
          </Skeleton>
          <Skeleton>
            <Tag label="Comedy" />
          </Skeleton>
          <Skeleton>
            <Tag label="Drama" />
          </Skeleton>
          <Skeleton>
            <Tag label="Romance" />
          </Skeleton>
          <Skeleton>
            <Tag label="Slice of Life" />
          </Skeleton>
        </>
      )}
    </Stack>
  );
};

export default React.memo(MangaGenres);
