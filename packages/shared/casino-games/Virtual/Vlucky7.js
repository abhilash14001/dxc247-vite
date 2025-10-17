import CasinoLayout from "../../components/casino/CasinoLayout";
import {React, useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../../components/casino/CasinoLastResult";

import axiosFetch, {
    cardMap,
    changeCardIndex, getExByColor, getExBySingleTeamNameCasino,

    resetBetFields,

} from "../../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../../contexts/SportsContext";


import Notify from "../../utils/Notify";

const Vlucky7 = () => {
        const [roundId, setRoundId] = useState('')

        const ruleImage = '/img/rules/lucky7.jpg'
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
        .rules-section .row.row5 > [class*="col-"], .rules-section .row.row5 > [class*="col"] {
            padding-left: 5px;
            padding-right: 5px;
        }
        .rules-section
        {
            text-align: left;
            margin-bottom: 10px;
        }
        .rules-section .table
        {
            color: #fff;
            border:1px solid #444;
            background-color: #222;
            font-size: 12px;
        }
        .rules-section .table td, .rules-section .table th
        {
            border-bottom: 1px solid #444;
        }
        .rules-section ul li, .rules-section p
        {
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
        .rules-section .rules-highlight
        {
            color: #FDCF13;
            font-size: 16px;
        }
        .rules-section .rules-sub-highlight {
            color: #FDCF13;
            font-size: 14px;
        }
        .rules-section .list-style, .rules-section .list-style li
        {
            list-style: disc;
        }
        .rules-section .rule-card
        {
            height: 20px;
            margin-left: 5px;
        }
        .rules-section .card-character
        {
            font-family: Card Characters;
        }
        .rules-section .red-card
        {
            color: red;
        }
        .rules-section .black-card
        {
            color: black;
        }
        .rules-section .cards-box
        {
            background: #fff;
            padding: 6px;
            display: inline-block;
            color: #000;
            min-width: 150px;
        }
    </style>
<div className="rules-section">
	<ul className="pl-4 pr-4 list-style">
		<li>Lucky 7 is a 8 deck playing cards game, total 8 * 52 = 416 cards.</li>
		<li>If the card is from ACE to 6, LOW Wins.</li>
		<li>If the card is from 8 to KING, HIGH Wins.</li>
		<li>If the card is 7, bets on high and low will lose 50% of the bet amount.</li>
	</ul>
	<div>
		<b className="rules-sub-highlight">LOW:</b>1,2,3,4,5,6 | <b className="rules-sub-highlight">HIGH:</b>8,9,10,J,Q,K
                                            </div>
	<div>Payout:2.0</div>
	<br>
	<div>
		<b className="rules-sub-highlight">EVEN:</b>2,4,6,8,10,Q
                                            </div>
	<div>Payout:2.10</div>
	<br>
	<div>
		<b className="rules-sub-highlight">ODD:</b>1,3,5,7,9,J,K
                                            </div>
	<div>Payout:1.79</div>
	<br>
	<div>
		<b className="rules-sub-highlight">RED:</b>
	</div>
	<div>Payout:1.95</div>
	<br>
	<div>
		<b className="rules-sub-highlight">BLACK:</b>
	</div>
	<div>Payout:1.95
	  </div>
	<br>
	<b className="rules-sub-highlight">CARDS:</b>1,2,3,4,5,6,7,8,9,10,J,Q,K
<div>PAYOUT: 12.0</div>
</div> </div>`;
        const defaultValues = {amounts: '', odds: 0, status: 'suspended-box'};
        const [totalPlayers, setTotalPlayers] = useState([
            {
                ODDS: {"Low Card": defaultValues, "High Card": defaultValues}
            },
            {
                EVEN_ODD: {"Even": defaultValues, "Odd": defaultValues},
            },
            {
                RED_BLACK: {"Red": defaultValues, "Black": defaultValues},
            },

            {
                Line: Object.fromEntries(
                    Array.from({length: 4}, (_, index) => {
                        const startCardIndex = index * 3 + 1; // Calculate starting card index
                        return [
                            index + 1,
                            {
                                ...defaultValues, // Assuming `defaultValues` is an object
                                cards: Array.from({length: 3}, (_, cardIndex) => {
                                    const currentCardIndex = startCardIndex + cardIndex;
                                    const adjustedCardIndex = currentCardIndex >= 7 ? currentCardIndex + 1 : currentCardIndex; // Skip 7
                                    return `/img/card/${changeCardIndex(adjustedCardIndex)}.jpg`;
                                })
                            }
                        ];
                    })
                )
            },
            {
                CARD_SINGLE: Object.fromEntries(
                    Array.from({length: 13}, (_, index) => [
                        index + 1, // Unique key from 1 to 13
                        {
                            name: "Card " + cardMap(index),
                            img: '/img/card/' + changeCardIndex(index + 1) + ".jpg", // Card index adjusted by `changeCardIndex`
                            ...defaultValues // Assuming `defaultValues` is an object
                        }
                    ])
                )
            }

        ])



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
            setPopupDisplay,

        } = useContext(SportsContext)
        const [hideLoading, setHideLoading] = useState(true)


        const teamNames = useRef(["Player A", "Player B"])

        const [data, setData] = useState([]);

        const remark = useRef('Welcome');
        const [lastResult, setLastResult] = useState({});
        const teamname = useRef('');
        const loss = useRef(0);
        const profit = useRef(0);
        const profitData = useRef(0);
        const updateAmounts = async () => {
            const amountData = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '')


            setTotalPlayers((prevState) => {
                // Create a copy of the previous state
                const prevPlayers = prevState.map((value1) => {
                    // Create a new object to prevent mutating the state directly
                    const newValue1 = { ...value1 };

                    // Loop through each object inside totalPlayers (e.g., 'ODDS', 'LINE')
                    Object.entries(newValue1).forEach(([key1, value]) => {
                        // Check if the key is 'LINE'
                        if (key1 === 'Line') {
                            // Loop over each 'LINE' entry
                            Object.entries(value).forEach(([lineKey, lineValue]) => {

                                const updatedValue = { ...lineValue };
                                // Find the corresponding data for each 'LINE' entry
                                const dataFound = amountData?.data.find(item => item.team_name === `${key1} ${lineKey}`);
                                if (dataFound) {
                                    updatedValue.amounts = dataFound.total_amount; // Assuming you meant to set odds here
                                }
                                else{
                                    updatedValue.amounts = ''
                                }
                                newValue1[key1][lineKey] = updatedValue;

                            });
                        } else if (key1 === 'CARD_SINGLE') {
                            // Loop through CARD_SINGLE entries
                            Object.entries(value).forEach(([bkey, cardValue]) => {
                                const updatedValue = { ...cardValue };

                                // Adjust the name for Card A and find the corresponding data
                                const name = updatedValue.name;
                                const dataFound = amountData?.data.find(item => item.team_name === name);
                                if (dataFound) {
                                    updatedValue.amounts = dataFound.total_amount; // Assuming this is what you intended
                                }
                                else{
                                    updatedValue.amounts = ''
                                }
                                newValue1[key1][bkey] = updatedValue;
                            });
                        } else {
                            // For non-LINE and non-CARD_SINGLE categories (e.g., 'EVEN_ODD', 'RED_BLACK')
                            Object.entries(value).forEach(([betTypeKey, cardValue]) => {
                                const dataFound = amountData?.data.find(item =>
                                    item.team_name === (betTypeKey === 'Red' || betTypeKey === 'Black' ? `${betTypeKey} Card` : betTypeKey)
                                );

                                // Create a new object to ensure we're not modifying the reference directly
                                const updatedValue = { ...cardValue };

                                if (dataFound) {

                                    updatedValue.amounts = dataFound.total_amount; // Update amounts if data is found
                                } else {
                                    updatedValue.amounts = ''; // Reset amounts to empty string if no data found
                                }

                                // Update the cardValue in newValue1
                                newValue1[key1][betTypeKey] = updatedValue; // Ensure to assign back to the correct path
                            });
                        }
                    });

                    return newValue1; // Return the updated object for this player
                });

                // Return the updated state
                return prevPlayers;
            });


        }

        const updatePlayersAndAmounts = () => {
            setTotalPlayers((prevState) => {
                // Create a copy of the previous state
                const prevPlayers = prevState.map((value1) => {
                    // Create a new object to prevent mutating the state directly
                    const newValue1 = { ...value1 };

                    // Loop through each object inside totalPlayers (e.g., 'ODDS', 'LINE')
                    Object.entries(newValue1).forEach(([key1, value]) => {
                        // Check if the key is 'LINE'
                        if (key1 === 'Line') {
                            // Loop over each 'LINE' entry
                            Object.entries(value).forEach(([lineKey, lineValue]) => {
                                // Find the corresponding data for each 'LINE' entry
                                const dataFound = data?.sub.find(item => item.nat === key1 + " " + lineKey);
                                if (dataFound) {
                                    lineValue.odds = dataFound.b || 0;
                                    lineValue.status = dataFound.gstatus === 'OPEN' ? '' : 'suspended-box';
                                }
                            });
                        } else if (key1 === 'CARD_SINGLE') {
                            // Loop through CARD_SINGLE entries
                            Object.values(value).forEach((cardValue) => {
                                // Adjust the name for Card A and find the corresponding data
                                const name = cardValue.name === 'Card A' ? 'Card 1' : cardValue.name;
                                const dataFound = data?.sub.find(item => item.nat === name);
                                if (dataFound) {
                                    cardValue.odds = dataFound.b || 0;
                                    cardValue.status = dataFound.gstatus === 'OPEN' ? '' : 'suspended-box';
                                }
                            });
                        } else {
                            // For non-LINE and non-CARD_SINGLE categories (e.g., 'EVEN_ODD', 'RED_BLACK')
                            Object.entries(value).forEach(([betTypeKey, cardValue1]) => {
                                // Determine where to fetch data from
                                const dataFound = data?.sub.find(item => item.nat === betTypeKey)


                                // Create a new object to ensure we're not modifying the reference directly
                                const updatedValue = { ...cardValue1 };

                                if (dataFound) {
                                    // Update odds and status
                                    updatedValue.odds = dataFound.b || 0;
                                    updatedValue.status = dataFound.gstatus === 'OPEN' ? '' : 'suspended-box';
                                    newValue1[key1][betTypeKey] = updatedValue;

                                }

                                // Reassign the updated object back to the state
                            });
                        }
                    });

                    return newValue1; // Return the updated object for this player
                });

                return prevPlayers; // Return the new state
            });
        };

        useEffect(() => {

            if (data?.sub) {

                updatePlayersAndAmounts()
            }

            if (data.card) {
                const cardArray = data.card.split(",");
                setCards(cardArray);
                remark.current = data.remark || 'Welcome';
            }
            else{
                setCards(['1'])
            }
        }, [data]);

        const exposure = localStorage.getItem('exposure');
        const sportLength = Object.keys(data).length;




        useEffect(() => {

            if (data?.sub && sportList?.id) {

                updateAmounts()



            }
        }, [exposure, sportLength, roundId]);


        const openPopup = (isBakOrLay, teamnam, oddvalue, betType) => {
            setBetType(betType)


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

                <div className={`vcasinocards-playera`}>

                    <div className="flip-card-container">
                        <div className="flip-card">
                            <div className="flip-card-inner ">
                                <div className="flip-card-front"><img src={import.meta.env.VITE_CARD_PATH +  cards[0] +".png"}/>
                                </div>
                                <div className="flip-card-back"><img src={import.meta.env.VITE_CARD_PATH +  cards[0]+".png"} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        </div>
    );

        const placeBet = () => {
            setSubmitButtonDisable(true)


            const notify = (status = 'suspended') => {
                if (status === 'suspended') {
                    Notify(`Bet Not Confirmed. Reason: Game Suspended`, null, null, 'danger');


                } else {
                    Notify("Bet Not Confirm Reason Game Change", null, null, 'danger')

                }
                setPopupDisplay(false);
                setHideLoading(true);
                setSubmitButtonDisable(false)

                resetBetFields(profitData, stakeValue)

            }


            if (totalPlayers[0]['ODDS']['High Card'].status === 'suspended-box') {
                notify()

                return;
            }

            if (roundIdSaved.current !== roundId) {
                notify('Round Change')

                return;
            }



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
                "type": match_id.toUpperCase(),
                "matchType":  match_id.toLowerCase(),

            }

            axiosFetch('casino/store', 'post', null, postdata)
                .then((res) => {
                    if (res.data.status === true) {
                        updateAmounts();
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
            <CasinoLayout virtualVideoCards={renderCards} raceClass="vlucky7 vcasino" ruleDescription={ruleDescription}
                          data={data} roundId={roundId} setRoundId={setRoundId}
                          sportList={sportList}
                          setSportList={setSportList} setData={setData} setLastResult={setLastResult}>


                <div className="card-content lucky-seven-content m-t-10">

                    <div className="row">
                        {Object.entries(totalPlayers[0].ODDS).map(([index, value], i) => (
                            <>
                                <div className={`col-5 text-center`}>
                                    <p className="d-block mb-0 text-center"><b>{value.odds}</b></p>
                                    <button className={`btn-theme mt-1 ${value.status}`}
                                            onClick={() => openPopup('back', index, value.odds, 'ODDS')}>{index}</button>

                                    <div className="m-t-5 text-center">{getExByColor(value.amounts)}</div>


                                </div>

                                {i === 0 && (
                                    <div className="col-2 text-center card-seven">

                                        <img src="/img/card/7.jpg" className="img-fluid"/>
                                    </div>
                                )}
                            </>
                        ))}
                    </div>
                </div>


                <div className="card-content lucky-seven-content m-t-10">
                    <div className="row row5">
                        {totalPlayers.slice(1, 3).map((player, index) => (
                            Object.entries(player).map(([category, values]) => (
                                <div className="col-6" key={index}>
                                    <div className="light-bg pl-1 pr-1">
                                        <div className="row row5">
                                            {Object.entries(values).map(([key, value], subIndex) => {

                                                const catcard = category === 'RED_BLACK' ? key + " Card" : key;
                                                return (
                                                    <div className="col-6" key={subIndex}>
                                                        <p className="d-block mb-0 text-center"><b>{value.odds}</b>
                                                        </p>
                                                        <button
                                                            className={`btn-theme mt-1 text-uppercase ${value.status}`}
                                                            onClick={() => openPopup('back', catcard, value.odds, category)}>
                                                            {category === 'RED_BLACK' && (
                                                                <div className="color-card"></div>
                                                            )}
                                                            {category === 'RED_BLACK' && (
                                                                <>
                                                                    {key === 'Red' ?
                                                                        <>

                                                                <span className="card-icon">
                                        <span className="card-red">[</span>
                                    </span>
                                                                            <span className="card-icon">
                                                                <span className="card-red">{"{"}</span>
                                                                    </span>
                                                                        </> :
                                                                        <>
                                                                <span className="card-icon">
                                        <span className="card-black">]</span>
                                    </span>
                                                                            <span className="card-icon">
                                                                <span className="card-black">{"}"}</span>
                                                                    </span>
                                                                        </>
                                                                    }
                                                                </>
                                                            )}
                                                            {category !== 'RED_BLACK' && key}
                                                        </button>
                                                        <p className="mt-1 mb-0 text-center">
                                                            <b>{getExByColor(value.amounts)}</b>
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>
                                </div>
                            ))
                        ))}
                    </div>
                </div>
                <div className="card-content lucky-seven-content m-t-10">
                    <div className="casino-table-box mt-3">
                        {Object.entries(totalPlayers[3].Line).map(([lineIndex, lineInfo], index) => (
                            <div key={index} className="lucky7cards">
                                <div className="casino-odds w-100 text-center">{lineInfo.odds}</div>
                                <div className="card-odd-box-container"
                                     onClick={() => openPopup('back', "Line " + (parseInt(index) + 1), lineInfo.odds, 'LINE')}>
                                    {lineInfo.cards.map((card, cardIndex) => (
                                        <div key={cardIndex} className={`card-odd-box ${lineInfo.status}`}>
                                            <div className="">
                                                <img src={card} alt={`Card ${cardIndex + 1}`} className="img-fluid"/>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="casino- text-center w-100">
                                    {getExByColor(lineInfo.amounts)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card-content lucky-seven-content m-t-10">
                    <div className="row">
                        <div className="col-12 text-center"><b>{totalPlayers[4].CARD_SINGLE[1].odds}</b></div>
                    </div>
                    <div className="row m-t-10">
                        <div className="col-12 text-center card-seven">
                            {Object.entries(totalPlayers[4].CARD_SINGLE).map(([index, info], i) => (

                                <div className="d-inline-block" key={i}>
                                    <div className={info.status}
                                         onClick={() => openPopup('back', info.name, info.odds, 'CARD_SINGLE')}>
                                        <img src={info.img} className="m-r-5 m-l-5"/>
                                    </div>
                                    <div>

                                        <div className="m-t-5">
                                            {getExByColor(info.amounts)}
                                        </div>
                                    </div>
                                </div>
                            ))}
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

    }
;


export default Vlucky7;
