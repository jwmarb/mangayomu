import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { ContainerProps } from '@components/Container/Container.interfaces';

export const Container = styled(Animated.View)<ContainerProps>`
  ${(props) =>
    (props.verticalPadding === true || props.verticalPadding == null) &&
    css`
      padding-vertical: ${props.theme.spacing(3)};
    `}
  ${(props) =>
    props.horizontalPadding &&
    css`
      padding-horizontal: ${props.theme.spacing(3)};
    `}
`;
