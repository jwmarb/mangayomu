import React from 'react';
import { MangaSourceProps } from './MangaSource.interfaces';
import { Button, Flex, Spacer, Typography } from '@components/core';
import { MangaSourceIcon } from '@screens/SourceSelector/components/MangaSource/MangaSource.base';
import connector, { ConnectedMangaSourceProps } from '@screens/SourceSelector/components/MangaSource/MangaSource.redux';
import displayMessage from '@utils/displayMessage';

const MangaSource: React.FC<ConnectedMangaSourceProps> = (props) => {
  const { source, isCurrentSource, setSource } = props;
  function handleOnPress() {
    displayMessage(`Set ${source.getName()} as current source`);
    setSource(source);
  }
  return (
    <Flex justifyContent='space-between' container verticalPadding={1} horizontalPadding={3}>
      <Flex alignItems='center'>
        <MangaSourceIcon source={{ uri: source.getIcon() }} />
        <Spacer x={1} />
        <Typography>{source.getName()}</Typography>
      </Flex>
      <Spacer x={1} />
      <Button
        title={isCurrentSource ? 'Your Current Source' : 'Set As Source'}
        disabled={isCurrentSource}
        onPress={handleOnPress}
      />
    </Flex>
  );
};

export default connector(React.memo(MangaSource));
