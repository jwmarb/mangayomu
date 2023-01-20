import styled, { css } from '@emotion/native';
import { BackgroundColor, ButtonColors } from '@mangayomu/theme';
import { BoxProps } from './Box.interfaces';
import { set, setu, setwandh } from './Box.helpers';

const style = (props) => {
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
    /* align-items: ${alignItems};
    align-self: ${alignSelf};
    ${() => {
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
    }};
    flex: ${flex ? 1 : 0};
    flex-grow: ${flexGrow ? 1 : 0};
    flex-shrink: ${flexShrink ? 1 : 0};
    justify-content: ${justifyContent};
    ${setwandh('height', height)};
    ${setwandh('width', width)};
    ${() => boxShadow && theme.style.shadow};
    ${set('flex-wrap', flexWrap)};
    ${setu('padding', theme.helpers.spacing(p))};
    ${setu('margin', theme.helpers.spacing(m))};
    ${setu('padding-horizontal', theme.helpers.spacing(px))};
    ${setu('padding-vertical', theme.helpers.spacing(pv))};
    ${setu('margin-horizontal', theme.helpers.spacing(mx))};
    ${setu('margin-vertical', theme.helpers.spacing(mv))};
    ${setu('margin-left', theme.helpers.spacing(ml))};
    ${setu('margin-right', theme.helpers.spacing(mr))};
    ${setu('margin-bottom', theme.helpers.spacing(mb))};
    ${setu('margin-top', theme.helpers.spacing(mt))};
    ${setu('padding-left', theme.helpers.spacing(pl))};
    ${setu('padding-right', theme.helpers.spacing(pr))};
    ${setu('padding-bottom', theme.helpers.spacing(pb))};
    ${setu('padding-top', theme.helpers.spacing(pt))}; */
  `;
};

/**
 * Box is an abstract component for building layouts. All MangaYomu components are built upon this component.
 * @component
 */
const Box = styled.View<BoxProps>`
  ${style}
`;

export default Box;
