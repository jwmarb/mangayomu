import { BoxModel, FlexBoxModel } from '@components/Box/Box.interfaces';
import { css, ReactNativeStyle } from '@emotion/native';
import { Theme } from '@emotion/react';
import { Spacing } from '@mangayomu/theme';

export function set<T>(
  propertyName: string,
  input?: T,
): ReactNativeStyle | undefined {
  if (input != null)
    return css`
      ${propertyName}: ${input};
    `;
}

export function setu(
  theme: Theme,
  propertyName: string,
  input?: Spacing | number,
): ReactNativeStyle | undefined {
  if (input != null)
    return css`
      ${propertyName}: ${typeof input === 'string'
        ? theme.helpers.spacing(input) + 'px'
        : `${input}px`};
    `;
}

export function setwandh(
  propertyName: 'width' | 'height' | 'max-width' | 'max-height',
  widthOrHeightValue: string | number,
): ReactNativeStyle | undefined {
  switch (typeof widthOrHeightValue) {
    case 'number':
      return css`
        ${propertyName}: ${widthOrHeightValue}px;
      `;
    case 'string':
      return css`
        ${propertyName}: ${widthOrHeightValue};
      `;
    default:
      throw Error('Invalid widthOrHeightValue passed in args');
  }
}

export function implementBoxModel(theme: Theme, boxModel: BoxModel) {
  const { p, m, px, pv, mx, pb, mt, mv, ml, mr, mb, pl, pr, pt } = boxModel;
  return css`
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
}

export function implementFlexBoxModel(
  theme: Theme,
  flexBoxModel: FlexBoxModel,
) {
  const {
    'align-items': alignItems = 'stretch',
    'align-self': alignSelf = 'stretch',
    'justify-content': justifyContent = 'flex-start',
    flex,
    'flex-grow': flexGrow,
    'flex-shrink': flexShrink,
    'flex-wrap': flexWrap,
    'flex-direction': flexDirection,
  } = flexBoxModel;
  return css`
    align-items: ${alignItems};
    align-self: ${alignSelf};
    flex: ${flex ? 1 : 0};
    flex-grow: ${flexGrow ? 1 : 0};
    flex-shrink: ${flexShrink ? 1 : 0};
    ${set('flex-wrap', flexWrap)};
    justify-content: ${justifyContent};
    ${set('flex-direction', flexDirection)};
  `;
}
