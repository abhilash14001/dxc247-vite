export const Card32 = ({lastResults, openPopup}) => {
    return (
        <>
            {Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;
                const className = 'result result-b';

                return (
                    <span onClick={() => openPopup(mid)}
                          key={mid}
                          className={className}
                          title={`Round ID: ${mid}`}
                    >
                                    {result.win === '1' ? '8' : (result.win === '2' ?  '9' : (result.win === '3' ? 10: 11) )}
                                </span>
                );
            })}
        </>
    );
}
