import { useContext, useEffect } from "react";

import { CasinoContext } from "../../contexts/CasinoContext";

const MatchedBetTable = ({ mybetModel, type, isAdmin = false, isBetDeleteAccess = true, onDelete = null, onUndo = null }) => {
  const { availableTeenUniqueCards } = useContext(CasinoContext);
  const games = ["ab20"];

  const rowClass = (data, type) => {
    if (
      games.includes(type) &&
      data.team_name.toUpperCase().includes("ANDAR")
    ) {
      return "andarbg";
    } else if (
      games.includes(type) &&
      data.team_name.toUpperCase().includes("BAHAR")
    ) {
      return "baharbg";
    } else if (data.extra === "LAY") {
      return "lay";
    }

    return "back";
  };

  const getRemainingNumbers = (selectedNumbers) => {
    return [1, 2, 3, 4, 5, 6].filter((num) => !selectedNumbers.includes(num));
  };

  
  return type !== "teenunique" ? (
    <div className="table-responsive">
      <div className="tbodyScroll">
        {type !== "lottcard" ? (
          <table className="table">
            <thead>
              <tr>
                <th>Matched Bet</th>
                <th>Odds</th>
                <th>Stack</th>
                {isAdmin && isBetDeleteAccess && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {mybetModel.length > 0 &&
                mybetModel.map((data, key) => (
                  <tr key={key} className={rowClass(data, type)}>
                    {data.bet_type === "3CARDJ" ? (
                      <td>
                        {data.type} {data.team_name}
                      </td>
                    ) : (
                      <td>{data.team_name}</td>
                    )}
                    <td>{data.bet_odds}</td>
                    <td>{data.bet_amount}</td>
                    {isAdmin && isBetDeleteAccess && (
                      <td>
                        {data.is_deleted === 1 ? (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => onUndo && onUndo(data.id)}
                            title="Restore bet"
                          >
                            <i className="fa fa-undo"></i>
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => onDelete && onDelete(data.id)}
                            title="Delete bet"
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="my-bets lottery-bets">
            {mybetModel.map((data, key) => (
              <div key={key} className="lottery-my-bet-box">
                <div>{`${
                  data.type.charAt(0).toUpperCase() +
                  data.type.slice(1).toLowerCase()
                } - ${data.team_name === 10 ? 0 : data.team_name}`}</div>
                <div>{data.bet_amount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="unique-teen20-table">
      <div className="unique-teen20-table-head">
        <div className="unique-match-bet">Matched Bet</div>
        <div className="unique-match-odds">Odds</div>
        <div className="unique-match-stake">Stake</div>
        {isAdmin && isBetDeleteAccess && <div className="unique-match-action">Action</div>}
      </div>

      {mybetModel.map((data, key) => {
        const teamname = JSON.parse(data.team_name);
        return (
          <div className="unique-teen20--table-body" key={key}>
            <div className="back unique-teen20-table-row">
              <div className="unique-match-bet">
                Your card {teamname.join("")}
              </div>
              <div className="unique-match-odds">{data.bet_odds}</div>
              <div className="unique-match-stake">{data.bet_amount}</div>
              {isAdmin && isBetDeleteAccess && (
                <div className="unique-match-action">
                  {data.is_deleted === 1 ? (
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => onUndo && onUndo(data)}
                      title="Restore bet"
                    >
                      <i className="fa fa-undo"></i>
                    </button>
                  ) : (
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete && onDelete(data)}
                      title="Delete bet"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  )}
                </div>
              )}

              <div className="unique-your-card">
                <div>
                  <h4>Your Card</h4>
                  <div>
                    {teamname.map((num, index) => {
                      const card = availableTeenUniqueCards.find(
                        (c) => c.key === num
                      ); // or c.cardValue === num

                      return (
                        <img
                          key={index}
                          src={
                            card && card.cardValue !== "1"
                              ? card.image
                              : `/img/sequence/s${num}.png`
                          }
                          alt={`Card ${num}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4>Dealer Card</h4>
                  <div>
                    {getRemainingNumbers(teamname).map((num, index) => {
                      const card = availableTeenUniqueCards.find(
                        (c) => c.key === num
                      ); // or c.cardValue === num

                      return (
                        <img
                          key={index}
                          src={
                            card && card.cardValue !== "1"
                              ? card.image
                              : `/img/sequence/s${num}.png`
                          }
                          alt={`Card ${num}`}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchedBetTable;
