import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const Container = styled(Animated.View)`
  ${(props) => css`
    padding-horizontal: ${props.theme.spacing(3)};
  `}
`;
