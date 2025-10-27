import { useState, useRef, useContext, useEffect } from "react";
import { CasinoContext } from "../../contexts/CasinoContext";
import { io } from "socket.io-client";
import {
  cardMap,
  cardMapInteger,
  getExBySingleTeamNameCasino,
  getExByTeamNameForCasino,
} from "../../utils/Constants";
import { useSelector } from "react-redux";
// AdminAuthProvider functionality is now integrated into AuthProvider

export const CasinoProvider = ({ isAdmin = false, ...props }) => {
  
  const [userBetData, setUserBetData] = useState(() => {
    const saved = localStorage.getItem("casino_userBetData");
    return saved ? JSON.parse(saved) : null;
  });
  const [mybetModel, setMybetModel] = useState([]);

  const rouletteStatistics = [
    [
      { C1st12: "1st12" },
      { C2nd12: "2nd12" },
      { C3rd12: "3rd12" },
    ],
    [
      { R1st: "1-34" },
      { R2nd: "2-35" },
      { R3rd: "3-36" },
    ],
    [
      { Red: "Red" },
      { Blk: "Black" },
    ],
    [
      { Odd: "Odd" },
      { Evn: "Even" },
    ],
    [
      { T01to18: "1to18" },
      { T19to36: "19to36" },
    ],
  ];
  const [shouldBlinkForRoulette, setShouldBlinkForRoulette] = useState(true);

  const [showMobilePopup, setShowMobilePopup] = useState(true);
  const [selectedTeenUniqueCards, setSelectedTeenUniqueCards] = useState([]);
  const [availableTeenUniqueCards, setAvailableTeenUniqueCards] = useState([]);
  const [selectedJoker, setSelectedJoker] = useState(null);
  const [triggerSocket, setTriggerSocket] = useState({
    casino: false,
    scoreboard: false,
  });

  const scoreBoardData = useRef(null);

  // New: Store multiple bets across different games
  const [userBets, setUserBets] = useState(() => {
    const saved = localStorage.getItem("casino_userBets");
    return saved ? JSON.parse(saved) : [];
  });

  // Helper functions for managing multiple bets
  const addUserBet = (betData) => {
    setUserBets((prevBets) => {
      // Check if bet already exists for this match_id and roundId
      const existingBetIndex = prevBets.findIndex(
        (bet) =>
          bet.match_id === betData.match_id && bet.roundId === betData.roundId
      );

      if (existingBetIndex >= 0) {
        // Update existing bet
        const updatedBets = [...prevBets];
        updatedBets[existingBetIndex] = {
          ...updatedBets[existingBetIndex],
          ...betData,
        };
        return updatedBets;
      } else {
        // Add new bet
        return [...prevBets, betData];
      }
    });
  };

  const removeUserBet = (match_id, roundId) => {
    setUserBets((prevBets) =>
      prevBets.filter(
        (bet) => !(bet.match_id === match_id && bet.roundId === roundId)
      )
    );
  };

  const updateUserBet = (match_id, roundId, updates) => {
    setUserBets((prevBets) =>
      prevBets.map((bet) =>
        bet.match_id === match_id && bet.roundId === roundId
          ? { ...bet, ...updates }
          : bet
      )
    );
  };

  // --- SOCKET CONNECTION ONLY AFTER LOGIN ---
  const isAdminRoute = isAdmin;
  const userLoginStatus = useSelector((state) => state.user?.token || false);
  const adminLoginStatus = useSelector((state) => state.admin?.token || false);
  const loginStatus = isAdminRoute ? adminLoginStatus : userLoginStatus;

  const [casinoSocket, setCasinoSocket] = useState(null);
  const [casinoSocketScoreboard, setCasinoSocketScoreboard] = useState(null);

  useEffect(() => {
    if (loginStatus) {
      // Create casino socket immediately when logged in
      if (!casinoSocket && triggerSocket.casino) {
        const newSocket = io(import.meta.env.VITE_CASINO_URL, {
          transports: ["websocket", "polling"],
          timeout: 20000,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          maxReconnectionAttempts: 5,
          forceNew: true,
        });

        // Add connection event listeners
        newSocket.on('connect', () => {
        });

        newSocket.on('disconnect', (reason) => {
        });

        newSocket.on('connect_error', (error) => {
          console.error('Casino socket connection error:', error);
        });

        setCasinoSocket(newSocket);
      }
    } else {
      // Disconnect sockets when logged out
      if (casinoSocket) {
        casinoSocket.disconnect();
        setCasinoSocket(null);
      }
    }

    if(!triggerSocket.casino && casinoSocket){
      casinoSocket.disconnect();
      setCasinoSocket(null);
    }
  }, [loginStatus, triggerSocket.casino, casinoSocket]);

  useEffect(() => {
    if (loginStatus) {
      // Create scoreboard socket immediately when logged in
      if (!casinoSocketScoreboard && triggerSocket.scoreboard) {
        const newScoreboardSocket = io(
          import.meta.env.VITE_SCORE_WEBSOCKET_URL,
          {
            transports: ["websocket", "polling"],
            timeout: 20000,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            maxReconnectionAttempts: 5,
            forceNew: true,
          }
        );

        // Add connection event listeners
        newScoreboardSocket.on('connect', () => {
        });

        newScoreboardSocket.on('disconnect', (reason) => {
        });

        newScoreboardSocket.on('connect_error', (error) => {
          console.error('Casino scoreboard socket connection error:', error);
        });

        setCasinoSocketScoreboard(newScoreboardSocket);
      }
        
    }
     else {
      if (casinoSocketScoreboard) {
        casinoSocketScoreboard.disconnect();
        setCasinoSocketScoreboard(null);
      }
    }
  }, [
    loginStatus,
    triggerSocket.scoreboard,
    casinoSocketScoreboard,
    casinoSocket,
  ]);

  // Listen for disconnect all sockets event (for 401 errors)
  useEffect(() => {
    const handleDisconnectAllSockets = () => {
      if (casinoSocket) {
        casinoSocket.disconnect();
        setCasinoSocket(null);
      }
      if (casinoSocketScoreboard) {
        casinoSocketScoreboard.disconnect();
        setCasinoSocketScoreboard(null);
      }
    };

    window.addEventListener('disconnectAllSockets', handleDisconnectAllSockets);
    
    return () => {
      window.removeEventListener('disconnectAllSockets', handleDisconnectAllSockets);
    };
  }, [casinoSocket, casinoSocketScoreboard]);

  // --- END SOCKET CONNECTION ---

  // Persist userBetData to localStorage
  useEffect(() => {
    localStorage.setItem("casino_userBetData", JSON.stringify(userBetData));
  }, [userBetData]);

  // Persist userBets to localStorage
  useEffect(() => {
    localStorage.setItem("casino_userBets", JSON.stringify(userBets));
  }, [userBets]);
  const [betType, setBetType] = useState("ODDS");
  const [popupDisplay, setPopupDisplay] = useState(false);

  const fetchDataDragonTiger = async (
    data,
    sportList,
    match_id,
    roundId,
    TOTALPLAYERS,
    setTotalPlayers
  ) => {
    if (data?.sub && sportList?.id) {
      try {
        // Fetch data once for all teams
        const result = await getExBySingleTeamNameCasino(
          sportList.id,
          roundId,
          "",
          match_id,
          ""
        );
        // ... handle result as needed ...
      } catch (e) {
        // ... handle error ...
      }
    }
  };

  const fetchDataDragonTigerDt6 = async (
    data,
    sportList,
    match_id,
    roundId,
    TOTALPLAYERS,
    setTotalPlayers,
    betType,
    what_to_fetch = "all"
  ) => {
    if (data?.sub && sportList?.id) {
      try {
        const promises = [];
        const entities = ["Dragon", "Tiger"]; // Include Pair in the entities

        // Fetch odds for Dragon, Tiger, and Pair
        entities.forEach((entity) => {
          promises.push(
            getExByTeamNameForCasino(
              sportList.id,
              roundId,
              entity,
              match_id,
              "ODDS"
            )
          );
        });

        // Fetch results for all entities including Pair
        promises.push(
          getExBySingleTeamNameCasino(sportList.id, roundId, "", match_id, "")
        );

        const results = await Promise.all(promises);
        const updatedPlayers = { ...TOTALPLAYERS };

        // Calculate starting indices for Dragon, Tiger, and Pair
        let oddsIndex = 0;
        const startIndex = results.length - 1; // Start index for the combined results

        entities.forEach((entity, index) => {
          updatedPlayers[entity] = {
            ...TOTALPLAYERS[entity],
            amounts: results[oddsIndex]?.data || "",

            Even: {
              ...TOTALPLAYERS[entity].Even,
              amounts:
                results[startIndex]?.data.filter(
                  (item) =>
                    item.type === `${entity.charAt(0)}_EVEN_ODD` &&
                    item.team_name === `${entity} Even`
                )[0]?.total_amount || "",
            },
            Odd: {
              ...TOTALPLAYERS[entity].Odd,
              amounts:
                results[startIndex]?.data.filter(
                  (item) =>
                    item.type === `${entity.charAt(0)}_EVEN_ODD` &&
                    item.team_name === `${entity} Odd`
                )[0]?.total_amount || "",
            },
            Black: {
              ...TOTALPLAYERS[entity].Black,
              amounts:
                results[startIndex]?.data.filter(
                  (item) =>
                    item.type === `${entity.charAt(0)}_RED_BLACK` &&
                    item.team_name === `${entity} Black`
                )[0]?.total_amount || "",
            },
            Red: {
              ...TOTALPLAYERS[entity].Red,
              amounts:
                results[startIndex]?.data.filter(
                  (item) =>
                    item.type === `${entity.charAt(0)}_RED_BLACK` &&
                    item.team_name === `${entity} Red`
                )[0]?.total_amount || "",
            },
            Spade: {
              ...TOTALPLAYERS[entity].Spade,
              amounts:
                results[startIndex]?.data.filter(
                  (item) =>
                    item.type === `${entity.charAt(0)}_COLOR` &&
                    item.team_name === `${entity} Spade`
                )[0]?.total_amount || "",
            },
            Heart: {
              ...TOTALPLAYERS[entity].Heart,
              amounts:
                results[startIndex]?.data.filter(
                  (item) =>
                    item.type === `${entity.charAt(0)}_COLOR` &&
                    item.team_name === `${entity} Heart`
                )[0]?.total_amount || "",
            },
            Club: {
              ...TOTALPLAYERS[entity].Club,
              amounts:
                results[startIndex]?.data.filter(
                  (item) =>
                    item.type === `${entity.charAt(0)}_COLOR` &&
                    item.team_name === `${entity} Club`
                )[0]?.total_amount || "",
            },
            Diamond: {
              ...TOTALPLAYERS[entity].Diamond,
              amounts:
                results[startIndex]?.data.filter(
                  (item) =>
                    item.type === `${entity.charAt(0)}_COLOR` &&
                    item.team_name === `${entity} Diamond`
                )[0]?.total_amount || "",
            },
          };
          oddsIndex++;
        });
        updatedPlayers["Pair"] = {
          ...TOTALPLAYERS.Pair,
          amounts:
            results[2]?.data.filter(
              (item) => item.type === "PAIR" && item.team_name === "Pair"
            )[0]?.total_amount || "",
        };

        setTotalPlayers(updatedPlayers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const getCardTotalCard32 = (cards, playerNumber) => {
    return cards && cards.length > 0
      ? cards.reduce((acc, value, index) => {
          return (
            acc +
            (index === 0 ? parseInt(playerNumber) : 0) +
            parseInt(cardMapInteger(value))
          );
        }, 0)
      : null;
  };

  const updateCardsForCard32Casino = (
    data,
    totalPlayers,
    setTotalPlayers,
    index = null,
    type = null
  ) => {
    let cardArray;

    if (data.card) {
      cardArray = data?.card?.split(",").map((item) => item.trim());
      let j = 0;

      if (index === null) {
        Object.keys(totalPlayers).forEach((key) => {
          const playerNumber = key.split(" ")[1].trim();

          let player8cards = [];
          for (var i = j; i <= 35; i += 4) {
            if (cardArray[i] !== "1") {
              if (!player8cards.includes(cardArray[i])) {
                player8cards.push(cardArray[i]);
              }

              setTotalPlayers((prevState) => {
                const playerCardUpdates = { ...prevState };
                playerCardUpdates[key] = {
                  ...playerCardUpdates[key],
                  cards: player8cards.map(
                    (value) => import.meta.env.VITE_CARD_PATH + value + ".png"
                  ),
                  card_number: getCardTotalCard32(player8cards, playerNumber),
                };

                return playerCardUpdates;
              });
            }
          }

          if (player8cards.length === 0) {
            setTimeout(function () {
              setTotalPlayers((prevState) => {
                const playerCardUpdates = { ...prevState };
                playerCardUpdates[key] = {
                  ...playerCardUpdates[key],
                  cards: [],
                  card_number: null,
                };

                return playerCardUpdates;
              });
            }, 700);
          }

          j++;
        });
      } else {
        Object.keys(totalPlayers[index][type]).forEach((key) => {
          const playerNumber = key.split(" ")[1].trim();

          let player8cards = [];
          for (var i = j; i <= 35; i += 4) {
            if (cardArray[i] !== "1") {
              if (!player8cards.includes(cardArray[i])) {
                player8cards.push(cardArray[i]);
              }

              setTotalPlayers((prevState) => {
                const playerCardUpdates = [...prevState]; // copy array
                const playerInfo = playerCardUpdates[index][type];
                playerInfo[key] = {
                  ...playerInfo[key],
                  cards: player8cards.map(
                    (value) => import.meta.env.VITE_CARD_PATH + value + ".png"
                  ),
                  card_number: getCardTotalCard32(player8cards, playerNumber),
                };

                return playerCardUpdates; // return updated state
              });
            }
          }

          if (player8cards.length === 0) {
            setTimeout(function () {
              setTotalPlayers((prevState) => {
                const playerCardUpdates = [...prevState]; // copy array
                const playerInfo = playerCardUpdates[index][type];
                playerInfo[key] = {
                  ...playerInfo[key],
                  cards: [],
                  card_number: null,
                };

                return playerCardUpdates; // return updated state
              });
            }, 700);
          }

          j++;
        });
      }
    }
  };
  const getAndarBaharCalculation = async (
    id,
    roundId,
    match_id,
    setTotalPlayers
  ) => {
    const promises = [
      getExBySingleTeamNameCasino(
        id,
        roundId,
        "",
        match_id.toUpperCase(),
        "ANDAR"
      ),
      getExBySingleTeamNameCasino(
        id,
        roundId,
        "",
        match_id.toUpperCase(),
        "BAHAR"
      ),
    ];
    const results = await Promise.all(promises);

    setTotalPlayers((prevState) => {
      const defaultPlayers = [...prevState];

      defaultPlayers.forEach((value, key) => {
        const playerKey = Object.keys(value)[0]; // Get the key ("Andar" or "Bahar")
        const amounts = { ...defaultPlayers[key][playerKey].amounts }; // Clone amounts

        if (results?.[key] && results?.[key]?.data) {
          results[key].data.forEach((item) => {
            let teamName = item.team_name.trim(); // Normalize the team name (remove any extra spaces)
            if (teamName.includes("/")) {
              teamName = teamName.split("/")[0];
            }
            if (amounts.hasOwnProperty(teamName)) {
              amounts[teamName] = item.total_amount; // Update the amount
            }
          });
        }

        if (results[key].data.length === 0) {
          // Reset all amounts to 0
          Object.keys(amounts).forEach((teamName) => {
            amounts[teamName] = "";
          });
        }

        defaultPlayers[key][playerKey] = {
          ...defaultPlayers[key][playerKey],
          amounts: amounts, // Assign the updated amounts
        };
      });

      return defaultPlayers;
    });
  };

  return (
    <CasinoContext.Provider
      value={{
        casino_socket: casinoSocket,
        casino_socket_scoreboard: casinoSocketScoreboard,
        mybetModel,
        setMybetModel,
        getAndarBaharCalculation,
        getCardTotalCard32,
        updateCardsForCard32Casino,

        fetchDataDragonTigerDt6,
        fetchDataDragonTiger,
        betType,
        setBetType,
        popupDisplay,
        setPopupDisplay,
        setCasinoSocket,
        userBetData,
        setUserBetData,
        triggerSocket,
        setTriggerSocket,
        userBets,
        addUserBet,
        removeUserBet,
        updateUserBet,
        scoreBoardData,
        showMobilePopup,
        setShowMobilePopup,
        selectedTeenUniqueCards,
        setSelectedTeenUniqueCards,
        availableTeenUniqueCards,
        setAvailableTeenUniqueCards,
        selectedJoker,
        setSelectedJoker,
        rouletteStatistics,
        shouldBlinkForRoulette,
        setShouldBlinkForRoulette,
      }}
    >
      {props.children}
    </CasinoContext.Provider>
  );
};
