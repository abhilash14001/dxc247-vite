import { SportsContext } from "../../contexts/SportsContext";
import { useRef, useState, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { checkBetPlace, getCurrentToken } from "../../utils/Constants";
import { AuthContext } from "../../contexts/AuthContext";
// AdminAuthProvider functionality is now integrated into AuthProvider

export const SportsProvider = (props) => {
  const [stakeshowModal, setStakeShowModal] = useState(false);
  const [popupDisplay, setPopupDisplay] = useState(false);
  const [popupDisplayForDesktop, setPopupDisplayForDesktop] = useState(false);
  const runnerRowDefault = useRef("");
  const rootClassDefault = useRef("");
  const oddsk = useRef(null);

  const [globalMname, setGlobalMname] = useState("");
  const [betType, setBetType] = useState("ODDS");
  const [triggerBetPlace, setTriggerBetPlace] = useState(false);

  const [triggerSocket, setTriggerSocket] = useState(false);
  const [triggerSocketScoreboard, setTriggerSocketScoreboard] = useState(false);
  const loss = useRef(0);
  const profitData = useRef(0);

  const globalUpdatePlacingBets = useRef(null);
  const profit = useRef(0);
  const [betTypeFromArray, setBetTypeFromArray] = useState("match_odds");

  const [showLoader, setShowLoader] = useState(true);

  const betPlaceStatus = useRef({}); // State for checkBetPlace results
  const stakeValue = useRef(null);
  const [placingBets, setPlacingBets] = useState([]);

  const [sportsSocketScoreboard, setSportsSocketScoreboard] = useState(null);

  const clearAllSelection = (setOdds) => {
    stakeValue.current.value = 0;
    setOdds(0);
    profit.current = 0;
    loss.current = 0;
  };
  const defaultTeamDatasCalculation = (
    sportList,
    setOddsTeamData,
    setBookmakerTeamData,
    setTiedMatchData = null,
    setBookmaker2TeamData = null
  ) => {
    const bettt = ["ODDS", "BOOKMAKER", "BOOKMAKER2", "TIED_MATCH", "cup"];

    bettt.forEach((value, key) => {
      // Map bet types to their actual data keys that match .mname values
      const betTypeToDataKey = {
        ODDS: "match_odds",
        BOOKMAKER: "bookmaker",
        BOOKMAKER2: "bookmaker2",
        // BOOKMAKER2: "bookmaker 2",
        cup: "cup",
        TIED_MATCH: "tied match",
      };

      const actualDataKey = betTypeToDataKey[value] || value;

      const storageKey = `exByTeamName_${actualDataKey}_${sportList.id}`;
      const storedData = localStorage.getItem(storageKey);
      const arrayjson = storedData ? JSON.parse(storedData) : {};

      switch (value) {
        case "ODDS":
          if (Object.keys(arrayjson).length > 0) {
            setOddsTeamData(arrayjson);
          }

          break;

        case "BOOKMAKER":
        case "cup":
          if (Object.keys(arrayjson).length > 0) {
            setBookmakerTeamData(arrayjson);
          }

          break;

        case "BOOKMAKER2":
          if (Object.keys(arrayjson).length > 0) {

            
            setBookmaker2TeamData(arrayjson);
          }

          break;

        default:
          if (setTiedMatchData !== null) {
            setTiedMatchData(arrayjson);

            break;
          }
      }
    });
  };

  const defaultNavProps = { active: false, list: {} };
  const [navLinks, setNavLinks] = useState({
    Cricket: { ...defaultNavProps, canonical_name: "cricket" },
    Football: { ...defaultNavProps, canonical_name: "soccer" },
    Tennis: { ...defaultNavProps, canonical_name: "tennis" },
    "Table Tennis": defaultNavProps,
    Basketball: defaultNavProps,
    Volleyball: defaultNavProps,
    Snooker: defaultNavProps,
    Handball: defaultNavProps,
    "Ice Hockey": defaultNavProps,
    "E Games": defaultNavProps,
    Futsal: defaultNavProps,
    Kabaddi: defaultNavProps,
    Golf: defaultNavProps,
    "Rugby League": defaultNavProps,
    Boxing: defaultNavProps,
    "Beach Volleyball": defaultNavProps,
    "Mixed Martial Arts": defaultNavProps,
    MotoGP: defaultNavProps,
    Chess: defaultNavProps,
    Badminton: defaultNavProps,
    Cycling: defaultNavProps,
    Motorbikes: defaultNavProps,
    Athletics: defaultNavProps,
    "Basketball 3X3": defaultNavProps,
    Sumo: defaultNavProps,
    "Virtual sports": defaultNavProps,
    "Motor Sports": defaultNavProps,
    Baseball: defaultNavProps,
    "Rugby Union": defaultNavProps,
    Darts: defaultNavProps,
    "American Football": defaultNavProps,
    Soccer: defaultNavProps,
    Esports: defaultNavProps,
  });

  const activeLink = (match_name) => {
    setNavLinks((prevState) => {
      return {
        ...prevState,
        [match_name]: {
          ...prevState[match_name],
          active: !prevState[match_name]?.active,
        },
      };
    });
  };

  const betPlaceStatusCheck = (sportList, data, teamname = null) => {
    const fetchAllBetPlaceStatus = async () => {
      if (data && teamname === null) {
        const sections = [];
        // Handle both array and object data types
        if (Array.isArray(data)) {
          // If data is an array, extract sections from it
          if (data["normal"] !== undefined && data["normal"].section) {
            sections.push(...data["normal"].section);
          }
          if (
            data["over by over"] !== undefined &&
            data["over by over"].section
          ) {
            sections.push(...data["over by over"].section);
          }
        } else if (typeof data === "object" && data !== null) {
          // If data is an object, extract sections from object properties
          if (data.normal !== undefined && data.normal.section) {
            sections.push(...data.normal.section);
          }
          if (
            data["over by over"] !== undefined &&
            data["over by over"].section
          ) {
            sections.push(...data["over by over"].section);
          }
          // Handle other potential section types
          if (data['ball by ball'] !== undefined && data['ball by ball'].section) {
            sections.push(...data['ball by ball'].section);
          }


          
          // if (data.meter !== undefined && data.meter.section) {
          //     sections.push(...data.meter.section);
          // }

          if (data.khado !== undefined && data.khado.section) {
            sections.push(...data.khado.section);
          }

          if (data.fancy1 !== undefined && data.fancy1.section) {
            sections.push(...data.fancy1.section);
          }
        }

        if (sections.length > 0) {
          // Extract unique team names
          const teamNames = [...new Set(sections.map(oddsArr => oddsArr.nat))];
          
          try {
            // Single API call for all teams using existing bet_check endpoint
            const bulkBetPlace = await checkBetPlace(teamNames, sportList.id);
            
            if (bulkBetPlace && bulkBetPlace.data) {
              // Backend returns data directly in response.data
              betPlaceStatus.current = bulkBetPlace?.data?.data?.data || bulkBetPlace?.data?.data || bulkBetPlace?.data || bulkBetPlace || {};
              
            } else {
              
              
              // Fallback to individual calls if bulk API fails
              const betStatuses = await Promise.all(
                sections.map(async (oddsArr) => {
                  const betPlace = await checkBetPlace(oddsArr.nat, sportList.id);
                  return { teamName: oddsArr.nat, status: betPlace.data };
                })
              );

              betPlaceStatus.current = betStatuses.reduce((acc, item) => {
                acc[item.teamName] = item.status;
                return acc;
              }, {});
            }
          } catch (error) {
            console.error("❌ Error in bulk bet check:", error);
            // Fallback to individual calls
            const betStatuses = await Promise.all(
              sections.map(async (oddsArr) => {
                const betPlace = await checkBetPlace(oddsArr.nat, sportList.id);
                return { teamName: oddsArr.nat, status: betPlace.data };
              })
            );

            betPlaceStatus.current = betStatuses.reduce((acc, item) => {
              acc[item.teamName] = item.status;
              return acc;
            }, {});
          }
        }
      } else if (data && teamname !== null) {
        const betPlace = await checkBetPlace(teamname, sportList.id);
        betPlaceStatus.current[teamname] = betPlace.data;
      }
    };
    fetchAllBetPlaceStatus();
    return betPlaceStatus;
  };

  // Use isLoggedIn from AuthContext, with admin fallback
  const authContext = useContext(AuthContext);
  const { isLoggedIn, isAuthenticated, isAdminRoute } = authContext || {};

  // Use isAuthenticated as fallback for isLoggedIn if available
  const loginStatus = getCurrentToken();
  const [sportsSocketRef, setSportsSocketRef] = useState(null);
  useEffect(() => {
    if (loginStatus && !sportsSocketRef && triggerSocket) {
      setSportsSocketRef(io(import.meta.env.VITE_CRICKET_WEBSOCKET_URL));
      setTriggerSocket(false);
    }
    if (!sportsSocketScoreboard && triggerSocketScoreboard) {
      const newScoreboardSocket = io(import.meta.env.VITE_SCORE_WEBSOCKET_URL);
      setSportsSocketScoreboard(newScoreboardSocket);
      setTriggerSocketScoreboard(false);
    }

    if (!loginStatus && sportsSocketRef) {
      sportsSocketRef.disconnect();
      setSportsSocketRef(null);
    }
  }, [
    loginStatus,
    triggerSocket,
    triggerSocketScoreboard,
    sportsSocketRef,
    sportsSocketScoreboard,
  ]);

  // Listen for disconnect all sockets event (for 401 errors)
  useEffect(() => {
    const handleDisconnectAllSockets = () => {
      if (sportsSocketRef) {
        sportsSocketRef.disconnect();
        setSportsSocketRef(null);
      }
      if (sportsSocketScoreboard) {
        sportsSocketScoreboard.disconnect();
        setSportsSocketScoreboard(null);
      }
    };

    window.addEventListener("disconnectAllSockets", handleDisconnectAllSockets);

    return () => {
      window.removeEventListener(
        "disconnectAllSockets",
        handleDisconnectAllSockets
      );
    };
  }, [sportsSocketRef, sportsSocketScoreboard]);

  const [stakeValues, setStakeValues] = useState({});

  return (
    <SportsContext.Provider
      value={{
        betPlaceStatusCheck,
        popupDisplayForDesktop,
        setPopupDisplayForDesktop,
        showLoader,
        setShowLoader,
        betTypeFromArray,
        setBetTypeFromArray,
        betPlaceStatus,
        defaultTeamDatasCalculation,
        sports_socket: sportsSocketRef,
        betType,
        setSportsSocketRef,
        triggerBetPlace,
        setTriggerBetPlace,
        setBetType,
        popupDisplay,
        setPopupDisplay,
        runnerRowDefault,
        rootClassDefault,
        oddsk,
        activeLink,
        navLinks,
        setNavLinks,
        stakeValue,
        stakeValues,
        setStakeValues,
        setStakeShowModal,
        stakeshowModal,
        loss,
        profit,
        profitData,
        placingBets,
        setPlacingBets,
        globalUpdatePlacingBets,
        clearAllSelection,
        triggerSocket,
        setTriggerSocket,
        sportsSocketScoreboard,
        setSportsSocketScoreboard,
        triggerSocketScoreboard,
        setTriggerSocketScoreboard,
        globalMname,
        setGlobalMname,
      }}
    >
      {props.children}
    </SportsContext.Provider>
  );
};
