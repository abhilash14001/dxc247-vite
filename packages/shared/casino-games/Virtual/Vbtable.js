import CasinoLayout from "../../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamNameCasino,

    getExByTeamNameForCasino, resetBetFields,
    exposureCheck
} from "../../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../../contexts/SportsContext";


import Notify from "../../utils/Notify";

const Vbtable = () => {
    const [roundId, setRoundId] = useState('')

    const ruleImage = '/img/rules/btable.jpg'

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

    const [cards, setCards] = useState( {
        "A": ['ASS'],
        "B": ['AHH', 'ACC', 'ADD'],
        "C": ['KSS', 'QSS', 'JSS'],
        "D": ['KDD', 'KCC'],
        "E": ['KHH', 'QCC', 'QDD', 'QHH'],
        "F": ['JHH', 'JCC', 'JDD'],
        "Cards" : ""


    });

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
        }

        if (data.card) {

            setCards(prevState => ({
                ...prevState,
                Cards : data.card
            }));


            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = exposureCheck();
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
    }, [exposure, sportLength, roundId]);

    const openPopup = (isBakOrLay, teamnam, oddvalue, bet) => {
        setBetType(bet)


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
        <>
            <div className="casino-video-cards">
                {Object.entries(cards).slice(0,6) .map(([index, value], i) => {

                    return (
                    <div className="" key={i}>
                        <h5 className="text-center">{index}</h5>
                        <div className="flip-card-container">
                            {cards.Cards.length > 0 && cards[index].includes(cards.Cards)  && (
                            <div className="flip-card">
                                <div className="flip-card-inner ">
                                    <div className="flip-card-front"><img src={import.meta.env.VITE_CARD_PATH + cards.Cards + ".png"}/>
                                    </div>
                                    <div className="flip-card-back"><img src={import.meta.env.VITE_CARD_PATH + cards.Cards + ".png"}/>
                                    </div>
                                </div>
                            </div>
                            )}


                        </div>
                    </div>
                )})}
            </div>
            <div className="odds-title">
                <div><span className="card-character black-card ml-1">{"A}"}</span></div>
                <div><span className="card-character red-card d-block ml-1">{"A{"}</span><span
                    className="card-character black-card d-block ml-1">A]</span><span
                    className="card-character red-card d-block ml-1">A[</span></div>
                    <div><span className="card-character black-card d-block ml-1">{"K}"}</span><span
                    className="card-character black-card d-block ml-1">{"Q}"}</span><span
                    className="card-character black-card d-block ml-1">{"J}"}</span></div>
                <div><span className="card-character red-card d-block ml-1">K[</span><span
                    className="card-character black-card d-block ml-1">K]</span></div>
                <div><span className="card-character red-card d-block ml-1">{"K{"}</span><span
                    className="card-character black-card d-block ml-1">Q]</span><span
                    className="card-character red-card d-block ml-1">Q[</span><span
                    className="card-character red-card d-block ml-1">{"Q{"}</span></div>
                    <div><span className="card-character red-card d-block ml-1">{"J{"}</span><span
                    className="card-character black-card d-block ml-1">J]</span><span
                    className="card-character red-card d-block ml-1">J[</span></div>
                    </div>
                    </>
                    );

                    const placeBet = () => {

                    setHideLoading(false)
                    const teams = teamname.current === 'Barati' ? "Barati J-A" : teamname.current;
                    if (totalPlayers[teams].status !== '') {
                    Notify(`Bet Not Confirmed. Reason: Game Suspended`, null, null, 'danger');
                    setPopupDisplay(false)
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
                    updateAmounts(true)

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

                        <CasinoLayout virtualVideoCards={renderCards} raceClass="bollywood vcasino" ruleImage={ruleImage} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname}
                                      handleStakeChange={casinoBetDataNew} odds={odds}
                                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                                      sportList={sportList}
                                      setSportList={setSportList} setData={setData} setLastResult={setLastResult}>


                            <div className="casino-container bollywood-table">
                                <div className="card-content aaa-content m-t-10">
                                    <div className="row">
                                        <div className="col-12 text-right">
                                            <div className="info-block">
                                                <a href="" data-toggle="collapse" data-target="#min-max-info1"
                                                   className="info-icon">
                                                    <i className="fas fa-info-circle m-l-10"></i>
                                                </a>
                                                <div id="min-max-info1" className="collapse min-max-info">
                                                    <span className="m-r-5"><b>Min:</b>100</span>
                                                    <span className="m-r-5"><b>Max:</b>300000</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {Object.entries(totalPlayers).slice(0, 6).map(([index, value], i) => (
                                            <div className="col-4 text-center" key={i}>
                                                <div>
                    <span className="d-block">
                        <b>
                            <span className="text-danger">{value.subname}.</span> {index}
                        </b>
                    </span>
                                                </div>
                                                <div className={`aaa-button clearfix ${value.status}`}>
                                                    <button
                                                        className="back"
                                                        onClick={() => openPopup('back', index, value.odds.back, 'ODDS')}
                                                    >
                                                        <span className="odd">{value.odds.back}</span>
                                                    </button>
                                                    <button
                                                        className="lay"
                                                        onClick={() => openPopup('lay', index, value.odds.lay, 'ODDS')}
                                                    >
                                                        <span className="odd">{value.odds.lay}</span>
                                                    </button>
                                                </div>
                                                {getExByColor(value.amounts)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="row m-t-10">
                                    <div className="col-4 p-r-5">
                                        <div className="aaa-content">
                                            <div className="text-right">
                                                <div className="info-block">
                                                    <a href="" data-toggle="collapse" data-target="#min-max-info6"
                                                       className="info-icon">
                                                        <i className="fas fa-info-circle m-l-10"></i>
                                                    </a>

                                                </div>
                                            </div>
                                            <div className="text-center row">
                                                <div className="col-12">
                                                    <div><span className="d-block m-t-5"><b>Odd</b></span></div>
                                                    <div
                                                        className={`aaa-button m-t-5 m-b-5 clearfix ${totalPlayers['Odd'].status}`}>
                                                        <button className="back "
                                                                onClick={() => openPopup('back', 'Odd', totalPlayers['Odd'].odds.back, 'ODD')}>
                                                            <span className="odd">{totalPlayers['Odd'].odds.back}</span>
                                                        </button>
                                                        <button className="lay"
                                                                onClick={() => openPopup('lay', 'Odd', totalPlayers['Odd'].odds.lay, 'ODD')}>
                                                            <span className="odd">{totalPlayers['Odd'].odds.lay}</span>
                                                        </button>
                                                    </div>
                                                    {getExByColor(totalPlayers['Odd'].amounts)}


                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-8 p-l-5">
                                        <PlayerTable players={Object.entries(totalPlayers).slice(9, 11)}
                                                     openPopup={openPopup}/>
                                    </div>

                                </div>


                                <div className="row row5 m-t-10">
                                    <div className="col-6">
                                        <PlayerTable players={Object.entries(totalPlayers).slice(7, 9)}
                                                     openPopup={openPopup}/>
                                    </div>
                                    <div className="col-6">
                                        <div className="aaa-content m-b-10">

                                            <div className="row">
                                                <div className="col-8 text-right">

                                                    <b>Cards {totalPlayers['Card A'].odds.back}</b>
                                                </div>


                                            </div>

                                            <div className="text-right">
                                                <div className="text-center m-t-5">
                                                    {Object.entries(totalPlayers).slice(11, 15).map(([index1, value1], i2) => (
                                                        <div className="m-r-5 card-image" key={i2}>
                                                            <div className={value1.status}
                                                                 onClick={() => openPopup('back', index1, value1.odds.back, 'CARD')}>
                                                                <img src={value1.imgname}/></div>
                                                            <div className="ubook text-center m-t-5">
                                                                {getExByColor(value1.amounts)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
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
                    )
                        ;

    }
;

const PlayerTable = ({players, openPopup}) => (

    <div className="light-bg container-fluid mt-2">
        <div className="row row5">
            {players.map(([index, value], i) => (
                <div className="col-6" key={i}>
                    <div className="text-right">
                        <div className="info-block">
                            <a href="#" data-toggle="collapse" data-target="#min-max-info1" aria-expanded="false"
                               className="info-icon collapsed">
                                {/*<i className="fas fa-info-circle m-l-10"></i>*/}
                            </a>
                            <div id="min-max-info1" className="min-max-info collapse">
                                {/*<span><b>Min:</b> 100</span> /!* Static min value *!/*/}
                                {/*<span><b>Max:</b> 1000</span> /!* Static max value *!/*/}
                            </div>
                        </div>
                    </div>
                    <p className="d-block mb-0 text-center"><b>{value.odds.back}</b></p> {/* Static value */}
                    {['Red', 'Black'].includes(index) === false ? (
                            <button className={`btn-theme mt-1 ${value.status}`}
                                    onClick={() => openPopup('back', value?.canonical_name || index, value.odds.back, "DULHADULHANBARATI")}>{index}</button>

                        ) :
                        <button className={`btn-theme mt-1 ${value.status}`}
                                onClick={() => openPopup('back', value?.canonical_name || index, value.odds.back, "COLOR")}>
                            <div className="color-card"></div>
                            {index === 'Red' ? (
                                    <>
                            <span className="card-icon">
                        <span className="card-red">{"{"}</span>

                        </span>
                                        <span className="card-icon">
                        <span className="card-red">[</span>
                                  </span>
                                    </>
                                )
                                :
                                <>
                                 <span className="card-icon">
                        <span className="card-black">{"}"}</span>

                        </span>
                                    <span className="card-icon">
                        <span className="card-black">]</span>
                                </span>
                                </>
                            }


                        </button>

                    }

                    {/* Disabled for static */}
                    <p className="mt-1 mb-0 text-center">
                        {getExByColor(value.amounts)}
                    </p>
                </div>
            ))}

        </div>
    </div>

);

export default Vbtable;
