import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Dt6 = () => {
    const {fetchDataDragonTigerDt6, mybetModel} = useContext(CasinoContext)

    const [roundId, setRoundId] = useState('')
    const [TOTALPLAYERS, setTotalPlayers] = useState({
        Dragon: {
            odds: {back: 0, lay: 0},
            status: 'suspended-box',
            amounts: '',
            Even: {odds: 0, status: 'suspended-box', amounts: ''},
            Odd: {odds: 0, status: 'suspended-box', amounts: ''},
            Black: {odds: 0, status: 'suspended-box', amounts: ''},
            Red: {odds: 0, status: 'suspended-box', amounts: ''},
            Spade: {odds: 0, status: 'suspended-box', amounts: ''},
            Heart: {odds: 0, status: 'suspended-box', amounts: ''},
            Club: {odds: 0, status: 'suspended-box', amounts: ''},
            Diamond: {odds: 0, status: 'suspended-box', amounts: ''}
        },
        Tiger: {
            odds: {back: 0, lay: 0},
            status: 'suspended-box',
            amounts: '',
            Even: {odds: 0, status: 'suspended-box', amounts: ''},
            Odd: {odds: 0, status: 'suspended-box', amounts: ''},
            Black: {odds: 0, status: 'suspended-box', amounts: ''},
            Red: {odds: 0, status: 'suspended-box', amounts: ''},
            Spade: {odds: 0, status: 'suspended-box', amounts: ''},
            Heart: {odds: 0, status: 'suspended-box', amounts: ''},
            Club: {odds: 0, status: 'suspended-box', amounts: ''},
            Diamond: {odds: 0, status: 'suspended-box', amounts: ''}
        },
        Pair: {
            odds: {back: 0, lay: 0},
            status: 'suspended-box',
            amounts: ''
        }
    });


    const updateOdds = (data) => {

        data = data.sub;


        setTotalPlayers((prevState) => {
            let newState = prevState;

            data.forEach(updates => {
                let {nat, b, gstatus, l} = updates;
                if (nat.includes(" ")) {
                    let [option, subOption] = nat.split(" ");
                    newState[option][subOption] = {
                        ...newState[option][subOption],
                        odds: b,
                        status: gstatus === 'OPEN' ? '' : 'suspended-box'
                    }
                    
                    // Update playerStatuses
                    setPlayerStatuses(prev => ({
                        ...prev,
                        [`${option} ${subOption}`]: gstatus === 'OPEN' ? '' : 'suspended-box'
                    }));
                } else {
                    newState[nat] = {
                        ...newState[nat],
                        odds: {
                            ...newState[nat].odds, // Preserve the existing odds
                            back: b,
                            lay: l
                        },
                        status: gstatus === 'OPEN' ? '' : 'suspended-box'
                    }
                    
                    // Update playerStatuses
                    setPlayerStatuses(prev => ({
                        ...prev,
                        [nat]: gstatus === 'OPEN' ? '' : 'suspended-box'
                    }));
                }
            })

            return newState;
        })

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
    const {getBalance} = useContext(AuthContext)
    const [hideLoading, setHideLoading] = useState(true)
    const ruleImage = '/img/rules/dt20.jpg'
    const ruleDescription = '';
    const exposure = localStorage.getItem('exposure')

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


    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (sportLength > 0) {

            fetchDataDragonTigerDt6(data, sportList, match_id, roundId, TOTALPLAYERS, setTotalPlayers, betType, 'all')

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

    // Helper function to find data in data.sub for Dt6
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Dt6, find the item by nat field
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
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <img src={imgSrc} alt={`${player} card ${index + 1}`}/>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const placeBet = async () => {
        let explodeTeamname;
        let isSuspended = false;

        if (teamname.current.includes(" ")) {
            explodeTeamname = teamname.current.split(" ");
            isSuspended = TOTALPLAYERS[explodeTeamname[0]][explodeTeamname[1]].status === 'suspended-box';
        } else {
            explodeTeamname = teamname.current;
            isSuspended = TOTALPLAYERS[explodeTeamname].status === 'suspended-box';
        }

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
            match_id: "DT6",
            roundIdSaved,
            totalPlayers: isSuspended ? { status: 'suspended-box' } : null,
            playerStatuses: playerStatuses,
            setHideLoading,
            setPopupDisplayForDesktop,
            setSubmitButtonDisable,
            resetBetFields,
            profitData,
            getBalance,
            updateAmounts: null,
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
                fetchDataDragonTigerDt6(data, sportList, match_id, roundId, TOTALPLAYERS, setTotalPlayers, betType, 'ODDS');
                //  is already handled by placeCasinoBet
            }
        });

        return success;
    }
    const dragon = TOTALPLAYERS.Dragon;

    const tiger = TOTALPLAYERS.Tiger;

    const pair = TOTALPLAYERS.Pair;


    const renderVideoBox = () => {
        return (
            
                <div className="video-overlay">
                    <div className="casino-video-cards">
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
        <CasinoLayout raceClass="dt1day" ruleDescription={ruleDescription} ruleImage={ruleImage} hideLoading={hideLoading}
                      isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      getMinMaxLimits={getMinMaxLimits}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}>
            <div className="casino-table">
                <div className="casino-table-box">
                    <div className="casino-table-left-box">
                        <div className="casino-table-header">
                            <div className="casino-nation-detail"></div>
                            <div className="casino-odds-box back">Back</div>
                            <div className="casino-odds-box lay">Lay</div>
                        </div>
                        <div className="casino-table-body">
                            <div className="casino-table-row">
                                <div className="casino-nation-detail">
                                    <div className="casino-nation-name">Dragon</div>
                                    <div className="casino- text-center">
                                        {getExByColor(dragon.amounts)}
                                    </div>
                                </div>
                                <div className={`casino-odds-box back ${dragon.status}`}
                                     onClick={() => openPopup('back', 'Dragon', dragon.odds.back, 'ODDS')}>
                                    <span className="casino-odds">{dragon.odds.back}</span>
                                </div>
                                <div className={`casino-odds-box lay ${dragon.status}`}
                                     onClick={() => openPopup('lay', 'Dragon', dragon.odds.lay, 'ODDS')}>
                                    <span className="casino-odds">{dragon.odds.lay}</span>
                                </div>
                            </div>
                            <div className="casino-table-row">
                                <div className="casino-nation-detail">
                                    <div className="casino-nation-name">Tiger</div>
                                    <div className="casino- text-center">
                                        {getExByColor(tiger.amounts)}
                                    </div>
                                </div>
                                <div className={`casino-odds-box back ${tiger.status}`}
                                     onClick={() => openPopup('back', 'Tiger', tiger.odds.back, 'ODDS')}>
                                    <span className="casino-odds">{tiger.odds.back}</span>
                                </div>
                                <div className={`casino-odds-box lay ${tiger.status}`}
                                     onClick={() => openPopup('lay', 'Tiger', tiger.odds.lay, 'ODDS')}>
                                    <span className="casino-odds">{tiger.odds.lay}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="casino-table-right-box dtpair">
                        <div className="casino-odds text-center">{pair.odds.back}</div>
                        <div className={`casino-odds-box back casino-odds-box-theme ${pair.status}`}
                             onClick={() => openPopup('back', 'Pair', pair.odds.back, 'PAIR')}>
                            <span className="casino-odds">Pair</span>
                        </div>
                        <div className="casino- text-center">
                            {getExByColor(pair.amounts)}
                        </div>
                    </div>
                </div>
                <div className="casino-table-box mt-3">
                    <div className="casino-table-left-box">
                        <div className="casino-table-header">
                            <div className="casino-nation-detail"></div>
                            <div className="casino-odds-box back">Even</div>
                            <div className="casino-odds-box back">Odd</div>
                        </div>
                        <div className="casino-table-body">
                            {['Dragon', 'Tiger'].map((player) => (
                                <div className="casino-table-row" key={player}>
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">{player}</div>
                                    </div>
                                    <div className={`casino-odds-box back ${TOTALPLAYERS[player]['Even'].status}`}
                                         onClick={() => openPopup('back', `${player} Even`, TOTALPLAYERS[player]['Even'].odds, `${player[0]}_EVEN_ODD`)}>
                                        <span className="casino-odds">{TOTALPLAYERS[player]['Even'].odds}</span>
                                        <div className="casino- text-center">
                                            {getExByColor(TOTALPLAYERS[player]['Even'].amounts)}
                                        </div>
                                    </div>
                                    <div className={`casino-odds-box back ${TOTALPLAYERS[player]['Odd'].status}`}
                                         onClick={() => openPopup('back', `${player} Odd`, TOTALPLAYERS[player]['Odd'].odds, `${player[0]}_EVEN_ODD`)}>
                                        <span className="casino-odds">{TOTALPLAYERS[player]['Odd'].odds}</span>
                                        <div className="casino- text-center">
                                            {getExByColor(TOTALPLAYERS[player]['Odd'].amounts)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="casino-table-right-box dtredblack">
                        <div className="casino-table-header">
                            <div className="casino-nation-detail"></div>
                            <div className="casino-odds-box back">
                                <span>Red</span>
                                <span className="card-icon ms-1"><span className="card-red ">{"{"}</span></span>
                                <span className="card-icon ms-1"><span className="card-red ">[</span></span>
                            </div>
                            <div className="casino-odds-box back">
                                <span>Black</span>
                                <span className="card-icon ms-1"><span className="card-black ">{"}"}</span></span>
                                <span className="card-icon ms-1"><span className="card-black ">]</span></span>
                            </div>
                        </div>
                        <div className="casino-table-body">
                            {['Dragon', 'Tiger'].map((player) => (
                                <div className="casino-table-row" key={player}>
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">{player}</div>
                                    </div>
                                    <div className={`casino-odds-box back ${TOTALPLAYERS[player]['Red'].status}`}
                                         onClick={() => openPopup('back', `${player} Red`, TOTALPLAYERS[player]['Red'].odds, `${player[0]}_RED_BLACK`)}>
                                        <span className="casino-odds">{TOTALPLAYERS[player]['Red'].odds}</span>
                                        <div className="casino- text-center">
                                            {getExByColor(TOTALPLAYERS[player]['Red'].amounts)}
                                        </div>
                                    </div>
                                    <div className={`casino-odds-box back ${TOTALPLAYERS[player]['Black'].status}`}
                                         onClick={() => openPopup('back', `${player} Black`, TOTALPLAYERS[player]['Black'].odds, `${player[0]}_RED_BLACK`)}>
                                        <span className="casino-odds">{TOTALPLAYERS[player]['Black'].odds}</span>
                                        <div className="casino- text-center">
                                            {getExByColor(TOTALPLAYERS[player]['Black'].amounts)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="casino-table-full-box dt1day-other-odds mt-3">
                    <div className="casino-table-header">
                        <div className="casino-nation-detail"></div>
                        {['Spade', 'Heart', 'Club', 'Diamond'].map((suit, index) => (
                            <div className="casino-odds-box" key={index}>
                                <span className="card-icon ms-1">
                                    <span className={`card-${suit.toLowerCase()}`}>
                                        {suit === 'Spade' ? '}' :
                                            suit === 'Heart' ? <span className="card-red">{'{'}</span> :
                                                suit === 'Club' ? ']' :
                                                    <span className="card-red">{'['}</span>}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="casino-table-body">
                        {['Dragon', 'Tiger'].map((player) => (
                            <div className="casino-table-row" key={player}>
                                <div className="casino-nation-detail">
                                    <div className="casino-nation-name">{player}</div>
                                </div>
                                {['Spade', 'Heart', 'Club', 'Diamond'].map((suit) => (
                                    <div key={suit} className={`casino-odds-box back ${TOTALPLAYERS[player][suit].status}`}
                                         onClick={() => openPopup('back', `${player} ${suit}`, TOTALPLAYERS[player][suit].odds, player === 'Dragon' ? 'D_COLOR' : 'T_COLOR')}>
                                        <span className="casino-odds">{TOTALPLAYERS[player][suit].odds}</span>
                                        <div className="casino- text-center">
                                            {getExByColor(TOTALPLAYERS[player][suit].amounts)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>


        </CasinoLayout>
    );

};


export default Dt6;
