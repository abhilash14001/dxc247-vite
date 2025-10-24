import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamNameCasino,
     resetBetFields, placeCasinoBet
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Dtl20 = () => {
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
                                                <li>20-20 DTL(Dragon Tiger Lion) is a 52 playing cards game, In DTL game 3 hands are dealt: for each 3 player. The player will bets which will win. </li>
                                                <li>The ranking of cards is, from lowest to highest: Ace, 2, 3, 4, 5, 6, 7,8, 9, 10, Jack, Queen and King when Ace is “1” and King is “13”.</li>
                                                <li>On same card with different suit, Winner will be declare based on below winning suit sequence.
                                                    <p>
                                                        </p><div className="cards-box">
                                                            <span className="card-character black-card ml-1">1}</span>
                                                            <span>1st</span>
                                                        </div>
                                                    <p></p>
                                                    <p>
                                                        </p><div className="cards-box">
                                                            <span className="card-character red-card ml-1">1{</span>
                                                            <span>2nd</span>
                                                        </div>
                                                    <p></p>
                                                    <p>
                                                        </p><div className="cards-box">
                                                            <span className="card-character black-card ml-1">1]</span>
                                                            <span>3rd</span>
                                                        </div>
                                                    <p></p>
                                                    <p>
                                                        </p><div className="cards-box">
                                                            <span className="card-character red-card ml-1">1[</span>
                                                            <span>4th</span>
                                                        </div>
                                                    <p></p>
                                                </li>
                                            </ul>
                                        </div></div>`
    const defaultValues = {odds: 0, status: 'suspended-box', amounts: ''}
    const defaultSectionsArray = [
        {key: "Winner", value: {...defaultValues, 'bet_type': 'WINNER'}},
        {key: "Black", value: {...defaultValues, 'bet_type': 'COLOR_'}},
        {key: "Red", value: {...defaultValues, 'bet_type': 'COLOR_'}},
        {key: "Odd", value: {...defaultValues, 'bet_type': 'ODD_EVEN_'}},
        {key: "Even", value: {...defaultValues, 'bet_type': 'ODD_EVEN_'}},
        {key: "A", value: {...defaultValues, 'img': "/img/card/1.jpg", 'bet_type': '_SINGLE'}},
        {key: "2", value: {...defaultValues, 'img': "/img/card/2.jpg", 'bet_type': '_SINGLE'}},
        {key: "3", value: {...defaultValues, 'img': "/img/card/3.jpg", 'bet_type': '_SINGLE'}},
        {key: "4", value: {...defaultValues, 'img': "/img/card/4.jpg", 'bet_type': '_SINGLE'}},
        {key: "5", value: {...defaultValues, 'img': "/img/card/5.jpg", 'bet_type': '_SINGLE'}},
        {key: "6", value: {...defaultValues, 'img': "/img/card/6.jpg", 'bet_type': '_SINGLE'}},
        {key: "7", value: {...defaultValues, 'img': "/img/card/7.jpg", 'bet_type': '_SINGLE'}},
        {key: "8", value: {...defaultValues, 'img': "/img/card/8.jpg", 'bet_type': '_SINGLE'}},
        {key: "9", value: {...defaultValues, 'img': "/img/card/9.jpg", 'bet_type': '_SINGLE'}},
        {key: "10", value: {...defaultValues, 'img': "/img/card/10.jpg", 'bet_type': '_SINGLE'}},
        {key: "J", value: {...defaultValues, 'img': "/img/card/11.jpg", 'bet_type': '_SINGLE'}},
        {key: "Q", value: {...defaultValues, 'img': "/img/card/12.jpg", 'bet_type': '_SINGLE'}},
        {key: "K", value: {...defaultValues, 'img': "/img/card/13.jpg", 'bet_type': '_SINGLE'}},
    ];


    const [totalPlayers, setTotalPlayers] = useState({
        Dragon: {...defaultSectionsArray, subname: 'D'},
        Tiger: {...defaultSectionsArray, subname: "T"},
        Lion: {...defaultSectionsArray, subname: "L"},
    });


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


    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({});

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);

    const updatePlayers = () => {
        setTotalPlayers((prevState) => {
            const updateP = {...prevState};

            Object.entries(updateP).forEach(([key, value]) => {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    let teamname;


                    // Check if bet_type exists in the subValue structure
                    if (subValue?.value?.bet_type === '_SINGLE') {
                        // For _SINGLE bet_type, use key + subKey as team name
                        teamname = key + " " + subValue.key
                    } else {
                        // Ensure value.subname exists, otherwise provide a default or handle accordingly
                        const subname = value.subname;
                        // For other bet types, use subKey + subname
                        if (subValue !== undefined && subValue.key !== undefined && subname !== undefined) {
                            teamname = subValue.key + " " + subname;
                        }

                    }

                    if (teamname) {
                        const founddata = data.sub.find(item => item.nat === teamname)

                        if (founddata) {

                            subValue.value.odds = founddata.b
                            subValue.value.status = founddata.gstatus === 'OPEN' ? "" : 'suspended-box'
                            
                            // Update playerStatuses
                            setPlayerStatuses(prev => ({
                                ...prev,
                                [teamname]: founddata.gstatus === 'OPEN' ? "" : 'suspended-box'
                            }));
                        }
                    }


                });
            });
            // For inspecting the state during development

            return updateP;
        });
    }

    useEffect(() => {

        if (data?.sub) {

            updatePlayers()

        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: cardArray.slice(0, 3),

            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;


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

    // Helper function to find data in data.sub for Dtl20
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Dtl20, find the item by nat field
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
                        <div className="flip-card-inner ">
                            <div className="flip-card-front">
                                <img src={imgSrc} alt={`${player} card ${index + 1}`}/>
                            </div>
                            <div className="flip-card-back">
                                <img src={imgSrc} alt={`${player} card ${index + 1}`}/>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const updateAmounts = async () => {

        const data = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '')
        setTotalPlayers((prevState) => {
            const updateP = {...prevState};

            Object.entries(updateP).forEach(([key, value]) => {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    let teamname;


                    // Check if bet_type exists in the subValue structure
                    if (subValue?.value?.bet_type === '_SINGLE') {
                        // For _SINGLE bet_type, use key + subKey as team name
                        teamname = key + " " + subValue.key
                    } else {
                        // Ensure value.subname exists, otherwise provide a default or handle accordingly
                        const subname = value.subname;
                        // For other bet types, use subKey + subname
                        if (subValue !== undefined && subValue.key !== undefined && subname !== undefined) {
                            teamname = subValue.key + " " + subname;
                        }

                    }

                    if (teamname && Array.isArray(data.data)) {
                        const founddata = data.data.find(item => item.team_name === teamname)



                            updateP[key][subKey] = {
                                ...updateP[key][subKey],
                                value: {
                                    ...updateP[key][subKey].value,
                                    amounts: founddata?.total_amount || ''
                                }
                            };


                    }


                });
            });

            return updateP;
        });


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
            <div className="casino-video-cards">
                <div className="d-flex flex-wrap justify-content-between">
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
        <CasinoLayout ruleDescription={ruleDescription} raceClass="dtl20"  hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>

                <div className="casino-table">
                    <div className="casino-table-box d-none d-md-flex">
                        <div className="casino-table-left-box">
                            <div className="casino-table-header">
                                <div className="casino-nation-detail"></div>
                                <div className="casino-odds-box back">Dragon</div>
                                <div className="casino-odds-box back">Tiger</div>
                                <div className="casino-odds-box back">Lion</div>
                            </div>
                            <div className="casino-table-body">
                                {Object.entries(totalPlayers['Dragon']).slice(0, Math.ceil(Object.entries(totalPlayers['Dragon']).length / 2)).map(([index, value], i) => {
                                    const values = Object.values(value)[0]
                                    const dragonSection = totalPlayers['Dragon'][i];
                                    const tigerSection = totalPlayers['Tiger'][i];
                                    const lionSection = totalPlayers['Lion'][i];

                                    const renderCell = (section) => {
                                        const value = section?.value || {};
                                        return value.hasOwnProperty('img') ? (
                                            <img src={value.img} alt=""/>
                                        ) : (
                                            <>
                                                <b>{values}</b>
                                                {values === 'Black' && (
                                                    <>
                                                        <span className="card-icon ms-1"><span className="card-black ">{"}"}</span></span>
                                                        <span className="card-icon ms-1"><span className="card-black ">]</span></span>
                                                    </>
                                                )}
                                                {values === 'Red' && (
                                                    <>
                                                        <span className="card-icon ms-1"><span className="card-red ">{"{"}</span></span>
                                                        <span className="card-icon ms-1"><span className="card-red ">[</span></span>
                                                    </>
                                                )}
                                            </>
                                        );
                                    };

                                    return typeof value === 'object' && (
                                        <div className="casino-table-row" key={i}>
                                            <div className="casino-nation-detail">
                                                <div className="casino-nation-name">
                                                {renderCell(dragonSection)}
                                                </div>
                                            </div>
                                            <div className={`casino-odds-box back ${dragonSection.value?.status}`}
                                                onClick={() => openPopup('back', dragonSection.value?.bet_type === '_SINGLE' ? 'Dragon ' + values : values + " " + totalPlayers['Dragon'].subname, dragonSection.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? dragonSection.value?.bet_type + "D" : (dragonSection.value?.bet_type === '_SINGLE' ? 'DRAGON_SINGLE' : dragonSection.value?.bet_type))}>
                                                <span className="casino-odds">{dragonSection.value?.odds}</span>
                                                <div className="casino-nation-book text-center">
                                                    {getExByColor(dragonSection.value?.amounts)}
                                                </div>
                                            </div>
                                            <div className={`casino-odds-box back ${tigerSection.value?.status}`}
                                                onClick={() => openPopup('back', tigerSection.value?.bet_type === '_SINGLE' ? 'Tiger ' + values : values + " " + totalPlayers['Tiger'].subname, tigerSection.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? tigerSection.value?.bet_type + "T" : (tigerSection.value?.bet_type === '_SINGLE' ? 'TIGER_SINGLE' : tigerSection.value?.bet_type))}>
                                                <span className="casino-odds">{tigerSection.value?.odds}</span>
                                                <div className="casino-nation-book text-center">
                                                    {getExByColor(tigerSection.value?.amounts)}
                                                </div>
                                            </div>
                                            <div className={`casino-odds-box back ${lionSection.value?.status}`}
                                                onClick={() => openPopup('back', lionSection.value?.bet_type === '_SINGLE' ? 'Lion ' + values : values + " " + totalPlayers['Lion'].subname, lionSection.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? lionSection.value?.bet_type + "L" : (lionSection.value?.bet_type === '_SINGLE' ? 'LION_SINGLE' : lionSection.value?.bet_type))}>
                                                <span className="casino-odds">{lionSection.value?.odds}</span>
                                                <div className="casino-nation-book text-center">
                                                    {getExByColor(lionSection.value?.amounts)}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="casino-table-right-box">
                            <div className="casino-table-header">
                                <div className="casino-nation-detail"></div>
                                <div className="casino-odds-box back">Dragon</div>
                                <div className="casino-odds-box back">Tiger</div>
                                <div className="casino-odds-box back">Lion</div>
                            </div>
                            <div className="casino-table-body">
                                {Object.entries(totalPlayers['Dragon']).slice(Math.ceil(Object.entries(totalPlayers['Dragon']).length / 2)).map(([index, value], i) => {
                                    const actualIndex = i + Math.ceil(Object.entries(totalPlayers['Dragon']).length / 2);
                                    const values = Object.values(value)[0]
                                    const dragonSection = totalPlayers['Dragon'][actualIndex];
                                    const tigerSection = totalPlayers['Tiger'][actualIndex];
                                    const lionSection = totalPlayers['Lion'][actualIndex];

                                    const renderCell = (section) => {
                                        const value = section?.value || {};
                                        return value.hasOwnProperty('img') ? (
                                            <img src={value.img} alt=""/>
                                        ) : (
                                            <>
                                                <b>{values}</b>
                                                {values === 'Black' && (
                                                    <>
                                                        <span className="card-icon ms-1"><span className="card-black ">{"}"}</span></span>
                                                        <span className="card-icon ms-1"><span className="card-black ">]</span></span>
                                                    </>
                                                )}
                                                {values === 'Red' && (
                                                    <>
                                                        <span className="card-icon ms-1"><span className="card-red ">{"{"}</span></span>
                                                        <span className="card-icon ms-1"><span className="card-red ">[</span></span>
                                                    </>
                                                )}
                                            </>
                                        );
                                    };

                                    return typeof value === 'object' && (
                                        <div className="casino-table-row" key={actualIndex}>
                                            <div className="casino-nation-detail">
                                                <div className="casino-nation-name">
                                                    {renderCell(dragonSection)}
                                                </div>
                                            </div>
                                            <div className={`casino-odds-box back ${dragonSection?.value?.status}`}
                                                 onClick={() => openPopup('back', dragonSection?.value?.bet_type === '_SINGLE' ? 'Dragon ' + values : values + " " + totalPlayers['Dragon'].subname, dragonSection?.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? dragonSection?.value?.bet_type + "D" : (dragonSection?.value?.bet_type === '_SINGLE' ? 'DRAGON_SINGLE' : dragonSection?.value?.bet_type))}>
                                                <span className="casino-odds">{dragonSection?.value?.odds}</span>
                                                <div className="casino-nation-book text-center">
                                                    {getExByColor(dragonSection?.value?.amounts)}
                                                </div>
                                            </div>
                                            <div className={`casino-odds-box back ${tigerSection?.value?.status}`}
                                                 onClick={() => openPopup('back', tigerSection?.value?.bet_type === '_SINGLE' ? 'Tiger ' + values : values + " " + totalPlayers['Tiger'].subname, tigerSection?.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? tigerSection?.value?.bet_type + "T" : (tigerSection?.value?.bet_type === '_SINGLE' ? 'TIGER_SINGLE' : tigerSection?.value?.bet_type))}>
                                                <span className="casino-odds">{tigerSection?.value?.odds}</span>
                                                <div className="casino-nation-book text-center">
                                                    {getExByColor(tigerSection?.value?.amounts)}
                                                </div>
                                            </div>
                                            <div className={`casino-odds-box back ${lionSection?.value?.status}`}
                                                 onClick={() => openPopup('back', lionSection?.value?.bet_type === '_SINGLE' ? 'Lion ' + values : values + " " + totalPlayers['Lion'].subname, lionSection?.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? lionSection?.value?.bet_type + "L" : (lionSection?.value?.bet_type === '_SINGLE' ? 'LION_SINGLE' : lionSection?.value?.bet_type))}>
                                                <span className="casino-odds">{lionSection?.value?.odds}</span>
                                                <div className="casino-nation-book text-center">
                                                    {getExByColor(lionSection?.value?.amounts)}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <ul className="d-xl-none nav nav-pills" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button type="button" id="uncontrolled-tab-example-tab-0" role="tab" data-rr-ui-event-key="0" aria-controls="uncontrolled-tab-example-tabpane-0" aria-selected="true" className="nav-link active">Dragon</button>
                        </li>
                        {/* <li className="nav-item" role="presentation">
                            <button type="button" id="uncontrolled-tab-example-tab-1" role="tab" data-rr-ui-event-key="1" aria-controls="uncontrolled-tab-example-tabpane-1" aria-selected="false" tabIndex="-1" className="nav-link">Tiger</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button type="button" id="uncontrolled-tab-example-tab-2" role="tab" data-rr-ui-event-key="2" aria-controls="uncontrolled-tab-example-tabpane-2" aria-selected="false" tabIndex="-1" className="nav-link">Lion</button>
                        </li> */}
                    </ul>
                    <div className="tab-content">
                        {['Dragon', 'Tiger', 'Lion'].map((player, playerIndex) => (
                            <div key={playerIndex} role="tabpanel" id={`uncontrolled-tab-example-tabpane-${playerIndex}`} aria-labelledby={`uncontrolled-tab-example-tab-${playerIndex}`} className={`fade d-xl-none tab-pane ${playerIndex === 0 ? 'active show' : ''}`}>
                                <div className="casino-table-box">
                                    <div className="casino-table-left-box">
                                        <div className="casino-table-body">
                                            {Object.entries(totalPlayers[player]).slice(0, Math.ceil(Object.entries(totalPlayers[player]).length / 2)).map(([index, value], i) => {
                                                const values = Object.values(value)[0]
                                                const playerSection = totalPlayers[player][i];

                                                const renderCell = (section) => {
                                                    const value = section?.value || {};
                                                    return value.hasOwnProperty('img') ? (
                                                        <img src={value.img} alt=""/>
                                                    ) : (
                                                        <>
                                                            <b>{values}</b>
                                                            {values === 'Black' && (
                                                                <>
                                                                    <span className="card-icon ms-1"><span className="card-black ">{"}"}</span></span>
                                                                    <span className="card-icon ms-1"><span className="card-black ">]</span></span>
                                                                </>
                                                            )}
                                                            {values === 'Red' && (
                                                                <>
                                                                    <span className="card-icon ms-1"><span className="card-red ">{"{"}</span></span>
                                                                    <span className="card-icon ms-1"><span className="card-red ">[</span></span>
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                };

                                                return typeof value === 'object' && (
                                                    <div className="casino-table-row" key={i}>
                                                        <div className="casino-nation-detail">
                                                            <div className="casino-nation-name">
                                                                {renderCell(playerSection)}
                                                            </div>
                                                        </div>
                                                        <div className={`casino-odds-box back ${playerSection.value?.status}`}
                                                             onClick={() => openPopup('back', playerSection.value?.bet_type === '_SINGLE' ? player + ' ' + values : values + " " + totalPlayers[player].subname, playerSection.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? playerSection.value?.bet_type + player[0].toUpperCase() : (playerSection.value?.bet_type === '_SINGLE' ? player.toUpperCase() + '_SINGLE' : playerSection.value?.bet_type))}>
                                                            <span className="casino-odds">{playerSection.value?.odds}</span>
                                                            <div className="casino-nation-book text-center">
                                                                {getExByColor(playerSection.value?.amounts)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="casino-table-right-box">
                                        <div className="casino-table-body">
                                            {Object.entries(totalPlayers[player]).slice(Math.ceil(Object.entries(totalPlayers[player]).length / 2)).map(([index, value], i) => {
                                                const actualIndex = i + Math.ceil(Object.entries(totalPlayers[player]).length / 2);
                                                const values = Object.values(value)[0]
                                                const playerSection = totalPlayers[player][actualIndex];

                                                const renderCell = (section) => {
                                                    const value = section?.value || {};
                                                    return value.hasOwnProperty('img') ? (
                                                        <img src={value.img} alt=""/>
                                                    ) : (
                                                        <>
                                                            <b>{values}</b>
                                                            {values === 'Black' && (
                                                                <>
                                                                    <span className="card-icon ms-1"><span className="card-black ">{"}"}</span></span>
                                                                    <span className="card-icon ms-1"><span className="card-black ">]</span></span>
                                                                </>
                                                            )}
                                                            {values === 'Red' && (
                                                                <>
                                                                    <span className="card-icon ms-1"><span className="card-red ">{"{"}</span></span>
                                                                    <span className="card-icon ms-1"><span className="card-red ">[</span></span>
                                                                </>
                                                            )}
                                                        </>
                                                    );
                                                };

                                                return typeof value === 'object' && (
                                                    <div className="casino-table-row" key={actualIndex}>
                                                        <div className="casino-nation-detail">
                                                            <div className="casino-nation-name">
                                                                {renderCell(playerSection)}
                                                            </div>
                                                        </div>
                                                        <div className={`casino-odds-box back ${playerSection?.value?.status}`}
                                                             onClick={() => openPopup('back', playerSection?.value?.bet_type === '_SINGLE' ? player + ' ' + values : values + " " + totalPlayers[player].subname, playerSection?.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? playerSection?.value?.bet_type + player[0].toUpperCase() : (playerSection?.value?.bet_type === '_SINGLE' ? player.toUpperCase() + '_SINGLE' : playerSection?.value?.bet_type))}>
                                                            <span className="casino-odds">{playerSection?.value?.odds}</span>
                                                            <div className="casino-nation-book text-center">
                                                                {getExByColor(playerSection?.value?.amounts)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
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
           
            

        </CasinoLayout>
    );

};



export default Dtl20;
