import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import axiosFetch, {
    resetBetFields,
    cardMap, getExByColor, getExBySingleTeamNameCasino, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";
import AndarBaharVideoCards from "../components/casino/AndarBaharVideoCards";

const Abj = () => {
    const teamEx = {
        height: '18px',
        display: 'block'
    };
    const [roundId, setRoundId] = useState('')

    const [playerStatuses, setPlayerStatuses] = useState({});

    const [totalPlayers, setTotalPlayers] = useState([

        {
            "ODDS": [{

                "SA": { odds: 15, status: 'suspended-box' },
                "1st Bet": { odds: 2, amounts: '', status: 'suspended-box', canonical_name: 'First Bet A' },
                "2nd Bet": { odds: 2, status: 'suspended-box', canonical_name: 'Second bet A' }
            },

            {
                "SB": { odds: 15, status: 'suspended-box' },
                "1st Bet": { odds: 2, amounts: '', status: 'suspended-box', canonical_name: 'First Bet B' },
                "2nd Bet": { odds: 2, status: 'suspended-box', canonical_name: 'Second bet B' }
            }

            ],
        },
        {
            "ODDEVEN": [{
                "Odd": {
                    odds: 0, status: 'suspended-box', amounts: ''

                }
            }, {
                "Even":
                {
                    odds: 0, status: 'suspended-box', amounts: ''
                }

            }],
        }, {
            "COLOR": [{
                "Spade": {
                    odds: 0, status: 'suspended-box', amounts: '', img: import.meta.env.VITE_CARD_PATH + "spade.png"

                }
            }, {
                "Club":
                {
                    odds: 0, status: 'suspended-box', amounts: '', img: import.meta.env.VITE_CARD_PATH + "club.png"
                }

            },
            {
                "Heart":
                {
                    odds: 0,
                    status: 'suspended-box',
                    amounts: '',
                    img: import.meta.env.VITE_CARD_PATH + "heart.png"
                }

            },
            {
                "Diamond":
                {
                    odds: 0,
                    status: 'suspended-box',
                    amounts: '',
                    img: import.meta.env.VITE_CARD_PATH + "diamond.png"
                }

            }],
        },
        {
            "CARD_SINGLE": Array.from({ length: 13 }, (_, index) => ({
                img: "/img/card/" + (index + 1) + ".jpg",
                odds: 0,
                status: 'suspended-box',
                amounts: '',
                nat: "Joker " + cardMap(index)
            }))


        },


    ])


    const updatePlayers = (d_data) => {
        const CARDS = d_data.slice(6, 19);
        const ODDEVEN = d_data.slice(23, 25)
        const updatedPlayers = totalPlayers.map(playerCategory => {
            // Iterate through each category (e.g., ODDS, ODDEVEN, etc.)
            return Object.keys(playerCategory).reduce((acc, category) => {

                acc[category] = playerCategory[category].map(player => {
                    // Update odds and status based on data
                    const playerKey = Object.keys(player)[0];

                    if (category === "ODDEVEN") {
                        // Find matching data for ODDEVEN category

                        const foundData = ODDEVEN.find(item => item.nat.includes(playerKey));

                        if (foundData) {
                            player[playerKey].odds = foundData.b; // Update odds for ODDEVEN
                            player[playerKey].status = foundData.gstatus === "OPEN" ? "" : "suspended-box"; // Update status for ODDEVEN
                        }
                    } else if (category === "CARD_SINGLE") {
                        // Find matching data for CARD_SINGLE category
                        acc[category] = playerCategory[category].map(player => {

                            const foundData = CARDS.find(card => card.nat === player.nat);

                            if (foundData) {
                                player.odds = foundData.b; // Update odds for CARD_SINGLE
                                player.status = foundData.gstatus === "OPEN" ? "" : "suspended-box"; // Update status for CARD_SINGLE
                            }

                            return player;
                        });
                    } else {

                        // Handle other categories like ODDS in the same way as before
                        Object.keys(player).forEach(key => {
                            const foundData = d_data.find(item => item.nat.includes(key));

                            if (foundData) {
                                player[key].odds = foundData.b; // Update odds
                                player[key].status = foundData.gstatus === "OPEN" ? "" : "suspended-box"; // Update status
                            }
                        });
                    }

                    return player;
                });
                return acc;
            }, {});
        });
        setTotalPlayers(updatedPlayers);
    }


    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState([]);

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const { match_id } = useParams();
    const {
        setBetType,
        betType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    // Get user data from Redux instead of AuthContext
    const {mybetModel} = useContext(CasinoContext)
    const [hideLoading, setHideLoading] = useState(true)

    
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

<div class="rules-section">
                                            <h6 class="rules-highlight">Rules</h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>
                                                    Andar Bahar is a very simple game that involves the use of a single pack of cards.Game is played between the House and the Player. The dealer deals a single card face up on the Joker place and then proceeds to deal cards face up on A (ANDAR) and B (BAHAR)
                                                    spots. When a card appears that matches the value of the Joker card then the game ends. Before the start of the game, players bet on which side they think the game will end.
                                                </li>
                                                <li>
                                                    Before dealer starts dealing/opening cards from the deck, he/she also offers a side bet to the players who have estimated time to bet if the card/joker will be dealt as the 1st card.
                                                </li>
                                                <li>
                                                    If the 1st placed card doesn't match the value of the Joker's card, the game continues and the dealer then offers the option to players to put their 2nd bet on the same joker card to be dealt either on ANDAR or on BAHAR. The players again have estimated
                                                    time to decide if they want to place a 2nd bet. Dealer deals the cards one at a time alternating between two spots.
                                                </li>
                                                <li>
                                                    If the 1st dealt card in 1st bet matches the joker’s card, Bahar side wins with payout 1:0,5
                                                </li>
                                                <li>
                                                    If the 1st dealt card in 1st bet matches the joker’s card, Andar side wins with payout 1:0,5
                                                </li>
                                                <li>
                                                    If the 2nd dealt card in 1st bet matches the joker’s card, Bahar side wins with payout 1:0,5
                                                </li>
                                                <li>
                                                    If the 2nd dealt card in 1st bet matches the joker’s card, Andar side wins with payou 1:0,5
                                                </li>
                                            </ul>
                                        </div></div>`;
    const teamNames = useRef(["Player A", "Player B"])
    const [data, setData] = useState([]);


    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {


        if (data?.sub) {


            updatePlayers(data?.sub)
            
            // Update playerStatuses dynamically for each player individually
            const newPlayerStatuses = {};
            
            // Update status for each player based on their individual status from data.sub
            data.sub.forEach(item => {
                const playerStatus = item.gstatus === 'OPEN' ? '' : 'suspended-box';
                newPlayerStatuses[item.nat] = playerStatus;
            });
            
            setPlayerStatuses(newPlayerStatuses);
        }

        if (data?.card) {
            const cardArray = data?.card?.split(",").map(item => item.trim())
            setCards(cardArray.slice(0, 3));

            
            remark.current = data.remark || 'Welcome';
        }

    }, [data]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;
    const updateAmounts = async () => {
        const amount = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id);

        let updatedPlayers = totalPlayers;

        updatedPlayers.map(playerCategory => {
            // Iterate through each category (e.g., ODDS, ODDEVEN, etc.)
            return Object.keys(playerCategory).reduce((acc, category) => {

                acc[category] = playerCategory[category].map((player, key) => {
                    // Update odds and status based on data
                    const playerKey = Object.keys(player)[0];


                    // Find matching data for the current category


                    if (category === 'CARD_SINGLE') {
                        acc[category] = playerCategory[category].map(c => {
                            // Match the card's nat with the team_name in amount data
                            const foundData = amount.data?.find(item => item.team_name === c.nat);


                            c.amounts = foundData?.total_amount || "";  // Update the amounts from foundData


                            return c;  // Return the updated card object
                        });
                    } else if (category === 'ODDEVEN') {
                        acc[category] = playerCategory[category].map((acc, c) => {
                            const keyis = Object.keys(acc)[key]

                            // Match the card's nat with the team_name in amount data
                            const foundData = amount.data?.find(item => item.team_name === keyis);


                            if (acc[keyis]) {
                                acc[keyis].amounts = foundData?.total_amount || "";  // Update the amounts from foundData
                            }


                            return acc;  // Return the updated card object
                        });
                    } else if (category === 'ODDS') {
                        acc[category] = playerCategory[category].map((acc, c) => {
                            const keyis = Object.keys(acc)[key]
                            // Match the card's nat with the team_name in amount data
                            const foundData = amount.data?.find(item => item.team_name === acc[keyis].canonical_name);

                            if (acc[keyis]) {

                                acc[keyis].amounts = foundData?.total_amount || "";  // Update the amounts from foundData
                            }

                            return acc;  // Return the updated card object
                        });
                    } else {
                        const foundData = amount.data?.find(item => item.team_name === playerKey && item.type === category);


                        // Update odds and status based on found data
                        player[playerKey].amounts = foundData?.total_amount; // Update the odds (or total amount in this case)

                    }

                    return player;
                });
                return acc;
            }, {});
        });

        setTotalPlayers(updatedPlayers);

    };


    useEffect(() => {

        if (data?.sub && sportList?.id) {


            updateAmounts();
        }
    }, [exposure, sportLength, roundId, mybetModel.length]);


    const openPopup = (isBakOrLay, teamnam, oddvalue, type) => {

        setBetType(type)
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

    // Helper function to find data in data.sub for Abj
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Abj, find the item by nat field
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
            totalPlayers: totalPlayers[teamname.current],
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
            }
        });

        return success;
    }

    const renderVideoBox = () => {
        const validCards = cards.filter(card => card !== '1');
        const hasCards = validCards.length > 0;
        
        return (
            <div className="casino-video-cards">
                {hasCards && (
                    <div className="ab-cards-container">
                        <div className="row row5 align-items-center">
                            <div className="col-1">
                                <div className="row row5">
                                    <div className="col-12"><b>A</b></div>
                                </div>
                                <div className="row row5">
                                    <div className="col-12"><b>B</b></div>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="flip-card">
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <img src={import.meta.env.VITE_CARD_PATH + validCards[0] + ".png"} alt="Main Card" />
                                        </div>
                                        <div className="flip-card-back">
                                            <img src={import.meta.env.VITE_CARD_PATH + validCards[0] + ".png"} alt="Main Card" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-9">
                                <div className="row row5 mb-1">
                                    <div className="col-3">
                                        <div className="flip-card">
                                            <div className="flip-card-inner">
                                                <div className="flip-card-front">
                                                    <img src={validCards[1] ? import.meta.env.VITE_CARD_PATH + validCards[1] + ".png" : import.meta.env.VITE_CARD_PATH + "1.png"} alt="Player A Card" />
                                                </div>
                                                <div className="flip-card-back">
                                                    <img src={validCards[1] ? import.meta.env.VITE_CARD_PATH + validCards[1] + ".png" : import.meta.env.VITE_CARD_PATH + "1.png"} alt="Player A Card" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-9">
                                        {data.card && (
                                            <AndarBaharVideoCards 
                                                hidePlayers={true} 
                                                styles={{ width: "100px" }}
                                                cards={data.card}
                                                player="Andar"
                                                gamename="abj" 
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="row row5">
                                    <div className="col-3">
                                        <div className="flip-card">
                                            <div className="flip-card-inner">
                                                <div className="flip-card-front">
                                                    <img src={validCards[2] ? import.meta.env.VITE_CARD_PATH + validCards[2] + ".png" : import.meta.env.VITE_CARD_PATH + "1.png"} alt="Player B Card" />
                                                </div>
                                                <div className="flip-card-back">
                                                    <img src={validCards[2] ? import.meta.env.VITE_CARD_PATH + validCards[2] + ".png" : import.meta.env.VITE_CARD_PATH + "1.png"} alt="Player B Card" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-9">
                                        {data.card && (
                                            <AndarBaharVideoCards 
                                                hidePlayers={true} 
                                                styles={{ width: "100px" }}
                                                cards={data.card}
                                                player="Bahar"
                                                gamename="abj" 
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
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
        <CasinoLayout raceClass="ab2" ruleDescription={ruleDescription} hideLoading={hideLoading}
            isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
            stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
            submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
            sportList={sportList}
            setSportList={setSportList}
              setData={setData}
            setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
            getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-table">
                <div className="casino-table-full-box">
                    {totalPlayers[0]['ODDS'].map((player, index) => {
                        const playerLetter = index === 0 ? "A" : "B";
                        return (
                            <div key={index} className="playera-bets">
                                <div className="playera-title">{playerLetter}</div>
                                
                                {Object.entries(player).map(([betType, betData], index1) => {
                                    const isSA = index1 === 0;
                                    
                                    return (
                                        <div key={index1} className={isSA ? "player-sa" : "player-bet"}>
                                            <div className={`${isSA ? 'player-sa-box' : 'player-bet-box'} ${betData.status}`}
                                                 onClick={() => betData.canonical_name ? openPopup('back', betData.canonical_name, betData.odds, 'ODDS') : null}>
                                                <div className="casino-odds">{betType}</div>
                                                <div className="casino-volume">{betData.odds}</div>
                                            </div>
                                            <div className="casino- text-center">
                                                {betData.amounts && getExByColor(betData.amounts)}
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                <div className="playera-title">{playerLetter}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="casino-table-box mt-3">
                <div className="casino-table-left-box">
                    {totalPlayers.slice(1, 2).map((mapvalue, mapindex) => {
                        return mapvalue[Object.keys(mapvalue)[0]].map((value, index) => {
                            const oddkeys = Object.keys(value)[0];
                            const betType = (Object.keys(mapvalue)[0]);

                            return (
                                <div className="ab2-box" key={index}>
                                    <div className="casino-odds text-center">{oddkeys}</div>
                                    <div className={`casino-odds-box back ${value[oddkeys].status}`}
                                         onClick={() => openPopup('back', oddkeys, value[oddkeys].odds, betType)}>
                                        <span className="casino-odds">{value[oddkeys].odds}</span>
                                    </div>
                                    <div className="casino- text-center">
                                        {getExByColor(value[oddkeys].amounts)}
                                    </div>
                                </div>
                            );
                        });
                    })}
                </div>
                <div className="casino-table-right-box">
                    {totalPlayers.slice(2, 3).map((mapvalue, mapindex) => {
                        return mapvalue[Object.keys(mapvalue)[0]].map((value, index) => {
                            const oddkeys = Object.keys(value)[0];
                            const betType = (Object.keys(mapvalue)[0]);

                            return (
                                <div className="ab2-box" key={index}>
                                    <div className="casino-odds text-center">
                                        <img src={value[oddkeys].img} alt={oddkeys} />
                                    </div>
                                    <div className={`casino-odds-box back ${value[oddkeys].status}`}
                                         onClick={() => openPopup('back', oddkeys, value[oddkeys].odds, betType)}>
                                        <span className="casino-odds">{value[oddkeys].odds}</span>
                                    </div>
                                    <div className="casino- text-center">
                                        {getExByColor(value[oddkeys].amounts)}
                                    </div>
                                </div>
                            );
                        });
                    })}
                </div>
            </div>
            <div className="casino-table-full-box ab2cards mt-3">
                {totalPlayers[3].CARD_SINGLE.map((value, index) => {
                    return (
                        <div className="card-odd-box" key={index}>
                            <div className={`${value.status}`}
                                 onClick={() => openPopup('back', value.nat, value.odds, 'CARD_SINGLE')}>
                                <img src={value.img} alt={value.nat} />
                            </div>
                            <div className="casino-">
                                {getExByColor(value.amounts)}
                            </div>
                        </div>
                    );
                })}
            </div>

                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>

                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results">

                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data} />
                </div>
            


        </CasinoLayout>
    );

};


export default Abj;
