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
import MainSourceSelector from '@screens/Welcome/components/MainSourceSelector';
import Avatar from '@components/Avatar';
import Badge from '@components/Badge';

const Explore: React.FC<ConnectedExploreProps> = ({ source, strSources }) => {
  const { user } = useAuth0();
  const { height } = useWindowDimensions();
  const sourceSelectorRef =
    React.useRef<React.ElementRef<typeof MainSourceSelector>>(null);
  function handleOnPress() {
    sourceSelectorRef.current?.snapToIndex(1);
  }
  const { onScroll, scrollViewStyle } = useCollapsibleTabHeader({
    dependencies: [strSources.length],
    headerLeft: (
      <Badge type="number" count={strSources.length} color="primary">
        <IconButton
          icon={<Icon type="font" name="bookshelf" />}
          onPress={handleOnPress}
        />
      </Badge>
    ),
    headerRight: (
      <IconButton
        icon={<Avatar uri={user?.picture} />}
        onPress={() => console.log('Account')}
      />
    ),
  });
  return (
    <>
      <Animated.ScrollView style={scrollViewStyle} onScroll={onScroll}>
        <Stack space="s" flex-grow minHeight={height}>
          <Box my="s" mx="m">
            <Input
              icon={<Icon type="font" name="magnify" />}
              width="100%"
              placeholder="Titles, authors, or topics"
            />
          </Box>
          {source.hasNoSources() && (
            <Stack space="s" mx="m" align-self="center">
              <Text variant="header" align="center">
                No sources selected
              </Text>
              <Text color="textSecondary">
                Sources that are selected will have their hot and latest updates
                shown here.
              </Text>
              <Text color="textSecondary">
                To select sources, press on{' '}
                <Icon type="font" name="bookshelf" /> at the top left corner to
                open the source selector modal.
              </Text>
            </Stack>
          )}
          <Box my="s" mx="m">
            <Text variant="header" bold>
              Genres
            </Text>
            <Text variant="header" bold>
              Trending updates{' '}
              <Icon
                type="font"
                name="fire"
                color="secondary"
                variant="header"
              />
            </Text>
            <Text variant="header" bold>
              Recently updated{' '}
              <Icon
                type="font"
                name="clock-fast"
                color="primary"
                variant="header"
              />
            </Text>
          </Box>
        </Stack>
      </Animated.ScrollView>
      <MainSourceSelector ref={sourceSelectorRef} />
    </>
  );
};

export default connector(Explore);
