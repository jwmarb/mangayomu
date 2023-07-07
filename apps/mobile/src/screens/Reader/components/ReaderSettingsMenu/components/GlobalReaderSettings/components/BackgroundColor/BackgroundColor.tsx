import Stack from '@components/Stack';
import Text from '@components/Text';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import React from 'react';
import connector, {
  ConnectedBackgroundColorProps,
} from './BackgroundColor.redux';
import ModalMenu from '@components/ModalMenu';
import { Pressable } from 'react-native';
import { useTheme } from '@emotion/react';

const BackgroundColor: React.FC<ConnectedBackgroundColorProps> = (props) => {
  const { backgroundColor, setReaderBackgroundColor } = props;
  const theme = useTheme();

  return (
    <ModalMenu
      title="Background color"
      value={backgroundColor}
      onChange={setReaderBackgroundColor}
      enum={ReaderBackgroundColor}
      trigger={
        <Pressable android_ripple={{ color: theme.palette.action.ripple }}>
          <Stack m="m">
            <Text>Background color</Text>
            <Text variant="body-sub" color="textSecondary">
              {backgroundColor}
            </Text>
          </Stack>
        </Pressable>
      }
    />
  );
};

export default connector(React.memo(BackgroundColor));
