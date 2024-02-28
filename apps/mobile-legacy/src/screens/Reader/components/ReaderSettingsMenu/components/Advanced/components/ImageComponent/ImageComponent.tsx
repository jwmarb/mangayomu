import Box from '@components/Box';
import Button from '@components/Button';
import Icon from '@components/Icon';
import { Menu, MenuItem } from '@components/Menu';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { ReaderImageComponent } from '@redux/slices/settings';
import React from 'react';
import connector, {
  ConnectedImageComponentProps,
} from './ImageComponent.redux';

const ImageComponent: React.FC<ConnectedImageComponentProps> = (props) => {
  const { imageComponent, setReaderImageComponent } = props;
  return (
    <Stack space="s">
      <Stack
        space="s"
        flex-direction="row"
        align-items="center"
        justify-content="space-between"
      >
        <Text>Image Component</Text>
        <Menu
          trigger={
            <Button
              label={imageComponent}
              icon={<Icon type="font" name="chevron-down" />}
              iconPlacement="right"
            />
          }
        >
          {Object.entries(ReaderImageComponent).map(([key, value]) => (
            <MenuItem
              key={key}
              optionKey={value as ReaderImageComponent}
              onSelect={setReaderImageComponent}
              color={value === imageComponent ? 'primary' : undefined}
            >
              {value}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
      <Box ml="m">
        <Text color="textSecondary">
          This defines what component pages should use. All these options have
          their advantages and disadvantages. WebView offers the best image
          quality but is buggy. Image has the worst quality if the images exceed
          your device's dimensions. FastImage is a balance between the two,
          however, it is not the most performant.
        </Text>
      </Box>
    </Stack>
  );
};

export default connector(ImageComponent);
