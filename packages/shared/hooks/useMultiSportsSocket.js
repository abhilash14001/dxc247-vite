import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { API_ENDPOINTS, isOnline, waitForOnline } from "../utils/networkUtils";
import encryptHybrid from "../utils/encryptHybrid";
import { decryptAndVerifyResponse } from "../utils/decryptAndVerifyResponse";

const SPORT_ARRAY = {
  soccer: 1,
  cricket: 4,
  tennis: 2,
  football: 1,
};

const useMultiSportsSocket = (sports, socketUrl = API_ENDPOINTS.SOCKET_URL) => {
  const socketRefs = useRef({});
  const reconnectAttempts = useRef({});
  const isInitialized = useRef(false);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  // Initialize reconnect attempts for each sport
  sports.forEach(sport => {
    if (!reconnectAttempts.current[sport]) {
      reconnectAttempts.current[sport] = 0;
    }
  });

  // Handle reconnection manually if needed
  const handleReconnection = async (sport) => {
    if (reconnectAttempts.current[sport] < maxReconnectAttempts) {
      reconnectAttempts.current[sport] += 1;
      console.log(`Attempting to reconnect ${sport}... (${reconnectAttempts.current[sport]}/${maxReconnectAttempts})`);

      if (!isOnline()) {
        console.log("Waiting for network connection...");
        const isBackOnline = await waitForOnline(30000); // Wait up to 30 seconds
        if (!isBackOnline) {
          console.error("Network still unavailable after 30 seconds");
          return;
        }
      }

      setTimeout(() => {
        if (socketRefs.current[sport]) {
          socketRefs.current[sport].disconnect();
          socketRefs.current[sport] = null;
        }
      }, reconnectDelay);
    } else {
      console.error(`Max reconnection attempts reached for ${sport}. Please check your internet connection.`);
    }
  };

  // Create socket connections for each sport - only once on mount
  useEffect(() => {
    if (!socketUrl || !sports || sports.length === 0 || isInitialized.current) return;

    console.log("Initializing multi-sports socket connections...");
    isInitialized.current = true;

    sports.forEach(sport => {
      // Only create socket if it doesn't exist
      if (!socketRefs.current[sport]) {
        console.log(`Creating socket connection for ${sport}`);
        
        const socket = io(socketUrl, {
          transports: ["websocket", "polling"],
          timeout: 20000,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          maxReconnectionAttempts: 5,
          forceNew: true,
        });

        socketRefs.current[sport] = socket;

        // Listen for incoming data
        socket.on("getListData", (userDatas) => {
          if (!userDatas) return;
          try {
            const parsedData = decryptAndVerifyResponse(userDatas);
            
            if (parsedData && Object.keys(parsedData).length > 0) {
              console.log(`📊 ${sport} socket received data:`, parsedData.data);
              // Emit custom event for this sport
              window.dispatchEvent(new CustomEvent(`sportData_${sport}`, { 
                detail: parsedData.data 
              }));
            }
          } catch (error) {
            console.error(`Error parsing ${sport} socket data:`, error);
            console.error("Failed data:", userDatas);
          }
        });

        // Handle disconnections
        socket.on("disconnect", (reason) => {
          console.log(`${sport} socket disconnected:`, reason);
          if (reason === "io server disconnect") {
            handleReconnection(sport);
          }
        });

        // Set purpose for this sport
        const payload = {
          type: "list",
          game: SPORT_ARRAY[sport],
          match_ids: sport,
        };

        const encryptedPayload = encryptHybrid(payload);
        socket.emit("setPurposeFor", encryptedPayload);
      }
    });

    // Cleanup on unmount
    return () => {
      console.log("Cleaning up multi-sports socket connections...");
      Object.keys(socketRefs.current).forEach(sport => {
        if (socketRefs.current[sport]) {
          console.log(`Disconnecting ${sport} socket on component unmount`);
          socketRefs.current[sport].disconnect();
          socketRefs.current[sport] = null;
        }
      });
      isInitialized.current = false;
    };
  }, [socketUrl]); // Only run when socketUrl changes, not when component re-renders

  return socketRefs.current;
};

export default useMultiSportsSocket;
