import Stack from '@components/Stack';
import Text from '@components/Text';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import React from 'react';
import connector, {
  ConnectedBackgroundColorProps,
} from './BackgroundColor.redux';
import { RectButton } from 'react-native-gesture-handler';
import ModalMenu from '@components/ModalMenu';

const BackgroundColor: React.FC<ConnectedBackgroundColorProps> = (props) => {
  const { backgroundColor, setReaderBackgroundColor } = props;

  return (
    <ModalMenu
      title="Background color"
      value={backgroundColor}
      onChange={setReaderBackgroundColor}
      enum={ReaderBackgroundColor}
      trigger={
        <RectButton>
          <Stack m="m">
            <Text>Background color</Text>
            <Text variant="body-sub" color="textSecondary">
              {backgroundColor}
            </Text>
          </Stack>
        </RectButton>
      }
    />
  );
};

export default connector(React.memo(BackgroundColor));
