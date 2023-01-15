import React from 'react';
import { OverlayPageProps } from './OverlayPage.interfaces';
import { OverlayPageContainer, OverlayPageBackground } from './OverlayPage.base';
import { Typography } from '@components/core';

const OverlayPage: React.FC<OverlayPageProps> = (props) => {
  const { pageStyle, page, numberOfPages } = props;
  return (
    <OverlayPageContainer style={pageStyle}>
      <OverlayPageBackground>
        <Typography variant='bottomtab'>
          {page} / {numberOfPages}
        </Typography>
      </OverlayPageBackground>
    </OverlayPageContainer>
  );
};

export default React.memo(OverlayPage);
