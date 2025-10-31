import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, 
    resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";


const Worli = () => {
    const [roundId, setRoundId] = useState('')
    const defaultValues = {"status": 'suspended-box', "odds": ''};
    
    const [selectedCell, setSelectedCell] = useState(null)

    const [totalPlayers, setTotalPlayers] = useState({

        SINGLE: {
            "name": Array.from({length: 11}, (_, index) => {
                let new_index =index  >= 10 ? 0 : index
                
                return new_index + " Single"
            }),
            ...defaultValues
        },

        LINE: {
            "name": ["Line 1 Single", "Line 2 Single"],
            ...defaultValues
        },
        EVEN_ODD: {
            "name": ["Odd", "Even"],
            ...defaultValues
        },


    })


    // Add playerStatuses state similar to War.js
    const [playerStatuses, setPlayerStatuses] = useState({
        "0 Single": 'suspended-box',
        "1 Single": 'suspended-box',
        "2 Single": 'suspended-box',
        "3 Single": 'suspended-box',
        "4 Single": 'suspended-box',
        "5 Single": 'suspended-box',
        "6 Single": 'suspended-box',
        "7 Single": 'suspended-box',
        "8 Single": 'suspended-box',
        "9 Single": 'suspended-box',
        "Line 1": 'suspended-box',
        "Line 2": 'suspended-box',
        "Odd": 'suspended-box',
        "Even": 'suspended-box'
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
        betType,
        setBetType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    // Get user data from Redux instead of AuthContext
    const {mybetModel} = useContext(CasinoContext)
    const { getBalance } = useContext(AuthContext);

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
                const prevPlayer ={...prevState}

                const updatedPlayers = Object.entries(prevPlayer).map(([index,value], i )=> {
                    const v = {...value};
                    v.status =  data.sub[0].gstatus === 'OPEN' ? '' : 'suspended-box'
                    return [index, v];
                })
                return Object.fromEntries(updatedPlayers);


            })

            // Update playerStatuses based on data.sub
            if (data.sub && data.sub.length > 0) {
                const gameStatus = data.sub[0].gstatus === 'OPEN' ? '' : 'suspended-box';
                
                setPlayerStatuses(prev => {
                    const updated = { ...prev };
                    Object.keys(updated).forEach(key => {
                        updated[key] = gameStatus;
                    });
                    return updated;
                });
            }
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
    
    

    const openPopup = (isBakOrLay, teamnam, oddvalue, cellId) => {
        // React way: Use state instead of DOM manipulation
        setSelectedCell(cellId);
        
        
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

    // Helper function to find data in data.sub for Worli
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Worli, find the item by nat field
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
        const betData = {
            sportList,
            roundId,
            backOrLay,
            teamname,
            odds,
            profit,
            loss,
            betType: "SINGLE",
            stakeValue,
            match_id,
            roundIdSaved,
            totalPlayers: totalPlayers['SINGLE'],
            playerStatuses, // Add playerStatuses to betData
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
                
                // React way: Clear selection using state
                setSelectedCell(null);
                
            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
            <div className="video-overlay">
                    <div className="casino-video-cards">
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
        <CasinoLayout raceClass="worli" hideRules={true} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname}
                      handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>


            <div className="casino-table">
                <div className="tab-content">
                    <div role="tabpanel" id="worli-tabs-tabpane-single" aria-labelledby="worli-tabs-tab-single" className="fade single tab-pane active show">
                        <div className={`worlibox ${totalPlayers['SINGLE'].status}`}>
                            <div className="worli-left">
                                <div className="worli-box-title"><b>9.5</b></div>
                                <div className="worli-box-row">
                                    {totalPlayers['SINGLE'].name.slice(1, 6).map((value, index) => {
                                        const cellId = `single-${index + 1}`;
                                        const new_index = index  >= 9 ? 0 : index + 1
                                        return (
                                            <div
                                                key={index}
                                                className={`worli-odd-box back cursor-pointer ${selectedCell === cellId ? 'selected' : ''}`}
                                                onClick={() => openPopup('back', value, 9.5, cellId)}
                                            >
                                                <span className="worli-odd">{new_index}</span>
                                                <div className="casino-nation-book text-danger">
                                                    {getExByColor(totalPlayers['SINGLE'].amounts?.[value] || '')}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="worli-box-row">
                                    {totalPlayers['SINGLE'].name.slice(6, 11).map((value, index) => {
                                        const cellId = `single-${index + 6}`;
                                        const new_index = index  >= 4 ? 0 : index + 6
                                        return (
                                            <div
                                                key={index + 6}
                                                className={`worli-odd-box back cursor-pointer ${selectedCell === cellId ? 'selected' : ''}`}
                                                onClick={() => openPopup('back', value, 9.5, cellId)}
                                            >
                                                <span className="worli-odd">{new_index}</span>
                                                <div className="casino-nation-book text-danger">
                                                    {getExByColor(totalPlayers['SINGLE'].amounts?.[value] || '')}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="worli-right">
                                <div className="worli-box-title"><b>9.5</b></div>
                                <div className="worli-box-row">
                                    <div 
                                        className={`worli-odd-box back cursor-pointer ${selectedCell === 'line1' ? 'selected' : ''}`}
                                        onClick={() => openPopup('back', 'Line 1', 9.5, 'line1')}>
                                        <span className="worli-odd">Line 1</span>
                                        <span className="d-block">1|2|3|4|5</span>
                                        <div className="casino-nation-book text-danger">
                                            
                                        </div>
                                    </div>
                                    <div 
                                        className={`worli-odd-box back cursor-pointer ${selectedCell === 'odd' ? 'selected' : ''}`}
                                        onClick={() => openPopup('back', 'Odd', 9.5, 'odd')}>
                                        <span className="worli-odd">ODD</span>
                                        <span className="d-block">1|3|5|7|9</span>
                                        <div className="casino-nation-book text-danger">
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="worli-box-row">
                                    <div 
                                        className={`worli-odd-box back cursor-pointer ${selectedCell === 'line2' ? 'selected' : ''}`}
                                        onClick={() => openPopup('back', 'Line 2', 9.5, 'line2')}>
                                        <span className="worli-odd">Line 2</span>
                                        <span className="d-block">6|7|8|9|0</span>
                                        <div className="casino-nation-book text-danger">
                                            
                                        </div>
                                    </div>
                                    <div 
                                        className={`worli-odd-box back cursor-pointer ${selectedCell === 'even' ? 'selected' : ''}`}
                                        onClick={() => openPopup('back', 'Even', 9.5, 'even')}>
                                        <span className="worli-odd">EVEN</span>
                                        <span className="d-block">2|4|6|8|0</span>
                                        <div className="casino-nation-book text-danger">
                                            
                                        </div>
                                    </div>
                                </div>
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


        </CasinoLayout>
    );

};

export default Worli;
