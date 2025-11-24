import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Buffer } from "buffer";
import { useContext } from "react";
import { SportsContext } from "../contexts/SportsContext";
import { CasinoContext } from "../contexts/CasinoContext";
import { API_ENDPOINTS, isOnline, waitForOnline } from "../utils/networkUtils";
import encryptHybrid from "../utils/encryptHybrid";
import { decryptAndVerifyResponse } from "../utils/decryptAndVerifyResponse";

const SPORT_ARRAY = {
  soccer: 1,
  cricket: 4,
  tennis: 2,
  football: 1,
};

const useSocketConnection = (matchesData, setListData, socketUrl = API_ENDPOINTS.SOCKET_URL) => {
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const { sports_socket, setSportsSocketRef } = useContext(SportsContext);
  const { casino_socket, setCasinoSocket } = useContext(CasinoContext);

  // Handle reconnection manually if needed
  const handleReconnection = async () => {
    
    if (reconnectAttempts.current < maxReconnectAttempts) {
      reconnectAttempts.current += 1;

      if (!isOnline()) {
        const isBackOnline = await waitForOnline(30000); // Wait up to 30 seconds
        if (!isBackOnline) {
          console.error("Network still unavailable after 30 seconds");
          return;
        }
      }

      setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      }, reconnectDelay);
    } else {
      console.error("Max reconnection attempts reached. Please check your internet connection.");
    }
  };

  // Initialize socket connection once (only when socketUrl changes)
  useEffect(() => {
    
    if (!socketUrl) return;

    // Disconnect old sockets
    if (sports_socket) {
      sports_socket.disconnect();
      setSportsSocketRef(null);
    }
    if (casino_socket) {
      casino_socket.disconnect();
      setCasinoSocket(null);
    }

    // Create new socket only if none exists
    if (!socketRef.current) {
      
      const socket = io(socketUrl, {
        transports: ["websocket", "polling"],
        timeout: 20000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 5,
        forceNew: true,
      });

      socketRef.current = socket;

      // Listen for incoming data
      socket.on("getListData", (userDatas) => {
        
        if (!userDatas) return;
        try {
          
          const parsedData = decryptAndVerifyResponse(userDatas);
          
          if (parsedData && Object.keys(parsedData).length > 0) {
            
             
            
            setListData(parsedData.data);
          }
        } catch (error) {
          console.error("Error parsing socket data:", error);
          console.error("Failed data:", userDatas);
        }
      });

      // Handle disconnections
      socket.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
          handleReconnection();
        }
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
    
  }, [socketUrl, matchesData]); // Only run when socketUrl changes

  // Update socket purpose if matchesData changes
  useEffect(() => {
    if (socketRef.current && matchesData) {
      
      const payload = {
        type: "list",
        game: SPORT_ARRAY[matchesData],
        match_ids: matchesData,
      };

      const encryptedPayload = encryptHybrid(payload);

      socketRef.current.emit("setPurposeFor", encryptedPayload);
    }
    
    
  }, [matchesData]);

  return socketRef;
};

export default useSocketConnection;
