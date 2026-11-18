import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import {
  getBooleanItem,
  getNumberItem,
  getStringItem,
} from '../../../../storage';
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
    const savedPage = getNumberItem(STORAGE_KEYS.CURRENT_PAGE);
    scrollToIndex(savedPage || 1);
  }, [scrollToIndex]);

  const getSavedPageSettings = useCallback(() => {
    // Font size is written as a string ("16.0") by SettingsModal.
    const fontSizeWord = Number(getStringItem(STORAGE_KEYS.WORD_FONT_SIZE));
    const isDarkMode = getBooleanItem(STORAGE_KEYS.IS_DARK_MODE);
    if (Number.isFinite(fontSizeWord) && fontSizeWord > 0) {
      dispatch(setWordFontSize(fontSizeWord));
    }
    if (isDarkMode !== undefined) {
      dispatch(setIsDarkMode(isDarkMode));
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
