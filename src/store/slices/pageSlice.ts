import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { I18nManager } from 'react-native';

export type SoundType = 'word' | 'ayah';

const isRtl = I18nManager.isRTL;

export interface PageState {
  currentPage: number;
  soundType: SoundType;
}

const initialState: PageState = {
  currentPage: isRtl ? 604 : 1,
  soundType: 'word',
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
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentPage, setSoundType } = pageSlice.actions;

export default pageSlice.reducer;
