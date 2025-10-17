import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import Notify from "../utils/Notify";
import {CasinoContext} from "../contexts/CasinoContext";

const Card32eu = () => {
        const [roundId, setRoundId] = useState('')
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

<div class="rules-section">
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Cards Deck</th>
                                                            <th>Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>6(SPADE) 6(HEART) 6(CLUB) 6(DIAMOND)</td>
                                                            <td>6 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>7(SPADE) 7(HEART) 7(CLUB) 7(DIAMOND)</td>
                                                            <td>7 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>8(SPADE) 8(HEART) 8(CLUB) 8(DIAMOND)</td>
                                                            <td>8 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>9(SPADE) 9(HEART) 9(CLUB) 9(DIAMOND)</td>
                                                            <td>9 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>10(SPADE) 10(HEART) 10(CLUB) 10(DIAMOND)</td>
                                                            <td>10 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>J(SPADE) J(HEART) J(CLUB) J(DIAMOND)</td>
                                                            <td>11 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Q(SPADE) Q(HEART) Q(CLUB) Q(DIAMOND)</td>
                                                            <td>12 POINT</td>
                                                        </tr>
                                                        <tr>
                                                            <td>K(SPADE) K(HEART) K(CLUB) K(DIAMOND)</td>
                                                            <td>13 POINT</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>This is a value card game &amp; Winning result will count on Highest cards total.</li>
                                                <li>There are total 4 players, every player have default prefix points. Default points will be consider as following table.</li>
                                            </ul>
                                            <h6 class="rules-highlight">Playing Game Rules:</h6>
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <div><b>PLAYER 8</b></div>
                                                                <div>8 Point</div>
                                                            </td>
                                                            <td>
                                                                <div><b>PLAYER 9</b></div>
                                                                <div>9 Point</div>
                                                            </td>
                                                            <td>
                                                                <div><b>PLAYER 10</b></div>
                                                                <div>10 Point</div>
                                                            </td>
                                                            <td>
                                                                <div><b>PLAYER 11</b></div>
                                                                <div>11 Point</div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>In game, every player has to count sum of default points and their ownopened card's point.</li>
                                                <li>If in first level, the sum is same with more than one player, then thatwill be tie and winner tied players go for next level.</li>
                                                <li>This sum will go and go upto Single Player Highest Sum of Point.</li>
                                                <li>At last Highest Point Cards's Player declare as a Winner.</li>
                                            </ul>
                                        </div>
</div>`;
        const {updateCardsForCard32Casino} = useContext(CasinoContext)

        const roundIdSaved = useRef(null);

        const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

        const stakeValue = useRef(0);
        const [odds, setOdds] = useState(0)

        const chunkArray = (array, size) => {
            return array.reduce((acc, _, index) =>
                    index % size === 0 ? [...acc, array.slice(index, index + size)] : acc
                , []);
        };


        const [backOrLay, setbackOrLay] = useState('back')
        const [sportList, setSportList] = useState({})
        let {match_id} = useParams();
        const {
            setBetType,
            betType,
            setPopupDisplayForDesktop,

        } = useContext(SportsContext)
        const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)
    const [hideLoading, setHideLoading] = useState(true)
        const defaultValues = {odds: {back: 0, lay: 0}, status: 'suspended-box', amounts: '', cards: [], card_number: null}
        const defaultValuesForOthers = {
            odds: {back: 0, lay: 0},
            status: 'suspended-box',
            amounts: '',

        };
        const defaultValuesForODDEVEN = {
            odds: {back: 0, lay: 0},
            status: 'suspended-box',
            amounts: {back: '', lay: ''},

        }
        const [totalPlayers, setTotalPlayers] = useState([
                    {
                        "ODDS": Array.from({length: 4}, (_, index) => (`Player ${index + 8}`)).reduce((accumulator, currentValue) => {
                            return {...accumulator, [currentValue]: defaultValues}
                        }, {})
                    }, {
                        "ODD_EVEN":
                            Array.from({length: 4}, (_, index) => (`Player ${index + 8}`)).reduce((accumulator, currentValue) => {
                                return {...accumulator, [currentValue]: defaultValuesForODDEVEN};


                            }, {})
                    },
                    {
                        "BOOKMAKER":
                            {
                                'Any Three Card Black':
                                defaultValuesForOthers,
                                'Any Three Card Red':
                                defaultValuesForOthers,
                                'Two Black Two Red':
                                defaultValuesForOthers
                            }

                    },
                    {
                        "TOTAL":
                            {
                                '8 & 9 Total':
                                defaultValuesForOthers, '10 & 11 Total':
                                defaultValuesForOthers
                            }
                    },
                    {
                        "SINGLE":
                            Array.from({length: 10}, (_, index) => index).reduce((accumulator, currentValue) => {
                                return {...accumulator, [currentValue]: defaultValuesForOthers}
                            }, {})
                    }
                ]
            )
        ;


        const teamNames = useRef([])
        
        const [playerStatuses, setPlayerStatuses] = useState({});

        const [data, setData] = useState([]);


        const remark = useRef('Welcome');
        const [lastResult, setLastResult] = useState({});
        const teamname = useRef('');
        const loss = useRef(0);
        const profit = useRef(0);
        const profitData = useRef(0);

        const getExByTeamName = async () => {
            let promises = []
            // roundId = '114241009171843'
            for (const [key, value] of Object.entries(totalPlayers[0].ODDS)) {
                promises.push(getExByTeamNameForCasino(sportList.id, roundId, key, match_id, 'ODDS'))

            }

            promises.push(getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, ''))

            const res = await Promise.all(promises);

            setTotalPlayers((prevState) => {
                const exCal = [...prevState]; // Clone the previous state

                // Update ODDS amounts
                Object.entries(exCal[0].ODDS).forEach(([key, value], index) => {
                    exCal[0].ODDS[key] = {
                        ...value,
                        amounts: res?.[index]?.data || '' // Safely access res data or default to 0
                    };
                });

                const extraData = res[4].data;

                // Loop over entries from the sliced array (indices 1 to 4)
                exCal.slice(1, 5).forEach((value1, key1) => {
                    // Correct index offset
                    let kk = key1 + 1;

                    Object.entries(value1).forEach(([key2, value2]) => {


                        if (extraData.length === 0) {
                            // Reset amounts to 0 for each team in value2
                            Object.keys(value2).forEach(t => {
                                exCal[kk][key2][t] = {
                                    ...(exCal[kk][key2][t] || {}), // Ensure the target exists
                                    amounts: typeof exCal[kk][key2][t]?.amounts === 'object' && exCal[kk][key2][t].amounts !== null
                                        ? {back: '', lay: ''} // Reset amounts to 0 if it's an object
                                        : '' // Otherwise set amounts to 0
                                };
                            });

                        }
                        // Ensure 'Player 8' exists in value2 before accessing it
                        extraData.forEach((value3, key3) => {

                            let is_odd_even = false
                            let t = value3.team_name
                            if (t.endsWith(" Odd")) {
                                is_odd_even = 'odd'
                                t = t.split(" Odd")[0]
                            } else if (t.endsWith(" Even")) {
                                is_odd_even = 'even'
                                t = t.split(" Even")[0]
                            } else if (t.startsWith("Single")) {
                                t = t.split("Single ")[1]
                            }

                            if (!is_odd_even) {
                                if (value2[t]) {
                                    exCal[kk][key2] = {
                                        ...(exCal[kk][key2] || {}), // Ensure the target exists
                                        [t]: {
                                            ...value2[t],
                                            amounts: value3.total_amount || ''// Set amounts as needed
                                        }
                                    };
                                }
                            } else {
                                if (value2[t]) {
                                    exCal[kk][key2] = {
                                        ...(exCal[kk][key2] || {}), // Ensure the target exists
                                        [t]: {
                                            ...value2[t],
                                            amounts: is_odd_even === 'odd' ? {
                                                ...value2[t].amounts,
                                                back: value3.total_amount
                                            } : {...value2[t].amounts, lay: value3.total_amount} // Set amounts as needed
                                        }
                                    };
                                }
                            }
                        })
                    });
                });


                return exCal; // Return the updated state
            });

        }
        useEffect(() => {
            const updateOdds = () => {
                setTotalPlayers((prevState) => {
                    // Create a new state object based on the previous state
                    const updatedState = [...prevState];

                    data.sub.forEach((item, index) => {

                        const playerName = item.nat; // Adjust as needed to match your data structure

                        // Loop through the first two elements (ODDS and ODD_EVEN)
                        const oddValue = updatedState[0].ODDS[playerName]; // Access the ODD_EVEN for the player
                        if (oddValue) {
                            updatedState[0].ODDS[playerName] = {
                                ...oddValue,
                                odds: {back: item?.b || 0, lay: item?.l || 0}, // Update odds if needed
                                status: item.gstatus === 'OPEN' ? '' : 'suspended-box', // Update based on suspend status
                            };
                            
                            // Update playerStatuses
                            setPlayerStatuses(prev => ({
                                ...prev,
                                [playerName]: item.gstatus === 'OPEN' ? '' : 'suspended-box'
                            }));
                        }


                        if (playerName.endsWith('Odd')) {
                            let playerNames = playerName.split(" Odd");
                            const oddEvenValue = updatedState[1].ODD_EVEN[playerNames[0]]; // Access the ODD_EVEN for the player

                            updatedState[1].ODD_EVEN[playerNames[0]] = {
                                ...oddEvenValue,
                                odds: {back: item?.b || 0, lay: item?.l || 0}, // Update odds if needed
                                status: item.gstatus === 'OPEN' ? '' : 'suspended-box', // Update based on suspend status
                            };
                        }

                        if (playerName.endsWith('Even')) {
                            let playerNames = playerName.split(" Even");
                            const oddEvenValue = updatedState[1].ODD_EVEN[playerNames[0]]; // Access the ODD_EVEN for the player

                            updatedState[1].ODD_EVEN[playerNames[0]] = {
                                ...oddEvenValue,
                                odds: {...oddEvenValue.odds, lay: item?.b || 0}, // Update odds if needed
                                status: item.gstatus === 'OPEN' ? '' : 'suspended-box', // Update based on suspend status
                            };
                        }


                        if ([12, 13, 26].includes(index)) {
                            if (updatedState[2].BOOKMAKER[item.nat]) {
                                const bookmakervalue = updatedState[2].BOOKMAKER[item.nat]

                                updatedState[2].BOOKMAKER[item.nat] = {
                                    ...bookmakervalue,
                                    odds: {back: item?.b, lay: item?.l || 0}, // Update odds if needed
                                    status: item.gstatus === 'OPEN' ? '' : 'suspended-box', // Update based on suspend status
                                };
                            }


                        }

                        if ([24, 25].includes(index)) {
                            if (updatedState[3].TOTAL[item.nat]) {
                                const Totalvalue = updatedState[3].TOTAL[item.nat]

                                updatedState[3].TOTAL[item.nat] = {
                                    ...Totalvalue,
                                    odds: {back: item?.b, lay: item?.l || 0}, // Update odds if needed
                                    status: item.gstatus === 'OPEN' ? '' : 'suspended-box', // Update based on suspend status
                                };
                            }


                        }
                        const start = 14;
                        const end = 23;

                        const rangeArray = Array.from({length: end - start + 1}, (_, i) => start + i);
                        if (rangeArray.includes(index)) {
                            const singleNat = item.nat.split("Single ");

                            if (updatedState[4].SINGLE[singleNat[1]]) {
                                const SINGLEVALUE = updatedState[4].SINGLE[singleNat[1]]

                                updatedState[4].SINGLE[singleNat[1]] = {
                                    ...SINGLEVALUE,
                                    odds: {back: item?.b, lay: item?.l || 0}, // Update odds if needed
                                    status: item.gstatus === 'OPEN' ? '' : 'suspended-box', // Update based on suspend status
                                };
                            }


                        }
                    });


                    return updatedState; // Return the updated state
                });
            };


            if (data?.sub) {
                updateOdds()

            }

          
            remark.current = data.remark || 'Welcome';


        }, [data]);

        useEffect(() => {
            if (data?.card) {

                updateCardsForCard32Casino(data, totalPlayers, setTotalPlayers, 0, 'ODDS')
            }
        }, [data?.card]);

        const exposure = localStorage.getItem('exposure');
        const sportLength = Object.keys(data).length;


        useEffect(() => {
            if (data?.sub && sportList?.id) {


                getExByTeamName();

            }


        }, [exposure, sportLength, roundId, mybetModel.length]);


        const openPopup = (isBakOrLay, teamnam, oddvalue, betType = 'ODDS') => {
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

        // Helper function to find data in data.sub for Card32eu
        const findDataInSub = (teamName, betType) => {
            if (!data || !data.sub) return null;

            // For Card32eu, find the item by nat field
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


        const placeBet = async () => {
            const bb = betType.startsWith("ODD_EVEN") === true ? "ODD_EVEN" : betType;
            const t =
                teamname.current.endsWith(" Odd")
                    ? teamname.current.split(" Odd")[0]
                    : teamname.current.endsWith(" Even")
                        ? teamname.current.split(" Even")[0]
                        : teamname.current.startsWith("Single")
                            ? teamname.current.split("Single ")[1]
                            : teamname.current;

            const indexPlayer = totalPlayers.findIndex(item => item[bb]);

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
                match_id: 'card32eu',
                roundIdSaved,
                totalPlayers: null,
                playerStatuses: playerStatuses[teamname.current],
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
                    getExByTeamName();
                }
            });

            return success;
        }

        const renderVideoBox = () => {
            return (
              

                    <div className="casino-video-cards">
                        {(() => {
                            // Calculate the highest score among all players
                            const scores = Object.values(totalPlayers[0].ODDS)
                                .filter(player => player.card_number !== null)
                                .map(player => parseInt(player.card_number));
                            const highestScore = Math.max(...scores);

                            return Object.entries(totalPlayers[0].ODDS).map(([key, value], idx) => (
                                value.card_number !== null ? (
                                    <div key={key} className={idx !== 0 ? "mt-1" : ""}>
                                        <h5 className={parseInt(value.card_number) === highestScore ? "text-success" : ""}>
                                            {key}: <span className="text-warning">{value.card_number}</span>
                                        </h5>
                                        <div className="flip-card-container">
                                            {value?.cards && value.cards.map((card, cardIdx) => (
                                                <div key={cardIdx} className="flip-card">
                                                    <div className="flip-card-inner ">
                                                        <div className="flip-card-front">
                                                            <img src={card} alt="" />
                                                        </div>
                                                        <div className="flip-card-back">
                                                            <img src={card} alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            ));
                        })()}
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
            <CasinoLayout raceClass="cards32b" ruleDescription={ruleDescription} hideLoading={hideLoading}
                          isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                          stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                          submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                          sportList={sportList}
                          setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                          getMinMaxLimits={getMinMaxLimits}>
                <div className="casino-container casino-32A">
                    <div className="casino-table">
                        {/* Left Table: Player 8-11 Back/Lay */}
                        <div className="casino-table-box">
                            <div className="casino-table-left-box">
                                <div className="casino-table-header">
                                    <div className="casino-nation-detail"></div>
                                    <div className="casino-odds-box back">Back</div>
                                    <div className="casino-odds-box lay">Lay</div>
                                </div>
                                <div className="casino-table-body">
                                    {["Player 8", "Player 9", "Player 10", "Player 11"].map((player, idx) => (
                                        <div className="casino-table-row" key={player}>
                                            <div className="casino-nation-detail">
                                                <div className="casino-nation-name">{player}</div>
                                                <div className={`casino-nation-book ${parseFloat(totalPlayers[0].ODDS[player]?.amounts || 0) < 0 ? 'text-danger' : 'text-success'}`}>
                                                    {getExByColor(totalPlayers[0].ODDS[player]?.amounts)}
                                                </div>
                                            </div>
                                            <div className={`casino-odds-box back ${totalPlayers[0].ODDS[player]?.status || ''}`}
                                                 onClick={() => openPopup('back', player, totalPlayers[0].ODDS[player]?.odds?.back, 'ODDS')}>
                                                <span className="casino-odds">{totalPlayers[0].ODDS[player]?.odds?.back ?? 0}</span>
                                            </div>
                                            <div className={`casino-odds-box lay ${totalPlayers[0].ODDS[player]?.status || ''}`}
                                                 onClick={() => openPopup('lay', player, totalPlayers[0].ODDS[player]?.odds?.lay, 'ODDS')}>
                                                <span className="casino-odds">{totalPlayers[0].ODDS[player]?.odds?.lay ?? 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="casino-table-box-divider"></div>
                            {/* Right Table: Player 8-11 Odd/Even */}
                            <div className="casino-table-right-box">
                                <div className="casino-table-header">
                                    <div className="casino-nation-detail"></div>
                                    <div className="casino-odds-box back">Odd</div>
                                    <div className="casino-odds-box back">Even</div>
                                </div>
                                <div className="casino-table-body">
                                    {["Player 8", "Player 9", "Player 10", "Player 11"].map((player, idx) => (
                                        <div className="casino-table-row" key={player}>
                                            <div className="casino-nation-detail">
                                                <div className="casino-nation-name">{player}</div>
                                            </div>
                                            <div className={`casino-odds-box back ${totalPlayers[1].ODD_EVEN[player]?.status || ''}`}
                                                 onClick={() => openPopup('back', `${player} Odd`, totalPlayers[1].ODD_EVEN[player]?.odds?.back, `ODD_EVEN_${player.split("Player ")[1]}`)}>
                                                <span className="casino-odds">{totalPlayers[1].ODD_EVEN[player]?.odds?.back ?? 0}</span>
                                                <div className={`casino-nation-book ${parseFloat(totalPlayers[1].ODD_EVEN[player]?.amounts?.back || 0) < 0 ? 'text-danger' : 'text-success'}`}>
                                                    {getExByColor(totalPlayers[1].ODD_EVEN[player]?.amounts?.back || '')}
                                                </div>
                                            </div>
                                            <div className={`casino-odds-box back ${totalPlayers[1].ODD_EVEN[player]?.status || ''}`}
                                                 onClick={() => openPopup('back', `${player} Even`, totalPlayers[1].ODD_EVEN[player]?.odds?.lay, `ODD_EVEN_${player.split("Player ")[1]}`)}>
                                                <span className="casino-odds">{totalPlayers[1].ODD_EVEN[player]?.odds?.lay ?? 0}</span>
                                                <div className={`casino-nation-book ${parseFloat(totalPlayers[1].ODD_EVEN[player]?.amounts?.lay || 0) < 0 ? 'text-danger' : 'text-success'}`}>
                                                    {getExByColor(totalPlayers[1].ODD_EVEN[player]?.amounts?.lay || '')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Second Row: Any 3 Card Black/Red, Two Black Two Red, 8&9 Total, 10&11 Total */}
                        <div className="casino-table-box mt-3">
                            <div className="casino-table-left-box">
                                <div className="casino-table-header">
                                    <div className="casino-nation-detail"></div>
                                    <div className="casino-odds-box back">Back</div>
                                    <div className="casino-odds-box lay">Lay</div>
                                </div>
                                <div className="casino-table-body">
                                    {["Any Three Card Black", "Any Three Card Red", "Two Black Two Red"].map((name, idx) => (
                                        <div className="casino-table-row" key={name}>
                                            <div className="casino-nation-detail">
                                                <div className="casino-nation-name">{name}</div>
                                                <div className={`casino-nation-book ${parseFloat(totalPlayers[2].BOOKMAKER[name]?.amounts || 0) < 0 ? 'text-danger' : 'text-success'}`}>
                                                    {getExByColor(totalPlayers[2].BOOKMAKER[name]?.amounts)}
                                                </div>
                                            </div>
                                            <div className={`casino-odds-box back ${totalPlayers[2].BOOKMAKER[name]?.status || ''}`}
                                                 onClick={() => openPopup('back', name, totalPlayers[2].BOOKMAKER[name]?.odds?.back, 'BOOKMAKER')}>
                                                <span className="casino-odds">{totalPlayers[2].BOOKMAKER[name]?.odds?.back ?? 0}</span>
                                            </div>
                                            <div className={`casino-odds-box lay ${totalPlayers[2].BOOKMAKER[name]?.status || ''}`}
                                                 onClick={() => openPopup('lay', name, totalPlayers[2].BOOKMAKER[name]?.odds?.lay, 'BOOKMAKER')}>
                                                <span className="casino-odds">{totalPlayers[2].BOOKMAKER[name]?.odds?.lay ?? 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="casino-table-box-divider"></div>
                            <div className="casino-table-right-box cards32total">
                                <div className="casino-table-header">
                                    <div className="casino-nation-detail"></div>
                                    <div className="casino-odds-box back">Back</div>
                                </div>
                                <div className="casino-table-body">
                                    <div className="casino-table-row">
                                        <div className="casino-nation-detail">
                                            <div className="casino-nation-name">8 &amp; 9 Total</div>
                                            <div className={`casino-nation-book ${parseFloat(totalPlayers[3].TOTAL['8 & 9 Total']?.amounts || 0) < 0 ? 'text-danger' : 'text-success'}`}>
                                                {getExByColor(totalPlayers[3].TOTAL['8 & 9 Total']?.amounts)}
                                            </div>
                                        </div>
                                        <div className={`casino-odds-box back ${totalPlayers[3].TOTAL['8 & 9 Total']?.status || ''}`}
                                             onClick={() => openPopup('back', '8 & 9 Total', totalPlayers[3].TOTAL['8 & 9 Total']?.odds?.back, 'TOTAL')}>
                                            <span className="casino-odds">{totalPlayers[3].TOTAL['8 & 9 Total']?.odds?.back ?? 0}</span>
                                        </div>
                                    </div>
                                    <div className="casino-table-row">
                                        <div className="casino-nation-detail">
                                            <div className="casino-nation-name">10 &amp; 11 Total</div>
                                            <div className={`casino-nation-book ${parseFloat(totalPlayers[3].TOTAL['10 & 11 Total']?.amounts || 0) < 0 ? 'text-danger' : 'text-success'}`}>
                                                {getExByColor(totalPlayers[3].TOTAL['10 & 11 Total']?.amounts)}
                                            </div>
                                        </div>
                                        <div className={`casino-odds-box back ${totalPlayers[3].TOTAL['10 & 11 Total']?.status || ''}`}
                                             onClick={() => openPopup('back', '10 & 11 Total', totalPlayers[3].TOTAL['10 & 11 Total']?.odds?.back, 'TOTAL')}>
                                            <span className="casino-odds">{totalPlayers[3].TOTAL['10 & 11 Total']?.odds?.back ?? 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Numbers Row */}
                        <div className="casino-table-full-box mt-3 card32numbers">
                            <h4 className="w-100 text-center mb-2"><b>0</b></h4>
                            <div className="card32numbers-container">
                                {[1,2,3,4,5,6,7,8,9,0].map(num => (
                                    <div className={`casino-odds-box back ${totalPlayers[4].SINGLE[num]?.status || ''}`} key={num}
                                         onClick={() => openPopup('back', `Single ${num}`, totalPlayers[4].SINGLE[num]?.odds?.back, 'SINGLE')}>
                                        <span className="casino-odds">{num}</span>
                                        {totalPlayers[4].SINGLE[num]?.amounts && (
                                            <div className={`casino-nation-book ${parseFloat(totalPlayers[4].SINGLE[num]?.amounts || 0) < 0 ? 'text-danger' : 'text-success'}`}>
                                                {getExByColor(totalPlayers[4].SINGLE[num]?.amounts)}
                                            </div>
                                        )}
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
                </div>


            </CasinoLayout>
        );

    }
;


export default Card32eu;
