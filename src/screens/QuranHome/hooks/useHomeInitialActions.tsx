import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { getItem } from '../../../../storage';
import {
  setIsDarkMode,
  setWordFontSize,
} from '../../../store/slices/pageSlice';
import { useAppDispatch } from '../../../store/hooks/storeHooks';
import { QuranSuraType } from '../../../database/types/quranSuras';
import { QuranJuzType } from '../../../database/types/qraunJuz';
import BootSplash from 'react-native-bootsplash';
import { getSuras } from '../../../database/getSuras';
import { getJuzs } from '../../../database/getJuzs';
import { cleanupLegacyFontCopies } from '../../../utils/loadFont';

type UseHomeInitialActionsProps = {
  scrollToIndex: (pageNumber: number) => void;
};

const useHomeInitialActions = ({
  scrollToIndex,
}: UseHomeInitialActionsProps) => {
  const [suras, setSuras] = useState<QuranSuraType[]>([]);
  const [juzs, setJuzs] = useState<QuranJuzType[]>([]);

  const dispatch = useAppDispatch();

  const getSavedPaged = useCallback(() => {
    const savedPage = getItem(STORAGE_KEYS.CURRENT_PAGE);
    scrollToIndex(Number(savedPage) || 1);
  }, [scrollToIndex]);

  const getSavedPageSettings = useCallback(() => {
    const fontSizeWord = getItem(STORAGE_KEYS.WORD_FONT_SIZE);
    const isDarkMode = getItem(STORAGE_KEYS.IS_DARK_MODE);
    if (fontSizeWord !== null) {
      dispatch(setWordFontSize(Number(fontSizeWord)));
    }
    if (isDarkMode !== null) {
      dispatch(setIsDarkMode(Boolean(isDarkMode)));
    }
  }, [dispatch]);

  useLayoutEffect(() => {
    getSavedPageSettings();
    BootSplash.hide({ fade: true });
  }, [getSavedPageSettings]);

  useEffect(() => {
    let cancelled = false;

    const idleHandle = requestIdleCallback(async () => {
      try {
        const [surasData, juzsData] = await Promise.all([
          getSuras(),
          getJuzs(),
        ]);
        if (cancelled) return;
        setSuras(surasData);
        setJuzs(juzsData);
        cleanupLegacyFontCopies();
      } catch (error) {
        console.log('🚀 ~ loadMenuMetadata ~ error:', error);
      }
    });

    return () => {
      cancelled = true;
      cancelIdleCallback(idleHandle);
    };
  }, []);

  useEffect(() => {
    getSavedPaged();
  }, [getSavedPaged]);

  return { suras, juzs };
};

export default useHomeInitialActions;
