export const Btable = ({lastResults, openPopup}) => {
    const win_object = {'1': 'A', '2' : 'B', '3' : 'C', '4' : 'D', '5' : 'E', '6' : 'F'}

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
                                    {win_object[result.win]}
                                </span>
                );
            })}
        </>
    );
}
