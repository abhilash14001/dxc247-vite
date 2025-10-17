import React, {useContext, useEffect, useRef, useState, Suspense, lazy} from "react";
import {exposureCheck, getExByTeamNameForCricket, getExByTeamNameForAllBetTypes, isAdminRoute} from "@dxc247/shared/utils/Constants";
import {SportsContext} from "@dxc247/shared/contexts/SportsContext";
import {useNavigate, useParams} from "react-router-dom";
import {Buffer} from "buffer";
import Loader from "@dxc247/shared/components/Loader";

// Lazy load components for better performance
const SportsLayout = lazy(() => import("@dxc247/shared/components/layouts/SportsLayout"));
const CommonLayout = lazy(() => import("@dxc247/shared/components/layouts/CommonLayout"));
const MatchOdds = lazy(() => import("@dxc247/shared/components/sports/MatchOdds"));
const Bookmaker = lazy(() => import("@dxc247/shared/components/sports/Bookmaker"));

const Soccer = () => {
    const nav = useNavigate();
    const expsoure = exposureCheck()

    const trackData = useRef({});
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


    const [sportList, setSportList] = useState({})
    const [myBetModel, setMyBetModel] = useState([]);
    const defaultTeamName = useRef('')
    // Add missing variables for RightSideBarSports
    // Use defaultTeamName as teamname for RightSideBarSports (this is what getOddValue sets)
    const teamname = defaultTeamName;
    // Use betOddValue as odds for RightSideBarSports (this is what setBetOddValue sets)
    const [odds, setOdds] = useState(0);
    const [gameId, setGameId] = useState("");
    
    // Sync odds state with betOddValue when it changes
    useEffect(() => {
        setOdds(betOddValue);
    }, [betOddValue]);

    
    const allTeamName = useRef([])
    const teamNameCurrentBets = useRef({})
    const {match_id} = useParams();


    const [oddsTeamData, setOddsTeamData] = useState({})
    const [bookmakerTeamData, setBookmakerTeamData] = useState({})
    
    // Define localGetBetListData function using dynamic import
    const localGetBetListData = async () => {
        try {
            const { getBetListData } = await import("@dxc247/shared/utils/betUtils");
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
        'ODDS': 'match_odds', 'BOOKMAKER': 'bookmaker',

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

    const [ar_sectionData, setAr_sectionData] = useState([])
    const data = ar_sectionData; // Use ar_sectionData as data

    const arlength = Object.keys(ar_sectionData).length
    const sportListLength = Object.keys(sportList).length

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
    
    const oddsChange = useRef({});


    useEffect(() => {

        if(sports_socket){
        let gamename = 'soccer'
        let socket_game = `getSportData${gamename}${match_id}`;

        setShowLoader(true)

        sports_socket.emit('setPurposeFor', 'sports', gamename, '', '', match_id)
        let emptyCheckTimeout;
            const gameConnect = () => {
                sports_socket.on(socket_game, sportData => {

                    if (sportData !== null) {

                        const gameSet = [];
                        sportData = JSON.parse(Buffer.from(sportData).toString('utf8'))

                        if (sportData && sportData.game_detail && sportData.game_detail.length > 0) {

                            setShowLoader(false);

                            for (let i = 0; i < sportData.game_detail.length; i++) {
                                const value = sportData.game_detail[i];

                                const gtype = value.mname.toLowerCase();


                                gameSet[gtype] = value;
                            }
                            setAr_sectionData(gameSet)
                            trackData.current = gameSet;

                            if (Object.values(gameSet).length > 0 && emptyCheckTimeout) {
                                clearTimeout(emptyCheckTimeout);  // Clear the timeout if data is received
                                emptyCheckTimeout = null;
                            }

                        }


                    }
                    const elements = document.getElementsByClassName('checkdataval');

                    for (let i = 0; i < elements.length; i++) {
                        let element = elements[i];
                        // compare data-old and data-new attributes
                        let oldData = element.getAttribute('data-old');
                        let newData = element.getAttribute('data-new');


                        if (oldData !== newData) {
                            // if data has changed, add the 'blink' class
                            element.classList.add('blink');
                        } else {
                            element.classList.remove('blink');
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

            sports_socket.on('disconnect', function () {

                // Reconnect logic
                const connectInterval = setInterval(() => {
                    gameConnect();
                    clearInterval(connectInterval)
                }, 1000);  // Reattempt connect every second
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

// eslint-disable-next-line
    }, [match_id, sports_socket]);


    const individualBetPlaceFetch = (teamname) => {
        let r = betPlaceStatusCheck(sportList, ar_sectionData, teamname)

        betPlaceStatus.current[teamname] = r
    }
    const [maxValue, setMaxValue] = useState([])
    const [minValue, setMinValue] = useState([])
    const currentOddValue = useRef([]);
    const [placingBets, setPlacingBets] = useState([])

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
            </CommonLayout>
        </Suspense>


    );
};

export default Soccer;
