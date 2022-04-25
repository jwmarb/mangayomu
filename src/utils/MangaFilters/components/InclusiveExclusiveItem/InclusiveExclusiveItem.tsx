import ButtonBase from '@components/Button/ButtonBase';
import { Container } from '@components/Container';
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { animate, withAnimatedFadeIn, withAnimatedMounting } from '@utils/Animations';
import {
  IndicatorBaseContainer,
  IndicatorContainer,
} from '@utils/MangaFilters/components/InclusiveExclusiveItem/InclusiveExclusiveItem.base';
import {
  deleteElement,
  insertElement,
} from '@utils/MangaFilters/components/InclusiveExclusiveItem/InclusiveExclusiveItem.helpers';
import { InclusiveExclusiveItemProps } from '@utils/MangaFilters/components/InclusiveExclusiveItem/InclusiveExclusiveItem.interfaces';
import React from 'react';
import Animated, { BounceIn, ZoomIn } from 'react-native-reanimated';

const InclusiveExclusiveItem: React.FC<InclusiveExclusiveItemProps> = (props) => {
  const { stateChanger, state, item } = props;

  function handleOnPress() {
    switch (state) {
      case 'none':
        stateChanger((prev) => {
          return {
            ...prev,
            include: insertElement(prev.include as string[], item),
          };
        });
        break;
      case 'include':
        stateChanger((prev) => {
          return {
            ...prev,
            include: deleteElement(prev.include as string[], item),
            exclude: insertElement(prev.exclude as string[], item),
          };
        });
        break;
      case 'exclude':
        stateChanger((prev) => {
          return {
            ...prev,
            exclude: deleteElement(prev.exclude as string[], item),
          };
        });
        break;
    }
  }

  const createIndicator = () => {
    switch (state) {
      case 'none':
        return null;
      case 'include':
        return (
          <Animated.View entering={BounceIn}>
            <Icon bundle='Feather' name='plus' size='small' />
          </Animated.View>
        );
      case 'exclude':
        return (
          <Animated.View entering={BounceIn}>
            <Icon bundle='Feather' name='minus' size='small' />
          </Animated.View>
        );
    }
  };

  return (
    <ButtonBase square onPress={handleOnPress}>
      <Container verticalPadding={1.5} horizontalPadding={3}>
        <Flex alignItems='center'>
          <IndicatorBaseContainer>
            <ButtonBase square onPress={handleOnPress}>
              <IndicatorContainer state={state}>{createIndicator()}</IndicatorContainer>
            </ButtonBase>
          </IndicatorBaseContainer>
          <Spacer x={2} />
          <Typography>{item}</Typography>
        </Flex>
      </Container>
    </ButtonBase>
  );
};

export default React.memo(InclusiveExclusiveItem);
