import React from 'react';

export interface MenuProps extends React.PropsWithChildren {
  trigger: React.ReactElement<unknown>;
  title?: 'Actions' | 'Options';
}
