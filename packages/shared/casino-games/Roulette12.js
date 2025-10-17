import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";
import { Modal } from "react-bootstrap";

import axiosFetch, {
  RouletteNumberMappings,
  placeCasinoBet,
  exposureCheck,
  getGlobalTimer,
  isAdminRoute,
} from "../utils/Constants";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import { CasinoContext } from "../contexts/CasinoContext";

import Notify from "../utils/Notify";
import { useSelector, useDispatch } from "react-redux";
import {
  selectChip,
  setCard,
  setPlaceBets,
  resetPlaceBets,
  undoBet,
  resetState,
  getBetTypeName,
  calculateRouletteOdds,
  setOurroulleteRates,
  setStatisticsData,
} from "../store/slices/rouletteSlice";
import CoinPlaceHolder from "../components/casino/Roulette/CoinPlaceHolder";

const Roulette12 = () => {
  const [roundId, setRoundId] = useState("");
  const [hoveredBetIds, setHoveredBetIds] = useState(new Set());
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const { mybetModel, rouletteStatistics, shouldBlinkForRoulette } = useContext(CasinoContext);
  const statisticsData = useSelector((state) => state.roulette?.statisticsData || {});


  // Redux state and dispatch
  const dispatch = useDispatch();
  const selectedChip = useSelector(
    (state) => state.roulette?.selectedChip || 25
  );
  const card = useSelector((state) => state.roulette?.card || null);
  const placeBets = useSelector((state) => state.roulette?.placeBets || []);
  const ourroulleteRates = useSelector(
    (state) =>
      state.roulette?.ourroulleteRates || {
        Single: 0,
        Split: 0,
        Street: 0,
        Corner: 0,
      }
  );

  // Number mappings for hover effects
  const { match_id } = useParams();
  const ruleDescription = match_id !== "ourroullete" ? `
  <div>
    <style type="text/css">
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
      .rules-section {
        text-align: left;
        margin-bottom: 10px;
      }
      .rules-section .table {
        color: #fff;
        border:1px solid #444;
        background-color: #222;
        font-size: 12px;
      }
      .rules-section .table td, .rules-section .table th {
        border-bottom: 1px solid #444;
      }
      .rules-section ul li, .rules-section p {
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
      .rules-section .list-style, .rules-section .list-style li {
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
      .rule-inner-icon {
        background-color: #fff;
        color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;
        font-size: 24px;
      }
    </style>
  
    <div class="rules-section">
      <h6 class="rules-highlight">Game Rules:</h6>
      <p>The objective in Roulette is to predict the number on which the ball will land by placing one or more bets that cover that particular number. The wheel in European Roulette includes the numbers 1-36 plus a single 0 (zero).</p>
      <p>After betting time has expired, the ball is spun within the Roulette wheel. The ball will eventually come to rest in one of the numbered pockets within the wheel. You win if you have placed a bet that covers that particular number.</p>
    </div>
  
    <div class="rules-section">
      <h6 class="rules-highlight">Bet Types:</h6>
      <p>You can place many different kinds of bets on the Roulette table. Bets can cover a single number or a certain range of numbers, and each type of bet has its own payout rate.</p>
      <p>Bets made on the numbered spaces on the betting area, or on the lines between them, are called Inside Bets, while bets made on the special boxes below and to the side of the main grid of numbers are called Outside Bets.</p>
    </div>
  
    <div class="rules-section">
      <h6 class="rules-highlight">INSIDE BETS:</h6>
      <ul class="pl-2 pr-2 list-style">
        <li><b>Straight Up</b> — place your chip directly on any single number (including zero).</li>
        <li><b>Split Bet</b> — place your chip on the line between any two numbers, either on the vertical or horizontal.</li>
        <li><b>Street Bet</b> — place your chip at the end of any row of numbers. A Street Bet covers remaining numbers on that Street.</li>
        <li><b>Corner Bet</b> — place your chip at the corner (central intersection) where four numbers meet. All remaining numbers on that corner are covered.</li>
      </ul>
      <br><br>
    </div>
  
    <div class="rules-section">
      <h6 class="rules-highlight">OUTSIDE BETS:</h6>
      <ul class="pl-2 pr-2 list-style">
        <li><b>Column Bet</b> — place your chip in one of the boxes marked "2 to 1" at the end of the column that covers all remaining numbers in that column. The zero is not covered by any column bet.</li>
        <li><b>Dozen Bet</b> — place your chip in one of the three boxes marked "1st 12," "2nd 12" or "3rd 12" to cover the remaining numbers alongside the box.</li>
        <li><b>Red/Black</b> — place your chip in the Red or Black box to cover the all remaining red or all remaining black numbers. The zero is not covered by these bets.</li>
        <li><b>Even/Odd</b> — place your chip in one of these boxes to cover the remaining even or remaining odd numbers. The zero is not covered by these bets.</li>
        <li><b>1-18/19-36</b> — place your chip in either of these boxes to cover the first or second set of remaining numbers. The zero is not covered by these bets.</li>
      </ul>
      <br>
    </div>
  
    ${
      match_id !== "ourroullete"
        ? `
    <div class="rules-section">
      <h6 class="rules-highlight">Winning Numbers:</h6>
      <p>The WINNING NUMBERS display shows the most recent winning numbers.</p>
    </div>
  
    <div class="rules-section">
      <h6 class="rules-highlight">Place Bets &amp; Payouts:</h6>
      <p>In Settings icon shows the minimum and maximum allowed bet limits at the table, which may change from time to time. Open the Bet Limits to check your current limits.</p>
      <p>In Settings icon also shows the payouts of all covers section.</p>
      <p>To participate in the game, you must have sufficient funds to cover your bets. You can see your current BALANCE on your screen.</p>
    </div>
  
    <div class="rules-section">
      <h6 class="rules-highlight">PLACE YOUR BETS:</h6>
      <p>The CHIP DISPLAY allows you to select the value of each chip you wish to bet. Only chips of denominations that can be covered by your current balance will be enabled and you can change chips amount from Set Button Values.</p>
      <p>Once you have selected a chip, place your bet by simply clicking/tapping the appropriate betting spot on the game table. Each time you click/tap the betting spot, the amount of your bet increases by the value of the selected chip or up to the maximum limit for the type of bet you have selected. Once you have bet the maximum limit, no additional funds will be accepted for that bet, and a message will appear above your bet to notify you that you have bet the maximum.</p>
      <p><b>NOTE:</b> Please do not minimise your browser or open any other tab in your browser while betting time remains, and you have placed bets on the table. Such actions may be interpreted as leaving the game, and your bets will therefore be declined for that particular game round.</p>
    </div>
  
    <div class="rules-section">
      <p>The Clear button becomes available after you have placed any bet. that clear all your bets.</p>
      <p><span class="rule-inner-icon"><i class="fas fa-trash"></i></span></p>
      <p>The Rebet button allows you to repeat all bets from the previous game round. This button is available only before the first chip is placed.</p>
      <p><span class="rule-inner-icon"><i class="fas fa-redo"></i></span></p>
      <p>The Undo button removes the last bet you placed.</p>
      <p><span class="rule-inner-icon"><i class="fas fa-undo"></i></span></p>
    </div>
  
    <div class="rules-section">
      <h6 class="rules-highlight">Back table limits:</h6>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr><th>Covers</th><th>Team</th><th>Pays</th></tr>
          </thead>
          <tbody>
            <tr><td>1 Nr</td><td>Straight bet</td><td>35:1</td></tr>
            <tr><td>2 Nrs</td><td>Split bet</td><td>17:1</td></tr>
            <tr><td>3 Nrs</td><td>Street bet</td><td>11:1</td></tr>
            <tr><td>4 Nrs</td><td>Corner bet</td><td>8:1</td></tr>
            <tr><td>12 Nrs</td><td>Dozen bet</td><td>2:1</td></tr>
            <tr><td>18 Nrs</td><td>Half board</td><td>1:1</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    `
        : `<div><div class="rules-section">
                                            <p>Each bet covers a different set of numbers and offers different payout odds. Bet spots will be highlighted.</p>
                                            <p>Good Luck!!!</p>
                                        </div></div>`
    }
  
    ${
      (match_id === "roulette12" || match_id === "roulette11")
        ? `
    <div class="rules-section">
      <h6 class="rules-highlight">Lay table limits:</h6>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr><th>Covers</th><th>Team</th><th>Pays</th></tr>
          </thead>
          <tbody>
            <tr><td>1 Nr</td><td>Straight bet</td><td>39:1</td></tr>
            <tr><td>2 Nrs</td><td>Split bet</td><td>19.5:1</td></tr>
            <tr><td>3 Nrs</td><td>Street bet</td><td>13:1</td></tr>
            <tr><td>4 Nrs</td><td>Corner bet</td><td>9.75:1</td></tr>
            <tr><td>12 Nrs</td><td>Dozen bet</td><td>3.25:1</td></tr>
            <tr><td>18 Nrs</td><td>Half board</td><td>2.1:1</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    `
        : ""
    }
  </div>
  ` : `<div><style type="text/css">
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

<div class="rules-section">
                                            <p>Unique Roulette is a unique game compared to other traditional Roulette. This game is played with numbered cards from 0 to 36. Dealer will draw a card one by one until only one card is left in the deck. Only available numbers in the deck are open for bet in every round and odds are dynamics based on numbers left in the deck.</p>
                                            <p>Bets made on the numbered spaces on the betting area, or on the lines between them, are called Inside Bets, while bets made on the special boxes below and to the side of the main grid of numbers are called Outside Bets.</p>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">INSIDE BETS:</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li><b>Straight Up</b> — place your chip directly on any single number (including zero).</li>
                                                <li><b>Split Bet</b> — place your chip on the line between any two numbers, either on the vertical or horizontal.</li>
                                                <li><b>Street Bet</b> — place your chip at the end of any row of numbers. A Street Bet covers remaining numbers on that Street.</li>
                                                <li><b>Corner Bet</b> — place your chip at the corner (central intersection) where four numbers meet. All remaining numbers on that corner are covered.</li>
                                                <li><b>Line Bet</b> — place your chip at the end of two rows on the intersection between the two rows. A line bet covers all the remaining numbers in both rows.</li>
                                            </ul>
                                            <br>
                                            <br>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">OUTSIDE BETS:</h6>
                                            <ul class="pl-2 pr-2 list-style">
                                                <li><b>Column Bet</b> — place your chip in one of the boxes marked "2 to 1" at the end of the column that covers all remaining numbers in that column. The zero is not covered by any column bet.</li>
                                                <li><b>Dozen Bet</b> — place your chip in one of the three boxes marked "1st 12," "2nd 12" or "3rd 12" to cover the remaining numbers alongside the box.</li>
                                                <li><b>Red/Black</b> — place your chip in the Red or Black box to cover the all remaining red or all remaining black numbers. The zero is not covered by these bets.</li>
                                                <li><b>Even/Odd</b> — place your chip in one of these boxes to cover the remaining even or remaining odd numbers. The zero is not covered by these bets.</li>
                                                <li><b>1-18/19-36</b> — place your chip in either of these boxes to cover the first or second set of remaining numbers. The zero is not covered by these bets.</li>
                                            </ul>
                                            <br>
                                        </div></div><div><div class="rules-section">
                                            <p>Each bet covers a different set of numbers and offers different payout odds. Bet spots will be highlighted.</p>
                                            <p>Good Luck!!!</p>
                                        </div></div>`;
  
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);
  const [sportList, setSportList] = useState({});
  const stakeValue = useRef(0);
  const [odds, setOdds] = useState(0);
  const [backOrLay, setbackOrLay] = useState("back");

  const { setBetType, setPopupDisplayForDesktop, betType } =
    useContext(SportsContext);

  const [hideLoading, setHideLoading] = useState(true);

  const teamNames = useRef([]);
  const [data, setData] = useState([]);
  const [playerStatuses, setPlayerStatuses] = useState({});
  const remark = useRef("Welcome to Roulette12");
  const [lastResult, setLastResult] = useState({});
  const roundIdSaved = useRef("");

  // Optimize by creating a constant for bets array
  const bets = data?.sub || [];

  // Effect to handle showing latest result for 2 seconds
  useEffect(() => {
    if (data?.card && data.card !== "") {
      dispatch(setCard(data.card));
    }
  }, [data?.card]);
  const lastRatesRef = useRef(null);

  useEffect(() => {
    if (data?.sub2 && match_id === "ourroullete") {
      const newRates = {
        Single: data.sub2.Single,
        Split: data.sub2.Split,
        Street: data.sub2.Street,
        Corner: data.sub2.Corner,
      };

      // Compare with last dispatched
      if (JSON.stringify(newRates) !== JSON.stringify(lastRatesRef.current)) {
        dispatch(setOurroulleteRates(newRates));
        lastRatesRef.current = newRates;
      }
    }
  }, [data?.sub2, match_id]);

  useEffect(() => {
    dispatch(resetState());
  }, []);

  useEffect(() => {
    dispatch(setCard(null));
    roundIdSaved.current = roundId;
    dispatch(resetPlaceBets());
  }, [roundId]);

  // Fetch matched bet data and populate Redux store
  useEffect(() => {
    const fetchMatchedBets = async () => {
      try {
        const response = mybetModel;

        if (response) {
          // Convert API data to Redux format and populate placeBets
          const convertedBets = response.map((bet) => ({
            bet_side: bet.extra === "LAY" ? "lay" : "back",
            odds: parseFloat(bet.bet_odds),
            team_name: bet.team_name,
            only_number: bet.team_name.split(" - ")[0], // For roulette, team_name is the number
            bet_amount: parseFloat(bet.bet_amount),
          }));

          dispatch(resetPlaceBets());
          convertedBets.forEach((bet) => {
            dispatch(setPlaceBets(bet));
          });
        }
      } catch (error) {
        console.error("Error fetching matched bets:", error);
      }
    };

    

    fetchMatchedBets();
  }, [sportList?.id, mybetModel]);

  const teamname = useRef("");
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);

  useEffect(() => {
    setBetType("ROULETTE");

    // Initialize player amounts and statuses when data is available
    if (bets.length > 0) {
      const initialStatuses = {};

      bets.forEach((bet) => {
        initialStatuses[bet.n] = bet.s === 0 ? "suspended-box" : "active";
      });

      setPlayerStatuses(initialStatuses);
      teamNames.current = bets.map((bet) => bet.n);
    }
  }, [bets]);

  const casinoBetDataNew = (value) => {
    const newValue = parseFloat(value) || 0;
    stakeValue.current = newValue;

    if (teamname.current) {
      const foundData = bets.find((bet) => bet.n === teamname.current);
      if (foundData) {
        setOdds(foundData.l);
      }
    }
  };

  // Column mapping for 2to1 bets

  // Helper function to get bets for a team with bet side filtering
  const getBetsForTeam = (teamName, betSide = backOrLay) => {
    return placeBets.filter(
      (bet) => bet.team_name === teamName && bet.bet_side === betSide
    );
  };

  // Helper function to calculate total amount for bets
  const getTotalAmount = (bets) => {
    return bets.reduce((sum, bet) => sum + bet.bet_amount, 0);
  };

  // Optimized hover handlers
  const handleMouseEnter = (numbers) => {
    setHoveredBetIds((prev) => {
      const newSet = new Set(prev);
      numbers.forEach((num) => newSet.add(num.toString()));
      return newSet;
    });
  };

  const handleMouseLeave = (numbers) => {
    setHoveredBetIds((prev) => {
      const newSet = new Set(prev);
      numbers.forEach((num) => newSet.delete(num.toString()));
      return newSet;
    });
  };

  // Single notification flag to prevent multiple triggers
  const [notificationTriggered, setNotificationTriggered] = useState(false);

  // API functions for bet management
  const handleUndoBet = async () => {
    try {
      const response = await axiosFetch(
        `delete-latest-bet/${sportList.id}`,
        "get"
      );
      if (response.data.status === true) {
        Notify("Bet Undo Successfully", null, null, "success");
        dispatch(undoBet());
      } else {
        Notify("Bet Undo Failed", null, null, "danger");
      }
    } catch (error) {
      console.error("Error undoing bet:", error);
      Notify("Error undoing bet", null, null, "danger");
    }
  };

  const handleClearAllBets = async () => {
    try {
      const response = await axiosFetch(
        `clear-all-bets-roulette/${sportList.id}`,
        "get"
      );
      if (response.data.status === true) {
        Notify("All bets cleared successfully", null, null, "success");
        dispatch(resetPlaceBets());
      } else {
        Notify("Failed to clear bets", null, null, "danger");
      }
    } catch (error) {
      console.error("Error clearing bets:", error);
      Notify("Error clearing bets", null, null, "danger");
    }
  };

  const handleRepeatBets = async () => {
    try {
      // Reset notification flag
      setNotificationTriggered(false);

      const response = await axiosFetch(
        `repeat-bets-roulette/${sportList.id}`,
        "get"
      );
      if (
        response.data.status === true &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        // Clear existing bets first
        dispatch(resetPlaceBets());

        // Process each bet and call openPopup for each one
        const betsToRepeat = response.data.data;

        for (const bet of betsToRepeat) {
          // Prepare bet data for openPopup function
          const betData = {
            bet_side: bet.extra === "LAY" ? "lay" : "back",
            back_bet: parseFloat(bet.bet_odds),
            lay_bet: parseFloat(bet.bet_odds),
            team_name: bet.team_name,
            only_number: bet.team_name.split(" - ")[0],
            notify: true,
          };

          // Call openPopup for each bet
          await openPopup(betData);
        }

        // Show notification only once after all bets are processed
        if (!notificationTriggered) {
          Notify("Bet Repeated Successfully", null, null, "success");
          setNotificationTriggered(true);
        }
      } else {
        Notify("No recent bets found to repeat", null, null, "warning");
      }
    } catch (error) {
      console.error("Error repeating bets:", error);
      Notify("Error repeating bets", null, null, "danger");
    }
  };

  const openPopup = async (betData) => {
    const isBack = betData.bet_side === "back" ? "back" : "lay";
    const odds = isBack === "back" ? betData.back_bet : betData.lay_bet;

    // Set teamname for the bet
    teamname.current = betData.team_name;

    const which_type = getBetTypeName(betData.team_name.split(" - ")[1]);

    let odds_current = calculateRouletteOdds(which_type, isBack);

    const type = betData.team_name.split(" - ")[1];

    if (match_id === "ourroullete") {
      if (ourroulleteRates[type] !== undefined) {
        odds_current = parseFloat(ourroulleteRates[type]);
      }
    }

    // Update odds
    setOdds(odds_current);

    // Calculate profit and loss
    const betAmount = selectedChip;
    const profitValue =
      isBack === "back" ? betAmount * (odds_current - 1) : betAmount;
    const lossValue =
      isBack === "back" ? betAmount : betAmount * (odds_current - 1);

    profit.current = profitValue;
    loss.current = lossValue;

    // Update stakeValue to match API expectations
    stakeValue.current = { value: betAmount };

    // Prepare bet data for API call
    const betApiData = {
      sportList,
      roundId,
      backOrLay: isBack,
      teamname,
      odds,
      profit,
      loss,
      betType: "ROULETTE",
      stakeValue,
      match_id,
      roundIdSaved,
      totalPlayers: playerStatuses,
      playerStatuses,
      setHideLoading,
      setPopupDisplayForDesktop: setBetType,
      setSubmitButtonDisable,
      resetBetFields: () => {},

      profitData,

      Notify,
    };

    // Call the API to place the bet
    const success = await placeCasinoBet(betApiData, {
      noNotify: () => {
        return typeof betData.notify !== "undefined" ? betData.notify : false;
      },
    });

    if (success) {
      // Only add to Redux state if API call was successful
      const dispatchData = {
        bet_side: isBack,
        odds: odds,
        team_name: betData.team_name,
        only_number: betData.only_number,
        bet_amount: selectedChip,
      };
      
      dispatch(setPlaceBets(dispatchData));
    }
  };

  // Function to get current min/max limits for the active bet
  const getMinMaxLimits = () => {
    if (teamname.current && betType) {
      const foundData = bets.find((bet) => bet.n === teamname.current);
      if (foundData) {
        return {
          min: foundData.min || 25,
          max: foundData.max || 100000,
        };
      }
    }
    return { min: 25, max: 100000 }; // Default fallback
  };

  // Get number color based on roulette rules
  const getNumberColor = (number) => {
    const num = parseInt(number);
    if (num === 0) return "green";

    const redNumbers = [
      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
    ];
    return redNumbers.includes(num) ? "red" : "black";
  };

  const renderVideoBox = () => {
    // Get the latest and first results from lastResult
    const getLatestResult = () => {
      return data?.card !== "" ? data?.card : null;
    };

    const latestResult = getLatestResult();

    const latestNumber = latestResult;

    return (
      <>
        <div className="casino-video-cards">
          <div>
            <div className="flip-card-container">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    {card && (
                      <img
                        src={`/assets/img/roulette/${card}.png`}
                        alt={`Roulette ${card}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {((!isAdminRoute && playerStatuses && playerStatuses[0] == "active") ||
          (match_id === "ourroullete" && getGlobalTimer() > 4)) && (
          <div className="casino-coins-container">
            <div className="casino-coin-box">
              {[
                { value: 25, color: "#00ddff", label: "25" },
                { value: 50, color: "#00ddff", label: "50" },
                { value: 100, color: "#00ddff", label: "100" },
                { value: 200, color: "#99cc00", label: "200" },
                { value: 500, color: "#99cc00", label: "500" },
                { value: 1000, color: "#aa66cc", label: "1K" },
              ].map((chip) => (
                <div
                  key={chip.value}
                  className={`casino-coin ${
                    selectedChip === chip.value ? "active" : ""
                  }`}
                  onClick={() => dispatch(selectChip(chip.value))}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="bet-chip-holder"
                    style={{ "--g-chip-inner-color": chip.color }}
                  >
                    <div className="bet-chip">
                      <div className="bet-chip-front"></div>
                      <div className="bet-chip-top"></div>
                      <div className="bet-chip-amount">
                        <svg
                          className="bet-chip-amount-in"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 108 108"
                        >
                          <text
                            className="bet-chip-amount-label"
                            x="50%"
                            y="53.5%"
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fill="#fff"
                            fontSize="32"
                            fontWeight="700"
                          >
                            {chip.label}
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="coin-btns">
              <div>
                <button
                  className="btn btn-danger"
                  disabled={placeBets.length === 0}
                >
                  <i className="fas fa-undo"></i>
                  <span className="d-none d-md-flex" onClick={handleUndoBet}>
                    Undo Bet
                  </span>
                </button>
                <span className="d-md-none" disabled={placeBets.length === 0}>
                  Undo Bet
                </span>
              </div>
              {match_id !== "ourroullete" && (
                <>
                  <div>
                    <button className="btn btn-info" onClick={handleRepeatBets}>
                      <i className="fas fa-redo"></i>
                      <span className="d-none d-md-flex">Repeat</span>
                    </button>
                    <span className="d-md-none">Repeat</span>
                  </div>

                  <div>
                    <button
                      className="btn btn-warning"
                      onClick={handleClearAllBets}
                    >
                      <i className="fas fa-trash"></i>
                      <span className="d-none d-md-flex">Clear</span>
                    </button>
                    <span className="d-md-none">Clear</span>
                  </div>
                </>
              )}
            </div>
            
          </div>
        )}
      </>
    );
  };

  const renderStatisticsBoard = () => {
    return (
      <div className="transfer-board">
        {/* only roulette12 gets transfer-board */}
        {( match_id === "roulette12" ||
          match_id === "roulette11") && !isAdminRoute && (
            <div className="switch-board-icon">
              <div
                className={`back ${backOrLay === "back" ? "active" : ""}`}
                onClick={() => setbackOrLay("back")}
              >
                Back
              </div>
              <div
                className={`lay ${backOrLay === "lay" ? "active" : ""}`}
                onClick={() => setbackOrLay("lay")}
              >
                Lay
              </div>
            </div>
          )}

        {/* both roulette12 & roulette13 get Statistics */}
        {( match_id === "roulette12" ||
          match_id === "roulette13" ||
          match_id === "roulette11") && !isAdminRoute && (
          <h5 className="d-block d-lg-none">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowStatisticsModal(true);
              }}
            >
              Statistics
            </a>
          </h5>
        )}
      </div>
    );
  };

  const rouletteClass = () => {
    if (match_id === "ourroullete") return "";
    if (match_id === "roulette13") {
      return "roulette11 roulette13";
    }
    return "roulette11";
  };

  const showFullVideo = () => {
    if (match_id === "ourroullete") {
      return getGlobalTimer() <= 4;
    }
    return playerStatuses[0] && playerStatuses[0] === "active" ? false : true;
  };

  return (
    <CasinoLayout
      full_video={showFullVideo()}
      raceClass={`roulette ${rouletteClass()}`}
      ruleDescription={ruleDescription}
      hideLoading={hideLoading}
      isBack={backOrLay}
      teamname={teamname}
      handleStakeChange={casinoBetDataNew}
      odds={odds}
      casinoContainer={renderVideoBox}
      stakeValue={stakeValue}
      setOdds={setOdds}
      submitButtonDisable={submitButtonDisable}
      data={data}
      roundId={roundId}
      setRoundId={setRoundId}
      sportList={sportList}
      setSportList={setSportList}
      setData={setData}
      setLastResult={setLastResult}
      getMinMaxLimits={getMinMaxLimits}
      max={data.max}
      min={data.min}
    >
      <div className="casino-table">
        {renderStatisticsBoard()}
        <div className="casino-table-box">
          <div className="roulette-box-container">
            <div className="board-in">
              {/* Right side outside bets - Dynamic */}
              <div className="board-right">
                {bets
                  .filter((bet) => bet.i >= 136 && bet.i <= 138)
                  .sort((a, b) => b.i - a.i)
                  .map((bet) => (
                    <div
                      key={bet.i}
                      className={`board-cell yellow ${
                        bet.s === 0 ? "suspended-box" : ""
                      } ${hoveredBetIds.has(bet.n) ? "active" : ""}`}
                      onMouseEnter={() =>
                        handleMouseEnter(RouletteNumberMappings[bet.n] || [])
                      }
                      onMouseLeave={() =>
                        handleMouseLeave(RouletteNumberMappings[bet.n] || [])
                      }
                    >
                      <div className="board-cell-in">
                        <span className="board-text">2to1</span>
                        <div
                          className="bet-chip-area center-center coin-place"
                          id={bet.i}
                          onClick={() =>
                            bet.s === 1 &&
                            openPopup({
                              bet_side: backOrLay,
                              back_bet: bet.b,
                              lay_bet: bet.l,
                              team_name: bet.n + " - Column",
                              only_number: bet.n,
                            })
                          }
                        >
                          {(() => {
                            const teamName = bet.n + " - Column";
                            const betsForThisTeam = getBetsForTeam(teamName);

                            if (betsForThisTeam.length > 0) {
                              const totalAmount =
                                getTotalAmount(betsForThisTeam);
                              return (
                                <CoinPlaceHolder
                                  key={bet.i}
                                  amount={totalAmount}
                                />
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Bottom outside bets - Dynamic */}
              <div className="board-bottom">
                {bets
                  .filter(
                    (bet) =>
                      bet.i >= 133 &&
                      bet.i <= 144 &&
                      ![136, 137, 138].includes(bet.i)
                  )
                  .sort((a, b) => {
                    // Put ID 140 (19 to 36) at the end
                    if (a.i === 140) return 1;
                    if (b.i === 140) return -1;
                    return a.i - b.i;
                  })
                  .map((bet) => (
                    <div
                      key={bet.i}
                      className={`board-cell yellow ${
                        bet.s === 0 ? "suspended-box" : ""
                      } ${hoveredBetIds.has(bet.n) ? "active" : ""}`}
                      onMouseEnter={() =>
                        handleMouseEnter(RouletteNumberMappings[bet.n] || [])
                      }
                      onMouseLeave={() =>
                        handleMouseLeave(RouletteNumberMappings[bet.n] || [])
                      }
                    >
                      <div className="board-cell-in">
                        <span className="board-text">
                          {bet.n.replace(" to ", " - ")}
                        </span>
                        <div
                          className="bet-chip-area center-center coin-place"
                          id={bet.i}
                          onClick={() =>
                            bet.s === 1 &&
                            openPopup({
                              bet_side: backOrLay,
                              back_bet: bet.b,
                              lay_bet: bet.l,
                              team_name:
                                bet.i >= 138
                                  ? bet.n + " - Half"
                                  : bet.n.replace(" to ", " - ") + " - Dozen",
                              only_number: bet.n,
                            })
                          }
                        >
                          {(() => {
                            const teamName =
                              bet.i >= 138
                                ? bet.n.replace(" to ", " - ") + " - Half"
                                : bet.n.replace(" to ", " - ") + " - Dozen";
                            const betsForThisTeam = getBetsForTeam(teamName);

                            if (betsForThisTeam.length > 0) {
                              const totalAmount =
                                getTotalAmount(betsForThisTeam);
                              return (
                                <CoinPlaceHolder
                                  key={bet.i}
                                  amount={totalAmount}
                                />
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Center number grid */}
              <div className="board-center">
                {bets
                  .filter((bet) => bet.i >= 1 && bet.i <= 37)
                  .map((bet) => {
                    const color = getNumberColor(bet.n);

                    // Optimized getRelatedBets function
                    const getRelatedBets = (number) => {
                      const num = parseInt(number);
                      if (num === 0) return [];

                      const relatedBets = [];

                      // Find top-center bet (prioritize street, then split)
                      const topCenterBet = bets.find((b) => {
                        const numbers = b.n.split(",").map((n) => parseInt(n));

                        // Street bet: 3 numbers where current is last
                        if (numbers.length === 3 && numbers[2] === num)
                          return true;

                        // Split bet: 2 numbers where current is first
                        if (
                          numbers.length === 2 &&
                          numbers[0] === num &&
                          numbers[1] === num + 1
                        )
                          return true;

                        return false;
                      });

                      // Add top-center bet if found
                      if (
                        topCenterBet &&
                        ((topCenterBet.i >= 38 && topCenterBet.i <= 97) ||
                          (topCenterBet.i >= 98 && topCenterBet.i <= 109))
                      ) {
                        relatedBets.push({
                          ...topCenterBet,
                          position: "top-center",
                        });
                      }

                      // Find center-left bet (split only, different from top-center)
                      const centerLeftBet = bets.find((b) => {
                        const numbers = b.n.split(",").map((n) => parseInt(n));
                        return (
                          numbers.length === 2 &&
                          numbers[1] === num &&
                          b.i !== topCenterBet?.i
                        );
                      });

                      // Add center-left bet if found
                      if (
                        centerLeftBet &&
                        centerLeftBet.i >= 38 &&
                        centerLeftBet.i <= 97
                      ) {
                        relatedBets.push({
                          ...centerLeftBet,
                          position: "center-left",
                        });
                      }

                      // Find bottom-left bet (corner bet - 4 numbers containing current number)
                      // Only for numbers 1-36, not for 0
                      // NOT for leftmost column numbers (1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34)
                      if (num >= 1 && num <= 36 && num % 3 !== 1) {
                        const bottomLeftBet = bets.find((b) => {
                          const numbers = b.n
                            .split(",")
                            .map((n) => parseInt(n));
                          return (
                            numbers.length === 4 &&
                            numbers.includes(num) &&
                            b.i >= 110 &&
                            b.i <= 132
                          );
                        });

                        // Add bottom-left bet if found
                        if (bottomLeftBet) {
                          relatedBets.push({
                            ...bottomLeftBet,
                            position: "bottom-left",
                          });
                        }
                      }

                      return relatedBets;
                    };

                    const relatedBets = getRelatedBets(bet.n);

                    return (
                      <div
                        key={bet.i}
                        className={`board-cell ${color} ${
                          bet.s === 0 && parseFloat(bet.n) !== parseFloat(card)
                            ? "suspended-box"
                            : ""
                        } ${hoveredBetIds.has(bet.n) ? "active" : ""}`}
                      >
                        <div className="board-cell-in">
                          <span
                            className={`board-number ${
                              card !== null &&
                              parseFloat(card) === parseFloat(bet.n)
                                ? "pop-outin"
                                : ""
                            }`}
                          >
                            {bet.n}
                          </span>

                          {/* Render all related betting areas */}
                          {relatedBets.map((relatedBet) => (
                            <div
                              key={relatedBet.i}
                              className={`bet-chip-area ${relatedBet.position} coin-place`}
                              id={relatedBet.i}
                              onClick={() =>
                                relatedBet.s === 1 &&
                                openPopup({
                                  bet_side: backOrLay,
                                  back_bet: relatedBet.b,
                                  lay_bet: relatedBet.l,
                                  team_name:
                                    relatedBet.n +
                                    (relatedBet.position === "top-center"
                                      ? " - Street"
                                      : relatedBet.position === "bottom-left"
                                      ? " - Corner"
                                      : relatedBet.position === "center-left"
                                      ? " - Split"
                                      : " - Single"),
                                  only_number: relatedBet.n,
                                })
                              }
                              onMouseEnter={() =>
                                handleMouseEnter(relatedBet.n.split(","))
                              }
                              onMouseOut={() =>
                                handleMouseLeave(relatedBet.n.split(","))
                              }
                            >
                              {(() => {
                                const teamName =
                                  relatedBet.n +
                                  (relatedBet.position === "top-center"
                                    ? " - Street"
                                    : relatedBet.position === "bottom-left"
                                    ? " - Corner"
                                    : relatedBet.position === "center-left"
                                    ? " - Split"
                                    : " - Single");

                                const betsForThisTeam =
                                  getBetsForTeam(teamName);

                                if (betsForThisTeam.length > 0) {
                                  return (
                                    <CoinPlaceHolder
                                      key={relatedBet.i}
                                      amount={getTotalAmount(betsForThisTeam)}
                                    />
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          ))}

                          {/* Center betting area */}
                          <div
                            className="bet-chip-area center-center coin-place"
                            id={bet.i}
                            onMouseEnter={() => handleMouseEnter([bet.n])}
                            onMouseLeave={() => handleMouseLeave([bet.n])}
                            onClick={() =>
                              bet.s === 1 &&
                              openPopup({
                                bet_side: backOrLay,
                                back_bet: bet.b,
                                lay_bet: bet.l,
                                team_name: bet.n + " - Single",
                                only_number: bet.n,
                              })
                            }
                          >
                            {(() => {
                              const betsForThisNumber = placeBets.filter(
                                (bets) =>
                                  bets.only_number === bet.n &&
                                  bets.bet_side === backOrLay
                              );
                              if (betsForThisNumber.length > 0) {
                                return (
                                  <CoinPlaceHolder
                                    key={bet.n}
                                    amount={getTotalAmount(betsForThisNumber)}
                                  />
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

    
      </div>
      <marquee scrollamount="3" className="casino-remark m-b-10">
          {remark.current}
        </marquee>
        <div className="casino-last-result-title">
          <span>Last Result</span>
          <span>
            <a href="/casino-results/roulette12">View All</a>
          </span>
        </div>

        <CasinoLastResult
          sportList={sportList}
          lastResults={lastResult}
          data={data}
        />

        {match_id === "ourroullete" && (
          <div className="sidebar-box my-bet-container roulette-rules mt-2 d-xl-none">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th className="text-center">Single</th>
                    <th className="text-center">Split</th>
                    <th className="text-center">Street</th>
                    <th className="text-center">Corner</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">
                      <b>{ourroulleteRates.Single}</b>
                    </td>
                    <td className="text-center">
                      <b>{ourroulleteRates.Split}</b>
                    </td>
                    <td className="text-center">
                      <b>{ourroulleteRates.Street}</b>
                    </td>
                    <td className="text-center">
                      <b>{ourroulleteRates.Corner}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Statistics Modal */}
      <Modal
        show={showStatisticsModal}
        onHide={() => setShowStatisticsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Statistics</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="sidebar-box my-bet-container">
            <div className="">
              <div className="roulette11-table">
                {rouletteStatistics.map((row, rowIndex) => (
                  <div className="roulette11-table-row" key={rowIndex}>
                    {row.map((cell, cellIndex) => {
                      const key = Object.keys(cell)[0]; // e.g. "C1st12"
                      const label = cell[key]; // e.g. "1st12"
                      return (
                        <div className="roulette11-table-cell" key={cellIndex}>
                          <span>{label}:</span>
                          <b
                            className={shouldBlinkForRoulette ? "blink_me" : ""}
                          >
                            {statisticsData[key]
                              ? statisticsData[key] + "%"
                              : "-"}
                          </b>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </CasinoLayout>
  );
};

export default Roulette12;
