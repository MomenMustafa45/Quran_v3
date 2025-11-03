import { QuranJuzType } from '../../../../../database/types/qraunJuz';
import { QuranSuraType } from '../../../../../database/types/quranSuras';
import { SoundType } from '../../../../../store/slices/pageSlice';
import { QuranModalTypes } from '../../../hooks/useQuranModals';
import { soundTypeWord } from '../Header';

type HeaderBtnsParamsType = {
  currentPage: number;
  sura: { result: QuranSuraType | null };
  juz: QuranJuzType | null;
  soundType: SoundType;
};

export const BUTTON_CONFIGS = [
  {
    id: 1,
    iconName: 'menu-book' as const,
    iconType: 'MaterialIcons' as const,
    modalType: QuranModalTypes.Page,
    getTitle: (params: HeaderBtnsParamsType) => params.currentPage.toString(),
  },
  {
    id: 2,
    iconName: 'note-text-outline' as const,
    iconType: 'MaterialCommunityIcons' as const,
    modalType: QuranModalTypes.Suras,
    getTitle: (params: HeaderBtnsParamsType) =>
      params.sura.result?.name_arabic || '',
  },
  {
    id: 3,
    iconName: 'layers-outline' as const,
    iconType: 'Ionicons' as const,
    modalType: QuranModalTypes.Juz,
    getTitle: (params: HeaderBtnsParamsType) =>
      params.juz?.juz_number.toString() || '',
  },
  {
    id: 4,
    iconName: 'sound' as const,
    iconType: 'AntDesign' as const,
    modalType: null,
    getTitle: (params: HeaderBtnsParamsType) => soundTypeWord[params.soundType],
  },
  {
    id: 5,
    iconName: 'search' as const,
    iconType: 'MaterialIcons' as const,
    modalType: QuranModalTypes.Search,
    getTitle: () => 'البحث',
  },
  {
    id: 6,
    iconName: 'setting' as const,
    iconType: 'AntDesign' as const,
    modalType: QuranModalTypes.Settings,
    getTitle: () => 'الإعدادات',
  },
];
