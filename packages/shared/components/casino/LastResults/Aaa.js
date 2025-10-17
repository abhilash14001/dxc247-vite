export const Aaa = ({lastResults, openPopup}) => {
    return (
        <>
            {Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;
                const className = result.win === '1' ? 'result result-a' : (result.win === '2' ?  'result result-b' : 'result result-c');

                return (
                    <span onClick={() => openPopup(mid)}
                          key={mid}
                          className={className}
                          title={`Round ID: ${mid}`}
                    >
                                    {result.win === '1' ? 'A' : (result.win === '2' ? 'B' : 'C')}
                                </span>
                );
            })}
        </>
    );
}
