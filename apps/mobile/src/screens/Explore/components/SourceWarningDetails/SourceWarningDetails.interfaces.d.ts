import { SourceError } from '@helpers/getMangaHost';
import { StatusAPI } from '@redux/slices/explore';
import React from 'react';

export interface SourceWarningDetailsProps extends React.PropsWithChildren {
  status: StatusAPI;
  errors: SourceError[];
}
