import Box from '@components/Box';
import styled, { css } from '@emotion/native';
import { useTheme } from '@emotion/react';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SkeletonProps } from './Skeleton.interfaces';

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
    [fullWidth, theme.style.borderRadius, theme.palette.skeleton],
  );

  return (
    <Box style={style}>
      <Box style={styles.shape}>{children}</Box>
    </Box>
  );
};

export default Skeleton;
