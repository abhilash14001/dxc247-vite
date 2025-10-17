import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";
import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor,
    getExBySingleTeamNameCasino,
    getPlayerCardAccordingToNumberOfPlayers, resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Baccarat = () => {
    const [roundId, setRoundId] = useState('')

    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)
    const TOTALPLAYERS = {
        "Perfect Pair": '',
        "Big": '',
        "Small": '',
        "Either Pair": '',
        "Player Pair": '',
        "Player": '',
        "Tie": '',
        "Banker": '',
        "Banker Pair": '',

    };
    const [playerAmounts, setPlayerAmounts] = useState(TOTALPLAYERS);
    const {match_id} = useParams();

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})

    const {
        betType,
        setBetType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)
    const [hideLoading, setHideLoading] = useState(true)

    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);


    const [playerStatuses, setPlayerStatuses] = useState(() => {
        const initialOdds = [{status: 'suspended-box', odds: "0", type: "bet-odds"},
            {status: 'suspended-box', odds: "0", type: "bet-odds"},
            {status: 'suspended-box', odds: "0", type: "bet-odds"},
            {status: 'suspended-box', odds: "0", type: "bet-odds"},
            {status: 'suspended-box', odds: "0", type: "player-pair"},
            {
                status: 'suspended-box', odds: "0", type: "player",
                cardImages: ["/img/casino/cards/1.png", "/img/casino/cards/1.png", "/img/casino/cards/1.png"]
            },
            {status: 'suspended-box', odds: "0", type: "tie"},
            {
                status: 'suspended-box', odds: "0", type: "banker",
                cardImages: ["/img/casino/cards/1.png", "/img/casino/cards/1.png", "/img/casino/cards/1.png"]
            },
            {status: 'suspended-box', odds: "0", type: "banker-pair"}];
        return initialOdds.map((odds, index) => {
            const playerNames = Object.keys(TOTALPLAYERS); // Get player names
            return {
                ...odds,
                label: playerNames[index] || ""  // Assign label from TOTALPLAYERS or empty string if index exceeds
            };
        });
    });


    const updateOdds = (d_data) => {
        setPlayerStatuses(prevStatuses => {
            return prevStatuses.map((status, index) => {
                let newOdds = status.odds; // Default to existing odds
                let newStatus = status.status; // Default to existing status
                let cardImages = status.cardImages || '';
                const playerData = d_data.sub[index];

                if (d_data.sub && d_data.sub[index]) {

                    // Update odds if 'b' exists
                    if (playerData.b && playerData.b > 0) {
                        newOdds = playerData.b; // Update odds
                    }

                    // Update status based on game status
                    if (playerData.gstatus === 'OPEN') {
                        newStatus = ''; // Game is open
                    } else {
                        newStatus = 'suspended-box'; // Game is suspended
                    }
                }

                // Specific handling based on labels
                switch (status.label) {
                    case 'Player':
                        if (d_data.sub[0] && d_data.sub[0].b) {
                            newOdds = d_data.sub[0].b; // Update odds for Player

                        }
                        cardImages = getPlayerCardAccordingToNumberOfPlayers(d_data, 1, 1, [4, 2, 0]); // 3 cards for Player


                        break;

                    case 'Banker':
                        if (d_data.sub[1] && d_data.sub[1].b) {
                            newOdds = d_data.sub[1].b; // Update odds for Banker
                        }
                        cardImages = getPlayerCardAccordingToNumberOfPlayers(d_data, 1, 1, [1, 3, 5]); // 3 cards for Player

                        break;

                    case 'Tie':
                        if (d_data.sub[2] && d_data.sub[2].b) {
                            newOdds = d_data.sub[2].b; // Update odds for Tie
                        }
                        break;

                    case 'Player Pair':
                        if (d_data.sub[3] && d_data.sub[3].b) {
                            newOdds = d_data.sub[3].b; // Update odds for Player Pair
                        }
                        break;

                    case 'Banker Pair':
                        if (d_data.sub[4] && d_data.sub[4].b) {
                            newOdds = d_data.sub[4].b; // Update odds for Banker Pair
                        }
                        break;

                    case 'Perfect Pair':
                        if (d_data.sub[5] && d_data.sub[5].b) {
                            newOdds = d_data.sub[5].b; // Update odds for Perfect Pair
                            newStatus = ''; // Update status to open

                        }
                        break;

                    case 'Big':
                        if (d_data.sub[6] && d_data.sub[6].b) {
                            newOdds = d_data.sub[6].b; // Update odds for Big
                        }
                        break;

                    case 'Small':
                        if (d_data.sub[7] && d_data.sub[7].b) {
                            newOdds = d_data.sub[7].b; // Update odds for Small
                        }
                        break;

                    case 'Either Pair':
                        if (d_data.sub[8] && d_data.sub[8].b) {
                            newOdds = d_data.sub[8].b; // Update odds for Either Pair
                        }
                        break;

                    // Add more cases as needed for additional statuses
                    default:
                        break;
                }


                return {
                    ...status,
                    odds: playerData.gstatus === 'OPEN' ? newOdds : status.odds,  // Update odds
                    status: newStatus, // Update status based on game state
                    cardImages: cardImages
                };
            });
        });
    };


    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {

        if (data?.sub) {
            updateOdds(data);

        }


    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;
    const ruleDescription = `<div><style type="text/css">
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
            border-right: 1px solid #444;
            vertical-align: middle;
            text-align: center;
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
        .rules-section img
        {
            height: 30px;
            margin-right: 5px;
        }
        .rules-section .casino-tabs {
            background-color: #222 !important;
            border-radius: 0;
        }
        .rules-section .casino-tabs .nav-tabs .nav-link
        {
            color: #fff !important;
        }
        .rules-section .casino-tabs .nav-tabs .nav-link.active
        {
            color: #FDCF13 !important;
            border-bottom: 3px solid #FDCF13 !important;
        }
    </style>

<div className="rules-section">
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>In the Baccarat game two hands are dealt; once for the banker and another for the player. The player best which will win or if they will tie. The winning hand has the closest value to nine. In case of Banker winning, if banker's point sum is equals to 6, then payout will be 50%.</li>
                                            </ul>
                                        </div></div>
                                        
                                        <div><div className="rules-section">
                                            <h6 className="rules-highlight">Rules for Players:</h6>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td rowspan="3">When Player’s first two cards total:</td>
                                                            <td>0-1-2-3-4-5</td>
                                                            <td>Draw a card</td>
                                                        </tr>
                                                        <tr>
                                                            <td>6-7</td>
                                                            <td>Stands</td>
                                                        </tr>
                                                        <tr>
                                                            <td>8-9</td>
                                                            <td>Natural-Neither hand draws</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div></div>
                                        <div><div className="rules-section">
                                            <h6 className="rules-highlight">Rules for Banker:</h6>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>When the PLAYER stands on 6 or 7, the BANKER will always draw on totals of 0-1-2-3-4 and 5, and stands on 6-7-8 and 9.When the PLAYER does not have a natural, the BANKER shall draw on the totals of 0-1 or 2, and then observe the following rules:</li>
                                            </ul>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td>When Banker’s first two cards total:</td>
                                                            <td>Draws when Player’s third card is:</td>
                                                            <td>Does not draw when Player’s third card is:</td>
                                                        </tr>
                                                        <tr>
                                                            <td>3</td>
                                                            <td>1-2-3-4-5-6-7-9-0</td>
                                                            <td>8</td>
                                                        </tr>
                                                        <tr>
                                                            <td>4</td>
                                                            <td>2-3-4-5-6-7</td>
                                                            <td>1-8-9-0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>5</td>
                                                            <td>4-5-6-7</td>
                                                            <td>1-2-3-8-9-0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>6</td>
                                                            <td>6-7</td>
                                                            <td>1-2-3-4-5-8-9-0</td>
                                                        </tr>
                                                        <tr>
                                                            <td>7</td>
                                                            <td colspan="2">STANDS</td>
                                                        </tr>
                                                        <tr>
                                                            <td>8-9</td>
                                                            <td colspan="2">NATURAL-NEITHER HAND DRAWS</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li>If the PLAYER takes no third card BANKER stands on 6. The hand closest to 9 wins.All Winning bets are paid even money.TIE bets pay 8 for 1</li>
                                            </ul>
                                        </div></div>

                                        <div><div className="rules-section">
                                            <h6 className="rules-highlight">Side Bets:</h6>
                                            <ul className="pl-2 pr-2 list-style">
                                                <li><b>Player Pair</b> - Bet on the chance that the first two cards dealt to the player, are a pair.</li>
                                                <li><b>Banker Pair</b> - Bet on the chance that the first two cards dealt to the banker, are a pair.</li>
                                                <li><b>Big</b> - Bet on the chance that the total number of cards dealt between Player and Banker is 5 or 6.</li>
                                                <li><b>Small</b> - Bet on the chance that the total number of cards dealt between Player and Banker is 4.</li>
                                                <li><b>Perfect Pair</b> - Bet on the chance that the first two Player or Banker cards form a pair of the same suit.</li>
                                                <li><b>Either Pair</b> - Bet on the chance that either the first two cards of the Banker hand or the first two cards of the Player hand (or both) form a pair.</li>
                                            </ul>
                                        </div></div>
                                        `
    

    useEffect(() => {

        if (data?.sub && sportList?.id) {
            Object.keys(TOTALPLAYERS).slice(5, 8).map(value => {

                getExBySingleTeamNameCasino(sportList.id, data.mid, value, match_id, value === 'Tie' ? 'TIE' : 'ODDS')
                    .then(res => {
// Update playerAmounts based on the response
                        setPlayerAmounts(prev => ({
                            ...prev,
                            [value]: res.data // Assuming the amount is in the response
                        }));
                    })
            })
        }
    }, [exposure, sportLength, roundId, mybetModel.length]);

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

    // Helper function to find data in data.sub for Baccarat
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Baccarat, find the item by nat field
        return data.sub.find(item => item.nat === teamName);
    };
    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds

        if (backOrLay === 'back') {


            loss.current = stakeValue.current.value;


            profit.current = profitData.current = (parseFloat(odds) * stakeValue.current.value).toFixed(2)


        } else {

            profit.current = profitData.current = stakeValue.current.value;


            loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)
        }


    }

    const placeBet = async () => {
        const betData = {
            sportList,
            roundId,
            backOrLay,
            teamname,
            odds,
            profit,
            loss,
            betType: teamname.current === 'Tie' ? 'TIE' : "ODDS",
            stakeValue,
            match_id: 'baccarat',
            roundIdSaved,
            totalPlayers: TOTALPLAYERS,
            playerStatuses: playerStatuses.find(status => status.label === teamname.current),
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

            }
        });

        return success;
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
        <CasinoLayout raceClass="baccarat" ruleDescription={ruleDescription} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname}
                      handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult}
                      getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-table">
                <div className="casino-table-full-box">
                    <div className="baccarat-graph text-center">
                        <h4 className="">Statistics</h4>
                        <div style={{height: '160px', width: '100%'}}>
                            <div style={{height: '160px', width: '100%'}}>
                                <div style={{position: 'relative'}}>
                                    <div style={{position: 'relative', width: '209px', height: '160px'}}>
                                        <div style={{position: 'absolute', left: '0px', top: '0px', width: '100%', height: '100%'}} aria-label="A chart.">
                                            <svg width="209" height="160" aria-label="A chart." style={{overflow: 'hidden'}}>
                                                <defs id="_ABSTRACT_RENDERER_ID_17"></defs>
                                                <g>
                                                    <rect x="146" y="3" width="63" height="39" stroke="none" strokeWidth="0" fillOpacity="0" fill="#ffffff"></rect>
                                                    <g>
                                                        <rect x="146" y="3" width="63" height="9" stroke="none" strokeWidth="0" fillOpacity="0" fill="#ffffff"></rect>
                                                        <g>
                                                            <text textAnchor="start" x="158" y="10.65" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#222222">Player</text>
                                                        </g>
                                                        <circle cx="150.5" cy="7.5" r="4.5" stroke="none" strokeWidth="0" fill="#086cb8"></circle>
                                </g>
                                <g>
                                                        <rect x="146" y="18" width="63" height="9" stroke="none" strokeWidth="0" fillOpacity="0" fill="#ffffff"></rect>
                                                        <g>
                                                            <text textAnchor="start" x="158" y="25.65" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#222222">Banker</text>
                                                        </g>
                                                        <circle cx="150.5" cy="22.5" r="4.5" stroke="none" strokeWidth="0" fill="#ae2130"></circle>
                                </g>
                                <g>
                                                        <rect x="146" y="33" width="63" height="9" stroke="none" strokeWidth="0" fillOpacity="0" fill="#ffffff"></rect>
                                                        <g>
                                                            <text textAnchor="start" x="158" y="40.65" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#222222">Tie</text>
                                                        </g>
                                                        <circle cx="150.5" cy="37.5" r="4.5" stroke="none" strokeWidth="0" fill="#279532"></circle>
                                </g>
                            </g>
                            <g>
                                                    <path d="M131,73.7L131,86.3A63,50.400000000000006,0,0,1,113.92502352754894,120.8011741388059L113.92502352754894,108.20117413880591A63,50.400000000000006,0,0,0,131,73.7" stroke="#06518a" strokeWidth="1" fill="#06518a"></path>
                                                    <path d="M68,73.7L68,86.3L113.92502352754894,120.8011741388059L113.92502352754894,108.20117413880591" stroke="#06518a" strokeWidth="1" fill="#06518a"></path>
                                                    <path d="M68,73.7L68,23.299999999999997A63,50.400000000000006,0,0,1,113.92502352754894,108.20117413880591L68,73.7A0,0,0,0,0,68,73.7" stroke="#086cb8" strokeWidth="1" fill="#086cb8"></path>
                                                    <text textAnchor="start" x="98.81099944899387" y="63.64205231647918" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#ffffff">37%</text>
                            </g>
                            <g>
                                                    <path d="M68,73.7L68,86.3L34.24291191632323,43.74587255469843L34.24291191632323,31.14587255469843" stroke="#1d7026" strokeWidth="1" fill="#1d7026"></path>
                                                    <path d="M68,73.7L34.24291191632323,31.14587255469843A63,50.400000000000006,0,0,1,68,23.299999999999997L68,73.7A0,0,0,0,0,68,73.7" stroke="#279532" strokeWidth="1" fill="#279532"></path>
                                                    <text textAnchor="start" x="48.567814657680486" y="42.72346333265026" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#ffffff">9%</text>
                            </g>
                            <g>
                                                    <path d="M113.92502352754894,108.20117413880591L113.92502352754894,120.8011741388059A63,50.400000000000006,0,0,1,5,86.3L5,73.7A63,50.400000000000006,0,0,0,113.92502352754894,108.20117413880591" stroke="#831924" strokeWidth="1" fill="#831924"></path>
                                                    <path d="M68,73.7L113.92502352754894,108.20117413880591A63,50.400000000000006,0,1,1,34.24291191632323,31.14587255469843L68,73.7A0,0,0,1,0,68,73.7" stroke="#ae2130" strokeWidth="1" fill="#ae2130"></path>
                                                    <text textAnchor="start" x="25.628820425542834" y="98.01539784390123" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#ffffff">54%</text>
                            </g>
                            <g></g>
                        </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="baccarat-odds-container">
                        <div className="baccarat-other-odds">
                            {playerStatuses.slice(0, 4).map((option, index) => (
                                <div key={index} className="baccarat-other-odd-box-container">
                                    <div className={`baccarat-other-odd-box ${option.status}`}>
                                        <span>{option.label}</span>
                                        <span>{option.odds}:1</span>
                                    </div>
                                    <div className="casino- text-center">
                                        {getExByColor(playerAmounts[option.label])}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="baccarat-main-odds mt-3">
                            {playerStatuses.slice(4).map((option, index) => {
                                const containerClass = option.label === 'Player Pair' ? 'player-pair-box-container' :
                                                     option.label === 'Player' ? 'player-box-container' :
                                                     option.label === 'Tie' ? 'tie-box-container' :
                                                     option.label === 'Banker' ? 'banker-box-container' :
                                                     'banker-pair-box-container';
                                const boxClass = option.label === 'Player Pair' ? 'player-pair-box' :
                                               option.label === 'Player' ? 'player-box' :
                                               option.label === 'Tie' ? 'tie-box' :
                                               option.label === 'Banker' ? 'banker-box' :
                                               'banker-pair-box';
                                
                                return (
                                    <div key={index} className={containerClass}>
                                        <div className={`${boxClass} ${option.status}`}
                                        onClick={['Player', 'Tie', 'Banker'].includes(option.label) ?
                                            () => openPopup('back', option.label, option.odds) :
                                            null}>
                                            <div>{option.label}</div>
                                            <div>{option.odds}:1</div>
                                        {option.cardImages && (
                                                <div>
                                                {option.cardImages.map((src, idx) => {
                                                    if ((index === 1 && idx === 0 && src.includes("1.png")) || (index === 3 && idx === 2 && src.includes("1.png"))) {
                                                        return null;
                                                    }
                                                    return (
                                                        <img 
                                                            key={idx} 
                                                            src={src} 
                                                            alt={`${option.label} Card ${idx + 1}`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                        <div className="casino- text-center">
                                            {getExByColor(playerAmounts[option.label])}
                                        </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results last-result-container">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </div>

        </CasinoLayout>
    )
        ;

};


export default Baccarat;
