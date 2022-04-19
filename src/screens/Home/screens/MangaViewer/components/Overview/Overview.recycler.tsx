import { LayoutProvider } from 'recyclerlistview';
import { Chapter, Skeleton, Spacer } from '@components/core';
import { Dimensions } from 'react-native';
import animate from '@utils/Animations/animate';
import withAnimatedLoading from '@utils/Animations/withAnimatedLoading';
const { width } = Dimensions.get('window');
import { LoadingContainer } from '@screens/Home/screens/MangaViewer/components/Overview/Overview.base';

export const layout = new LayoutProvider(
  (index) => 0,
  (type, dim) => {
    (dim.height = 70.0952377319336), (dim.width = width);
  }
);

export const rowRenderer: (
  type: string | number,
  data: any,
  index: number,
  extendedState?: object | undefined
) => JSX.Element | JSX.Element[] | null = (type, data) => <Chapter chapter={data} />;

export const createFooter = (loading: boolean) => () =>
  loading ? (
    animate(
      <LoadingContainer>
        <Skeleton.Chapter />
        <Skeleton.Chapter />
        <Skeleton.Chapter />
      </LoadingContainer>,
      withAnimatedLoading
    )
  ) : (
    <Spacer y={16} /> // extra padding for UX reasons
  );
