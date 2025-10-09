import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { I18nManager } from 'react-native';
import { COLORS } from '../../constants/colors';

export type SoundType = 'word' | 'ayah' | 'page';

export type SoundColorsType = {
  wordTextColor: string;
  wordBgColor: string;
};

const isRtl = I18nManager.isRTL;

export interface PageState {
  currentPage: number;
  soundType: SoundType;
  soundColors: SoundColorsType;
  wordFontSize: number;
}

const initialState: PageState = {
  currentPage: isRtl ? 604 : 1,
  soundType: 'word',
  soundColors: {
    wordTextColor: COLORS.white,
    wordBgColor: COLORS.goldAccent,
  },
  wordFontSize: 5,
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSoundType: (state, action: PayloadAction<SoundType>) => {
      state.soundType = action.payload;
    },
    setSoundColors: (state, action: PayloadAction<SoundColorsType>) => {
      state.soundColors = { ...state.soundColors, ...action.payload };
    },
    setWordFontSize: (state, action: PayloadAction<number>) => {
      state.wordFontSize = action.payload;
    },
  },
});

export const { setCurrentPage, setSoundType, setSoundColors, setWordFontSize } =
  pageSlice.actions;

export default pageSlice.reducer;
