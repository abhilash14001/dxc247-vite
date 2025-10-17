import CasinoLayout from "../components/casino/CasinoLayout";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { SportsContext } from "../contexts/SportsContext";
import { AuthContext } from "../contexts/AuthContext";

import Notify from "../utils/Notify";
import axiosFetch, {
  
  resetBetFields,
  getExBySingleTeamNameCasino,
  placeCasinoBet,
} from "../utils/Constants";
import { CasinoLastResult } from "../components/casino/CasinoLastResult";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSelectQuestions,
  setSelectQuestions,
} from "../store/slices/kbcSlice";

const Kbc = () => {
  const dispatch = useDispatch();
  const selectedQuestions = useSelector(
    (state) => state.kbc?.selectedQuestions || []
  );
  // No need for fetchDataKBC as data fetching is handled by CasinoLayout
  const { getBalance } = useContext(AuthContext);
  const [roundId, setRoundId] = useState("");
  const [sportList, setSportList] = useState({});
  const [data, setData] = useState([]);
  const [lastResult, setLastResult] = useState({});
  const [submitButtonDisable, setSubmitButtonDisable] = useState(false);
  const [hideLoading, setHideLoading] = useState(true);
  const [backOrLay, setbackOrLay] = useState("back");
  const [odds, setOdds] = useState(0);
  const stakeValue = useRef(0);
  const teamname = useRef({});
  const loss = useRef(0);
  const profit = useRef(0);
  const profitData = useRef(0);
  const remark = useRef("Welcome");
  const roundIdSaved = useRef(null);
  const { match_id } = useParams();

  const [buttonSelected, setButtonSelected] = useState(false);
  const { setBetType, betType, setPopupDisplayForDesktop } =
    useContext(SportsContext);

  // KBC betting options state
  const [kbcOptions, setKbcOptions] = useState({
    redBlack: {
      red: { odds: 0, status: "suspended-box", amounts: "" },
      black: { odds: 0, status: "suspended-box", amounts: "" },
    },
    oddEven: {
      odd: { odds: 0, status: "suspended-box", amounts: "" },
      even: { odds: 0, status: "suspended-box", amounts: "" },
    },
    upDown: {
      up: { odds: 0, status: "suspended-box", amounts: "" },
      down: { odds: 0, status: "suspended-box", amounts: "" },
    },
    cardJudgement: {
      a23: { odds: 0, status: "suspended-box", amounts: "" },
      four56: { odds: 0, status: "suspended-box", amounts: "" },
      eight910: { odds: 0, status: "suspended-box", amounts: "" },
      jqk: { odds: 0, status: "suspended-box", amounts: "" },
    },
    suits: {
      spade: { odds: 0, status: "suspended-box", amounts: "" },
      heart: { odds: 0, status: "suspended-box", amounts: "" },
      club: { odds: 0, status: "suspended-box", amounts: "" },
      diamond: { odds: 0, status: "suspended-box", amounts: "" },
    },
  });

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
    </style>

<div class="rules-section">
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>Kaun Banega Crorepati  (KBC ) is a unique and a new concept game played with a regular 52 cards deck.</li>
                                                <li>As the name itself suggests there are very high returns on your bets.</li>
                                                <li><b>How to play KBC :</b> There is a set of five questions and each question has options</li>
                                                <li>5 cards will be drawn one by one from the deck as the answers to this questions 1 to 5 respectively.</li>
                                                <li><b>Q1. </b><b>RED</b>(Hearts &amp; Diamonds) or <b>BLACK</b>(Spades &amp; Clubs )</li>
                                                <li><b>Q2. </b><b>ODD</b>(A,3,5,7,9,J,K) or <b>EVEN</b>(2,4,6,8,10,Q)</li>
                                                <li><b>Q3. </b><b>7UP</b>(8,9,10,J,Q,K) or <b>7DOWN</b>(A,2,3,4,5,6)</li>
                                                <li><b>Q4. </b><b>3 CARD JUDGEMENT</b>(A,2,3   or  4,5,6   or  8,9,10  or  J,Q,K)
                                                    <div>Any 1card from the set of 3cards you choose.</div>
                                                </li>
                                                <li><b>Q5. </b><b>SUITS ( COLOR )</b>(Spades  or   Hearts   or   Clubs    or   Diamonds)
                                                    <div>You have to select your choice of answer from given options for all the questions.</div>
                                                    <div>At the start of the game you have three choices to play this game .</div>
                                                </li>
                                                <li><b>1. Five Questions :</b> Going for all the 5 questions</li>
                                                <li><b>2. Four questions  (Four card quit )  :</b>   Going for the 1st  4 questions .</li>
                                                <li><b>3. 50-50 Quit :</b> Going for 5 questions but 50-50 quit after the 4th question.</li>
                                            </ul>
                                        </div></div><div><div class="rules-section">
                                            <h6 class="rules-highlight">About the Odds :  </h6>
                                            <h6 class="rules-sub-highlight">1. Five questions : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>a. If you are going with an ODD card as your 2nd answer your winning odds will be 101 times of your betting amount.</li>
                                                <li>eg: bet amount : 1000 x  101 odds  = 1,01,000 net winning amount.</li>
                                                <li>b. If you are going with an EVEN card as your 2nd answer your winning odds will be 111 times of your betting amount.</li>
                                                <li>eg: bet amount : 1000 x  111 odds  = 1,11,000 net winning amount.</li>
                                            </ul>
                                            <h6 class="rules-sub-highlight">2. Four Questions (Four card quit ) : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>a. If you are going with an ODD card as your 2nd answer your winning odds will be 26.5 times of your betting amount.</li>
                                                <li>eg : bet amount : 1000 x  26.5 odds  = 26,500 net winning amount.</li>
                                                <li>b. If you are going with an EVEN card as your 2nd answer your winning odds will be 29 times of your betting amount.</li>
                                                <li>eg : bet amount : 1000 x  29 odds  =  29,000 net winning amount.</li>
                                            </ul>
                                            <h6 class="rules-sub-highlight">3. 50-50 Quit : </h6>
                                            <ul class="pl-4 pr-4 list-style">
                                                <li>In this you will get half of your winning amount after the 4th card and the remaining half of your winning amount + half of your initial bet amount will be placed on the 5th card as your betting amount.</li>
                                                <li><b>If all the five answers are correct :</b></li>
                                                <li>eg 1(a) ODD CARD :bet amount : 1000 x 63.76 odds   = 63,760 net winning amount.</li>
                                                <li>eg 1(b) EVEN CARD :bet amount : 1000 x  69.65 odds  = 69,650 net winning amount.</li>
                                                <li><b>If the 5th answer is incorrect :</b></li>
                                                <li>eg 2(a) ODD CARD: bet amount : 1000 x  12.75 odds  = 12,750 net winning amount.</li>
                                                <li>eg 2(b) EVEN CARD: bet amount : 1000 x  14 odds  = 14,000 net winning amount.</li>
                                            </ul>
                                        </div></div>`;

  // Function to update odds based on incoming data
  const updateOdds = (data) => {
    if (!data || !data.sub) return;

    const newKbcOptions = { ...kbcOptions };

    data.sub.forEach((item) => {
      const { nat, b, gstatus, odds: oddsArray } = item;

      // Map the data to our state structure
      switch (nat) {
        case "Red-Black":
          if (oddsArray && oddsArray.length >= 2) {
            newKbcOptions.redBlack.red.odds = oddsArray[0]?.b || 0;
            newKbcOptions.redBlack.red.status =
              gstatus === "OPEN" ? "" : "suspended-box";
            newKbcOptions.redBlack.black.odds = oddsArray[1]?.b || 0;
            newKbcOptions.redBlack.black.status =
              gstatus === "OPEN" ? "" : "suspended-box";
          }
          break;
        case "Odd-Even":
          if (oddsArray && oddsArray.length >= 2) {
            newKbcOptions.oddEven.odd.odds = oddsArray[0]?.b || 0;
            newKbcOptions.oddEven.odd.status =
              gstatus === "OPEN" ? "" : "suspended-box";
            newKbcOptions.oddEven.even.odds = oddsArray[1]?.b || 0;
            newKbcOptions.oddEven.even.status =
              gstatus === "OPEN" ? "" : "suspended-box";
          }
          break;
        case "7 Up-7 Down":
          if (oddsArray && oddsArray.length >= 2) {
            newKbcOptions.upDown.up.odds = oddsArray[0]?.b || 0;
            newKbcOptions.upDown.up.status =
              gstatus === "OPEN" ? "" : "suspended-box";
            newKbcOptions.upDown.down.odds = oddsArray[1]?.b || 0;
            newKbcOptions.upDown.down.status =
              gstatus === "OPEN" ? "" : "suspended-box";
          }
          break;
        case "3 Card Judgement":
          if (oddsArray && oddsArray.length >= 4) {
            newKbcOptions.cardJudgement.a23.odds = oddsArray[0]?.b || 0;
            newKbcOptions.cardJudgement.a23.status =
              gstatus === "OPEN" ? "" : "suspended-box";
            newKbcOptions.cardJudgement.four56.odds = oddsArray[1]?.b || 0;
            newKbcOptions.cardJudgement.four56.status =
              gstatus === "OPEN" ? "" : "suspended-box";
            newKbcOptions.cardJudgement.eight910.odds = oddsArray[2]?.b || 0;
            newKbcOptions.cardJudgement.eight910.status =
              gstatus === "OPEN" ? "" : "suspended-box";
            newKbcOptions.cardJudgement.jqk.odds = oddsArray[3]?.b || 0;
            newKbcOptions.cardJudgement.jqk.status =
              gstatus === "OPEN" ? "" : "suspended-box";
          }
          break;
        case "Suits":
          if (oddsArray && oddsArray.length >= 4) {
            newKbcOptions.suits.spade.odds = oddsArray[0]?.b || 0;
            newKbcOptions.suits.spade.status =
              gstatus === "OPEN" ? "" : "suspended-box";
            newKbcOptions.suits.heart.odds = oddsArray[1]?.b || 0;
            newKbcOptions.suits.heart.status =
              gstatus === "OPEN" ? "" : "suspended-box";
            newKbcOptions.suits.club.odds = oddsArray[2]?.b || 0;
            newKbcOptions.suits.club.status =
              gstatus === "OPEN" ? "" : "suspended-box";
            newKbcOptions.suits.diamond.odds = oddsArray[3]?.b || 0;
            newKbcOptions.suits.diamond.status =
              gstatus === "OPEN" ? "" : "suspended-box";
          }
          break;
      }
    });

    setKbcOptions(newKbcOptions);
  };

  // Effect to update odds when data changes
  useEffect(() => {
    if (data?.sub) {
      updateOdds(data);
    }
  }, [data?.sub]);
  useEffect(() => {
    remark.current = data?.remark || "Welcome";
  }, [data?.remark]);

  // Effect to fetch data - data fetching is handled by CasinoLayout
  // No need for separate fetchDataKBC call as CasinoLayout handles socket connection

  

  // Function to open betting popup
  const openPopup = (isBackOrLay, teamName, oddValue, betType, event) => {
    setBetType(betType);

    // Check if radio button is checked before setting teamname
    const labelElement = event?.target?.closest('label');
    const radioButton = labelElement?.previousElementSibling;

    // Use setTimeout to check radio state after DOM update
    setTimeout(() => {
      const isRadioChecked = radioButton?.checked;

      

      if (isRadioChecked) {
        // Set team name in ref only if radio is checked
        teamname.current[radioButton.name] = teamName;
                
          dispatch(setSelectQuestions(teamname.current));
        
      }
    }, 10);

    alert('oddValue is ' + oddValue);
    if (parseFloat(oddValue) > 0) {
      roundIdSaved.current = roundId;
      setbackOrLay(isBackOrLay);
      setPopupDisplayForDesktop(true);
      setOdds(oddValue);
    } 
  };

  // Function to handle bet data
  const casinoBetDataNew = (new_odds) => {
    stakeValue.current.value = new_odds;
    if (backOrLay === "back") {
      loss.current = stakeValue.current.value;
      profit.current = profitData.current = (
        parseFloat(odds - 1) * stakeValue.current.value
      ).toFixed(2);
    } else {
      profit.current = profitData.current = stakeValue.current.value;
      loss.current = (parseFloat(odds - 1) * stakeValue.current.value).toFixed(
        2
      );
    }
  };

  // Function to find data in sub array
  const findDataInSub = (teamName, betType) => {
    if (!data || !data.sub) return null;
    return data.sub.find((item) => item.nat === teamName);
  };

  // Function to place bet
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
      match_id: "kbc",
      roundIdSaved,
      totalPlayers: kbcOptions,
      setHideLoading,
      setPopupDisplayForDesktop,
      setSubmitButtonDisable,
      resetBetFields,
      profitData,
      getBalance,
      updateAmounts : null,
      Notify,
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
  };

  const renderCards = (cards) => (
    <div className="flip-card-container">
      {cards?.map((card, index) => {
        const imgSrc = card
          ? `/img/casino/cards/${card}.png`
          : "/img/casino/cards/1.png";
        return (
          <div className="flip-card" key={index}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <img src={imgSrc} alt={`Card ${index + 1}`} />
              </div>
              <div className="flip-card-back">
                <img src={imgSrc} alt={`Card ${index + 1}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderVideoBox = () => {
        return (
            <div className="video-overlay">
                    <div className="casino-video-cards">
                        <div>
            {/* Display cards if available */}
            {data?.card &&
              data?.card.split(",").some((card) => card !== "1") && (
                <div className="kbc-cards">
                  {data.card.split(",").map((card, index) => (
                    <div
                      key={index}
                      className={`flip-card-container ${
                        index > 0 ? "mt-1" : ""
                      }`}
                    >
                      <div className="flip-card">
                        <div className="flip-card-inner">
                          <div className="flip-card-front">
                            <img
                              src={`/img/casino/cards/${card.trim()}.png`}
                              alt={`Card ${index + 1}`}
                            />
                          </div>
                          <div className="flip-card-back">
                            <img
                              src={`/img/casino/cards/${card.trim()}.png`}
                              alt={`Card ${index + 1}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                        </div>
                    </div>
            </div>
    );
  };

    // Function to get current min/max limits for the active bet
    const getMinMaxLimits = () => {
        // Since this is a simple KBC game without complex betting, return defaults
        return { min: 100, max: 100000 }; // Default fallback
    };

    return (
    <CasinoLayout
      ruleDescription={ruleDescription}
      raceClass="kbc"
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
      getMinMaxLimits={getMinMaxLimits}
      setSportList={setSportList}
      setData={setData}
      setLastResult={setLastResult}
      virtualVideoCards={renderVideoBox}
    >
            <div className="kbc">
                <div className="casino-detail">
                    <div className="casino-table">
                        <div className="row row5 kbc-btns">
                            <div className="col-12 col-md-4">
                                <div className="casino-odd-box-container">
                  <div className="casino-nation-name">
                    <b>[Q1] Red Black</b>
                  </div>
                                    <div className="btn-group">
                    <input
                      type="radio"
                      className="btn-check"
                      id="redBlack-1"
                      name="redBlack"
                      value="1"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.redBlack.red.status}`}
                      htmlFor="redBlack-1"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Red",
                          kbcOptions.redBlack.red.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <img src="/img/casino/cards/heart.png" />
                      <img src="/img/casino/cards/diamond.png" />
                      
                                        </label>

                    <input
                      type="radio"
                      className="btn-check"
                      id="redBlack-2"
                      name="redBlack"
                      value="2"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.redBlack.black.status}`}
                      htmlFor="redBlack-2"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Black",
                          kbcOptions.redBlack.black.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <img src="/img/casino/cards/spade.png" />
                      <img src="/img/casino/cards/club.png" />
                      
                                        </label>
                    odds are {kbcOptions.redBlack.red.odds}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="casino-odd-box-container">
                  <div className="casino-nation-name">
                    <b>[Q2] Odd Even</b>
                  </div>
                                    <div className="btn-group">
                    <input
                      type="radio"
                      className="btn-check"
                      id="oddEven-1"
                      name="oddEven"
                      value="1"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.oddEven.odd.status}`}
                      htmlFor="oddEven-1"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Odd",
                          kbcOptions.oddEven.odd.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <span className="casino-odds">Odd</span>
                      
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      id="oddEven-2"
                      name="oddEven"
                      value="2"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.oddEven.even.status}`}
                      htmlFor="oddEven-2"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Even",
                          kbcOptions.oddEven.even.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <span className="casino-odds">Even</span>
                   
                    </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="casino-odd-box-container">
                  <div className="casino-nation-name">
                    <b>[Q3] 7 Up-7 Down</b>
                  </div>
                                    <div className="btn-group">
                    <input
                      type="radio"
                      className="btn-check"
                      id="upDown-1"
                      name="upDown"
                      value="1"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.upDown.up.status}`}
                      htmlFor="upDown-1"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Up",
                          kbcOptions.upDown.up.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <span className="casino-odds">Up</span>
                      
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      id="upDown-2"
                      name="upDown"
                      value="2"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.upDown.down.status}`}
                      htmlFor="upDown-2"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Down",
                          kbcOptions.upDown.down.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <span className="casino-odds">Down</span>
                      
                    </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row row5 kbc-btns kbcothers mt-xl-3">
                            <div className="col-12 col-md-4">
                                <div className="casino-odd-box-container">
                  <div className="casino-nation-name">
                    <b>[Q4] 3 Card Judgement</b>
                  </div>
                                    <div className="btn-group">
                    <input
                      type="radio"
                      className="btn-check"
                      id="cardj-1"
                      name="cardJudgement"
                      value="1"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.cardJudgement.a23.status}`}
                      htmlFor="cardj-1"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "A23",
                          kbcOptions.cardJudgement.a23.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <span className="casino-odds">A23</span>
                      
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      id="cardj-2"
                      name="cardJudgement"
                      value="2"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.cardJudgement.four56.status}`}
                      htmlFor="cardj-2"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "456",
                          kbcOptions.cardJudgement.four56.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <span className="casino-odds">456</span>
                      
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      id="cardj-3"
                      name="cardJudgement"
                      value="3"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.cardJudgement.eight910.status}`}
                      htmlFor="cardj-3"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "8910",
                          kbcOptions.cardJudgement.eight910.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <span className="casino-odds">8910</span>
                      
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      id="cardj-4"
                        name="cardJudgement"
                      value="4"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.cardJudgement.jqk.status}`}
                      htmlFor="cardj-4"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "JQK",
                          kbcOptions.cardJudgement.jqk.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <span className="casino-odds">JQK</span>
                      
                    </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="casino-odd-box-container">
                  <div className="casino-nation-name">
                    <b>[Q5] Suits</b>
                  </div>
                                    <div className="btn-group">
                    <input
                      type="radio"
                      className="btn-check"
                      id="suits-1"
                      name="suits"
                      value="1"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.suits.spade.status}`}
                      htmlFor="suits-1"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Spade",
                          kbcOptions.suits.spade.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <img src="/img/casino/cards/spade.png" />
                      
                                        </label>

                    <input
                      type="radio"
                      className="btn-check"
                      id="suits-2"
                      name="suits"
                      value="2"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.suits.heart.status}`}
                      htmlFor="suits-2"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Heart",
                          kbcOptions.suits.heart.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <img src="/img/casino/cards/heart.png" />
                      
                                        </label>

                    <input
                      type="radio"
                      className="btn-check"
                      id="suits-3"
                      name="suits"
                      value="3"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.suits.club.status}`}
                      htmlFor="suits-3"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Club",
                          kbcOptions.suits.club.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <img src="/img/casino/cards/club.png" />
                      
                                        </label>

                    <input
                      type="radio"
                      className="btn-check"
                      id="suits-4"
                      name="suits"
                      value="4"
                    />
                    <label
                      className={`form-check-label btn ${kbcOptions.suits.diamond.status}`}
                      htmlFor="suits-4"
                      onClick={(event) =>
                        openPopup(
                          "back",
                          "Diamond",
                          kbcOptions.suits.diamond.odds,
                          "FANCY",
                          event
                        )
                      }
                    >
                      <img src="/img/casino/cards/diamond.png" />

                                        </label>
                                    </div>
                                </div>
                            </div>
              {Object.values(selectedQuestions).every(question => question !== null) && (
              <div className="col-12 col-md-4 d-none d-xl-block">
                <div className="hfquitbtns">
                  <button
                    className={`btn hbtn ${
                      buttonSelected === "4cards" ? "selected" : ""
                    }`}
                    onClick={() => setButtonSelected("4cards")}
                  >
                    4 Cards Quit
                  </button>
                  <button
                    className={`btn fbtn ${
                      buttonSelected === "5050" ? "selected" : ""
                    }`}
                    onClick={() => setButtonSelected("5050")}
                  >
                    50-50 Quit
                  </button>
                  </div>
                </div>
              )}
                        </div>
                    </div>
          <marquee scrollamount="3" className="casino-remark m-b-10">
            {remark.current}
          </marquee>
                    <div className="casino-last-result-title">
                        <span>Last Result</span>
          </div>
          <div className="casino-last-results">
            <CasinoLastResult
              sportList={sportList}
              lastResults={lastResult}
              data={data}
            />
                    </div>
                </div>
            </div>
        </CasinoLayout>
    );
};

export default Kbc;
