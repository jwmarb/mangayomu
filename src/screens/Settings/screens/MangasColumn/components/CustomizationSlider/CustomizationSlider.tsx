import { Flex, Typography, Spacer, Slider, Icon } from '@components/core';
import { AppState, useAppDispatch } from '@redux/store';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { adjustColumns as _adjustColumns } from '@redux/reducers/settingsReducer/settingsReducer.actions';
import { CustomizationSliderProps } from '@screens/Settings/screens/MangasColumn/components/CustomizationSlider/CustomizationSlider.interfaces';
import { Orientation } from 'expo-screen-orientation';
import { CustomizationSliderContainer } from '@screens/Settings/screens/MangasColumn/components/CustomizationSlider/CustomizationSlider.base';

const CoverSlider: React.FC<CustomizationSliderProps> = (props) => {
  const { value, setValue, title, description, left, right, range } = props;
  const { width, height } = useWindowDimensions();
  const deviceOrientation = useSelector((state: AppState) => state.settings.deviceOrientation);

  switch (deviceOrientation) {
    case Orientation.LANDSCAPE_LEFT:
    case Orientation.LANDSCAPE_RIGHT:
      return (
        <CustomizationSliderContainer>
          <Typography>{title}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {description}
          </Typography>
          <Spacer y={2} />
          <Slider
            noFixedIncremental
            range={range}
            width={width * 0.45}
            value={value}
            onChange={setValue}
            left={left}
            right={right}
          />
        </CustomizationSliderContainer>
      );
    default:
      return (
        <CustomizationSliderContainer>
          <Typography>{title}</Typography>
          <Typography variant='body2' color='textSecondary'>
            {description}
          </Typography>
          <Spacer y={2} />
          <Slider
            noFixedIncremental
            range={range}
            width={width * 0.45}
            value={value}
            onChange={setValue}
            left={left}
            right={right}
          />
        </CustomizationSliderContainer>
      );
  }
};

export default React.memo(CoverSlider);
