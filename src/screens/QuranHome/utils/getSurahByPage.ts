import { QuranSuraType } from '../../../database/types/quranSuras';

export const binarySearchSurah = (suras: QuranSuraType[], page: number) => {
  let left = 0;
  let right = suras.length - 1;
  let result = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const sura = suras[mid];
    const endPage =
      mid < suras.length - 1 ? suras[mid + 1].page_number - 1 : Infinity;

    if (page >= sura.page_number && page <= endPage) {
      result = sura;
      break;
    } else if (sura.page_number < page) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return { result };
};

// Linear search implementation
export const linearSearchSurah = (suras: QuranSuraType[], page: number) => {
  let result = null;

  for (let i = 0; i < suras.length; i++) {
    const sura = suras[i];
    const endPage =
      i < suras.length - 1 ? suras[i + 1].page_number - 1 : Infinity;

    if (page >= sura.page_number && page <= endPage) {
      result = sura;
      break;
    }
  }
  return { result };
};
