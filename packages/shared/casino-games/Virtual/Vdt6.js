import CasinoLayout from "../../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, resetBetFields,
    exposureCheck
} from "../../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../../contexts/SportsContext";


import Notify from "../../utils/Notify";
import {CasinoContext} from "../../contexts/CasinoContext";

const Vdt6 = () => {
    const {fetchDataDragonTigerDt6} = useContext(CasinoContext)

    const [roundId, setRoundId] = useState('')
    const [TOTALPLAYERS, setTotalPlayers] = useState({
        Dragon: {
            odds: {back: 0, lay: 0},
            status: 'suspended-box',
            amounts: '',
            Even: {odds: 0, status: 'suspended-box', amounts: ''},
            Odd: {odds: 0, status: 'suspended-box', amounts: ''},
            Black: {odds: 0, status: 'suspended-box', amounts: ''},
            Red: {odds: 0, status: 'suspended-box', amounts: ''},
            Spade: {odds: 0, status: 'suspended-box', amounts: ''},
            Heart: {odds: 0, status: 'suspended-box', amounts: ''},
            Club: {odds: 0, status: 'suspended-box', amounts: ''},
            Diamond: {odds: 0, status: 'suspended-box', amounts: ''}
        },
        Tiger: {
            odds: {back: 0, lay: 0},
            status: 'suspended-box',
            amounts: '',
            Even: {odds: 0, status: 'suspended-box', amounts: ''},
            Odd: {odds: 0, status: 'suspended-box', amounts: ''},
            Black: {odds: 0, status: 'suspended-box', amounts: ''},
            Red: {odds: 0, status: 'suspended-box', amounts: ''},
            Spade: {odds: 0, status: 'suspended-box', amounts: ''},
            Heart: {odds: 0, status: 'suspended-box', amounts: ''},
            Club: {odds: 0, status: 'suspended-box', amounts: ''},
            Diamond: {odds: 0, status: 'suspended-box', amounts: ''}
        },
        Pair: {
            odds: {back: 0, lay: 0},
            status: 'suspended-box',
            amounts: ''
        }
    });


    const updateOdds = (data) => {

        data = data.sub;


        setTotalPlayers((prevState) => {
            let newState = prevState;

            data.forEach(updates => {
                let {nat, b, gstatus, l} = updates;
                if (nat.includes(" ")) {
                    let [option, subOption] = nat.split(" ");
                    newState[option][subOption] = {
                        ...newState[option][subOption],
                        odds: b,
                        status: gstatus === 'OPEN' ? '' : 'suspended-box'
                    }
                } else {
                    newState[nat] = {
                        ...newState[nat],
                        odds: {
                            ...newState[nat].odds, // Preserve the existing odds
                            back: b,
                            lay: l
                        },
                        status: gstatus === 'OPEN' ? '' : 'suspended-box'
                    }
                }
            })

            return newState;
        })

    };
    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState(['1', '1']);

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
    const ruleImage = '/img/rules/dt20.jpg'
    const ruleDescription = '';
    const exposure = exposureCheck()
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
            updateOdds(data)

        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards([cardArray[0],cardArray[1]]);

            remark.current = data.remark || 'Welcome';
        }
    }, [data]);


    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (sportLength > 0) {

            fetchDataDragonTigerDt6(data, sportList,match_id, roundId,TOTALPLAYERS, setTotalPlayers,betType,'all')

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
            {Object.entries({'a' : 'DRAGON', 'b': 'TIGER'}).map(([index, value]) => (
                <div className={`vcasinocards-player${index}`}>
                    <h5 className="text-center">{value}</h5>
                    <div className="flip-card-container">
                        <div className="flip-card">
                            <div className="flip-card-inner ">
                                <div className="flip-card-front"><img src={import.meta.env.VITE_CARD_PATH +  cards[0] +".png"}/>
                                </div>
                                <div className="flip-card-back"><img src={import.meta.env.VITE_CARD_PATH +  cards[0]+".png"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const placeBet = () => {

        setHideLoading(false)
        let explodeTeamname;
        let isSuspended = false;

        if (teamname.current.includes(" ")) {
            explodeTeamname = teamname.current.split(" ");
            isSuspended = TOTALPLAYERS[explodeTeamname[0]][explodeTeamname[1]].status === 'suspended-box';
        }
        else {
            explodeTeamname = teamname.current;
            isSuspended = TOTALPLAYERS[explodeTeamname].status === 'suspended-box';

        }


        if (isSuspended === true) {
            Notify(`Bet Not Confirmed. Reason: Game Suspended`, null, null, 'danger');
            setPopupDisplay(false);
            profitData.current = 0
            stakeValue.current.value = 0
            setHideLoading(true);

            return;
        }

        if (roundIdSaved.current !== roundId) {
            Notify("Bet Not Confirm Reason Game Change", null, null, 'danger')
            setPopupDisplay(false)
            profitData.current = 0
            stakeValue.current.value = 0
            return;
        }


        setSubmitButtonDisable(true)

        const postdata = {

            "sportId": sportList.id,
            "matchId": roundId,
            "isback": betType === 'ODDS' ? 1 : 0,
            "placeName": teamname.current,
            "placeName2": null,
            "odds": odds,
            "oddsk": 0,
            "profit": parseFloat(profit.current).toFixed(2),
            "loss": parseFloat(loss.current).toFixed(2),
            "betType": betType,
            "bet_side": backOrLay.toUpperCase(),
            "betAmount": parseFloat(stakeValue.current.value),
            "type": "DT6",
            "matchType": "dt6",

        }

        axiosFetch('casino/store', 'post', null, postdata)
            .then((res) => {
                if (res.data?.status === true) {

                    resetBetFields(profitData, stakeValue)
                    Notify("Bet Placed Successfully", null, null, 'success')

                    fetchDataDragonTigerDt6(data, sportList, match_id, roundId, TOTALPLAYERS, setTotalPlayers, betType, 'ODDS')


                } else {

                    resetBetFields(profitData, stakeValue)
                    Notify(res.data.msg, null, null, 'danger')
                }
                setHideLoading(true)
                setSubmitButtonDisable(false)
                setPopupDisplay(false)


            })
    }
    const dragon = TOTALPLAYERS.Dragon;

    const tiger = TOTALPLAYERS.Tiger;

    const pair = TOTALPLAYERS.Pair;


    return (

        <CasinoLayout raceClass="teenpatti1day vcasino"  virtualVideoCards={renderCards} ruleDescription={ruleDescription} ruleImage={ruleImage} hideLoading={hideLoading}
                      isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult}>


            <div className="card-content m-t-0">
                <div className="row row5 mt-10">
                    <div className="table-responsive col-md-6 col-12 main-market">
                        <div className="live-poker dt-odds">
                            <table className="table coupon-table table table-bordered">
                                <thead>
                                <tr>
                                    <th className="w-4"></th>
                                    <th className="text-center back w-3">BACK</th>
                                    <th className="text-center lay w-3">LAY</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr className={`bet-info`}>
                                    <td className="w-4">
                                        <p className="mb-0">{getExByColor(dragon.amounts)}</p>
                                        <b>Dragon</b>

                                    </td>
                                    <td className={`back w-3  ${dragon.status}`}>
                                        <button className="back"
                                                onClick={() => openPopup('back', 'Dragon', dragon.odds.back, 'ODDS')}>
                                            <span className="odd d-block">{dragon.odds.back}</span>
                                        </button>

                                    </td>
                                    <td className={`w-3 lay  ${dragon.status}`}>
                                        <button className="lay"
                                                onClick={() => openPopup('lay', 'Dragon', dragon.odds.lay, 'ODDS')}>
                                            <span className="odd d-block"><b>{dragon.odds.lay}</b></span>
                                        </button>

                                    </td>
                                </tr>
                                <tr className="bet-info">
                                    <td className="w-4">

                                        <p className="mb-0">{getExByColor(tiger.amounts)}</p>
                                        <b>Tiger</b>
                                    </td>
                                    <td className={`back w-3  ${tiger.status}`}>
                                        <button className="back"
                                                onClick={() => openPopup('back', 'Tiger', tiger.odds.back, 'ODDS')}>
                                            <span className="odd d-block"><b>{tiger.odds.back}</b></span>
                                        </button>

                                    </td>
                                    <td className={`lay w-3  ${tiger.status}`}>
                                        <button className="lay"
                                                onClick={() => openPopup('lay', 'Tiger', tiger.odds.lay, 'ODDS')}>
                                            <span className="odd d-block"><b>{tiger.odds.lay}</b></span>
                                        </button>

                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="table-responsive col-md-6 col-12 main-market">
                        <div className="casino-content-table">
                            <div className="text-center">
                                <b>{pair.odds.back}</b>
                                <button className={`btn-theme mt-1 ${pair.status}`}
                                        onClick={() => openPopup('back', 'Pair', pair.odds.back, 'PAIR')}>Pair
                                </button>
                                <p className="mt-1 mb-0 text-center">
                                    {getExByColor(pair.amounts)}
                                </p>
                            </div>
                        </div>
                        <div className="row row5">
                            <div className="col-12">
                                <p className="mt-1 mb-0 text-right min-max">
                                    {/*Min: {minLimit} Max: {maxLimit}*/}
                                </p>
                            </div>
                        </div>
                    </div>
                    {[['Even', 'Odd'], ['Red', 'Black']].map((category, index) => (
                        <div className="table-responsive col-md-6 col-12 main-market mt-2" key={index}>
                            <div className="live-poker">
                                <table className="table coupon-table table table-bordered">
                                    <thead>
                                    <tr>
                                        <th className="w-4">
                                            <div className="info-block">
                                                <a href="#" data-toggle="collapse"
                                                   data-target={`#min-max-info${index + 3}`} aria-expanded="false"
                                                   className="info-icon collapsed">
                                                    <i className="fas fa-info-circle m-l-10"></i>
                                                </a>
                                                <div id={`min-max-info${index + 3}`} className="min-max-info collapse">

                                                </div>
                                            </div>
                                        </th>
                                        {category.map((cat, catIndex) => (
                                            <th className="text-center back w-3" key={catIndex}>
                                                {cat}
                                                {cat === 'Red' && (
                                                    <>
                                                        <span className="card-icon"><span className="card-red">[</span></span>
                                                        <span className="card-icon"><span
                                                            className="card-red">{"{"}</span></span>
                                                    </>
                                                )}
                                                {cat === 'Black' && (
                                                    <>
                                                        <span className="card-icon"><span
                                                            className="card-black">]</span></span>
                                                        <span className="card-icon"><span
                                                            className="card-black">{"}"}</span></span>
                                                    </>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {['Dragon', 'Tiger'].map((player) => (
                                        <tr className="bet-info" key={player}>
                                            <td className="w-4">
                                                <p className="m-b-0"><b>{player}</b></p>
                                            </td>
                                            {category.map((cat) => (
                                                <td
                                                    key={cat}
                                                    className={`text-center back w-3 ${TOTALPLAYERS[player][cat].status}`}
                                                    onClick={() => openPopup(
                                                        'back',
                                                        `${player} ${cat}`,
                                                        TOTALPLAYERS[player][cat].odds,
                                                        ['Even', 'Odd'].includes(cat) ? `${player[0]}_EVEN_ODD` : `${player[0]}_RED_BLACK`
                                                    )}
                                                >
                                                    <span
                                                        className="odds d-block"><b>{TOTALPLAYERS[player][cat].odds}</b></span>
                                                    {getExByColor(TOTALPLAYERS[player][cat].amounts)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row row-5 mt-2">
                    <div className="table-responsive col-12-6 col-12 main-market">
                        <div className="live-poker">
                            <table className="table coupon-table table table-bordered ">
                                <thead>
                                <tr>
                                    <th className="w-2"></th>
                                    {['Spade', 'Heart', 'Club', 'Diamond'].map((suit, index) => (
                                        <th className="w-2 text-center back" key={index}>
                        <span className="card-icon">
                            <span className={`card-${suit.toLowerCase()}`}>
                                {suit === 'Spade' ? '}' :
                                    suit === 'Heart' ? <span className="card-red">{'{'}</span> :
                                        suit === 'Club' ? ']' :
                                            <span className="card-red">{'['}</span>}
                            </span>
                        </span>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {['Dragon', 'Tiger'].map((player) => (
                                    <tr key={player} className="bet-info">
                                        <td className="w-2"><b>{player}</b></td>
                                        {['Spade', 'Heart', 'Club', 'Diamond'].map((suit) => (
                                            <td key={suit}
                                                className={`w-2 back text-center ${TOTALPLAYERS[player][suit].status}`}>
                                                <button
                                                    onClick={() => openPopup('back', `${player} ${suit}`, TOTALPLAYERS[player][suit].odds, player === 'Dragon' ? 'D_COLOR' : 'T_COLOR')}>
                                <span className="odd d-block">
                                    {TOTALPLAYERS[player][suit].odds}
                                </span>
                                                    <div>
                                                        <div className="ubook text-danger">

                                                            {getExByColor(TOTALPLAYERS[player][suit].amounts)}

                                                        </div>
                                                    </div>
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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

        </CasinoLayout>
    );

};


export default Vdt6;
