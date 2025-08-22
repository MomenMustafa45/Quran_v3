import { I18nManager } from 'react-native';

const isRTL = I18nManager.isRTL;

export const getRTLPageNumber = (pageNumber: number) => {
  const pageNumberRLT = isRTL ? 604 - pageNumber : pageNumber + 1;

  return pageNumberRLT;
};
