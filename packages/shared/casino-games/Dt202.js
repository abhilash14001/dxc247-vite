import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    cardMap, getExByColor, resetBetFields, getExBySingleTeamNameCasino, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Dt202 = () => {
    const {fetchDataDragonTiger, mybetModel} = useContext(CasinoContext)
    const {getBalance} = useContext(AuthContext)
    const [roundId, setRoundId] = useState('')
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
        
        // Update playerStatuses
        const newPlayerStatuses = {};
        data.forEach(item => {
            newPlayerStatuses[item.nat] = item.gstatus === 'OPEN' ? '' : 'suspended-box';
        });
        setPlayerStatuses(newPlayerStatuses);
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

    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({});
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {

        if (data?.sub) {
            updateOdds(data)

        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: cardArray.slice(0, 3),

            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);


    const exposure = exposureCheck()
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (sportLength > 0) {
            // Call fetchData without any parameter or with 'cards' as needed
            fetchDataDragonTiger(data, sportList,match_id, roundId,TOTALPLAYERS, setTotalPlayers,betType,'all')

        }
    }, [exposure, sportLength, roundId, mybetModel.length]);

    useEffect(() => {
        updateAmounts();
        
    }, [sportLength, roundId]);

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

    // Helper function to find data in data.sub for Dt202
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Dt202, find the item by nat field
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

    // Async function to update exposures/amounts
    const updateAmounts = async () => {
        if (!sportList.id || !roundId) return;
        
        // For dt202, we need to get all exposures in one call since it uses dt20casino method
        const allExposures = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '');
        
        // Helper function to find amount by team_name and type
        const findAmount = (teamName, type) => {
            if (!allExposures.data || !Array.isArray(allExposures.data)) return '';
            const found = allExposures.data.find(item => 
                item.team_name === teamName && item.type === type
            );
            return found ? found.total_amount : '';
        };

        setTotalPlayers(prevState => prevState.map((section, index) => {
            if (index === 0) {
        
                
                return {
                    ...section,
                    Dragon: { ...section.Dragon, amounts: findAmount('Dragon', 'ODDS') },
                    Tie: { ...section.Tie, amounts: findAmount('Tie', 'TIE') },
                    Tiger: { ...section.Tiger, amounts: findAmount('Tiger', 'ODDS') },
                    Pair: { ...section.Pair, amounts: findAmount('Pair', 'PAIR') }
                };
            }
            if (index === 1 && section.Dragon) {
                return {
                    ...section,
                    Dragon: {
                        ...section.Dragon,
                        Even: { ...section.Dragon.Even, amounts: findAmount('Dragon Even', 'DRAGON_ODD_EVEN') },
                        Odd: { ...section.Dragon.Odd, amounts: findAmount('Dragon Odd', 'DRAGON_ODD_EVEN') },
                        Red: { ...section.Dragon.Red, amounts: findAmount('Dragon Red', 'DRAGON_RED_BLACK') },
                        Black: { ...section.Dragon.Black, amounts: findAmount('Dragon Black', 'DRAGON_RED_BLACK') },
                        Card: {
                            ...section.Dragon.Card,
                            amounts: ['A','2','3','4','5','6','7','8','9','10','J','Q','K'].map(card => 
                                findAmount(`Dragon Card ${card}`, 'DRAGON_SINGLE')
                            )
                        }
                    }
                };
            }
            if (index === 2 && section.Tiger) {
                return {
                    ...section,
                    Tiger: {
                        ...section.Tiger,
                        Even: { ...section.Tiger.Even, amounts: findAmount('Tiger Even', 'TIGER_ODD_EVEN') },
                        Odd: { ...section.Tiger.Odd, amounts: findAmount('Tiger Odd', 'TIGER_ODD_EVEN') },
                        Red: { ...section.Tiger.Red, amounts: findAmount('Tiger Red', 'TIGER_RED_BLACK') },
                        Black: { ...section.Tiger.Black, amounts: findAmount('Tiger Black', 'TIGER_RED_BLACK') },
                        Card: {
                            ...section.Tiger.Card,
                            amounts: ['A','2','3','4','5','6','7','8','9','10','J','Q','K'].map(card => 
                                findAmount(`Tiger Card ${card}`, 'TIGER_SINGLE')
                            )
                        }
                    }
                };
            }
            return section;
        }));
    };

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
            match_id: 'dt202',
            roundIdSaved,
            totalPlayers: TOTALPLAYERS[0].Dragon,
            playerStatuses: playerStatuses,
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
                fetchDataDragonTiger(data, sportList, match_id, roundId, TOTALPLAYERS, setTotalPlayers, betType, 'all');
                updateAmounts();
            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
            <div className="casino-video-cards">
                <div className="d-flex flex-wrap justify-content-between">
                    <div>
                        {renderCards(cards.playerA, "Player A")}
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
        <CasinoLayout raceClass="dt20" ruleImage={ruleImage} ruleDescription={ruleDescription} hideLoading={hideLoading}
                      isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      getMinMaxLimits={getMinMaxLimits}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}>
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
                    <div className="casino-table-left-box">
                        <h4 className="w-100 text-center mb-2"><b>DRAGON</b></h4>
                        {TOTALPLAYERS.slice(1).map((playerObj, index) => {
                            const playerName = Object.keys(playerObj)[0];
                            const playerDetails = playerObj[playerName];
                            
                            if (playerName === 'Dragon') {
                                return (

                                    <>
                                    
                                        <div className="dt20-odd-box dt20odds">
                                            <div className="casino-odds text-center">{playerDetails.Even?.odds}</div>
                                            <div className={`casino-odds-box back casino-odds-box-theme ${playerDetails.Even?.status}`}
                                                 onClick={() => openPopup('back', playerName + " Even", playerDetails.Even?.odds, playerName.toUpperCase() + "_ODD_EVEN")}>
                                                <span className="casino-odds">Even</span>
                                            </div>
                                            <div className="casino-nation-book text-center">
                                                <b className="text-danger">
                                                    {getExByColor(playerDetails.Even.amounts)}
                                                </b>
                                            </div>
                                        </div>
                                        <div className="dt20-odd-box dt20odds">
                                            <div className="casino-odds text-center">{playerDetails.Odd?.odds}</div>
                                            <div className={`casino-odds-box back casino-odds-box-theme ${playerDetails.Odd?.status}`}
                                                 onClick={() => openPopup('back', playerName + " Odd", playerDetails.Odd?.odds, playerName.toUpperCase() + "_ODD_EVEN")}>
                                                <span className="casino-odds">Odd</span>
                                            </div>
                                            <div className="casino-nation-book text-center">
                                                <b className="text-danger">
                                                    {getExByColor(playerDetails.Odd.amounts)}
                                                </b>
                                            </div>
                                        </div>
                                        <div className="dt20-odd-box dt20odds">
                                            <div className="casino-odds text-center">{playerDetails.Red?.odds}</div>
                                            <div className={`casino-odds-box back casino-odds-box-theme ${playerDetails.Red?.status}`}
                                                 onClick={() => openPopup('back', playerName + " Red", playerDetails.Red?.odds, playerName.toUpperCase() + "_RED_BLACK")}>
                                                <div className="casino-odds">
                                                    <span className="card-icon ms-1"><span className="card-red ">{"{"}</span></span>
                                                    <span className="card-icon ms-1"><span className="card-red ">[</span></span>
                                                </div>
                                            </div>
                                            <div className="casino-nation-book text-center">
                                                <b className="text-danger">
                                                    {getExByColor(playerDetails.Red.amounts)}
                                                </b>
                                            </div>
                                        </div>
                                        <div className="dt20-odd-box dt20odds">
                                            <div className="casino-odds text-center">{playerDetails.Black?.odds}</div>
                                            <div className={`casino-odds-box back casino-odds-box-theme ${playerDetails.Black?.status}`}
                                                 onClick={() => openPopup('back', playerName + " Black", playerDetails.Black?.odds, playerName.toUpperCase() + "_RED_BLACK")}>
                                                <div className="casino-odds">
                                                    <span className="card-icon ms-1"><span className="card-black ">{"}"}</span></span>
                                                    <span className="card-icon ms-1"><span className="card-black ">]</span></span>
                                                </div>
                                            </div>
                                            <div className="casino-nation-book text-center">
                                                <b className="text-danger">
                                                    {getExByColor(playerDetails.Black.amounts)}
                                                </b>
                                            </div>
                                        </div>
                                        </>
                                );
                            }
                            return null;
                        })}
                    </div>
                    <div className="casino-table-right-box">
                        <h4 className="w-100 text-center mb-2"><b>TIGER</b></h4>
                        {TOTALPLAYERS.slice(1).map((playerObj, index) => {
                            const playerName = Object.keys(playerObj)[0];
                            const playerDetails = playerObj[playerName];
                            
                            if (playerName === 'Tiger') {
                                return (
                                    <>
                                        <div className="dt20-odd-box dt20odds">
                                            <div className="casino-odds text-center">{playerDetails.Even?.odds}</div>
                                            <div className={`casino-odds-box back casino-odds-box-theme ${playerDetails.Even?.status}`}
                                                 onClick={() => openPopup('back', playerName + " Even", playerDetails.Even?.odds, playerName.toUpperCase() + "_ODD_EVEN")}>
                                                <span className="casino-odds">Even</span>
                                            </div>
                                            <div className="casino-nation-book text-center">
                                                <b className="text-danger">
                                                    {getExByColor(playerDetails.Even.amounts)}
                                                </b>
                                            </div>
                                        </div>
                                        <div className="dt20-odd-box dt20odds">
                                            <div className="casino-odds text-center">{playerDetails.Odd?.odds}</div>
                                            <div className={`casino-odds-box back casino-odds-box-theme ${playerDetails.Odd?.status}`}
                                                 onClick={() => openPopup('back', playerName + " Odd", playerDetails.Odd?.odds, playerName.toUpperCase() + "_ODD_EVEN")}>
                                                <span className="casino-odds">Odd</span>
                                            </div>
                                            <div className="casino-nation-book text-center">
                                                <b className="text-danger">
                                                    {getExByColor(playerDetails.Odd.amounts)}
                                                </b>
                                            </div>
                                        </div>
                                        <div className="dt20-odd-box dt20odds">
                                            <div className="casino-odds text-center">{playerDetails.Red?.odds}</div>
                                            <div className={`casino-odds-box back casino-odds-box-theme ${playerDetails.Red?.status}`}
                                                 onClick={() => openPopup('back', playerName + " Red", playerDetails.Red?.odds, playerName.toUpperCase() + "_RED_BLACK")}>
                                                <div className="casino-odds">
                                                    <span className="card-icon ms-1"><span className="card-red ">{"{"}</span></span>
                                                    <span className="card-icon ms-1"><span className="card-red ">[</span></span>
                                                </div>
                                            </div>
                                            <div className="casino-nation-book text-center">
                                                <b className="text-danger">
                                                    {getExByColor(playerDetails.Red.amounts)}
                                                </b>
                                            </div>
                                        </div>
                                        <div className="dt20-odd-box dt20odds">
                                            <div className="casino-odds text-center">{playerDetails.Black?.odds}</div>
                                            <div className={`casino-odds-box back casino-odds-box-theme ${playerDetails.Black?.status}`}
                                                 onClick={() => openPopup('back', playerName + " Black", playerDetails.Black?.odds, playerName.toUpperCase() + "_RED_BLACK")}>
                                                <div className="casino-odds">
                                                    <span className="card-icon ms-1"><span className="card-black ">{"}"}</span></span>
                                                    <span className="card-icon ms-1"><span className="card-black ">]</span></span>
                                                </div>
                                            </div>
                                            <div className="casino-nation-book text-center">
                                                <b className="text-danger">
                                                    {getExByColor(playerDetails.Black.amounts)}
                                                </b>
                                            </div>
                                        </div>
                                    </>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

                <div className="casino-table-box mt-3">
                    <div className="casino-table-left-box">
                        {TOTALPLAYERS.slice(1).map((playerObj, index) => {
                            const playerName = Object.keys(playerObj)[0];
                            const playerDetails = playerObj[playerName];
                            const card_odds = playerDetails.Card?.odds;
                            const card_oddsStatus = playerDetails.Card?.status;
                            const cardNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

                            if (playerName === 'Dragon') {
                                return (
                                    <>
                                    <div className="dt20cards" key={index}>
                                        <h4 className="w-100 text-center mb-2"><b>DRAGON {card_odds}</b></h4>
                                        {Array.from({length: 13}, (_, cardIndex) => (
                                            <div className="card-odd-box" key={cardIndex}>
                                                <div className={card_oddsStatus}
                                                     onClick={() => openPopup('back', playerName + " Card " + cardMap(cardIndex), card_odds, playerName.toUpperCase() + "_SINGLE")}>
                                                    <img src={`/img/casino/cards/${cardNames[cardIndex]}.jpg`}
                                                         alt={`Card ${cardNames[cardIndex]}`}/>
                                                </div>
                                                <div className="casino-nation-book text-center">
                                                    <b className="text-danger">
                                                        {getExByColor(playerDetails.Card?.amounts[cardIndex])}
                                                    </b>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    </>
                                );
                            }
                            return null;
                        })}
                    </div>
                    <div className="casino-table-right-box">
                        {TOTALPLAYERS.slice(1).map((playerObj, index) => {
                            const playerName = Object.keys(playerObj)[0];
                            const playerDetails = playerObj[playerName];
                            const card_odds = playerDetails.Card?.odds;
                            const card_oddsStatus = playerDetails.Card?.status;
                            const cardNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

                            if (playerName === 'Tiger') {
                                return (
                                    <>  
                                    <div className="dt20cards" key={index}>
                                        <h4 className="w-100 text-center mb-2"><b>TIGER {card_odds}</b></h4>
                                        {Array.from({length: 13}, (_, cardIndex) => (
                                            <div className="card-odd-box" key={cardIndex}>
                                                <div className={card_oddsStatus}
                                                     onClick={() => openPopup('back', playerName + " Card " + cardMap(cardIndex), card_odds, playerName.toUpperCase() + "_SINGLE")}>
                                                    <img src={`/img/casino/cards/${cardNames[cardIndex]}.jpg`}
                                                         alt={`Card ${cardNames[cardIndex]}`}/>
                                                </div>
                                                <div className="casino-nation-book text-center">
                                                    <b className="text-danger">
                                                        {getExByColor(playerDetails.Card?.amounts[cardIndex])}
                                                    </b>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    </>
                                );
                            }
                            return null;
                        })}
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


export default Dt202;
