import React from 'react';
import { Text, TextProps } from 'react-native';
import { styles } from './styles';

const AppText = ({ children, style, ...rest }: TextProps) => {
  return (
    <Text {...rest} style={[styles.text, style]}>
      {children}
    </Text>
  );
};

export default AppText;
