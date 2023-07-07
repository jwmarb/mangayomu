import {
  BorderModel,
  BoxColor,
  BoxModel,
  DimensionsModel,
  FlexBoxModel,
  PositionModel,
} from './';
import { css, ReactNativeStyle } from '@emotion/native';
import { Theme } from '@emotion/react';
import { ButtonColors, Colors, Spacing } from '@mangayomu/theme';

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
  propertyName:
    | 'width'
    | 'height'
    | 'max-width'
    | 'max-height'
    | 'min-height'
    | 'min-width',
  widthOrHeightValue?: string | number,
): ReactNativeStyle | undefined {
  if (widthOrHeightValue == null) return;
  switch (typeof widthOrHeightValue) {
    case 'number':
      return css`
        ${propertyName}: ${widthOrHeightValue}px;
      `;
    case 'string':
      return css`
        ${propertyName}: ${widthOrHeightValue};
      `;
  }
}

export function setWithPalette(
  theme: Theme,
  cssProperty: string,
  value?: BoxColor,
) {
  if (value == null) return;
  if (typeof value === 'string') {
    if (value === 'skeleton')
      return css`
        ${cssProperty}: ${theme.palette.skeleton};
      `;
    if (value in theme.palette.background)
      return css`
        ${cssProperty}: ${theme.palette.background[
          value as keyof typeof theme.palette.background
        ]};
      `;
    if (value in theme.palette)
      return css`
        ${cssProperty}: ${theme.palette[value as ButtonColors].main};
      `;
    if (value === 'textPrimary' || value === 'textSecondary')
      return css`
        ${cssProperty}: ${theme.helpers.getColor(value as Colors)};
      `;
    return css`
      ${cssProperty}: ${value};
    `;
  }
}

export function implementBorderModel(theme: Theme, borderModel: BorderModel) {
  const {
    'border-color': borderColor,
    'border-radius': borderRadius,
    'border-width': borderWidth,
  } = borderModel;
  return css`
    ${(() => {
      switch (typeof borderColor) {
        case 'string':
          return borderColor === '@theme'
            ? `border-color: ${theme.palette.borderColor}`
            : setWithPalette(theme, 'border-color', borderColor);
        case 'object':
          return css`
            ${setWithPalette(theme, 'border-top-color', borderColor.t)};
            ${setWithPalette(theme, 'border-bottom-color', borderColor.b)};
            ${setWithPalette(theme, 'border-right-color', borderColor.r)};
            ${setWithPalette(theme, 'border-left-color', borderColor.l)};
          `;
      }
    })()};
    ${(() => {
      if (borderWidth === '@theme')
        return `border-width: ${theme.style.borderWidth}px`;

      switch (typeof borderWidth) {
        case 'number':
          return `border-width: ${borderWidth}px`;
        case 'object':
          return css`
            ${borderWidth.t === '@theme'
              ? `border-top-width: ${theme.style.borderWidth}px`
              : setu(theme, 'border-top-width', borderWidth.t)};
            ${borderWidth.b === '@theme'
              ? `border-bottom-width: ${theme.style.borderWidth}px`
              : setu(theme, 'border-bottom-width', borderWidth.b)};
            ${borderWidth.r === '@theme'
              ? `border-right-width: ${theme.style.borderWidth}px`
              : setu(theme, 'border-right-width', borderWidth.r)};
            ${borderWidth.l === '@theme'
              ? `border-left-width: ${theme.style.borderWidth}px`
              : setu(theme, 'border-left-width', borderWidth.l)};
          `;
      }
    })()};
    ${(() => {
      if (borderRadius === '@theme')
        return `border-radius: ${theme.style.borderRadius}px;`;
      switch (typeof borderRadius) {
        case 'number':
          return `border-radius: ${borderRadius}px`;
        case 'object':
          return css`
            ${toBorderRadiusProperty(
              theme,
              'border-top-left-radius',
              borderRadius.tl,
            )};
            ${toBorderRadiusProperty(
              theme,
              'border-top-right-radius',
              borderRadius.tr,
            )};
            ${toBorderRadiusProperty(
              theme,
              'border-bottom-right-radius',
              borderRadius.br,
            )};
            ${toBorderRadiusProperty(
              theme,
              'border-bottom-left-radius',
              borderRadius.bl,
            )};
          `;
      }
    })()};
  `;
}

function toBorderRadiusProperty(
  theme: Theme,
  property: string,
  value?: number | '@theme',
) {
  if (value != null)
    return css`
      ${property}: ${value === '@theme'
        ? theme.style.borderRadius + 'px'
        : value + 'px'};
    `;
}

export function implementBoxModel(theme: Theme, boxModel: BoxModel) {
  const { p, m, px, py, mx, pb, mt, my, ml, mr, mb, pl, pr, pt } = boxModel;
  return css`
    ${setu(theme, 'padding', p)};
    ${setu(theme, 'margin', m)};
    ${setu(theme, 'padding-horizontal', px)};
    ${setu(theme, 'padding-vertical', py)};
    ${setu(theme, 'margin-horizontal', mx)};
    ${setu(theme, 'margin-vertical', my)};
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

export function implementFlexBoxModel(flexBoxModel: FlexBoxModel) {
  const {
    'align-items': alignItems = 'stretch',
    'align-self': alignSelf = 'stretch',
    'justify-content': justifyContent = 'flex-start',
    'flex-grow': flexGrow,
    'flex-shrink': flexShrink,
    'flex-wrap': flexWrap,
    'flex-direction': flexDirection,
  } = flexBoxModel;
  return css`
    align-items: ${alignItems};
    align-self: ${alignSelf};
    ${flexGrow ? 'flex-grow: 1' : ''};
    ${flexShrink ? 'flex-shrink: 1' : ''};
    ${set('flex-wrap', flexWrap)};
    justify-content: ${justifyContent};
    ${set('flex-direction', flexDirection)};
  `;
}

export function implementDimensionsModel(dimensionsModel: DimensionsModel) {
  const {
    maxHeight,
    maxWidth,
    width = 'auto',
    height = 'auto',
    minHeight,
    minWidth,
  } = dimensionsModel;
  return css`
    ${setwandh('min-height', minHeight)};
    ${setwandh('min-width', minWidth)};
    ${setwandh('max-width', maxWidth)};
    ${setwandh('max-height', maxHeight)};
    ${setwandh('height', height)};
    ${setwandh('width', width)};
  `;
}

export function implementPositionModel(positionModel: PositionModel) {
  const { position, top, bottom, left, right } = positionModel;
  return css`
    ${set('position', position)};
    ${set('top', top)};
    ${set('bottom', bottom)};
    ${set('left', left)};
    ${set('right', right)};
  `;
}
