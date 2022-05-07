import { Flex, Typography, Spacer, Slider, Icon } from '@components/core';
import { AppState, useAppDispatch } from '@redux/store';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { adjustColumns as _adjustColumns } from '@redux/reducers/settingsReducer/settingsReducer.actions';
import { CustomizationSliderProps } from '@screens/Settings/screens/MangasColumn/components/CustomizationSlider/CustomizationSlider.interfaces';

const CoverSlider: React.FC<CustomizationSliderProps> = (props) => {
  const { value, setValue, title, description, left, right, range } = props;
  const { width } = useWindowDimensions();

  return (
    <Flex direction='column'>
      <Typography>{title}</Typography>
      <Typography variant='body2' color='textSecondary'>
        {description}
      </Typography>
      <Spacer y={2} />
      <Slider
        noFixedIncremental
        range={range}
        width={width * 0.7}
        value={value}
        onChange={setValue}
        left={left}
        right={right}
      />
    </Flex>
  );
};

export default React.memo(CoverSlider);
