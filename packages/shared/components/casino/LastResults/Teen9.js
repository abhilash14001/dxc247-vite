export const Teen9 = ({lastResults, openPopup}) => {
    return (
        <>
            {Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;
                const className = result.win === '1' ? 'result result-a' : (result.win === '3' ? 'result result-c' : 'result result-b');

                return (
                    <span onClick={() => openPopup(mid)}
                          key={mid}
                          className={className}
                          title={`Round ID: ${mid}`}
                    >
                                    {result.win === '1' ? 'T' : (result.win === '3' ? 'D' :"L" )}
                                </span>
                );
            })}
        </>
    );
}
