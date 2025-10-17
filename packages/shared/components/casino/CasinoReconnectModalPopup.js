import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { CasinoContext } from "../../contexts/CasinoContext";
import { isAdminRoute } from "../../utils/Constants";

function CasinoReconnectModalPopup({
  setShowCasinoReconnectModal,
  setSocketDisconnectModal,
  show,
}) {
  const idleTimeoutRef = useRef(null); // Use ref instead of state
  const IDLE_TIME_LIMIT = 60000; // 1 minute of inactivity
  const location = isAdminRoute ? '/admin' : '/';
  const { casino_socket, setTriggerSocket, triggerSocket } =
    useContext(CasinoContext);

  // Function to close the modal and reset the idle timer
  const handleReconnect = () => {
    setShowCasinoReconnectModal(false);
    setSocketDisconnectModal(false);
    // Check if socket exists and is disconnected
    if (casino_socket) {
      // Add connection event listeners
      const handleConnect = () => {
        setTriggerSocket({ ...triggerSocket, casino: true });

        console.log("Casino socket reconnected successfully");
        casino_socket.off("connect", handleConnect);
        casino_socket.off("connect_error", handleConnectError);
      };

      const handleConnectError = (error) => {
        console.error("Casino socket reconnection failed:", error);
        casino_socket.off("connect", handleConnect);
        casino_socket.off("connect_error", handleConnectError);
      };

      casino_socket.on("connect", handleConnect);
      casino_socket.on("connect_error", handleConnectError);

      if (casino_socket.disconnected) {
        // If socket is disconnected, try to reconnect
        casino_socket.connect();
        console.log("Attempting to reconnect casino socket...");
      } else {
        // If socket is still connected, disconnect first then reconnect
        casino_socket.disconnect();
        setTimeout(() => {
          casino_socket.connect();
          console.log("Reconnecting casino socket after disconnect...");
        }, 100);
      }
    } else {
      console.error("Casino socket not available for reconnection");
    }

    resetIdleTimer();
  };

  // Function to reset the idle timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    // Set a new timer
    idleTimeoutRef.current = setTimeout(() => {
      setSocketDisconnectModal(true);
      setShowCasinoReconnectModal(true);
    }, IDLE_TIME_LIMIT);
  }, [setSocketDisconnectModal, setShowCasinoReconnectModal]);

  // Function to detect activity and reset timer
  const handleActivity = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Set up event listeners for mouse and keyboard activity
  useEffect(() => {
    // Reset the timer when the user interacts with the page
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    // Set an initial idle timer
    resetIdleTimer();

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [handleActivity, resetIdleTimer]);

  useEffect(() => {
    if (show) {
      setTriggerSocket({ ...triggerSocket, casino: false });
    }
  }, [show]);

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Body className="p-0">
        <div className="disconnected-message">
          <div className="text-center">
            <FontAwesomeIcon
              height="200px"
              icon={faExclamationTriangle}
              className="me-2 fw-bold text-warning"
            />
            <b>Disconnection due to inactivity</b>
          </div>
          <div className="mt-3 text-center">
            Are you there? You have been disconnected. Please go back to home or
            start playing again.
          </div>
          <div className="disconnected-buttons mt-3 text-center">
            <Button variant="outline-primary" onClick={handleReconnect}>
              Reconnect
            </Button>
            <Button variant="outline-danger" href={location}>
              Home
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CasinoReconnectModalPopup;
