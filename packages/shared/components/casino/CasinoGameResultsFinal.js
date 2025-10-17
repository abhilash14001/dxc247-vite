import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { changeCardIndex } from "../../utils/Constants";
/**
 * FINAL Complete Casino Game Results Component
 * ALL games from Desktop/Casino are implemented
 * Andar Bahar includes working Slick Slider
 * Supports ALL games listed in HowToUse.md
 * Now includes Goal/Football/Soccer game results
 */
const CasinoGameResultsFinal = ({
  requestData,
  result,
  resultNew,
  winner_data,
}) => {
  const matchId = requestData?.match_id;
  const normalizedResult = result?.t1 ? result.t1 : result;

  const [jokerCard, setJokerCard] = useState(null);
  // Helper function to get card image
  const getCardImage = (card) => {
    if (!card || card === "1" || card === 1) {
      return "/img/casino/cards/1.png";
    }
    return `/img/casino/cards/${card}.png`;
  };

  // Helper to check if card is valid
  const isValidCard = (card) => {
    return card && card !== "1" && card !== 1;
  };

  // Helper function to render betting history table
  const renderBettingHistoryTable = () => {
    if (!requestData?.all_bets || requestData.all_bets.length === 0) {
      return null;
    }

    return (
      <>
        <div className="row mt-4 justify-content-between">
          <div className="col-md-6"></div>
          <div className="col-md-6 text-end float-right pull-right text-right">
            <div>
              Total Bets:{" "}
              <span className="me-2">{requestData.all_bets.length}</span>
              Total Amount:{" "}
              <span
                className={`me-2 ${
                  (requestData.all_bets.reduce(
                    (sum, bet) => sum + (parseFloat(bet.win) || 0),
                    0
                  ) || 0) < 0
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {requestData.all_bets
                  .reduce((sum, bet) => sum + (parseFloat(bet.win) || 0), 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2 table-responsive">
          <table role="table" className="table table-bordered table-striped">
            <thead>
              <tr role="row">
                <th colspan="1" role="columnheader">
                  Nation
                </th>
                <th colspan="1" role="columnheader" className="text-end">
                  Rate
                </th>
                <th colspan="1" role="columnheader" className="text-end">
                  Amount
                </th>
                <th colspan="1" role="columnheader" className="text-end">
                  Win
                </th>
                <th colspan="1" role="columnheader">
                  Date
                </th>
                <th colspan="1" role="columnheader">
                  Ip Address
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {requestData.all_bets.map((bet, index) =>
              {
                if(bet.bet_type === "JOKER120" && jokerCard === null)
                {
                  setJokerCard(changeCardIndex(bet.team_name.split(" - ")[1].split("Joker ")[1]));
                }
              
              return (
                <tr
                  key={index}
                  role="row"
                  className={bet.extra === "BACK" ? "back" : "lay"}
                >
                  <td role="cell">
                    {bet.bet_type === "3CARDJ"
                      ? `${bet.type} ${bet.team_name}`
                      : bet.bet_type === "TEENUNIQUE"
                      ? "Your Card " + JSON.parse(bet.team_name).join("")
                      : bet.team_name}
                  </td>
                  <td role="cell" className="text-end">
                    {bet.bet_odds}
                  </td>
                  <td role="cell" className="text-end">
                    {bet.bet_amount}
                  </td>
                  <td role="cell" className="text-end">
                    <span
                      role="cell"
                      className={bet.win < 0 ? "text-danger" : "text-success"}
                    >
                      {bet.win}
                    </span>
                  </td>
                  <td role="cell">
                    <span role="cell">
                      {new Date(bet.created_at).toLocaleDateString("en-GB")}{" "}
                      {new Date(bet.created_at).toLocaleTimeString("en-GB", {
                        hour12: false,
                      })}
                    </span>
                  </td>
                  <td role="cell">{bet.ip_address}</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // Helper function to render complete winner data with game-specific labels
  const renderWinnerData = (winner_data, normalizedResult, matchId) => {
    // Game-specific winner data labels - extracted from PHP template
    const getWinnerDataLabels = (gameId) => {
      switch (gameId) {
        // ✅ BTABLE Games
        case "btable":
        case "btable2":
        case "vbtable":
          return {
            extra_data: "Odd",
            odd_even: "Dulha Dulhan/Barati",
            consecutive: "Color",
            card_field: "Card",
          };

        // ✅ DRAGON TIGER Games
        case "dt20":
        case "dt202":
          return {
            extra_data: "Pair",
            odd_even: "Odd/Even",
            consecutive: "Color",
            card_field: "Card",
          };
        case "dt6":
        case "vdt6":
          return {
            extra_data: "Pair",
            odd_even: "Odd/Even",
            consecutive: "Color",
            card_field: "Suit",
          };
        case "dtl20":
        case "vdtl20":
          return {
            extra_data: "Red/Black",
            odd_even: "Odd/Even",
            consecutive: "Card",
            card_field: "",
          };

        // ✅ WAR Game
        case "war":
          return {
            extra_data: "Color",
            odd_even: "Odd/Even",
            consecutive: "Suit",
            card_field: "",
          };

        // ✅ LUCKY7 Games
        case "lucky7":
        case "vlucky7":
        case "lucky5":
        case "lucky7eu":
          return {
            extra_data: "Odd/Even",
            odd_even: "Color",
            consecutive: "Card",
            card_field: "",
          };
        case "lucky7eu2":
          return {
            extra_data: "Odd/Even",
            odd_even: "Color",
            consecutive: "Card",
            card_field: "Line",
          };

        // ✅ BACCARAT Games
        case "baccarat":
          return {
            extra_data: "Winner Pair",
            odd_even: "Perfect",
            consecutive: "Either",
            card_field: "Big/Small",
          };
        case "baccarat2":
          return {
            extra_data: "Winner Pair",
            odd_even: "Score",
            consecutive: "",
            card_field: "",
          };

        // ✅ RACE Games
        case "race20":
          return {
            extra_data: "Points",
            odd_even: "Cards",
            consecutive: "",
            card_field: "",
          };

        // ✅ TEEN PATTI Games
        case "teen":
        case "vteen":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };
        case "teen8":
          return {
            extra_data: "Pair Plus",
            odd_even: "Total",
            consecutive: "",
            card_field: "",
          };
        case "teen9":
          return {
            extra_data: "Others",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };
        case "teen20":
        case "vteen20":
          return {
            extra_data: "3 Baccarat",
            odd_even: "Total",
            consecutive: "Pair Plus",
            card_field: "Red Black",
          };
        case "teen20c":
          return {
            extra_data: "3 Baccarat",
            odd_even: "Total",
            consecutive: "Pair Plus",
            card_field: "Red Black",
          };
        case "teen20b":
          return {
            extra_data: "3 Baccarat",
            odd_even: "Total",
            consecutive: "Pair Plus",
            card_field: "Red Black",
          };
        case "teenmuf":
        case "vteenmuf":
          return {
            extra_data: "Top 9",
            odd_even: "M Baccarat",
            consecutive: "",
            card_field: "",
          };
        case "teensin":
          return {
            extra_data: "High Card",
            odd_even: "Pair",
            consecutive: "Color Plus",
            card_field: "Lucky 9",
          };
        case "teen6":
          return {
            extra_data: "Suit",
            odd_even: "Odd/Even",
            consecutive: "Cards",
            card_field: "Under/Over",
          };
        case "teen1":
          return {
            extra_data: "7 Up - 7 Down",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };
        case "teen120":
          return {
            extra_data: "Pair",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };
        case "teen41":
        case "teen42":
          return {
            extra_data: "Under/Over",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ AAA Games
        case "aaa":
        case "vaaa":
          return {
            extra_data: "Odd/Even",
            odd_even: "Color",
            consecutive: "Under/Over",
            card_field: "Card",
          };
        case "aaa2":
          return {
            extra_data: "Odd/Even",
            odd_even: "Color",
            consecutive: "Under/Over",
            card_field: "Card",
          };

        // ✅ ANDAR BAHAR Games
        case "abj":
          return {
            extra_data: "Suit",
            odd_even: "Odd/Even",
            consecutive: "Joker",
            card_field: "",
          };
        case "ab20":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };
        case "ab3":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };
        case "ab4":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ WORLI Games
        case "worli":
        case "worli2":
          return {
            extra_data: "Ocada",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ 3CARDJ Game
        case "3cardj":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ CARD32 Games
        case "card32":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };
        case "card32eu":
          return {
            extra_data: "Odd/Even",
            odd_even: "Black/Red",
            consecutive: "Total",
            card_field: "Single",
          };

        // ✅ CMATCH20 Game
        case "cmatch20":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ CMETER Games
        case "cmeter":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };
        case "cmeter1":
          return {
            extra_data: "Points",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ DUM10 Game
        case "dum10":
          return {
            extra_data: "Curr. Total",
            odd_even: "Total",
            consecutive: "Odd/Even",
            card_field: "Red/Black",
          };

        // ✅ RACE2 Game
        case "race2":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ RACE17 Game
        case "race17":
          return {
            extra_data: "Big Card",
            odd_even: "Zero Card",
            consecutive: "One Zero Card",
            card_field: "",
          };

        // ✅ QUEEN Game
        case "queen":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ POKER Games
        case "poker6":
          return {
            extra_data: "Pattern",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };
        case "poker":
          return {
            extra_data: "2 Card",
            odd_even: "7 Card",
            consecutive: "",
            card_field: "",
          };
        case "poker20":
          return {
            extra_data: "Other",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ NOTENUM Game
        case "notenum":
          return {
            extra_data: "Red/Black",
            odd_even: "Low/High",
            consecutive: "Cards",
            card_field: "Baccarat",
          };

        // ✅ TRIO Games
        case "trio":
        case "vtrio":
          return {
            extra_data: "1 2 4 / J Q K",
            odd_even: "Red/Black",
            consecutive: "Odd/Even",
            card_field: "Pattern",
          };

        // ✅ POISON Games
        case "poison":
        case "poison20":
        case "joker20":
          return {
            extra_data: "Odd/Even",
            odd_even: "Color",
            consecutive: "Suit",
            card_field: "",
          };

        // ✅ PATTI2 Game
        case "patti2":
          return {
            extra_data: "Mini Baccarat",
            odd_even: "Total",
            consecutive: "Color Plus",
            card_field: "",
          };

        // ✅ TRAP Game
        case "trap":
          return {
            extra_data: "Seven",
            odd_even: "Picture Card",
            consecutive: "",
            card_field: "",
          };

        // ✅ LOTTCARD Game
        case "lottcard":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ KBC Game
        case "kbc":
          return {
            extra_data: "[Q2] Odd-Even",
            odd_even: "[Q3] 7 Up-7 Down",
            consecutive: "[Q4] 3 Card Judgement",
            card_field: "[Q5] Suits",
          };

        // ✅ LUCKY15/BALLBYBALL Games
        case "lucky15":
        case "ballbyball":
          return {
            extra_data: "",
            odd_even: "",
            consecutive: "",
            card_field: "",
          };

        // ✅ MOGAMBO Game
        case "mogambo":
          return {
            extra_data: "Total",
            odd_even: "Winner",
            consecutive: "",
            card_field: "",
          };

        // ✅ GOAL Games
        case "goal":
        case "goalshot":
        case "football":
        case "soccer":
          return {
            extra_data: "Player",
            odd_even: "Team",
            consecutive: "Goal Type",
            card_field: "Time",
          };

        // ✅ Default fallback
        default:
          return {
            extra_data: "Odd/Even",
            odd_even: "Color",
            consecutive: "Under/Over",
            card_field: "Card",
          };
      }
    };

    const labels = getWinnerDataLabels(matchId);

    // Special handling for specific games to match their HTML structures
    if (matchId === "teen20c") {
      return (
        <div className="row mt-2 justify-content-center">
          <div className="col-md-6">
            <div className="casino-result-desc">
              <div className="casino-result-desc-item">
                <div>Winner:</div>
                <div>
                  {winner_data?.winner || normalizedResult?.rdesc || ""}
                </div>
              </div>
              <div className="casino-result-desc-item">
                <div>3 Baccarat:</div>
                <div>
                  {winner_data?.extra_data || "Player B(High Point Card)"}
                </div>
              </div>

              <div className="casino-result-desc-item">
                <div>Total:</div>
                <div>{winner_data?.odd_even || "Tie (A : 20 | B : 20)"}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Pair Plus:</div>
                <div>{winner_data?.consecutive || "B : Pair"}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Red Black:</div>
                <div>
                  {winner_data && winner_data[0] && winner_data[0][0]
                    ? winner_data[0][0]
                    : "A : Red | B : Black"}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Special handling for superover games (cricket)
    if (
      ["superover", "superover2", "superover3", "cricketv3"].includes(matchId)
    ) {
      const getTeamNames = (matchId) => {
        const teamMappings = {
          superover: ["ENG", "RSA"],
          superover2: ["IND", "ENG"],
          superover3: ["IND", "AUS"],
          cricketv3: ["AUS", "IND"],
        };
        return teamMappings[matchId] || ["Team A", "Team B"];
      };

      const getWinnerTeam = (teams, winValue) => {
        const winNum = parseInt(winValue);
        if (winNum === 1) return teams[0];
        if (winNum === 2) return teams[1];
        return "TIE";
      };

      const teams = getTeamNames(matchId);
      const winnerTeam = getWinnerTeam(teams, normalizedResult?.win);

      return (
        <div className="row mt-2 justify-content-center">
          <div className="col-md-6">
            <div className="casino-result-desc">
              <div className="casino-result-desc-item">
                <div>Winner:</div>
                <div>{winnerTeam}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Description:</div>
                <div>{normalizedResult?.rdesc || ""}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Special handling for race20 (4 suits)
    if (matchId === "race20") {
      return (
        <div className="row mt-2 justify-content-center">
          <div className="col-md-6">
            <div className="casino-result-desc">
              <div className="casino-result-desc-item">
                <div>Winner:</div>
                <div>{winner_data?.winner || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Points:</div>
                <div>{winner_data?.extra_data || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Cards:</div>
                <div>{winner_data?.odd_even || ""}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Special handling for queen (4 totals)
    if (matchId === "queen") {
      return (
        <div className="row mt-2 justify-content-center">
          <div className="col-md-6">
            <div className="casino-result-desc">
              <div className="casino-result-desc-item">
                <div>Winner:</div>
                <div>
                  {normalizedResult?.winnat || winner_data?.winner || ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Special handling for abj (Andar Bahar Joker)
    if (matchId === "abj") {
      return (
        <div className="row mt-2 justify-content-center">
          <div className="col-md-6">
            <div className="casino-result-desc">
              <div className="casino-result-desc-item">
                <div>Winner:</div>
                <div>{winner_data?.winner || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Suit:</div>
                <div>{winner_data?.extra_data || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Odd/Even:</div>
                <div>{winner_data?.odd_even || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Joker:</div>
                <div>{winner_data?.consecutive || ""}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Special handling for joker20 (Joker 20-20)
    if (matchId === "joker20") {
      // Parse rdesc field: "Player A#Odd#Red#Heart"
      const parseJoker20Data = (rdesc) => {
        if (!rdesc) return {};
        
        const parts = rdesc.split('#');
        return {
          winner: parts[0] || "",
          oddEven: parts[1] || "",
          color: parts[2] || "",
          suit: parts[3] || ""
        };
      };
      
      const joker20Data = parseJoker20Data(normalizedResult?.rdesc);
      
      return (
        <div className="row mt-2 justify-content-center">
          <div className="col-md-6">
            <div className="casino-result-desc">
              <div className="casino-result-desc-item">
                <div>Winner</div>
                <div>{joker20Data.winner || normalizedResult?.winnat || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Odd/Even</div>
                <div>{joker20Data.oddEven || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Color</div>
                <div>{joker20Data.color || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Suit</div>
                <div>{joker20Data.suit || ""}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Special handling for dt202/dt20 (Dragon Tiger)
    if (["dt202", "dt20"].includes(matchId)) {
      return (
        <div className="row mt-2 justify-content-center">
          <div className="col-md-6">
            <div className="casino-result-desc">
              <div className="casino-result-desc-item">
                <div>Winner:</div>
                <div>{winner_data?.winner || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Pair:</div>
                <div>{winner_data?.extra_data || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Odd/Even:</div>
                <div>{winner_data?.odd_even || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Color:</div>
                <div>{winner_data?.consecutive || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Card:</div>
                <div>
                  {winner_data && winner_data[0] && winner_data[0][0]
                    ? winner_data[0][0]
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Special handling for basic teen games
    if (["teen", "vteen"].includes(matchId)) {
      return (
        <div className="row mt-2 justify-content-center">
          <div className="col-md-6">
            <div className="casino-result-desc">
              <div className="casino-result-desc-item">
                <div>Winner:</div>
                <div>
                  {winner_data?.winner || normalizedResult?.rdesc || ""}
                </div>
              </div>
              <div className="casino-result-desc-item">
                <div>Odd/Even:</div>
                <div>{winner_data?.odd_even || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>Consecutive:</div>
                <div>{winner_data?.consecutive || ""}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Special handling for baccarat games
    if (["baccarat", "baccarat2"].includes(matchId)) {
      return (
        <div className="row mt-2 justify-content-center">
          <div className="col-md-6">
            <div className="casino-result-desc">
              <div className="casino-result-desc-item">
                <div>Winner:</div>
                <div>
                  {winner_data?.winner || normalizedResult?.rdesc || ""}
                </div>
              </div>
              <div className="casino-result-desc-item">
                <div>Winner Pair:</div>
                <div>{winner_data?.extra_data || ""}</div>
              </div>
              <div className="casino-result-desc-item">
                <div>{matchId === "baccarat2" ? "Score" : "Perfect"}:</div>
                <div>{winner_data?.odd_even || ""}</div>
              </div>
              {matchId === "baccarat" && (
                <>
                  <div className="casino-result-desc-item">
                    <div>Either:</div>
                    <div>{winner_data?.consecutive || ""}</div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Big/Small:</div>
                    <div>
                      {winner_data && winner_data[0] && winner_data[0][0]
                        ? winner_data[0][0]
                        : ""}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    {matchId !== "joker120" && (
    
      <div className="row mt-2 justify-content-center">
        <div className="col-md-6">
          <div className="casino-result-desc">
            <div className="casino-result-desc-item">
              <div>Winner</div>
              <div>{winner_data?.winner || normalizedResult?.rdesc || ""}</div>
            </div>
            {winner_data?.extra_data && (
              <div className="casino-result-desc-item">
                <div>{labels.extra_data}</div>
                <div>{winner_data.extra_data}</div>
              </div>
            )}
            {winner_data?.odd_even && (
              <div className="casino-result-desc-item">
                <div>{labels.odd_even}</div>
                <div>{winner_data.odd_even}</div>
              </div>
            )}
            {winner_data?.consecutive && (
              <div className="casino-result-desc-item">
                <div>{labels.consecutive}</div>
                <div>{winner_data.consecutive}</div>
              </div>
            )}
            {winner_data && winner_data[0] && winner_data[0][0] && (
              <div className="casino-result-desc-item">
                <div>{labels.card_field}</div>
                <div>{winner_data[0][0]}</div>
              </div>
            )}
          </div>
          </div>
        </div>
      );
    }
  };

  // Slick slider settings for Andar Bahar
  const slickSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 8 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 5 },
      },
    ],
  };

  // Render based on match_id
  const renderGameResult = () => {
    switch (matchId) {
      // ✅ **Andar Bahar Games (WITH SLICK SLIDER)**
      case "abj":
        const abjCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const card1Arr = [];
        const card2Arr = [];

        abjCards.forEach((card, index) => {
          if (index <= 2 || !isValidCard(card)) return;
          const cardImg = getCardImage(card);
          if (index % 2 === 0) {
            card1Arr.push(cardImg);
          } else {
            card2Arr.push(cardImg);
          }
        });

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id mb-3">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>

            <div className="row row5 ab2-result-container">
              <div className="col-1">
                <div className="row row5">
                  <div className="col-12">
                    <b>A</b>
                  </div>
                </div>
                <div className="row row5">
                  <div className="col-12">
                    <b>B</b>
                  </div>
                </div>
              </div>

              <div className="col-2">
                <img
                  src={getCardImage(abjCards[0])}
                  className="card-right"
                  alt="Joker Card"
                />
              </div>

              <div className="col-9">
                <div className="card-inner">
                  <div className="row row5">
                    <div className="col-3">
                      <img
                        src={getCardImage(abjCards[2])}
                        className="mb-1"
                        alt="Card"
                      />
                    </div>
                    <div className="col-9">
                      <div className="slick-cards-results">
                        {card1Arr.length > 0 && (
                          <Slider {...slickSettings}>
                            {card1Arr.slice(0, 10).map((cardImg, index) => (
                              <div key={index} className="item">
                                <img src={cardImg} alt="Card" />
                              </div>
                            ))}
                          </Slider>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-inner">
                  <div className="row row5">
                    <div className="col-3">
                      <img
                        src={getCardImage(abjCards[1])}
                        className="mb-1"
                        alt="Card"
                      />
                    </div>
                    <div className="col-9">
                      <div className="slick-cards-results">
                        {card2Arr.length > 0 && (
                          <Slider {...slickSettings}>
                            {card2Arr.slice(0, 10).map((cardImg, index) => (
                              <div key={index} className="item">
                                <img src={cardImg} alt="Card" />
                              </div>
                            ))}
                          </Slider>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      case "ab20":
        const ab20Cards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const andarCards = [];
        const baharCards = [];

        for (let i = 1; i < ab20Cards.length; i += 2) {
          if (ab20Cards[i] && isValidCard(ab20Cards[i]))
            andarCards.push(getCardImage(ab20Cards[i]));
        }
        for (let j = 0; j < ab20Cards.length; j += 2) {
          if (ab20Cards[j] && isValidCard(ab20Cards[j]))
            baharCards.push(getCardImage(ab20Cards[j]));
        }

        return (
          <div className="casino-result-modal ab-result">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>

            <div className="row mt-2 ab-result-container">
              <div className="col-md-12 text-center">
                <h4 className="result-title">Andar</h4>
                <div className="casino-result-cards ab-result-slider">
                  {andarCards.length > 0 && (
                    <Slider {...slickSettings}>
                      {andarCards.map((cardImg, index) => (
                        <div key={index}>
                          <img
                            src={cardImg}
                            alt="Card"
                            style={{ width: "100%", display: "inline-block" }}
                          />
                        </div>
                      ))}
                    </Slider>
                  )}
                </div>
              </div>
              <div className="col-md-12 text-center mt-1">
                <h4 className="result-title">Bahar</h4>
                <div className="casino-result-cards ab-result-slider mb-2">
                  {baharCards.length > 0 && (
                    <Slider {...slickSettings}>
                      {baharCards.map((cardImg, index) => (
                        <div key={index}>
                          <img
                            src={cardImg}
                            alt="Card"
                            style={{ width: "100%", display: "inline-block" }}
                          />
                        </div>
                      ))}
                    </Slider>
                  )}
                </div>
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      case "ab3":
        const ab3Cards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const firstRowCards = [];
        const secondRowCards = [];

        for (let i = 0; i < 13; i++) {
          if (ab3Cards[i] && isValidCard(ab3Cards[i])) {
            firstRowCards.push(getCardImage(ab3Cards[i]));
          }
        }

        for (let i = 13; i < 26; i++) {
          if (ab3Cards[i] && isValidCard(ab3Cards[i])) {
            secondRowCards.push(getCardImage(ab3Cards[i]));
          }
        }

        const ab3SliderSettings = {
          ...slickSettings,
          slidesToShow: Math.min(13, Math.max(firstRowCards.length, 1)),
          arrows: true,
        };

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>

            <div className="row mt-2 ab-result-container">
              <div className="col-md-12 text-center">
                <div className="casino-result-cards ab-result-slider">
                  {firstRowCards.length > 0 && (
                    <div className="slick-cards-results">
                      <Slider {...ab3SliderSettings}>
                        {firstRowCards.map((cardImg, index) => (
                          <div key={index} className="slick-card-item">
                            <img
                              src={cardImg}
                              alt="Card"
                              style={{ width: "100%" }}
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  )}
                </div>
              </div>

              {secondRowCards.length > 0 && (
                <div className="col-md-12 text-center mt-1">
                  <div className="casino-result-cards ab-result-slider mb-2">
                    <div className="slick-cards-results">
                      <Slider
                        {...{
                          ...ab3SliderSettings,
                          slidesToShow: Math.min(
                            13,
                            Math.max(secondRowCards.length, 1)
                          ),
                        }}
                      >
                        {secondRowCards.map((cardImg, index) => (
                          <div key={index} className="slick-card-item">
                            <img
                              src={cardImg}
                              alt="Card"
                              style={{ width: "100%" }}
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      case "ab4":
        const ab4Card = normalizedResult?.card
          ? normalizedResult.card.split(",")[0]
          : null;
        const mainCard =
          ab4Card && isValidCard(ab4Card) ? getCardImage(ab4Card) : null;

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>

            <div className="row mt-2 ab-result-container">
              <div className="col-md-12 text-center">
                <div className="casino-result-cards ab-result-slider">
                  <div className="slick-cards-results">
                    {mainCard && (
                      <div className="single-card-display">
                        <img
                          src={mainCard}
                          alt="Card"
                          style={{ width: "63px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // ✅ Teen1: Player vs Dealer (single card each)
      case "teen1":
        const teen1Cards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const teen1PlayerCard =
          teen1Cards[0] && isValidCard(teen1Cards[0])
            ? getCardImage(teen1Cards[0])
            : "/img/casino/cards/1.png";
        const teen1DealerCard =
          teen1Cards[1] && isValidCard(teen1Cards[1])
            ? getCardImage(teen1Cards[1])
            : "/img/casino/cards/1.png";
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 text-center">
                <h4 className="result-title">Player</h4>
                <div className="casino-result-cards">
                  {String(normalizedResult?.win) === "1" && (
                    <div className="casino-winner-icon">
                      <i className="fas fa-trophy"></i>
                    </div>
                  )}
                  <img src={teen1PlayerCard} alt="Player" />
                </div>
              </div>
              <div className="col-md-6 text-center">
                <h4 className="result-title">Dealer</h4>
                <div className="casino-result-cards">
                  <img src={teen1DealerCard} alt="Dealer" />
                  {String(normalizedResult?.win) === "2" && (
                    <div className="casino-winner-icon">
                      <i className="fas fa-trophy"></i>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // ✅ **Teen Patti Variants** (2 players only - Player A vs Player B)
      case "teen":
      case "vteen":
      case "teen20":
      case "teen20c":
      case "vteen20":
      case "teen32":
      case "teen33":
      case "teen3":
      case "teen120":
      case "teen8":
      case "teen9":
      case "teen6":
      case "teen41":
      case "teen42":
      case "teenmuf":
      case "vteenmuf":
      case "teensin":
      case "teen20b":
      case "teen2024":
      case "patti2":
        const teenCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const playerACards = [];
        const playerBCards = [];

        // Distribute cards to 2 players only (Player A and Player B)
        teenCards.forEach((card, index) => {
          if (isValidCard(card)) {
            const cardImg = getCardImage(card);
            if (index % 2 === 0) {
              playerACards.push(cardImg); // Even indices (0, 2, 4...)
            } else {
              playerBCards.push(cardImg); // Odd indices (1, 3, 5...)
            }
          }
        });

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 text-center">
                <h4 className="result-title">Player A</h4>
                <div className="casino-result-cards">
                  {normalizedResult?.win == 1 && (
                    <div className="casino-winner-icon">
                      <i className="fas fa-trophy"></i>
                    </div>
                  )}
                  {playerACards.map((img, i) => (
                    <img key={i} src={img} className="mr-1" alt="Card" />
                  ))}
                </div>
              </div>
              <div className="col-md-6 text-center">
                <h4 className="result-title">Player B</h4>
                <div className="casino-result-cards">
                  {playerBCards.map((img, i) => (
                    <img key={i} src={img} className="mr-1" alt="Card" />
                  ))}
                  {normalizedResult?.win == "2" && (
                    <div className="casino-winner-icon">
                      <i className="fas fa-trophy"></i>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // ✅ **Dragon Tiger**
      case "dt20":
      case "dt202":
      case "dt6":
      case "vdt6":
      case "dtl20":
      case "vdtl20":
        const dtCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];

        // Handle teen20c (3 cards each) vs Dragon Tiger (2 cards each)

        // Original Dragon Tiger logic (2 cards each)
        const card1 = dtCards[0]
          ? getCardImage(dtCards[0])
          : "/img/casino/cards/1.png";
        const card2 = dtCards[1]
          ? getCardImage(dtCards[1])
          : "/img/casino/cards/1.png";

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id mb-3">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 text-center">
                <h4 className="result-title">Dragon</h4>
                <div className="casino-result-cards">
                  {normalizedResult?.win == "1" && (
                    <div className="casino-winner-icon">
                      <i className="fas fa-trophy"></i>
                    </div>
                  )}
                  <img src={card1} alt="Dragon Card" />
                </div>
              </div>
              <div className="col-md-6 text-center">
                <h4 className="result-title">Tiger</h4>
                <div className="casino-result-cards">
                  {normalizedResult?.win == "2" && (
                    <div className="casino-winner-icon">
                      <i className="fas fa-trophy"></i>
                    </div>
                  )}
                  <img src={card2} alt="Tiger Card" />
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-6">
                <div className="casino-result-desc">
                  <div className="casino-result-desc-item">
                    <div>Winner:</div>
                    <div>
                      {winner_data?.winner || normalizedResult?.rdesc || ""}
                    </div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Pair:</div>
                    <div>{winner_data?.extra_data || ""}</div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Odd/Even:</div>
                    <div>{winner_data?.odd_even || ""}</div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Color:</div>
                    <div>{winner_data?.consecutive || ""}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ✅ **Card Games**
      case "card32":
      case "card32eu":
        const card32Cards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const cardsByPlayer = { 8: [], 9: [], 10: [], 11: [] };
        const cardTotals = { 8: 8, 9: 9, 10: 10, 11: 11 };

        for (let player = 0; player < 4; player++) {
          const playerKey = player + 8;
          for (let i = player; i < card32Cards.length; i += 4) {
            if (card32Cards[i] && isValidCard(card32Cards[i])) {
              cardsByPlayer[playerKey].push(getCardImage(card32Cards[i]));
              // Calculate total
              const match = card32Cards[i].match(/^([AKQJ2-9]|10)/);
              if (match) {
                const value = match[1];
                if (["K", "Q", "J"].includes(value))
                  cardTotals[playerKey] += 10;
                else if (value === "A") cardTotals[playerKey] += 1;
                else cardTotals[playerKey] += parseInt(value) || 0;
              }
            }
          }
        }

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              {[8, 9, 10, 11].map((player, index) => (
                <div key={player} className="col-md-3 text-center">
                  <h4 className="result-title">
                    Player {player}{" "}
                    <span className="text-warning">
                      {" "}
                      - {cardTotals[player]}
                    </span>
                  </h4>
                  <div
                    className="casino-result-cards"
                    style={{ position: "relative" }}
                  >
                    {cardsByPlayer[player].map((img, i) => (
                      <img key={i} src={img} className="mr-2" alt="Card" />
                    ))}
                    {normalizedResult?.win === String(index + 1) && (
                      <span
                        className="casino-winner-icon"
                        style={{ display: "inline-block", marginLeft: "5px" }}
                      >
                        <i className="fas fa-trophy"></i>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      case "baccarat":
      case "baccarat2":
        const baccaratCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const playerCardsB = [];
        const bankerCards = [];

        baccaratCards.forEach((card, index) => {
          if (card !== "1") {
            const cardImg = getCardImage(card);
            if (index % 2 === 0) {
              playerCardsB.push(cardImg);
            } else {
              bankerCards.push(cardImg);
            }
          }
        });

        playerCardsB.reverse();

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row">
              <div className="col-md-6 col-12 br1 text-center">
                <h4>Player</h4>
                <div className="casino-result-cards d-flex align-items-center justify-content-center position-relative">
                  {normalizedResult?.win == "1" && (
                    <div
                      className={`${
                        playerCardsB.length === 3
                          ? "position-absolute-left"
                          : "position-absolute-left-2"
                      }`}
                      style={{
                        left: playerCardsB.length === 3 ? "250px" : "285px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 999,
                      }}
                    >
                      <i
                        className="fas fa-trophy text-success"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                    </div>
                  )}
                  <div className="d-flex align-items-center">
                    {playerCardsB[0] && (
                      <img
                        src={playerCardsB[0]}
                        className={`mr-2 ${
                          playerCardsB.length > 2 ? "lrotate" : ""
                        }`}
                        alt="Card"
                      />
                    )}
                    {playerCardsB[1] && (
                      <img src={playerCardsB[1]} className="mr-2" alt="Card" />
                    )}
                    {playerCardsB[2] && (
                      <img src={playerCardsB[2]} className="mr-2" alt="Card" />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-12 text-center">
                <h4>Banker</h4>
                <div className="casino-result-cards d-flex align-items-center justify-content-center position-relative">
                  <div className="d-flex align-items-center">
                    {bankerCards[0] && (
                      <img src={bankerCards[0]} className="mr-2" alt="Card" />
                    )}
                    {bankerCards[1] && (
                      <img src={bankerCards[1]} className="mr-2" alt="Card" />
                    )}
                    {bankerCards[2] && (
                      <img
                        src={bankerCards[2]}
                        className="mr-2 rrotate"
                        alt="Card"
                      />
                    )}
                  </div>
                  {normalizedResult?.win == "2" && (
                    <div
                      className={
                        bankerCards.length === 3
                          ? "position-absolute"
                          : "position-absolute-right-2"
                      }
                      style={{
                        right: bankerCards.length === 3 ? "250px" : "285px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 999,
                      }}
                    >
                      <i
                        className="fas fa-trophy text-success"
                        style={{ fontSize: "1.5rem" }}
                      ></i>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-6">
                <div className="casino-result-desc">
                  <div className="casino-result-desc-item">
                    <div>Winner:</div>
                    <div>
                      {winner_data?.winner || normalizedResult?.rdesc || ""}
                    </div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Winner Pair:</div>
                    <div>{winner_data?.extra_data || ""}</div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>{matchId === "baccarat2" ? "Score" : "Perfect"}:</div>
                    <div>{winner_data?.odd_even || ""}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ✅ **Lucky Games**
      case "lucky7":
      case "vlucky7":
      case "lucky7eu":
      case "lucky7eu2":
      case "lucky5":
        const luckyCardImg = normalizedResult?.card
          ? getCardImage(normalizedResult.card)
          : "/img/casino/cards/1.png";

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row">
              <div className="col-12 text-center">
                <div className="casino-result-cards">
                  <img src={luckyCardImg} className="mr-2" alt="Card" />
                </div>
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      case "lucky15":
      case "ballbyball":
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="text-center">
                <div className="cricket20ballpopup cricket20ballresult">
                  <img src="/img/balls/ball-blank.png" alt="Ball" />
                  <span>
                    {normalizedResult?.rdesc || winner_data?.winner || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      // ✅ **Roulette Games**
      case "roulette12":
      
        case "roulette13":
          case "ourroullete":
            case "roulette11":
        let rouletteNumber =
          normalizedResult?.rdesc || winner_data?.winner || "";
        rouletteNumber =
          rouletteNumber.toString().length === 1
            ? "0" + rouletteNumber
            : rouletteNumber;

        const rouletteImagePath = rouletteNumber
          ? `/assets/img/roulette/${rouletteNumber}.png`
          : "/assets/img/roulette/0.png";

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 text-center">
                <div className="casino-result-cards">
                  <img
                    src={rouletteImagePath}
                    alt={`Roulette Number ${rouletteNumber}`}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "teenunique":
        const teenuniqueCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 text-center">
                <div className="casino-result-cards unique-teen20-box">
                  {teenuniqueCards.map((card, index) => (
                    <div key={index} className="unique-teen20-card">
                      <img
                        src={`/img/sequence/s${index + 1}-icon.png`}
                        alt=""
                      />
                      <img src={getCardImage(card)} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

        // ✅ **Mogambo Game** - Daga/Teja vs Mogambo with total
        case "mogambo":
          const mogamboCards = normalizedResult?.card
            ? normalizedResult.card.split(",")
            : [];
          
          // First two cards are Daga/Teja cards
          const dagaTejaCards = mogamboCards.slice(0, 2).map(card => 
            isValidCard(card) ? getCardImage(card) : "/img/casino/cards/1.png"
          );
          
          // Third card is Mogambo card
          const mogamboCard = mogamboCards[2] && isValidCard(mogamboCards[2])
            ? getCardImage(mogamboCards[2])
            : "/img/casino/cards/1.png";
          
          // Parse winner from win field (1 = Daga/Teja, 2 = Mogambo)
          const winner = normalizedResult?.win === "2" ? "Daga / Teja" : 
                        normalizedResult?.win === "1" ? "Mogambo" : 
                        winner_data?.winner || "";
          
          // Get total from rdesc or winner_data
          const total1 = normalizedResult?.rdesc.split("#")[1] || "";

          return (
            <div className="casino-result-modal">
              <div className="casino-result-round-id">
                <span>
                  <b>Round Id: </b>{" "}
                  {normalizedResult?.rid || requestData?.roundID || ""}
                </span>
                <span>
                  <b>Match Time: </b>
                  {winner_data?.match_time || normalizedResult?.mtime || ""}
                </span>
              </div>
              <div className="row mt-2">
                <div className="col-md-6 text-center">
                  <h4 className="result-title">Daga / Teja</h4>
                  <div className="casino-result-cards">
                    {dagaTejaCards.map((img, i) => (
                      <img key={i} src={img} alt="Card" />
                    ))}
                    {winner === "Daga / Teja" && (
                      <div className="casino-winner-icon">
                        <i className="fas fa-trophy"></i>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 text-center">
                  <h4 className="result-title">Mogambo</h4>
                  <div className="casino-result-cards">
                    {winner === "Mogambo" && (
                      <div className="casino-winner-icon">
                        <i className="fas fa-trophy"></i>
                      </div>
                    )}
                    <img src={mogamboCard} alt="Mogambo Card" />
                  </div>
                </div>
              </div>
              <div className="row mt-2 justify-content-center">
                <div className="col-md-6">
                  <div className="casino-result-desc">
                    <div className="casino-result-desc-item">
                      <div>Winner</div>
                      <div>{winner}</div>
                    </div>
                    <div className="casino-result-desc-item">
                      <div>Total</div>
                      <div>{total1}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        // ✅ **Goal Game** - Football/Soccer goal results
        case "goal":
          // Create dynamic goal description with various fallback options
          let goalText = resultNew?.t1?.rdesc
            ? resultNew.t1.rdesc.split("#")[1] +
              " by " +
              resultNew.t1.rdesc.split("#")[0]
            : normalizedResult?.rdesc || "Goal Scored!";

          return (
            <div className="casino-result-modal">
              <div className="casino-result-round-id">
                <span>
                  <b>Round Id: </b>{" "}
                  {normalizedResult?.rid || requestData?.roundID || ""}
                </span>
                <span>
                  <b>Match Time: </b>
                  {winner_data?.match_time || normalizedResult?.mtime || ""}
                </span>
              </div>
              <div className="row mt-2">
                <div className="text-center">
                  <div className="goal-result cricket20ballresult">
                    <img src="/img/balls/soccer-ball.png" alt="Soccer Ball" />
                    <span>{goalText}</span>
                  </div>
                </div>
              </div>
            </div>
          );

      // ✅ **Race Games**
      case "race20":
        const cards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const arSpade = [],
          arHeart = [],
          arClub = [],
          arDiamond = [];

        cards.forEach((card) => {
          if (card === "1") return;
          if (card.includes("SS")) arSpade.push(getCardImage(card));
          if (card.includes("HH")) arHeart.push(getCardImage(card));
          if (card.includes("CC")) arClub.push(getCardImage(card));
          if (card.includes("DD")) arDiamond.push(getCardImage(card));
        });

        return (
          <div className="casino-result-modal race-modal">
            <div className="casino-result-round-id mb-3">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="race-result-box">
              <div className="m1 p-r-1">
                <span className="casino-result-cards">
                  <img src="/img/casino/cards/spade.png" alt="Spade" />
                </span>
                {arSpade.map((img, i) => (
                  <span key={i} className="casino-result-cards">
                    <img src={img} alt="Card" />
                  </span>
                ))}
                {normalizedResult?.win == "1" && (
                  <div className="winner-icon mt-3">
                    <i className="fas fa-trophy mr-2"></i>
                  </div>
                )}
              </div>
              <div className="mb-1 p-r">
                <span className="casino-result-cards">
                  <img src="/img/casino/cards/heart.png" alt="Heart" />
                </span>
                {arHeart.map((img, i) => (
                  <span key={i} className="casino-result-cards">
                    <img src={img} alt="Card" />
                  </span>
                ))}
                {normalizedResult?.win == "2" && (
                  <div className="winner-icon mt-3">
                    <i className="fas fa-trophy mr-2"></i>
                  </div>
                )}
              </div>
              <div className="mb-1 p-r">
                <span className="casino-result-cards">
                  <img src="/img/casino/cards/club.png" alt="Club" />
                </span>
                {arClub.map((img, i) => (
                  <span key={i} className="casino-result-cards">
                    <img src={img} alt="Card" />
                  </span>
                ))}
                {normalizedResult?.win === "3" && (
                  <div className="winner-icon mt-3">
                    <i className="fas fa-trophy mr-2"></i>
                  </div>
                )}
              </div>
              <div className="mb-1 p-r">
                <span className="casino-result-cards">
                  <img src="/img/casino/cards/diamond.png" alt="Diamond" />
                </span>
                {arDiamond.map((img, i) => (
                  <span key={i} className="casino-result-cards">
                    <img src={img} alt="Card" />
                  </span>
                ))}
                {normalizedResult?.win === "4" && (
                  <div className="winner-icon mt-3">
                    <i className="fas fa-trophy mr-2"></i>
                  </div>
                )}
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      case "race2":
        const race2Cards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const race2Players = [0, 1, 2, 3].map((idx) =>
          race2Cards[idx] && isValidCard(race2Cards[idx])
            ? getCardImage(race2Cards[idx])
            : "/img/casino/cards/1.png"
        );
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              {race2Players.map((img, i) => (
                <div key={i} className="col-md-3 text-center">
                  <h4 className="result-title">
                    Player {String.fromCharCode(65 + i)}
                  </h4>
                  <div className="casino-result-cards">
                    <img src={img} alt="Card" />
                    {String(normalizedResult?.win) === String(i + 1) && (
                      <div className="casino-winner-icon">
                        <i className="fas fa-trophy "></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-6">
                <div className="casino-result-desc">
                  <div className="casino-result-desc-item">
                    <div>Winner</div>
                    <div>
                      {normalizedResult?.winnat || winner_data?.winner || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "race17":
        const raceCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="casino-result-cards text-center">
              {raceCards.map(
                (card, index) =>
                  isValidCard(card) && (
                    <img
                      key={index}
                      src={getCardImage(card)}
                      alt="Card"
                      className="mr-2"
                    />
                  )
              )}
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // ✅ CMETER1 (Fighter A vs Fighter B)
      case "cmeter1":
        const cmCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const cmCard1 =
          cmCards[0] && isValidCard(cmCards[0])
            ? getCardImage(cmCards[0])
            : "/img/casino/cards/1.png";
        const cmCard2 =
          cmCards[1] && isValidCard(cmCards[1])
            ? getCardImage(cmCards[1])
            : "/img/casino/cards/1.png";
        const cmWin = normalizedResult?.win || 0;
        const cmMatchTime =
          normalizedResult?.mtime || winner_data?.match_time || "";
        let cmPoints = "";
        if (normalizedResult?.rdesc) {
          const rdescParts = String(normalizedResult.rdesc).split("#");
          if (rdescParts.length > 1) cmPoints = rdescParts[1];
        }
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {cmMatchTime}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 text-center">
                <h4 className="result-title">Fighter A</h4>
                <div className="casino-result-cards">
                  {String(cmWin) === "1" && (
                    <div className="casino-winner-icon">
                      <i className="fas fa-trophy "></i>
                    </div>
                  )}
                  <img src={cmCard1} alt="Fighter A" />
                </div>
              </div>
              <div className="col-md-6 text-center">
                <h4 className="result-title">Fighter B</h4>
                <div className="casino-result-cards">
                  <img src={cmCard2} alt="Fighter B" />
                  {String(cmWin) === "2" && (
                    <div className="casino-winner-icon">
                      <i className="fas fa-trophy "></i>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-6">
                <div className="casino-result-desc">
                  <div className="casino-result-desc-item">
                    <div>Winner</div>
                    <div>
                      {normalizedResult?.winnat || winner_data?.winner || ""}
                    </div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Points</div>
                    <div>{cmPoints}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ✅ CMETER (Low/High Cards)
      case "cmeter":
        const cmeterCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const lowCards = [];
        const highCards = [];
        let rightSideCard = null;
        
        // Process cards and classify them based on PHP logic
        cmeterCards.forEach((raw) => {
          if (!isValidCard(raw)) return;
          
          // Extract value and suit from card (e.g., "6SS" -> value: "6", suit: "SS")
          const valueMatch = raw.match(/^(10|[2-9]|A|K|Q|J)/);
          const suitMatch = raw.match(/(SS|HH|CC|DD)$/);
          
          if (!valueMatch || !suitMatch) return;
          
          const value = valueMatch[1];
          const suit = suitMatch[1];
          const img = getCardImage(raw);
          
          // PHP Logic Implementation
          if (['A', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(value)) {
            // Low Zone: Ace to 8 of all suits
            if (['A', '1', '2', '3', '4', '5', '6', '7', '8'].includes(value)) {
              lowCards.push(img);
            } 
            // 9 of Heart, Club, Diamond (NOT Spade)
            else if (value === '9' && ['HH', 'DD', 'CC'].includes(suit)) {
              lowCards.push(img);
            }
            // 9 of Spade goes to right side
            else if (value === '9' && suit === 'SS') {
              rightSideCard = img;
            }
          } 
          else if (['J', 'Q', 'K'].includes(value)) {
            // High Zone: J, Q, K of all suits
            highCards.push(img);
          } 
          else if (value === '10') {
            // 10 of Heart, Club, Diamond (NOT Spade)
            if (['HH', 'DD', 'CC'].includes(suit)) {
              highCards.push(img);
            }
            // 10 of Spade goes to right side
            else if (suit === 'SS') {
              rightSideCard = img;
            }
          }
        });
        
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2 align-items-center">
              <div className="col-10 text-center">
                <div className="row align-items-center">
                  <div className="col-2">Low Cards</div>
                  <div className="col-10">
                    <div className="casino-result-cards">
                      {lowCards.map((img, i) => (
                        <img key={i} src={img} alt="Card" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="row align-items-center">
                  <div className="col-2">High Cards</div>
                  <div className="col-10">
                    <div className="casino-result-cards">
                      {highCards.map((img, i) => (
                        <img key={i} src={img} alt="Card" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-2 text-center">
                <div className="casino-result-cards">
                  {rightSideCard && <img src={rightSideCard} alt="Right Side Card" />}
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-6">
                <div className="casino-result-desc">
                  <div className="casino-result-desc-item">
                    <div>Winner</div>
                    <div>{winner_data?.winner || normalizedResult?.rdesc || "Tie"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ✅ CMATCH20 (single card)
      case "cmatch20":
        const cmatchCard = normalizedResult?.card
          ? getCardImage(normalizedResult.card)
          : "/img/casino/cards/1.png";
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="eightplayer">
              <div className="row result-row mt-3">
                <div className="col sixplayer-image">
                  <div className="casino-result-cards">
                    <img src={cmatchCard} alt="Card" />
                  </div>
                </div>
              </div>
            </div>
            {winner_data?.winner && (
              <div className="row mt-2 justify-content-center">
                <div className="col-md-6">
                  <div className="casino-result-desc">
                    <div className="casino-result-desc-item">
                      <div>Run:</div>
                      <div>{winner_data.winner}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // ✅ NOTENUM (all cards + mapped fields)
      case "notenum":
        const notenumCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 text-center">
                <div className="casino-result-cards">
                  {notenumCards.map(
                    (c, i) =>
                      isValidCard(c) && (
                        <img key={i} src={getCardImage(c)} alt="Card" />
                      )
                  )}
                </div>
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // ✅ TRIO (three cards + mapped fields)
      case "trio":
      case "vtrio":
        const trioCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 text-center">
                <div className="casino-result-cards">
                  {trioCards
                    .slice(0, 3)
                    .map(
                      (c, i) =>
                        isValidCard(c) && (
                          <img
                            key={i}
                            src={getCardImage(c)}
                            alt="Card"
                            className="mr-2"
                          />
                        )
                    )}
                </div>
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // ✅ **Cricket Games with Dynamic Teams**
      case "superover":
      case "superover2":
      case "superover3":
      case "cricketv3":
        // Get dynamic team names from backend or use intelligent defaults
        const getTeamNames = (matchId, resultData) => {
          // First priority: explicit team names from backend
          if (resultData?.team_names && Array.isArray(resultData.team_names)) {
            return resultData.team_names;
          }

          // Second priority: extract from winner_data or result description
          if (winner_data?.teams) {
            return winner_data.teams;
          }

          // Third priority: intelligent defaults based on match type
          const teamMappings = {
            superover: ["ENG", "RSA"],
            superover2: ["IND", "ENG"],
            superover3: ["IND", "AUS"],
            cricketv3: ["AUS", "IND"],
          };

          return teamMappings[matchId] || ["Team A", "Team B"];
        };

        const getWinnerTeam = (teams, winValue) => {
          const winNum = parseInt(winValue);
          if (winNum === 1) return teams[0];
          if (winNum === 2) return teams[1];
          return "TIE";
        };

        const dynamicTeams = getTeamNames(matchId, normalizedResult);
        const winnerTeam = getWinnerTeam(dynamicTeams, normalizedResult?.win);
        const teamInnings = resultNew?.t1?.score || [];
        const maxBalls = matchId === "superover3" ? 4 : 6;

        // Process innings data dynamically based on team names
        const processInnings = (innings, targetTeam, excludeTeam) => {
          if (!innings || !Array.isArray(innings)) return [];

          return innings.filter((ball) => {
            // Match by team name (case insensitive)
            const ballTeam = ball.nat || "";
            return ballTeam.toLowerCase() !== excludeTeam.toLowerCase();
          });
        };

        const team1Innings = processInnings(
          teamInnings,
          dynamicTeams[0],
          dynamicTeams[1]
        );
        const team2Innings = processInnings(
          teamInnings,
          dynamicTeams[1],
          dynamicTeams[0]
        );

        const calculateScore = (innings) => {
          let runs = 0;
          let wickets = 0;
          innings.forEach((ball) => {
            if (ball.wkt === true) {
              wickets++;
            } else {
              runs += parseInt(ball.run) || 0;
            }
          });
          return { runs, wickets };
        };

        const team1Score = calculateScore(team1Innings);
        const team2Score = calculateScore(team2Innings);

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="cricket-match-result">
              <div className="mb-1 text-right mt-3 text-end score-head">
                Winner: <span className="text-warning">{winnerTeam}</span>
                <span className="text-white">
                  {" "}
                  | {normalizedResult?.rdesc || ""}
                </span>
              </div>

              {/* First Inning */}
              <div className="table-responsive">
                <div className="market-title">First Inning</div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-center">
                        <b>
                          <span className="text-success">
                            {dynamicTeams[0]}
                          </span>
                        </b>
                      </th>
                      {[...Array(maxBalls)].map((_, i) => (
                        <th key={i} className="text-center">
                          <b>{i + 1}</b>
                        </th>
                      ))}
                      <th className="text-center">
                        <b>Run/Over</b>
                      </th>
                      <th className="text-center">
                        <b>Score</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <b>Over 1</b>
                      </td>
                      {[...Array(maxBalls)].map((_, i) => {
                        const ball = team1Innings[i];
                        return (
                          <td key={i} className="text-center">
                            {ball ? (
                              ball.wkt ? (
                                <span className="text-danger">WW</span>
                              ) : (
                                <span>{ball.run}</span>
                              )
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="text-center nationcard">
                        {team1Score.runs}
                      </td>
                      <td className="text-center nationcard">
                        {team1Score.runs}/{team1Score.wickets}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Second Inning */}
              <div className="table-responsive mt-3">
                <div className="market-title">Second Inning</div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="text-center">
                        <b>
                          <span className="text-success">
                            {dynamicTeams[1]}
                          </span>
                        </b>
                      </th>
                      {[...Array(maxBalls)].map((_, i) => (
                        <th key={i} className="text-center">
                          <b>{i + 1}</b>
                        </th>
                      ))}
                      <th className="text-center">
                        <b>Run/Over</b>
                      </th>
                      <th className="text-center">
                        <b>Score</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <b>Over 1</b>
                      </td>
                      {[...Array(maxBalls)].map((_, i) => {
                        const ball = team2Innings[i];
                        return (
                          <td key={i} className="text-center">
                            {ball ? (
                              ball.wkt ? (
                                <span className="text-danger">WW</span>
                              ) : (
                                <span>{ball.run}</span>
                              )
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="text-center nationcard">
                        {team2Score.runs}
                      </td>
                      <td className="text-center nationcard">
                        {team2Score.runs}/{team2Score.wickets}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      // ✅ **Sicbo Game** - Dice game with 3 dice results
      case "sicbo":
      case "sicbo2":
        const sicboResult = normalizedResult?.rdesc || winner_data?.winner || "";
        const sicboWin = normalizedResult?.win || "";
        
        // Parse dice results from rdesc (e.g., "1,4,6" or "1,4,6#11")
        const parseSicboResult = (rdesc) => {
          if (!rdesc) return { dice: [], total: "" };
          
          const parts = rdesc.split('#');
          const diceStr = parts[0] || "";
          const total = parts[1] || "";
          
          const dice = diceStr.split(',').map(d => d.trim()).filter(d => d);
          return { dice, total };
        };
        
        const { dice, total } = parseSicboResult(sicboResult);
        
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 text-center">
                <div className="casino-result-cards">
                  {dice.map((die, index) => (
                    <img 
                      key={index} 
                      src={`/img/dice/dice${die}.png`} 
                      alt={`Dice ${die}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-6">
                <div className="casino-result-desc">
                  <div className="casino-result-desc-item">
                    <div>Desc</div>
                    <div>{dice.join(',')}</div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Win</div>
                    <div>{total || sicboWin}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ✅ **Other Games**
      case "queen":
        const queenCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const totals = [[], [], [], []];

        for (let a = 0; a < 4; a++) {
          for (let i = a; i < queenCards.length; i += 4) {
            if (queenCards[i] && queenCards[i] !== "1") {
              totals[a].push(getCardImage(queenCards[i]));
            }
          }
        }

        const calculatedTotals = totals.map((cardArr, key) => {
          let sum = 0;
          cardArr.forEach((cardImg) => {
            const match = cardImg.match(/(\d+)/);
            if (match) sum += parseInt(match[1]);
          });
          return sum + key;
        });

        const winnerKey = parseInt(normalizedResult?.winnat?.slice(-1) || 0);

        return (
          <div className="casino-result-modal">
            <h6 className="text-right round-id">
              <b>Round Id:</b>{" "}
              {normalizedResult?.rid || requestData?.roundID || ""}
            </h6>
            <div className="row mt-2">
              {totals.map((cardArr, index) => (
                <div key={index} className="col-md-3 text-center">
                  <h4 className="result-title">
                    Total {index} -{" "}
                    <span className="badge bg-success">
                      {calculatedTotals[index]}
                    </span>
                  </h4>
                  <div className="casino-result-cards">
                    {cardArr.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Card"
                        className="casino-card"
                      />
                    ))}
                    {index === winnerKey && (
                      <div className="casino-winner-icon">
                        <i className="fas fa-trophy"></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-6">
                <div className="casino-result-desc">
                  <div className="casino-result-desc-item">
                    <div>Winner:</div>
                    <div>
                      {normalizedResult?.winnat || winner_data?.winner || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ✅ POISON Games (Poison card + Player A & B with 3 cards each)
      case "poison":
      case "poison20":
      case "teenjoker":
        const poisonCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        const poisonCard =
          poisonCards[0] && isValidCard(poisonCards[0])
            ? getCardImage(poisonCards[0])
            : "/img/casino/cards/1.png";
        // Except 1st index (poison), take even indices for Player A, odd indices for Player B
        const poisonPlayerACards = [];
        const poisonPlayerBCards = [];

        poisonCards.slice(1).forEach((card, index) => {
          if (isValidCard(card)) {
            const cardImg = getCardImage(card);
            if (index % 2 === 0) {
              poisonPlayerACards.push(cardImg); // Even indices (0, 2, 4...)
            } else {
              poisonPlayerBCards.push(cardImg); // Odd indices (1, 3, 5...)
            }
          }
        });

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-12 text-center">
                <h4 className="result-title">
                  {matchId === "joker20" ? "JOKER20" : "Poison"}
                </h4>
                <div className="casino-result-cards">
                  {matchId === "joker20" ? (
                    // For joker20, show all cards in a single row
                    poisonCards.map((card, index) => {
                      if (isValidCard(card)) {
                        const cardImg = getCardImage(card);
                        return (
                          <img
                            key={index}
                            src={cardImg}
                            alt="Card"
                            className="mr-2"
                          />
                        );
                      }
                      return null;
                    })
                  ) : (
                    // For poison games, show the poison card separately
                    <img
                      src={poisonCard}
                      alt={matchId === "joker20" ? "Joker Card" : "Poison Card"}
                    />
                  )}
                </div>
              </div>
              {matchId !== "joker20" && (
                <>
                  <div className="col-md-6 text-center">
                    <h4 className="result-title">Player A</h4>
                    <div className="casino-result-cards">
                      {String(normalizedResult?.win) === "1" && (
                        <div className="casino-winner-icon">
                          <i className="fas fa-trophy"></i>
                        </div>
                      )}
                      {poisonPlayerACards.map((img, i) => (
                        <img key={i} src={img} alt="Card" />
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6 text-center">
                    <h4 className="result-title">Player B</h4>
                    <div className="casino-result-cards">
                      {String(normalizedResult?.win) === "2" && (
                        <div className="casino-winner-icon">
                          <i className="fas fa-trophy"></i>
                        </div>
                      )}
                      {poisonPlayerBCards.map((img, i) => (
                        <img key={i} src={img} alt="Card" />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // ✅ JOKER20/JOKER120 Games - Special structure with Joker card
      
      case "joker120":
        const jokerCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        
        // First card is the Joker card
        const jokerCardIs = jokerCard ? `/img/joker1/${jokerCard}.png` : "/img/joker1/14.png";
        
        // Distribute remaining cards to Player A and Player B
        const jokerPlayerACards = [];
        const jokerPlayerBCards = [];

        jokerCards.forEach((card, index) => {
          if (isValidCard(card)) {
            const cardImg = getCardImage(card);
            if (index % 2 === 0) {
              jokerPlayerACards.push(cardImg); // Even indices (0, 2, 4...)
            } else {
              jokerPlayerBCards.push(cardImg); // Odd indices (1, 3, 5...)
            }
          }
        });

        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-md-12 text-center">
                <h4 className="result-title">Joker</h4>
                <div className="casino-result-cards">
                  <img src={jokerCardIs} alt="Joker Card" />
                </div>
              </div>
              <div className="col-md-6 text-center">
                <h4 className="result-title">Player A</h4>
                <div className="casino-result-cards">
                  
                  {jokerPlayerACards.map((img, i) => (
                    <img key={i} src={img} alt="Card" />
                  ))}
                </div>
              </div>
              <div className="col-md-6 text-center">
                <h4 className="result-title">Player B</h4>
                <div className="casino-result-cards">
                  
                  {jokerPlayerBCards.map((img, i) => (
                    <img key={i} src={img} alt="Card" />
                  ))}
                </div>
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // ✅ DUM10 (Dus ka Dum) - Special structure with card slider and right side card
      case "dum10":
        const dum10Cards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        
        // Parse the rdesc to extract different parts
        const parseDum10Data = (rdesc) => {
          if (!rdesc) return {};
          
          const parts = rdesc.split('#');
          return {
            card: parts[0] || "",
            currTotal: parts[1] || "",
            total: parts[2] || "",
            oddEven: parts[3] || "",
            redBlack: parts[4] || ""
          };
        };
        
        const dum10Data = parseDum10Data(normalizedResult?.rdesc);
        
        // First two cards go to the slider, third card goes to right side
        const sliderCards = dum10Cards.slice(0, -1).map(card => getCardImage(card));
        const rightSideCards = dum10Cards[dum10Cards.length - 1] ? getCardImage(dum10Cards[dum10Cards.length - 1]) : null;
        
        // Slick slider settings for DUM10
        const dum10SliderSettings = {
          dots: false,
          infinite: false,
          speed: 500,
          slidesToShow: 14,
          slidesToScroll: 1,
          arrows: true,
          variableWidth: true,
          centerMode: dum10Cards.length > 2 ? false :true,
          touchMove: true,
          swipe: true,
          swipeToSlide: true,
          touchThreshold: 5,
          responsive: [
            {
              breakpoint: 768,
              settings: { 
                slidesToShow: 2,
                variableWidth: true,
                touchMove: true,
                swipe: true,
                swipeToSlide: true
              }
            }
          ]
        };
        
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2 ab-result-container">
              <div className="col-md-10 text-center">
                <div className="casino-result-cards ab-result-slider">
                  {sliderCards.length > 0 && (
                    <Slider {...dum10SliderSettings}>
                      {sliderCards.map((img, index) => (
                        <div key={index} style={{ width: "52px", margin: "20px 2px" }}>
                          <img
                            src={img}
                            alt="Card"
                            
                          />
                        </div>
                      ))}
                    </Slider>
                  )}
                </div>
              </div>
              <div className="col-md-2 text-center">
                <div className="casino-result-cards">
                  {rightSideCards && (
                    <img src={rightSideCards} alt="Right Side Card" />
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-2 justify-content-center">
              <div className="col-md-6">
                <div className="casino-result-desc">
                  <div className="casino-result-desc-item">
                    <div>Card</div>
                    <div>{dum10Data.card}</div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Curr. Total</div>
                    <div>{dum10Data.currTotal}</div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Total</div>
                    <div>{dum10Data.total}</div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Odd/Even</div>
                    <div>{dum10Data.oddEven}</div>
                  </div>
                  <div className="casino-result-desc-item">
                    <div>Red/Black</div>
                    <div>{dum10Data.redBlack}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // Generic cases for remaining games
      case "poker":
      case "poker6":
      case "poker20":
      case "war":
      case "3cardj":
      case "worli":
      case "worli2":
      case "aaa":
      case "vaaa":
      case "aaa2":
      case "btable":
      case "vbtable":
      case "btable2":
      case "trap":
      case "lottcard":
      case "kbc":
        const gameCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-12 text-center">
                <div className="casino-result-cards">
                  {gameCards
                    .slice(0, 6)
                    .map(
                      (card, index) =>
                        isValidCard(card) && (
                          <img
                            key={index}
                            src={getCardImage(card)}
                            alt="Card"
                            className="mr-2"
                          />
                        )
                    )}
                </div>
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // ✅ JOKER20 - Special case for Joker 20-20 game
      case "joker20":
        const joker20Cards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-12 text-center">
                <h4 className="result-title">JOKER20</h4>
                <div className="casino-result-cards">
                  {joker20Cards.map((card, index) => {
                    if (isValidCard(card)) {
                      const cardImg = getCardImage(card);
                      return (
                        <img
                          key={index}
                          src={cardImg}
                          alt="Card"
                          className="mr-2"
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
            {renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );

      // Handle all remaining games with a comprehensive default case
      default:
        const defaultCards = normalizedResult?.card
          ? normalizedResult.card.split(",")
          : [];
        return (
          <div className="casino-result-modal">
            <div className="casino-result-round-id">
              <span>
                <b>Round Id: </b>{" "}
                {normalizedResult?.rid || requestData?.roundID || ""}
              </span>
              <span>
                <b>Match Time: </b>
                {winner_data?.match_time || normalizedResult?.mtime || ""}
              </span>
            </div>
            <div className="row mt-2">
              <div className="col-12 text-center">
                <h4 className="result-title">
                  {matchId?.toUpperCase() || "Casino Game"}
                </h4>
                <div className="casino-result-cards">
                  {defaultCards
                    .slice(0, 6)
                    .map(
                      (card, index) =>
                        isValidCard(card) && (
                          <img
                            key={index}
                            src={getCardImage(card)}
                            alt="Card"
                            className="mr-2"
                          />
                        )
                    )}
                </div>
              </div>
            </div>
            {winner_data &&
              renderWinnerData(winner_data, normalizedResult, matchId)}
          </div>
        );
    }
  };

  // Render betting history table globally for all casino games
  return (
    <>
      {renderGameResult()}
      {renderBettingHistoryTable(setJokerCard)}
    </>
  );
};

export default CasinoGameResultsFinal;
