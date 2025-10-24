import CasinoLayout from "../components/casino/CasinoLayout";
import {useContext, useEffect, useRef, useState} from "react";

import {CasinoLastResult} from "../components/casino/CasinoLastResult";

import { resetBetFields, placeCasinoBet,
exposureCheck
} from "../utils/Constants";
import {useParams} from "react-router-dom";
import {SportsContext} from "../contexts/SportsContext";
import {AuthContext} from "../contexts/AuthContext";
import {CasinoContext} from "../contexts/CasinoContext";
import Notify from "../utils/Notify";

const Sicbo = () => {
    const  {match_id} = useParams();
    const [roundId, setRoundId] = useState('')
    const ruleDescription =match_id === 'sicbo' ? `<div><style type="text/css">
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
.rules-section img {
  max-width: 100%;
}

    </style>

<div class="rules-section">
                                            <h6 class="rules-highlight">Game Rules : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Sic Bo is an exciting game of chance played with three regular dice with face value 1 to 6. The objective of Sic Bo is to predict the outcome of the shake of the three dice.</li>
                                                <li>After betting time has expired, the dice are shaken in a dice shaker. A number of bet spots — from zero to several — then have multipliers randomly applied to them before the dice come to rest and the result is known. If the player’s bet is placed on the bet spot with the applied multiplier, your bet is multiplied accordingly.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Bet Type : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>You can place many kinds of bets on the Sic Bo table, and each type of bet has its own payout. Your bet is returned on top of your winnings.
                                                    <ul class="pl-4 pr-4 list-style">
                                                        <li><span><strong>Small/Big</strong> — place your bet on the total of the three dice being Small (4–10) or Big (11–17). Wins pay 1:1, but these bets lose to any Triple.</span></li>
                                                        <li><span><strong>Even/Odd</strong> — place your bet on the total of the three dice being Odd or Even. Wins pay 1:1, but these bets lose to any Triple.</span></li>
                                                        <li><span><strong>Total</strong> — place your bet on any of the 14 betting areas labelled 4–17. Total is the total of the three dice and excludes 3 and 18. You win if the total of the three dice adds up to the Total number on which you placed your bet. Payouts vary depending on the winning total.</span></li>
                                                        <li><span><strong>Single</strong> — place your bet on any of the six betting areas labelled ONE, TWO, THREE, FOUR, FIVE and SIX, which represent the six face values of a dice.</span><ul class="singleBets--2f9e7"><li><span>If 1 of 3 dice shows the number you bet on, you get paid 1:1.</span></li><li><span>If 2 of 3 dice show the number you bet on, you get paid 2:1.</span></li><li><span>If all 3 dice show the number you bet on, you get paid 3:1.</span></li></ul></li>
                                                        <li><span><strong>Double</strong> — place your bet on any of the six Double-labelled betting areas. To win, 2 of 3 dice must show the same number. Wins pay 8:1. Please note that regardless of whether 2 or 3 dice show the same number, the payout remains the same.</span></li>
                                                        <li><span><strong>Triple</strong> — place your bet on any of the six Triple-labelled betting areas. To win, all 3 dice must match the number chosen, and you get paid 150:1.</span></li>
                                                        <li><span><strong>Any Triple</strong> — place your bet on this box to cover all six different Triple bets at once. To win, all three dice must show the same number, and you get paid 30:1.</span></li>
                                                        <li><span><strong>Combination</strong> — place your bet on any or all 15 possible 2 dice combinations. Wins pay 5:1.</span></li>
                                                    </ul>
                                                </li>
                                                <li>After the betting is closed, random bet spots will be highlighted showing the multiplied payouts.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Winning Numbers : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>The WINNING NUMBERS display shows the most recent winning numbers.</li>
                                                <li>The result of the most recently completed round is listed on the left: the total of the three dice on the upper line, following with the result of three individual dice below.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Statistics : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>In the roadmap below, the Winning numbers are displayed in the patterns of Small (S), Big (B), and Triple (T) results. Each cell represents the result of a past round. The result of the earliest round is recorded in the upper left corner. Read the column downwards all the way to the bottom; then start at the top of the adjacent column to the right, and so forth.</li>
                                                <li>This representation may be of help to you in predicting the results of future rounds.</li>
                                                <li>Below the roadmap, you can see the statistics of Small, Big, and Triple bets for the last 50 rounds.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Payouts : </h6>
                                            <ul>
                                                <li>Your payout depends on the type of bet placed. The payout range depends on whether the bet you have placed on the bet spot of your choice has a multiplier applied to it. If there is no multiplier, then the regular payout is applied. Your bet is returned on top of your winnings.</li>
                                            </ul>
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>Bet</th>
                                                        <th>Payout</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Small/Big</td>
                                                        <td>1:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Even/Odd</td>
                                                        <td>1:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Double</td>
                                                        <td>8:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Triple</td>
                                                        <td>150:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Any Triple</td>
                                                        <td>30:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 4 or 17</td>
                                                        <td>50:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 5 or 16</td>
                                                        <td>20:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 6 or 15</td>
                                                        <td>15:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 7 or 14</td>
                                                        <td>12:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 8 or 13</td>
                                                        <td>8:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 9 or 12</td>
                                                        <td>6:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 10 or 11</td>
                                                        <td>6:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Combination</td>
                                                        <td>5:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2">
                                                            <div class="d-flex justify-content-between">
                                                                <div>
                                                                    <ul class="list-style">
                                                                        <li>Single</li>
                                                                        <li>Double</li>
                                                                        <li>Triple</li>
                                                                    </ul>
                                                                </div>
                                                                <div>
                                                                    <div>1:1</div>
                                                                    <div>2:1</div>
                                                                    <div>3:1</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <p>Malfunction voids all pays and play.</p>
                                        </div></div>` : `<div><style type="text/css">
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
.rules-section img {
  max-width: 100%;
}
    </style>

<div class="rules-section">
                                            <h6 class="rules-highlight">Game Rules : </h6>
                                            <ul class="pl-4 pr-4 list-style">
<li>This casino operates similarly to Sicbo, with the key difference being that each round alternates between two Sicbo machines. For example, the first round will start on the first machine, the second round on the second machine, and this alternating pattern will continue throughout the game.</li>
                                                <li>Sic Bo is an exciting game of chance played with three regular dice with face value 1 to 6. The objective of Sic Bo is to predict the outcome of the shake of the three dice.</li>
                                                <li>After betting time has expired, the dice are shaken in a dice shaker. A number of bet spots — from zero to several — then have multipliers randomly applied to them before the dice come to rest and the result is known. If the player’s bet is placed on the bet spot with the applied multiplier, your bet is multiplied accordingly.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Bet Type : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>You can place many kinds of bets on the Sic Bo table, and each type of bet has its own payout. Your bet is returned on top of your winnings.
                                                    <ul class="pl-4 pr-4 list-style">
                                                        <li><span><strong>Small/Big</strong> — place your bet on the total of the three dice being Small (4–10) or Big (11–17). Wins pay 1:1, but these bets lose to any Triple.</span></li>
                                                        <li><span><strong>Even/Odd</strong> — place your bet on the total of the three dice being Odd or Even. Wins pay 1:1, but these bets lose to any Triple.</span></li>
                                                        <li><span><strong>Total</strong> — place your bet on any of the 14 betting areas labelled 4–17. Total is the total of the three dice and excludes 3 and 18. You win if the total of the three dice adds up to the Total number on which you placed your bet. Payouts vary depending on the winning total.</span></li>
                                                        <li><span><strong>Single</strong> — place your bet on any of the six betting areas labelled ONE, TWO, THREE, FOUR, FIVE and SIX, which represent the six face values of a dice.</span><ul class="singleBets--2f9e7"><li><span>If 1 of 3 dice shows the number you bet on, you get paid 1:1.</span></li><li><span>If 2 of 3 dice show the number you bet on, you get paid 2:1.</span></li><li><span>If all 3 dice show the number you bet on, you get paid 3:1.</span></li></ul></li>
                                                        <li><span><strong>Double</strong> — place your bet on any of the six Double-labelled betting areas. To win, 2 of 3 dice must show the same number. Wins pay 8:1. Please note that regardless of whether 2 or 3 dice show the same number, the payout remains the same.</span></li>
                                                        <li><span><strong>Triple</strong> — place your bet on any of the six Triple-labelled betting areas. To win, all 3 dice must match the number chosen, and you get paid 150:1.</span></li>
                                                        <li><span><strong>Any Triple</strong> — place your bet on this box to cover all six different Triple bets at once. To win, all three dice must show the same number, and you get paid 30:1.</span></li>
                                                        <li><span><strong>Combination</strong> — place your bet on any or all 15 possible 2 dice combinations. Wins pay 5:1.</span></li>
                                                    </ul>
                                                </li>
                                                <li>After the betting is closed, random bet spots will be highlighted showing the multiplied payouts.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Winning Numbers : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>The WINNING NUMBERS display shows the most recent winning numbers.</li>
                                                <li>The result of the most recently completed round is listed on the left: the total of the three dice on the upper line, following with the result of three individual dice below.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Statistics : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>In the roadmap below, the Winning numbers are displayed in the patterns of Small (S), Big (B), and Triple (T) results. Each cell represents the result of a past round. The result of the earliest round is recorded in the upper left corner. Read the column downwards all the way to the bottom; then start at the top of the adjacent column to the right, and so forth.</li>
                                                <li>This representation may be of help to you in predicting the results of future rounds.</li>
                                                <li>Below the roadmap, you can see the statistics of Small, Big, and Triple bets for the last 50 rounds.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">Payouts : </h6>
                                            <ul>
                                                <li>Your payout depends on the type of bet placed. The payout range depends on whether the bet you have placed on the bet spot of your choice has a multiplier applied to it. If there is no multiplier, then the regular payout is applied. Your bet is returned on top of your winnings.</li>
                                            </ul>
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>Bet</th>
                                                        <th>Payout</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Small/Big</td>
                                                        <td>1:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Even/Odd</td>
                                                        <td>1:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Double</td>
                                                        <td>8:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Triple</td>
                                                        <td>150:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Any Triple</td>
                                                        <td>30:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 4 or 17</td>
                                                        <td>50:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 5 or 16</td>
                                                        <td>20:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 6 or 15</td>
                                                        <td>15:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 7 or 14</td>
                                                        <td>12:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 8 or 13</td>
                                                        <td>8:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 9 or 12</td>
                                                        <td>6:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total 10 or 11</td>
                                                        <td>6:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Combination</td>
                                                        <td>5:1</td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="2">
                                                            <div class="d-flex justify-content-between">
                                                                <div>
                                                                    <ul class="list-style">
                                                                        <li>Single</li>
                                                                        <li>Double</li>
                                                                        <li>Triple</li>
                                                                    </ul>
                                                                </div>
                                                                <div>
                                                                    <div>1:1</div>
                                                                    <div>2:1</div>
                                                                    <div>3:1</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <p>Malfunction voids all pays and play.</p>
                                        </div></div>`

    const {updateCardsForCard32Casino} = useContext(CasinoContext)

    const roundIdSaved = useRef(null);

    const [submitButtonDisable, setSubmitButtonDisable] = useState(false)

    const stakeValue = useRef(0);
    const [odds, setOdds] = useState(0)

    const [backOrLay, setbackOrLay] = useState('back')
    const [sportList, setSportList] = useState({})
    
    const {
        setBetType,
        betType,
        setPopupDisplayForDesktop,

    } = useContext(SportsContext)
    const {getBalance} = useContext(AuthContext)
    const {mybetModel} = useContext(CasinoContext)
    const [hideLoading, setHideLoading] = useState(true)
    
    const defaultValues = {odds: {back: 0, lay: 0}, status: 'suspended-box', amounts: ''}
    
    const [totalPlayers, setTotalPlayers] = useState([
        {
            "BASIC": {
                'Small': defaultValues,
                'BIG': defaultValues,
                'ODD': defaultValues,
                'Even': defaultValues,
                'Any Triple': defaultValues
            }
        },
        {
            "DOUBLES": {
                'Double 1': defaultValues,
                'Double 2': defaultValues,
                'Double 3': defaultValues,
                'Double 4': defaultValues,
                'Double 5': defaultValues,
                'Double 6': defaultValues
            }
        },
        {
            "TRIPLES": {
                'Triple 1': defaultValues,
                'Triple 2': defaultValues,
                'Triple 3': defaultValues,
                'Triple 4': defaultValues,
                'Triple 5': defaultValues,
                'Triple 6': defaultValues
            }
        },
        {
            "TOTALS": {
                'Total 4': defaultValues,
                'Total 5': defaultValues,
                'Total 6': defaultValues,
                'Total 7': defaultValues,
                'Total 8': defaultValues,
                'Total 9': defaultValues,
                'Total 10': defaultValues,
                'Total 11': defaultValues,
                'Total 12': defaultValues,
                'Total 13': defaultValues,
                'Total 14': defaultValues,
                'Total 15': defaultValues,
                'Total 16': defaultValues,
                'Total 17': defaultValues
            }
        },
        {
            "COMBINATIONS": {
                'Combination 1 and 2': defaultValues,
                'Combination 1 and 3': defaultValues,
                'Combination 1 and 4': defaultValues,
                'Combination 1 and 5': defaultValues,
                'Combination 1 and 6': defaultValues,
                'Combination 2 and 3': defaultValues,
                'Combination 2 and 4': defaultValues,
                'Combination 2 and 5': defaultValues,
                'Combination 2 and 6': defaultValues,
                'Combination 3 and 4': defaultValues,
                'Combination 3 and 5': defaultValues,
                'Combination 3 and 6': defaultValues,
                'Combination 4 and 5': defaultValues,
                'Combination 4 and 6': defaultValues,
                'Combination 5 and 6': defaultValues
            }
        },
        {
            "SINGLES": {
                'Single 1': defaultValues,
                'Single 2': defaultValues,
                'Single 3': defaultValues,
                'Single 4': defaultValues,
                'Single 5': defaultValues,
                'Single 6': defaultValues
            }
        }
    ]);

    const teamNames = useRef([])
    
    const [playerStatuses, setPlayerStatuses] = useState({});

    const [data, setData] = useState([]);

    const exposure = exposureCheck();
    const sportLength = Object.keys(data).length;

    const remark = useRef('Welcome');
    const [lastResult, setLastResult] = useState({});
    const teamname = useRef('');
    const loss = useRef(0);
    const profit = useRef(0);
    const profitData = useRef(0);

    useEffect(() => {
        const updateOdds = () => {
            setTotalPlayers((prevState) => {
                const updatedState = [...prevState];

                data.sub.forEach((item, index) => {
                    const betName = item.nat;

                    // Update BASIC bets
                    if (updatedState[0].BASIC[betName]) {
                        updatedState[0].BASIC[betName] = {
                            ...updatedState[0].BASIC[betName],
                            odds: {back: item?.b || 0, lay: item?.l || 0},
                            status: item.gstatus === 'OPEN' ? '' : 'suspended-box',
                        };
                    }

                    // Update DOUBLES
                    if (updatedState[1].DOUBLES[betName]) {
                        updatedState[1].DOUBLES[betName] = {
                            ...updatedState[1].DOUBLES[betName],
                            odds: {back: item?.b || 0, lay: item?.l || 0},
                            status: item.gstatus === 'OPEN' ? '' : 'suspended-box',
                        };
                    }

                    // Update TRIPLES
                    if (updatedState[2].TRIPLES[betName]) {
                        updatedState[2].TRIPLES[betName] = {
                            ...updatedState[2].TRIPLES[betName],
                            odds: {back: item?.b || 0, lay: item?.l || 0},
                            status: item.gstatus === 'OPEN' ? '' : 'suspended-box',
                        };
                    }

                    // Update TOTALS
                    if (updatedState[3].TOTALS[betName]) {
                        updatedState[3].TOTALS[betName] = {
                            ...updatedState[3].TOTALS[betName],
                            odds: {back: item?.b || 0, lay: item?.l || 0},
                            status: item.gstatus === 'OPEN' ? '' : 'suspended-box',
                        };
                    }

                    // Update COMBINATIONS
                    if (updatedState[4].COMBINATIONS[betName]) {
                        updatedState[4].COMBINATIONS[betName] = {
                            ...updatedState[4].COMBINATIONS[betName],
                            odds: {back: item?.b || 0, lay: item?.l || 0},
                            status: item.gstatus === 'OPEN' ? '' : 'suspended-box',
                        };
                    }

                    // Update SINGLES
                    if (updatedState[5].SINGLES[betName]) {
                        updatedState[5].SINGLES[betName] = {
                            ...updatedState[5].SINGLES[betName],
                            odds: {back: item?.b || 0, lay: item?.l || 0},
                            status: item.gstatus === 'OPEN' ? '' : 'suspended-box',
                        };
                    }
                });

                return updatedState;
            });
        };

        if (data?.sub) {
            updateOdds()
        }

        remark.current = data.remark || 'Welcome';
    }, [data]);

    

    const openPopup = (isBakOrLay, teamnam, oddvalue, betType = 'BASIC') => {
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

    // Helper function to find data in data.sub for Sicbo
    const findDataInSub = (teamName, betType) => {
        if (!data || !data.sub) return null;
        return data.sub.find(item => item.nat === teamName);
    };

    const casinoBetDataNew = (new_odds) => {
        stakeValue.current.value = new_odds
        
            loss.current = stakeValue.current.value;
            profit.current = profitData.current = (parseFloat(odds) * stakeValue.current.value).toFixed(2)
        
    }

    const placeBet = async () => {
        const bb = betType;
        const t = teamname.current;

        const indexPlayer = totalPlayers.findIndex(item => item[bb]);

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
            playerStatuses: totalPlayers?.[0]?.BASIC['Small']?.status || '',
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
        <CasinoLayout raceClass="sicbo" ruleDescription={ruleDescription} hideLoading={hideLoading}
                      isBack={backOrLay} teamname={teamname} handleStakeChange={casinoBetDataNew} odds={odds}
                      stakeValue={stakeValue} setOdds={setOdds} placeBet={placeBet}
                      submitButtonDisable={submitButtonDisable} data={data} roundId={roundId} setRoundId={setRoundId}
                      sportList={sportList}
                      setSportList={setSportList} setData={setData} setLastResult={setLastResult}
                      getMinMaxLimits={getMinMaxLimits}>
            <div className="casino-table">
                <div className="d-none d-xl-block">
                    <div className="sicbo-top">
                        <div className="sicbo-top-box sicbo-title-box">1:1 Lose to Any Triple</div>
                        <div className="sicbo-top-box sicbo-title-box">30:1</div>
                        <div className="sicbo-top-box sicbo-title-box">1:1 Lose to Any Triple</div>
                    </div>
                    <div className="sicbo-middle">
                        <div className={`sicbo-middle-small sicbo-square-box ${totalPlayers[0].BASIC['Small']?.status || ''}`}
                             onClick={() => openPopup('back', 'Small', totalPlayers[0].BASIC['Small']?.odds?.back, 'BASIC')}>
                            <div>Small</div>
                            <div className="sicbo-box-value">4-10</div>
                            
                        </div>
                        <div className="sicbo-middle-midle">
                            <div className="sicbo-middle-top-row">
                                <div className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${totalPlayers[0].BASIC['ODD']?.status || ''}`}
                                     onClick={() => openPopup('back', 'ODD', totalPlayers[0].BASIC['ODD']?.odds?.back, 'BASIC')}>
                                    <div>ODD</div>
                                    <div className="sicbo-box-value">1:1</div>
                                </div>
                                {[4,5,6,7,8,9,10].map(num => {
                                    const staticRates = {
                                        4: '50:1',
                                        5: '20:1', 
                                        6: '15:1',
                                        7: '12:1',
                                        8: '8:1',
                                        9: '6:1',
                                        10: '6:1'
                                    };
                                    return (
                                        <div key={num} className={`sicbo-middle-top-box sicbo-square-box ${totalPlayers[3].TOTALS[`Total ${num}`]?.status || ''}`}
                                             onClick={() => openPopup('back', `Total ${num}`, totalPlayers[3].TOTALS[`Total ${num}`]?.odds?.back, 'TOTALS')}>
                                            <div>{num}</div>
                                            <div className="sicbo-box-value">{staticRates[num]}</div>
                                        </div>
                                    );
                                })}
                                <div className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${totalPlayers[0].BASIC['Any Triple']?.status || ''}`}
                                     onClick={() => openPopup('back', 'Any Triple', totalPlayers[0].BASIC['Any Triple']?.odds?.back, 'BASIC')}>
                                    <div>Any Triple</div>
                                </div>
                                {[11,12,13,14,15,16,17].map(num => {
                                    const staticRates = {
                                        11: '6:1',
                                        12: '6:1',
                                        13: '8:1',
                                        14: '12:1',
                                        15: '15:1',
                                        16: '20:1',
                                        17: '50:1'
                                    };
                                    return (
                                        <div key={num} className={`sicbo-middle-top-box sicbo-square-box ${totalPlayers[3].TOTALS[`Total ${num}`]?.status || ''}`}
                                             onClick={() => openPopup('back', `Total ${num}`, totalPlayers[3].TOTALS[`Total ${num}`]?.odds?.back, 'TOTALS')}>
                                            <div>{num}</div>
                                            <div className="sicbo-box-value">{staticRates[num]}</div>
                                        </div>
                                    );
                                })}
                                <div className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${totalPlayers[0].BASIC['Even']?.status || ''}`}
                                     onClick={() => openPopup('back', 'Even', totalPlayers[0].BASIC['Even']?.odds?.back, 'BASIC')}>
                                    <div>Even</div>
                                    <div className="sicbo-box-value">1:1</div>
                                </div>
                            </div>
                            <div className="sicbo-middle-middle-row">
                                <div className="sicbo-cube-box-container">
                                    <div className="sicbo-top-box sicbo-title-box">
                                        <span>1:1 on Sinlge</span>
                                        <span>2:1 on Double</span>
                                        <span>3:1 on Tripple</span>
                                    </div>
                                    <div className="sicbo-cube-box-group">
                                        {[1,2,3,4,5,6].map(num => (
                                            <div key={num} className={`sicbo-cube-box sicbo-square-box sicbo-cube-single ${totalPlayers[5].SINGLES[`Single ${num}`]?.status || ''}`}
                                                 onClick={() => openPopup('back', `Single ${num}`, totalPlayers[5].SINGLES[`Single ${num}`]?.odds?.back, 'SINGLES')}>
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="sicbo-cube-box-container">
                                    <div className="sicbo-top-box sicbo-title-box">8:1 Double</div>
                                    <div className="sicbo-cube-box-group">
                                        {[1,2,3,4,5,6].map(num => (
                                            <div key={num} className={`sicbo-cube-box sicbo-square-box sicbo-cube-double ${totalPlayers[1].DOUBLES[`Double ${num}`]?.status || ''}`}
                                                 onClick={() => openPopup('back', `Double ${num}`, totalPlayers[1].DOUBLES[`Double ${num}`]?.odds?.back, 'DOUBLES')}>
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="sicbo-cube-box-container">
                                    <div className="sicbo-top-box sicbo-title-box">150:1 Each Tripple</div>
                                    <div className="sicbo-cube-box-group">
                                        {[1,2,3,4,5,6].map(num => (
                                            <div key={num} className={`sicbo-cube-box sicbo-square-box sicbo-cube-tripple ${totalPlayers[2].TRIPLES[`Triple ${num}`]?.status || ''}`}
                                                 onClick={() => openPopup('back', `Triple ${num}`, totalPlayers[2].TRIPLES[`Triple ${num}`]?.odds?.back, 'TRIPLES')}>
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`sicbo-middle-big sicbo-square-box ${totalPlayers[0].BASIC['BIG']?.status || ''}`}
                             onClick={() => openPopup('back', 'BIG', totalPlayers[0].BASIC['BIG']?.odds?.back, 'BASIC')}>
                            <div>Big</div>
                            <div className="sicbo-box-value">11-17</div>
                        </div>
                    </div>
                    <div className="sicbo-bottom">
                        <div className="sicbo-cube-box-container">
                            <div className="sicbo-top-box sicbo-title-box">5:1 Two Dice</div>
                            <div className="sicbo-cube-box-group">
                                {[
                                    [1,2],[1,3],[1,4],[1,5],[1,6],
                                    [2,3],[2,4],[2,5],[2,6],
                                    [3,4],[3,5],[3,6],
                                    [4,5],[4,6],[5,6]
                                ].map((combo, index) => {
                                    const comboName = `Combination ${combo[0]} and ${combo[1]}`;
                                    return (
                                        <div key={index} className={`sicbo-cube-box sicbo-square-box sicbo-cube-combination ${totalPlayers[4].COMBINATIONS[comboName]?.status || ''}`}
                                             onClick={() => openPopup('back', comboName, totalPlayers[4].COMBINATIONS[comboName]?.odds?.back, 'COMBINATIONS')}>
                                            <img src={`/img/dice/dice${combo[0]}.png`} alt={`Dice ${combo[0]}`} />
                                            <img src={`/img/dice/dice${combo[1]}.png`} alt={`Dice ${combo[1]}`} />
                                            
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-xl-none w-100">
                    <div className="sicbo-top">
                        <div className="sicbo-cube-box-container">
                            <div className="sicbo-top-box sicbo-title-box">1:1 Lose to Any Triple</div>
                            <div className="sicbo-cube-box-group">
                                <div className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${totalPlayers[0].BASIC['Small']?.status || ''}`}
                                     onClick={() => openPopup('back', 'Small', totalPlayers[0].BASIC['Small']?.odds?.back, 'BASIC')}>
                                    <div>Small</div>
                                    <div className="sicbo-box-value">4-10</div>
                                    
                                </div>
                                <div className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${totalPlayers[0].BASIC['ODD']?.status || ''}`}
                                     onClick={() => openPopup('back', 'ODD', totalPlayers[0].BASIC['ODD']?.odds?.back, 'BASIC')}>
                                    <div>ODD</div>
                                    <div className="sicbo-box-value">{totalPlayers[0].BASIC['ODD']?.odds?.back || '1'}</div>
                                </div>
                            </div>
                        </div>
                        <div className="sicbo-cube-box-container">
                            <div className="sicbo-top-box sicbo-title-box">30:1</div>
                            <div className="sicbo-cube-box-group">
                                <div className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${totalPlayers[0].BASIC['Any Triple']?.status || ''}`}
                                     onClick={() => openPopup('back', 'Any Triple', totalPlayers[0].BASIC['Any Triple']?.odds?.back, 'BASIC')}>
                                    <div>Any Triple</div>
                                </div>
                            </div>
                        </div>
                        <div className="sicbo-cube-box-container">
                            <div className="sicbo-top-box sicbo-title-box">1:1 Lose to Any Triple</div>
                            <div className="sicbo-cube-box-group">
                                <div className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${totalPlayers[0].BASIC['Even']?.status || ''}`}
                                     onClick={() => openPopup('back', 'Even', totalPlayers[0].BASIC['Even']?.odds?.back, 'BASIC')}>
                                    <div>Even</div>
                                    <div className="sicbo-box-value">{totalPlayers[0].BASIC['Even']?.odds?.back || '1'}</div>
                                </div>
                                <div className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${totalPlayers[0].BASIC['BIG']?.status || ''}`}
                                     onClick={() => openPopup('back', 'BIG', totalPlayers[0].BASIC['BIG']?.odds?.back, 'BASIC')}>
                                    <div>Big</div>
                                    <div className="sicbo-box-value">{totalPlayers[0].BASIC['BIG']?.odds?.back || '1'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="sicbo-middle">
                        <div className="sicbo-middle-left">
                            <div className="sicbo-cube-box-container">
                                <div className="sicbo-top-box sicbo-title-box">8:1 Each Double</div>
                                <div className="sicbo-cube-box-group">
                                        {[1,2,3,4,5,6].map(num => (
                                            <div key={num} className={`sicbo-cube-box sicbo-square-box sicbo-cube-double ${totalPlayers[1].DOUBLES[`Double ${num}`]?.status || ''}`}
                                                 onClick={() => openPopup('back', `Double ${num}`, totalPlayers[1].DOUBLES[`Double ${num}`]?.odds?.back, 'DOUBLES')}>
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                                
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="sicbo-cube-box-container">
                                <div className="sicbo-top-box sicbo-title-box">150:1 Each Triple</div>
                                <div className="sicbo-cube-box-group">
                                        {[1,2,3,4,5,6].map(num => (
                                            <div key={num} className={`sicbo-cube-box sicbo-square-box sicbo-cube-tripple ${totalPlayers[2].TRIPLES[`Triple ${num}`]?.status || ''}`}
                                                 onClick={() => openPopup('back', `Triple ${num}`, totalPlayers[2].TRIPLES[`Triple ${num}`]?.odds?.back, 'TRIPLES')}>
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                                
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className="sicbo-middle-right">
                            <div className="sicbo-middle-top-row">
                                {[4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(num => (
                                    <div key={num} className={`sicbo-middle-top-box sicbo-square-box ${totalPlayers[3].TOTALS[`Total ${num}`]?.status || ''}`}
                                         onClick={() => openPopup('back', `Total ${num}`, totalPlayers[3].TOTALS[`Total ${num}`]?.odds?.back, 'TOTALS')}>
                                        <div>{num}</div>
                                        <div className="sicbo-box-value">{totalPlayers[3].TOTALS[`Total ${num}`]?.odds?.back || '0'}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="sicbo-bottom">
                                <div className="sicbo-cube-box-container">
                                    <div className="sicbo-top-box sicbo-title-box">5:1 Two Dice</div>
                                    <div className="sicbo-cube-box-group">
                                        {[
                                            [1,2],[1,3],[1,4],[1,5],[1,6],
                                            [2,3],[2,4],[2,5],[2,6],
                                            [3,4],[3,5],[3,6],
                                            [4,5],[4,6],[5,6]
                                        ].map((combo, index) => {
                                            const comboName = `Combination ${combo[0]} and ${combo[1]}`;
                                            return (
                                        <div key={index} className={`sicbo-cube-box sicbo-square-box sicbo-cube-combination ${totalPlayers[4].COMBINATIONS[comboName]?.status || ''}`}
                                             onClick={() => openPopup('back', comboName, totalPlayers[4].COMBINATIONS[comboName]?.odds?.back, 'COMBINATIONS')}>
                                            <img src={`/img/dice/dice${combo[0]}.png`} alt={`Dice ${combo[0]}`} />
                                            <img src={`/img/dice/dice${combo[1]}.png`} alt={`Dice ${combo[1]}`} />
                                            
                                        </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sicbo-middle-middle-row">
                            <div className="sicbo-cube-box-container">
                                <div className="sicbo-top-box sicbo-title-box">
                                    <span>1:1 on Sinlge</span>
                                    <span>2:1 on Double</span>
                                    <span>3:1 on Tripple</span>
                                </div>
                                <div className="sicbo-cube-box-group">
                                        {[1,2,3,4,5,6].map(num => (
                                            <div key={num} className={`sicbo-cube-box sicbo-square-box sicbo-cube-single ${totalPlayers[5].SINGLES[`Single ${num}`]?.status || ''}`}
                                                 onClick={() => openPopup('back', `Single ${num}`, totalPlayers[5].SINGLES[`Single ${num}`]?.odds?.back, 'SINGLES')}>
                                                <img src={`/img/dice/dice${num}.png`} alt={`Dice ${num}`} />
                                                
                                            </div>
                                        ))}
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

export default Sicbo;