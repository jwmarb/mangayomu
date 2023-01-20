import styled, { css } from '@emotion/native';
import { BackgroundColor, ButtonColors } from '@mangayomu/theme';
import { BoxProps } from './Box.interfaces';
import { set, setu, setwandh } from './Box.helpers';

/**
 * Box is an abstract component for building layouts. All MangaYomu components are built upon this component.
 * @component
 */
const Box = styled.View<BoxProps>`
  ${(props) => {
    const {
      theme,
      'align-items': alignItems = 'stretch',
      'align-self': alignSelf = 'stretch',
      'background-color': bgColor,
      'box-shadow': boxShadow,
      'justify-content': justifyContent = 'flex-start',
      flex,
      'flex-grow': flexGrow,
      'flex-shrink': flexShrink,
      'flex-wrap': flexWrap,
      p,
      m,
      px,
      pv,
      mx,
      mv,
      ml,
      mr,
      mb,
      mt,
      pl,
      pr,
      pt,
      pb,
      width = 'auto',
      height = 'auto',
    } = props;

    return css`
      align-items: ${alignItems};
      align-self: ${alignSelf};
      ${boxShadow && theme.style.shadow};
      flex: ${flex ? 1 : 0};
      flex-grow: ${flexGrow ? 1 : 0};
      flex-shrink: ${flexShrink ? 1 : 0};
      justify-content: ${justifyContent};
      ${(() => {
        if (bgColor == null) return;
        if (bgColor in theme.palette.background)
          return css`
            background-color: ${theme.palette.background[
              bgColor as keyof BackgroundColor
            ]};
          `;
        return css`
          background-color: ${theme.palette[bgColor as ButtonColors].main};
        `;
      })()}
      ${boxShadow && theme.style.shadow};
      ${setwandh('height', height)};
      ${setwandh('width', width)};
      ${set('flex-wrap', flexWrap)};
      ${setu(theme, 'padding', p)};
      ${setu(theme, 'margin', m)};
      ${setu(theme, 'padding-horizontal', px)};
      ${setu(theme, 'padding-vertical', pv)};
      ${setu(theme, 'margin-horizontal', mx)};
      ${setu(theme, 'margin-vertical', mv)};
      ${setu(theme, 'margin-left', ml)};
      ${setu(theme, 'margin-right', mr)};
      ${setu(theme, 'margin-bottom', mb)};
      ${setu(theme, 'margin-top', mt)};
      ${setu(theme, 'padding-left', pl)};
      ${setu(theme, 'padding-right', pr)};
      ${setu(theme, 'padding-bottom', pb)};
      ${setu(theme, 'padding-top', pt)};
    `;
  }}
`;

export default Box;
