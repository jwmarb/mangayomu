/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  spoilerRenderer,
  spoilerElementModel,
} from '@screens/MangaView/components/MangaViewerHeader/components/MangaDescription/renderers/spoiler';
import RenderHTML, {
  CustomBlockRenderer,
  CustomTagRendererRecord,
  Document,
  HTMLElementModelRecord,
  MixedStyleDeclaration,
  Node,
} from 'react-native-render-html';

const customHTMLElementModels: HTMLElementModelRecord = {
  spoiler: spoilerElementModel,
};

import React from 'react';
import { useTheme } from '@emotion/react';
import { typography } from '@theme/theme';
import {
  NativeSyntheticEvent,
  TextLayoutEventData,
  useWindowDimensions,
} from 'react-native';

interface MangaDescriptionHTMLRendererProps {
  data: string;
  setShowExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isExpanded: boolean;
}

const MAX_NUMBER_OF_LINES = 6;

const MangaDescriptionHTMLRenderer: React.FC<
  MangaDescriptionHTMLRendererProps
> = (props) => {
  const { data, setShowExpanded, isExpanded } = props;
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

  const renderers: CustomTagRendererRecord = {
    spoiler: spoilerRenderer,
    body: (({ TDefaultRenderer, ...rest }) => {
      if (!isExpanded)
        (rest.tnode as Writeable<typeof rest.tnode>).children = [
          rest.tnode.children[0],
        ]; // All children other than the first element (assumed to be a text node)
      return <TDefaultRenderer {...rest} />;
    }) as CustomBlockRenderer,
  };

  function handleOnTextLayout(
    event: NativeSyntheticEvent<TextLayoutEventData>,
  ) {
    if (event.nativeEvent.lines.length > MAX_NUMBER_OF_LINES)
      setShowExpanded(true);
  }

  function handleOnDocument(doc: Document) {
    let numberOfLineBreaks = 0;
    for (const child of doc.children) {
      switch (child.type) {
        case 'tag':
          switch ((child as any).name) {
            default:
              numberOfLineBreaks++; // Each new element adds a new line
              break;
          }
          break;
      }
      if (numberOfLineBreaks > MAX_NUMBER_OF_LINES) break; // exit for loop
    }
    if (numberOfLineBreaks > MAX_NUMBER_OF_LINES) setShowExpanded(true);
  }

  return (
    <RenderHTML
      source={{ html: data }}
      renderers={renderers}
      customHTMLElementModels={customHTMLElementModels}
      contentWidth={contentWidth}
      baseStyle={baseStyle}
      tagsStyles={tagStyles}
      defaultTextProps={{
        numberOfLines: isExpanded ? undefined : MAX_NUMBER_OF_LINES,
        onTextLayout: handleOnTextLayout,
      }}
      domVisitors={{
        onDocument: handleOnDocument,
      }}
    />
  );
};

export default MangaDescriptionHTMLRenderer;
