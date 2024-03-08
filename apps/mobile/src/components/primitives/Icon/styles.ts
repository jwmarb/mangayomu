import { StyleSheet, TextStyle } from 'react-native';
import { IconSizes } from '@/components/primitives/types';
import { IconProps } from '@/components/primitives/Icon/Icon';

export const sizes = (type: Pick<IconProps, 'type'>['type']) =>
  StyleSheet.create<Record<IconSizes, TextStyle>>({
    large:
      type === 'icon'
        ? {
            fontSize: 32,
          }
        : {
            width: 32,
            height: 32,
          },
    medium:
      type === 'icon'
        ? {
            fontSize: 24,
          }
        : {
            width: 24,
            height: 24,
          },
    small:
      type === 'icon'
        ? {
            fontSize: 16,
          }
        : {
            width: 16,
            height: 16,
          },
  });
