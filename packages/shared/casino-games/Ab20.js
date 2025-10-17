import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";

import { CasinoLastResult } from "../components/casino/CasinoLastResult";
import axiosFetch, {
    cardMap, getExByColor,
    resetBetFields, placeCasinoBet
} from "../utils/Constants";
import { SportsContext } from "../contexts/SportsContext";
import { AuthContext } from "../contexts/AuthContext";

import Notify from "../utils/Notify";
import { CasinoContext } from "../contexts/CasinoContext";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AndarBaharVideoCards from "../components/casino/AndarBaharVideoCards";

const Ab20 = () => {
    const [roundId, setRoundId] = useState('')
    const hideRules = true;

    const { getAndarBaharCalculation } = useContext(CasinoContext)


    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)


    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})

    const defaultCards = Array.from({ length: 13 }, (_, array) => {
        array = 0;
        return "/img/card/" + array + ".jpg";

    })

    const andarBaharCards = defaultCards

    const [enableOnclick, setEnableOnclick] = useState(false)

    const [playerStatuses, setPlayerStatuses] = useState({});

    const [totalPlayers, setTotalPlayers] = useState([
        {
            Andar: {
                cards: andarBaharCards, status: '', odds : 2, amounts: Object.fromEntries(Array.from({ length: 13 }, (_, index) => {
                    return ["Andar " + cardMap(index), ''];
                }))

            }
        },
        {
            Bahar: {
                cards: andarBaharCards, status: '', odds : 2, amounts: Object.fromEntries(Array.from({ length: 13 }, (_, index) => {
                    return ["Bahar " + cardMap(index), ''];
                }))
            }
        }

    ])


    const {
        setBetType,
        betType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)

    const [hideLoading, setHideLoading] = useState(true)


    const [data, setData] = useState([]);

    const remark = useRef('');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {

        if (data?.sub) {
            // Update playerStatuses dynamically for each player individually
            const newPlayerStatuses = {};
            
            // Update status for each player based on their individual status from data.sub
            data.sub.forEach(item => {
                const playerStatus = item.gstatus === 'OPEN' ? '' : 'suspended-box';
                newPlayerStatuses[item.nat] = playerStatus;
            });
            
            setPlayerStatuses(newPlayerStatuses);
        }


    }, [data?.sub]);

    useEffect(() => {
        if (data?.remark) {
            remark.current = data.remark || 'Welcome';
        }
    }, [data?.remark]);


    useEffect(() => {
        if (data?.card) {
            processData(data)
        }
    }, [data]);   

    const exposure = localStorage.getItem('exposure');
    const sportLength = Object.keys(data).length;
    const processData = (d_data) => {

        let card_change = false;
        const defaultCardsChange = Array.from({ length: 13 }, (_, array) => {
            array += 1;
            return "/img/card/" + array + ".jpg";

        })


        const cardSet1 = d_data?.card
        const cardsArray = cardSet1.split(','); // Explode the string into an array

        const allAreOnes = cardsArray.every(value => value === '1' || value === 1); // Check if all values are '1'


        if (allAreOnes) {

            card_change = false;
            if (enableOnclick === false)
                setEnableOnclick(true)

            if(parseInt(data.lt) <= 3){
                
            
            
                setTotalPlayers((prevState) => {

                    const changeState = [...prevState];

                    changeState.forEach((value, index) => {
                        const akeys = Object.keys(value)[0]
                        // Get odds from API data instead of hardcoded 2
                        let currentOdds = 2; // fallback
                        if (data?.sub) {
                            const items = data.sub.filter(item => item.nat.includes(akeys));
                            if (items.length > 0) {
                                currentOdds = items[0].b;
                            }
                        }
                        
                        changeState[index][akeys] = {
                            ...changeState[index][akeys],
                            status: 'suspended-box',
                            odds: currentOdds

                        }

                    })


                    return changeState;
                })
            }
            


        } else {
            card_change = true;

            if (enableOnclick === true) {

                setEnableOnclick(false)

                setTotalPlayers((prevState) => {

                    const changeState = [...prevState];

                    changeState.forEach((value, index) => {
                        const akeys = Object.keys(value)[0]
                        changeState[index][akeys] = {
                            ...changeState[index][akeys],
                            status: ''

                        }

                    })


                    return changeState;
                })
            }
        }

        const img_ar = card_change === true ? defaultCards.slice() : defaultCardsChange.slice(), post_ar = {},
            post_br = {};
        const img_br = card_change === true ? defaultCards.slice() : defaultCardsChange.slice()


        const setCardImages = (img_obj, post_obj, keyPrefix, cardSet, offset = 0) => {


            const cards = cardSet.split(',').filter(Boolean);

            cards.forEach((value, key) => {

                if (offset === 20) {
                    value -= 20;
                }
                if (value === -20) {
                    value = 0;
                }


                let img_src = `/img/card/${value}.jpg`;
                img_obj[key] = img_src;
                post_obj[key] = img_src;
            });
        };

        if (d_data?.aall && d_data?.card) {
            [...Array(13)].forEach((_, i) => {
                img_ar[i] = img_br[i] = import.meta.env.VITE_CARD_PATH + '1.png';
            });

            if (d_data?.ares) setCardImages(img_ar, post_ar, 'Andar', d_data.ares);
            if (d_data?.bres) setCardImages(img_br, post_br, 'Bahar', d_data.bres, 20);
        }

        setTotalPlayers((prevState) => {
            const updatedPlayers = [...prevState];
            updatedPlayers[0]['Andar'].cards = img_ar;
            updatedPlayers[1]['Bahar'].cards = img_br;
            return updatedPlayers;
        });

        if ((Object.keys(post_ar).length || Object.keys(post_br).length) && roundId) {
            const data = {
                round_id: roundId,
                andar: JSON.stringify(post_ar),
                bahar: JSON.stringify(post_br),
            };

           
        }
    };


    // Example usage of asset function to simulate PHP asset path


    useEffect(() => {

        if (data?.sub && sportList?.id) {

            getAndarBaharCalculation(sportList.id, roundId, 'ab20', setTotalPlayers);

        }
    }, [exposure, sportLength, roundId, mybetModel.length]);


    const openPopup = (isBakOrLay, teamnam, oddvalue, bet) => {
        setBetType(bet)


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

    // Helper function to find data in data.sub for Ab20
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For Ab20, find the item by nat field
        // teamName could be like "Andar A", "Bahar 2", etc.
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

    const placeBet = async () => {
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
            match_id: 'ab20',
            roundIdSaved,
            totalPlayers: totalPlayers[0]['Andar'],
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
                getAndarBaharCalculation(sportList.id, roundId, 'ab20', setTotalPlayers);
            }
        });

        return success;
    }

    const renderVideoBox = () => {
        return (
            <div className="casino-video-cards">
            <div className="ab-cards-container">
                
                <div className="ms-4">
                    {data?.card && (
                        <AndarBaharVideoCards cards={data?.card} player="Andar" styles={{ width: "100px" }} />
                    )}
                </div>
                
                <div className="ms-4">
                    {data?.card && (
                        <AndarBaharVideoCards cards={data?.card} player="Bahar" styles={{ width: "100px" }} />
                    )}
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
        <CasinoLayout raceClass="ab" hideRules={hideRules} hideLoading={hideLoading} isBack={backOrLay} teamname={teamname}
            handleStakeChange={casinoBetDataNew} odds={odds}
            stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
            submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
            setData={setData}
            sportList={sportList}
            setSportList={setSportList} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
            getMinMaxLimits={getMinMaxLimits}>

            <div className="casino-container andar-bahar">
                <div className="casino-table">
                    <div className="casino-table-box">
                        {data?.card && totalPlayers.map((value, key) => {
                            const title = Object.keys(value)[0];
                            const status = value[title].status;
                            const odds = value[title].odds;
                            const amounts = value[title].amounts;
                            const isAndar = title === 'Andar';

                            return (
                                <div className={isAndar ? "andar-box" : "bahar-box"} key={key}>
                                    <div className="ab-title">{title.toUpperCase()}</div>
                                    <div className="ab-cards">
                                        {Object.entries(value[title]['cards']).map(([cardKey, cardValue], ii) => (
                                            <div 
                                                className="card-odd-box"
                                                onClick={enableOnclick === true ? () => openPopup('back', title + " " + cardMap(parseInt(cardKey)), odds, title.toUpperCase()) : null}
                                                key={ii}
                                            >
                                                <div className={status}>
                                                    <img src={cardValue} alt={`${title} card ${cardKey}`} />
                                                </div>
                                                <div className="casino-">
                                                    {getExByColor(amounts[title + " " + cardMap(parseInt(cardKey))])}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="casino-remark mt-1">
                        <marquee scrollamount="3">{remark.current}</marquee>
                    </div>
                </div>
                
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult sportList={sportList} lastResults={lastResult} data={data} />
                </div>
            </div>


        </CasinoLayout>
    )
        ;

};


export default Ab20;
