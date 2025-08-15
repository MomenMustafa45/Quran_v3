import { QuranJuzType } from '../../../database/types/qraunJuz';

export const getJuzByPage = (juzs: QuranJuzType[], page: number) => {
  let result = null;
  for (let i = 0; i < juzs.length; i++) {
    const juz = juzs[i];
    const endPage =
      i < juzs.length - 1 ? juzs[i + 1].page_number - 1 : Infinity;

    if (page >= juz.page_number && page <= endPage) {
      result = juz;
      break;
    }
  }

  return result;
};
