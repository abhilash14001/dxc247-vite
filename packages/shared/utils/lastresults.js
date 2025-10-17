/**
 * Converts PHP getWinnerSectionResult function to JavaScript
 * Processes match data and extracts winner section information
 * @param {Object} dData - The input data object
 * @returns {Object} - Processed data with match time and winner information
 */
export function getWinnerSectionResult(dData) {
    const data = {};

    if (dData && Object.keys(dData).length > 0) {
        const t1 = dData.t1;
        
        if (t1 && t1.mtime) {
            try {
                // Parse the date string in format "n/j/Y g:i:s A" (e.g., "12/25/2023 2:30:45 PM")
                const dateTime = new Date(t1.mtime);
                
                // Check if date is valid
                if (!isNaN(dateTime.getTime())) {
                    // Format the date into "dd/mm/yyyy HH:mm:ss" format
                    const day = String(dateTime.getDate()).padStart(2, '0');
                    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
                    const year = dateTime.getFullYear();
                    const hours = String(dateTime.getHours()).padStart(2, '0');
                    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
                    const seconds = String(dateTime.getSeconds()).padStart(2, '0');
                    
                    const outputDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
                    data.match_time = outputDate;
                }
            } catch (error) {
                console.warn('Error parsing date:', error);
            }
        }
        
        if (t1 && t1.rdesc) {
            const explode = t1.rdesc.split("#");
            
            // Ensure we have at least 4 elements, fill with null if missing
            if (explode.length < 4) {
                for (let i = 0; i < 4; i++) {
                    if (!explode[i]) {
                        explode[i] = null;
                    }
                }
            }
            
            // Extract the first 4 elements
            [data.winner, data.extra_data, data.odd_even, data.consecutive] = explode;
            
            // If there are more than 4 elements, add them as additional data
            if (explode.length > 4) {
                data.additional_data = explode.slice(4);
            }
        }
    }

    return data;
}

/**
 * Alternative version using modern JavaScript features
 * @param {Object} dData - The input data object
 * @returns {Object} - Processed data with match time and winner information
 */
export function getWinnerSectionResultModern(dData) {
    if (!dData || Object.keys(dData).length === 0) {
        return {};
    }

    const { t1 } = dData;
    if (!t1) {
        return {};
    }

    const data = {};

    // Handle match time
    if (t1.mtime) {
        try {
            const dateTime = new Date(t1.mtime);
            if (!isNaN(dateTime.getTime())) {
                data.match_time = dateTime.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }) + ' ' + dateTime.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
            }
        } catch (error) {
            console.warn('Error parsing date:', error);
        }
    }

    // Handle rdesc parsing
    if (t1.rdesc) {
        const explode = t1.rdesc.split("#");
        
        // Ensure minimum 4 elements with null padding
        const paddedExplode = [...explode, ...Array(Math.max(0, 4 - explode.length)).fill(null)].slice(0, 4);
        
        [data.winner, data.extra_data, data.odd_even, data.consecutive] = paddedExplode;
        
        // Add additional data if exists
        if (explode.length > 4) {
            data.additional_data = explode.slice(4);
        }
    }

    return data;
}

/**
 * React component for displaying last results based on match_id
 * Converts the PHP/Blade template logic into ReactJS
 * @param {Object} props - Component props
 * @param {Object} props.result - Result data object
 * @param {Object} props.resultNew - New result data object
 * @param {Object} props.requestData - Request data containing match_id and other parameters
 * @param {Object} props.winner_data - Winner data object
 * @returns {JSX.Element} - Rendered component
 */
export function LastResultsDisplay({ result, resultNew, requestData, winner_data }) {
    // Helper function to get asset path (equivalent to PHP asset() function)
    const getAssetPath = (path) => {
        // In React, you might want to import images or use public folder
        // This is a placeholder - adjust based on your asset management
        return import.meta.env.VITE_MAIN_URL + `/all/img/casino/${path}`;
    };

    // Helper function to render card images
    const renderCards = (cards, className = '') => {
        if (!cards || !Array.isArray(cards)) return null;
        
        return cards.map((card, index) => (
            <img 
                key={index}
                src={getAssetPath(`cards/${card}.png`)}
                alt={`Card ${card}`}
                className={className}
                style={{ width: '30px', height: '40px', margin: '2px' }}
            />
        ));
    };

    // Helper function to calculate score from cards
    const calculateScore = (cards) => {
        if (!cards || !Array.isArray(cards)) return 0;
        
        return cards.reduce((total, card) => {
            const cardValue = parseInt(card) || 0;
            return total + cardValue;
        }, 0);
    };

    // Helper function to get winner description
    const getWinnerDesc = (data) => {
        if (!data || !data.rdesc) return '';
        const parts = data.rdesc.split('#');
        return parts[0] || '';
    };

    // Helper function to get match time
    const getMatchTime = (data) => {
        if (!data || !data.mtime) return '';
        try {
            const date = new Date(data.mtime);
            return date.toLocaleString('en-GB');
        } catch (error) {
            return data.mtime;
        }
    };

    // Early return if no requestData or match_id
    if (!requestData || !requestData.match_id) {
        return <div>No match data available</div>;
    }

    const { match_id } = requestData;

    // Render different sections based on match_id
    if (match_id === 'superover') {
        return (
            <div className="last-results superover">
                <h3>Super Over Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {resultNew && (
                            <div>
                                <h4>New Results:</h4>
                                <p>Winner: {getWinnerDesc(resultNew)}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'race20') {
        return (
            <div className="last-results race20">
                <h3>Race 20 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'queen') {
        return (
            <div className="last-results queen">
                <h3>Queen Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Queen Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'cricketv3') {
        return (
            <div className="last-results cricketv3">
                <h3>Cricket V3 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Cricket Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'abj') {
        return (
            <div className="last-results abj">
                <h3>ABJ Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>ABJ Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'dt202' || match_id === 'dt20') {
        return (
            <div className="last-results dt20">
                <h3>DT20 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>DT20 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'baccarat2' || match_id === 'baccarat') {
        return (
            <div className="last-results baccarat">
                <h3>Baccarat Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Baccarat Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'lucky7eu' || match_id === 'lucky7' || match_id === 'vluck7') {
        return (
            <div className="last-results lucky7">
                <h3>Lucky 7 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Lucky 7 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'cmatch20') {
        return (
            <div className="last-results cmatch20">
                <h3>CMatch 20 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>CMatch 20 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'cmeter') {
        return (
            <div className="last-results cmeter">
                <h3>CMeter Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>CMeter Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'war') {
        return (
            <div className="last-results war">
                <h3>War Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>War Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'dtl20') {
        return (
            <div className="last-results dtl20">
                <h3>DTL20 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>DTL20 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen') {
        return (
            <div className="last-results teen">
                <h3>Teen Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen9') {
        return (
            <div className="last-results teen9">
                <h3>Teen 9 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen 9 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen8') {
        return (
            <div className="last-results teen8">
                <h3>Teen 8 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen 8 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen20') {
        return (
            <div className="last-results teen20">
                <h3>Teen 20 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen 20 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'poker6') {
        return (
            <div className="last-results poker6">
                <h3>Poker 6 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Poker 6 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'poker') {
        return (
            <div className="last-results poker">
                <h3>Poker Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Poker Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'poker20') {
        return (
            <div className="last-results poker20">
                <h3>Poker 20 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Poker 20 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'ab20') {
        return (
            <div className="last-results ab20">
                <h3>AB20 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>AB20 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'worli2' || match_id === 'worli') {
        return (
            <div className="last-results worli">
                <h3>Worli Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Worli Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === '3cardj') {
        return (
            <div className="last-results 3cardj">
                <h3>3 Card J Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>3 Card J Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'card32' || match_id === 'card32eu') {
        return (
            <div className="last-results card32">
                <h3>Card 32 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Card 32 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'aaa') {
        return (
            <div className="last-results aaa">
                <h3>AAA Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>AAA Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'btable') {
        return (
            <div className="last-results btable">
                <h3>BTable Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>BTable Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'dt6') {
        return (
            <div className="last-results dt6">
                <h3>DT6 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>DT6 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'cmeter1') {
        return (
            <div className="last-results cmeter1">
                <h3>CMeter1 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>CMeter1 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'dum10') {
        return (
            <div className="last-results dum10">
                <h3>Dum10 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Dum10 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen3') {
        return (
            <div className="last-results teen3">
                <h3>Teen 3 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen 3 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'race2') {
        return (
            <div className="last-results race2">
                <h3>Race 2 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Race 2 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'aaa2') {
        return (
            <div className="last-results aaa2">
                <h3>AAA2 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>AAA2 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'ab3') {
        return (
            <div className="last-results ab3">
                <h3>AB3 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>AB3 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen1') {
        return (
            <div className="last-results teen1">
                <h3>Teen 1 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen 1 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen120') {
        return (
            <div className="last-results teen120">
                <h3>Teen 120 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen 120 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'kbc') {
        return (
            <div className="last-results kbc">
                <h3>KBC Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>KBC Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen2024') {
        return (
            <div className="last-results teen2024">
                <h3>Teen 2024 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen 2024 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'notenum') {
        return (
            <div className="last-results notenum">
                <h3>Note Number Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Note Number Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'trio') {
        return (
            <div className="last-results trio">
                <h3>Trio Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Trio Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen20b') {
        return (
            <div className="last-results teen20b">
                <h3>Teen 20B Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen 20B Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teenmuf') {
        return (
            <div className="last-results teenmuf">
                <h3>Teen MUF Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen MUF Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'race17') {
        return (
            <div className="last-results race17">
                <h3>Race 17 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Race 17 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teensin') {
        return (
            <div className="last-results teensin">
                <h3>Teen Sin Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen Sin Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'patti2') {
        return (
            <div className="last-results patti2">
                <h3>Patti 2 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Patti 2 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'trap') {
        return (
            <div className="last-results trap">
                <h3>Trap Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Trap Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'teen6') {
        return (
            <div className="last-results teen6">
                <h3>Teen 6 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Teen 6 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'lucky7eu2') {
        return (
            <div className="last-results lucky7eu2">
                <h3>Lucky 7 EU2 Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Lucky 7 EU2 Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    if (match_id === 'lottcard') {
        return (
            <div className="last-results lottcard">
                <h3>Lott Card Results</h3>
                {result && (
                    <div>
                        <p>Match Time: {getMatchTime(result)}</p>
                        <p>Winner: {getWinnerDesc(result)}</p>
                        {winner_data && winner_data.cards && (
                            <div>
                                <h4>Lott Card Cards:</h4>
                                {renderCards(winner_data.cards)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // Default case for unknown match_id
    return (
        <div className="last-results default">
            <h3>Results</h3>
            {result && (
                <div>
                    <p>Match Time: {getMatchTime(result)}</p>
                    <p>Winner: {getWinnerDesc(result)}</p>
                    {winner_data && winner_data.cards && (
                        <div>
                            <h4>Cards:</h4>
                            {renderCards(winner_data.cards)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * Hook for using the last results display functionality
 * @param {Object} result - Result data object
 * @param {Object} resultNew - New result data object
 * @param {Object} requestData - Request data containing match_id and other parameters
 * @param {Object} winner_data - Winner data object
 * @returns {Object} - Object containing the LastResultsDisplay component and utility functions
 */
export function useLastResults(result, resultNew, requestData, winner_data) {
    return {
        LastResultsDisplay: () => LastResultsDisplay({ result, resultNew, requestData, winner_data }),
        getWinnerSectionResult,
        getWinnerSectionResultModern
    };
}