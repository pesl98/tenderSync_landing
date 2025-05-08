import { useState } from 'react';

export type ModalState = {
  isOpen: boolean;
  type: string | null;
  data?: any;
};

const useModal = (initialState: ModalState = { isOpen: false, type: null }) => {
  const [modalState, setModalState] = useState<ModalState>(initialState);

  const openModal = (type: string, data?: any) => {
    setModalState({
      isOpen: true,
      type,
      data,
    });
  };

  const closeModal = () => {
    setModalState({
      ...modalState,
      isOpen: false,
    });
  };

  const setModalData = (data: any) => {
    setModalState({
      ...modalState,
      data,
    });
  };

  return {
    modalState,
    openModal,
    closeModal,
    setModalData,
  };
};

export default useModal;