import React from 'react';
import { View, ViewProps } from 'react-native';
import { styles } from '@/components/composites/Modal/styles';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';

export type ContentProps = ViewProps;

export default function Content(props: React.PropsWithChildren<ContentProps>) {
  const { children, style: styleProp, ...rest } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const viewStyle = [style.content, styleProp];
  return (
    <View style={viewStyle} {...rest}>
      {children}
    </View>
  );
}
