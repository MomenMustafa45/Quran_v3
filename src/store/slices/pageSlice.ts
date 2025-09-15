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
}

const initialState: PageState = {
  currentPage: isRtl ? 604 : 1,
  soundType: 'word',
  soundColors: {
    wordTextColor: COLORS.calligraphyBlack,
    wordBgColor: COLORS.calligraphyBlack,
  },
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
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentPage, setSoundType, setSoundColors } =
  pageSlice.actions;

export default pageSlice.reducer;
