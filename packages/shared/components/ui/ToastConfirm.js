import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Modal, Button } from "react-bootstrap";

const ToastConfirm = ({
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
  type = "warning", // warning, danger, info
}) => {
  const getIcon = () => {
    switch (type) {
      case "danger":
        return "🗑️";
      case "info":
        return "ℹ️";
      case "warning":
      default:
        return "⚠️";
    }
  };

  const getVariant = () => {
    if (type === "danger") return "danger";
    if (type === "warning") return "warning";
    if (type === "info") return "info";
    return "primary";
  };

  const confirmModal = () => {
    // Create modal container
    const modalElement = document.createElement("div");
    modalElement.id = "toast-confirm-modal";
    document.body.appendChild(modalElement);

    const ModalContent = () => {
      const [show, setShow] = useState(true);

      useEffect(() => {
        const handleEscape = (e) => {
          if (e.key === "Escape") {
            handleCancel();
          }
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden"; // block background scroll

        return () => {
          document.removeEventListener("keydown", handleEscape);
          document.body.style.overflow = "unset";
        };
      }, []);

      const handleCancel = () => {
        setShow(false);
        onCancel?.();
      };

      const handleConfirm = () => {
        setShow(false);
        onConfirm?.();
      };

      return (
        <Modal
          show={show}
          onHide={handleCancel}
          centered
          backdrop="static"
          keyboard={true}
        >
          <Modal.Header>
            <Modal.Title>
              {getIcon()} {title}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>{message}</Modal.Body>

          <Modal.Footer>
            <Button variant={getVariant()} onClick={handleConfirm}>
              {confirmText}
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              {cancelText}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };

    // Cleanup
    const cleanup = () => {
      const modal = document.getElementById("toast-confirm-modal");
      if (modal) document.body.removeChild(modal);
    };

    // Render modal
    const root = createRoot(modalElement);
    root.render(<ModalContent />);

    return { cleanup };
  };

  return { show: confirmModal };
};

// Keep EXACT SAME EXPORT
export default ToastConfirm;

// Hook remains same
export const useToastConfirm = () => {
  const showConfirm = (options) => {
    return new Promise((resolve) => {
      let cleanupFunction = null;

      const { show } = ToastConfirm({
        ...options,
        onConfirm: () => {
          options.onConfirm?.();
          cleanupFunction?.();
          resolve(true);
        },
        onCancel: () => {
          options.onCancel?.();
          cleanupFunction?.();
          resolve(false);
        },
      });

      const result = show();
      cleanupFunction = result.cleanup;
    });
  };

  return { showConfirm };
};
