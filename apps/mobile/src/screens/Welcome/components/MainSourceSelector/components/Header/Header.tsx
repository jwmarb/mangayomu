import Box from '@components/Box';
import Icon from '@components/Icon';
import Input from '@components/Input';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import connector from './Header.redux';
import { ConnectedHeaderProps } from '@screens/Welcome/components/MainSourceSelector/components/Header/Header.redux';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';

const Header: React.FC<ConnectedHeaderProps> = ({ setQuery, numSelected }) => (
  <Box m="l">
    <Stack space={moderateScale(8)}>
      <Box>
        <Text variant="header" align="center">
          Select your main sources
        </Text>
        <Text color="textSecondary" align="center">
          <Text bold>{numSelected}</Text> source{numSelected === 1 ? '' : 's'}{' '}
          selected
        </Text>
      </Box>
      <Input
        icon={<Icon type="font" name="magnify" />}
        placeholder="Type a source name..."
        clearButtonMode="always"
        width="100%"
        onChangeText={setQuery}
      />
    </Stack>
  </Box>
);

export default connector(React.memo(Header));
