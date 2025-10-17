const RulesCard = ({gamename}) => {

    const renderRules = () => {
        switch (gamename) {

                case "poker" : {
                    const bonuses = [
                        {
                            title: "Bonus 1 (2 Cards Bonus)",
                            rules: [
                                {description: "Pair (2-10)", value: "1 TO 3"},
                                {description: "A/Q or A/J Off Suited", value: "1 To 5"},
                                {description: "Pair (JQK)", value: "1 To 10"},
                                {description: "A/K Off Suited", value: "1 To 15"},
                                {description: "A/Q or A/J Suited", value: "1 To 20"},
                                {description: "A/K Suited", value: "1 To 25"},
                                {description: "A/A", value: "1 To 30"},
                            ],
                        },
                        {
                            title: "Bonus 2 (7 Cards Bonus)",
                            rules: [
                                {description: "Three of a Kind", value: "1 TO 3"},
                                {description: "Straight", value: "1 To 4"},
                                {description: "Flush", value: "1 To 6"},
                                {description: "Full House", value: "1 To 8"},
                                {description: "Four of a Kind", value: "1 To 30"},
                                {description: "Straight Flush", value: "1 To 50"},
                                {description: "Royal Flush", value: "1 To 100"},
                            ],
                        },
                    ];

                    return (
                        <div className="card m-b-10">
                            <div className="card-header">
                                <h6 className="card-title d-inline-block">Rules</h6>
                            </div>
                            <div className="card-body" style={{padding: '10px'}}>
                                <table className="table table-bordered rules-table">
                                    <tbody>
                                    {bonuses.map((bonus, index) => (
                                        <>
                                            <tr className="text-center">
                                                <th colSpan="2">{bonus.title}</th>
                                            </tr>
                                            {bonus.rules.map((rule, idx) => (
                                                <tr key={idx}>
                                                    <td width="60%">{rule.description}</td>
                                                    <td>{rule.value}</td>
                                                </tr>
                                            ))}
                                        </>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                }

                case 'teen20' :
            case 'vteen20' :
                    return (
                        <div className="card m-b-10">

                            <div className="card-header">
                                <h6 className="card-title d-inline-block">
                                    Rules
                                </h6>
                            </div>
                            <div className="card-body" style={{padding: "10px"}}>
                                <table className="table table-bordered rules-table">
                                    <tbody>
                                    <tr className="text-center">
                                        <th colSpan="2">Pair Plus</th>
                                    </tr>
                                    <tr>
                                        <td width="60%">Pair (Double)</td>
                                        <td>1 To 1</td>
                                    </tr>

                                    <tr>
                                        <td width="60%">Flush (Color)</td>
                                        <td>1 To 4</td>
                                    </tr>

                                    <tr>
                                        <td width="60%">Straight (Rown)</td>
                                        <td>1 To 6</td>
                                    </tr>

                                    <tr>
                                        <td width="60%">Trio (Teen)</td>
                                        <td>1 To 35</td>
                                    </tr>

                                    <tr>
                                        <td width="60%">Straight Flush (Pakki Rown)</td>
                                        <td>1 To 45</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    );


                case 'teen8' :
                    return (
                        <div className="card m-b-10">
                            <div className="card-header">
                                <h6 className="card-title d-inline-block">
                                    Rules
                                </h6>
                            </div>
                            <div className="card-body" style={{padding: "10px"}}>
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th colSpan="2" className="text-center">Pair Plus</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>Pair</td>
                                            <td>1 TO 1</td>
                                        </tr>
                                        <tr>
                                            <td>Flush</td>
                                            <td>1 TO 4</td>
                                        </tr>
                                        <tr>
                                            <td>Straight</td>
                                            <td>1 TO 6</td>
                                        </tr>
                                        <tr>
                                            <td>Trio</td>
                                            <td>1 TO 30</td>
                                        </tr>
                                        <tr>
                                            <td>Straight Flush</td>
                                            <td>1 TO 40</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )

            case 'superover' :
                return (
                    <div className="sidebar-box place-bet-container super-over-rule">
                        <div className="sidebar-title">
                            <h4>ENGLAND vs RSA Inning's Card Rules</h4>
                        </div>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Cards</th>
                                        <th className="text-center">Count</th>
                                        <th className="text-end">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { card: 'A', value: '1', ball: 'ball1' },
                                        { card: '2', value: '2', ball: 'ball2' },
                                        { card: '3', value: '3', ball: 'ball3' },
                                        { card: '4', value: '4', ball: 'ball4' },
                                        { card: '6', value: '6', ball: 'ball6' },
                                        { card: '10', value: '0', ball: 'ball0' },
                                        { card: 'K', value: 'Wicket', ball: 'wicket' }
                                    ].map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <img 
                                                    src={`/assets/img/superover/cards/card${item.card}.png`}
                                                    alt={`card-${item.card}`}
                                                />
                                                <span className="ms-2">X</span>
                                            </td>
                                            <td className="text-center">5</td>
                                            <td className="text-end">
                                                {item.value === 'Wicket' && <span>Wicket</span>}
                                                <img 
                                                    src={`/assets/img/superover/balls/${item.ball}.png`}
                                                    alt={`${item.ball}`}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'teen20b':
                return (
                    <div className="card m-b-10">
                        <div className="card-header">
                            <h6 className="card-title d-inline-block">Rules</h6>
                        </div>
                        <div className="card-body" style={{padding: '10px'}}>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th colSpan="2" className="text-center">Pair Plus</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Pair</td>
                                        <td>1 TO 1</td>
                                    </tr>
                                    <tr>
                                        <td>Flush</td>
                                        <td>1 TO 4</td>
                                    </tr>
                                    <tr>
                                        <td>Straight</td>
                                        <td>1 TO 6</td>
                                    </tr>
                                    <tr>
                                        <td>Trio</td>
                                        <td>1 TO 30</td>
                                    </tr>
                                    <tr>
                                        <td>Straight Flush</td>
                                        <td>1 TO 40</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'teenmuf':
            case 'vteenmuf':
                return (
                    <div className="card m-b-10">
                        <div className="card-header">
                            <h6 className="card-title d-inline-block">Rules</h6>
                        </div>
                        <div className="card-body" style={{padding: '10px'}}>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th colSpan="2" className="text-center">Top 9</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Card 9</td>
                                        <td>1 TO 3</td>
                                    </tr>
                                    <tr>
                                        <td>Card 8</td>
                                        <td>1 TO 4</td>
                                    </tr>
                                    <tr>
                                        <td>Card 7</td>
                                        <td>1 TO 5</td>
                                    </tr>
                                    <tr>
                                        <td>Card 6</td>
                                        <td>1 TO 8</td>
                                    </tr>
                                    <tr>
                                        <td>Card 5</td>
                                        <td>1 TO 30</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'teensin':
                return (
                    <div className="card m-b-10">
                        <div className="card-header">
                            <h6 className="card-title d-inline-block">Rules</h6>
                        </div>
                        <div className="card-body" style={{padding: '10px'}}>
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th colSpan="2" className="text-center">Color Plus Rules</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Straight</td>
                                    <td>1 TO 2</td>
                                </tr>
                                <tr>
                                    <td>Flush</td>
                                    <td>1 TO 5</td>
                                </tr>
                                <tr>
                                    <td>Trio</td>
                                    <td>1 TO 20</td>
                                </tr>
                                <tr>
                                    <td>Straight Flush</td>
                                    <td>1 TO 30</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'patti2':
                return (
                    <div className="card m-b-10">
                        <div className="card-header">
                            <h6 className="card-title d-inline-block">Rules</h6>
                        </div>
                        <div className="card-body" style={{padding: '10px'}}>
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th colSpan="2" className="text-center">Color Plus Rules</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Three card Sequence</td>
                                    <td>1 TO 3</td>
                                </tr>
                                <tr>
                                    <td>Four card color</td>
                                    <td>1 TO 9</td>
                                </tr>
                                <tr>
                                    <td>Four card Sequence</td>
                                    <td>1 TO 9</td>
                                </tr>
                                <tr>
                                    <td>Three of a kind</td>
                                    <td>1 TO 12</td>
                                </tr>
                                <tr>
                                    <td>Three card pure Sequence</td>
                                    <td>1 TO 15</td>
                                </tr>
                                <tr>
                                    <td>Four card pure Sequence</td>
                                    <td>1 TO 150</td>
                                </tr>
                                <tr>
                                    <td>Four of a kind</td>
                                    <td>1 TO 200</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return renderRules(gamename)

};

export default RulesCard;