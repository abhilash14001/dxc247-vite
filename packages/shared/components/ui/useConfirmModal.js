import { useState } from 'react';

export const useConfirmModal = () => {
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    confirmText: 'Yes',
    cancelText: 'No',
    type: 'warning',
    onConfirm: null,
    onCancel: null
  });

  const showConfirm = (options) => {
    return new Promise((resolve) => {
      setModal({
        show: true,
        title: options.title || 'Confirm Action',
        message: options.message || 'Are you sure you want to proceed?',
        confirmText: options.confirmText || 'Yes',
        cancelText: options.cancelText || 'No',
        type: options.type || 'warning',
        onConfirm: () => {
          if (options.onConfirm) {
            options.onConfirm();
          }
          setModal(prev => ({ ...prev, show: false }));
          resolve(true);
        },
        onCancel: () => {
          if (options.onCancel) {
            options.onCancel();
          }
          setModal(prev => ({ ...prev, show: false }));
          resolve(false);
        }
      });
    });
  };

  const hideModal = () => {
    setModal(prev => ({ ...prev, show: false }));
  };

  return {
    modal,
    showConfirm,
    hideModal
  };
};
