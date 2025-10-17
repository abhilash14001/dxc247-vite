import React, {useContext, useEffect, useRef, useState, Suspense, lazy} from "react";

import {exposureCheck, getExByTeamNameForCricket, getExByTeamNameForAllBetTypes, isAdminRoute} from "@dxc247/shared/utils/Constants";
import {SportsContext} from "@dxc247/shared/contexts/SportsContext";

import {useNavigate, useParams} from "react-router-dom";
import {Buffer} from "buffer";
import Loader from "@dxc247/shared/components/Loader";

// Lazy load components for better performance
const SportsLayout = lazy(() => import("../layouts/SportsLayout"));
const CommonLayout = lazy(() => import("../layouts/CommonLayout"));
const MatchOdds = lazy(() => import("./MatchOdds"));
const Bookmaker = lazy(() => import("./Bookmaker"));

const Tennis = () => {
    const nav = useNavigate();

    const defaultTeamName = useRef('')
    const allTeamName = useRef([])
    const teamNameCurrentBets = useRef({})


    const teamNames = useRef({});
    const [betOddValue, setBetOddValue] = useState(0)
    const [backOrLay, setbackOrLay] = useState('back')
    const {
        popupDisplay,
        setPopupDisplay,
        betType,
        sports_socket,
        betPlaceStatusCheck,
        betPlaceStatus,
        setShowLoader,
        showLoader,
        defaultTeamDatasCalculation
    } = useContext(SportsContext)
    const {match_id} = useParams();


    const [sportList, setSportList] = useState({})
    const [ar_sectionData, setAr_sectionData] = useState([])
    const [myBetModel, setMyBetModel] = useState([]);
    
    // Add missing variables for RightSideBarSports
    // Use defaultTeamName as teamname for RightSideBarSports (this is what getOddValue sets)
    const teamname = defaultTeamName;
    // Use betOddValue as odds for RightSideBarSports (this is what setBetOddValue sets)
    const [odds, setOdds] = useState(0);
    const data = ar_sectionData; // Use ar_sectionData as data
    const [gameId, setGameId] = useState("");
    
    // Sync odds state with betOddValue when it changes
    useEffect(() => {
        setOdds(betOddValue);
    }, [betOddValue]);

    const trackData = useRef({});

    const oddsChange = useRef({});

    const [oddsTeamData, setOddsTeamData] = useState({})
    const [bookmakerTeamData, setBookmakerTeamData] = useState({})
    const [placingBets, setPlacingBets] = useState([])
    
    // Define localGetBetListData function using dynamic import
    const localGetBetListData = async () => {
        try {
            const { getBetListData } = await import("../../utils/betUtils");
            await getBetListData(match_id, setMyBetModel);
        } catch (error) {
            console.error('Error fetching bet list data:', error);
        }
    };
    
    // Function to refresh only specific bet type data after bet placement
    const refreshSpecificBetType = (betTypeKey) => {
        const betTypeMapping = {
            ODDS: "match_odds",
            BOOKMAKER: "bookmaker"
        };

        if (betTypeMapping[betTypeKey]) {
            callTeamDatas({ [betTypeKey]: betTypeMapping[betTypeKey] });
        }
    };

    useEffect(() => {
        // Runs on mount only
        setPopupDisplay(false)
        setShowLoader(true);
    }, []);
  
    const sportListLength = Object.keys(sportList).length 

    useEffect(() => {
        if (Object.keys(sportList).length > 0) {
            
            // Check if result is declared and redirect to homepage
            if (sportList?.isResultDeclear) {
                window.location.href = '/';
                return;
            }

            defaultTeamDatasCalculation(sportList, setOddsTeamData, setBookmakerTeamData)
        }

    }, [sportList]);

    const callTeamDatas = (betType = {
        'ODDS': 'match_odds',
        'BOOKMAKER': 'bookmaker',

    }) => {

        try {
            
            if (arlength > 0 && sportListLength > 0 && !showLoader) {
                
                // Check if this is a partial update (single bet type)
                const isPartialUpdate = Object.keys(betType).length === 1;
                
                if (isPartialUpdate) {
                    // For partial updates, only fetch the specific bet type
                    const [index, value] = Object.entries(betType)[0];
                    const partialSetFunctions = {};
                    
                    switch (index) {
                        case 'ODDS':
                            partialSetFunctions['match_odds'] = setOddsTeamData;
                            break;
                        case 'BOOKMAKER':
                            partialSetFunctions['bookmaker'] = setBookmakerTeamData;
                            break;
                        default:
                            partialSetFunctions['match_odds'] = setOddsTeamData;
                    }
                    
                    getExByTeamNameForAllBetTypes(
                        ar_sectionData,
                        sportList.id,
                        {},
                        partialSetFunctions
                    );
                } else {
                    // For full updates, fetch all bet types
                    getExByTeamNameForAllBetTypes(
                        ar_sectionData,
                        sportList.id,
                        {},
                        {
                            'match_odds': setOddsTeamData,
                            'bookmaker': setBookmakerTeamData
                        }
                    );
                }


            }


        } catch (error) {
            console.error("Error fetching team data:", error);
        }
    };
    const arlength = Object.keys(ar_sectionData).length
    const expsoure = exposureCheck()

    useEffect(() => {
        localGetBetListData();
        // eslint-disable-next-line
    }, [expsoure]);
    
    useEffect(() => {
        
        if (arlength > 0 && !showLoader && sportListLength > 0) {

            
            
            
            callTeamDatas();

        }
// eslint-disable-next-line
    }, [arlength, expsoure, showLoader, sportListLength]);

    useEffect(() => {
        if (sports_socket) {
            let gamename = 'tennis'
            sports_socket.emit('setPurposeFor', 'sports', gamename, '', '', match_id)
            let socket_game = `getSportData${gamename}${match_id}`;
            let emptyCheckTimeout;


            const gameConnect = () => {
                sports_socket.on(socket_game, sportData => {

                    const gameSet = [];

                    if (sportData !== null) {

                        sportData = JSON.parse(Buffer.from(sportData).toString('utf8'))

                        if (sportData && sportData.game_detail && sportData.game_detail.length > 0) {
                            setShowLoader(false);

                            for (let i = 0; i < sportData.game_detail.length; i++) {
                                const value = sportData.game_detail[i];

                                const gtype = value?.mname?.toLowerCase();

                                gameSet[gtype] = value;
                            }

                            if (Object.values(gameSet).length > 0 && emptyCheckTimeout) {
                                clearTimeout(emptyCheckTimeout);  // Clear the timeout if data is received
                                emptyCheckTimeout = null;
                            }
                            setAr_sectionData(gameSet)
                            trackData.current = gameSet;
                        }
                    }
                })
            }
            gameConnect();

            emptyCheckTimeout = setTimeout(() => {
                if (Object.values(trackData.current).length === 0) {
                    nav(isAdminRoute() ? '/admin' : '/');  // Redirect if gameSet is empty
                }
            }, 3000);

            sports_socket.on('disconnect', () => {
                // Handle the successful response here, e.g., console.log(response.data)
            });

            return () => {
                sports_socket.off(socket_game);
                setPopupDisplay(false)
                setShowLoader(false);
                
                // Clear the timeout to prevent redirect after component unmounts
                if (emptyCheckTimeout) {
                    clearTimeout(emptyCheckTimeout);
                    emptyCheckTimeout = null;
                }
            };
        }
        // If sports_socket is not defined, return undefined (no cleanup)
    // eslint-disable-next-line
    }, [match_id, sports_socket]);


    const individualBetPlaceFetch = (teamname) => {
        betPlaceStatus.current[teamname] = betPlaceStatusCheck(sportList, ar_sectionData, teamname)
    }
    const [maxValue, setMaxValue] = useState([])
    const [minValue, setMinValue] = useState([])
    const currentOddValue = useRef([]);

    return (
        <Suspense fallback={<Loader />}>
            <CommonLayout 
                showSportsRightSidebar={true}
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
                <Suspense fallback={<Loader />}>
                    <SportsLayout callTeamDatas={callTeamDatas}
                                  setOddsTeamData={setOddsTeamData} placingBets={placingBets} setPlacingBets={setPlacingBets}
                                  currentOddValue={currentOddValue} maxValue={maxValue} minValue={minValue}
                                  teamNameCurrentBets={teamNameCurrentBets}
                                  showCalculation={true}
                                  individualBetPlaceFetch={individualBetPlaceFetch} betType={betType}
                                  backOrLay={backOrLay} teamname={defaultTeamName}
                                  odds={betOddValue}
                                  teamNames={['ODDS', 'BOOKMAKER', 'TIED_MATCH'].includes(betType) ? allTeamName : []}
                                  setOdds={setBetOddValue}
                                  setPopupDisplay={setPopupDisplay} popupDisplay={popupDisplay} sportList={sportList}
                                  data={ar_sectionData} setSportList={setSportList}>

                        <>
                            <MatchOdds placingBets={placingBets} currentOddValue={currentOddValue}
                                       setMaxValue={setMaxValue} setMinValue={setMinValue} teamNameCurrentBets={teamNameCurrentBets}
                                       allTeamName={allTeamName} oddsTeamData={oddsTeamData} setDefaultTeamName={defaultTeamName}
                                       setBetOddValue={setBetOddValue} setbackOrLay={setbackOrLay} teamNames={teamNames}
                                       setPopupDisplay={setPopupDisplay} ar_sectionData={ar_sectionData} sportList={sportList}
                                       oddsChange={oddsChange}/>
                            <Bookmaker placingBets={placingBets} currentOddValue={currentOddValue} setMaxValue={setMaxValue}
                                       setMinValue={setMinValue} teamNameCurrentBets={teamNameCurrentBets}
                                       allTeamName={allTeamName} setDefaultTeamName={defaultTeamName}
                                       bookmakerTeamData={bookmakerTeamData} setBetOddValue={setBetOddValue}
                                       setbackOrLay={setbackOrLay}
                                       teamNames={teamNames} setPopupDisplay={setPopupDisplay} ar_sectionData={ar_sectionData}
                                       sportList={sportList} oddsChange={oddsChange}/>
                        </>
                    </SportsLayout>
                </Suspense>
            </CommonLayout>
        </Suspense>

    );
};


export default Tennis;
