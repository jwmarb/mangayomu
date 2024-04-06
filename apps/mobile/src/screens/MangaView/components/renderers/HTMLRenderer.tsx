import RenderHTML, {
  MixedStyleDeclaration,
  Document,
  CustomTagRendererRecord,
  HTMLElementModelRecord,
} from 'react-native-render-html';
import {
  Dimensions,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';
import React from 'react';
import { variants } from '@/components/primitives/Text/styles';
import { createThemedProps } from '@/utils/theme';
import useThemedProps from '@/hooks/useThemedProps';
import useContrast from '@/hooks/useContrast';
import {
  spoilerElementModel,
  spoilerRenderer,
} from '@/screens/MangaView/renderers/spoiler';
import { bodyRenderer } from '@/screens/MangaView/renderers/body';

const MAX_NUMBER_OF_LINES = 6;

const customHTMLElementModels: HTMLElementModelRecord = {
  spoiler: spoilerElementModel,
};

const renderers: CustomTagRendererRecord = {
  spoiler: spoilerRenderer,
  body: bodyRenderer,
};

type HTMLRendererProps = {
  data: string;
  setShowExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isExpanded: boolean;
};

const themedProps = createThemedProps((theme) => ({
  baseStyle: {
    ...variants.body1,
    color: theme.palette.text.secondary,
    margin: 0,
  } as MixedStyleDeclaration,

  tagsStyles: {
    p: {
      ...variants.body1,
      color: theme.palette.text.secondary,
      margin: 0,
    },
    a: {
      ...variants.body1,
      color: theme.palette.text.hint,
      margin: 0,
    },
    hr: {
      marginVertical: theme.style.size.m,
    },
    h1: {
      ...variants.h3,
      margin: 0,
      color: theme.palette.text.primary,
    },
    h3: {
      ...variants.h4,
      margin: 0,
      color: theme.palette.text.primary,
    },
  } as Record<string, MixedStyleDeclaration>,
  contentWidth:
    Dimensions.get('window').width - theme.style.screen.paddingHorizontal * 2,
}));

export default function HTMLRenderer(props: HTMLRendererProps) {
  const { data, setShowExpanded, isExpanded } = props;
  const contrast = useContrast();
  const { baseStyle, tagsStyles, contentWidth } = useThemedProps(
    themedProps,
    contrast,
  );
  const source = React.useMemo(() => ({ html: data }), [data]);

  const handleOnTextLayout = React.useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (event.nativeEvent.lines.length > MAX_NUMBER_OF_LINES)
        setShowExpanded(true);
    },
    [setShowExpanded],
  );

  const handleOnDocument = React.useCallback(
    (doc: Document) => {
      let numberOfLineBreaks = 0;
      for (const child of doc.children) {
        switch (child.type) {
          case 'tag':
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    },
    [setShowExpanded],
  );

  const domVisitors = React.useMemo(
    () => ({
      onDocument: handleOnDocument,
    }),
    [handleOnDocument],
  );

  const defaultTextProps = React.useMemo(
    () => ({
      numberOfLines: isExpanded ? undefined : MAX_NUMBER_OF_LINES,
      onTextLayout: handleOnTextLayout,
    }),
    [isExpanded, handleOnTextLayout],
  );

  return (
    <RenderHTML
      customHTMLElementModels={customHTMLElementModels}
      renderers={renderers}
      source={source}
      baseStyle={baseStyle}
      tagsStyles={tagsStyles}
      contentWidth={contentWidth}
      defaultTextProps={defaultTextProps}
      domVisitors={domVisitors}
    />
  );
}
