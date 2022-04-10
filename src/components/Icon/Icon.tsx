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

export default function Icon<T extends IconPack>(props: IconProps<T>) {
  const { bundle, name, color = 'textPrimary', size } = props;
  const numSize = React.useMemo(() => {
    switch (size) {
      default:
      case 'medium':
        return RFValue(20);
      case 'large':
        return RFValue(32);
      case 'small':
        return RFValue(14);
    }
  }, [size]);

  switch (bundle) {
    case 'FontAwesome5':
      return <FontAwesome5Base name={name} color={Color.valueOf(color)} size={numSize} />;
    case 'AntDesign':
      return <AntDesignBase name={name} color={Color.valueOf(color)} size={numSize} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIconsBase name={name} color={Color.valueOf(color)} size={numSize} />;
    case 'Foundation':
      return <FoundationBase name={name} color={Color.valueOf(color)} size={numSize} />;
    case 'Feather':
      return <FeatherBase name={name} color={Color.valueOf(color)} size={numSize} />;
    case 'Octicons':
      return <OcticonsBase name={name} color={Color.valueOf(color)} size={numSize} />;
    default:
      return null;
  }
}
