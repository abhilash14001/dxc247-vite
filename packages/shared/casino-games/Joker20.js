import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import {
    getExByTeamNameForCasino, getExBySingleTeamNameCasino, resetBetFields, placeCasinoBet, getExByColor
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";


const Joker20 = () => {
    const [roundId, setRoundId] = useState('')

    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(true)

    const [cards, setCards] = useState({});

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const { match_id } = useParams();
    const isOneDay = match_id.includes('20') ? false : true;

    // Function to generate ruleDescription with local image URLs
    const getRuleDescription = () => {
        return `<div><style type="text/css">
    .rules-section .row.row5 {
        margin-left: -5px;
        margin-right: -5px;
    }

    .rules-section .pl-2 {
        padding-left: .5rem !important;
    }

    .rules-section .pr-2 {
        padding-right: .5rem !important;
    }

    .rules-section .row.row5>[class*="col-"],
    .rules-section .row.row5>[class*="col"] {
        padding-left: 5px;
        padding-right: 5px;
    }

    .rules-section {
        text-align: left;
        margin-bottom: 10px;
    }

    .rules-section .table {
        color: #fff;
        border: 1px solid #444;
        background-color: #222;
        font-size: 12px;
    }

    .rules-section .table td,
    .rules-section .table th {
        border-bottom: 1px solid #444;
    }

    .rules-section ul li,
    .rules-section p {
        margin-bottom: 5px;
    }

    .rules-section::-webkit-scrollbar {
        width: 8px;
    }

    .rules-section::-webkit-scrollbar-track {
        background: #666666;
    }

    .rules-section::-webkit-scrollbar-thumb {
        background-color: #333333;
    }

    .rules-section .rules-highlight {
        color: #FDCF13;
        font-size: 16px;
    }

    .rules-section .rules-sub-highlight {
        color: #FDCF13;
        font-size: 14px;
    }

    .rules-section .list-style,
    .rules-section .list-style li {
        list-style: disc;
    }

    .rules-section .rule-card {
        height: 20px;
        margin-left: 5px;
    }

    .rules-section .card-character {
        font-family: Card Characters;
    }

    .rules-section .red-card {
        color: red;
    }

    .rules-section .black-card {
        color: black;
    }

    .rules-section .cards-box {
        background: #fff;
        padding: 6px;
        display: inline-block;
        color: #000;
        min-width: 150px;
    }
    </style>

<div class="rules-section">
                                                <p>Welcome to JOKER TEENPATTI 20-20, a new version of Indian Teenpatti game.</p>
                                                <p>Teenpatti is a very simple game and one of the most played games on our platform. To keep the game as simple as it is and make it more exciting , we have introduced a Joker to the game. The game follows the same standard rules of Teenpatti but The Joker can act as any missing or highest card to make a high hand to defeat the opponent player. You can also do side bets on Joker before the round starts.</p>
                                                <p>For Example:</p>
                                                <img src="/img/casino/rules/joker1.jpg" class="img-fluid">
                                                <p>Player A wins because THE JOKER can act as the highest card.</p>
                                                <img src="/img/casino/rules/joker2.jpg" class="img-fluid">
                                                <p>Player A wins because THE JOKER can act as the highest color card.</p>
                                                <h4>Standard Rules.</h4>
                                                <div>
                                                    <img src="/img/casino/rules/teen6.jpg" class="img-fluid">
                                                </div>
                                            </div></div>`;
    };
    const {
        betType,
        setBetType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)
    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0); // Example player A value
    const [playerStatuses, setPlayerStatuses] = useState({});
    const [playerA_Back, setPlayerA_Back] = useState(0);
    const [playerB_Back, setPlayerB_Back] = useState(0);
    const [playerA_Lay, setPlayerA_Lay] = useState(0);
    const [playerB, setPlayerB] = useState(0); // Example player B value
    const [playerB_Lay, setPlayerB_Lay] = useState(0);
    
    // Joker betting options state
    const [jokerOdds, setJokerOdds] = useState({});
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        

        if (data?.sub) {
            // Update main players (Player A and Player B)
            updatePlayerStats(data.sub[0], setPlayerA_Back, setPlayerA_Lay, "Player A");
            updatePlayerStats(data.sub[1], setPlayerB_Back, setPlayerB_Lay, "Player B");

            // Update joker betting options
            const jokerData = {};
            data.sub.forEach(item => {
                jokerData[item.nat] = {
                    back: item.b,
                    lay: item.l,
                    status: item.gstatus === "SUSPENDED" ? "suspended-box" : "",
                    amounts: jokerOdds[item.nat]?.amounts,
                    
                };
            });
            setJokerOdds(jokerData);
        }
    }, [data?.sub]);


    

    useEffect(() => {
        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());

            let playerACards = cardArray.filter((_, index) => index % 2 !== 0);
            let playerBCards = cardArray.filter((_, index) => index % 2 === 0 && index !== 0);


            setCards({
                joker: [cardArray[0]],
                playerA: playerACards,
                playerB: playerBCards,
            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data?.card]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;

    useEffect(() => {
        if (sportList?.id) {
            refreshAllExposures();
        }
    }, [exposure, roundId, sportList?.id]);

    const updatePlayerStats = (playerData, setPlayerBack, setPlayerLay, playerName, teamsession) => {
        if (!playerData) return;
        let playerStatus = '';
        if (playerData.gstatus === "SUSPENDED") {
            playerStatus = "suspended-box";

        }
        setPlayerStatuses(prev => ({ ...prev, [playerName]: playerStatus }));

        if (playerData.b) {
            setPlayerBack(playerData.b);
        } else {
            setPlayerBack(0);
        }
        if (playerData.l) {
            setPlayerLay(playerData.l);
        } else {
            setPlayerLay(0);
        }
    };
    const openPopup = (isBakOrLay, teamnam, oddvalue) => {
        // Set bet type based on team name
        if (teamnam.startsWith('Joker')) {
            if (teamnam.includes('Even') || teamnam.includes('Odd')) {
                setBetType('ODD_EVEN');
            } else if (teamnam.includes('Red') || teamnam.includes('Black')) {
                setBetType('RED_BLACK');
            } else if (teamnam.includes('Spade') || teamnam.includes('Heart') || teamnam.includes('Diamond') || teamnam.includes('Club')) {
                setBetType('SUITS');
            }
        } else {
            setBetType('BOOKMAKER');
        }

        if (parseFloat(oddvalue) > 0) {
            roundIdSaved.current = roundId
            setbackOrLay(isBakOrLay)
            setPopupDisplayForDesktop(true);
            
            teamname.current = teamnam
            setOdds(oddvalue)
        } else {
            Notify("Odds Should Not Be Zero", null, null, 'danger')
        }
    }

    // Helper function to find data in data.sub for Teen
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Teen, find the item by nat field
        return data.sub.find(item => item.nat.toUpperCase() === teamName.toUpperCase());
    };
    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds
        if (submitButtonDisable === true) {
            setSubmitButtonDisable(false)
        }
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
                                <img src={imgSrc} alt={`${player} card ${index + 1}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );


    const refreshAllExposures = () => {
        const jokerTeamNames = ['Player A', 'Player B', 'Joker Even', 'Joker Odd', 'Joker Red', 'Joker Black', 'Joker Spade', 'Joker Heart', 'Joker Diamond', 'Joker Club'];
        
        jokerTeamNames.forEach(teamName => {
            if (teamName === 'Player A' || teamName === 'Player B') {
                // Use getExByTeamNameForCasino for Player A and Player B
                getExByTeamNameForCasino(sportList.id, roundId, teamName, match_id, 'BOOKMAKER').then(res => {
                    if (teamName === 'Player A') {
                        setPlayerA(res.data);
                    } else if (teamName === 'Player B') {
                        setPlayerB(res.data);
                    }
                });
            } else {
                // Use getExBySingleTeamNameCasino for all Joker betting options
                let bet_is_type = 'BOOKMAKER';
                
                if (teamName.includes('Even') || teamName.includes('Odd')) {
                    bet_is_type = 'ODD_EVEN';
                } else if (teamName.includes('Red') || teamName.includes('Black')) {
                    bet_is_type = 'RED_BLACK';
                } else if (teamName.includes('Spade') || teamName.includes('Heart') || teamName.includes('Diamond') || teamName.includes('Club')) {
                    bet_is_type = 'SUITS';
                }
                
                getExBySingleTeamNameCasino(sportList.id, roundId, teamName, match_id, bet_is_type).then(res => {
                    setJokerOdds(prev => ({
                        ...prev,
                        [teamName]: { ...prev[teamName], amounts: res.data }
                    }));
                });
            }
        });
    };

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
            match_id,
            roundIdSaved,
            totalPlayers: Object.keys(playerStatuses).length > 0 ? playerStatuses : null,
            playerStatuses,
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
                refreshAllExposures();
            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
            
                <div className="video-overlay">
                    <div className="casino-video-cards">
                    <div className="joker-card"><h5 className="text-playerb">Joker</h5>
                    {renderCards(cards.joker, "Joker")}
                    </div>
                        <div>
                            <h5>Player A</h5>
                            {renderCards(cards.playerA, "Player A")}
                        </div>
                        <div className="mt-1">
                            <h5>Player B</h5>
                            {renderCards(cards.playerB, "Player B")}
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
        <CasinoLayout ruleDescription={getRuleDescription()} raceClass="teenpatti-joker" hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
            stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
            submitButtonDisable={submitButtonDisable} setSubmitButton={setSubmitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
            sportList={sportList}
            setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
            getMinMaxLimits={getMinMaxLimits}>
                {Object.keys(jokerOdds).length > 0 && (
            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-box">
                        {/* Main Player Table */}
                        <div className="casino-table-left-box">
                            <div className="casino-table-header">
                                <div className="casino-nation-detail"></div>
                                <div className="casino-odds-box back">Back</div>
                                <div className="casino-odds-box lay">Lay</div>
                            </div>
                            <div className="casino-table-body">
                                <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">Player A</div>
                                        <p className="m-b-0">
                                            <span className={`font-weight-bold ${playerA >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {playerA}
                                            </span>
                                        </p>
                                    </div>
                                    <div className={`casino-odds-box back ${playerStatuses["Player A"] || ""}`} 
                                         onClick={() => openPopup('back', 'Player A', playerA_Back)}>
                                        <span className="casino-odds">{playerA_Back}</span>
                                    </div>
                                    <div className={`casino-odds-box lay ${playerStatuses["Player A"] || ""}`} 
                                         onClick={() => openPopup('lay', 'Player A', playerA_Lay)}>
                                        <span className="casino-odds">{playerA_Lay}</span>
                                    </div>
                                </div>
                                <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">Player B</div>
                                        <p className="m-b-0">
                                            <span className={`font-weight-bold ${playerB >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {playerB}
                                            </span>
                                        </p>
                                    </div>
                                    <div className={`casino-odds-box back ${playerStatuses["Player B"] || ""}`} 
                                         onClick={() => openPopup('back', 'Player B', playerB_Back)}>
                                        <span className="casino-odds">{playerB_Back}</span>
                                    </div>
                                    <div className={`casino-odds-box lay ${playerStatuses["Player B"] || ""}`} 
                                         onClick={() => openPopup('lay', 'Player B', playerB_Lay)}>
                                        <span className="casino-odds">{playerB_Lay}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Joker Even/Odd and Red/Black Table */}
                        <div className="casino-table-right-box joker-other-odds">
                            <div className="joker-other-odds">
                                <div className="casino-table-header">
                                    <div className="casino-nation-detail"></div>
                                    <div className="casino-odds-box">Even</div>
                                    <div className="casino-odds-box">Odd</div>
                                    <div className="casino-odds-box">
                                        <span>Red</span>
                                        <span className="card-icon ms-1">
                                            <span className="card-red">♥</span>
                                            <span className="card-red">♦</span>
                                        </span>
                                    </div>
                                    <div className="casino-odds-box">
                                        <span>Black</span>
                                        <span className="card-icon ms-1">
                                            <span className="card-black">♠</span>
                                            <span className="card-black">♣</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="casino-table-body">
                                    <div className="casino-table-row">
                                        <div className="casino-nation-detail">
                                            <div className="casino-nation-name">Joker</div>
                                            
                                        </div>
                                        <div className={`casino-odds-box back ${jokerOdds["Joker Even"]?.status}`} 
                                             onClick={() => openPopup('back', 'Joker Even', jokerOdds["Joker Even"]?.back || 0)}>
                                            <span className="casino-odds">{jokerOdds["Joker Even"]?.back || 0}</span>
                                            {getExByColor(jokerOdds["Joker Even"]?.amounts, )}
                                        </div>
                                        <div className={`casino-odds-box back ${jokerOdds["Joker Odd"]?.status}`} 
                                             onClick={() => openPopup('back', 'Joker Odd', jokerOdds["Joker Odd"]?.back || 0)}>
                                            <span className="casino-odds">{jokerOdds["Joker Odd"]?.back || 0}</span>
                                            {getExByColor(jokerOdds["Joker Odd"]?.amounts)}
                                        </div>
                                        <div className={`casino-odds-box back ${jokerOdds["Joker Red"]?.status}`} 
                                             onClick={() => openPopup('back', 'Joker Red', jokerOdds["Joker Red"]?.back || 0)}>
                                            <span className="casino-odds">{jokerOdds["Joker Red"]?.back || 0}</span>
                                            {getExByColor(jokerOdds["Joker Red"]?.amounts)}
                                        </div>
                                        <div className={`casino-odds-box back ${jokerOdds["Joker Black"]?.status}`} 
                                             onClick={() => openPopup('back', 'Joker Black', jokerOdds["Joker Black"]?.back || 0)}>
                                            <span className="casino-odds">{jokerOdds["Joker Black"]?.back || 0}</span>
                                            {getExByColor(jokerOdds["Joker Black"]?.amounts)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Joker Suits Table */}
                            <div className="joker-other-odds dtredblack">
                                <div className="casino-table-header">
                                    <div className="casino-nation-detail"></div>
                                    <div className="casino-odds-box">
                                        <span className="card-icon ms-1">
                                            <span className="card-black">♠</span>
                                        </span>
                                    </div>
                                    <div className="casino-odds-box">
                                        <span className="card-icon ms-1">
                                            <span className="card-red">♥</span>
                                        </span>
                                    </div>
                                    <div className="casino-odds-box">
                                        <span className="card-icon ms-1">
                                            <span className="card-red">♦</span>
                                        </span>
                                    </div>
                                    <div className="casino-odds-box">
                                        <span className="card-icon ms-1">
                                            <span className="card-black">♣</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="casino-table-body">
                                    <div className="casino-table-row">
                                        <div className="casino-nation-detail">
                                            <div className="casino-nation-name">Joker</div>
                                            
                                        </div>
                                        <div className={`casino-odds-box back ${jokerOdds["Joker Spade"]?.status}`} 
                                             onClick={() => openPopup('back', 'Joker Spade', jokerOdds["Joker Spade"]?.back || 0)}>
                                            <span className="casino-odds">{jokerOdds["Joker Spade"]?.back || 0}</span>
                                            {getExByColor(jokerOdds["Joker Spade"]?.amounts)}
                                        </div>
                                        <div className={`casino-odds-box back ${jokerOdds["Joker Heart"]?.status}`} 
                                             onClick={() => openPopup('back', 'Joker Heart', jokerOdds["Joker Heart"]?.back || 0)}>
                                            <span className="casino-odds">{jokerOdds["Joker Heart"]?.back || 0}</span>
                                            {getExByColor(jokerOdds["Joker Heart"]?.amounts)}
                                        </div>
                                        <div className={`casino-odds-box back ${jokerOdds["Joker Diamond"]?.status}`} 
                                             onClick={() => openPopup('back', 'Joker Diamond', jokerOdds["Joker Diamond"]?.back || 0)}>
                                            <span className="casino-odds">{jokerOdds["Joker Diamond"]?.back || 0}</span>
                                            {getExByColor(jokerOdds["Joker Diamond"]?.amounts)}
                                        </div>
                                        <div className={`casino-odds-box back ${jokerOdds["Joker Club"]?.status}`} 
                                             onClick={() => openPopup('back', 'Joker Club', jokerOdds["Joker Club"]?.back || 0)}>
                                            <span className="casino-odds">{jokerOdds["Joker Club"]?.back || 0}</span>
                                            {getExByColor(jokerOdds["Joker Club"]?.amounts)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data} />
                </div>
            </div>
            )}


        </CasinoLayout>
    );

};

export default Joker20;