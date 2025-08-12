import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { QuranWordType } from '../../../../types/quranWord';

type QuranWordProps = {
  word: QuranWordType;
};

export default function QuranWord({ word }: QuranWordProps) {
  const isArabicNumber = /^[\u0660-\u0669]+$/.test(String(word.text_uthmani));

  return (
    <Text style={[styles.word, isArabicNumber && styles.arabicNumber]}>
      {word.text_uthmani + ' '}
    </Text>
  );
}

const styles = StyleSheet.create({
  word: {
    fontSize: 18,
    writingDirection: 'rtl',
  },
  arabicNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    textAlign: 'center',
  },
});
