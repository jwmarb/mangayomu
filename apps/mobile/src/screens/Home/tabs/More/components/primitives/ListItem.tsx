import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon, { IconProps } from '@/components/primitives/Icon';
import Pressable from '@/components/primitives/Pressable';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import { RootStackParamList } from '@/screens/navigator';

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.size.xl,
    paddingVertical: theme.style.size.m,
    gap: theme.style.size.m,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: theme.style.size.m,
    alignItems: 'center',
  },
  icon: {
    backgroundColor: theme.palette.background.menu,
    padding: theme.style.size.m,
    borderRadius: theme.style.borderRadius.m,
  },
}));

type ListItemProps = {
  title: string;
  icon: React.ReactElement<IconProps>;
  to: keyof {
    [K in keyof RootStackParamList as RootStackParamList[K] extends undefined
      ? K
      : never]: undefined;
  };
};

export default function ListItem(props: ListItemProps) {
  const { title, icon, to } = props;
  const navigation = useNavigation();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  function handleOnPress() {
    navigation.navigate(to);
  }
  return (
    <Pressable style={style.container} onPress={handleOnPress}>
      <View style={style.textContainer}>
        {React.cloneElement(icon, {
          color: 'textSecondary',
          style: style.icon,
        })}
        <Text>{title}</Text>
      </View>
      <Icon type="icon" name="chevron-right" color="textSecondary" />
    </Pressable>
  );
}
