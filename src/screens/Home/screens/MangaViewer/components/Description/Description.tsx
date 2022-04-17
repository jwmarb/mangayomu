import { Icon, Typography, Button } from '@components/core';
import Flex from '@components/Flex';
import Spacer from '@components/Spacer';
import useAnimatedMounting from '@hooks/useAnimatedMounting';
import { DescriptionProps } from '@screens/Home/screens/MangaViewer/components/Description/Description.interfaces';
import LoadingDescription from '@screens/Home/screens/MangaViewer/components/Description/Description.loading';
import withAnimatedMounting from '@utils/withAnimatedMounting';
import React from 'react';
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import Animated from 'react-native-reanimated';

const Description: React.FC<DescriptionProps> = (props) => {
  const { description, loading } = props;
  const [showExpand, setShowExpand] = React.useState<boolean>(false);
  const [numOfLines, setNumOfLines] = React.useState<number | undefined>(5);
  function handleOnTextLayout(e: NativeSyntheticEvent<TextLayoutEventData>) {
    setShowExpand(e.nativeEvent.lines.length > 5);
  }
  function handleOnExpandText() {
    if (numOfLines == null) setNumOfLines(5);
    else setNumOfLines(undefined);
  }
  const animatedMount = useAnimatedMounting(!loading);
  const buttonMount = useAnimatedMounting(showExpand);
  return (
    <>
      <Flex justifyContent='space-between' alignItems='center'>
        <Typography variant='subheader'>Description</Typography>
        {showExpand && (
          <Animated.View style={buttonMount}>
            <Button
              title={numOfLines == null ? 'Hide' : 'Expand'}
              icon={<Icon bundle='Feather' name={numOfLines == null ? 'chevron-up' : 'chevron-down'} />}
              iconPlacement='right'
              onPress={handleOnExpandText}
            />
          </Animated.View>
        )}
      </Flex>
      <Spacer y={1} />
      {!loading ? (
        <Animated.View style={animatedMount}>
          <Typography color='textSecondary' onTextLayout={handleOnTextLayout} numberOfLines={numOfLines}>
            {description}
          </Typography>
        </Animated.View>
      ) : (
        <LoadingDescription />
      )}
    </>
  );
};

export default React.memo(Description);
