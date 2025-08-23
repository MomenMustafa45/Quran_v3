import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { styles } from './styles';
import { COLORS } from '../../constants/colors'; // adjust path

type AppInputProps = TextInputProps;
const AppInput = ({ style, ...props }: AppInputProps) => {
  return (
    <TextInput
      {...props}
      style={[styles.input, style]}
      placeholderTextColor={COLORS.mutedOlive}
    />
  );
};

export default AppInput;
