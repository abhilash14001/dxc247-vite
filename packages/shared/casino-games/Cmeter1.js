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
import data from "bootstrap/js/src/dom/data";

const Cmeter1 = () => {
    const [roundId, setRoundId] = useState('')
    const [totalPlayers, setTotalPlayers] = useState({

        'Fighter A': {odds: "", status: "suspended-box", amounts: ""},
        'Fighter B': {odds: "", status: "suspended-box", amounts: ""}

    })

    const roundIdSaved = useRef(null);

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
    </style>


<div class="rules-section">
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>1 Card meter will be played with 8 deck of cards.</li>
                                                <li>In this game the value of the cards will be as follow
                                                    <p>ACE =1, 2=2, 3=3, ……, Jack =11, Queen=12, King=13.</p>
                                                </li>
                                                <li>In this game there will be two players which will be named as Fighter A &amp; Fighter B.</li>
                                                <li>1 card each will be dealt to both the fighters.</li>
                                                <li>In this game the winner will be the fighter who will have the higher value card and also his point difference will be calculated.</li>
                                            </ul>
                                            <p>For example,</p>
                                            <p>Fighter A has 7.</p>
                                            <p>Fighter B has King (K).</p>
                                            <p>So fighter B will be the winner with 6 points (13-7 = 6).</p>
                                            <p>here the winning amount will be calculated on the point differences.</p>
                                            <p>Like,</p>
                                            <p>1 point 1 time bet amount.</p>
                                            <p>2 points 2 times bet amount.</p>
                                            <p>3 points 3 times bet amount.</p>
                                            <p>4 points 4 times bet amount.</p>
                                            <p>5 points 5 times bet amount.</p>
                                            <p>6 points 6 times bet amount.</p>
                                            <p>7 points 7 times bet amount.</p>
                                            <p>8 points 8 times bet amount.</p>
                                            <p>9 points 9 times bet amount.</p>
                                            <p>10 points 10 times bet amount.</p>
                                            <p>11 points 11 times bet amount.</p>
                                            <p>12 points 12 times bet amount.</p>
                                            <p>(12 times bet amount will be the highest)</p>
                                            <p>So in this case the difference is 6 points thus the winning amount for Fighter B will be 6 times of the bet amount and similarly For Fighter A the losing amount will be 6 times of the bet amount.</p>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>In this game If punter place bet of 100 amount &amp; If he loses by 12 points then he will lose 1200 amount.
                                                    <p>In short in this game punter can win or lose up to 12 times of his betting amount. </p>
                                                </li>
                                                <li>If both the fighters have same value cards but of different suits then the winner will be decided by the ranking of the suits
                                                    <p>Ie. Spades hearts clubs diamonds</p>
                                                    <p>And in this case the winning amount will be 1 time of the bet amount.
                                                    </p>
                                                    <p>If both the fighters have the same value cards and of the same suits then in this case it will be a tieand the bet amount will be pushed( Returned)</p>
                                                </li>
                                                <li>2% will be charged on winning amount only.</li>
                                            </ul>
                                        </div></div>`


    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({});

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        setBetType('ODDS')

        if (data?.sub) {
            setTotalPlayers((prevState) => {

                const prev = {...prevState};


                prev['Fighter A'].status = data?.sub[0]?.gstatus === 'OPEN' ? '' : 'suspended-box'
                prev['Fighter B'].status = data?.sub[1]?.gstatus === 'OPEN' ? '' : 'suspended-box'

                prev['Fighter A'].status = data?.sub[0]?.gstatus === 'OPEN' ? '' : 'suspended-box'
                prev['Fighter B'].status = data?.sub[1]?.gstatus === 'OPEN' ? '' : 'suspended-box'
                
                // Update playerStatuses
                setPlayerStatuses(prev => ({
                    ...prev,
                    'Fighter A': data?.sub[0]?.gstatus === 'OPEN' ? '' : 'suspended-box',
                    'Fighter B': data?.sub[1]?.gstatus === 'OPEN' ? '' : 'suspended-box'
                }));

                prev['Fighter A'].odds = data?.sub[0]?.b
                prev['Fighter B'].odds = data?.sub[1]?.b

                return prev;

            })


        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards(cardArray.slice(0, 3));
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;

    const updateAmounts = async () => {

        const results = [await getExBySingleTeamNameCasino(sportList.id, roundId, 'FIGHTER A', match_id, 'ODDS'),
            await getExBySingleTeamNameCasino(sportList.id, roundId, 'FIGHTER B', match_id, 'ODDS')
        ]


        setTotalPlayers((prevState) => {

            const prev = {...prevState};


            prev['Fighter A'].amounts = results[0]?.data || ''
            prev['Fighter B'].amounts = results[1]?.data || ''


            return prev;

        })


    }

    useEffect(() => {

        if (data?.sub && sportList?.id) {
            updateAmounts()


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

    // Helper function to find data in data.sub for Cmeter1
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Cmeter1, find the item by nat field
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

                            {renderCards(cards)}
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
        <CasinoLayout ruleDescription={ruleDescription} raceClass="one-card-meter" hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>

            <div className="casino-detail one-card-meter">
                <div className="casino-table">
                    <div className="casino-table-full-box">
                        <div className="meter-btns">
                            {Object.entries(totalPlayers).map(([index, value], i) => (
                                <div className="meter-btn" key={i}>

                                    {i === 0 ? (<div className={`meter-btn-box ${value.status}`}
                                                     onClick={() => openPopup('back', index, 13)}>
                                            <button className={`btn btn-fighter-${i + 1} back`}>{index}<img
                                                src={`/img/icons/fight.png`} alt="Fighter A"/></button>
                                        </div>) :

                                        (<div className={`meter-btn-box ${value.status}`}
                                              onClick={() => openPopup('back', index, 13)}>
                                            <button className={`btn btn-fighter-${i + 1} back`}><img
                                                src={`/img/icons/fight.png`} alt="Fighter A"/>{index}</button>
                                        </div>)
                                    }

                                    <div className="text-center book-green"><b><span
                                        className="">
                                   {getExByColor(value.amounts)}
                                </span></b></div>
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

export default Cmeter1;
