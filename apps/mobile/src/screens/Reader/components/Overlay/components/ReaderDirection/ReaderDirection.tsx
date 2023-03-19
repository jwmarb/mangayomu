import { useReaderContext } from '@screens/Reader/Reader';
import React from 'react';
import connector, {
  ConnectedReaderDirectionProps,
} from './ReaderDirection.redux';
import Realm from 'realm';
import { Menu, MenuItem } from '@components/Menu';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import { ReadingDirection, useReaderSetting } from '@redux/slices/settings';

const ReaderDirection: React.FC<ConnectedReaderDirectionProps> = (props) => {
  const { globalReadingDirection } = props;
  const { mangaKey } = useReaderContext();
  const [readingDirection, setReadingDirection] = useReaderSetting(
    'readerDirection',
    globalReadingDirection,
    mangaKey,
  );

  return (
    <Menu
      trigger={
        <IconButton icon={<Icon type="font" name="book-open-variant" />} />
      }
    >
      {Object.entries(ReadingDirection).map(([key, value]) => (
        <MenuItem
          key={key}
          optionKey={value as ReadingDirection}
          onSelect={setReadingDirection}
          color={value === readingDirection ? 'primary' : undefined}
        >
          {value}
        </MenuItem>
      ))}
      <MenuItem optionKey="Use global setting" onSelect={setReadingDirection}>
        Use global setting
      </MenuItem>
    </Menu>
  );
};

export default connector(React.memo(ReaderDirection));
