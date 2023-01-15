import { TypographyProps } from '@components/Typography/Typography.interfaces';
import styled, { css } from 'styled-components/native';
import { Color } from '@theme/core';
import Animated from 'react-native-reanimated';
import { TextProps } from 'react-native';
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import React from 'react';

export const Typography: React.FC<React.PropsWithChildren<TypographyProps & TextProps>> = (props) => {
  const { fontFamily: _fontFamily, ...rest } = props;
  const fontFamily = useSelector((state: AppState) => state.settings.fontFamily.__selectedFont);
  return <TypographyBase fontFamily={_fontFamily ?? fontFamily} {...rest} />;
};

const TypographyBase = styled(Animated.Text)<TypographyProps>`
  ${(props) => {
    return css`
      ${props.theme.typography(props.fontFamily)[props.variant ?? 'body1']};
      color: ${() => {
        if (props.color == null) return props.theme.palette.text.primary.get(props.lockTheme);
        return Color.valueOf(props.color, props.lockTheme);
      }};
      ${props.bold != null &&
      css`
        font-family: ${props.bold
          ? props.theme.typography(props.fontFamily).fontFamily.heavy
          : props.theme.typography(props.fontFamily).fontFamily.regular};
      `};
      text-align: ${props.align ?? 'left'};
      ${() =>
        props.fontSize &&
        css`
          font-size: ${props.fontSize}px;
        `}
    `;
  }}
`;
