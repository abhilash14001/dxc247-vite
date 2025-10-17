export const Teen32 = ({lastResults, openPopup}) => {
    return (
        <>
            {Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;
                const className = result.win === '1' ? 'result result-a' : result.win === '3' ? 'result result-c' : 'result result-b';

                return (
                    <span onClick={() => openPopup(mid)}
                          key={mid}
                          className={className}
                          title={`Round ID: ${mid}`}
                    >
                                    {result.win === '1' ? 'A' : result.win === '3' ? 'T' : 'B'}
                                    </span>
                );
            })}
        </>
    );
}
