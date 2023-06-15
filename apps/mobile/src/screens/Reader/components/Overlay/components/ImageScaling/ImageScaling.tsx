import {
  useReaderSetting,
  ImageScaling as ImageScalingEnum,
} from '@redux/slices/settings';
import React from 'react';
import connector, { ConnectedImageScalingProps } from './ImageScaling.redux';
import { Menu, MenuItem } from '@components/Menu';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
import Text from '@components/Text';
import Button from '@components/Button';
import OverlayBottomButton from '@screens/Reader/components/Overlay/components/OverlayBottomButton';
import Box from '@components/Box/Box';
import { useMangaKey } from '@screens/Reader/context/MangaKey';

const ImageScaling: React.FC<ConnectedImageScalingProps> = (props) => {
  const { globalImageScaling, type = 'button', setGlobalImageScaling } = props;
  const mangaKey = useMangaKey();
  const set = React.useCallback(
    (val: ImageScalingEnum | 'Use global setting') => {
      if (val != 'Use global setting') setGlobalImageScaling(val);
    },
    [setGlobalImageScaling],
  );
  const [imageScaling, setImageScaling] = useReaderSetting(
    'readerImageScaling',
    globalImageScaling,
    mangaKey ?? set,
  );
  if (type === 'button')
    return (
      <Box flex-grow>
        <Menu
          trigger={
            <OverlayBottomButton name="image" settingName="Image scaling" />
          }
        >
          {Object.entries(ImageScalingEnum).map(([key, value]) => (
            <MenuItem
              key={key}
              optionKey={value as ImageScalingEnum}
              onSelect={setImageScaling}
              color={value === imageScaling ? 'primary' : undefined}
            >
              {value}
            </MenuItem>
          ))}
          {mangaKey != null && (
            <MenuItem
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              optionKey={'Use global setting' as any}
              onSelect={setImageScaling}
              color={
                imageScaling === 'Use global setting' ? 'primary' : undefined
              }
            >
              Use global setting
            </MenuItem>
          )}
        </Menu>
      </Box>
    );
  return (
    <Stack
      flex-direction="row"
      space="s"
      align-items="center"
      justify-content="space-between"
    >
      <Text>Image scaling</Text>
      <Menu
        trigger={
          <Button
            label={imageScaling}
            icon={<Icon type="font" name="chevron-down" />}
            iconPlacement="right"
          />
        }
      >
        {Object.entries(ImageScalingEnum).map(([key, value]) => (
          <MenuItem
            key={key}
            optionKey={value as ImageScalingEnum}
            onSelect={setImageScaling}
            color={value === imageScaling ? 'primary' : undefined}
          >
            {value}
          </MenuItem>
        ))}
        {mangaKey != null && (
          <MenuItem
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            optionKey={'Use global setting' as any}
            onSelect={setImageScaling}
            color={
              imageScaling === 'Use global setting' ? 'primary' : undefined
            }
          >
            Use global setting
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export default connector(React.memo(ImageScaling));
