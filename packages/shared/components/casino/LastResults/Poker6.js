export const Poker6 = ({lastResults, openPopup}) => {
    return (
        <>
            {Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;
                const className = result.win !== '0' ?  'result result-b' : "result";

                return (
                    <span onClick={() => openPopup(mid)}
                          key={mid}
                          className={className}
                          title={`Round ID: ${mid}`}
                    >
                                    {result.win !== '0' ? result['win'].slice(-1) : 'T'}
                                </span>
                );
            })}
        </>
    );
}
