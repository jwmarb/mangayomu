import Box from '@components/Box';
import Button from '@components/Button';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
import Switch from '@components/Switch';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import React from 'react';
import { Linking, Pressable, ScrollView } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { MangaHost } from '@mangayomu/mangascraper/src';
import { toggleConfig } from '@redux/slices/host';
import { useAppDispatch } from '@redux/main';
import useAppSelector from '@hooks/useAppSelector';

const SourceView: React.FC<
  RootStackProps<'SourceView'> & ReturnType<typeof useCollapsibleHeader>
> = (props) => {
  // const { source, config, toggleConfig } = props;
  const source = React.useRef(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    MangaHost.sourcesMap.get(props.route.params.source)!,
  ).current;
  const config = useAppSelector(
    (state) => state.host.hostsConfig[props.route.params.source],
  );
  const dispatch = useAppDispatch();
  const url = React.useRef<string>(`https://${source.getLink()}`).current;
  const { onScroll, scrollViewStyle, contentContainerStyle } = props;
  async function handleOnViewWebsite() {
    if (await Linking.canOpenURL(url)) Linking.openURL(url);
  }
  function handleOnLongPress() {
    displayMessage(url);
  }
  const theme = useTheme();

  function handleOnToggleHot() {
    dispatch(toggleConfig({ source: source.name, key: 'useHottestUpdates' }));
  }

  function handleOnToggleLatest() {
    dispatch(toggleConfig({ source: source.name, key: 'useLatestUpdates' }));
  }

  function handleOnToggleWithSearch() {
    dispatch(
      toggleConfig({ source: source.name, key: 'useWithUniversalSearch' }),
    );
  }

  return (
    <ScrollView
      onScroll={onScroll}
      style={scrollViewStyle}
      contentContainerStyle={contentContainerStyle}
    >
      <Stack space="m">
        <Stack
          mx="m"
          my="s"
          align-items="center"
          space="s"
          flex-direction="row"
        >
          <Icon
            type="image"
            name={source.icon}
            size={moderateScale(32)}
            variant="inherit"
          />
          <Box flex-direction="column">
            <Text>{source.name}</Text>
            <Text color="textSecondary">Version: {source.getVersion()}</Text>
            {source.isAdult() && (
              <Text color="warning">This source may contain 18+ content</Text>
            )}
          </Box>
        </Stack>
        <Box mx="m" my="s">
          <Button
            label="Visit website"
            icon={<Icon type="font" name="web" />}
            onPress={handleOnViewWebsite}
            onLongPress={handleOnLongPress}
          />
        </Box>
        <Stack space="s">
          <Box mx="m" my="s">
            <Text variant="header">Configuration</Text>
          </Box>
          <Pressable
            android_ripple={{ color: theme.palette.action.ripple }}
            onPress={handleOnToggleWithSearch}
          >
            <Stack
              mx="m"
              my="s"
              flex-direction="row"
              space="s"
              align-items="center"
              justify-content="space-between"
            >
              <Text color="textSecondary">Use with universal search</Text>
              <Switch
                enabled={config.useWithUniversalSearch}
                onChange={handleOnToggleWithSearch}
              />
            </Stack>
          </Pressable>
          {source.hasHotMangas() && (
            <Pressable
              android_ripple={{ color: theme.palette.action.ripple }}
              onPress={handleOnToggleHot}
            >
              <Stack
                mx="m"
                my="s"
                flex-direction="row"
                space="s"
                align-items="center"
                justify-content="space-between"
              >
                <Text color="textSecondary">Show trending mangas</Text>
                <Switch
                  enabled={config.useHottestUpdates}
                  onChange={handleOnToggleHot}
                />
              </Stack>
            </Pressable>
          )}
          {source.hasLatestMangas() && (
            <Pressable
              android_ripple={{ color: theme.palette.action.ripple }}
              onPress={handleOnToggleLatest}
            >
              <Stack
                mx="m"
                my="s"
                flex-direction="row"
                space="s"
                align-items="center"
                justify-content="space-between"
              >
                <Text color="textSecondary">Show recently updated mangas</Text>
                <Switch
                  enabled={config.useLatestUpdates}
                  onChange={handleOnToggleLatest}
                />
              </Stack>
            </Pressable>
          )}
        </Stack>
      </Stack>
    </ScrollView>
  );
};

export default SourceView;
