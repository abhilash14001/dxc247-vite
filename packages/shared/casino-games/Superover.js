import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";
import { Buffer } from "buffer";
import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import {
    getExByColor,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet, calculateUpdatedBets, updatePlacingBetsState,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {CasinoContext} from "../contexts/CasinoContext";
import {AuthContext} from "../contexts/AuthContext";
import Notify from "../utils/Notify";
import { getSize } from "../utils/Constants";

const Superover = () => {
    const [roundId, setRoundId] = useState('')
    const [min, setMin] = useState('')
    const [max, setMax] = useState('')
    const teamNameCurrentBets = useRef({})
    const roundIdSaved = useRef(null);
    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState([]);

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const {match_id} = useParams();
    const {
        betType,
        setBetType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const { casino_socket_scoreboard, scoreBoardData, setTriggerSocket, mybetModel } = useContext(CasinoContext)
    const {getBalance} = useContext(AuthContext) || {getBalance: () => 0}
    const [hideLoading, setHideLoading] = useState(true)


    const teamNames = useRef(["ENG", "RSA"])

    
    const ruleImage = '/img/rules/superover.jpg';
    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0); // Example player A value
    const [playerStatuses, setPlayerStatuses] = useState({"ENG": '', "RSA": ''});
    const [playerA_Back, setPlayerA_Back] = useState(0);
    const [playerB_Back, setPlayerB_Back] = useState(0);
    const [playerA_Lay, setPlayerA_Lay] = useState(0);
    const [playerB, setPlayerB] = useState(0); // Example player B value
    const [playerASize, setPlayerASize] = useState({back : "", lay : ""}); // Example player B value
    const [playerBSize, setPlayerBSize] = useState({back : "", lay : ""}); // Example player B value

    const [playerB_Lay, setPlayerB_Lay] = useState(0);
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);
    const [placingBets, setPlacingBets] = useState({});

    const {triggerSocket} = useContext(CasinoContext)

    useEffect(() => {
        
        if (data?.t1?.gmid && casino_socket_scoreboard) {
            
            
        casino_socket_scoreboard.emit('setPurposeFor', 'casino', 'superover', null, data?.t1?.gmid, 'superover')

        
        casino_socket_scoreboard.on('getScoreDatasuperover' + match_id, (data) => {
            let fetchedData = JSON.parse(Buffer.from(data).toString('utf8'))

            fetchedData = JSON.parse(fetchedData)

            
            if(fetchedData?.data?.scoreboard){
                
                
                scoreBoardData.current = fetchedData
            }
            else{
                scoreBoardData.current = null
            }
                
                
        })  
        }
    }, [data?.t1?.gmid, casino_socket_scoreboard]);

    useEffect(() => {
        setBetType('BOOKMAKER')
    }, [])

    useEffect(() => {
    
        if(!triggerSocket.scoreboard && triggerSocket.casino){
          setTriggerSocket({...triggerSocket, scoreboard : true})
        
            
        }
        
        
      }, [triggerSocket.casino, triggerSocket.scoreboard])


    useEffect(() => {
        if (data?.t2) {

            updatePlayerStats(data.t2?.[0]?.['section']?.[0], setPlayerA_Back, setPlayerA_Lay, "ENG",setPlayerASize);
            updatePlayerStats(data.t2?.[0]?.['section']?.[1], setPlayerB_Back, setPlayerB_Lay, "RSA", setPlayerBSize);

        }

        // Update teamNameCurrentBets
        if (!teamNameCurrentBets.current?.['BOOKMAKER']) {
            teamNameCurrentBets.current['BOOKMAKER'] = [];
        }
        teamNameCurrentBets.current['BOOKMAKER']['ENG'] = playerA;
        teamNameCurrentBets.current['BOOKMAKER']['RSA'] = playerB;
    }, [data?.t2, playerA, playerB])

    useEffect(() => {
       
        if (data?.t1?.card) {

            let ar_card_img = {
                'K': "/img/casino/rules/ball/wicket1.png",
                'A': "/img/casino/rules/ball/ball1.png",
                '2': "/img/casino/rules/ball/ball2.png",
                '3': "/img/casino/rules/ball/ball3.png",
                '4': "/img/casino/rules/ball/ball4.png",
                '6': "/img/casino/rules/ball/ball6.png",
                '10': "/img/casino/rules/ball/ball0.png"
            };

            if (data?.t1?.card) {
                const ar_explode = ["CC", "HH", "DD", "SS"];

                // Split the card string and map to images
                const result_cards = data.t1.card.split('|').map((item) => {
                    // Remove any "CC", "HH", "DD", "SS" from the item
                    ar_explode.forEach((str) => {
                        item = item.replace(str, "");
                    });

                    // Return the image path if the item exists in ar_card_img, else null
                    return item !== "1" ? ar_card_img[item] || null : null;
                });


                
                setCards(result_cards); // Assuming setCards is a state setter function
            }

            remark.current = data.remark || 'Welcome';

        }



    }, [data?.t1?.card]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;
    const updateAmount =  async () => {
        await getExByTeamNameForCasino(sportList.id, data?.t1?.gmid, 'ENG', match_id).then(res => setPlayerA(res.data))

        await getExByTeamNameForCasino(sportList.id, data?.t1?.gmid, 'RSA', match_id).then(res => setPlayerB(res.data))
    }
    useEffect(() => {

        if (data?.t2 && sportList?.id) {
            updateAmount()
        }
    }, [exposure, sportLength, roundId, mybetModel.length]);

    const updatePlayerStats = (playerData, setPlayerBack, setPlayerLay, playerName, setPlayerSize) => {

        if (!playerData) return;
        let playerStatus = '';

        if (playerData.gstatus !== "ACTIVE") {
            playerStatus = "suspended suspended-box-2";

        }

        if(playerName === 'ENG'){
            setMin(data?.t2[0].min)
            setMax(data?.t2[0].max)
        }

        const england_back = playerData['odds'].find(item => item.otype === 'back').odds

        const england_lay = playerData['odds'].find(item => item.otype === 'lay').odds
        setPlayerSize({back : playerData['odds'].find(item => item.otype === 'back').size, lay: playerData['odds'].find(item => item.otype === 'lay').size})


        setPlayerStatuses(prev => ({...prev, [playerName]: playerStatus}));

        if (england_back) {
            setPlayerBack(england_back);

        } else {
            setPlayerBack(0);
        }
        if (england_lay) {


            setPlayerLay(england_lay);


        } else {
            setPlayerLay(0);
        }
    };
    const openPopup = (isBakOrLay, teamnam, oddvalue) => {

        loss.current = ''
        profit.current = ''

        if (parseFloat(oddvalue) > 0) {
            roundIdSaved.current = roundId
            setbackOrLay(isBakOrLay)
            setPopupDisplayForDesktop(true);
            teamname.current = teamnam
            setOdds(oddvalue)
        } else {
            Notify("Odds Value Change Bet Not Confirm", null, null, 'danger')

        }


    }

    // Helper function to find data in data.sub for Superover
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Superover, find the item by nat field
        return data.sub.find(item => item.nat.toUpperCase() === teamName.toUpperCase());
    };
    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds
        if (backOrLay === 'back') {
            loss.current = stakeValue.current.value;
            profit.current = profitData.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)

        } else {
            profit.current = profitData.current = stakeValue.current.value;
            loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)
        }

        // Update placingBets when stake value changes
        if (teamname.current && odds > 0) {
            const updatedBets = calculateUpdatedBets(
                'BOOKMAKER',
                backOrLay,
                teamname.current,
                parseFloat(profit.current),
                parseFloat(loss.current),
                teamNames.current,
                teamNameCurrentBets.current,
                placingBets['BOOKMAKER'] || {}
            );
            
            updatePlacingBetsState(setPlacingBets, 'BOOKMAKER', updatedBets);
        }
    }

    const renderCards = () => (
        cards?.map((card, index) => {
            if (card === null)
                return null;
            return (
                <div className="mt-1" key={index}>
                    <img key={index} src={card} alt={`card-${index}`}/>
                </div>
            );
        })
    );


    const placeBet = async () => {
        const betData = {
            sportList,
            roundId,
            backOrLay,
            teamname,
            odds,
            profit,
            loss,
            betType: "BOOKMAKER",
            stakeValue,
            match_id,
            roundIdSaved,
            totalPlayers: null,
            playerStatuses: playerStatuses[teamname.current],
            setHideLoading,
            setPopupDisplayForDesktop,
            setSubmitButtonDisable,
            resetBetFields,
            profitData,
            getBalance,
            updateAmounts: updateAmount,
            Notify,
            placingBets,
            setPlacingBets,
            teamNames,
            teamNameCurrentBets
        };

        const success = await placeCasinoBet(betData, {

            placeName2: teamNames.current,
            odd_min_limit: () => {
                if (teamname.current && betType) {
                    const foundData = findDataInSub(teamname.current, betType);
                    if (foundData && foundData.min) {
                        return foundData.min;
                    }
                }
                return null;
            },
            odd_max_limit: () => {
                if (teamname.current && betType) {
                    const foundData = findDataInSub(teamname.current, betType);
                    if (foundData && foundData.max) {
                        return foundData.max;
                    }
                }
                return null;
            },
            onError : () => {
                
                // Clear placingBets after successful bet placement
                setPlacingBets({});
            },
            onSuccess: () => {
                
                // Clear placingBets after successful bet placement
                setPlacingBets({});
            }
        });

        return success;
    }

    const renderVideoBox = () => {  
        return (
            <div className="casino-video-cards">
                {renderCards()}
            </div>
        )
    }

    // Function to get current min/max limits for the active bet
    const getMinMaxLimits = () => {
        if (teamname.current && betType) {
            const foundData = findDataInSub(teamname.current, betType);
            if (foundData) {
                return {
                    min: foundData.min || 100,
                    max: foundData.max || 100000
                };
            }
        }
        return { min: 100, max: 100000 }; // Default fallback
    };

    return (
        <CasinoLayout raceClass="super-over"  ruleImage={ruleImage} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      placingBets={placingBets} setPlacingBets={setPlacingBets}
                      getMinMaxLimits={getMinMaxLimits}>
            

            <div className="casino-detail detail-page-container position-relative">
                <div className="game-market market-2">
                    <div className="market-title">
                        <span>Bookmaker</span>
                    </div>
                    <div className="market-header">
                        <div className="market-nation-detail">
                            <span className="market-nation-name">
                                Min: {min} Max: {getSize(max, true)}
                            </span>
                        </div>
                        <div className="market-odd-box back">
                            <b>Back</b>
                        </div>
                        <div className="market-odd-box lay">
                            <b>Lay</b>
                        </div>
                    </div>
                    <div className="market-body" data-title="OPEN">
                        {["ENG", "RSA"].map((team, index) => (
                            <div
                                key={index}
                                className={`market-row ${
                                    playerStatuses[team].includes('suspended') ? "suspended-row" : ""
                                }`}
                                data-title={
                                    playerStatuses[team].includes('suspended') ? "SUSPENDED" : "ACTIVE"
                                }
                            >
                                <div className="market-nation-detail">
                                    <span className="market-nation-name">{team}</span>
                                    <div className="market-">
                                        <span className="teamEx">{getExByColor(team === "ENG" ? playerA : playerB)}</span>
                                        <span
                                            className={`float-right ${placingBets?.['BOOKMAKER']?.[team] < 0 ? 'red-color' : 'green-color'} `}>
                                            {placingBets?.['BOOKMAKER']?.[team] ?? ''}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="market-odd-box back"
                                    onClick={() =>
                                        openPopup(
                                            "back",
                                            team,
                                            team === "ENG" ? playerA_Back : playerB_Back
                                        )
                                    }
                                >
                                    <span className="market-odd">
                                        {team === "ENG" ? playerA_Back || "-" : playerB_Back || "-"}
                                    </span>
                                    {team === "ENG" && playerASize.back && (
                                        <span className="market-volume">{playerASize.back}</span>
                                    )}
                                    {team === "RSA" && playerBSize.back && (
                                        <span className="market-volume">{playerBSize.back}</span>
                                    )}
                                </div>
                                <div
                                    className="market-odd-box lay"
                                    onClick={() =>
                                        openPopup(
                                            "lay",
                                            team,
                                            team === "ENG" ? playerA_Lay : playerB_Lay
                                        )
                                    }
                                >
                                    <span className="market-odd">
                                        {team === "ENG" ? playerA_Lay || "-" : playerB_Lay || "-"}
                                    </span>
                                    {team === "ENG" && playerASize.lay && (
                                        <span className="market-volume">{playerASize.lay}</span>
                                    )}
                                    {team === "RSA" && playerBSize.lay && (
                                        <span className="market-volume">{playerBSize.lay}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </div>


        </CasinoLayout>
    );

};


export default Superover;