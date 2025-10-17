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
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Btable = () => {
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
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>The bollywood table game will be played with a total of 16 cards including (J,Q, K, A) these cards and 2 deck that means game is playing with total 16*2 = 32 cards</li>
                                                <li>
                                                    <div class="cards-box">
                                                        <span>If the card is</span>
                                                        <span class="card-character black-card ml-1">A}</span>
                                                        <span>Don Wins</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="cards-box">
                                                        <span>If the card is</span>
                                                        <span class="card-character red-card ml-1">A{</span>
                                                        <span class="card-character red-card ml-1">A[</span>
                                                        <span class="card-character black-card ml-1">A]</span>
                                                        <span>Amar Akbar Anthony Wins</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="cards-box">
                                                        <span>If the card is</span>
                                                        <span class="card-character black-card ml-1">K}</span>
                                                        <span class="card-character black-card ml-1">Q}</span>
                                                        <span class="card-character black-card ml-1">J}</span>
                                                        <span>Sahib Bibi aur Ghulam Wins.</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="cards-box">
                                                        <span>If the card is</span>
                                                        <span class="card-character red-card ml-1">K[</span>
                                                        <span class="card-character black-card ml-1">K]</span>
                                                        <span>Dharam Veer Wins.</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="cards-box">
                                                        <span>If the card is</span>
                                                        <span class="card-character red-card ml-1">K{</span>
                                                        <span class="card-character black-card ml-1">Q]</span>
                                                        <span class="card-character red-card ml-1">Q[</span>
                                                        <span class="card-character red-card ml-1">Q{</span>
                                                        <span>Kis Kisko Pyaar Karoon Wins.</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="cards-box">
                                                        <span>If the card is</span>
                                                        <span class="card-character red-card ml-1">J{</span>
                                                        <span class="card-character black-card ml-1">J]</span>
                                                        <span class="card-character red-card ml-1">J[</span>
                                                        <span>Ghulam Wins.</span>
                                                    </div>
                                                </li>
                                            </ul>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>
                                                    <b>ODD:</b>
                                                    <span>J K A</span>
                                                </li>
                                                <li>
                                                    <b>DULHA DULHAN:</b>
                                                    <span>Q K</span>
                                                    <span>Payout: 1.97</span>
                                                </li>
                                                <li>
                                                    <b>BARATI:</b>
                                                    <span>A J</span>
                                                    <span>Payout: 1.97</span>
                                                </li>
                                                <li>
                                                    <b>RED:</b>
                                                    <span>Payout: 1.97</span>
                                                </li>
                                                <li>
                                                    <b>BLACK:</b>
                                                    <span>Payout: 1.97</span>
                                                </li>
                                                <li>
                                                    <span>J,Q,K,A</span>
                                                    <div>PAYOUT: 3.75</div>
                                                </li>
                                                <li>A = DON</li>
                                                <li>B = AMAR AKBAR ANTHONY</li>
                                                <li>C = SAHIB BIBI AUR GHULAM</li>
                                                <li>D = DHARAM VEER</li>
                                                <li>E = KIS KISKO PYAAR KAROON</li>
                                                <li>F = GHULAM</li>
                                                
                                            </ul>
                                        </div></div>`

        const defaultStatusAmount = {status: "suspended-box", amounts: ""};
        const defaultValuesWithBackAndLay = {odds: {back: 0, lay: 0}, ...defaultStatusAmount}
        const defaultValuesWithBack = {odds: {back: 0}, ...defaultStatusAmount}
        const [totalPlayers, setTotalPlayers] = useState({
            "Don": {...defaultValuesWithBackAndLay, subname: "A"},
            "Amar Akbar Anthony": {...defaultValuesWithBackAndLay, subname: "B"},
            "Sahib Bibi Aur Ghulam": {...defaultValuesWithBackAndLay, subname: "C"},
            "Dharam Veer": {...defaultValuesWithBackAndLay, subname: "D"},
            "Kis Kis Ko Pyaar Karoon": {...defaultValuesWithBackAndLay, subname: "E"},
            "Ghulam": {...defaultValuesWithBackAndLay, subname: "F"},
            "Odd": defaultValuesWithBackAndLay,
            "Red": defaultValuesWithBack,
            "Black": defaultValuesWithBack,
            "Dulha Dulhan K-Q": defaultValuesWithBack,
            "Barati J-A": {...defaultValuesWithBack, canonical_name: "Barati"},
            "Card J": {...defaultValuesWithBack, imgname: "/img/card/11.jpg"},
            "Card Q": {...defaultValuesWithBack, imgname: "/img/card/12.jpg"},
            "Card K": {...defaultValuesWithBack, imgname: "/img/card/13.jpg"},
            "Card A": {...defaultValuesWithBack, imgname: "/img/card/1.jpg"}
        })


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
    const {mybetModel} = useContext(CasinoContext)

        const [hideLoading, setHideLoading] = useState(true)
       

        const [data, setData] = useState([]);

        const [playerStatuses, setPlayerStatuses] = useState({});

        const remark = useRef('Welcome');
        const [lastResult, setLastResult] = useState({});
        const teamname = useRef('');
        const loss = useRef(0);
        const profit = useRef(0);
        const profitData = useRef(0);

        const updatePlayers = () => {
            setTotalPlayers((prevPlayers) => {
                const updateP = JSON.parse(JSON.stringify((prevPlayers)))
                Object.entries(updateP).forEach(([index, value]) => {

                    const datafound = data.sub.find(item => item.nat.toLowerCase() === index.toLowerCase())


                    if (datafound) {


                        updateP[index].odds.back = datafound.b;
                        updateP[index].odds.lay = datafound.l;
                        updateP[index].status = datafound.gstatus === 'OPEN' ? "" : 'suspended-box';

                    }


                })

                return updateP

            })


        }


        useEffect(() => {

            if (data?.sub) {

                updatePlayers()

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
                    playerA: cardArray.slice(0, 1),

                });
                remark.current = data.remark || 'Welcome';
            }
        }, [data?.sub]);

        const exposure = localStorage.getItem('exposure');
        const sportLength = Object.keys(data).length;


        const updateAmounts = async (individual = false) => {
            // Clone only once at the start
            const updatedState = JSON.parse(JSON.stringify(totalPlayers));
            let promises = [];

            if (!individual) {
                // Collect promises for the first 7 entries and a single additional call
                promises.push(
                    ...Object.keys(updatedState).slice(0, 7).map(index =>
                        getExByTeamNameForCasino(sportList.id, roundId, index, match_id, index === 'Odd' ? 'ODD' : 'ODDS')
                    ),
                    getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '')
                );

                // Await all promises in parallel
                const all_promises = await Promise.all(promises);

                // Update the state efficiently
                setTotalPlayers(prevState => {
                    const newState = {...prevState}; // Shallow copy the state

                    // Update first 7 entries
                    Object.entries(newState).slice(0, 7).forEach(([index, value], i) => {
                        value.amounts = all_promises[i]?.data || ''; // Use optional chaining to avoid errors
                    });

                    // Update remaining entries by finding matching team names
                    all_promises[7]?.data.forEach(teamData => {
                        Object.keys(newState).slice(7).forEach(index => {
                            if (index.includes(teamData.team_name)) {
                                newState[index].amounts = teamData.total_amount || "";
                            }
                        });
                    });

                    return newState; // Return the updated state
                });
            } else {
                let index_to_be = 0;
                // Conditional promise collection for individual updates
                if (['ODDS', 'ODD'].includes(betType)) {
                    index_to_be = 1;
                    promises.push(
                        getExByTeamNameForCasino(sportList.id, roundId, teamname.current, match_id, teamname.current === 'Odd' ? 'ODD' : 'ODDS')
                    );
                }

                promises.push(getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, ''));

                const all_promises = await Promise.all(promises);

                // Efficient state update for individual
                setTotalPlayers(prevState => {
                    const newState = {...prevState}; // Shallow copy the state

                    if (['ODDS', 'ODD'].includes(betType)) {
                        newState[teamname.current].amounts = all_promises[0]?.data || '';
                    }

                    all_promises[index_to_be]?.data.forEach(teamData => {
                        Object.keys(newState).slice(7).forEach(index => {
                            if (index.includes(teamData.team_name)) {
                                newState[index].amounts = teamData.total_amount;
                            }
                        });
                    });

                    return newState;
                });
            }
        };

        useEffect(() => {

            if (data?.sub && sportList?.id) {
                updateAmounts();
            }
        }, [exposure, sportLength, roundId, mybetModel.length]);

        const openPopup = (isBakOrLay, teamnam, oddvalue, bet) => {
            setBetType(bet)


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

        // Helper function to find data in data.sub for Btable
        const findDataInSub = (teamName, betType) => {
            if (!data || !data.sub) return null;

            // For Btable, find the item by nat field
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
            const teams = teamname.current === 'Barati' ? "Barati J-A" : teamname.current;
            
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
                totalPlayers: totalPlayers[teams],
                playerStatuses, // Add playerStatuses to betData
                setHideLoading,
                setPopupDisplayForDesktop,
                setSubmitButtonDisable,
                resetBetFields,
                profitData,
                getBalance,
                updateAmounts: () => updateAmounts(true),
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
            <CasinoLayout ruleDescription={ruleDescription} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname}
                          handleStakeChange={casinoBetDataNew} odds={odds}
                          stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                          submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                          sportList={sportList} raceClass="bollywood"
                          setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                          getMinMaxLimits={getMinMaxLimits}>

                <div className="casino-table">
                    <div className="casino-table-box">
                        {Object.entries(totalPlayers).slice(0, 6).map(([index, value], i) => (
                            <div className={`casino-odd-box-container`} key={i}>
                                <div className="casino-nation-name">
                                    {value.subname}.{index}
                                    <div className="casino-nation-book d-md-none">
                                        {getExByColor(value.amounts)}
                                    </div>
                                </div>
                                <div 
                                    className={`casino-odds-box back ${value.status}`}
                                            onClick={() => openPopup('back', index, value.odds.back, 'ODDS')}
                                        >
                                    <span className="casino-odds">{value.odds.back}</span>
                                </div>
                                <div 
                                    className={`casino-odds-box lay ${value.status}`}
                                            onClick={() => openPopup('lay', index, value.odds.lay, 'ODDS')}
                                        >
                                    <span className="casino-odds">{value.odds.lay}</span>
                                    </div>
                                <div className="casino-nation-book text-center d-none d-md-block w-100">
                                    {getExByColor(value.amounts)}
                                </div>
                                </div>
                            ))}
                    </div>
                    <div className="casino-table-box mt-3">
                        <div className="casino-table-left-box left-odd-box">
                            <div className={`casino-odd-box-container`}>
                                <div className="casino-nation-name">
                                    Odd
                                    <div className="casino-nation-book d-md-none">
                                        {getExByColor(totalPlayers['Odd'].amounts)}
                                    </div>
                                </div>
                                <div 
                                    className={`casino-odds-box back ${totalPlayers['Odd'].status}`}
                                    onClick={() => openPopup('back', 'Odd', totalPlayers['Odd'].odds.back, 'ODD')}
                                >
                                    <span className="casino-odds">{totalPlayers['Odd'].odds.back}</span>
                                </div>
                                <div 
                                    className={`casino-odds-box lay ${totalPlayers['Odd'].status}`}
                                    onClick={() => openPopup('lay', 'Odd', totalPlayers['Odd'].odds.lay, 'ODD')}
                                >
                                    <span className="casino-odds">{totalPlayers['Odd'].odds.lay}</span>
                                        </div>
                                <div className="casino-nation-book text-center d-none d-md-block w-100">
                                        {getExByColor(totalPlayers['Odd'].amounts)}
                                </div>
                            </div>
                        </div>
                        <div className="casino-table-right-box right-odd-box">
                            {Object.entries(totalPlayers).slice(9, 11).map(([index, value], i) => (
                                <div className="aaa-odd-box" key={i}>
                                    <div className="casino-odds text-center">{value.odds.back}</div>
                                    <div 
                                        className={`casino-odds-box back casino-odds-box-theme ${value.status}`}
                                        onClick={() => openPopup('back', value?.canonical_name || index, value.odds.back, "DULHADULHANBARATI")}
                                    >
                                        <span className="casino-odds">{index}</span>
                                    </div>
                                    <div className="casino-nation-book text-center">
                                        {getExByColor(value.amounts)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="casino-table-box mt-3">
                        <div className="casino-table-left-box ">
                            {Object.entries(totalPlayers).slice(7, 9).map(([index, value], i) => (
                                <div className="aaa-odd-box" key={i}>
                                    <div className="casino-odds text-center">{value.odds.back}</div>
                                    <div 
                                        className={`casino-odds-box back casino-odds-box-theme ${value.status}`}
                                        onClick={() => openPopup('back', value?.canonical_name || index, value.odds.back, "COLOR")}
                                    >
                                        <div className="casino-odds">
                                            {index === 'Red' ? (
                                                <>
                                                    <span className="card-icon ms-1">
                                                        <span className="card-red ">{"{"}</span>
                                                    </span>
                                                    <span className="card-icon ms-1">
                                                        <span className="card-red ">[</span>
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="card-icon ms-1">
                                                        <span className="card-black ">{"}"}</span>
                                                    </span>
                                                    <span className="card-icon ms-1">
                                                        <span className="card-black ">]</span>
                                                    </span>
                                                </>
                                            )}
                                        </div>
                        </div>
                                    <div className="casino-nation-book text-center">
                                        {getExByColor(value.amounts)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                        <div className="casino-table-right-box right-cards">
                            <h4 className="w-100 text-center mb-2">
                                <b>{totalPlayers['Card A'].odds.back}</b>
                            </h4>
                            {Object.entries(totalPlayers).slice(11, 15).map(([index, value], i) => (
                                <div className="card-odd-box" key={i}>
                                    <div 
                                        className={value.status}
                                        onClick={() => openPopup('back', index, value.odds.back, 'CARD')}
                                    >
                                        <img src={`/img/casino/cards/${index.replace('Card ', '')}.jpg`} alt={index} />
                                    </div>
                                    <div className="casino-nation-book">
                                        {getExByColor(value.amounts)}
                                    </div>
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

export default Btable;
