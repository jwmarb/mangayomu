import { Button, Divider, Flex, Icon, IconButton, MenuOption, Spacer, Typography } from '@components/core';
import useMangaSource from '@hooks/useMangaSource';
import { MainSourceImage } from '@screens/SourceSelector/components/SourceSelectorHeader/SourceSelectorHeader.base';
import MangaHost from '@services/scraper/scraper.abstract';
import React from 'react';
import { Linking } from 'react-native';
import { Menu, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from 'styled-components/native';

const SourceSelectorHeader: React.FC = (props) => {
  const {} = props;
  const source = useMangaSource();
  const theme = useTheme();
  const [opened, setOpened] = React.useState<boolean>(false);
  function handleOnOpen() {
    setOpened(true);
  }
  function handleOnClose() {
    setOpened(false);
  }

  async function handleOnSelect(selectedOption: number) {
    handleOnClose();
    switch (selectedOption) {
      case 0:
        await Linking.openURL('https://' + source.getLink());
        break;
      case 1:
        break;
    }
  }

  return (
    <>
      <Flex container verticalPadding={2} horizontalPadding={3} direction='column'>
        <Typography variant='header'>Current Source</Typography>
        <Spacer y={2} />
        <Flex justifyContent='space-between'>
          <Flex>
            <MainSourceImage source={{ uri: source.getIcon() }} />
            <Spacer x={1} />
            <Flex direction='column'>
              <Typography bold>{source.getName()}</Typography>
              <Typography>
                Version: <Typography bold>v{source.getVersion()}</Typography>
              </Typography>
            </Flex>
          </Flex>
          <Flex direction='column' justifyContent='center'>
            <Menu
              onSelect={handleOnSelect}
              opened={opened}
              onClose={handleOnClose}
              onBackdropPress={handleOnClose}
              onOpen={handleOnOpen}>
              <MenuTrigger>
                <IconButton icon={<Icon bundle='Feather' name='more-vertical' />} onPress={handleOnOpen} />
              </MenuTrigger>
              <MenuOptions customStyles={theme.menuOptionsStyle}>
                <MenuOption text='View Website' value={0} />
                <MenuOption text='Report Source' color='secondary' value={1} />
              </MenuOptions>
            </Menu>
          </Flex>
        </Flex>
      </Flex>
      <Flex container verticalPadding={2} horizontalPadding={3} direction='column'>
        <Typography variant='header'>Sources ({MangaHost.availableSources.size})</Typography>
      </Flex>
    </>
  );
};

export default React.memo(SourceSelectorHeader);
