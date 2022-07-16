import { BackdropPressableProps } from '@components/Modal/Modal.interfaces';
import { BackgroundColors } from '@theme/Color/Color.interfaces';
import { Dimensions, StatusBar } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';
const { width, height } = Dimensions.get('window');

export const BackdropContainer = styled(Animated.View)`
  ${(props) => css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: ${props.theme.palette.modalOverlay.get()};
  `}
`;

export const Panel = styled(Animated.View)`
  ${(props) => css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  `}
`;

export const StatusBarFiller = styled(Animated.View)`
  ${(props) => css`
    position: absolute;
    bottom: ${height}px;
    left: 0;
    right: 0;
    background-color: ${props.theme.palette.background.paper.get()};
  `}
`;

export const BackdropPressable = styled(TouchableWithoutFeedback)<BackdropPressableProps>`
  ${(props) => css`
    ${props.visible
      ? css`
          width: 100%;
          height: 100%;
        `
      : css`
          width: 0px;
          height: 0px;
        `}
  `}
`;

export const ModalContainer = styled(Animated.View)<{
  modalBackgroundColor: keyof BackgroundColors;
  modalTopColor: keyof BackgroundColors;
}>`
  ${(props) => css`
    flex-grow: 1;
    background-color: ${props.theme.palette.background[props.modalBackgroundColor].get()};
    border-top-color: ${props.theme.palette.background[props.modalTopColor].get()};
  `}
`;
