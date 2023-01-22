import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import { moderateScale } from 'react-native-size-matters';

export function Circle(props: { enabled: boolean }) {
  const { enabled } = props;
  const theme = useTheme();
  return (
    <Box
      border-radius={1000}
      background-color={enabled ? 'primary' : theme.palette.text.disabled}
      width={moderateScale(8)}
      height={moderateScale(8)}
    />
  );
}
