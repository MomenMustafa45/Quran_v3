// QuranMenuItem.tsx
import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { styles } from './styles';
import AppText from '../AppText/AppText';

type Props = {
  onPress?: () => void;
  children: React.ReactNode;
};

const QuranMenuItem = ({ onPress, children }: Props) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.item}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

// --- Compound Parts (flexible) ---
QuranMenuItem.Page = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.itemBox}>
    <View style={styles.pageTextBox}>
      <AppText style={styles.pageText}>{children}</AppText>
    </View>
  </View>
);

QuranMenuItem.Surah = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.itemBox}>
    <View style={styles.surahTextBox}>
      <AppText style={styles.surahText}>{children}</AppText>
    </View>
  </View>
);

QuranMenuItem.Juz = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.itemBox}>
    <View style={styles.juzTextBox}>
      <AppText style={styles.juzText}>{children}</AppText>
    </View>
  </View>
);

// --- Flexible Header ---
QuranMenuItem.Header = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.headerContainer}>{children}</View>
);

QuranMenuItem.HeaderText = ({ children }: { children: React.ReactNode }) => (
  <AppText style={styles.headerText}>{children}</AppText>
);

export default QuranMenuItem;
