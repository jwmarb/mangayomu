import { TextProps } from '@components/Text/Text.interfaces';
import React from 'react';

export interface HyperlinkProps extends React.PropsWithChildren, TextProps {
  url: string;
}
