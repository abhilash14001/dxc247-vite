import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    cardMap, getExByColor, resetBetFields, getExBySingleTeamNameCasino, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";

import Notify from "../utils/Notify";
import {CasinoContext} from "../contexts/CasinoContext";


const Dt201 = () => {
    const [data, setData] = useState([]);

    const sportLength = Object.keys(data).length;

    const exposure = exposureCheck()
    const {fetchDataDragonTiger} = useContext(CasinoContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [roundId, setRoundId] = useState('')
    const [playerStatuses, setPlayerStatuses] = useState({});

    const [TOTALPLAYERS, setTotalPlayers] = useState(
        [
            {
                Dragon: {odds: 0, status: 'suspended-box', 'amounts': ''},
                Tie: {odds: 0, status: 'suspended-box', 'amounts': ''},
                Tiger: {odds: 0, status: 'suspended-box', 'amounts': ''},
                Pair: {odds: 0, status: 'suspended-box', 'amounts': ''},

            },
            {
                Dragon: {
                    Even: {odds: 0, status: 'suspended-box', 'amounts': ''},
                    Odd: {odds: 0, status: 'suspended-box', 'amounts': ''},
                    Black: {odds: 0, status: 'suspended-box', 'amounts': ''},
                    Red: {odds: 0, status: 'suspended-box', 'amounts': ''},
                    Card: {
                        odds: '',
                        status: 'suspended-box',
                        'amounts': Array.from({length: 13}, (_, i) => '')
                    },
                }
            },
            {
                Tiger: {
                    Even: {odds: 0, status: 'suspended-box', 'amounts': ''},
                    Odd: {odds: 0, status: 'suspended-box', 'amounts': ''},
                    Black: {odds: 0, status: 'suspended-box', 'amounts': ''},
                    Red: {odds: 0, status: 'suspended-box', 'amounts': ''},
                    Card: {
                        odds: '',
                        status: 'suspended-box',
                        'amounts': Array.from({length: 13}, (_, i) => '')
                    },
                }
            }
        ]);

    const updateOdds = (data) => {

        data = data.sub;

        setTotalPlayers((prevState) => {
            return prevState.map((section, index) => {
                // Update Dragon section in the first object of TOTALPLAYERS
                if (index === 0) {
                    return {
                        ...section,
                        Dragon: {
                            ...section.Dragon,
                            odds: data.find((d) => d.nat === "Dragon")?.b || 0,
                            status: data.find((d) => d.nat === "Dragon")?.gstatus === 'OPEN' ? '' : 'suspended-box',
                            
                        },
                        Tie: {
                            ...section.Tie,
                            odds: data.find((d) => d.nat === "Tie")?.b || 0,
                            status: data.find((d) => d.nat === "Tie")?.gstatus === 'OPEN' ? '' : 'suspended-box',
                            
                        },
                        Tiger: {
                            ...section.Tiger,
                            odds: data.find((d) => d.nat === "Tiger")?.b || 0,
                            status: data.find((d) => d.nat === "Tiger")?.gstatus === 'OPEN' ? '' : 'suspended-box',
                            
                        },
                        Pair: {
                            ...section.Pair,
                            odds: data.find((d) => d.nat === "Pair")?.b || 0,
                            status: data.find((d) => d.nat === "Pair")?.gstatus === 'OPEN' ? '' : 'suspended-box',
                            
                        }
                    };
                }

                // Update Dragon section in the second object
                if (index === 1 && section.Dragon) {


                    return {
                        ...section,
                        Dragon: {
                            ...section.Dragon,
                            Even: data.find((d) => d.nat === "Dragon Even")
                                ? {
                                    ...section.Dragon.Even,
                                    odds: data.find((d) => d.nat === "Dragon Even").b,
                                    status: data.find((d) => d.nat === "Dragon Even").gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Dragon.Even,
                            Odd: data.find((d) => d.nat === "Dragon Odd")
                                ? {
                                    ...section.Dragon.Odd,
                                    odds: data.find((d) => d.nat === "Dragon Odd").b,
                                    status: data.find((d) => d.nat === "Dragon Odd").gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Dragon.Odd,
                            Black: data.find((d) => d.nat === "Dragon Black")
                                ? {
                                    ...section.Dragon.Black,
                                    odds: data.find((d) => d.nat === "Dragon Black").b,
                                    status: data.find((d) => d.nat === "Dragon Black").gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Dragon.Black,
                            Red: data.find((d) => d.nat === "Dragon Red")
                                ? {
                                    ...section.Dragon.Red,
                                    odds: data.find((d) => d.nat === "Dragon Red").b,
                                    status: data.find((d) => d.nat === "Dragon Red").gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Dragon.Red,
                            Card: data.find((d) => d.nat.startsWith("Dragon Card"))
                                ? {
                                    ...section.Dragon.Card,

                                    odds: data.find((d) => d.nat.startsWith("Dragon Card")).b,
                                    status: data.find((d) => d.nat.startsWith("Dragon Card")).gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Dragon.Card
                        }
                    };
                }

                // Update Tiger section in the third object
                if (index === 2 && section.Tiger) {
                    return {
                        ...section,
                        Tiger: {
                            ...section.Tiger,
                            Even: data.find((d) => d.nat === "Tiger Even")
                                ? {
                                    ...section.Tiger.Even,

                                    odds: data.find((d) => d.nat === "Tiger Even").b,
                                    status: data.find((d) => d.nat === "Tiger Even").gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Tiger.Even,
                            Odd: data.find((d) => d.nat === "Tiger Odd")
                                ? {
                                    ...section.Tiger.Odd,

                                    odds: data.find((d) => d.nat === "Tiger Odd").b,
                                    status: data.find((d) => d.nat === "Tiger Odd").gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Tiger.Odd,
                            Black: data.find((d) => d.nat === "Tiger Black")
                                ? {
                                    ...section.Tiger.Black,

                                    odds: data.find((d) => d.nat === "Tiger Black").b,
                                    status: data.find((d) => d.nat === "Tiger Black").gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Tiger.Black,
                            Red: data.find((d) => d.nat === "Tiger Red")
                                ? {
                                    ...section.Tiger.Red,

                                    odds: data.find((d) => d.nat === "Tiger Red").b,
                                    status: data.find((d) => d.nat === "Tiger Red").gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Tiger.Red,
                            Card: data.find((d) => d.nat.startsWith("Tiger Card"))
                                ? {
                                    ...section.Tiger.Card,

                                    odds: data.find((d) => d.nat.startsWith("Tiger Card")).b,
                                    status: data.find((d) => d.nat.startsWith("Tiger Card")).gstatus === 'OPEN' ? '' : 'suspended-box',

                                }
                                : section.Tiger.Card
                        }
                    };
                }


                // No changes for sections that don't match
                return section;
            });
        });
    };
    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState({});

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const {match_id} = useParams();
    const {
        setBetType,
        betType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    


    const [hideLoading, setHideLoading] = useState(true)
    const ruleImage = '/img/rules/dt20.jpg'
    const ruleDescription = '';

    

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);

    // Async function to update exposures/amounts
    const updateAmounts = async () => {
        if (!sportList.id || !roundId) return;
        // Main market exposures
        const [dragonRes, tieRes, tigerRes, pairRes] = await Promise.all([
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Dragon', match_id, 'ODDS'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Tie', match_id, 'TIE'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Tiger', match_id, 'ODDS'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Pair', match_id, 'PAIR'),
        ]);

        // Side market exposures
        const [
            dragonEven, dragonOdd, dragonRed, dragonBlack,
            tigerEven, tigerOdd, tigerRed, tigerBlack
        ] = await Promise.all([
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Dragon Even', match_id, 'DRAGON_ODD_EVEN'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Dragon Odd', match_id, 'DRAGON_ODD_EVEN'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Dragon Red', match_id, 'DRAGON_RED_BLACK'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Dragon Black', match_id, 'DRAGON_RED_BLACK'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Tiger Even', match_id, 'TIGER_ODD_EVEN'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Tiger Odd', match_id, 'TIGER_ODD_EVEN'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Tiger Red', match_id, 'TIGER_RED_BLACK'),
            getExBySingleTeamNameCasino(sportList.id, roundId, 'Tiger Black', match_id, 'TIGER_RED_BLACK'),
        ]);

        
        
        // Card exposures for Dragon and Tiger (A,2,3,...,K)
        const dragonCardNames = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
        const tigerCardNames = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
        const dragonCardPromises = dragonCardNames.map(card =>
            getExBySingleTeamNameCasino(sportList.id, roundId, `Dragon Card ${card}`, match_id, 'DRAGON_SINGLE')
        );
        const tigerCardPromises = tigerCardNames.map(card =>
            getExBySingleTeamNameCasino(sportList.id, roundId, `Tiger Card ${card}`, match_id, 'TIGER_SINGLE')
        );
        const dragonCardResults = await Promise.all(dragonCardPromises);
        const tigerCardResults = await Promise.all(tigerCardPromises);

        setTotalPlayers(prevState => prevState.map((section, index) => {
            if (index === 0) {
                
                
                return {
                    ...section,
                    Dragon: { ...section.Dragon, amounts: dragonRes.data|| '' },
                    Tie: { ...section.Tie, amounts: tieRes.data|| '' },
                    Tiger: { ...section.Tiger, amounts: tigerRes.data|| '' },
                    Pair: { ...section.Pair, amounts: pairRes.data|| '' }
                };
            }
            if (index === 1 && section.Dragon) {
                return {
                    ...section,
                    Dragon: {
                        ...section.Dragon,
                        Even: { ...section.Dragon.Even, amounts: dragonEven.data|| '' },
                        Odd: { ...section.Dragon.Odd, amounts: dragonOdd.data|| '' },
                        Red: { ...section.Dragon.Red, amounts: dragonRed.data|| '' },
                        Black: { ...section.Dragon.Black, amounts: dragonBlack.data|| '' },
                        Card: {
                            ...section.Dragon.Card,
                            amounts: dragonCardResults.map(res => res.data|| '')
                        }
                    }
                };
            }
            if (index === 2 && section.Tiger) {
                return {
                    ...section,
                    Tiger: {
                        ...section.Tiger,
                        Even: { ...section.Tiger.Even, amounts: tigerEven.data|| '' },
                        Odd: { ...section.Tiger.Odd, amounts: tigerOdd.data|| '' },
                        Red: { ...section.Tiger.Red, amounts: tigerRed.data|| '' },
                        Black: { ...section.Tiger.Black, amounts: tigerBlack.data|| '' },
                        Card: {
                            ...section.Tiger.Card,
                            amounts: tigerCardResults.map(res => res.data|| '')
                        }
                    }
                };
            }
            return section;
        }));
    };

 
    useEffect(() => {
        updateAmounts();
        
    }, [sportLength, roundId]);


    useEffect(() => {

        if (data?.sub) {
            updateOdds(data)
            
            // Update playerStatuses dynamically for each player individually
            const newPlayerStatuses = {};
            
            // Update status for each player based on their individual status from data.sub
            data.sub.forEach(item => {
                const playerStatus = item.gstatus === 'OPEN' ? '' : 'suspended-box';
                newPlayerStatuses[item.nat] = playerStatus;
            });
            
            setPlayerStatuses(newPlayerStatuses);
        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: cardArray.slice(0, 3),

            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);


    useEffect(() => {

        if (sportLength > 0) {

            // Call fetchData without any parameter or with 'cards' as needed
            fetchDataDragonTiger(data, sportList, match_id, roundId, TOTALPLAYERS, setTotalPlayers, betType, 'all')
        }
    }, [exposure, sportLength, roundId, mybetModel.length]);

    const openPopup = (isBakOrLay, teamnam, oddvalue, betType) => {
        setBetType(betType)


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

    // Helper function to find data in data.sub for Dt201
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Dt201, find the item by nat field
        return data.sub.find(item => item.nat === teamName);
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
    }

    const renderCards = (cards, player) => (
        <div className="flip-card-container">
            {cards?.map((card, index) => {
                const imgSrc = card ? `/img/casino/cards/${card}.png` : '/img/casino/cards/1.png';
                return (
                    <div className="flip-card" key={index}>
                        <div className="flip-card-inner ">
                            <div className="flip-card-front">
                                <img src={imgSrc} alt={`${player} card ${index + 1}`}/>
                            </div>
                            <div className="flip-card-back">
                                <img src={imgSrc} alt={`${player} card ${index + 1}`}/>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
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
            betType,
            stakeValue,
            match_id: 'dt20',
            roundIdSaved,
            totalPlayers: TOTALPLAYERS[0].Dragon,
            playerStatuses,
            setHideLoading,
            setPopupDisplayForDesktop,
            setSubmitButtonDisable,
            resetBetFields,
            profitData,
            getBalance,
            updateAmounts,
            Notify
        };

        const success = await placeCasinoBet(betData, {
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
            onSuccess: () => {
                if (betType === 'TIGER_SINGLE' || betType === 'DRAGON_SINGLE') {
                    fetchDataDragonTiger(data, sportList, match_id, roundId, TOTALPLAYERS, setTotalPlayers, betType, 'cards');
                } else {
                    fetchDataDragonTiger(data, sportList, match_id, roundId, TOTALPLAYERS, setTotalPlayers, betType, 'odds');
                }
                updateAmounts();
            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
           
                <div className="video-overlay">
                    <div className="casino-video-cards">
                        <div className="d-flex flex-wrap justify-content-between">
                            <div>
                                {renderCards(cards.playerA, "Player A")}
                            </div>
                        </div>
                    </div>
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

        <CasinoLayout raceClass="dt20" ruleImage={ruleImage} ruleDescription={ruleDescription} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname}
                      handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-table">
                <div className="casino-table-full-box">
                    {Object.keys(TOTALPLAYERS[0]).map(player => (
                        <div className={`dt20-odd-box dt20${player.toLowerCase()}`} key={player}>
                            <div className="casino-odds text-center">{TOTALPLAYERS[0][player]?.odds}</div>
                            <div className={`casino-odds-box back casino-odds-box-theme ${TOTALPLAYERS[0][player]?.status}`}
                                 onClick={() => openPopup('back', player, TOTALPLAYERS[0][player]?.odds, player === 'Tie' ? 'TIE' : player === 'Pair' ? 'PAIR' : 'ODDS')}>
                                <span className="casino-odds">{player}</span>
                            </div>
                            <div className="casino-nation-book text-center">
                                <b className="text-danger">
                                    {getExByColor(TOTALPLAYERS[0][player]?.amounts)}
                                </b>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="casino-table-box mt-3">
                    {TOTALPLAYERS.slice(1).map((playerObj, index) => {
                        // Extract the player name and details
                        const playerName = Object.keys(playerObj)[0];
                        const playerDetails = playerObj[playerName];
                        // Variables similar to Blade template
                        const evenD = playerDetails.Even?.odds;
                        const oddD = playerDetails.Odd?.odds;
                        const redD = playerDetails.Red?.odds;
                        const blackD = playerDetails.Black?.odds;
                        const evenDStatus = playerDetails.Even?.status;
                        const oddDStatus = playerDetails.Odd?.status;
                        const redDStatus = playerDetails.Red?.status;
                        const blackDStatus = playerDetails.Black?.status;

                        return (
                            <div className={`casino-table-${index === 0 ? 'left' : 'right'}-box`} key={index}>
                                <h4 className="w-100 text-center mb-2"><b>{playerName.toUpperCase()}</b></h4>
                                <div className="dt20-odd-box dt20odds">
                                    <div className="casino-odds text-center">{evenD}</div>
                                    <div className={`casino-odds-box back casino-odds-box-theme ${evenDStatus}`}
                                         onClick={() => openPopup('back', playerName + " Even", evenD, playerName.toUpperCase() + "_ODD_EVEN")}>
                                        <span className="casino-odds">Even</span>
                                    </div>
                                    <div className="casino-nation-book text-center">
                                        <b className="text-danger">
                                            {getExByColor(playerDetails.Even?.amounts)}
                                        </b>
                                    </div>
                                </div>
                                <div className="dt20-odd-box dt20odds">
                                    <div className="casino-odds text-center">{oddD}</div>
                                    <div className={`casino-odds-box back casino-odds-box-theme ${oddDStatus}`}
                                         onClick={() => openPopup('back', playerName + " Odd", oddD, playerName.toUpperCase() + "_ODD_EVEN")}>
                                        <span className="casino-odds">Odd</span>
                                    </div>
                                    <div className="casino-nation-book text-center">
                                        <b className="text-danger">
                                            {getExByColor(playerDetails.Odd?.amounts)}
                                        </b>
                                    </div>
                                </div>
                                <div className="dt20-odd-box dt20odds">
                                    <div className="casino-odds text-center">{redD}</div>
                                    <div className={`casino-odds-box back casino-odds-box-theme ${redDStatus}`}
                                         onClick={() => openPopup('back', playerName + " Red", redD, playerName.toUpperCase() + "_RED_BLACK")}>
                                        <div className="casino-odds">
                                            <span className="card-icon ms-1"><span className="card-red ">{"{"}</span></span>
                                            <span className="card-icon ms-1"><span className="card-red ">[</span></span>
                                        </div>
                                    </div>
                                    <div className="casino-nation-book text-center">
                                        <b className="text-danger">
                                            {getExByColor(playerDetails.Red?.amounts)}
                                        </b>
                                    </div>
                                </div>
                                <div className="dt20-odd-box dt20odds">
                                    <div className="casino-odds text-center">{blackD}</div>
                                    <div className={`casino-odds-box back casino-odds-box-theme ${blackDStatus}`}
                                         onClick={() => openPopup('back', playerName + " Black", blackD, playerName.toUpperCase() + "_RED_BLACK")}>
                                        <div className="casino-odds">
                                            <span className="card-icon ms-1"><span className="card-black ">{"}"}</span></span>
                                            <span className="card-icon ms-1"><span className="card-black ">]</span></span>
                                        </div>
                                    </div>
                                    <div className="casino-nation-book text-center">
                                        <b className="text-danger">
                                            {getExByColor(playerDetails.Black?.amounts)}
                                        </b>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="casino-table-box mt-3">
                    {TOTALPLAYERS.slice(1).map((playerObj, index) => {
                        // Extract the player name and details
                        const playerName = Object.keys(playerObj)[0];
                        const playerDetails = playerObj[playerName];
                        const card_odds = playerDetails.Card?.odds;
                        const card_oddsStatus = playerDetails.Card?.status;

                        return (
                            <div className={`casino-table-${index === 0 ? 'left' : 'right'}-box`} key={index}>
                                <div className="dt20cards">
                                    <h4 className="w-100 text-center mb-2"><b>{playerName.toUpperCase()} {card_odds}</b></h4>
                                    {Array.from({length: 13}, (_, cardIndex) => {
                                        const cardNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
                                        return (
                                            <div className="card-odd-box" key={cardIndex}>
                                                <div className={card_oddsStatus}
                                                     onClick={() => openPopup('back', playerName + " Card " + cardMap(cardIndex), card_odds, playerName.toUpperCase() + "_SINGLE")}>
                                                    <img src={`/img/card/${cardNames[cardIndex]}.jpg`}
                                                         alt={`Card ${cardNames[cardIndex]}`}/>
                                                </div>
                                                <div className="casino-nation-book text-center">
                                                    <b className="text-danger">
                                                        {getExByColor(playerDetails.Card?.amounts[cardIndex])}
                                                    </b>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="casino-remark mt-1">
                    <marquee scrollamount="3">{remark.current}</marquee>
                </div>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </div>


        </CasinoLayout>
    )
        ;

};


export default Dt201;
