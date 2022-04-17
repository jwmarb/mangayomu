import { MangaCoverBase, MangaCoverBaseContainer } from '@components/Manga/Cover/Cover.base';
import { MangaCoverProps } from '@components/Manga/Cover/Cover.interfaces';
import React from 'react';

const Cover: React.FC<MangaCoverProps> = (props) => {
  const { size = 'medium', uri } = props;
  return (
    <MangaCoverBaseContainer size={size}>
      <MangaCoverBase source={{ uri }} size={size} />
    </MangaCoverBaseContainer>
  );
};

export default Cover;
