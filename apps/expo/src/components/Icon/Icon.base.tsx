import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import OctIcons from 'react-native-vector-icons/Octicons';
import styled, { css } from 'styled-components/native';
import { IconBaseProps } from '@components/Icon/Icon.interfaces';

export const FontAwesome5Base = styled(FontAwesome5)<IconBaseProps<typeof FontAwesome5>>``;

export const AntDesignBase = styled(AntDesign)<IconBaseProps<typeof AntDesign>>``;

export const MaterialCommunityIconsBase = styled(MaterialCommunityIcons)<
  IconBaseProps<typeof MaterialCommunityIcons>
>``;

export const FoundationBase = styled(Foundation)<IconBaseProps<typeof Foundation>>``;

export const FeatherBase = styled(Feather)<IconBaseProps<typeof Feather>>``;

export const OcticonsBase = styled(OctIcons)<IconBaseProps<typeof OctIcons>>``;
