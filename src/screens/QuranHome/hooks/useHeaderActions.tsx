import { useCallback, useEffect } from 'react';
import { QuranJuzType } from '../../../database/types/qraunJuz';
import { QuranSuraType } from '../../../database/types/quranSuras';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../store/hooks/storeHooks';
import { getJuzByPage } from '../utils/getJuzByPage';
import { linearSearchSurah } from '../utils/getSurahByPage';
import { setSoundType, SoundType } from '../../../store/slices/pageSlice';
import { getItem, setItem } from '../../../../storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

type UseHeaderActionsProps = {
  suras: QuranSuraType[];
  juzs: QuranJuzType[];
};

const soundTypes: Array<'word' | 'ayah' | 'page'> = ['word', 'ayah', 'page'];

const useHeaderActions = ({ suras, juzs }: UseHeaderActionsProps) => {
  const currentPage = useAppSelector(state => state.page.currentPage);
  const soundType = useAppSelector(state => state.page.soundType);
  const dispatch = useAppDispatch();

  const sura = linearSearchSurah(suras, currentPage);
  const juz = getJuzByPage(juzs, currentPage);

  const switchSoundTypeHandler = useCallback(() => {
    const currentIndex = soundTypes.indexOf(soundType);
    const nextIndex = (currentIndex + 1) % soundTypes.length;
    const switchedSoundType = soundTypes[nextIndex];

    setItem(STORAGE_KEYS.SOUND_TYPE, switchedSoundType);
    dispatch(setSoundType(switchedSoundType));
  }, [dispatch, soundType]);

  const getInitialSoundType = useCallback(() => {
    const storageSoundType = getItem(STORAGE_KEYS.SOUND_TYPE);
    if (storageSoundType) {
      dispatch(setSoundType(String(storageSoundType) as SoundType));
    }
  }, [dispatch]);

  useEffect(() => {
    getInitialSoundType();
  }, [getInitialSoundType]);

  return { sura, juz, soundType, switchSoundTypeHandler, currentPage };
};

export default useHeaderActions;
