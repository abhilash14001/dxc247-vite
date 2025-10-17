import React from 'react';

const CricketScoreboard = ({ data }) => {
    
    const { scoreboard } = data;
    const { balls, teams, message} = scoreboard;

    const getBallClass = (ball) => {
        switch (ball.toLowerCase()) {
            case 'ww':
                return 'ball-runs wicket';
                case '4':
                    return 'ball-runs four';
            case '6':
                return 'ball-runs six';
            case '1':
            case '2':
            case '3':
            case '0':
            default:
                return 'ball-runs';
        }
    };

    const getBallText = (ball) => {
        if (ball.toLowerCase() === 'ww') {
            return 'ww';
        }
        return ball;
    };

    return (
        <div className="scorecard mb-1">
            <div className="row">
                <div className="col-12 col-md-6">
                    {teams.map((team, index) => (
                        <p key={index} className={`team-1 row ${index > 0 ? 'mt-2' : ''}`}>
                            <span className="team-name col-3">{team.name}</span>
                            <span className="score col-4 text-end">{team.score}</span>
                            <span className="team-name col-5">
                                {team.crr && <span>CRR {team.crr}</span>}
                                {team.rr && <span> RR {team.rr}</span>}
                            </span>
                        </p>
                    ))}
                </div>
                <div className="col-12 col-md-6">
                    <div className="row">
                        <div className="col-12">
                            <div className="text-xl-end">{message}</div>
                            <div className="row">
                                <div className="col-12">
                                    <p className="text-xl-end ball-by-ball mt-2">
                                        {balls.slice(0, 6).map((ball, index) => (
                                            ball && (
                                            <span key={index} className={getBallClass(ball)}>
                                                {getBallText(ball)}
                                            </span>
                                            )
                                        ))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CricketScoreboard;
