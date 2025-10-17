import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    cardPointsCount,
    getExByColor,
    getExByTeamNameForCasino, race17calculation, resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Race17 = () => {
    const [roundId, setRoundId] = useState('')
    const [cardCount, setCardCount] = useState(0)

    const defaultValues = {odds: {back: 0, lay: 0}, status: "suspended-box", amounts: ""}

    const [totalPlayers, setTotalPlayers] = useState({
        "Race to 17": {...defaultValues, subtype: 'race17', subname : "Race to 17"},
        "Big Card (7,8,9) - 1": {...defaultValues, subname: "Big Card (7,8,9) - 1", subtype: 'bigcard'},
        "Zero Card - 1": {...defaultValues, subname: "Zero Card - 1", subtype: 'zerocard'},
        "Any Zero": {...defaultValues, subtype: 'anyzero'},
    })
    const roundIdSaved = useRef(null);

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
                                            <h6 class="rules-highlight">Main:</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>It is played with regular 52 card deck.</li>
                                                <li>Value of</li>
                                            </ul>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Ace = 1 </li>
                                                <li>2 = 2 </li>
                                                <li>3 = 3 </li>
                                                <li>4 = 4 </li>
                                                <li>5 = 5 </li>
                                                <li>6 = 6 </li>
                                                <li>7 = 7 </li>
                                                <li>8 = 8 </li>
                                                <li>9 = 9 </li>
                                                <li>10 = 0 </li>
                                                <li>Jack = 0 </li>
                                                <li>Queen = 0 </li>
                                                <li>King = 0</li>
                                            </ul>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Five(5) card will be pulled from the deck. </li>
                                                <li>It is a race to reach 17 or plus.</li>
                                                <li>If you bet on 17(Back) , &amp; then,</li>
                                                <li>Total of given (5) cards, comes under seventeen(17) you loose.</li>
                                                <li>Total of (5) cards comes over sixteen(16) you win.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Fancy :</h6>
                                            <h7 class="rules-sub-highlight">Big card(7,8,9)</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>here 7,8,9 are named big card.</li>
                                                <li>Back/ lay of big card rate is available to bet on every card.</li>
                                            </ul>
                                            <h7 class="rules-sub-highlight">Zero card(10, jack , queen, king).</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>here 10, jack, queen, king is named zero card.</li>
                                                <li>Back &amp; lay rate to bet on zero card is available on every card.</li>
                                            </ul>
                                            <h7 class="rules-sub-highlight">Any zero card.</h7>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li>Here 10, jack, queen, king, is named zero card, it is bet for having at least one zero card in game( not necessary game will go up to 5 cards). You can bet on this before start of game only.</li>
                                            </ul>
                                        </div></div>`


    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState([]);

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


    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({});

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    const updateAmounts = async () => {

        const promises = Object.entries(totalPlayers).map(([index,value])=> {

            return race17calculation(roundId, value?.subname || index)
        })

        const all_promise = await Promise.all(promises)

        setTotalPlayers((prevState) => {

            const up = {...prevState}

            Object.entries(totalPlayers).forEach(([index,value], i) => {

                up[index].amounts  = Math.round(all_promise[i].data) || ''
            })

            return up;

        })

    }


        const updatePlayers = () => {

        setTotalPlayers(prevState => {
            const updatePlayerss = {...prevState}
            Object.entries(updatePlayerss).forEach(([index, value]) => {
                const datafound = data.sub.find(item => item.subtype === value.subtype)
                if (datafound) {
                    value.status = datafound.gstatus === 'OPEN' ? '' : 'suspended-box';
                    value.odds = {...value.odds, back :datafound.b}
                    value.odds = {...value.odds, lay :datafound.l}
                    if (value.hasOwnProperty('subname')) {
                        value.subname = datafound.nat
                    }
                    
                    // Update playerStatuses
                    setPlayerStatuses(prev => ({
                        ...prev,
                        [datafound.nat]: datafound.gstatus === 'OPEN' ? '' : 'suspended-box'
                    }));
                }
            })
            return updatePlayerss;
        })


    }


    useEffect(() => {

        if (data?.sub) {
            updatePlayers();
        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards(cardArray.slice(0, 6));
            setCardCount(cardPointsCount(['10', 'J', 'Q', 'K', '1'], cardArray.slice(0, 6)))

            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            updateAmounts();
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

    // Helper function to find data in data.sub for Race17
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Race17, find the item by nat field
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

        cards?.map((card, index) => {
            const imgSrc = card ? `/img/casino/cards/${card}.png` : '/img/casino/cards/1.png';
            return (
                <div className="mt-1" key={index}>
                    <div className="flip-card">
                        <div className="flip-card-inner">
                            <div className="flip-card-front">
                                <img src={imgSrc} alt={`${player} card ${index + 1}`}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        })

)
    ;

    const placeBet = async () => {
        const findPlayer = (team) => {
            const found = Object.values(totalPlayers).find(item => item?.subname === team)
            if (found)
                return found.status
            return totalPlayers[team]?.status || 'suspended';
        }
        
        const betData = {
            sportList,
            roundId,
            backOrLay,
            teamname,
            odds,
            profit,
            loss,
            betType: "ODDS",
            stakeValue,
            match_id,
            roundIdSaved,
            totalPlayers: findPlayer(teamname.current),
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
                    <div className="casino-video-cards" style={{width: "200px"}}>
                        <h5>Total : {cardCount} </h5>


                        {renderCards(cards)}

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

        <CasinoLayout raceClass="raceto17" ruleDescription={desc} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>

            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-box">
                        {Object.entries(totalPlayers).map(([index, value], i) => (
                            <div className="casino-odd-box-container" key={i}>
                                <div className="casino-nation-name">{value?.subname || index}</div>
                                <div className={`casino-odds-box back ${value.status}`}
                                     onClick={() => openPopup('back', value?.subname || index, value.odds.back)}><span
                                    className="casino-odds">{value.odds.back}</span></div>
                                <div className={`casino-odds-box lay ${value.status}`}
                                     onClick={() => openPopup('lay', value?.subname || index, value.odds.lay)}><span
                                    className="casino-odds">{value.odds.lay}</span></div>
                                <div className="casino- text-center w-100">

                                    {getExByColor(value.amounts)}
                                </div>
                            </div>
                        ))}
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


export default Race17;
