import CasinoLayout from "../../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../../components/casino/CasinoLastResult";
import RulesTeen20 from "../../components/casino/Rules/Teen20";
import axiosFetch, {

    getExByTeamNameForCasino, resetBetFields
}from "../../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../../contexts/SportsContext";

import Notify from "../../utils/Notify";


const Vteen20 = () => {
    const [roundId, setRoundId] = useState('')
    const ruleImage = '/img/rules/teen20.jpg'
    const ruleDescription ='';


    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)


    const [cards, setCards] = useState({
        'PLAYER A': ['1', '1', '1'],
        'PLAYER B': ['1', '1', '1']
    });

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const {match_id} = useParams();
    const {
        setBetType,
        setPopupDisplay,
        betType

    } = useContext(SportsContext)
    const [hideLoading, setHideLoading] = useState(true)


    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0); // Example player A value
    const [playerStatuses, setPlayerStatuses] = useState({ "Player A": 'suspended-box', "Player B": 'suspended-box' });
    const [playerA_Back, setPlayerA_Back] = useState(0);
    const [playerB_Back, setPlayerB_Back] = useState(0);
    const [playerB, setPlayerB] = useState(0); // Example player B value
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        setBetType('WINNER')

        if (data?.sub) {
            updatePlayerStats(data.sub[0], setPlayerA_Back, "Player A");
            updatePlayerStats(data.sub[1], setPlayerB_Back, "Player B");

        }

        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());

            let playerACards = cardArray.filter((_, index) => index % 2 === 0);
            let playerBCards = cardArray.filter((_, index) => index % 2 !== 0);

            setCards({
                "PLAYER A": playerACards,
                "PLAYER B": playerBCards,
            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            getExByTeamNameForCasino(sportList.id, data.mid, 'Player A', match_id, betType).then(res => setPlayerA(res.data))

            getExByTeamNameForCasino(sportList.id, data.mid, 'Player B', match_id, betType).then(res => setPlayerB(res.data))
        }
    }, [exposure, sportLength, roundId]);

    const updatePlayerStats = (playerData, setPlayerBack, playerName) => {
        if (!playerData) return;
        let playerStatus = '';
        if (playerData.gstatus === "SUSPENDED") {
            playerStatus = "suspended-box";

        }
        setPlayerStatuses(prev => ({...prev, [playerName]: playerStatus}));

        if (playerData.b) {
            setPlayerBack(playerData.b);
        } else {
            setPlayerBack(0);
        }

    };
    const openPopup = (isBakOrLay, teamnam, oddvalue) => {


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
            {Object.entries(cards).map(([index, value], i) => (
                <div className={`vcasinocards-player${i === 0 ? 'a' : 'b'}`} key={i}>
                    <h5 className="text-center">{index}</h5>
                    <div className="flip-card-container">
                        {cards[index].map((value1, index1) => (
                            <div className="flip-card" key={index1}>
                                <div className="flip-card-inner ">
                                    <div className="flip-card-front"><img
                                        src={import.meta.env.VITE_CARD_PATH + value1 + ".png"}/>
                                    </div>
                                    <div className="flip-card-back"><img
                                        src={import.meta.env.VITE_CARD_PATH + value1 + ".png"}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );


    const placeBet = () => {

        setHideLoading(false)
        if (playerStatuses[teamname.current] === 'suspended') {
            Notify(`Bet Not Confirmed. Reason: Game Suspended`, null, null, 'danger');
            setPopupDisplay(false);
            setHideLoading(true)

            return;
        }

        if (roundIdSaved.current !== roundId) {
            Notify("Bet Not Confirm Reason Game Change", null, null, 'danger')
            setPopupDisplay(false)
            setHideLoading(true)

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
            "type": "TEEN20",
            "matchType": "teen20"

        }

        axiosFetch('casino/store', 'post', null, postdata)
            .then((res) => {
                if (res.data.status === true) {

                    resetBetFields(profitData, stakeValue)
                    Notify("Bet Placed Successfully", null, null, 'success')
                }
                else{

                    resetBetFields(profitData, stakeValue)
                    Notify(res.data.msg, null, null, 'danger')
                }
                setHideLoading(true)
                setSubmitButtonDisable(false)
                setPopupDisplay(false)
            })


    }

    return (


        <CasinoLayout virtualVideoCards={renderCards} raceClass="teenpatti1day vcasino" ruleImage={ruleImage} ruleDescription={ruleDescription} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult}>



            <div className="casino-detail">
                <div className="table-responsive mb-1">
                    <table className="table table-bordered mb-0">
                        <thead>
                        <tr>
                            <th className="box-5 min-max"></th>
                            <th colSpan="2" className="box-5 text-center back">BACK</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="box-5">
                            <span className="d-block">
                                <b className="float-left">Player A</b>
                                <span
                                    className={`d-block float-right ${playerA >= 0 ? 'text-success' : 'text-danger'}`}>{playerA}</span>
                            </span>
                            </td>
                            <td className={`box-2 back text-center ${playerStatuses['Player A']}`}>
                                <span className="odds d-block"
                                      onClick={() => openPopup('back', "Player A", playerA_Back)}><b>{playerA_Back}</b></span>
                                <span className="odds d-block">&nbsp;</span>
                            </td>
                            <td className="box-3 back text-center suspended-box">
                                <span className="odds d-block"><b>Pair plus A</b></span>

                            </td>
                        </tr>
                        <tr>
                            <td className="box-5">
                            <span className="d-block">
                                <b className="float-left">Player B</b>
                                <span
                                    className={`d-block float-right ${playerB >= 0 ? 'text-success' : 'text-danger'}`}>{playerB}</span>

                            </span>
                            </td>
                            <td className={`box-2 back text-center ${playerStatuses['Player B']}`}>
                                <span className="odds d-block"
                                      onClick={() => openPopup('back', "Player B", playerB_Back)}><b>{playerB_Back}</b></span>
                                <span className="odds d-block">&nbsp;</span>
                            </td>
                            <td className="box-3 back text-center suspended-box">
                                <span className="odds d-block"><b>Pair plus B</b></span>

                            </td>
                        </tr>
                        </tbody>
                    </table>
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

export default Vteen20;
