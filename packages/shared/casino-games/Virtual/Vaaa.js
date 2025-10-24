import CasinoLayout from "../../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../../components/casino/CasinoLastResult";

import axiosFetch, {
    cardMap,
    getExByColor, getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, resetBetFields,
    exposureCheck
} from "../../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../../contexts/SportsContext";


import Notify from "../../utils/Notify";

const Vaaa = () => {
        const [roundId, setRoundId] = useState('')

        const ruleImage = '/img/rules/aaa-rules.jpg'
        const values = {status: "suspended-box", amounts: ""}
        const defaultValues = {odds: {back: 0, lay: 0}, ...values}
        const [totalPlayers, setTotalPlayers] = useState({

            "Amar": {canonical_name: "A. Amar", ...defaultValues},
            "Akbar": {canonical_name: "A. Akbar", ...defaultValues},
            "Anthony": {canonical_name: "A. Anthony", ...defaultValues},
            "Even": {...values, odds: 0, canonical_name: "Even", type: "ODD_EVEN"},
            "Odd": {...values, odds: 0, canonical_name: "Odd", type: "ODD_EVEN"},
            "Red": {...values, odds: 0, canonical_name: "Red", type: "RED_BLACK"},
            "Black": {...values, odds: 0, canonical_name: "Black", type: "RED_BLACK"},

            "UNDER 7": {...values, odds: 0, canonical_name: "Under 7", type: "UNDER_OVER"},


            "OVER 7": {...values, odds: 0, canonical_name: "Over 7", type: "UNDER_OVER"},
            "Cards": (Array.from({length: 13}, (_, index) => {

                index += 1;
                return {
                    imagePath: '/img/card/' + index + ".jpg", // Image path
                    ...values,
                    img_path: "Card " + cardMap(index, false),
                    odds: 0 // Spread default values into each card object
                };
            })),

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
            setPopupDisplay,

        } = useContext(SportsContext)
        const [hideLoading, setHideLoading] = useState(true)


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

                setTotalPlayers((prevState) => {
                    Object.entries(prevState).map(([index, value], i) => {

                        const foundData = data.sub.find(item => item.nat === index || item.nat === value.canonical_name)


                        if (foundData) {
                            prevState[index] = {
                                ...prevState[index],

                                status: foundData.gstatus === 'OPEN' ? '' : 'suspended-box',
                            }
                            if (['Amar', 'Akbar', 'Anthony'].includes(index)) {
                                prevState[index] = {
                                    ...prevState[index],
                                    odds: {back: foundData.b, lay: foundData.l},

                                }
                            } else {
                                prevState[index] = {
                                    ...prevState[index],
                                    odds: foundData.b,

                                }
                            }
                        }

                        const cardFoundData = data.sub.find(item => item.nat === 'Card A')

                        if (cardFoundData) {
                            prevState['Cards'] = Object.entries(prevState['Cards']).map(([index, value], i) => {

                                const v = {
                                    ...value,
                                    odds: cardFoundData.b,
                                    status: cardFoundData.gstatus === 'OPEN' ? '' : 'suspended-box',
                                };


                                return v;
                            })

                        }
                    })
                    return prevState

                })


            }


            if (data.card) {
                const cardArray = data.card.split(",");
                let cardInsert = Array(3).fill(null);


                if (data?.rdesc) {
                    const index = parseInt(data.rdesc) - 1;
                    cardInsert[index] = cardArray[0];
                }


                setCards(cardInsert);
                remark.current = data.remark || 'Welcome';
            }

        }, [data]);

        const exposure = exposureCheck();
        const sportLength = Object.keys(data).length;


        const updateAmounts = async () => {
            const results = await Promise.all([
                getExByTeamNameForCasino(sportList.id, roundId, 'Amar', match_id, 'ODDS'),
                getExByTeamNameForCasino(sportList.id, roundId, 'Akbar', match_id, 'ODDS'),
                getExByTeamNameForCasino(sportList.id, roundId, 'Anthony', match_id, 'ODDS'),
                getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '')
            ]);

            setTotalPlayers((prevState) => {
                const updatedState = {...prevState}; // Create a new state object

                Object.entries(prevState).forEach(([index, value], i) => {
                    if (['Amar', 'Akbar', 'Anthony'].includes(index)) {
                        // For Amar, Akbar, and Anthony
                        updatedState[index] = {
                            ...value,
                            amounts: results[i]?.data || ''
                        };
                    } else if (index === 'Cards') {
                        // For Cards
                        Object.entries(value).forEach(([cardIndex, cardValue]) => {
                            const cardFound = results[3]?.data.find(item => item.team_name === cardValue.img_path);
                            updatedState[index][cardIndex] = {
                                ...cardValue,
                                amounts: cardFound?.total_amount || ''
                            };
                        });
                    } else {
                        // For other teams
                        const dataFound = results[3]?.data.find(item => item.team_name === index);
                        updatedState[index] = {
                            ...value,
                            amounts: dataFound?.total_amount || ''
                        };
                    }
                });

                return updatedState; // Return the new state
            });
        };

        useEffect(() => {

            if (data?.sub && sportList?.id) {
                updateAmounts()
            }
        }, [exposure, sportLength, roundId]);


        const openPopup = (isBakOrLay, teamnam, oddvalue, betType) => {

            setBetType(betType)

            if (parseFloat(oddvalue) > 0) {
                roundIdSaved.current = roundId
                setbackOrLay(isBakOrLay)
                setPopupDisplay(true);
                teamname.current = teamnam
                setOdds(oddvalue)
            } else {
                Notify("Odds Value Change Bet Not Confirm", null, null, 'danger')

            }


        }
        const casinoBetDataNew = (event, new_odds) => {
            stakeValue.current.value = event.target.value
            if (backOrLay === 'back') {


                loss.current = stakeValue.current.value;


                profit.current = profitData.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)

            } else {

                profit.current = profitData.current = stakeValue.current.value;


                loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)
            }


        }

        const renderCards = () => (
            <div className="casino-video-cards">
                {Object.entries({'a': 'AMAR', 'b': 'AKBAR', 'c': 'ANTHONY'}).map(([index, value], i) => (
                    <div className={`vcasinocards-player${index}`} key={i}>
                        <h5 className="text-center">{value}</h5>

                        <div className="flip-card-container">
                            <div className="flip-card">
                                <div className="flip-card-inner ">
                                    {cards[i] && (
                                        <>
                                            <div className="flip-card-front"><img src={import.meta.env.VITE_CARD_PATH + cards[i] + ".png"} />
                                            </div>
                                            <div className="flip-card-back"><img src={import.meta.env.VITE_CARD_PATH + cards[i] + ".png"} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        );

        const placeBet = () => {

            setHideLoading(false)

            if (totalPlayers['Amar'].status !== '') {
                Notify(`Bet Not Confirmed. Reason: Game Suspended`, null, null, 'danger');
                setPopupDisplay(false);
                setHideLoading(true);
                resetBetFields(profitData, stakeValue)


                return;
            }

            if (roundIdSaved.current !== roundId) {
                Notify("Bet Not Confirm Reason Game Change", null, null, 'danger')
                setPopupDisplay(false)
                setHideLoading(true);
                resetBetFields(profitData, stakeValue)

                return;
            }

            setSubmitButtonDisable(true)


            const postdata = {

                "sportId": sportList.id,
                "matchId": roundId,
                "isback": backOrLay === 'back' ? 1 : 0,
                "placeName": teamname.current,
                "placeName2": null,
                "odds": odds,
                "oddsk": 0,
                "profit": parseFloat(profit.current).toFixed(2),
                "loss": parseFloat(loss.current).toFixed(2),
                "betType": betType,
                "bet_side": backOrLay.toUpperCase(),
                "betAmount": parseFloat(stakeValue.current.value),
                "type": match_id.toUpperCase(),
                "matchType": match_id.toLowerCase(),

            }

            axiosFetch('casino/store', 'post', null, postdata)
                .then((res) => {
                    if (res.data.status === true) {
                        updateAmounts()

                        resetBetFields(profitData, stakeValue)
                        Notify("Bet Placed Successfully", null, null, 'success')
                    } else {

                        resetBetFields(profitData, stakeValue)
                        Notify(res.data.msg, null, null, 'danger')
                    }
                    setHideLoading(true)
                    setSubmitButtonDisable(false)
                    setPopupDisplay(false)
                })


        }

        return (

            <CasinoLayout virtualVideoCards={renderCards}  ruleImage={ruleImage} raceClass="vcasino vaaa" d hideLoading={hideLoading}
                          isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                          stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                          submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                          sportList={sportList}
                          setSportList={setSportList} setData={setData} setLastResult={setLastResult}>


                <div className="casino-container aaa">
                    <div className="table-responsive aaa-odds">
                        <div className="row">
                            {Object.entries(totalPlayers).slice(0, 3).map(([index, value], i) => (
                                <div key={i} className="col-4 text-center">
                                    <div>
                                        <span className="d-block">
                                            <b>
                                                <span
                                                    className="text-danger">{value.canonical_name.split(".")[0]}.</span> {/* A, B, C */}
                                                {value.canonical_name.split(".")[1]}
                                            </b>
                                        </span>
                                    </div>
                                    <div className={`aaa-button clearfix ${value.status}`}>
                                        <button className="back"
                                                onClick={() => openPopup('back', index, value.odds.back, 'ODDS')}>
                                            <span className="odd">{value.odds.back}</span>
                                        </button>
                                        <button className="lay"
                                                onClick={() => openPopup('lay', index, value.odds.lay, 'ODDS')}>
                                            <span className="odd">{value.odds.lay}</span>
                                        </button>
                                    </div>
                                    <div className="text-danger">{getExByColor(value.amounts)}</div>
                                </div>
                            ))}
                        </div>
                        <div className="container-fluid container-fluid-5 mt-2">
                            <div className="row row5">
                                <EvenSection data={Object.entries(totalPlayers).slice(3, 5)} openPopup={openPopup}/>
                                <EvenSection data={Object.entries(totalPlayers).slice(5, 7)} openPopup={openPopup}/>
                                <EvenSection data={Object.entries(totalPlayers).slice(7, 9)} openPopup={openPopup}/>


                            </div>
                        </div>

                        <div className="casino-table-full-box aaacards mt-3">
                            <h4 className="w-100 text-center mb-2"><b>{totalPlayers['Cards'][0].odds}</b></h4>

                            {totalPlayers['Cards'].map((card, i) => (
                                <div className="card-odd-box" key={i}
                                     onClick={() => openPopup('back', `Card ${cardMap(i)}`, card.odds, 'CARD')}>
                                    <div className={card.status}>
                                        <img src={card.imagePath} alt={`Card ${i + 1}`}/>
                                    </div>
                                    <div className="casino-">
                                        <span className="teamEx" style={{color: 'red'}}>{card.amounts}</span>
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

    }
;

const EvenSection = ({data, openPopup}) => {


    return (<div className="col-4">
        <div className="light-bg pl-1 pr-1">
            <div className="text-right">

            </div>
            {data.map(([index, value], key) => (
                <div className="mt-1" key={key}>
                    <p className="d-block mb-0 text-center"><b>{value.odds}</b></p>
                    <button className={`btn-theme mt-1 text-uppercase ${value.status}`}
                            onClick={() => openPopup('back', index, value.odds, value.type)}
                    >
                        {index === 'Red' || index === 'Black' ? (
                            index === 'Red' ? (
                                <>
                                    <span className="card-icon"><span className="card-red">{"{"}</span></span>
                                    <span className="card-icon"><span className="card-red">[</span></span>
                                </>
                            ) : (
                                <>
                                    <span className="card-icon"><span className="card-black">{"}"}</span></span>
                                    <span className="card-icon"><span className="card-black">]</span></span>
                                </>
                            )
                        ) : (
                            <span>{index}</span>
                        )}

                    </button>
                    <p className="mt-1 mb-0 text-center">
                        {getExByColor(value.amounts)}
                    </p>
                </div>
            ))}

        </div>
    </div>)

}

export default Vaaa;
