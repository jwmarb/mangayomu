import { Category, Flex, Genre, Skeleton, Spacer, Typography } from '@components/core';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import { GenresProps } from '@screens/MangaViewer/components/Genres/Genres.interfaces';
import { withAnimatedLoading } from '@utils/Animations';
import animate from '@utils/Animations/animate';
import withAnimatedMounting from '@utils/Animations/withAnimatedMounting';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const Genres: React.FC<GenresProps> = (props) => {
  const { genres, buttons, source } = props;
  const mountingStyle = useAnimatedMounting();
  if (genres && genres.length === 0) return null;
  if (buttons)
    return (
      <>
        <Spacer y={1} />
        <Animated.View style={mountingStyle}>
          {genres ? (
            <Category.Header>
              <Flex spacing={1}>
                {genres.map((genre) => (
                  <Genre key={genre} genre={genre} source={source} />
                ))}
              </Flex>
            </Category.Header>
          ) : null}
        </Animated.View>
      </>
    );

  return (
    <>
      <Spacer y={1} />
      <Animated.View style={mountingStyle}>
        {genres ? (
          <Typography color='textSecondary' numberOfLines={2}>
            {genres.join(' · ')}
          </Typography>
        ) : (
          animate(<Skeleton.Typography width='100%' />, withAnimatedLoading)
        )}
      </Animated.View>
    </>
  );
  // return !genres
  //   ? buttons
  //     ? null
  //     : animate(<Skeleton.Typography width='100%' />, withAnimatedLoading)
  //   : animate(
  //       buttons ? (
  //         <Category.Header>
  //           <Flex spacing={1}>
  //             {genres.map((genre) => (
  //               <Genre key={genre} genre={genre} />
  //             ))}
  //           </Flex>
  //         </Category.Header>
  //       ) : (
  //         <Typography color='textSecondary' numberOfLines={2}>
  //           {genres.join(' · ')}
  //         </Typography>
  //       ),
  //       withAnimatedMounting
  //     );
};

export default React.memo(Genres);
