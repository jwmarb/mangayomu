import React from 'react';
import { OverlayPageSliderProps } from './OverlayPageSlider.interfaces';
import { OverlayPageSliderContainer, OverlayPageSliderBackground } from './OverlayPageSlider.base';
import { Icon, IconButton, Slider, Typography } from '@components/core';
import { useWindowDimensions } from 'react-native';
const OverlayPageSlider: React.FC<OverlayPageSliderProps> = (props) => {
  const { flatListRef, page, totalPages, offset } = props;
  const { width, height } = useWindowDimensions();
  const handleOnBeginning = () => {
    if (page === 1) {
      flatListRef.current?.scrollToIndex({ animated: true, index: offset - 1 });
    } else flatListRef.current?.scrollToIndex({ animated: true, index: offset });
  };
  const handleOnEnd = () => {
    const lastIndex = totalPages + offset;
    if (page + offset === lastIndex) {
      flatListRef.current?.scrollToIndex({ animated: true, index: lastIndex });
    } else {
      flatListRef.current?.scrollToIndex({ animated: true, index: lastIndex - 1 });
    }
  };

  const handleOnChange = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index: index + offset - 1 });
  };
  return (
    <OverlayPageSliderContainer>
      <OverlayPageSliderBackground>
        <Slider
          width={width * 0.6}
          value={page}
          range={[1, totalPages]}
          onChange={handleOnChange}
          left={<IconButton icon={<Icon bundle='Feather' name='chevron-left' />} onPress={handleOnBeginning} />}
          right={<IconButton icon={<Icon bundle='Feather' name='chevron-right' />} onPress={handleOnEnd} />}
        />
      </OverlayPageSliderBackground>
    </OverlayPageSliderContainer>
  );
};

export default React.memo(OverlayPageSlider);
