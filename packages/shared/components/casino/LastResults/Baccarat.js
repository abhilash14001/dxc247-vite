export const Baccarat = ({lastResults, openPopup}) => {
    return (
        <>
            {Object.entries(lastResults).map(([key, result]) => {
                const mid = result.mid;
                const className = result.win === '1'
                    ? 'result result-a'
                    : result.win === '2'
                        ? 'result result-b'
                        : 'result';

                const backgroundColor = result.win === '1'
                    ? '#086cb8'
                    : result.win === '2'
                        ? '#ae2130'
                        : '#279532';

                return (
                    <span
                        onClick={() => openPopup(mid)}
                        key={mid}
                        className={className}
                        
                        title={`Round ID: ${mid}`}
                    >
        {result.win === '1' ? 'P' : result.win === '2' ? 'B' : 'T'}
    </span>
                );
            })}
        </>
    );
}
