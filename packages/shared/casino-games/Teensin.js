import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    cardMap, getExByColor, getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet, updatePlayerStats,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Teensin = () => {
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
            setBetType,
            betType,
            setPopupDisplayForDesktop,

        } = useContext(SportsContext)
        const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)

        const values = {status: "suspended-box", amounts: ""}
        const defaultValues = {odds: {back: 0, lay: 0}, ...values}

        const withOddvalue = {...values, odds: 0}
        const playerArray = [{"Player": withOddvalue},

            {"High Card": withOddvalue},
            {"Pair": withOddvalue},
            {"Color Plus": withOddvalue}
        ]
        const [totalPlayers, setTotalPlayers] = useState({

            "Player A": playerArray,
            "Player B": playerArray,
            "LUCKY9": defaultValues,


        })
        
        const [playerStatuses, setPlayerStatuses] = useState({
            "Player A": 'suspended-box',
            "Player B": 'suspended-box',
            "LUCKY9": 'suspended-box'
        });

    const desc = `<div><style type="text/css">
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
    </style>

<div class="rules-section">
                                            <p>Here We use total of 29 cards :</p>
                                            <ul class="pl-2 pr-2 mt-2 list-style">
                                                <li>2*4 ( All four color of 2 )</li>
                                                <li>3*4 ( All four color of 3)</li>
                                                <li>4*4 ( All four color of 4 )</li>
                                                <li>5*4</li>
                                                <li>6*4</li>
                                                <li>7*4</li>
                                                <li>8*4</li>
                                                <li>9 of spade .</li>
                                                <li>It is played between two players A and B each player will get 3 cards .</li>
                                            </ul>
                                            <p>
                                                <b>To win regular bet there is two criteria :</b>
                                            </p>
                                            <ul class="pl-2 pr-2 mt-2 list-style">
                                                <li>1st : If any player has trio he will win if both have trio the one who has got higher trio will win .</li>
                                                <li>2nd : If nobody has trio baccarat value will be compared . Higher baccarat value game will win .</li>
                                                <li>To get the baccarat value , from the total of three cards last digit will be taken as baccarat value .</li>
                                                <li>Point Value of cards :</li>
                                                <li>2=2</li>
                                                <li>3=3</li>
                                                <li>4=4</li>
                                                <li>5=5</li>
                                                <li>6=6</li>
                                                <li>7=7</li>
                                                <li>8=8</li>
                                                <li>9=9</li>
                                            </ul>
                                            <p>
                                                <b>Note : Suits doesnt matter in point value of cards</b>
                                            </p>
                                            <p>Example : 2,5,8</p>
                                            <p>2+5+8 = 15 , here last digit is 5 so baccarat value is 5</p>
                                            <p>If the total is in single digit 2,2,3</p>
                                            <p>2+2+3 =7 , in this case the single digit is 7 is considered as baccarat value</p>
                                            <p>
                                                <b>If both players have same baccarat value then highest card of both the game will be compared whose card is higher will win .</b>
                                            </p>
                                            <ul class="pl-2 pr-2 mt-2 list-style">
                                                <li>If 1st highest card is equal , then 2nd high card will be compared</li>
                                                <li>If 2nd highest card is equal , then 3rd high card will be compared</li>
                                                <li>If 3rd highest card is equal , then game will be tied and Money will be returned.</li>
                                            </ul>
                                        </div></div>
                                        <div><div class="rules-section">
                                            <p>
                                                <b>Fancy:</b>
                                            </p>
                                            <p>
                                                <b>HIGH CARD :</b>
                                            </p>
                                            <p>It is comparison of the high value card of both the game , the game having higher high value card then other game will win . if high value card is same the 2nd high card will be compared if 2nd high card is same then 3rd high card will be compared . If 3rd high card is same then game is tie .</p>
                                            <p>
                                                <b>Money return :</b>
                                            </p>
                                            <p>
                                                <b>PAIR :</b>
                                            </p>
                                            <p>You can bet for pair on any of your selected game</p>
                                            <p>Only condition is If you bet for pair you must have pair in that game .</p>
                                            <p>
                                                <b>Example :</b>
                                            </p>
                                            <p>6,6,4</p>
                                            <p>5,5,2</p>
                                            <p>4,4,4 ( trio will be also considerd as a Pair )</p>
                                            <p>
                                                <b>LUCKY 9 :</b>
                                            </p>
                                            <p>It is bet for having card 9 among any of total six card of both games .</p>
                                            <p>
                                                <b>COLOR PLUS :</b>
                                            </p>
                                            <p>You can bet for color plus on any game A or B .</p>
                                            <p>If you bet on color plus you get 4 option to win price</p>
                                            <p>if you have</p>
                                            <ul class="pl-2 pr-2 mt-2 list-style">
                                                <li>1. sequence 3.4,5 of different suit , You will get 2 times of betting amount .</li>
                                                <li>2. if you get color 3,5,7 of same suit , you will get 5 times of betting amount</li>
                                                <li>3. If you get trio 4,4,4 , You will get 20 times of betting amount .</li>
                                                <li>4. If you get pure sequence 4,5,6 of same suit , You will get 30 times of betting amount .</li>
                                            </ul>
                                            <p>If you get pure sequence you will not get price of color and simple sequence</p>
                                            <p>Means you will get only one price in any case</p>
                                        </div></div>`


        
        const [data, setData] = useState([]);

        

        const remark = useRef('Welcome');
        const [lastResult, setLastResult] = useState({});
        const teamname = useRef('');
        const loss = useRef(0);
        const profit = useRef(0);
        const profitData = useRef(0);


        useEffect(() => {


            if (data?.sub) {

                const updateData = () => {
                    setTotalPlayers((prevState) => {
                        const updatedState = JSON.parse(JSON.stringify(prevState)); // Create a deep copy


                        Object.entries(updatedState).forEach(([index1, value]) => {
                            if (Array.isArray(value)) {
                                value.forEach((vv, index) => {

                                    if (index1 === 'Player A' || index1 === 'Player B') {
                                        const getSide = index1.split(" ")[1]
                                        const keys = Object.keys(vv)[0]


                                        const foundata = data.sub.find(item => item.nat === keys + " " + getSide)


                                        if (foundata) {
                                            updatedState[index1][index][keys] = {
                                                ...updatedState[index1][index][keys],
                                                odds: foundata.b,
                                                status: foundata.gstatus === 'OPEN' ? '' : "suspended-box"
                                            }
                                            
                                            // Update playerStatuses
                                            setPlayerStatuses(prev => ({
                                                ...prev,
                                                [index1]: foundata.gstatus === 'OPEN' ? '' : 'suspended-box'
                                            }));

                                        }

                                    }
                                })
                            }

                        })


                        const foundata = data.sub.find(item => item.nat === 'Lucky 9')


                        if (foundata) {
                            updatedState['LUCKY9'] = {
                                ...updatedState['LUCKY9'],
                                odds: {back: foundata.b, lay: foundata.l},
                                status: foundata.gstatus === 'OPEN' ? '' : "suspended-box"

                            }
                            
                           
                        }


                        return updatedState
                    })

                }

                updateData()
            }

            if (data.card) {
                const cardArray = data.card.split(",").map(item => item.trim());
                setCards({
                    playerA: cardArray.filter((_, index) => index % 2 === 0),
                    playerB: cardArray.filter((_, index) => index % 2 === 1),
                });
                remark.current = data.remark || 'Welcome';
            }
        }, [data]);

        const exposure = exposureCheck();
        const sportLength = Object.keys(data).length;

        const updateAmounts = async () => {
            const results = await Promise.all([
                getExByTeamNameForCasino(sportList.id, roundId, 'Lucky 9', match_id, 'LUCKY9'),
                getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '')
            ]);

            setTotalPlayers((prevState) => {
                const updatedState = JSON.parse(JSON.stringify(prevState));

                    updatedState['LUCKY9'].amounts = results?.[0]?.data || '';
                const teamAmounts = {};

                results?.[1]?.data?.forEach((item) => {
                    const teamName = item.team_name; // Get the team_name from the result
                    teamAmounts[teamName] = item.total_amount || 0; // Store the total amount by team name
                });

                        // Loop through updatedState to find the matching players
                        Object.entries(updatedState).forEach(([index1, value]) => {
                            if (Array.isArray(value)) {
                                value.forEach((vv, index) => {
                                        // Check for 'Player A' or 'Player B'
                                        if (index1 === 'Player A' || index1 === 'Player B') {
                                            const getSide = index1.split(" ")[1]; // Get "A" or "B"
                                            const key = Object.keys(vv)[0] === 'Pair' ? "Pair Plus" : Object.keys(vv)[0];
                                            const teamkey = key + " " + getSide
                                            // If the teamName matches the key + side, update the amounts
                                            if (teamAmounts[teamkey] !== undefined) {
                                               updatedState[index1][index][Object.keys(vv)[0]] = {
                                                    ...updatedState[index1][index][Object.keys(vv)[0]],
                                                    amounts:teamAmounts[teamkey] || ''
                                                }

                                            }
                                            else{
                                                updatedState[index1][index][Object.keys(vv)[0]] = {
                                                    ...updatedState[index1][index][Object.keys(vv)[0]],
                                                    amounts:''
                                                }
                                            }

                                        }
                                    }
                                )
                                ;
                            }
                        });


                    return updatedState; // Return the new state
                });

        };


        useEffect(() => {

            if (data?.sub && sportList?.id) {
                updateAmounts()
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

        // Helper function to find data in data.sub for Teensin
        const findDataInSub = (teamName, betType) => {
            if (!data || !data.sub) return null;

            // For Teensin, find the item by nat field
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
                betType,
                stakeValue,
                match_id,
                roundIdSaved,
                totalPlayers: totalPlayers[teamname.current],
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

            <CasinoLayout raceClass="baccarat29" ruleDescription={desc} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                          stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                          submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                          sportList={sportList}
                          setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                          getMinMaxLimits={getMinMaxLimits}>

                <div className="casino-detail">
                    <div className="casino-table">
                        <div className="casino-table-box">
                            {Object.entries(totalPlayers).slice(0, 2).map(([index1, value], i) => (
                                <div className={i === 0 ? "casino-table-left-box" : "casino-table-right-box"} key={i}>
                                    <div className="casino-table-header">
                                        <div className="casino-nation-detail">{index1}</div>
                                    </div>
                                    <div className="casino-table-body">
                                        <div className="casino-table-row">
                                            <div className="casino-odds-box">Winner</div>
                                            <div className="casino-odds-box">High Card</div>
                                            <div className="casino-odds-box">Pair</div>
                                            <div className="casino-odds-box">Color Plus</div>
                                        </div>
                                        <div className="casino-table-row">
                                            {value.map((value1, index) => {
                                                const keys = Object.keys(value1)[0]

                                                return (
                                                    <div className={`casino-odds-box back ${value1[keys].status}`}
                                                         key={index}
                                                         onClick={() => openPopup('back', keys === 'Pair' ? 'Pair Plus ' + index1.split(" ")[1] : (keys === 'Player' ? index1 : keys+ " " + index1.split(" ")[1]), value1[keys].odds, keys === 'Player' ? 'WINNER' : keys.replace(" ", "").toUpperCase())}>
                                                        <span className="casino-odds">{value1[keys].odds}</span>
                                                        <span className="casino-">
                                                    {getExByColor(value1[keys].amounts)}
                                                    </span>
                                                    </div>
                                                )
                                            })}

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="casino-table-full-box mt-3">
                            <img src="/img/lucky9.png"/>
                            <div className="casino-odd-box-container">
                                <div className={`casino-odds-box back ${totalPlayers['LUCKY9'].status}`}
                                     onClick={() => openPopup('back', 'Lucky 9', totalPlayers['LUCKY9'].odds.back, 'LUCKY9')}><span
                                    className="casino-odds">{totalPlayers['LUCKY9'].odds.back}</span></div>
                                <div className={`casino-odds-box lay ${totalPlayers['LUCKY9'].status}`}
                                     onClick={() => openPopup('lay', 'Lucky 9', totalPlayers['LUCKY9'].odds.lay, 'LUCKY9')}><span
                                    className="casino-odds">{totalPlayers['LUCKY9'].odds.lay}</span></div>
                                <div className="casino- text-center w-100">
                                    {getExByColor(totalPlayers['LUCKY9'].amounts)}


                                </div>
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

export default Teensin;
