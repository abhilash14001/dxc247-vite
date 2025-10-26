import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";
import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor,
    getExBySingleTeamNameCasino,
    getPlayerCardAccordingToNumberOfPlayers, resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";



import Notify from "../utils/Notify";

const Baccarat2 = () => {
    const [roundId, setRoundId] = useState('')

    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)
    const TOTALPLAYERS = {
        "Score 1-4": '',
        "Score 5-6": '',
        "Score 7": '',
        "Score 8": '',
        "Score 9": '',
        "Player Pair": '',
        "Player": '',
        "Tie": '',
        "Banker": '',
        "Banker Pair": '',

    };
    const [playerAmounts, setPlayerAmounts] = useState(TOTALPLAYERS);
    const {match_id} = useParams();

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    const ruleImage = '/img/rules/baccarat2-rules.jpg'
    
    const {
        betType,
        setBetType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    
    // Get user data from Redux instead of AuthContext

    const [hideLoading, setHideLoading] = useState(true)

    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);


    const [playerStatuses, setPlayerStatuses ] = useState(() => {
        const initialOdds = [{status: 'suspended-box', odds: "0", type: "bet-odds"},
            {status: 'suspended-box', odds: "0", type: "bet-odds"},
            {status: 'suspended-box', odds: "0", type: "bet-odds"},
            {status: 'suspended-box', odds: "0", type: "bet-odds"},
            {status: 'suspended-box', odds: "0", type: "bet-odds"},
            {status: 'suspended-box', odds: "0", type: "player-pair"},
            {
                status: 'suspended-box', odds: "0", type: "player",
                cardImages: ["/img/casino/cards/1.png", "/img/casino/cards/1.png", "/img/casino/cards/1.png"]
            },
            {status: 'suspended-box', odds: "0", type: "tie"},
            {
                status: 'suspended-box', odds: "0", type: "banker",
                cardImages: ["/img/casino/cards/1.png", "/img/casino/cards/1.png", "/img/casino/cards/1.png"]
            },
            {status: 'suspended-box', odds: "0", type: "banker-pair"}];
        return initialOdds.map((odds, index) => {
            const playerNames = Object.keys(TOTALPLAYERS); // Get player names
            return {
                ...odds,
                label: playerNames[index] || ""  // Assign label from TOTALPLAYERS or empty string if index exceeds
            };
        });
    });


    const updateOdds = (d_data) => {
        setPlayerStatuses(prevStatuses => {
            return prevStatuses.map((status, index) => {
                let newOdds = status.odds; // Default to existing odds
                let newStatus = status.status; // Default to existing status
                let cardImages = status.cardImages || '';
                const playerData = d_data.sub[index];

                
                if (d_data.sub && d_data.sub[index]) {

                    // Update odds if 'b' exists
                    if (playerData.b && playerData.b > 0) {
                        newOdds = playerData.b; // Update odds
                    }

                    
                    // Update status based on game status
                    if (playerData.gstatus === 'OPEN') {
                        newStatus = ''; // Game is open
                    } else {
                        newStatus = 'suspended-box'; // Game is suspended
                    }
                }

                // Specific handling based on labels
                switch (status.label) {
                    case 'Player':
                        if (d_data.sub[0] && d_data.sub[0].b) {
                            newOdds = d_data.sub[0].b; // Update odds for Player

                        }
                        cardImages = getPlayerCardAccordingToNumberOfPlayers(d_data, 1, 1, [4, 2, 0]); // 3 cards for Player


                        break;

                    case 'Banker':
                        if (d_data.sub[1] && d_data.sub[1].b) {
                            newOdds = d_data.sub[1].b; // Update odds for Banker
                        }
                        cardImages = getPlayerCardAccordingToNumberOfPlayers(d_data, 1, 1, [1, 3, 5]); // 3 cards for Player

                        break;

                    case 'Tie':
                        if (d_data.sub[2] && d_data.sub[2].b) {
                            newOdds = d_data.sub[2].b; // Update odds for Tie
                        }
                        break;

                    case 'Player Pair':
                        if (d_data.sub[3] && d_data.sub[3].b) {
                            newOdds = d_data.sub[3].b; // Update odds for Player Pair
                        }
                        break;

                    case 'Banker Pair':
                        if (d_data.sub[4] && d_data.sub[4].b) {
                            newOdds = d_data.sub[4].b; // Update odds for Banker Pair
                        }
                        break;

                    case 'Score 1-4':
                        if (d_data.sub[5] && d_data.sub[5].b) {
                            newOdds = d_data.sub[5].b; // Update odds for Score 1-4
                            newStatus = ''; // Update status to open

                        }
                        break;

                    case 'Score 5-6':
                        if (d_data.sub[6] && d_data.sub[6].b) {
                            newOdds = d_data.sub[6].b; // Update odds for Score 5-6
                        }
                        break;

                    case 'Score 7':
                        if (d_data.sub[7] && d_data.sub[7].b) {
                            newOdds = d_data.sub[7].b; // Update odds for Score 7
                        }
                        break;

                    case 'Score 8':
                        if (d_data.sub[8] && d_data.sub[8].b) {
                            newOdds = d_data.sub[8].b; // Update odds for Score 8
                        }
                        break;

                    case 'Score 9':
                        if (d_data.sub[9] && d_data.sub[9].b) {
                            newOdds = d_data.sub[9].b; // Update odds for Score 9
                        }
                        break;

                    // Add more cases as needed for additional statuses
                    default:
                        break;
                }


                return {
                    ...status,
                    odds: playerData.gstatus === 'OPEN' ? newOdds : status.odds,  // Update odds
                    status: newStatus, // Update status based on game state
                    cardImages: cardImages
                };
            });
        });
    };


    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {

        if (data?.sub) {
            updateOdds(data);

        }


    }, [data?.sub]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            Object.keys(TOTALPLAYERS).slice(5, 8).map(value => {

                getExBySingleTeamNameCasino(sportList.id, data.mid, value, match_id, value === 'Tie' ? 'TIE' : 'ODDS')
                    .then(res => {
// Update playerAmounts based on the response
                        setPlayerAmounts(prev => ({
                            ...prev,
                            [value]: res.data // Assuming the amount is in the response
                        }));
                    })
            })
        }
    }, [exposure, sportLength, roundId]);

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

    // Helper function to find data in data.sub for Baccarat2
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Baccarat2, find the item by nat field
        return data.sub.find(item => item.nat === teamName);
    };
    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds

        if (backOrLay === 'back') {


            loss.current = stakeValue.current.value;


            profit.current = profitData.current = (parseFloat(odds) * stakeValue.current.value).toFixed(2)


        } else {

            profit.current = profitData.current = stakeValue.current.value;


            loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2)
        }


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
            betType: teamname.current === 'Tie' ? 'TIE' : "ODDS",
            stakeValue,
            match_id: 'baccarat2',
            roundIdSaved,
            totalPlayers: TOTALPLAYERS,
            playerStatuses: playerStatuses.find(status => status.label === teamname.current),
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

            }
        });

        return success;
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
        <CasinoLayout raceClass="baccarat baccarat2" ruleImage={ruleImage} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname}
                      handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      getMinMaxLimits={getMinMaxLimits}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult}>
            <div className="casino-table">
                <div className="casino-table-full-box">
                    <div className="baccarat-graph text-center">
                        <h4 className="">Statistics</h4>
                        <div style={{height: '160px', width: '100%'}}>
                            <div id="reactgooglegraph-1" style={{height: '160px', width: '100%'}}>
                                <div style={{position: 'relative'}}>
                                    <div dir="ltr" style={{position: 'relative', width: '209px', height: '160px'}}>
                                        <div style={{position: 'absolute', left: '0px', top: '0px', width: '100%', height: '100%'}} aria-label="A chart.">
                                            <svg width="209" height="160" aria-label="A chart." style={{overflow: 'hidden'}}>
                                                <defs id="_ABSTRACT_RENDERER_ID_17"></defs>
                                                <g>
                                                    <rect x="146" y="3" width="63" height="39" stroke="none" strokeWidth="0" fillOpacity="0" fill="#ffffff"></rect>
                                                    <g columnId="Player">
                                                        <rect x="146" y="3" width="63" height="9" stroke="none" strokeWidth="0" fillOpacity="0" fill="#ffffff"></rect>
                                                        <g>
                                                            <text textAnchor="start" x="158" y="10.65" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#222222">Player</text>
                                                        </g>
                                                        <circle cx="150.5" cy="7.5" r="4.5" stroke="none" strokeWidth="0" fill="#086cb8"></circle>
                                                    </g>
                                                    <g columnId="Banker">
                                                        <rect x="146" y="18" width="63" height="9" stroke="none" strokeWidth="0" fillOpacity="0" fill="#ffffff"></rect>
                                                        <g>
                                                            <text textAnchor="start" x="158" y="25.65" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#222222">Banker</text>
                                                        </g>
                                                        <circle cx="150.5" cy="22.5" r="4.5" stroke="none" strokeWidth="0" fill="#ae2130"></circle>
                                                    </g>
                                                    <g columnId="Tie">
                                                        <rect x="146" y="33" width="63" height="9" stroke="none" strokeWidth="0" fillOpacity="0" fill="#ffffff"></rect>
                                                        <g>
                                                            <text textAnchor="start" x="158" y="40.65" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#222222">Tie</text>
                                                        </g>
                                                        <circle cx="150.5" cy="37.5" r="4.5" stroke="none" strokeWidth="0" fill="#279532"></circle>
                                                    </g>
                                                </g>
                                                <g>
                                                    <path d="M131,73.7L131,86.3A63,50.400000000000006,0,0,1,101.75708808367679,128.85412744530157L101.75708808367679,116.25412744530156A63,50.400000000000006,0,0,0,131,73.7" stroke="#06518a" strokeWidth="1" fill="#06518a"></path>
                                                    <path d="M68,73.7L68,86.3L101.75708808367679,128.85412744530157L101.75708808367679,116.25412744530156" stroke="#06518a" strokeWidth="1" fill="#06518a"></path>
                                                    <path d="M68,73.7L68,23.299999999999997A63,50.400000000000006,0,0,1,101.75708808367679,116.25412744530156L68,73.7A0,0,0,0,0,68,73.7" stroke="#086cb8" strokeWidth="1" fill="#086cb8"></path>
                                                    <text textAnchor="start" x="100.89691062059624" y="67.51799705880876" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#ffffff">41%</text>
                                                </g>
                                                <g>
                                                    <path d="M68,73.7L68,86.3L24.873532326492594,49.55998117796087L24.873532326492594,36.95998117796087" stroke="#1d7026" strokeWidth="1" fill="#1d7026"></path>
                                                    <path d="M68,73.7L24.873532326492594,36.95998117796087A63,50.400000000000006,0,0,1,68,23.299999999999997L68,73.7A0,0,0,0,0,68,73.7" stroke="#279532" strokeWidth="1" fill="#279532"></path>
                                                    <text textAnchor="start" x="42.481680986011206" y="44.86427457520075" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#ffffff">12%</text>
                                                </g>
                                                <g>
                                                    <path d="M101.75708808367679,116.25412744530156L101.75708808367679,128.85412744530157A63,50.400000000000006,0,0,1,5,86.3L5,73.7A63,50.400000000000006,0,0,0,101.75708808367679,116.25412744530156" stroke="#831924" strokeWidth="1" fill="#831924"></path>
                                                    <path d="M68,73.7L101.75708808367679,116.25412744530156A63,50.400000000000006,0,0,1,24.873532326492573,36.959981177960884L68,73.7A0,0,0,0,0,68,73.7" stroke="#ae2130" strokeWidth="1" fill="#ae2130"></path>
                                                    <text textAnchor="start" x="24.79895901143385" y="97.18893584273907" fontFamily="Arial" fontSize="9" stroke="none" strokeWidth="0" fill="#ffffff">47%</text>
                                                </g>
                                                <g></g>
                                            </svg>
                                            <div aria-label="A tabular representation of the data in the chart." style={{position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>P</th>
                                                            <th>Data</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Player</td>
                                                            <td>41</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Banker</td>
                                                            <td>47</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tie</td>
                                                            <td>12</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div aria-hidden="true" style={{display: 'none', position: 'absolute', top: '170px', left: '219px', whiteSpace: 'nowrap', fontFamily: 'Arial', fontSize: '9px'}}>Tie</div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="baccarat-odds-container">
                        <div className="baccarat-other-odds">
                            {playerStatuses.slice(0, 5).map((option, index) => (
                                <div key={index} className="baccarat-other-odd-box-container">
                                    <div className={`baccarat-other-odd-box ${option.status.toLowerCase() === 'suspended-box' ? 'suspended-box' : ''}`}>    
                                        <span>{option.label}</span>
                                        <span>{option.odds}:1</span>
                                    </div>
                                    <div className="casino- text-center">
                                        {getExByColor(playerAmounts[option.label])}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="baccarat-main-odds mt-3">
                            {playerStatuses.slice(5).map((option, index) => {
                                const containerClass = option.label === 'Player Pair' ? 'player-pair-box-container' :
                                                     option.label === 'Player' ? 'player-box-container' :
                                                     option.label === 'Tie' ? 'tie-box-container' :
                                                     option.label === 'Banker' ? 'banker-box-container' :
                                                     'banker-pair-box-container';
                                const boxClass = option.label === 'Player Pair' ? 'player-pair-box' :
                                               option.label === 'Player' ? 'player-box' :
                                               option.label === 'Tie' ? 'tie-box' :
                                               option.label === 'Banker' ? 'banker-box' :
                                               'banker-pair-box';
                                
                                return (
                                    <div key={index} className={containerClass}>
                                        <div className={`${boxClass} ${option.status.toLowerCase()  === 'suspended-box' ? 'suspended-box' : ''}`}
                                             onClick={['Player', 'Tie', 'Banker'].includes(option.label) ?
                                                 () => openPopup('back', option.label, option.odds) :
                                                 null}>
                                            <div>{option.label}</div>
                                            <div>{option.odds}:1</div>
                                            {option.cardImages && (
                                                <div>
                                                    {option.cardImages.map((src, idx) => {
                                                        if ((index === 1 && idx === 0 && src.includes("1.png")) || (index === 3 && idx === 2 && src.includes("1.png"))) {
                                                            return null;
                                                        }
                                                        return (
                                                            <img className={` ${index === 1 && idx === 0 ? 'l-rotate' : ''} ${index === 3 && idx === 2 ? 'r-rotate' : ''}`}
                                                                key={idx} 
                                                                src={src}
                                                                alt={`${option.label} Card ${idx + 1}`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                        <div className="casino- text-center">
                                            {getExByColor(playerAmounts[option.label])}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results last-result-container">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </div>

        </CasinoLayout>
    )
        ;

};


export default Baccarat2;
