import {
  spoilerRenderer,
  spoilerElementModel,
} from '@screens/MangaView/components/MangaViewerHeader/components/MangaDescription/renderers/spoiler';
import RenderHTML, {
  CustomTagRendererRecord,
  HTMLElementModelRecord,
  MixedStyleDeclaration,
} from 'react-native-render-html';
const renderers: CustomTagRendererRecord = {
  spoiler: spoilerRenderer,
};
const customHTMLElementModels: HTMLElementModelRecord = {
  spoiler: spoilerElementModel,
};

import React from 'react';
import { useTheme } from '@emotion/react';
import { typography } from '@theme/theme';
import { useWindowDimensions } from 'react-native';

interface MangaDescriptionHTMLRendererProps {
  data: string;
}

const MangaDescriptionHTMLRenderer: React.FC<
  MangaDescriptionHTMLRendererProps
> = (props) => {
  const { data } = props;
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const baseStyle: MixedStyleDeclaration = {
    ...typography.body,
    color: theme.palette.text.secondary,
    margin: 0,
  } as MixedStyleDeclaration;
  const tagStyles: Record<string, MixedStyleDeclaration> = {
    p: {
      ...typography.body,
      color: theme.palette.text.secondary,
      margin: 0,
    } as MixedStyleDeclaration,
    a: {
      ...typography.body,
      color: theme.palette.text.hint,
      margin: 0,
    } as MixedStyleDeclaration,
    hr: {
      marginVertical: theme.style.spacing.m,
    },
    h1: {
      margin: 0,
      color: theme.palette.text.primary,
      ...typography.header,
    } as MixedStyleDeclaration,
    h3: {
      ...typography.header,
      margin: 0,
      color: theme.palette.text.primary,
    } as MixedStyleDeclaration,
  };
  const contentWidth = width - 2 * theme.style.spacing.m;

  return (
    <RenderHTML
      source={{ html: data }}
      renderers={renderers}
      customHTMLElementModels={customHTMLElementModels}
      contentWidth={contentWidth}
      baseStyle={baseStyle}
      tagsStyles={tagStyles}
    />
  );
};

export default React.memo(MangaDescriptionHTMLRenderer);
