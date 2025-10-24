import CasinoLayout from "../components/casino/CasinoLayout";
import {React, useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    cardGenerate,
    cardMap,
    getExByColor,
    getExBySingleTeamNameCasino,
    resetBetFields, placeCasinoBet,
    exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import {useCardSelection} from "../hooks/useCardSelection";


import Notify from "../utils/Notify";

const ThreecardJ = () => {
    const [roundId, setRoundId] = useState('')

    // Redux card selection
    const {
        selectedCards,
        currentBetType,
        isSelectionComplete,
        selectCard,
        clearAllSelections,
        resetCardSelection,
        getSelectedCardsForBetType,
        getSelectedCardCount,
        isCardSelected,
        getSelectedCardsAsString,
        isBetTypeBlocked,
        canSelectInBetType
    } = useCardSelection();

    const [totalPlayers, setTotalPlayers] = useState({
        "YES": {status: "suspended-box", odds: 0, amounts: '', cards: cardGenerate()},
        "NO": {status: "suspended-box", odds: 0, amounts: '', cards: cardGenerate()}

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
        betType,
        setBetType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)
    


    const teamNames = useRef(["Player A", "Player B"])

    const [data, setData] = useState([]);
    const [playerStatuses, setPlayerStatuses] = useState({});
    const remark = useRef('');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    // Watch for selection changes to update teamname for popup - using specific card arrays for faster updates
    useEffect(() => {
        if (currentBetType && getSelectedCardCount(currentBetType) > 0) {
            teamname.current = getSelectedCardsAsString(currentBetType);
        } else {
            // Reset teamname when no cards selected or no bet type
            teamname.current = '';
        }
    }, [selectedCards[currentBetType], currentBetType, getSelectedCardCount, getSelectedCardsAsString]);

    useEffect(() => {


        if (data?.sub) {

            remark.current = data?.remark || 'Welcome';

            setTotalPlayers((prevState) => {

                const prevPlayers = Object.entries(prevState).map(([index,value], i) => {
                    const values_are = {...value}


                    values_are.odds = data?.sub[i]?.b;
                    values_are.status = data?.sub[i]?.gstatus === 'OPEN' ? '' : 'suspended-box';
                    
                    // Update playerStatuses
                    setPlayerStatuses(prev => ({
                        ...prev,
                        [index]: data?.sub[i]?.gstatus === 'OPEN' ? '' : 'suspended-box'
                    }));


                    return [index, values_are];

                })

                return Object.fromEntries(prevPlayers)


            })


        }
        if (data.card) {
            const cardArray = data.card.split(",").map(item => item.trim());
            setCards({
                playerA: cardArray.slice(0, 3),
                playerB: cardArray.slice(3, 6),
            });

        }
    }, [data]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;

    const updateAmounts = async () => {

        const pr = [await getExBySingleTeamNameCasino(sportList.id, roundId, 'YES', match_id, 'YES'), await getExBySingleTeamNameCasino(sportList.id, roundId, 'NO', match_id, 'NO')
        ]

        setTotalPlayers((prevState) => {


            const setPlayer =Object.entries(prevState).map(([index, value], key) => {


                const d = pr[key].data
                if(d){

                    value.amounts = d
                }
                else{

                    value.amounts = ''
                }


                return [index, value];



            })

            return Object.fromEntries(setPlayer)
        })






    }


    useEffect(() => {

        if (data?.sub && sportList?.id) {


            updateAmounts()

        }
    }, [exposure, sportLength, roundId, mybetModel.length]);


    const openPopup = (isBakOrLay, teamnam, oddvalue, betType) => {
        setBetType(betType);

        const cardValue = cardMap(teamnam, false);

        // Check if this bet type is blocked (user already selecting in other bet type)
        if (isBetTypeBlocked(betType)) {
            return;
        }

        // Check if card is already selected to avoid duplicates
        if (isCardSelected(betType, cardValue)) {
            return;
        }

        // Check if we already have 3 cards selected
        if (getSelectedCardCount(betType) >= 3) {
            return;
        }

        // Select the card using Redux
        selectCard(betType, cardValue);

        // Update teamname immediately for instant display
        const currentSelection = getSelectedCardsForBetType(betType);
        const newSelection = [...currentSelection, cardValue];
        teamname.current = newSelection.join(' ');

        

        // Open popup immediately after card selection
        if (parseFloat(oddvalue) > 0) {
            roundIdSaved.current = roundId;
            setbackOrLay(isBakOrLay);
            setPopupDisplayForDesktop(true);
            setOdds(oddvalue);
        } else {
            Notify("Odds Value Change Bet Not Confirm", null, null, 'danger');
            resetCardSelection();
        }

        console.log(`Selected ${cardValue} for ${betType}. Count will be: ${getSelectedCardCount(betType) + 1}`);
    }

    // Helper function to find data in data.sub for ThreecardJ
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For ThreecardJ, find the item by nat field
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
        // Check if 3 cards are selected before placing bet
        if (!isSelectionComplete) {
            Notify(`Please select 3 cards for ${currentBetType} to place bet`, null, null, 'warning');
            return false;
        }

        const betData = {
            sportList,
            roundId,
            backOrLay,
            teamname,
            odds,
            profit: betType === 'NO' ? loss : profit,
            loss,
            betType,
            stakeValue,
            match_id,
            roundIdSaved,
            totalPlayers: totalPlayers['YES'],
            playerStatuses: playerStatuses,
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
                clearAllSelections();
                resetCardSelection();
                
            },
            onError: (error) => {
                resetCardSelection();
                
            }
        });

        // If bet failed, reset card selection
        if (!success) {
            resetCardSelection();
        }

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
        <>
            
            <CasinoLayout  hideRules={true} raceClass="threecardj" hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                          stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                          submitButtonDisable={submitButtonDisable || !isSelectionComplete} data={data} roundId={roundId} setRoundId={setRoundId}
                          getMinMaxLimits={getMinMaxLimits}
                          sportList={sportList} 
                          setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}>


            <div className="casino-table">
                {Object.entries(totalPlayers).map(([yes,value], index) => {

                    const selectedKey = yes;

                    return (
                        <div key={index} className={`threecardjbox ${index === 0 ? 'back' : 'lay'} ${value.status}`}>
                            <div className="threecard-title">
                                {selectedKey}
                                <div className="casino-odds">{getExByColor(value.amounts)}</div>
                            </div>
                            <div className="threecardj-cards">
                                <h4 className="text-center w-100 mb-2">
                                    <b>{value.odds}</b>
                                </h4>
                                {value.cards.map((value1, index1) => {
                                    return (
                                        <div key={index1} className="card-odd-box"
                                              onClick={() => openPopup(index === 0 ? 'back': 'lay', value1[0], value.odds, selectedKey)}>
                                            <div className="">
                                                <img src={value1[1]} style={
                                                    isCardSelected(cardMap(selectedKey, false), cardMap(value1[0], false)) ?
                                                        {width: '33px', height: '40px', border: "1px solid var(--bg-success)"}
                                                        :
                                                        {width: '33px', height: '40px'}
                                                } alt="Card"/>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
                <div className="casino-remark mt-1">
                    <marquee scrollamount="3">{remark.current}</marquee>
                </div>
            </div>

            <div className="casino-last-result-title">
                <span>Last Result</span>
            </div>
            <div className="casino-last-results">
                <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data}/>
            </div>

        </CasinoLayout>
        </>
    );

};

export default ThreecardJ;
