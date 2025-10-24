import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";
import {CasinoLastResult} from "../components/casino/CasinoLastResult";
import axiosFetch, {
    getExByColor, getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";
import AndarBaharVideoCards from "../components/casino/AndarBaharVideoCards";
const Dum10 = () => {
        const [roundId, setRoundId] = useState('')
        const defaultValues = [{odds: {back: 0, lay: 0}, status: '', amounts: ""}, {odds: 0, status: "suspended-box", amounts: ""}]

        const [totalPlayers, setTotalPlayers] = useState({
            "NEXT_TOTAL": {...defaultValues[0], name: "Next Total 10 or More"},
            'EVEN': defaultValues[1],
            'ODD': defaultValues[1],
            'RED': defaultValues[1],
            'BLACK': defaultValues[1],
            'sum': '',
            'card_count': 0,
            'card_image': import.meta.env.VITE_CARD_PATH + "1.png"

        })

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
    </style>

<div class="rules-section">
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Dus Ka Dum is an unique and instant result game.</li>
                                                <li>It is played with a regular single deck of 52 cards.</li>
                                                <li>In this game each card has point value</li>
                                            </ul>
                                            <h6 class="rules-highlight">Point value of cards:</h6>
                                            <div class="table-responsive">
                                                <table class="table">
                                                    <tbody>
                                                        <tr>
                                                            <td>Ace = 1</td>
                                                            <td>8 = 8</td>
                                                        </tr>
                                                        <tr>
                                                            <td>2 = 2</td>
                                                            <td>9 = 9</td>
                                                        </tr>
                                                        <tr>
                                                            <td>3 = 3</td>
                                                            <td>10 = 10</td>
                                                        </tr>
                                                        <tr>
                                                            <td>4 = 4</td>
                                                            <td>J = 11</td>
                                                        </tr>
                                                        <tr>
                                                            <td>5 = 5</td>
                                                            <td>Q = 12</td>
                                                        </tr>
                                                        <tr>
                                                            <td>6 = 6</td>
                                                            <td>K = 13</td>
                                                        </tr>
                                                        <tr>
                                                            <td>7 = 7</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p>(Suit of card is irrelevant in point value)</p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Dus ka Dum is a one card game. The dealer will draw a single card every time which will decide the result of the game. Hence that particular game will be over.</li>
<li>Now always the last drawn card will be removed and kept aside. Thereafter a new game will commence from the remaining cards. Then the same process will continue till there is a winning chance or otherwise up to 35 cards or so.</li>
                                                <li>All the drawn cards will be added to current total.</li>
                                            </ul>
                                            <p>Example1: </p>
                                            <p>If first four drawn cards are: 7, 9, J, 4</p>
                                            <p>So current total is 31, now on opening of 5th card bet will be for next total 40 or more.</p>
                                            <p>Eaxmple2: If the current total of first 11 drawn cards is 84 the bet will open for next total 90 or more.</p>
                                            <p>Example3: The current total of first 12 drawn cards is 79 the bet will open for next total 90 or more (because on opening of any cards 80 is certainty). </p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>The objective of the game is to achieve next (decade) total or more and therefor win.</li>
                                                <li>Both back and lay options will be available.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Side bets:</h6>
                                            <p>
                                                <h7 class="rules-sub-highlight">Odd even:</h7> Here you can bet on every card whether it will be an odd card or an even card.
                                            </p>
                                            <p>Odd cards: A, 3, 5, 7, 9, J, K</p>
                                            <p>Even cards: 2, 4, 6, 8, 10, Q</p>
                                            <p>
                                                <h7 class="rules-sub-highlight">Red Black:</h7> Here you can bet on every card whether it will be a red card or a black card.
                                            </p>
                                            <p>Red cards: Hearts, Diamonds</p>
                                            <p>Black cards: Spades, Clubs</p>
                                        </div></div>`
        const roundIdSaved = useRef(null);

        const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

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

        useEffect(() => {
            if (data?.sub) {
                setTotalPlayers((prevState) => {
                    Object.entries(prevState).map(([index, value]) => {
                        if (index === 'NEXT_TOTAL') {
                            prevState[index] = {
                                ...prevState[index],
                                name: data.sub[0].nat,
                                odds: {back: data.sub[0].b, lay: data.sub[0].l},
                                status: data.sub[0].gstatus === 'OPEN' ? '' : 'suspended-box'
                            }
                            
                            // Update playerStatuses
                            setPlayerStatuses(prev => ({
                                ...prev,
                                [data.sub[0].nat]: data.sub[0].gstatus === 'OPEN' ? '' : 'suspended-box'
                            }));
                        }
                        if (index === 'sum') {

                            prevState[index] = data.csum
                        }
                        if (index === 'card_count') {
                            prevState[index] = data.lcard.split(",").length
                        }
                        if (index === 'card_image') {
                            prevState[index] = import.meta.env.VITE_CARD_PATH + data.card + ".png";
                        }
                        if (['EVEN', 'RED', 'ODD', 'BLACK'].includes(index)) {

                            const founddata = data.sub.find(item => item.nat.toUpperCase() === index)
                            if (founddata) {
                                prevState[index] = {
                                    ...prevState[index],
                                    odds: founddata.b,
                                    status: founddata.gstatus === 'OPEN' ? '' : 'suspended-box'
                                }
                            }
                        }
                    })
                    return prevState
                })

            }
            remark.current = data.remark || 'Welcome';
        }, [data]);

        const exposure = exposureCheck();
        const sportLength = Object.keys(data).length;

    const updateAmounts = async () => { 
        // Fetch NEXT_TOTAL amounts
        const getEx = await getExByTeamNameForCasino(sportList.id, roundId, totalPlayers.NEXT_TOTAL.name, match_id, 'NEXT_TOTAL');
        const getSingle = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '');
        setTotalPlayers((prevState) => {
            const updatedState = { ...prevState };
            // Update NEXT amounts
            updatedState['NEXT_TOTAL'] = {
                ...updatedState['NEXT_TOTAL'],
                amounts: {loss: getEx?.data?.loss || '', profit: getEx?.data?.profit || ''},
            };
            // Update amounts for EVEN, ODD, RED, BLACK
            ['EVEN', 'ODD', 'RED', 'BLACK'].forEach((value) => {
                const foundData = getSingle.data.find(item => item.type === value);
                updatedState[value] = {
                    ...updatedState[value],
                    amounts: foundData ? foundData.total_amount : '',
                };
            });

            return updatedState;
        });
    };



    useEffect(() => {
            if (data?.sub && sportList?.id) {
                updateAmounts();
            }

        }, [totalPlayers.NEXT_TOTAL.name, exposure, sportLength, roundId, mybetModel.length]);


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

        // Helper function to find data in data.sub for Dum10
        const findDataInSub = (teamName, betType) => {
            if (!data || !data.sub) return null;

            // For Dum10, find the item by nat field
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
                totalPlayers: totalPlayers[betType],
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
                <>
                    <div className="casino-video-cards">
                        <div className="dkd-total mb-1 mt-1">
                            <div>
                                <div>
                                    <div>Curr. Total:</div>
                                    <div className="numeric text-playerb">{totalPlayers.sum}</div>
                                </div>
                                <div>Card #: {totalPlayers.card_count}</div>
                            </div>
                            <div>{totalPlayers.NEXT_TOTAL.name}</div>
                        </div>
                        <div className="ab-cards-container">
                            <div className="ms-4">
                                {data?.lcard && (
                                    <AndarBaharVideoCards dontSplit={true} cards={data?.lcard} styles={{width: "100px"}} player={"Bahar"}
                                                          hidePlayers={true}/>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="casino-video-current-card">
                        <div className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <img src={totalPlayers.card_image} alt="Current Card"/>
                                </div>
                                <div className="flip-card-back">
                                    <img src={totalPlayers.card_image} alt="Current Card"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
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
            <CasinoLayout ruleDescription={desc} raceClass="duskadum" hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                          stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                          submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                          sportList={sportList}
                          setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                          getMinMaxLimits={getMinMaxLimits}>

                <div className="casino-detail">
                    <div className="casino-table">
                        <div className="casino-table-box">
                            <div className="casino-table-header">
                                <div className="casino-nation-detail"></div>
                                <div className="casino-odds-box back">Back</div>
                                <div className="casino-odds-box lay">Lay</div>
                            </div>
                            <div className="casino-table-body">
                                <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">{totalPlayers.NEXT_TOTAL.name}</div>
                                        <div>
                                        {getExByColor(-Math.abs(totalPlayers.NEXT_TOTAL?.amounts?.loss))}
                                        <br />
                                            {getExByColor(totalPlayers.NEXT_TOTAL?.amounts?.profit)}
                                            
                                            
                                        </div>
                                    </div>
                                    <div className={`casino-odds-box back ${totalPlayers.NEXT_TOTAL.status}`}
                                         onClick={() => openPopup('back', totalPlayers.NEXT_TOTAL.name, totalPlayers.NEXT_TOTAL.odds.back, 'NEXT_TOTAL')}>
                                        <span className="casino-odds">{totalPlayers.NEXT_TOTAL.odds.back}</span>
                                    </div>
                                    <div className={`casino-odds-box lay ${totalPlayers.NEXT_TOTAL.status}`}
                                         onClick={() => openPopup('lay', totalPlayers.NEXT_TOTAL.name, totalPlayers.NEXT_TOTAL.odds.lay, 'NEXT_TOTAL')}>
                                        <span className="casino-odds">{totalPlayers.NEXT_TOTAL.odds.lay}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="casino-table-box mt-3">
                            <div className="casino-table-left-box">
                                {["EVEN", "ODD"].map((key) => (
                                    <div className="aaa-odd-box" key={key}>
                                        <div
                                            className="casino-odds text-center">{totalPlayers[key].odds.back || totalPlayers[key].odds}</div>
                                        <div
                                            className={`casino-odds-box back casino-odds-box-theme ${totalPlayers[key].status}`}
                                            onClick={() => openPopup('back', key, totalPlayers[key].odds, key)}>
                                            <span className="casino-odds">{key}</span>
                                        </div>
                                        <div
                                            className="casino-odds text-center mb-2">{getExByColor(totalPlayers[key].amounts)}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="casino-table-right-box">
                                {["RED", "BLACK"].map((key) => (
                                    <div className="aaa-odd-box" key={key}>
                                        <div
                                            className="casino-odds text-center">{totalPlayers[key].odds.back || totalPlayers[key].odds}</div>
                                        <div
                                            className={`casino-odds-box back casino-odds-box-theme ${totalPlayers[key].status}`}
                                            onClick={() => openPopup('back', key, totalPlayers[key].odds, key)}>
                                            <div className="casino-odds">
                                <span className="card-icon ms-1">
                                    <span
                                        className={key === "RED" ? "card-red" : "card-black"}>{key === "RED" ? '{' : '}'}</span>
                                </span>
                                                <span className="card-icon ms-1">
                                    <span
                                        className={key === "RED" ? "card-red" : "card-black"}>{key === "RED" ? '[' : ']'}</span>
                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className="casino-odds text-center mb-2">{getExByColor(totalPlayers[key].amounts)}</div>
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
export default Dum10;
