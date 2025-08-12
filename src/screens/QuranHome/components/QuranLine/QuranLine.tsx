import React from 'react';
import { View, StyleSheet } from 'react-native';
import QuranWord from '../QuranWord/QuranWord';
import { QuranLineType } from '../../../../types/quranLine';
import { QuranWordType } from '../../../../types/quranWord';

type QuranLineProps = {
  line: {
    line: QuranLineType;
    words: QuranWordType[];
  };
};

export default function QuranLine({ line }: QuranLineProps) {
  console.log('🚀 ~ QuranLine ~ line:', line);
  const centerLine = line.line.is_centered === 1 ? 'center' : 'space-between';

  return (
    <View style={[styles.line, { justifyContent: centerLine }]}>
      {line.words.map(word => (
        <QuranWord key={word.word_id} word={word} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row-reverse',
    marginBottom: 4,
  },
});
