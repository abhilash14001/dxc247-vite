import { useContext } from 'react';
import { CasinoContext } from '../contexts/CasinoContext';

const MobileMatchedBetTable = ({mybetModel, type}) => {
    const { availableTeenUniqueCards } = useContext(CasinoContext);

    const getRemainingNumbers = (selectedNumbers) => {
        return [1, 2, 3, 4, 5, 6].filter((num) => !selectedNumbers.includes(num));
    };

    return (
        <div className="table-responsive">
            {type === 'teenunique' ? (
                <div className="unique-teen20-table">
                    <div className="unique-teen20-table-head">
                        <div className="unique-match-bet">Matched Bet</div>
                        <div className="unique-match-odds">Odds</div>
                        <div className="unique-match-stake">Stake</div>
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

                                    <div className="unique-your-card">
                                        <div>
                                            <h4>Your Card</h4>
                                            <div>
                                                {teamname.map((num, index) => {
                                                    const card = availableTeenUniqueCards.find(
                                                        (c) => c.key === num
                                                    );
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
                                                    );
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
            ) : type !== 'lottcard' ? (
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Matched Bet</th>
                            {(type === 'superover' || type === 'cricketv3' || type === 'trap' || type === 'poker' || type === 'card32eu' || type === 'queen' || type === 'card32') && (
                                <th>Bet Type</th>
                            )}
                            <th>Odd1</th>
                            <th>Stack</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mybetModel.length > 0 &&  (
                            mybetModel.map((data, key) => {
                                const rowClass = (data.extra === 'LAY' || data.extra === 'NO') ? 'lay' : 'back';
                                return (
                                    <tr key={key} className={rowClass}>
                                        {data.bet_type === '3CARDJ' ? (
                                            <td>{data.type} {data.team_name}</td>
                                        ) : (
                                            <td>{data.team_name}</td>
                                        )}
                                        {(type === 'superover' || type === 'cricketv3' || type === 'trap' || type === 'poker' || type === 'card32eu' || type === 'queen' || type === 'card32') && (
                                            <td>{data.extra}</td>
                                        )}
                                        <td>{data.bet_odds}</td>
                                        <td>{data.bet_amount}</td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                ) : (
                    <div className="my-bets lottery-bets">
                        {mybetModel.map((data, key) => (
                            <div key={key} className="lottery-my-bet-box">
                                <div>{`${data.type.charAt(0).toUpperCase() + data.type.slice(1).toLowerCase()} - ${data.team_name === 10 ? 0 : data.team_name}`}</div>
                                <div>{data.bet_amount}</div>
                            </div>
                        ))}
                    </div>
                )}
            
        </div>
    );
};

export default MobileMatchedBetTable;
