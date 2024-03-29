import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SkeletonProps } from './';

const styles = StyleSheet.create({
  shape: {
    opacity: 0,
  },
});

const Skeleton: React.FC<SkeletonProps> = (props) => {
  const { children, fullWidth, height } = props;
  const theme = useTheme();
  const style = React.useMemo(
    () => ({
      flexGrow: fullWidth ? 1 : 0,
      height: height ?? 'auto',
      backgroundColor: theme.palette.skeleton,
      borderRadius: theme.style.borderRadius,
    }),
    [fullWidth, theme.style.borderRadius, theme.palette.skeleton, height],
  );

  return (
    <Box style={style as StyleProp<ViewStyle>}>
      <Box style={styles.shape}>{children}</Box>
    </Box>
  );
};

export default Skeleton;
