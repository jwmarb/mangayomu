import { Flex, Typography, Spacer, Slider, Icon } from '@components/core';
import { AppState, useAppDispatch } from '@redux/store';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { adjustColumns as _adjustColumns } from '@redux/reducers/settingsReducer/settingsReducer.actions';
import { CoverSliderProps } from '@screens/Settings/screens/MangasColumn/components/CoverSlider/CoverSlider.interfaces';

const CoverSlider: React.FC<CoverSliderProps> = (props) => {
  const { value, setValue } = props;
  const { width } = useWindowDimensions();

  return (
    <Flex direction='column'>
      <Typography>Manga Cover Size</Typography>
      <Typography variant='body2' color='textSecondary'>
        Change the size of the manga cover
      </Typography>
      <Spacer y={2} />
      <Slider
        noFixedIncremental
        range={[1, 3]}
        width={width * 0.7}
        value={value}
        onChange={setValue}
        left={<Icon bundle='MaterialCommunityIcons' name='book-minus' size='small' />}
        right={<Icon bundle='MaterialCommunityIcons' name='book-plus' />}
      />
    </Flex>
  );
};

export default React.memo(CoverSlider);
