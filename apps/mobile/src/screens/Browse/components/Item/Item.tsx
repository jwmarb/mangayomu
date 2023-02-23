import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import useMangaSource from '@hooks/useMangaSource';
import React from 'react';
import { RectButton } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { ItemProps } from './Item.interfaces';
import connector, { ConnectedItemProps } from './Item.redux';

const Item: React.FC<ConnectedItemProps> = ({
  item,
  isPinned,
  toggleSourcePin,
}) => {
  const theme = useTheme();
  const source = useMangaSource(item);
  function handleOnPin() {
    toggleSourcePin(item);
  }
  return (
    <RectButton rippleColor={theme.palette.action.ripple}>
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
            name={source.getIcon()}
            variant="inherit"
            size={moderateScale(32)}
          />
          <Box>
            <Text>{source.getName()}</Text>
            <Text color="textSecondary">{source.getVersion()}</Text>
          </Box>
        </Stack>
        <Stack space="s" flex-direction="row">
          <IconButton
            icon={<Icon type="font" name={isPinned ? 'pin' : 'pin-outline'} />}
            color={isPinned ? 'primary' : 'textSecondary'}
            onPress={handleOnPin}
          />
          <IconButton icon={<Icon type="font" name="cog" />} />
        </Stack>
      </Stack>
    </RectButton>
  );
};

export default connector(React.memo(Item));
