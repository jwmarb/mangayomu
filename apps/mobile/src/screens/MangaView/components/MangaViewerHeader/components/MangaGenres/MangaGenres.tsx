import Skeleton from '@components/Skeleton';
import { Stack } from '@components/Stack';
import Tag from '@components/Tag';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { MangaGenresProps } from './MangaGenres.interfaces';

const MangaGenres: React.FC<MangaGenresProps> = (props) => {
  const { data } = props;
  return (
    <Stack flex-direction="row" flex-wrap="wrap" space="s" align-items="center">
      {data != null ? (
        data.map((x) => <Tag key={x} label={x} />)
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
