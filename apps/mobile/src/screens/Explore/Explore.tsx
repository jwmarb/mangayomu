import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import useAuth0 from '@hooks/useAuth0';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import connector, {
  ConnectedExploreProps,
} from '@screens/Explore/Explore.redux';
import React from 'react';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { useWindowDimensions } from 'react-native';

const Explore: React.FC<ConnectedExploreProps> = ({ source }) => {
  const { user } = useAuth0();
  const { height } = useWindowDimensions();
  const { onScroll, scrollViewStyle } = useCollapsibleTabHeader({
    headerLeft: (
      <IconButton
        icon={
          source == null ? (
            <Icon type="font" name="book-alert" />
          ) : (
            <Icon type="image" name={source.getIcon()} />
          )
        }
      />
    ),
    headerRight: (
      <IconButton
        icon={
          user == null ? (
            <Icon name="account" />
          ) : (
            <FastImage
              source={{ uri: user?.picture }}
              style={{
                width: moderateScale(32),
                height: moderateScale(32),
                borderRadius: 10000,
              }}
            />
          )
        }
        onPress={() => console.log('Account')}
      />
    ),
  });
  return (
    <Animated.ScrollView style={scrollViewStyle} onScroll={onScroll}>
      <Stack space="s" flex-grow minHeight={height}>
        <Box my="s" mx="m">
          <Input
            icon={<Icon name="magnify" />}
            width="100%"
            placeholder="Titles, authors, or topics"
          />
        </Box>
        <Stack space="s" mx="m" align-self="center">
          <Text color="textSecondary">
            Sources that are selected will have their hot and latest updates
            shown here.
          </Text>
          <Text color="textSecondary">
            To select sources, press on <Icon type="font" name="book-alert" />{' '}
            at the top left corner to open the source selector modal.
          </Text>
        </Stack>
        {/* {source == null ? (
          <Stack space="s" mx="m">
            <Text color="textSecondary">
              Sources that are selected will have their hot and latest updates
              shown here.
            </Text>
            <Text color="textSecondary">
              To select sources, press on <Icon type="font" name="book-alert" />{' '}
              at the top left corner to open the source selector modal.
            </Text>
          </Stack>
        ) : (
          <Box my="s" mx="m">
            <Text variant="header" bold>
              Genres
            </Text>
          </Box>
        )} */}
      </Stack>
    </Animated.ScrollView>
  );
};

export default connector(Explore);
