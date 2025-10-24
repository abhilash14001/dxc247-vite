import CasinoLayout from "../../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamNameCasino,

    resetBetFields,
    exposureCheck
} from "../../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../../contexts/SportsContext";


import Notify from "../../utils/Notify";

const Vdtl20 = () => {
    const [roundId, setRoundId] = useState('')
    const rImage = '/img/rules/dtl20-rules.jpg'
    const defaultValues = {odds: 0, status: 'suspendedtd', amounts: ''}
    const defaultSectionsArray = [
        {key: "Winner", value: {...defaultValues, 'bet_type': 'WINNER'}},
        {key: "Black", value: {...defaultValues, 'bet_type': 'COLOR_'}},
        {key: "Red", value: {...defaultValues, 'bet_type': 'COLOR_'}},
        {key: "Odd", value: {...defaultValues, 'bet_type': 'ODD_EVEN_'}},
        {key: "Even", value: {...defaultValues, 'bet_type': 'ODD_EVEN_'}},
        {key: "A", value: {...defaultValues, 'img': "/img/card/1.jpg", 'bet_type': '_SINGLE'}},
        {key: "2", value: {...defaultValues, 'img': "/img/card/2.jpg", 'bet_type': '_SINGLE'}},
        {key: "3", value: {...defaultValues, 'img': "/img/card/3.jpg", 'bet_type': '_SINGLE'}},
        {key: "4", value: {...defaultValues, 'img': "/img/card/4.jpg", 'bet_type': '_SINGLE'}},
        {key: "5", value: {...defaultValues, 'img': "/img/card/5.jpg", 'bet_type': '_SINGLE'}},
        {key: "6", value: {...defaultValues, 'img': "/img/card/6.jpg", 'bet_type': '_SINGLE'}},
        {key: "7", value: {...defaultValues, 'img': "/img/card/7.jpg", 'bet_type': '_SINGLE'}},
        {key: "8", value: {...defaultValues, 'img': "/img/card/8.jpg", 'bet_type': '_SINGLE'}},
        {key: "9", value: {...defaultValues, 'img': "/img/card/9.jpg", 'bet_type': '_SINGLE'}},
        {key: "10", value: {...defaultValues, 'img': "/img/card/10.jpg", 'bet_type': '_SINGLE'}},
        {key: "J", value: {...defaultValues, 'img': "/img/card/11.jpg", 'bet_type': '_SINGLE'}},
        {key: "Q", value: {...defaultValues, 'img': "/img/card/12.jpg", 'bet_type': '_SINGLE'}},
        {key: "K", value: {...defaultValues, 'img': "/img/card/13.jpg", 'bet_type': '_SINGLE'}},
    ];


    const [totalPlayers, setTotalPlayers] = useState({
        Dragon: {...defaultSectionsArray, subname: 'D'},
        Tiger: {...defaultSectionsArray, subname: "T"},
        Lion: {...defaultSectionsArray, subname: "L"},
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
        setBetType,
        betType,
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




    const updatePlayers = () => {
        setTotalPlayers((prevState) => {
            const updateP = {...prevState};

            Object.entries(updateP).forEach(([key, value]) => {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    let teamname;


                    // Check if bet_type exists in the subValue structure
                    if (subValue?.value?.bet_type === '_SINGLE') {
                        // For _SINGLE bet_type, use key + subKey as team name
                        teamname = key + " " + subValue.key
                    } else {
                        // Ensure value.subname exists, otherwise provide a default or handle accordingly
                        const subname = value.subname;
                        // For other bet types, use subKey + subname
                        if (subValue !== undefined && subValue.key !== undefined && subname !== undefined) {
                            teamname = subValue.key + " " + subname;
                        }

                    }

                    if (teamname) {
                        const founddata = data.sub.find(item => item.nat === teamname)

                        if (founddata) {

                            subValue.value.odds = founddata.b
                            subValue.value.status = founddata.gstatus === 'OPEN' ? "" : 'suspendedtd'
                        }
                    }


                });
            });
            // For inspecting the state during development

            return updateP;
        });
    }

    useEffect(() => {

        if (data?.sub) {

            updatePlayers()

        }

        if (data.card) {
            const cardArray = data.card.split(",");


            setCards(cardArray);
            remark.current = data.remark || 'Welcome';
        }
        else{
            setCards(['1','1','1'])
        }
    }, [data]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;


    useEffect(() => {

        if (data?.sub && sportList?.id) {
            updateAmounts();
        }
    }, [exposure, sportLength, roundId]);


    const openPopup = (isBakOrLay, teamnam, oddvalue, bet) => {
        setBetType(bet)


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
            {Object.entries({'a' : 'DRAGON', 'b': 'TIGER', 'c': 'LION'}).map(([index, value]) => (
            <div className={`vcasinocards-player${index}`}>
                <h5 className="text-center">{value}</h5>
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
            ))}
        </div>
    );

    const updateAmounts = async () => {

        const data = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id, '')
        setTotalPlayers((prevState) => {
            const updateP = {...prevState};

            Object.entries(updateP).forEach(([key, value]) => {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    let teamname;


                    // Check if bet_type exists in the subValue structure
                    if (subValue?.value?.bet_type === '_SINGLE') {
                        // For _SINGLE bet_type, use key + subKey as team name
                        teamname = key + " " + subValue.key
                    } else {
                        // Ensure value.subname exists, otherwise provide a default or handle accordingly
                        const subname = value.subname;
                        // For other bet types, use subKey + subname
                        if (subValue !== undefined && subValue.key !== undefined && subname !== undefined) {
                            teamname = subValue.key + " " + subname;
                        }

                    }

                    if (teamname && Array.isArray(data.data)) {
                        const founddata = data.data.find(item => item.team_name === teamname)



                        updateP[key][subKey] = {
                            ...updateP[key][subKey],
                            value: {
                                ...updateP[key][subKey].value,
                                amounts: founddata?.total_amount || ''
                            }
                        };


                    }


                });
            });

            return updateP;
        });


    }


    const placeBet = () => {

        setHideLoading(false)
        if (totalPlayers['Dragon'][0]['value'].status !== '') {
            Notify(`Bet Not Confirmed. Reason: Game Suspended`, null, null, 'danger');
            setPopupDisplay(false);
            setHideLoading(true);
            resetBetFields(profitData, stakeValue)
            return;
        }

        if (roundIdSaved.current !== roundId) {
            Notify("Bet Not Confirm Reason Game Change", null, null, 'danger')
            setPopupDisplay(false)
            setHideLoading(true);
            resetBetFields(profitData, stakeValue)
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
            "betType": betType,
            "bet_side": backOrLay.toUpperCase(),
            "betAmount": parseFloat(stakeValue.current.value),
            "type": match_id.toUpperCase(),
            "matchType": match_id.toLowerCase(),

        }

        axiosFetch('casino/store', 'post', null, postdata)
            .then((res) => {
                if (res.data.status === true) {
                    updateAmounts()

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
        <CasinoLayout virtualVideoCards={renderCards} ruleImage={rImage} raceClass="new-casino race vcasino"  hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult}>


                <div className="row row5">
                    <div className="col-12">
                        <div className="main-market">
                            <table className="table coupon-table table table-bordered">
                                <thead>
                                <tr className="text-center">
                                    <th className="box-1"></th>
                                    <th className="box-2">Dragon</th>
                                    <th className="box-2">Tiger</th>
                                    <th className="box-2">Lion</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(totalPlayers['Dragon']).map(([index, value], i) => {
                                    const values = Object.values(value)[0]

                                    const dragonSection = totalPlayers['Dragon'][i];
                                    const tigerSection = totalPlayers['Tiger'][i];
                                    const lionSection = totalPlayers['Lion'][i];

                                    const renderCell = (section) => {
                                        const value = section?.value || {};
                                        return value.hasOwnProperty('img') ? (
                                            <img src={value.img} alt=""/>
                                        ) : (

                                            <>
                                                <b>{values}</b>
                                                {
                                                    values === 'Black' && (
                                                        <>
                                                    <span className="card-icon"><span
                                                        className="card-black">]</span></span>
                                                            <span className="card-icon"><span
                                                                className="card-black">{"}"}</span></span>
                                                        </>
                                                    )
                                                }

                                                {
                                                    values === 'Red' && (
                                                        <>
                                                    <span className="card-icon"><span
                                                        className="card-red">[</span></span>
                                                            <span className="card-icon"><span
                                                                className="card-red">{"{"}</span></span>
                                                        </>
                                                    )
                                                }
                                            </>
                                        )
                                            ;
                                    };
                                    return typeof value === 'object' && (
                                        <tr key={i}>
                                            <td className="box-1 card-type-icon">
                                                {renderCell(dragonSection)}

                                            </td>
                                            <td className={`box-2 back ${dragonSection.value?.status}`}
                                                onClick={() => openPopup('back', dragonSection.value?.bet_type === '_SINGLE' ? 'Dragon ' + values : values + " " + totalPlayers['Dragon'].subname, dragonSection.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? dragonSection.value?.bet_type + "D" : (dragonSection.value?.bet_type === '_SINGLE' ? 'DRAGON_SINGLE' : dragonSection.value?.bet_type))}>
                                                <button>
                                                    <span className="odd d-block">{dragonSection.value?.odds}</span>
                                                    <span className="d-block"
                                                          style={{color: "black"}}>{getExByColor(dragonSection.value?.amounts)}</span>

                                                </button>
                                            </td>
                                            <td className={`box-2 back ${tigerSection.value?.status}`}
                                                onClick={() => openPopup('back', tigerSection.value?.bet_type === '_SINGLE' ? 'Tiger ' + values : values + " " + totalPlayers['Tiger'].subname, tigerSection.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? tigerSection.value?.bet_type + "T" : (tigerSection.value?.bet_type === '_SINGLE' ? 'TIGER_SINGLE' : tigerSection.value?.bet_type))}>
                                                <button>
                                                    <span className="odd d-block">{tigerSection.value?.odds}</span>
                                                    <span className="d-block"
                                                          style={{color: "black"}}>{getExByColor(tigerSection.value?.amounts)}</span>
                                                </button>
                                            </td>
                                            <td className={`box-2 back ${lionSection.value?.status}`}
                                                onClick={() => openPopup('back', lionSection.value?.bet_type === '_SINGLE' ? 'Lion ' + values : values + " " + totalPlayers['Lion'].subname, lionSection.value?.odds, ['Black', 'Red', 'Odd', 'Even'].includes(values) ? lionSection.value?.bet_type + "L" : (lionSection.value?.bet_type === '_SINGLE' ? 'LION_SINGLE' : lionSection.value?.bet_type))}>
                                                <button>
                                                    <span className="odd d-block">{lionSection.value?.odds}</span>
                                                    <span className="d-block"
                                                          style={{color: "black"}}>{getExByColor(lionSection.value?.amounts)}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
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


export default Vdtl20;
