import CasinoLayout from "../../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamLayBackCasino, resetBetFields
} from "../../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../../contexts/SportsContext";


import Notify from "../../utils/Notify";


const Vtrio = () => {
    const [roundId, setRoundId] = useState('')

    const defaultStatusAmount = {status: 'suspended-box', amounts: ""};
    const defaultValuesWithBackAndLay = {odds: {back: 0, lay: 0}, ...defaultStatusAmount}
    const defaultValuesWithBack = {odds: {back: 0}, ...defaultStatusAmount}
    const [totalPlayers, setTotalPlayers] = useState({
        "Session": {...defaultValuesWithBackAndLay, bet_type: "Session"},
        "3 Card Judgement (1 2 4)": {
            ...defaultValuesWithBackAndLay,
            subname: "3 Card Judgement(1 2 4)",
            bet_type: 'CARD3J124'
        },
        "3 Card Judgement (J Q K)": {
            ...defaultValuesWithBackAndLay,
            subname: "3 Card Judgement(J Q K)",
            bet_type: 'CARD3JQK'
        },
        "Two Red Only": {...defaultValuesWithBackAndLay, bet_type: 'TWOREDONLY'},
        "Two Black Only": {...defaultValuesWithBackAndLay, bet_type: 'TWOBLACKONLY'},
        "Two Odd Only": {...defaultValuesWithBackAndLay, bet_type: 'TWOODDONLY'},
        "Two Even Only": {...defaultValuesWithBackAndLay, bet_type: 'TWOEVENONLY'},
        "Pair": {...defaultValuesWithBack, bet_type: 'FANCY'},
        "Flush": {...defaultValuesWithBack, bet_type: 'FANCY'},
        "Straight": {...defaultValuesWithBack, bet_type: 'FANCY'},
        "Trio": {...defaultValuesWithBack, bet_type: 'FANCY'},
        "Straight Flush": {...defaultValuesWithBack, bet_type: 'FANCY'},

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


    const updateAmounts = async (individual = false) => {

        let promises = [];
        if (!individual) {
            promises = Object.entries(totalPlayers).map(([index, value]) => {
                const ii = index === 'Trio' ? 'TRIO' : index
                return getExBySingleTeamLayBackCasino(sportList.id, roundId, ii, match_id, value.bet_type)


            })
            const promise_daa = await Promise.all(promises)

            setTotalPlayers((prevState) => {

                Object.entries(prevState).forEach(([index, value], i) => {

                    prevState[index].amounts = promise_daa[i].data === 0 ? '' : promise_daa[i].data
                })


                return prevState
            })

        } else {
            const index = Object.entries(totalPlayers).filter(([index, itm]) => itm.bet_type === individual)[0][0];

            const ii = index === 'Trio' ? 'TRIO' : index


            promises.push(getExBySingleTeamLayBackCasino(sportList.id, roundId, ii, match_id, individual))
            const promise_daa = await Promise.all(promises)
            setTotalPlayers((prevState) => {

                prevState[index].amounts = promise_daa[0].data === 0 ? '' : promise_daa[0].data
                return prevState
            })


        }


    }


    const updatePlayers = () => {
        setTotalPlayers((prevPlayer) => {

            const updatedPlayers = JSON.parse(JSON.stringify(prevPlayer))


            Object.entries(updatedPlayers).forEach(([index1, value1], i) => {


                const founddata = data.sub.find(item => item.nat === index1 || item.nat === value1?.subname)
                if (founddata) {

                    updatedPlayers[index1].odds.back = founddata.b
                    if (updatedPlayers[index1].odds.hasOwnProperty('lay')) {
                        updatedPlayers[index1].odds.lay = founddata.l
                    }
                    updatedPlayers[index1].status = founddata.gstatus === 'OPEN' ? "" : 'suspended-box'
                }


            })


            return updatedPlayers
        })


    }

    useEffect(() => {


        if (data?.sub) {
            updatePlayers()

        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards(cardArray);
            remark.current = data.remark || 'Welcome';
        } else {
            setCards(['1', '1', '1'])
        }
    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            updateAmounts()
        }
    }, [exposure, sportLength, roundId]);


    const openPopup = (isBakOrLay, teamnam, oddvalue, type) => {
        setBetType(type)


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
            <div className="flip-card-container">
                {[1, 2, 3].map((value, index) => (

                    <div className="flip-card" key={index}>
                        <div className="flip-card-inner ">
                            <div className="flip-card-front"><img
                                src={import.meta.env.VITE_CARD_PATH + cards[index] + ".png"} />
                            </div>
                            <div className="flip-card-back"><img
                                src={import.meta.env.VITE_CARD_PATH + cards[index] + ".png" }/>
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </div>

    );
    const placeBet = () => {

        setHideLoading(false)
        if (totalPlayers['Session'].status !== '') {
            Notify(`Bet Not Confirmed. Reason: Game Suspended`, null, null, 'danger');
            setPopupDisplay(false)
            resetBetFields(profitData, stakeValue)
            setHideLoading(true);

            return;
        }

        if (roundIdSaved.current !== roundId) {
            Notify("Bet Not Confirm Reason Game Change", null, null, 'danger')
            setPopupDisplay(false)
            resetBetFields(profitData, stakeValue)
            setHideLoading(true);
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
                    updateAmounts(betType)

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
        <CasinoLayout virtualVideoCards={renderCards} raceClass="trio vcasino" data={data}
                      roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult}>


            <div className="casino-detail">
                <div className="casino-table">
                    <PlayerTable players={Object.entries(totalPlayers).slice(0, 3)} playerName="Session"
                                 click={openPopup}/>
                    <PlayerTable players={Object.entries(totalPlayers).slice(3, 7)} click={openPopup}/>
                    <PlayerTable players={Object.entries(totalPlayers).slice(7, 12)}
                                 whichclassName="casino-table-box trioodds mt-3" click={openPopup}/>
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

const PlayerTable = ({
                         click,
                         players = {}, playerName = 'None', whichclassName = 'casino-table-box triocards mt-3'
                     }) => {
    const whichClass = playerName === 'Session' ? "casino-table-box" : whichclassName;
    return (
        <div className={whichClass}>
            {players.map(([index, value], i) => (
                <div className="casino-odd-box-container" key={i}>
                    <div className="casino-nation-name pointer">{index} {index === 'Session' && (
                        <i className="fas fa-info-circle"></i>)}
                    </div>
                    <div className={`casino-odds-box back ${value.status}`}
                         onClick={() => click('back', index, value.odds.back, value.bet_type)}><span
                        className="casino-odds">{value.odds.back}</span>
                        {index === 'Session' && (<span className="casino-volume">80</span>)}
                    </div>
                    {value.odds.hasOwnProperty('lay') && (
                        <div className={`casino-odds-box lay ${value.status}`}
                             onClick={() => click('lay', index, value.odds.lay, value.bet_type)}><span
                            className="casino-odds">{value.odds.lay}</span>
                            {index === 'Session' && (
                                <span className="casino-volume">100</span>
                            )}
                        </div>
                    )}
                    <div className="casino- text-center w-100">
                        {getExByColor(value.amounts)}
                    </div>
                </div>
            ))}


        </div>
    )
};

export default Vtrio;
