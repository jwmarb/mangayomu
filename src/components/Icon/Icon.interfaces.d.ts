import FontAwesomeIconNames from 'react-native-vector-icons/glyphmaps/FontAwesome5Free.json';
import AntDesignIconNames from 'react-native-vector-icons/glyphmaps/AntDesign.json';
import MaterialCommunityIconNames from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import FoundationIconNames from 'react-native-vector-icons/glyphmaps/Foundation.json';
import FeatherIconNames from 'react-native-vector-icons/glyphmaps/Feather.json';
import OctIconNames from 'react-native-vector-icons/glyphmaps/Octicons.json';
import { AppColors } from '@theme/Color/Color.interfaces';

export type IconPack = 'FontAwesome5' | 'MaterialCommunityIcons' | 'AntDesign' | 'Foundation' | 'Feather' | 'Octicons';

export type IconProps<T extends IconPack> = {
  bundle: T;
  name: T extends 'FontAwesome5'
    ? keyof typeof FontAwesomeIconNames
    : T extends 'MaterialCommunityIcons'
    ? keyof typeof MaterialCommunityIconNames
    : T extends 'Foundation'
    ? keyof typeof FoundationIconNames
    : T extends 'Feather'
    ? keyof typeof FeatherIconNames
    : T extends 'AntDesign'
    ? keyof typeof AntDesignIconNames
    : T extends 'Octicons'
    ? keyof typeof OctIconNames
    : '';
  color?: AppColors;
  size?: 'small' | 'large' | 'medium' | 'tab';
};

export type IconBaseProps<
  T extends typeof FontAwesome5 | typeof MaterialCommunityIcons | typeof AntDesign | typeof Feather | typeof Foundation
> = React.ComponentProps<T>;
