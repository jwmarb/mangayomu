import {
  useReaderSetting,
  ImageScaling as ImageScalingEnum,
} from '@redux/slices/settings';
import { useReaderContext } from '@screens/Reader/Reader';
import React from 'react';
import connector, { ConnectedImageScalingProps } from './ImageScaling.redux';
import { Menu, MenuItem } from '@components/Menu';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';

const ImageScaling: React.FC<ConnectedImageScalingProps> = (props) => {
  const { globalImageScaling } = props;
  const { mangaKey } = useReaderContext();
  const [imageScaling, setImageScaling] = useReaderSetting(
    'readerImageScaling',
    globalImageScaling,
    mangaKey,
  );
  return (
    <Menu
      trigger={
        <IconButton icon={<Icon type="font" name="book-open-variant" />} />
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
      <MenuItem optionKey="Use global setting" onSelect={setImageScaling}>
        Use global setting
      </MenuItem>
    </Menu>
  );
};

export default connector(React.memo(ImageScaling));