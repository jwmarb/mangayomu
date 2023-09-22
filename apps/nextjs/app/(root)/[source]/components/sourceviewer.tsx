'use client';
import SourceViewerHeader from '@app/(root)/[source]/components/sourceviewerheader';
import Screen from '@app/components/Screen';
import Text from '@app/components/Text';
import getMangaHost from '@app/helpers/getMangaHost';
import React from 'react';

interface SourceViewerProps {
  source: string;
}

export default function SourceViewer(props: SourceViewerProps) {
  const { source } = props;
  const host = getMangaHost(source);
  return (
    <>
      <SourceViewerHeader host={host} />
      <Screen.Content>
        <Text>in progress</Text>
      </Screen.Content>
    </>
  );
}
