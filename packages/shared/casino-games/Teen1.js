import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamNameCasino,
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet, updatePlayerStats
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";

const Teen1 = () => {
    const [roundId, setRoundId] = useState('')
    const [totalPlayers, setTotalPlayers] = useState({
        "Player": [
            {odds: {back: 0, lay: 0}, status: '', amounts: '', type: 'Player'},
            {odds: {back: 0, lay: 0}, status: '', amounts: '', type: '7 Up Player'},
            {odds: {back: 0, lay: 0}, status: '', amounts: '', type: '7 Down Player'}
        ],
        "Dealer": [
            {odds: {back: 0, lay: 0}, status: '', amounts: '', type: 'Dealer'},
            {odds: {back: 0, lay: 0}, status: '', amounts: '', type: '7 Up Dealer'},
            {odds: {back: 0, lay: 0}, status: '', amounts: '', type: '7 Down Dealer'}
        ]
    });

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

    .rules-section .row.row5>[class*="col-"],
    .rules-section .row.row5>[class*="col"] {
        padding-left: 5px;
        padding-right: 5px;
    }

    .rules-section {
        text-align: left;
        margin-bottom: 10px;
    }

    .rules-section .table {
        color: #fff;
        border: 1px solid #444;
        background-color: #222;
        font-size: 12px;
    }

    .rules-section .table td,
    .rules-section .table th {
        border-bottom: 1px solid #444;
    }

    .rules-section ul li,
    .rules-section p {
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

    .rules-section .rules-highlight {
        color: #FDCF13;
        font-size: 16px;
    }

    .rules-section .rules-sub-highlight {
        color: #FDCF13;
        font-size: 14px;
    }

    .rules-section .list-style,
    .rules-section .list-style li {
        list-style: disc;
    }

    .rules-section .rule-card {
        height: 20px;
        margin-left: 5px;
    }

    .rules-section .card-character {
        font-family: Card Characters;
    }

    .rules-section .red-card {
        color: red;
    }

    .rules-section .black-card {
        color: black;
    }

    .rules-section .cards-box {
        background: #fff;
        padding: 6px;
        display: inline-block;
        color: #000;
        min-width: 150px;
    }
    </style>
<div class="rules-section">
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>1 CARD ONE-DAY is a very easy and fast paced game.</li>
                                                <li>This game is played with 8 decks of regular 52 cards between the player and dealer.</li>
                                                <li>Both, the player and dealer will be dealt one card each.</li>
                                                <li>The objective of the game is to guess whether the player or  dealer will draw a card of the higher value and will therefore win.</li>
                                                <li>You can place your bets on the player as well as dealer.</li>
                                                <li>You have a betting option of Back and Lay for the main bet.</li>
                                                <li><b>Ranking of cards :</b> from lowest to highest</li>
                                                <li>2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 , J , Q , K , A</li>
                                                <li>If the player and dealer both have the same hand with the same ranking cards but of different suits then the winner will be decided according to the order of the suits.</li>
                                                <li><b>Order of suits :</b> from highest to lowest</li>
                                                <li>Spades , Hearts , Clubs , Diamonds</li>
                                                <li>eg      Clubs  ACE               Diamonds    ACE</li>
                                                <li>Here ACE of Clubs wins.</li>
                                                <li><b>TIE :</b> If both,the player and dealer hands have the same ranking cards which are of the same suit then it will be a TIE. In that case bets placed  (Back and Lay ) on both the player and dealer will be returned. (pushed)</li>
                                                <li>eg:  Ace of Spades                Ace of Spades</li>
                                                <li><b>7 DOWN   7 UP :</b> Here you can bet whether it will be a 7Down card or a 7UP card irrespective of suits.</li>
                                                <li><b>7DOWN cards:</b> A, 2, 3, 4, 5, 6</li>
                                                <li><b>7UP cards :</b> 8, 9, 10, J, Q, K</li>
                                                <li><b>CARD  7 :</b> If the card drawn is 7, bets placed on both, 7Down and 7Up will lose half of the bet amount.</li>
                                                <li>For 7Down- 7Up you can bet on either or both the player and dealer.</li>
                                                <li><b>Note :</b> In case of a <b>TIE</b> between the player and dealer, bets placed on 7Down and 7Up will be considered valid.</li>
                                            </ul>
                                        </div></div>`
    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [cards, setCards] = useState({});

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


    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({
        "Player": 'suspended-box',
        "Dealer": 'suspended-box'
    });

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {


        if (data?.sub) {
            // Initialize players and dealers based on the current state
            const players = [...totalPlayers.Player];
            const dealers = [...totalPlayers.Dealer];

            data.sub.forEach(item => {
                const playerData = {
                    odds: {back: item.b, lay: item.l},
                    status: item.gstatus === 'OPEN' ? '' : 'suspended-box',

                    type: item.nat,
                };
                
                // Update playerStatuses based on the main type (Player or Dealer)
                const mainType = item.nat.includes("Player") ? "Player" : "Dealer";
                setPlayerStatuses(prev => ({
                    ...prev,
                    [mainType]: item.gstatus === 'OPEN' ? '' : 'suspended-box'
                }));

                // Check if the item is a player or dealer and update accordingly
                if (item.nat.includes("Player")) {
                    // Find the existing player
                    const existingPlayerIndex = players.findIndex(player => player.type === item.nat);
                    if (existingPlayerIndex >= 0) {
                        // If found, update the existing player's odds and status
                        players[existingPlayerIndex] = {...players[existingPlayerIndex], ...playerData};
                    } else {
                        // If not found, push the new player
                        players.push(playerData);
                    }
                } else if (item.nat.includes("Dealer")) {
                    // Find the existing dealer
                    const existingDealerIndex = dealers.findIndex(dealer => dealer.type === item.nat);
                    if (existingDealerIndex >= 0) {
                        // If found, update the existing dealer's odds and status
                        dealers[existingDealerIndex] = {...dealers[existingDealerIndex], ...playerData};
                    } else {
                        // If not found, push the new dealer
                        dealers.push(playerData);
                    }
                }
            });

            // Update the state with the new players and dealers
            setTotalPlayers({
                Player: players,
                Dealer: dealers,
            });
        }


        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: cardArray.slice(0, 1).filter(item => item !== '1'),
                playerB: cardArray.slice(1, 3),
            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;


    const updateAmounts = async () => {
        const result = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '');

        const filtered_data = result.data.filter(item => item.type === 'PLAYER' || item.type === 'DEALER');

// Await the two promises and get the data from each
        const [playerResult, dealerResult] = await Promise.all([
            getExByTeamNameForCasino(sportList.id, roundId, 'Player', match_id, 'ODDS'),
            getExByTeamNameForCasino(sportList.id, roundId, 'Dealer', match_id, 'ODDS')
        ]);

        setTotalPlayers((prevState) => {
            const prev = {...prevState};

            // Update the amounts from filtered data
            if (filtered_data.length > 0) {
                // If filtered_data is not empty, update amounts
                filtered_data.forEach(item => {
                    const { team_name, type, total_amount } = item;

                    // Determine the correct array to update based on the type
                    const teamArray = type === 'PLAYER' ? prev.Player : prev.Dealer;

                    // Find the corresponding team in the appropriate array
                    const teamToUpdate = teamArray.find(team => team.type === team_name);

                    // Update the amounts if found
                    if (teamToUpdate) {
                        teamToUpdate.amounts = total_amount || ''; // Reset to '' if no amount is found
                    }
                });
            } else {
                // If filtered_data is empty, reset amounts for all teams
                prev.Player.forEach(player => {
                    player.amounts = ''; // Reset amounts to empty string
                });
                prev.Dealer.forEach(dealer => {
                    dealer.amounts = ''; // Reset amounts to empty string
                });
            }

            // Update the amounts for Player and Dealer from result_player_dealer
            if (playerResult?.data) {
                const playerTeam = prev.Player.find(team => team.type === 'Player');
                if (playerTeam) {
                    playerTeam.amounts = playerResult.data || '';
                }
            } else {
                const playerTeam = prev.Player.find(team => team.type === 'Player');
                if (playerTeam) {
                    playerTeam.amounts = '';
                }
            }

            if (dealerResult?.data) {
                const dealerTeam = prev.Dealer.find(team => team.type === 'Dealer');
                if (dealerTeam) {
                    dealerTeam.amounts = dealerResult.data || '';
                }
            } else {
                const dealerTeam = prev.Dealer.find(team => team.type === 'Dealer');
                if (dealerTeam) {
                    dealerTeam.amounts = '';
                }
            }

            return prev;
        });


    }
    useEffect(() => {

        if (data?.sub && sportList?.id) {

            updateAmounts()


        }
    }, [exposure, sportLength, roundId, mybetModel.length]);


    const openPopup = (isBakOrLay, teamnam, oddvalue, betType) => {
        setBetType(betType)


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

    // Helper function to find data in data.sub for Teen1
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Teen1, find the item by nat field
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
        const findPlayer = totalPlayers['Player'].find(item => item.type === teamname.current) || totalPlayers['Dealer'].find(item => item.type === teamname.current);
        
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
        return cards && cards.playerA && cards.playerA.length > 0 && (
            

                    <div className="casino-video-cards">
                        <div>
                            <h5>Player</h5>
                            {renderCards(cards.playerA, "Player A")}
                        </div>
                        <div className="mt-1">
                            <h5>Dealer</h5>
                            {renderCards(cards.playerB, "Player B")}
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
        <CasinoLayout ruleDescription={ruleDescription} hideLoading={hideLoading} isBack={backOrLay}
                      teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>


            <div className="casino-detail onecard1day">
                <div className="casino-table">
                    <div className="casino-table-box">
                        {/* Left Side for Player */}
                        <div className="casino-table-left-box">
                            <div className="casino-table-body">
                                <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">Player</div>
                                        <div className="casino- text-success">
                                            {getExByColor(totalPlayers.Player[0].amounts)}
                                        </div>
                                    </div>
                                    <div className={`casino-odds-box back ${totalPlayers.Player[0].status}`}
                                         onClick={() => openPopup('back', 'Player', totalPlayers.Player[0].odds.back, 'ODDS')}>
                                        <span className="casino-odds">{totalPlayers.Player[0].odds.back}</span>
                                    </div>
                                    <div className={`casino-odds-box lay ${totalPlayers.Player[0].status}`}
                                         onClick={() => openPopup('lay', 'Player', totalPlayers.Player[0].odds.lay, 'ODDS')}>
                                        <span className="casino-odds">{totalPlayers.Player[0].odds.lay}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="casino-table-box-divider"></div>

                        {/* Right Side for Dealer */}
                        <div className="casino-table-right-box">
                            <div className="casino-table-body">
                                <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">Dealer</div>
                                        <div className="casino- text-success">
                                            {getExByColor(totalPlayers.Dealer[0].amounts)}
                                        </div>
                                    </div>
                                    <div className={`casino-odds-box back ${totalPlayers.Dealer[0].status}`}
                                         onClick={() => openPopup('back', 'Dealer', totalPlayers.Dealer[0].odds.back, 'ODDS')}>
                                        <span className="casino-odds">{totalPlayers.Dealer[0].odds.back}</span>
                                    </div>
                                    <div className={`casino-odds-box lay ${totalPlayers.Dealer[0].status}`}
                                         onClick={() => openPopup('lay', 'Dealer', totalPlayers.Dealer[0].odds.lay, 'ODDS')}>
                                        <span className="casino-odds">{totalPlayers.Dealer[0].odds.lay}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 7 Up / Down Section */}
                    <div className="casino-table-box mt-3 sevenupbox">
                        {/* Player Side */}
                        <div className="casino-table-left-box">
                            <h4 className="d-md-none mb-2">Player</h4>
                            <div className="seven-up-down-box">
                                {/* 7 Down Player */}
                                <div className={`up-box ${totalPlayers.Player[2].status}`}
                                     onClick={() => openPopup('back', '7 Down Player', totalPlayers.Player[2].odds.back, 'PLAYER')}>
                                    <div className="up-down-book">
                                        {getExByColor(totalPlayers.Player[2].amounts)}
                                    </div>
                                    <div className="text-end">
                                        <div className="up-down-odds">{totalPlayers.Player[2].odds.back}</div>
                                        <span>DOWN</span>
                                    </div>
                                </div>

                                {/* 7 Up Player */}
                                <div className={`down-box ${totalPlayers.Player[1].status}`}
                                     onClick={() => openPopup('back', '7 Up Player', totalPlayers.Player[2].odds.back, 'PLAYER')}>
                                    <div className="up-down-book">
                                        {getExByColor(totalPlayers.Player[1].amounts)}
                                    </div>
                                    <div className="text-start">
                                        <div className="up-down-odds">{totalPlayers.Player[1].odds.back}</div>
                                        <span>UP</span>
                                    </div>
                                </div>

                                <div className="seven-box">
                                    <img src="/img/trape-seven.png"
                                         alt="seven"/>
                                </div>
                            </div>
                        </div>

                        <div className="casino-table-box-divider"></div>

                        {/* Dealer Side */}
                        <div className="casino-table-right-box">
                            <h4 className="d-md-none mb-2">Dealer</h4>
                            <div className="seven-up-down-box">
                                {/* 7 Down Dealer */}
                                <div className={`up-box ${totalPlayers.Dealer[2].status}`}
                                     onClick={() => openPopup('back', '7 Down Dealer', totalPlayers.Dealer[2].odds.back, 'DEALER')}>
                                    <div className="up-down-book">
                                        {getExByColor(totalPlayers.Dealer[2].amounts)}
                                    </div>
                                    <div className="text-end">
                                        <div className="up-down-odds">{totalPlayers.Dealer[2].odds.back}</div>
                                        <span>DOWN</span>
                                    </div>
                                </div>

                                {/* 7 Up Dealer */}
                                <div className={`down-box ${totalPlayers.Dealer[1].status}`}
                                     onClick={() => openPopup('back', '7 Up Dealer', totalPlayers.Dealer[1].odds.back, 'DEALER')}>
                                    <div className="up-down-book">
                                        {getExByColor(totalPlayers.Dealer[1].amounts)}
                                    </div>
                                    <div className="text-start">
                                        <div className="up-down-odds">{totalPlayers.Dealer[1].odds.back}</div>
                                        <span>UP</span>
                                    </div>
                                </div>

                                <div className="seven-box">
                                    <img src="/img/trape-seven.png"
                                         alt="seven"/>
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
    );

};


export default Teen1;
