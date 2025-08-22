import { useState, useCallback } from 'react';

export enum QuranModalTypes {
  Page = 'pageModal',
  Settings = 'settingsModal',
  Suras = 'surasModal',
  Juz = 'juzModal',
  Search = 'searchModal',
}
type ModalVisibility = Record<QuranModalTypes, boolean>;

const useQuranModals = () => {
  const [visibleModals, setVisibleModals] = useState<ModalVisibility>({
    [QuranModalTypes.Page]: false,
    [QuranModalTypes.Settings]: false,
    [QuranModalTypes.Suras]: false,
    [QuranModalTypes.Juz]: false,
    [QuranModalTypes.Search]: false,
  });

  const showModal = useCallback((key: QuranModalTypes) => {
    setVisibleModals(prev => ({ ...prev, [key]: true }));
  }, []);

  const hideModal = useCallback((key: QuranModalTypes) => {
    setVisibleModals(prev => ({ ...prev, [key]: false }));
  }, []);

  const hideAllModals = useCallback(() => {
    setVisibleModals({
      pageModal: false,
      settingsModal: false,
      surasModal: false,
      juzModal: false,
      searchModal: false,
    });
  }, []);

  return {
    ...visibleModals,
    showModal,
    hideModal,
    hideAllModals,
  };
};

export default useQuranModals;
