import Button from '@components/Button';
import Icon from '@components/Icon';
import { Menu, MenuItem } from '@components/Menu';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import React from 'react';
import connector, {
  ConnectedBackgroundColorProps,
} from './BackgroundColor.redux';

const BackgroundColor: React.FC<ConnectedBackgroundColorProps> = (props) => {
  const { backgroundColor, setReaderBackgroundColor } = props;
  return (
    <Stack
      space="s"
      flex-direction="row"
      justify-content="space-between"
      align-items="center"
    >
      <Text>Background color</Text>
      <Menu
        trigger={
          <Button
            label={backgroundColor}
            icon={<Icon type="font" name="chevron-down" />}
            iconPlacement="right"
          />
        }
      >
        {Object.entries(ReaderBackgroundColor).map(([key, value]) => (
          <MenuItem
            key={key}
            optionKey={value as ReaderBackgroundColor}
            onSelect={setReaderBackgroundColor}
            color={value === backgroundColor ? 'primary' : undefined}
          >
            {value}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default connector(React.memo(BackgroundColor));
