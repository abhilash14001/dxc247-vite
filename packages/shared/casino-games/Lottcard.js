import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";
import {CasinoLastResult} from "../components/casino/CasinoLastResult";
import axiosFetch, {
    getExByTeamNameForCasino, resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import Notify from "../utils/Notify";

const Lottcard = () => {
    const [roundId, setRoundId] = useState('');
    const roundIdSaved = useRef(null);
    const [submitButtonDisable, setSubmitButtonDisable] = useState(false);
    const [cards, setCards] = useState({});
    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0);
    const [backOrLay, setbackOrLay] = useState('back');
    const [sportList, setSportList] = useState({});
    const {match_id} = useParams();
    const {
        betType,
        setBetType,
        setPopupDisplayForDesktop,
    } = useContext(SportsContext);
    const {getBalance} = useContext(AuthContext);
    const [hideLoading, setHideLoading] = useState(true);
    
    // Lottery specific state
    const [activeTab, setActiveTab] = useState('single');
    const [selectedCards, setSelectedCards] = useState([]);
    const [randomBetAmount, setRandomBetAmount] = useState(0);
    
    const teamNames = useRef(["Single", "Double", "tripple"]);
    const [data, setData] = useState([]);
    const [playerA, setPlayerA] = useState(0);
    const [playerStatuses, setPlayerStatuses] = useState({ "Single": '', "Double": '', "tripple": '' });
    const [playerA_Back, setPlayerA_Back] = useState(0);
    const [playerB_Back, setPlayerB_Back] = useState(0);
    const [playerC_Back, setPlayerC_Back] = useState(0);
    const [playerA_Lay, setPlayerA_Lay] = useState(0);
    const [playerB_Lay, setPlayerB_Lay] = useState(0);
    const [playerC_Lay, setPlayerC_Lay] = useState(0);
    const [playerB, setPlayerB] = useState(0);
    const [playerC, setPlayerC] = useState(0);
    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);

    // Card data for lottery
    const cardNumbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const randomBetAmounts = [5, 10, 15, 20, 25, 50, 75, 100];

    useEffect(() => {
        setBetType('BOOKMAKER');
        if (data?.sub) {
            updatePlayerStats(data.sub[0], setPlayerA_Back, setPlayerA_Lay, "Single");
            updatePlayerStats(data.sub[1], setPlayerB_Back, setPlayerB_Lay, "Double");
            updatePlayerStats(data.sub[2], setPlayerC_Back, setPlayerC_Lay, "tripple");
        }
        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                single: cardArray.slice(0, 1), // Single card
                double: cardArray.slice(0, 2), // Double cards
                tripple: cardArray.slice(0, 3), // tripple cards
            });
            remark.current = data.remark || 'Welcome';
        }
    }, [data]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;

    useEffect(() => {
        if (data?.sub && sportList?.id) {
            getExByTeamNameForCasino(sportList.id, data.mid, 'Single', match_id).then(res => setPlayerA(res.data));
            getExByTeamNameForCasino(sportList.id, data.mid, 'Double', match_id).then(res => setPlayerB(res.data));
            getExByTeamNameForCasino(sportList.id, data.mid, 'tripple', match_id).then(res => setPlayerC(res.data));
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
            roundIdSaved.current = roundId;
            setbackOrLay(isBakOrLay);
            setPopupDisplayForDesktop(true);
            teamname.current = teamnam;
            setOdds(oddvalue);
        } else {
            Notify("Odds Value Change Bet Not Confirm", null, null, 'danger');
        }
    };

    // Helper function to find data in data.sub for Lottcard
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;
        return data.sub.find(item => item.nat === teamName);
    };

    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds;
        if (backOrLay === 'back') {
            loss.current = stakeValue.current.value;
            profit.current = profitData.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2);
        } else {
            profit.current = profitData.current = stakeValue.current.value;
            loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(2);
        }
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
            betType: "BOOKMAKER",
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
                //  is already handled by placeCasinoBet
            }
        });

        return success;
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

    // Function to get local card image URL with fallback
    const getCardImageUrl = (cardName, section = false) => {
        if (!cardName) return '/img/casino/cards/1.png';
        
        // Try local path first
        const localUrl = `/img/casino/cards/${cardName}.${section ? 'jpg' : 'png'}`;
        return localUrl;
    };

    // Function to handle image load error and download from external source
    const handleImageError = (cardName, event) => {
        const img = event.target;
        const externalUrl = `https://g1ver.sprintstaticdata.com/v69/static/front/img/cards/${cardName}.jpg`;
        
        // Set external URL as fallback
        img.src = externalUrl;
        
        // Download and cache the image for future use
        const downloadImage = async () => {
            try {
                const response = await fetch(externalUrl);
                if (response.ok) {
                    const blob = await response.blob();
                    // In a real implementation, you would save this to your local storage
                    // For now, we just use the external URL
                }
            } catch (error) {
                console.error(`Failed to download image for card: ${cardName}`, error);
            }
        };
        
        downloadImage();
    };

    const renderVideoBox = () => {
        // Show the current result cards from API
        const currentCards = data.card ? data.card.split(",").map(item => item.trim()) : [];
        
        return (
            <div className="casino-video-cards">
                {currentCards.length > 0 ? (
                    <>
                        {currentCards.map((card, index) => (
                            <div key={index} className={index > 0 ? "mt-1" : ""}>
                                <div className="flip-card-container">
                                    <div className="flip-card">
                                        <div className="flip-card-inner">
                                            <div className="flip-card-front">
                                                <img 
                                                    src={getCardImageUrl(card)} 
                                                    alt={`Card ${index + 1}`}
                                                    onError={(e) => handleImageError(card, e)}
                                                />
                                            </div>
                                            <div className="flip-card-back">
                                                <img 
                                                    src={getCardImageUrl(card)} 
                                                    alt={`Card ${index + 1}`}
                                                    onError={(e) => handleImageError(card, e)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    // Show default cards when no API data
                    <>
                        {['1', '1', '1'].map((card, index) => (
                            <div key={index} className={index > 0 ? "mt-1" : ""}>
                                <div className="flip-card-container">
                                    <div className="flip-card">
                                        <div className="flip-card-inner">
                                            <div className="flip-card-front">
                                                <img 
                                                    src={getCardImageUrl(card)} 
                                                    alt={`Card ${index + 1}`}
                                                    onError={(e) => handleImageError(card, e)}
                                                />
                                            </div>
                                            <div className="flip-card-back">
                                                <img 
                                                    src={getCardImageUrl(card)} 
                                                    alt={`Card ${index + 1}`}
                                                    onError={(e) => handleImageError(card, e)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        )
    };

    // Handle card selection
    const handleCardClick = (cardNumber) => {
        if (activeTab === 'single') {
            setSelectedCards([cardNumber]);
        } else if (activeTab === 'double') {
            if (selectedCards.length < 2) {
                setSelectedCards([...selectedCards, cardNumber]);
            } else {
                setSelectedCards([cardNumber]);
            }
        } else if (activeTab === 'tripple') {
            if (selectedCards.length < 3) {
                setSelectedCards([...selectedCards, cardNumber]);
            } else {
                setSelectedCards([cardNumber]);
            }
        }
    };

    // Handle random bet amount selection
    const handleRandomBetClick = (amount) => {
        setRandomBetAmount(amount);
    };

    // Clear selected cards
    const clearSelection = () => {
        setSelectedCards([]);
    };

    // Repeat last selection
    const repeatSelection = () => {
        // Implementation for repeating last selection
    };

    // Remove last selection
    const removeLastSelection = () => {
        if (selectedCards.length > 0) {
            setSelectedCards(selectedCards.slice(0, -1));
        }
    };

    return (
        <CasinoLayout 
            hideLoading={hideLoading} 
            isBack={backOrLay} 
            teamname={teamname} 
            handleStakeChange={casinoBetDataNew} 
            odds={odds}
            stakeValue={stakeValue} 
            setOdds={setOdds} 
            placeBet={placeBet}
            submitButtonDisable={submitButtonDisable} 
            data={data} 
            roundId={roundId} 
            setRoundId={setRoundId}
            sportList={sportList}
            setSportList={setSportList} 
            setData={setData} 
            setLastResult={setLastResult} 
            virtualVideoCards={renderVideoBox}
            getMinMaxLimits={getMinMaxLimits}
            raceClass="lottery"
        >
            
                <div className="casino-table">
                    <div className="nav nav-pills" role="tablist">
                        <div className="nav-item">
                            <a 
                                role="tab" 
                                data-rr-ui-event-key="single" 
                                id="lottery-tabs-tab-single" 
                                aria-controls="lottery-tabs-tabpane-single" 
                                aria-selected={activeTab === 'single'} 
                                className={`nav-link ${activeTab === 'single' ? 'active' : ''}`} 
                                tabIndex="0" 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); setActiveTab('single'); }}
                            >
                                Single ({selectedCards.length})
                            </a>
                        </div>
                        <div className="nav-item">
                            <a 
                                role="tab" 
                                data-rr-ui-event-key="double" 
                                id="lottery-tabs-tab-double" 
                                aria-controls="lottery-tabs-tabpane-double" 
                                aria-selected={activeTab === 'double'} 
                                className={`nav-link ${activeTab === 'double' ? 'active' : ''}`} 
                                tabIndex="-1" 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); setActiveTab('double'); }}
                            >
                                Double ({selectedCards.length})
                            </a>
                        </div>
                        <div className="nav-item">
                            <a 
                                role="tab" 
                                data-rr-ui-event-key="tripple" 
                                id="lottery-tabs-tab-tripple" 
                                aria-controls="lottery-tabs-tabpane-tripple" 
                                aria-selected={activeTab === 'tripple'} 
                                className={`nav-link ${activeTab === 'tripple' ? 'active' : ''}`} 
                                tabIndex="-1" 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); setActiveTab('tripple'); }}
                            >
                                tripple ({selectedCards.length})
                            </a>
                        </div>
                    </div>
                    
                    <div className="w-100 tab-content">
                        <div 
                            role="tabpanel" 
                            id="lottery-tabs-tabpane-single" 
                            aria-labelledby="lottery-tabs-tab-single" 
                            className={`fade tab-pane ${activeTab === 'single' ? 'active show' : ''}`}
                        >
                            <div className="single suspended-box">
                                <div className="lottery-box">
                                    {cardNumbers.map((cardNumber, index) => (
                                        <div 
                                            key={index}
                                            className={`lottery-card ${selectedCards.includes(cardNumber) ? 'selected' : ''}`}
                                            onClick={() => handleCardClick(cardNumber)}
                                        >
                                            <img 
                                                src={getCardImageUrl(cardNumber, true)} 
                                                alt={cardNumber}
                                                onError={(e) => handleImageError(cardNumber, e)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            role="tabpanel" 
                            id="lottery-tabs-tabpane-double" 
                            aria-labelledby="lottery-tabs-tab-double" 
                            className={`fade tab-pane ${activeTab === 'double' ? 'active show' : ''}`}
                        >
                            <div className="double suspended-box">
                                <div className="lottery-box">
                                    {cardNumbers.map((cardNumber, index) => (
                                        <div 
                                            key={index}
                                            className={`lottery-card ${selectedCards.includes(cardNumber) ? 'selected' : ''}`}
                                            onClick={() => handleCardClick(cardNumber)}
                                        >
                                            <img 
                                                src={getCardImageUrl(cardNumber, true)} 
                                                alt={cardNumber}
                                                onError={(e) => handleImageError(cardNumber, e)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="random-bets">
                                    <h4 className="w-100 text-center mb-1">Random Bets</h4>
                                    {randomBetAmounts.slice(0, 7).map((amount, index) => (
                                        <button 
                                            key={index}
                                            className="lottery-btn active"
                                            onClick={() => handleRandomBetClick(amount)}
                                        >
                                            {amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            role="tabpanel" 
                            id="lottery-tabs-tabpane-tripple" 
                            aria-labelledby="lottery-tabs-tab-tripple" 
                            className={`fade tab-pane ${activeTab === 'tripple' ? 'active show' : ''}`}
                        >
                            <div className="tripple suspended-box">
                                <div className="lottery-box">
                                    {cardNumbers.map((cardNumber, index) => (
                                        <div 
                                            key={index}
                                            className={`lottery-card ${selectedCards.includes(cardNumber) ? 'selected' : ''}`}
                                            onClick={() => handleCardClick(cardNumber)}
                                        >
                                            <img 
                                                src={getCardImageUrl(cardNumber, true)} 
                                                alt={cardNumber}
                                                onError={(e) => handleImageError(cardNumber, e)}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="random-bets">
                                    <h4 className="w-100 text-center mb-1">Random Bets</h4>
                                    {randomBetAmounts.filter(amount => amount !== 75).map((amount, index) => (
                                        <button 
                                            key={index}
                                            className="lottery-btn active"
                                            onClick={() => handleRandomBetClick(amount)}
                                        >
                                            {amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lottery-buttons d-xl-none">
                        <button className="btn btn-lottery" onClick={repeatSelection}>Repeat</button>
                        <button className="btn btn-lottery" onClick={clearSelection}>Clear</button>
                        <button className="btn btn-lottery" onClick={removeLastSelection}>Remove</button>
                    </div>
                </div>
                
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                    <span><a href="/casino-results/lottcard">View All</a></span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            
        </CasinoLayout>
    );
};

export default Lottcard;
