import React from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { iconSizes } from '../../constants/desingSystem';

export const iconTypes = {
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Feather,
  EvilIcons,
  Entypo,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
};

type AppIconProps = {
  name: string;
  type: keyof typeof iconTypes;
  size?: number;
  color?: string;
  style?: ViewStyle | TextStyle;
};

const AppIcon = ({
  name,
  type,
  size = iconSizes.lg,
  color = 'black',
  style,
}: AppIconProps) => {
  const IconComponent = iconTypes[type];

  if (!IconComponent) {
    console.warn(`Icon type "${type}" is not supported.`);
    return null;
  }

  return <IconComponent name={name} size={size} color={color} style={style} />;
};

export default AppIcon;
