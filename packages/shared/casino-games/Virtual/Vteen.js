import CasinoLayout from "../../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../../components/casino/CasinoLastResult";

import axiosFetch, {

    getExByTeamNameForCasino, resetBetFields
} from "../../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../../contexts/SportsContext";


import Notify from "../../utils/Notify";

const Vteen = () => {
    const [roundId, setRoundId] = useState('')


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

    } = useContext(SportsContext)
    const [hideLoading, setHideLoading] = useState(true)


    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0); // Example player A value
    const [playerStatuses, setPlayerStatuses] = useState({"Player A": 'suspended-box', "Player B": 'suspended-box'});
    const [playerA_Back, setPlayerA_Back] = useState(0);
    const [playerB_Back, setPlayerB_Back] = useState(0);
    const [playerA_Lay, setPlayerA_Lay] = useState(0);
    const [playerB, setPlayerB] = useState(0); // Example player B value

    const [playerB_Lay, setPlayerB_Lay] = useState(0);
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {
        setBetType('BOOKMAKER')

        if (data?.sub) {
            updatePlayerStats(data.sub[0], setPlayerA_Back, setPlayerA_Lay, "Player A");
            updatePlayerStats(data.sub[1], setPlayerB_Back, setPlayerB_Lay, "Player B");

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
            getExByTeamNameForCasino(sportList.id, data.mid, 'Player A', match_id).then(res => setPlayerA(res.data))

            getExByTeamNameForCasino(sportList.id, data.mid, 'Player B', match_id).then(res => setPlayerB(res.data))
        }
    }, [exposure, sportLength, roundId]);

    const updatePlayerStats = (playerData, setPlayerBack, setPlayerLay, playerName, teamsession) => {
        if (!playerData) return;
        let playerStatus = '';
        if (playerData.gstatus === "SUSPENDED") {
            playerStatus = "suspended";

        }
        setPlayerStatuses(prev => ({...prev, [playerName]: playerStatus}));

        if (playerData.b) {
            setPlayerBack(playerData.b);
        } else {
            setPlayerBack(0);
        }
        if (playerData.l) {
            setPlayerLay(playerData.l);
        } else {
            setPlayerLay(0);
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
            Notify("Odds Should Not Be Zero", null, null, 'danger')

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
            "betType": "BOOKMAKER",
            "bet_side": backOrLay.toUpperCase(),
            "betAmount": parseFloat(stakeValue.current.value),
            "type": "TEEN",
            "matchType": "teen",

        }

        axiosFetch('casino/store', 'post', null, postdata)
            .then((res) => {
                if (res.data.status === true) {

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
        <CasinoLayout raceClass="teenpatti1day vcasino"  virtualVideoCards={renderCards} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult}>



            <div className="casino-detail">
                <div className="casino-table">
                    <div className="casino-table-box">
                        {
                            ["Player A", "Player B"].map((playerName, i) => (
                                <>
                                    <PlayerTable
                                        openPopup={openPopup}
                                        playerName={playerName}
                                        playerValue={i === 0 ? playerA : playerB}
                                        playerBack={i === 0 ? playerA_Back : playerB_Back}
                                        playerLay={i === 0 ? playerA_Lay : playerB_Lay}
                                        playerStatus={playerStatuses[playerName]}
                                    />

                                    {i === 0 && <div className="casino-table-box-divider"></div>}
                                </>

                            ))
                        }
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
            <div className={`casino-table-row`}>
                <div className="casino-nation-detail">
                    <div className="casino-nation-name">Main</div>
                    <p className="m-b-0">
                        <span className={`font-weight-bold ${playerValue >= 0 ? 'text-success' : 'text-danger'}`}>
                            {playerValue}
                        </span>
                    </p>
                </div>
                <div className={`casino-odds-box back ${playerStatus}`}>
                    <span className="casino-odds"
                          onClick={() => openPopup('back', playerName, playerBack)}>{playerBack}</span>
                </div>
                <div className={`casino-odds-box lay ${playerStatus}`}>
                    <span className="casino-odds"
                          onClick={() => openPopup('lay', playerName, playerLay)}>{playerLay}</span>
                </div>
            </div>
        </div>
    </div>
);
export default Vteen;
