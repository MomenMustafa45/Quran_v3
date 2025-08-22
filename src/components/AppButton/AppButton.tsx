// components/AppButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { styles } from './styles';
import { iconSizes } from '../../constants/desingSystem';
import AppIcon, { iconTypes } from '../AppIcon/AppIcon';

type AppButtonProps = {
  title?: string;
  iconName?: string;
  iconType?: keyof typeof iconTypes;
  iconSize?: number;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

const AppButton: React.FC<AppButtonProps> = ({
  title,
  iconName,
  iconType,
  iconSize = iconSizes.xl,
  onPress,
  style,
  textStyle,
  disabled = false,
}) => {
  const renderIcon = () =>
    iconName && iconType ? (
      <AppIcon
        name={iconName}
        type={iconType}
        size={iconSize}
        style={styles.icon}
      />
    ) : null;

  return (
    <TouchableOpacity
      style={[styles.container, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {renderIcon()}
      {/* Title */}
      {title && <Text style={[styles.title, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default AppButton;
