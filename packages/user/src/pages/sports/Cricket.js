import React, { useContext, useEffect, useRef, useState, Suspense, lazy } from "react";
import {
  getExByTeamNameForCricket,
  getExByTeamNameForAllBetTypes,
  showCricketSessionBook,
  isAdminRoute,
  exposureCheck,
} from "@dxc247/shared/utils/Constants";

import { SportsContext } from "@dxc247/shared/contexts/SportsContext";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import Loader from "@dxc247/shared/components/Loader";

// Lazy load components for better performance
const SportsLayout = lazy(() => import("@dxc247/shared/components/layouts/SportsLayout"));
const CommonLayout = lazy(() => import("@dxc247/shared/components/layouts/CommonLayout"));
const Bookmaker = lazy(() => import("@dxc247/shared/components/sports/Bookmaker"));
const Bookmaker2 = lazy(() => import("@dxc247/shared/components/sports/Bookmaker2"));
const CPLCupBookmaker = lazy(() => import("@dxc247/shared/components/sports/CPLCupBookmaker"));
const MatchOdds = lazy(() => import("@dxc247/shared/components/sports/MatchOdds"));

//todo: superover pending
const SuperOver = lazy(() => import("@dxc247/shared/components/sports/SuperOver"));
const TiedMatch = lazy(() => import("@dxc247/shared/components/sports/cricket/TiedMatch"));
const FancySession = lazy(() => import("@dxc247/shared/components/sports/cricket/FancySession"));
const OverByOver = lazy(() => import("@dxc247/shared/components/sports/cricket/OverByOver"));
const OddEven = lazy(() => import("@dxc247/shared/components/sports/cricket/OddEven"));
const Fancy1 = lazy(() => import("@dxc247/shared/components/sports/cricket/Fancy1"));
const Khado = lazy(() => import("@dxc247/shared/components/sports/cricket/Khado"));
const BallByBall = lazy(() => import("@dxc247/shared/components/sports/cricket/BallByBall"));
const CricketScoreboard = lazy(() => import("@dxc247/shared/components/CricketScoreboard"));

const Cricket = () => {
  const [gameId, setGameId] = useState("");

  const nav = useNavigate();
  const scoreBoardData = useRef(null);
  const [oddsTeamData, setOddsTeamData] = useState({});
  const [bookmakerTeamData, setBookmakerTeamData] = useState({});
  const [cplbookmakerTeamData, setCplbookmakerTeamData] = useState({});
  const [tiedMatchData, setTiedMatchData] = useState({});
  const [bookmaker2TeamData, setBookmaker2TeamData] = useState({});
  const [superOverTeamData, setSuperOverTeamData] = useState({});
  const [fancySessionTeamData, setFancySessionTeamData] = useState({});
  const [overByOverTeamData, setOverByOverTeamData] = useState({});
  const [meterTeamData, setMeterTeamData] = useState({});
  const [normalTeamData, setNormalTeamData] = useState({});
  const [oddevenTeamData, setOddevenTeamData] = useState({});
  const { placingBets, setPlacingBets, sportsSocketScoreboard } =
    useContext(SportsContext);

  const [ar_sectionData, setAr_sectionData] = useState([]);
  const { match_id } = useParams();
  const teamNames = useRef({});

  const defaultTeamName = useRef("");

  const [maxValue, setMaxValue] = useState([]);
  const [minValue, setMinValue] = useState([]);
  const currentOddValue = useRef([]);
  const allTeamName = useRef([]);
  const teamNameCurrentBets = useRef({});

  const [tvTriggered, setTvTriggered] = useState(false);
  const [betOddValue, setBetOddValue] = useState(0);
  const [backOrLay, setbackOrLay] = useState("back");
  const {
    popupDisplay,
    setPopupDisplay,
    betType,
    sports_socket,
    betPlaceStatusCheck,
    setShowLoader,
    showLoader,
    betPlaceStatus,
    defaultTeamDatasCalculation,
    setTriggerSocketScoreboard,
  } = useContext(SportsContext);

  const [sportList, setSportList] = useState({});
  const [myBetModel, setMyBetModel] = useState([]);
  
  // Add missing variables for RightSideBarSports
  // Use defaultTeamName as teamname for RightSideBarSports (this is what getOddValue sets)
  const teamname = defaultTeamName;
  // Use betOddValue as odds for RightSideBarSports (this is what setBetOddValue sets)
  const [odds, setOdds] = useState(0);
  const data = ar_sectionData; // Use ar_sectionData as data
  
  // Sync odds state with betOddValue when it changes
  useEffect(() => {
    setOdds(betOddValue);
  }, [betOddValue]);

  const trackData = useRef({});
  
  // Define localGetBetListData function using dynamic import
  const localGetBetListData = async () => {
    try {
      const { getBetListData } = await import("@dxc247/shared/utils/betUtils");
      await getBetListData(match_id, setMyBetModel);
    } catch (error) {
      console.error('Error fetching bet list data:', error);
    }
  };
  const tvTrigger = async (gammmmee) => {
    try {
      setTvTriggered(true);

      // sports_socket.emit('setPurposeFor', 'tv', 'cricket', '', '', gammmmee)

      // Handle the successful response here, e.g., console.log(response.data)
    } catch (error) {
      // Handle specific error scenarios
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Error Response:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        // No response received from server
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request
        console.error("Error:", error.message);
      }
    }
  };

  useEffect(() => {
    setShowLoader(true);

    if (!sports_socket) return;


    
    // Emit purpose
    sports_socket.emit("setPurposeFor", "sports", "cricket", "", "", match_id);

    const socket_game = `getSportDatacricket${match_id}`;

    // Ref for timeout so we can clear it in cleanup
    const emptyCheckTimeout = { current: null };

    // Handler for incoming data
    const handleSportData = (sportData) => {
      if (sportData !== null) {
        let parsedData = JSON.parse(Buffer.from(sportData).toString("utf8"));

        if (
          parsedData &&
          parsedData.game_detail &&
          parsedData.game_detail.length > 0
        ) {
          const gameSet = {};
          setShowLoader(false);

          for (let value of parsedData.game_detail) {
            if (value.hasOwnProperty("gmid") && gameId === "") {
              setGameId(value.gmid);
            }
            const gtype = value.mname ? value.mname.toLowerCase() : "";



            
            gameSet[gtype] = value;
          }

          if (Object.values(gameSet).length > 0 && emptyCheckTimeout.current) {
            clearTimeout(emptyCheckTimeout.current);
            emptyCheckTimeout.current = null;
          }

          const isValidGameSet =
            Object.keys(gameSet).length > 0 &&
            Object.keys(gameSet).every(
              (key) =>
                key &&
                key.trim() !== "" &&
                gameSet[key] &&
                typeof gameSet[key] === "object" &&
                Object.keys(gameSet[key]).length > 0
            );
          if (isValidGameSet) {
            // Check if any key contains "cup" and rename it to "cup"
            const keys = Object.keys(gameSet);
            let cupKey = keys.find((key) => key.toLowerCase().includes("cup"));
            if (cupKey && cupKey !== "cup") {
              // Create new object with renamed key
              const newGameSet = { ...gameSet };
              newGameSet["cup"] = newGameSet[cupKey];
              delete newGameSet[cupKey];
              setAr_sectionData(newGameSet);
              trackData.current = newGameSet;
            } else {
              setAr_sectionData(gameSet);
              trackData.current = gameSet;
            }
          }
        }
      }
    };

    

    // Listen for game data
    sports_socket.on(socket_game, handleSportData);

    // Timeout for empty data
    // emptyCheckTimeout.current = setTimeout(() => {
    //   if (Object.values(trackData.current).length === 0) {
    //     sports_socket.off(socket_game, handleSportData);

    //     nav(isAdminRoute() ? "/admin" : "/");
    //   }
    // }, 10000);

    // Handle disconnect/reconnect
    const handleDisconnect = () => {
      const connectInterval = setInterval(() => {
        sports_socket.emit(
          "setPurposeFor",
          "sports",
          "cricket",
          "",
          "",
          match_id
        );
        clearInterval(connectInterval);
      }, 1000);
    };
    sports_socket.on("disconnect", handleDisconnect);

  
    // eslint-disable-next-line
  }, [match_id, sports_socket]);




  useEffect(() => {
    if (tvTriggered === false && gameId !== "") {
      tvTrigger(gameId);
    }
  }, [gameId]);

  const oddsChange = useRef({});
  const individualBetPlaceFetch = (teamname) => {
    betPlaceStatus.current[teamname] = betPlaceStatusCheck(
      sportList,
      ar_sectionData,
      teamname
    );
  };

  // Function to refresh only specific bet type data after bet placement
  const refreshSpecificBetType = (betTypeKey) => {
    // Map bet types to their actual data keys that match .mname values
    const betTypeMapping = {
      ODDS: "match_odds",
      SUPER_OVER: "super_over",
      BOOKMAKER: "bookmaker",
      BOOKMAKER2: "bookmaker 2",
      cup: "cup",
      TIED_MATCH: "tied match",
    };

    if (betTypeMapping[betTypeKey]) {
      callTeamDatas({ [betTypeKey]: betTypeMapping[betTypeKey] });
    }
  };

  useEffect(() => {
    if (Object.keys(sportList).length > 0) {
      // Check if result is declared and redirect to homepage
      if (sportList?.isResultDeclear) {
        window.location.href = "/";
        return;
      }

      defaultTeamDatasCalculation(
        sportList,
        setOddsTeamData,
        setBookmakerTeamData,
        setTiedMatchData,
        setBookmaker2TeamData
      );
    }
  }, [sportList]);

  const ar_lengt = Object.keys(ar_sectionData).length;
  const sportListLength = Object.keys(sportList).length;

  const callTeamDatas = (
    betType = {
      ODDS: "match_odds",
      SUPER_OVER: "super_over",
      BOOKMAKER: "bookmaker",
      cup: "cup",
      BOOKMAKER2: "bookmaker 2",
      TIED_MATCH: "tied match",
    }
  ) => {
    // Find the actual key for CPL Cup Bookmaker in the data
    const keys = Object.keys(ar_sectionData || {});
    let cplCupKey = keys.find((key) => {
      const lowerKey = key.toLowerCase();
      return (
        lowerKey === "cpl cup 2025 bookmake" ||
        lowerKey === "cup" ||
        lowerKey === "cpl cup bookmaker" ||
        lowerKey === "cpl cup bookmake" ||
        lowerKey === "cup" ||
        lowerKey === "cpl_cup_bookmake" ||
        (lowerKey.includes("cpl") &&
          lowerKey.includes("cup") &&
          (lowerKey.includes("bookmake") || lowerKey.includes("bookmaker")))
      );
    });

    // If not found, try more flexible matching
    if (!cplCupKey) {
      cplCupKey = keys.find((key) => {
        const lowerKey = key.toLowerCase();
        return (
          
          lowerKey.includes("cup") 
          
        );
      });
    }

    // Also check if we need to convert underscore format to space format
    if (!cplCupKey) {
      // Try to find a key that matches when we convert underscores to spaces
      const expectedKey = "cup";

      cplCupKey = keys.find(
        (key) => key.toLowerCase() === expectedKey.toLowerCase()
      );
    }

    try {
      if (ar_lengt > 0 && sportListLength > 0 && !showLoader) {

        
        // If betType only contains one entry (partial update), only update that specific bet type
        const isPartialUpdate = Object.keys(betType).length === 1;

        
        

        // Always use bulk function for both partial and full updates
        if (isPartialUpdate) {
          // For partial updates, still use bulk function but only with the specific bet type
          const [index, value] = Object.entries(betType)[0];
          
          // Create a mapping for the specific bet type
          const partialSetFunctions = {};
          switch (index) {
            case "ODDS":
              partialSetFunctions['match_odds'] = setOddsTeamData;
              break;
            case "SUPER_OVER":
              partialSetFunctions['super_over'] = setSuperOverTeamData;
              break;
            case "BOOKMAKER":
              partialSetFunctions['bookmaker'] = setBookmakerTeamData;
              break;
            case "BOOKMAKER2":
              partialSetFunctions['bookmaker2'] = setBookmaker2TeamData;
              break;
            case "cup":
              partialSetFunctions['cup'] = setCplbookmakerTeamData;
              break;
            default:
              partialSetFunctions['tied_match'] = setTiedMatchData;
          }
          
          getExByTeamNameForAllBetTypes(
            ar_sectionData,
            sportList.id,
            {},
            partialSetFunctions
          );
        } else {
          // For full updates (initial load), process all bet types in one call
          getExByTeamNameForAllBetTypes(
            ar_sectionData,
            sportList.id,
            {},
            {
              'match_odds': setOddsTeamData,
              'bookmaker': setBookmakerTeamData,
              'bookmaker2': setBookmaker2TeamData,
              'cup': setCplbookmakerTeamData,
              'tied_match': setTiedMatchData,
              'super_over': setSuperOverTeamData,
              'fancy_session': setFancySessionTeamData,
              'over_by_over': setOverByOverTeamData,
              'meter': setMeterTeamData,
              'normal': setNormalTeamData,
              'oddeven': setOddevenTeamData
            }
          );
        }
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const expsoure = exposureCheck();

  useEffect(() => {
    localGetBetListData();
    // eslint-disable-next-line
  }, [expsoure]);

  useEffect(() => {
    if (ar_lengt > 0 && !showLoader && sportListLength > 0) {
      callTeamDatas();

      betPlaceStatusCheck(sportList, ar_sectionData);
    }

    // eslint-disable-next-line
  }, [ar_lengt, expsoure, showLoader, sportListLength]);

  useEffect(() => {
    if (sportsSocketScoreboard) {
        
        sportsSocketScoreboard.emit(
        "setPurposeFor",
        "cricket",
        "cricket",
        null,
        null,
        match_id
      );
      sportsSocketScoreboard.on(
        "getScoreData" + "cricket" + match_id,
        (data) => {
          let fetchedData = JSON.parse(Buffer.from(data).toString("utf8"));

          fetchedData = JSON.parse(fetchedData);
          

          if (fetchedData?.data?.scoreboard) {
            scoreBoardData.current = fetchedData.data;
          } else {
            scoreBoardData.current = null;
          }
        }
      );
    }
  }, [sportsSocketScoreboard, match_id]);


  useEffect(() => {
    setTriggerSocketScoreboard(true);

  }, []);

  // Disconnect scoreboard on unmount
  useEffect(() => {
    return () => {
      if (sportsSocketScoreboard) {
        console.log("Disconnecting scoreboard socket on component unmount");
        sportsSocketScoreboard.disconnect();
        setTriggerSocketScoreboard(false)
      }
    };
  }, [sportsSocketScoreboard]);
  return (
    <Suspense fallback={<Loader />}>
      <CommonLayout showSportsRightSidebar={true}
      
        sportsProps={{
          gameId: gameId,
          getBetListData: localGetBetListData,
          callTeamDatas: callTeamDatas,
          placingBets: placingBets,
          setPlacingBets: setPlacingBets,
          minValue: minValue,
          maxValue: maxValue,
          myBetModel: myBetModel,
          teamNameCurrentBets: teamNameCurrentBets,
          individualBetPlaceFetch: individualBetPlaceFetch,
          data: data,
          sportList: sportList,
          backOrLay: backOrLay,
          teamname: teamname,
          odds: odds,
          teamNames: teamNames,
          setOdds: setBetOddValue,
          setPopupDisplay: setPopupDisplay,
          popupDisplay: popupDisplay,
          refreshSpecificBetType: refreshSpecificBetType
        }}
      >
        <SportsLayout
        callTeamDatas={callTeamDatas}
        setOddsTeamData={setOddsTeamData}
        placingBets={placingBets}
        setPlacingBets={setPlacingBets}
        currentOddValue={currentOddValue}
        maxValue={maxValue}
        minValue={minValue}
        teamNameCurrentBets={teamNameCurrentBets}
        showCalculation={true}
        individualBetPlaceFetch={individualBetPlaceFetch}
        betType={betType}
        backOrLay={backOrLay}
        teamname={defaultTeamName}
        odds={betOddValue}
        teamNames={
          [
            "ODDS",
            "SUPER_OVER",
            "BOOKMAKER",
            "BOOKMAKER2",
            "cup",
            "TIED_MATCH",
          ].includes(betType)
            ? allTeamName
            : teamNames
        }
        setOdds={setBetOddValue}
        setPopupDisplay={setPopupDisplay}
        popupDisplay={popupDisplay}
        sportList={sportList}
        data={ar_sectionData}
        setSportList={setSportList}
        gameId={gameId}
        refreshSpecificBetType={refreshSpecificBetType}
      >
        {scoreBoardData.current && (
          <CricketScoreboard data={scoreBoardData.current} />
        )}

        <>
            <MatchOdds
              oddsChange={oddsChange}
              placingBets={placingBets}
              currentOddValue={currentOddValue}
              setMaxValue={setMaxValue}
              setMinValue={setMinValue}
              teamNameCurrentBets={teamNameCurrentBets}
              allTeamName={allTeamName}
              oddsTeamData={oddsTeamData}
              setDefaultTeamName={defaultTeamName}
              setBetOddValue={setBetOddValue}
              setbackOrLay={setbackOrLay}
              teamNames={teamNames}
              setPopupDisplay={setPopupDisplay}
              ar_sectionData={ar_sectionData}
              sportList={sportList}
            />

            <SuperOver
              oddsChange={oddsChange}
              placingBets={placingBets}
              currentOddValue={currentOddValue}
              setMaxValue={setMaxValue}
              setMinValue={setMinValue}
              teamNameCurrentBets={teamNameCurrentBets}
              allTeamName={allTeamName}
              oddsTeamData={oddsTeamData}
              setDefaultTeamName={defaultTeamName}
              setBetOddValue={setBetOddValue}
              setbackOrLay={setbackOrLay}
              teamNames={teamNames}
              setPopupDisplay={setPopupDisplay}
              ar_sectionData={ar_sectionData}
              sportList={sportList}
            />

            {/* Bookmaker and Bookmaker2 - Display in same row if both present, otherwise individually */}
            <Bookmaker
                    placingBets={placingBets}
                    currentOddValue={currentOddValue}
                    setMaxValue={setMaxValue}
                    setMinValue={setMinValue}
                    teamNameCurrentBets={teamNameCurrentBets}
                    allTeamName={allTeamName}
                    setDefaultTeamName={defaultTeamName}
                    bookmakerTeamData={bookmakerTeamData}
                    setBetOddValue={setBetOddValue}
                    setbackOrLay={setbackOrLay}
                    teamNames={teamNames}
                    setPopupDisplay={setPopupDisplay}
                    ar_sectionData={ar_sectionData}
                    sportList={sportList}
                    oddsChange={oddsChange}
                    setPlacingBets={setPlacingBets}
                  />
                
                
                  <Bookmaker2
                    placingBets={placingBets}
                    currentOddValue={currentOddValue}
                    setMaxValue={setMaxValue}
                    setMinValue={setMinValue}
                    teamNameCurrentBets={teamNameCurrentBets}
                    allTeamName={allTeamName}
                    setDefaultTeamName={defaultTeamName}
                    bookmakerTeamData={bookmaker2TeamData}
                    setBetOddValue={setBetOddValue}
                    setbackOrLay={setbackOrLay}
                    teamNames={teamNames}
                    setPopupDisplay={setPopupDisplay}
                    ar_sectionData={ar_sectionData}
                    sportList={sportList}
                    oddsChange={oddsChange}
                  />
          

            <CPLCupBookmaker
              placingBets={placingBets}
              currentOddValue={currentOddValue}
              setMaxValue={setMaxValue}
              setMinValue={setMinValue}
              teamNameCurrentBets={teamNameCurrentBets}
              allTeamName={allTeamName}
              setDefaultTeamName={defaultTeamName}
              bookmakerTeamData={cplbookmakerTeamData}
              setBetOddValue={setBetOddValue}
              setbackOrLay={setbackOrLay}
              teamNames={teamNames}
              setPopupDisplay={setPopupDisplay}
              ar_sectionData={ar_sectionData}
              sportList={sportList}
              oddsChange={oddsChange}
            />

            <TiedMatch
              teamNameCurrentBets={teamNameCurrentBets}
              placingBets={placingBets}
              setBetOddValue={setBetOddValue}
              allTeamName={allTeamName}
              model={sportList}
              tiedMatchData={tiedMatchData}
              gameData={ar_sectionData}
              teamNameArr={teamNames}
              setbackOrLay={setbackOrLay}
              teamNames={teamNames}
              setPopupDisplay={setPopupDisplay}
              setDefaultTeamName={defaultTeamName}
            />

            <FancySession
              betPlaceStatus={betPlaceStatus}
              setDefaultTeamName={defaultTeamName}
              setPopupDisplay={setPopupDisplay}
              sportList={sportList}
              oddsChange={oddsChange}
              teamNames={teamNames}
              setMaxValue={setMaxValue}
              setMinValue={setMinValue}
                    
              setbackOrLay={setbackOrLay}
              setBetOddValue={setBetOddValue}
              data={ar_sectionData}RDF
              showCricketSessionBook={showCricketSessionBook}
            />
            
            <OverByOver
              betPlaceStatus={betPlaceStatus}
              setDefaultTeamName={defaultTeamName}
              setPopupDisplay={setPopupDisplay}
              model={sportList}
              oddsChange={oddsChange}
              teamNames={teamNames}
              setMaxValue={setMaxValue}
              setMinValue={setMinValue}
              setbackOrLay={setbackOrLay}
              setBetOddValue={setBetOddValue}
              gameData={ar_sectionData}
              showCricketSessionBook={showCricketSessionBook}
            />
            
            <BallByBall
              betPlaceStatus={betPlaceStatus}
              setDefaultTeamName={defaultTeamName}
              setPopupDisplay={setPopupDisplay}
              sportList={sportList}
              oddsChange={oddsChange}
              teamNames={teamNames}
              setMaxValue={setMaxValue}
              setMinValue={setMinValue}
              setbackOrLay={setbackOrLay}
              setBetOddValue={setBetOddValue}
              data={ar_sectionData}
              showCricketSessionBook={showCricketSessionBook}
            />
            
            <Fancy1
              betPlaceStatus={betPlaceStatus}
              setDefaultTeamName={defaultTeamName}
              setPopupDisplay={setPopupDisplay}
              sportList={sportList}
              oddsChange={oddsChange}
              teamNames={teamNames}
              setMaxValue={setMaxValue}
              setMinValue={setMinValue}
              setbackOrLay={setbackOrLay}
              setBetOddValue={setBetOddValue}
              data={ar_sectionData}
            />
            
            <Khado
              betPlaceStatus={betPlaceStatus}
              setDefaultTeamName={defaultTeamName}
              setPopupDisplay={setPopupDisplay}
              sportList={sportList}
              oddsChange={oddsChange}
              teamNames={teamNames}
              setMaxValue={setMaxValue}
              setMinValue={setMinValue}
              setbackOrLay={setbackOrLay}
              setBetOddValue={setBetOddValue}
              data={ar_sectionData}
              showCricketSessionBook={showCricketSessionBook}
            />
            
            <OddEven
              setBetOddValue={setBetOddValue}
              setMaxValue={setMaxValue}
              setMinValue={setMinValue}
              setbackOrLay={setbackOrLay}
              setDefaultTeamName={defaultTeamName}
              model={sportList}
              gameData={ar_sectionData}
              setPopupDisplay={setPopupDisplay}
            />
            {/* <Meter betPlaceStatus={betPlaceStatus} setDefaultTeamName={defaultTeamName}
                               setPopupDisplay={setPopupDisplay} sportList={sportList}
                               oddsChange={oddsChange} teamNames={teamNames} setbackOrLay={setbackOrLay}
                               setBetOddValue={setBetOddValue} data={ar_sectionData}
                               showCricketSessionBook={showCricketSessionBook}
                        /> */}
        </>
      </SportsLayout>
    </CommonLayout>
    </Suspense>
  );
};
export default Cricket;
