export const Superover3 = ({lastResults, openPopup}) => {
    return (
        <>
            {Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;
                const className = result.win === '1' ? 'result result-a' : (result.win === '2' ? 'result result-b' : 'result');

                return (
                    <span onClick={() => openPopup(mid)}
                          key={mid}
                          className={className}
                          title={`Round ID: ${mid}`}
                    >
                                    {result.win === '1' ? 'I' : (result.win === '2' ? 'A' : 'T')}
                                </span>
                );
            })}
        </>
    );
}
