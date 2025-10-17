import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Teen33 = () => {
    const [roundId, setRoundId] = useState('')


    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState({});

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
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)


    const desc = `<div><div><style type="text/css">
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
        .rules-section .row.row5 > [class*="col-"], .rules-section .row.row5 > [class*="col"] {
            padding-left: 5px;
            padding-right: 5px;
        }
        .rules-section
        {
            text-align: left;
            margin-bottom: 10px;
        }
        .rules-section .table
        {
            color: #fff;
            border:1px solid #444;
            background-color: #222;
            font-size: 12px;
        }
        .rules-section .table td, .rules-section .table th
        {
            border-bottom: 1px solid #444;
        }
        .rules-section ul li, .rules-section p
        {
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
        .rules-section .rules-highlight
        {
            color: #FDCF13;
            font-size: 16px;
        }
        .rules-section .rules-sub-highlight {
            color: #FDCF13;
            font-size: 14px;
        }
        .rules-section .list-style, .rules-section .list-style li
        {
            list-style: disc;
        }
        .rules-section .rule-card
        {
            height: 20px;
            margin-left: 5px;
        }
        .rules-section .card-character
        {
            font-family: Card Characters;
        }
        .rules-section .red-card
        {
            color: red;
        }
        .rules-section .black-card
        {
            color: black;
        }
        .rules-section .cards-box
        {
            background: #fff;
            padding: 6px;
            display: inline-block;
            color: #000;
            min-width: 150px;
        }
    </style>

<div className="rules-section">
                                                <ul className="pl-4 pr-4 list-style">
                                                    <li>Instant Teenpatti-3.0 is a shorter version of Indian origin game teenpatti.</li>
                                                    <li>This game is played with a regular 52 cards deck between player A and Player B.</li>
                                                    <li>In Instant Teenpatti 3.0 all three cards of Player A and first two cards of Player B will be pre-defined for all the games. These five cards will be permanently placed on the table</li>
                                                </ul>
                                            </div></div><div><div className="rules-section">
                                                <h6 className="rules-highlight">3 Pre-defined cards of Player A :</h6>
                                                <ul className="pl-4 pr-4 list-style">
                                                    <li>9 of Clubs</li>
                                                    <li>8 of Hearts</li>
                                                    <li>6 of Spades</li>
                                                </ul>
                                            </div></div><div><div className="rules-section">
                                                <h6 className="rules-highlight">2 Pre-defined cards of Player B:</h6>
                                                <ul className="pl-4 pr-4 list-style">
                                                    <li>9 of Diamonds</li>
                                                    <li>5 of Clubs</li>
                                                    <li>So now the game will begin with the remaining 47 cards</li>
                                                    <li>(52-5 pre-defined cards = 47)</li>
                                                    <li>Instant Teenpatti-3.0 is a one card game. One card will be dealt to Player B that will be the third and last card of player B which will decide the result of the game. Hence that particular game will be over.</li>
                                                    <li>Now always the last drawn card of player B will be removed and kept aside. Thereafter a new game will commence for the remaining 46 cards then the same process will continue till both the player have winning chances or otherwise upto 35 cards or so.</li>
                                                    <li>The objective of the game is to make the best three card hands as per the hand rankings and therefor win.</li>
                                                </ul>
                                            </div></div><div><div className="rules-section">
                                                <h6 className="rules-highlight">Rankings of cards hands from Highest to lowest:</h6>
                                                <ul className="pl-4 pr-4 list-style">
                                                    <li>1. Straight Flush (Pure Sequence)</li>
                                                    <li>2. Trail (Three of a kind)</li>
                                                    <li>3. Straight (Sequence)</li>
                                                    <li>4. Flush (Color)</li>
                                                    <li>5. Pair (Two of kind)</li>
                                                    <li>6. High Card</li>
                                                </ul>
                                            </div>
<div>You have betting options of Back and Lay.</div></div></div>`

    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0); // Example player A value
const [playerStatuses, setPlayerStatuses] = useState({ "Player A": '', "Player B": '' });
const [playerA_Back, setPlayerA_Back] = useState(0);
    const [playerB_Back, setPlayerB_Back] = useState(0);
    const [playerA_Lay, setPlayerA_Lay] = useState(0);
    const [playerB, setPlayerB] = useState(0); // Example player B value

    const [playerB_Lay, setPlayerB_Lay] = useState(0);
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        setBetType('BOOKMAKER')

        if (data?.sub) {
            updatePlayerStats(data.sub[0], setPlayerA_Back, setPlayerA_Lay, "Player A");
            updatePlayerStats(data.sub[1], setPlayerB_Back, setPlayerB_Lay, "Player B");

        }

        if (data.card) {
            const playerA = [], playerB = [];
            const cardArray = data.card.split(",").map(item => item.trim());

            for (let i = 0; i <= 5; i += 2) {
                let imgSrc = "1";

                if (cardArray[i] && cardArray[i].length > 0) {
                    imgSrc = cardArray[i];
                }

                playerA.push(imgSrc);
            }

            for (let i = 1; i <= 5; i += 2) {
                let imgSrc = "1";

                if (cardArray[i] && cardArray[i].length > 0) {
                    imgSrc = cardArray[i];
                }

                playerB.push(imgSrc);
            }


            setCards({
                playerA: playerA,
                playerB: playerB,
            });

            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;
    const updateAmounts = () => {

    getExByTeamNameForCasino(sportList.id, data.mid, 'Player A', match_id).then(res => setPlayerA(res.data))

    getExByTeamNameForCasino(sportList.id, data.mid, 'Player B', match_id).then(res => setPlayerB(res.data))
    }

    useEffect(() => {
        

        if (data?.sub && sportList?.id) {
            
            updateAmounts();
        }
    }, [exposure, sportLength, roundId, mybetModel.length]);

    // Hook handles round ID changes and API calls automatically

    const updatePlayerStats = (playerData, setPlayerBack, setPlayerLay, playerName, teamsession) => {
        if (!playerData) return;
        let playerStatus = '';
        // console.log('player status is ', playerData.gstatus);
        if (playerData.gstatus === "SUSPENDED") {
            playerStatus = "suspended-row";

        }
        setPlayerStatuses(prev => ({...prev, [playerName]: playerStatus}));

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

    // Helper function to find data in data.sub for Teen33
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Teen33, find the item by nat field
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
                //  is already handled by placeCasinoBet
            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
            <div className="video-overlay">
                    <div className="casino-video-cards">
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
         <CasinoLayout ruleDescription={desc} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setData={setData} 
                      setSportList={setSportList} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-box">
                        {
                        ["Player A", "Player B"].map((playerName, i) => (
                        <>
                            <PlayerTable
                                openPopup={openPopup}
                                playerName={playerName}
                                playerValue={i === 0 ? playerA : playerB}
                                playerBack={i === 0 ? playerA_Back : playerB_Back}
                                playerLay={i === 0 ? playerA_Lay : playerB_Lay}
                                playerStatus={playerStatuses[playerName]}
                            />

                            {i === 0 && <div className="casino-table-box-divider"></div>}
                        </>

                        ))
                        }
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

const PlayerTable = ({playerName, playerValue, playerBack, openPopup, playerLay, playerStatus}) => (
    <div className="casino-table-left-box">
        <div className="casino-table-header">
            <div className="casino-nation-detail">{playerName}</div>
            <div className="casino-odds-box back">Back</div>
            <div className="casino-odds-box lay">Lay</div>
        </div>
        <div className={`casino-table-body`}>
            <div className={`casino-table-row ${playerStatus}`}>
                <div className="casino-nation-detail">
                    <div className="casino-nation-name">Main</div>
                    <p className="m-b-0">
                        <span className={`font-weight-bold ${playerValue >= 0 ? 'text-success' : 'text-danger'}`}>
                            {playerValue}
                        </span>
                    </p>
                </div>
                <div className="casino-odds-box back">
                    <span className="casino-odds"
                          onClick={() => openPopup('back', playerName, playerBack)}>{playerBack}</span>
                </div>
                <div className="casino-odds-box lay">
                    <span className="casino-odds"
                          onClick={() => openPopup('lay', playerName, playerLay)}>{playerLay}</span>
                </div>
            </div>
        </div>
    </div>
);

export default Teen33;
