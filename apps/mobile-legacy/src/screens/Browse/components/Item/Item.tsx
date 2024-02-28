import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Stack from '@components/Stack';
import Text from '@components/Text';
import useMangaSource from '@hooks/useMangaSource';
import useRootNavigation from '@hooks/useRootNavigation';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import Pressable from '@components/Pressable';
import useAppSelector from '@hooks/useAppSelector';
import { useAppDispatch } from '@redux/main';
import { toggleSourcePin } from '@redux/slices/host';

export interface ItemProps {
  item: string;
}

const Item: React.FC<ItemProps> = ({ item }) => {
  const isPinned = useAppSelector((state) => item in state.host.pinned);
  const dispatch = useAppDispatch();
  const source = useMangaSource(item);
  const navigation = useRootNavigation();
  function handleOnPin() {
    dispatch(toggleSourcePin(item));
  }
  function navigateToSettings() {
    navigation.navigate('SourceView', { source: item });
  }
  function handleOnPress() {
    navigation.navigate('InfiniteMangaList', { source: item });
  }
  return (
    <Pressable onPress={handleOnPress}>
      <Stack
        space="s"
        flex-direction="row"
        mx="m"
        my="s"
        justify-content="space-between"
        align-items="center"
      >
        <Stack
          space="s"
          flex-direction="row"
          align-items="center"
          align-self="center"
        >
          <Icon
            type="image"
            name={source.icon}
            variant="inherit"
            size={moderateScale(32)}
          />
          <Box>
            <Text>{source.name}</Text>
            <Text color="textSecondary">{source.getVersion()}</Text>
          </Box>
        </Stack>
        <Stack space="s" flex-direction="row">
          <IconButton
            icon={<Icon type="font" name={isPinned ? 'pin' : 'pin-outline'} />}
            color={isPinned ? 'primary' : 'textSecondary'}
            onPress={handleOnPin}
          />
          <IconButton
            icon={<Icon type="font" name="cog" />}
            onPress={navigateToSettings}
          />
        </Stack>
      </Stack>
    </Pressable>
  );
};

export default React.memo(Item);
