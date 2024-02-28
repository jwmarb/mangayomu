import Hyperlink from './Hyperlink';
export default Hyperlink;
import { TextProps } from '@components/Text';
import React from 'react';

export interface HyperlinkProps extends React.PropsWithChildren, TextProps {
  url: string;
}
