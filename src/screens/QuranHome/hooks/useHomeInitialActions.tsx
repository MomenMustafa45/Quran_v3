import { useCallback, useEffect, useRef, useState } from 'react';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { getItem } from '../../../../storage';
import {
  setCurrentPage,
  setIsDarkMode,
  setWordFontSize,
} from '../../../store/slices/pageSlice';
import { useAppDispatch } from '../../../store/hooks/storeHooks';
import { loadFont } from '../../../utils/loadFont';
import { QuranSuraType } from '../../../database/types/quranSuras';
import { QuranJuzType } from '../../../database/types/qraunJuz';
import BootSplash from 'react-native-bootsplash';
import { getSuras } from '../../../database/getSuras';
import { getJuzs } from '../../../database/getJuzs';

const useHomeInitialActions = () => {
  const [initialPage, setInitialPage] = useState<number | null>(null);
  const [suras, setSuras] = useState<QuranSuraType[]>([]);
  const [juzs, setJuzs] = useState<QuranJuzType[]>([]);
  const loadedFontRef = useRef<string>('');

  const dispatch = useAppDispatch();

  const getSavedPaged = useCallback(() => {
    const savedPage = getItem(STORAGE_KEYS.CURRENT_PAGE);
    if (savedPage) {
      dispatch(setCurrentPage(Number(savedPage)));
      setInitialPage(Number(savedPage) - 1);
    } else {
      setInitialPage(0);
    }
  }, [dispatch]);

  const getSavedPageSettings = useCallback(() => {
    const fontSizeWord = getItem(STORAGE_KEYS.WORD_FONT_SIZE);
    const isDarkMode = getItem(STORAGE_KEYS.IS_DARK_MODE);
    if (fontSizeWord) {
      dispatch(setWordFontSize(Number(fontSizeWord)));
    }
    if (isDarkMode) {
      dispatch(setIsDarkMode(Boolean(isDarkMode)));
    }
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      const font = await loadFont();
      loadedFontRef.current = font;

      const [surasData, juzsData] = await Promise.all([getSuras(), getJuzs()]);
      setSuras(surasData);
      setJuzs(juzsData);

      getSavedPaged();
      getSavedPageSettings();

      await BootSplash.hide({ fade: true });
    };
    init();
  }, [dispatch, getSavedPaged, getSavedPageSettings]);

  return { initialPage, suras, juzs, loadedFontRef };
};

export default useHomeInitialActions;
