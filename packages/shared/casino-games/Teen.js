import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";




import Notify from "../utils/Notify";

const Teen = () => {
    const [roundId, setRoundId] = useState('')


    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(true)

    const [cards, setCards] = useState({});

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const { match_id } = useParams();
    const {
        betType,
        setBetType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    // Get user data from Redux instead of AuthContext
    const {mybetModel} = useContext(CasinoContext)
    const { getBalance } = useContext(AuthContext);

    const [hideLoading, setHideLoading] = useState(true)
    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0); // Example player A value
    const [playerStatuses, setPlayerStatuses] = useState({ "Player A": 'suspended-box', "Player B": 'suspended-box' });
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

        
    }, [data?.sub]);

    useEffect(() => {
        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());

            let playerACards = cardArray.filter((_, index) => index % 2 === 0);
            let playerBCards = cardArray.filter((_, index) => index % 2 !== 0);

            setCards({
                playerA: playerACards,
                playerB: playerBCards,
            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data?.card]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;

    useEffect(() => {

        if (data?.sub && sportList?.id) {
            getExByTeamNameForCasino(sportList.id, data.mid, 'Player A', match_id).then(res => setPlayerA(res.data))

            getExByTeamNameForCasino(sportList.id, data.mid, 'Player B', match_id).then(res => setPlayerB(res.data))
        }
    }, [exposure, sportLength, roundId, mybetModel.length]);

    const updatePlayerStats = (playerData, setPlayerBack, setPlayerLay, playerName, teamsession) => {
        if (!playerData) return;
        let playerStatus = '';
        if (playerData.gstatus === "SUSPENDED") {
            playerStatus = "suspended-box";

        }
        setPlayerStatuses(prev => ({ ...prev, [playerName]: playerStatus }));

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
            setPopupDisplayForDesktop(true);
            
            teamname.current = teamnam
            setOdds(oddvalue)
        } else {
            Notify("Odds Should Not Be Zero", null, null, 'danger')

        }


    }

    // Helper function to find data in data.sub for Teen
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Teen, find the item by nat field
        return data.sub.find(item => item.nat === teamName);
    };
    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds
        if (submitButtonDisable === true) {
            setSubmitButtonDisable(false)
        }
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
                                <img src={imgSrc} alt={`${player} card ${index + 1}`} />
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
            betType: "BOOKMAKER",
            stakeValue,
            match_id: 'teen',
            roundIdSaved,
            totalPlayers: Object.keys(playerStatuses).length > 0 ? playerStatuses : null,
            playerStatuses,
            setHideLoading,
            setPopupDisplayForDesktop,
            setSubmitButtonDisable,
            resetBetFields,
            profitData,
            getBalance,
            updateAmounts: null,
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
                getExByTeamNameForCasino(sportList.id, data.mid, 'Player A', match_id).then(res => setPlayerA(res.data));
                getExByTeamNameForCasino(sportList.id, data.mid, 'Player B', match_id).then(res => setPlayerB(res.data));
                

            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
            
                <div className="video-overlay">
                    <div className="casino-video-cards">
                        <div>
                            <h5>Player A</h5>
                            {renderCards(cards.playerA, "Player A")}
                        </div>
                        <div className="mt-1">
                            <h5>Player B</h5>
                            {renderCards(cards.playerB, "Player B")}
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
        <CasinoLayout hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
            stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
            submitButtonDisable={submitButtonDisable} setSubmitButton={setSubmitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
            sportList={sportList}
            setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
            getMinMaxLimits={getMinMaxLimits}>
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
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data} />
                </div>
            </div>


        </CasinoLayout>
    );

};

const PlayerTable = ({ playerName, playerValue, playerBack, openPopup, playerLay, playerStatus }) => (
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
                <div className={`casino-odds-box back ${playerStatus}`} onClick={() => openPopup('back', playerName, playerBack)}>
                    <span className="casino-odds" >{playerBack}</span>
                </div>
                <div className={`casino-odds-box lay ${playerStatus}`} onClick={() => openPopup('lay', playerName, playerLay)}>
                    <span className="casino-odds">{playerLay}</span>
                </div>
            </div>
        </div>
    </div>
);
export default Teen;
