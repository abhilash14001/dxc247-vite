import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import axiosFetch, {
    getExByColor, getExBySingleTeamNameCasino,

 getPlayerCardAccordingToNumberOfPlayers, resetBetFields, placeCasinoBet,
 exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";

import Notify from "../utils/Notify";


const War = () => {
    const [roundId, setRoundId] = useState('')
    const ruleImage = '/img/rules/war-rules.jpg'
    const ruleDescription = `<style type="text/css">
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
    </style>`;

    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const [totalPlayers, setTotalPlayers] = useState(

        Object.fromEntries(Array.from({length:6}, (_, index) => {
            const key = "Winner " +(index + 1)


            return [key,  {"odds" : '', "img" : "/img/card/1.jpg", "status" : '', "amounts" : ""}]
        }))

    )

    const [playerStatuses, setPlayerStatuses] = useState({ 
        "Winner 1": 'suspended-box', 
        "Winner 2": 'suspended-box', 
        "Winner 3": 'suspended-box', 
        "Winner 4": 'suspended-box', 
        "Winner 5": 'suspended-box', 
        "Winner 6": 'suspended-box' 
    });

 


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

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);


    useEffect(() => {

        if (data?.sub) {

            const cardssAre = getPlayerCardAccordingToNumberOfPlayers(data, 1, 2, Array.from({length : 6}, (_,index) => { return index }));

            const playerCards = Object.fromEntries(
                cardssAre.map((card, index) => [`Winner ${index + 1}`, card])
            );


            data.sub.map((value, key) => {
                const itemfound = Object.keys(totalPlayers).find(item => item === value.nat.trim())
                
                if (itemfound) {
                    const isOpen = value.gstatus === 'OPEN'
                    const status = isOpen ? '' : 'suspended-box'
                    
                    setTotalPlayers(prev => ({
                        ...prev,
                        [itemfound]: {
                            ...prev[itemfound],
                            odds: value.b,
                            status: isOpen ? '' : 'suspended-box',
                            img: playerCards[itemfound]
                        }
                    }))
                    
                    setPlayerStatuses(prev => ({
                        ...prev,
                        [value.nat]: status
                    }))
                }
            })

        }

        if (data.card) {

            remark.current = data.remark || 'Welcome';
        }
        // console.log(data)
    }, [data?.sub]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;
    const updateAmount = async () => {

        const amountData = await getExBySingleTeamNameCasino(sportList.id, roundId, '', match_id)


        setTotalPlayers((prevState) => {
            const prev = {...prevState};
            const keys = Object.keys(prev);

            keys.forEach((key) => {
                if (amountData.data.some((value) => value.team_name === key)) {
                    const value = amountData.data.find((item) => item.team_name === key);
                    prev[key].amounts =value.total_amount;

                }
                else{
                    prev[key].amounts ='';
                }
            });

            return prev;
        });



    }

    useEffect(() => {

        if (data?.sub && sportList?.id) {



            updateAmount()



        }
    }, [exposure, sportLength, roundId, mybetModel.length]);




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

    // Helper function to find data in data.sub for War
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;

        // For War, find the item by nat field
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



    const renderCards = () => {
        if(!data){
            return null;
        }
        const dealer = getPlayerCardAccordingToNumberOfPlayers(data, 1, 2, Array.from({length: 7}, (_, index) => {
            return index
        }))[6]

        if(!dealer)
            return null;
        return (
            <div className="flip-card-container">


                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src={dealer}/>
                        </div>
                    </div>
                </div>


            </div>
        )
    }


    useEffect(() => {
        console.log(playerStatuses)
    }, [playerStatuses])

    const placeBet = async () => {
        const betData = {
            sportList,
            roundId,
            backOrLay,
            teamname,
            odds,
            profit,
            loss,
            betType: "WINNER",
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
            updateAmounts: updateAmount,
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
            <div className="video-overlay">
                    <div className="casino-video-cards">
                        <div>

                            {renderCards()}
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
        <CasinoLayout raceClass="casino-war" ruleImage={ruleImage} ruleDescription={ruleDescription}  hideLoading={hideLoading} isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult} virtualVideoCards={renderVideoBox}
                      getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-detail">
                <div className="casino-container table-casino war">
                    <div className="casino-table">
                        <div className="casino-table-header w-100">
                            <div className="casino-nation-detail"></div>
                            {Object.entries(totalPlayers).map(([index, value], i) => (
                                <div key={i} className="casino-odds-box">
                                    <div className="flip-card">
                                        <div className="flip-card-inner">
                                            <div className="flip-card-front">
                                                <img src={value.img} />
                                            </div>
                                            <div className="flip-card-back">
                                                <img src={value.img} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="casino-table-full-box d-none d-md-block">
                            <div className="casino-table-header">
                                <div className="casino-nation-detail"></div>
                                {Object.keys(totalPlayers).map((_, i) => (
                                    <div key={i} className="casino-odds-box">{i + 1}</div>
                                ))}
                            </div>
                            <div className="casino-table-body">
                                <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                        <div className="casino-nation-name">
                                            <span>Winner</span>
                                        </div>
                                    </div>
                                    {Object.entries(totalPlayers).map(([index, value], i) => (
                                        <div key={i} className={`casino-odds-box back ${value.status}`} onClick={() => openPopup('back', index, value.odds)}>
                                            <span className="casino-odds">{value.odds}</span>
                                            <div className="casino- text-danger">
                                                {getExByColor(value.amounts)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="casino-table-full-box d-md-none">
                            <ul className="menu-tabs d-xl-none nav nav-tabs" role="tablist">
                                {Object.keys(totalPlayers).map((_, i) => (
                                    <li key={i} className="nav-item" role="presentation">
                                        <button 
                                            type="button" 
                                            id={`uncontrolled-tab-example-tab-${i}`}
                                            role="tab" 
                                            data-rr-ui-event-key={i}
                                            aria-controls={`uncontrolled-tab-example-tabpane-${i}`}
                                            aria-selected={i === 0 ? "true" : "false"}
                                            className={`nav-link ${i === 0 ? 'active' : ''}`}
                                            tabIndex={i === 0 ? undefined : "-1"}
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="tab-content">
                                {Object.entries(totalPlayers).map(([index, value], i) => (
                                    <div 
                                        key={i}
                                        role="tabpanel" 
                                        id={`uncontrolled-tab-example-tabpane-${i}`}
                                        aria-labelledby={`uncontrolled-tab-example-tab-${i}`}
                                        className={`fade tab-pane ${i === 0 ? 'active show' : ''}`}
                                    >
                                        <div className="casino-table-body">
                                            <div className="row row5">
                                                <div className="col-12">
                                                    <div className="casino-table-row">
                                                        <div className="casino-nation-detail">
                                                            <div className="casino-nation-name">Winner</div>
                                                        </div>
                                                        <div className={`casino-odds-box back ${value.status}`} onClick={() => openPopup('back', index, value.odds)}>
                                                            <span className="casino-odds">{value.odds}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <marquee scrollamount="3" className="casino-remark m-b-10">{remark.current}</marquee>
                <div className="casino-last-result-title">
                    <span>Last Result</span>
                </div>
                <div className="casino-last-results">
                    <CasinoLastResult classIS="casino-result-modal" sportList={sportList} lastResults={lastResult} data={data}/>
                </div>
            </div>
            

        </CasinoLayout>
    );

};

export default War;
