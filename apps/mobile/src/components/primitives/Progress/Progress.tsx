import React from 'react';
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native';
import useTheme from '@/hooks/useTheme';

export default function Progress(props: ActivityIndicatorProps) {
  const theme = useTheme();
  return <ActivityIndicator {...props} color={theme.palette.primary.main} />;
}
