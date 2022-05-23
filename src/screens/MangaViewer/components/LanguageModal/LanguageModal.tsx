import { HeaderBuilder, Modal, Typography } from '@components/core';
import React from 'react';
import { LanguageModalProps } from './LanguageModal.interfaces';

const LanguageModal: React.FC<LanguageModalProps> = (props) => {
  const { visible, onCloseModal, sortOptions } = props;
  return (
    <Modal visible={visible} onClose={onCloseModal}>
      <HeaderBuilder paper removeStatusBarPadding horizontalPadding verticalPadding>
        <Typography variant='subheader'>Sort chapters</Typography>
      </HeaderBuilder>
      {sortOptions}
    </Modal>
  );
};

export default React.memo(LanguageModal);
