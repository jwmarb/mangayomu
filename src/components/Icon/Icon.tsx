import { IconPack, IconProps } from '@components/Icon/Icon.interfaces';
import { rem } from '@theme/Typography';
import React from 'react';
import {
  FontAwesome5Base,
  AntDesignBase,
  MaterialCommunityIconsBase,
  FoundationBase,
  FeatherBase,
  OcticonsBase,
} from '@components/Icon/Icon.base';
import { Color } from '@theme/core';
import { RFValue } from 'react-native-responsive-fontsize';

export default function Icon<T extends IconPack>(props: React.PropsWithChildren<IconProps<T>>) {
  const { bundle, name, color = 'textPrimary', size, lockTheme, children } = props;
  const numSize = React.useMemo(() => {
    switch (size) {
      default:
      case 'medium':
        return RFValue(20);
      case 'large':
        return RFValue(32);
      case 'small':
        return RFValue(14);
      case 'tab':
        return RFValue(16);
      case 'checkbox':
        return RFValue(10);
    }
  }, [size]);

  switch (bundle) {
    case 'FontAwesome5':
      return (
        <FontAwesome5Base name={name} color={Color.valueOf(color, lockTheme)} size={numSize}>
          {children}
        </FontAwesome5Base>
      );
    case 'AntDesign':
      return (
        <AntDesignBase name={name} color={Color.valueOf(color, lockTheme)} size={numSize}>
          {children}
        </AntDesignBase>
      );
    case 'MaterialCommunityIcons':
      return (
        <MaterialCommunityIconsBase name={name} color={Color.valueOf(color, lockTheme)} size={numSize}>
          {children}
        </MaterialCommunityIconsBase>
      );
    case 'Foundation':
      return (
        <FoundationBase name={name} color={Color.valueOf(color, lockTheme)} size={numSize}>
          {children}
        </FoundationBase>
      );
    case 'Feather':
      return (
        <FeatherBase name={name} color={Color.valueOf(color, lockTheme)} size={numSize}>
          {children}
        </FeatherBase>
      );
    case 'Octicons':
      return (
        <OcticonsBase name={name} color={Color.valueOf(color, lockTheme)} size={numSize}>
          {children}
        </OcticonsBase>
      );
    default:
      return null;
  }
}
