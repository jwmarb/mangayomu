import { View } from 'react-native';
import React from 'react';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';

export const HEADER_HEIGHT = 32;

const styles = createStyles((theme) => ({
  container: {
    height: HEADER_HEIGHT,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
}));

type HeaderProps = {
  text: string;
};

function Header({ text }: HeaderProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <View style={style.container}>
      <Text variant="h4">{text}</Text>
    </View>
  );
}

export default React.memo(Header);
