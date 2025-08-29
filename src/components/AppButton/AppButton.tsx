// components/AppButton.tsx
import React from 'react';
import {
  TouchableOpacity,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { styles } from './styles';
import { iconSizes } from '../../constants/desingSystem';
import AppIcon, { iconTypes } from '../AppIcon/AppIcon';
import AppText from '../AppText/AppText';

type AppButtonProps = {
  title?: string;
  iconName?: string;
  iconType?: keyof typeof iconTypes;
  iconSize?: number;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
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
      {title && <AppText style={[styles.title, textStyle]}>{title}</AppText>}
    </TouchableOpacity>
  );
};

export default AppButton;
