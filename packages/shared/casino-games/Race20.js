import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";
import {
    cardPointsCount,
    getExByColor,
    getExByTeamNameForCasino,
    resetBetFields,
    placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import Notify from "../utils/Notify";

// Constants
const ruleImage = '/img/rules/race20.jpg';
const DEFAULT_STATUS_AMOUNT = { status: "suspended-box", amounts: "" };
const DEFAULT_VALUES_WITH_BACK_AND_LAY = { 
    odds: { back: 0, lay: 0, bs: 10000, ls: 10000 }, 
    ...DEFAULT_STATUS_AMOUNT 
};
const DEFAULT_VALUES_WITH_BACK = { 
    odds: { back: 0 }, 
    ...DEFAULT_STATUS_AMOUNT 
};

const CARD_SUITS = ['spade', 'heart', 'club', 'diamond'];
const TEAM_NAMES = ["Player A", "Player B"];

// Image utility functions with fallback support
const imageCache = new Map();

const checkImageExists = async (url) => {
    if (imageCache.has(url)) {
        return imageCache.get(url);
    }
    
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            imageCache.set(url, true);
            resolve(true);
        };
        img.onerror = () => {
            imageCache.set(url, false);
            resolve(false);
        };
        img.src = url;
    });
};

const getCardImage = (cardName) => {
    // Available local cards based on directory listing
    const localPath = `/img/casino/cards/${cardName}.png`;
    const externalPath = `/img/casino/cards/${cardName}.png`;
    
    // Since we confirmed local cards exist, use local first
    return localPath;
};

const getSuitIcon = (suit) => {
    const suitIcons = {
        'spade': 'spade.png',
        'heart': 'heart.png', 
        'club': 'club.png',
        'diamond': 'diamond.png'
    };
    
    // Since we confirmed local suit icons exist, use local first
    const localPath = `/img/casino/cards/${suitIcons[suit]}`;
    return localPath;
};

// Enhanced image component with fallback (moved inside component to use hooks)
const useImageWithFallback = (src, fallbackSrc) => {
    const [imgSrc, setImgSrc] = useState(src);
    
    const handleError = () => {
        if (imgSrc !== fallbackSrc && fallbackSrc) {
            setImgSrc(fallbackSrc);
        }
    };
    
    return { imgSrc, handleError };
};

// Card mapping for main odds table
const getCardImageName = (playerName) => {
    const cardMap = {
        'K of spade': 'KSS',
        'K of heart': 'KHH',
        'K of club': 'KCC',
        'K of diamond': 'KDD'
    };
    return cardMap[playerName] || 'KSS';
};

const Race20 = () => {
    // State Management
    const [roundId, setRoundId] = useState('');
    const [cardsPoint, setCardsPoint] = useState(0);

    const [totalPlayers, setTotalPlayers] = useState({
        'K of spade': { 
            ...DEFAULT_VALUES_WITH_BACK_AND_LAY, 
            "img": getCardImage("KSS")
        },
        'K of heart': { 
            ...DEFAULT_VALUES_WITH_BACK_AND_LAY, 
            "img": getCardImage("KHH")
        },
        'K of club': { 
            ...DEFAULT_VALUES_WITH_BACK_AND_LAY, 
            "img": getCardImage("KCC")
        },
        'K of diamond': { 
            ...DEFAULT_VALUES_WITH_BACK_AND_LAY, 
            "img": getCardImage("KDD")
        },
        'Total points': DEFAULT_VALUES_WITH_BACK_AND_LAY,
        'Total cards': DEFAULT_VALUES_WITH_BACK_AND_LAY,
        'Win with 5': DEFAULT_VALUES_WITH_BACK,
        'Win with 6': DEFAULT_VALUES_WITH_BACK,
        'Win with 7': DEFAULT_VALUES_WITH_BACK,
        'Win with 15': DEFAULT_VALUES_WITH_BACK,
        'Win with 16': DEFAULT_VALUES_WITH_BACK,
        'Win with 17': DEFAULT_VALUES_WITH_BACK,
    });


    const [cards, setCards] = useState({});
    const [cardLength, setCardLength] = useState(0);
    const [odds, setOdds] = useState(0);
    const [backOrLay, setbackOrLay] = useState('back');
    const [sportList, setSportList] = useState({});
    const [submitButtonDisable, setSubmitButtonDisable] = useState(false);
    const [hideLoading, setHideLoading] = useState(true);
    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({});
    const [lastResult, setLastResult] = useState({});
    
    // Refs
    const roundIdSaved = useRef(null);
    const stakeValue = useRef(0);
    const teamNames = useRef(TEAM_NAMES);
    const remark = useRef('Welcome');
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);
    
    // Hooks
    const { match_id } = useParams();
    const { betType, setBetType, setPopupDisplayForDesktop } = useContext(SportsContext);
    const { getBalance } = useContext(AuthContext);
    // Utility Functions
    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };
    
    const winChunk = chunkArray(Object.entries(totalPlayers).slice(6, 12), 2);


    const updateAmounts = async () => {


        const promises = Object.entries(totalPlayers).slice(0, 4).map(([index, value]) => {
            return getExByTeamNameForCasino(sportList.id, roundId, index, match_id, 'ODDS')
        })
        const all_promises = await Promise.all(promises)

        setTotalPlayers((prevState) => {

            const updatedPlayers = JSON.parse(JSON.stringify(prevState))

            Object.entries(updatedPlayers).slice(0, 4).forEach(([index, value], i) => {

                updatedPlayers[index].amounts = all_promises[i].data || ''

            })


            return updatedPlayers

        })
    }


    const updatePlayers = () => {

        setTotalPlayers((prevState) => {

            const updatedPlayers = JSON.parse(JSON.stringify(prevState))


            Object.entries(updatedPlayers).forEach(([index, value]) => {

                const fdata = data.sub.find(item => item.nat === index)


                if (fdata) {

                    updatedPlayers[index].odds.back = fdata.b
                    updatedPlayers[index].odds.lay = fdata.l
                    updatedPlayers[index].status = fdata.gstatus === 'OPEN' ? "" : 'suspended-box'
                    updatedPlayers[index].odds.bs = ['Total points', 'Total cards'].includes(index) ? 100 : 10000
                    updatedPlayers[index].odds.ls = ['Total points', 'Total cards'].includes(index) ? 100 : 10000

                }


            })

            return updatedPlayers

        })


    }


    useEffect(() => {


        if (data?.sub) {

            updatePlayers();

            // Update playerStatuses dynamically for each player individually
            const newPlayerStatuses = {...playerStatuses};

            
            // Update status for each player based on their individual status from data.sub
            data.sub.forEach(item => {
                const playerStatus = item.gstatus === 'OPEN' ? '' : 'suspended-box';
                newPlayerStatuses[item.nat] = playerStatus;
            });

            

            setPlayerStatuses(newPlayerStatuses);
        }

       
    }, [data?.sub]);

    useEffect(() => {
        if (data.card) {
            const cardArray = data.card.split(",");


            setCards({
                spade: (function () {
                    const spadeArray = cardArray.filter(item => item.includes("SS"));
                    return spadeArray.length > 0 ? [...spadeArray, "KSS"] : spadeArray;
                })(),
                heart: (function () {
                    const spadeArray = cardArray.filter(item => item.includes("HH"));
                    return spadeArray.length > 0 ? [...spadeArray, "KHH"] : spadeArray;
                })(),
                club: (function () {
                    const spadeArray = cardArray.filter(item => item.includes("CC"));
                    return spadeArray.length > 0 ? [...spadeArray, "KCC"] : spadeArray;
                })(),
                diamond: (function () {
                    const spadeArray = cardArray.filter(item => item.includes("DD"));
                    return spadeArray.length > 0 ? [...spadeArray, "KDD"] : spadeArray;
                })()
            });

            remark.current = data.remark || 'Welcome';
        }
    }, [data?.card]);

    useEffect(() => {


        setCardLength(
            Math.max(
                parseInt(cards?.spade?.length || 0, 10) - 1,
                0
            ) +
            Math.max(
                parseInt(cards?.club?.length || 0, 10) - 1,
                0
            ) +
            Math.max(
                parseInt(cards?.heart?.length || 0, 10) - 1,
                0
            ) +
            Math.max(
                parseInt(cards?.diamond?.length || 0, 10) - 1,
                0
            )
        );


        setCardsPoint(cardPointsCount("K", cards?.spade) + cardPointsCount("K", cards?.club) + cardPointsCount("K", cards?.heart) + cardPointsCount("K", cards?.diamond))


    }, [cards]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            updateAmounts()
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

    // Helper function to find data in data.sub for Race20
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Race20, find the item by nat field
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

    const renderCards = (cards, suit) => {
        return (
            <div className="mt-1" key={suit}>
                <div className="flip-card-container">
                    {/* Suit Icon */}
                    <div className="flip-card">
                        <img 
                            src={getSuitIcon(suit)} 
                            alt={suit}
                            onError={(e) => {
                                // Fallback to default card if suit icon fails
                                e.target.src = `/img/casino/cards/1.png`;
                            }}
                        />
                    </div>
                    
                    {/* Cards */}
                    {cards && Array.isArray(cards) && cards.length > 0 && cards.map((cardValue, index) => (
                        <div className="flip-card" key={index}>
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <img 
                                        src={getCardImage(cardValue)} 
                                        alt={cardValue}
                                        onError={(e) => {
                                            // Fallback to default card if card image fails
                                            e.target.src = `/img/casino/cards/1.png`;
                                        }}
                                    />
                                </div>
                                <div className="flip-card-back">
                                    <img 
                                        src={getCardImage(cardValue)} 
                                        alt={cardValue}
                                        onError={(e) => {
                                            // Fallback to default card if card image fails
                                            e.target.src = `/img/casino/cards/1.png`;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const placeBet = async () => {
        const betData = {
            sportList,
            roundId,
            backOrLay,
            teamname,
            odds,
            profit,
            loss,
            betType: "ODDS",
            stakeValue,
            match_id,
            roundIdSaved,
            totalPlayers: totalPlayers[teamname.current],
            playerStatuses, // Add playerStatuses to betData
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
        return (
            <div className="casino-video-cards">
                {/* Race Total Point Display */}
                {cardLength > 0 && (
                    <div className="race-total-point">
                        <div className="text-white">
                            <div>Cards</div>
                            <div>{cardLength}</div>
                        </div>
                        <div className="text-white">
                            <div>Points</div>
                            <div>{cardsPoint}</div>
                        </div>
                    </div>
                )}

                {/* Card Suits Display */}
                <div>
                    {CARD_SUITS.map((suit, index) => 
                        renderCards(cards[suit], suit)
                    )}
                </div>
            </div>
        );
    };

    const renderMainOddsTable = () => {
        return (
            <div className="casino-table-box">
                {Object.entries(totalPlayers).slice(0, 4).map(([index, value], i) => (
                    <div className="casino-odd-box-container" key={i}>
                        <div className="casino-nation-name">
                            <img 
                                src={getCardImage(getCardImageName(index))} 
                                alt={index}
                                onError={(e) => {
                                    // Fallback to default card if card image fails
                                    e.target.src = `/img/casino/cards/1.png`;
                                }}
                            />
                        </div>
                        <div 
                            className={`casino-odds-box back ${value.status}`}
                            onClick={() => openPopup('back', index, value.odds.back)}
                        >
                            <span className="casino-odds">{value.odds.back}</span>
                            <div className="casino-volume">{value.odds.bs}</div>
                        </div>
                        <div 
                            className={`casino-odds-box lay ${value.status}`}
                            onClick={() => openPopup('lay', index, value.odds.lay)}
                        >
                            <span className="casino-odds">{value.odds.lay}</span>
                            <div className="casino-volume">{value.odds.ls}</div>
                        </div>
                        <div className="casino-nation-book text-center w-100">
                            {getExByColor(value.amounts)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderTotalPointsAndCards = () => {
        const totalPointsAndCards = Object.entries(totalPlayers).slice(4, 6);
        
        return (
            <div className="casino-table-left-box">
                {/* Header */}
                <div className="casino-odd-box-container">
                    <div className="casino-nation-name"></div>
                    <div className="casino-nation-name">No</div>
                    <div className="casino-nation-name">Yes</div>
                </div>
                
                {totalPointsAndCards.map(([index, value], i) => (
                    <div key={i}>
                        <div className="casino-odd-box-container">
                            <div className="casino-nation-name">{index}</div>
                            <div 
                                className={`casino-odds-box lay ${value.status}`}
                                
                            >
                                <span className="casino-odds">{value.odds.back}</span>
                                <div className="casino-volume text-center">{value.odds.bs}</div>
                            </div>
                            <div 
                                className={`casino-odds-box back ${value.status}`}
                                
                            >
                                <span className="casino-odds">{value.odds.lay}</span>
                                <div className="casino-volume text-center">{value.odds.ls}</div>
                            </div>
                            <div className="casino-nation-book"></div>
                        </div>
                        {i === 0 && (
                            <div className="casino-odd-box-container">
                                <div className="casino-nation-name"></div>
                                <div className="casino-nation-name">No</div>
                                <div className="casino-nation-name">Yes</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderWinWithNumbers = () => {
        const winWithEntries = Object.entries(totalPlayers).slice(6, 12);
        
        return (
            <div className="casino-table-right-box">
                {winWithEntries.map(([index, value], i) => (
                    <div className="casino-odd-box-container" key={i}>
                        <div className="casino-nation-name">{index}</div>
                        <div className={`casino-odds-box back ${value.status}`}>
                            <span className="casino-odds">{value.odds.back}</span>
                        </div>
                        <div className="casino-nation-book text-center w-100 text-danger">
                            {getExByColor(value.amounts)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

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
        <CasinoLayout ruleImage={ruleImage} raceClass="race20" hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
            stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
            submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
            sportList={sportList}
            setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
            getMinMaxLimits={getMinMaxLimits}>

            <div className="casino-table">
                {/* Main Odds Table - Kings */}
                {renderMainOddsTable()}
                
                {/* Secondary Table - Total Points/Cards and Win With Numbers */}
                <div className="casino-table-box mt-3">
                    {renderTotalPointsAndCards()}
                    {renderWinWithNumbers()}
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

const PlayerTable = ({ playerName, playerValue, playerBack, openPopup, playerLay, playerStatus }) => (
    <div className="casino-table-left-box">
        <div className="casino-table-header">
            <div className="casino-nation-detail">{playerName}</div>
            <div className="casino-odds-box back">Back</div>
            <div className="casino-odds-box lay">Lay</div>
        </div>
        <div className={`casino-table-body`}>
            <div className={`casino-table-row ${playerStatus}`}>
                <div className="casino-nation-detail">
                    <div className="casino-nation-name">Main</div>
                    <p className="m-b-0">
                        <span className={`font-weight-bold ${playerValue >= 0 ? 'text-success' : 'text-danger'}`}>
                            {playerValue}
                        </span>
                    </p>
                </div>
                <div className="casino-odds-box back">
                    <span className="casino-odds"
                        onClick={() => openPopup('back', playerName, playerBack)}>{playerBack}</span>
                </div>
                <div className="casino-odds-box lay">
                    <span className="casino-odds"
                        onClick={() => openPopup('lay', playerName, playerLay)}>{playerLay}</span>
                </div>
            </div>
        </div>
    </div>
);

export default Race20;

