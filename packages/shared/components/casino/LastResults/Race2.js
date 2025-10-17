export const Race2 = ({lastResults, openPopup}) => {
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
                                     {result.win === '1'
                                         ? 'A'
                                         : result.win === '2'
                                             ? 'B'
                                             : result.win === '3'
                                                 ? 'C'
                                                 : 'D'
                                     }
                                </span>
                );
            })}
        </>
    );
}
