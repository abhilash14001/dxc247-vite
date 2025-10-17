export const Lucky15 = ({lastResults, openPopup}) => {
    const win_object = {'1' : '0', '2' : '1', '3'  :"2", "4" : "4", "5": "6", "6": "W"}

    return (
        <>
            {Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;
                const className = 'result';

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
