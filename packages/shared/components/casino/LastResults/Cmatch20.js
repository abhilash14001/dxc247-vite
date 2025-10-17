export const Cmatch20 = ({lastResults, openPopup}) => {
    return (
        <>
            {Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;
                const className = 'result'

                return (
                    <span onClick={() => openPopup(mid)}
                          key={mid}
                          className={className}
                          title={`Round ID: ${mid}`}
                    >

                       <img src={`/img/balls/cricket20/ball${result.win}.png`} className="balls"/>
                        &nbsp;
                                </span>
                );
            })}
        </>
    );
}

