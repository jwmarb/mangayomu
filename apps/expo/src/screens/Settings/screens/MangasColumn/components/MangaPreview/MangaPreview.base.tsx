import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const ModernMangaCoverContainer = styled(Animated.View)`
  ${(props) => css`
    border: 1px solid ${props.theme.palette.divider.get()};
    border-radius: 4px;
  `}
`;
