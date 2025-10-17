import { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { SportsContext } from '@dxc247/shared/contexts/SportsContext';
import { AuthContext } from '@dxc247/shared/contexts/AuthContext';
import { CasinoContext } from '@dxc247/shared/contexts/CasinoContext';
import { placeCasinoBet } from '@dxc247/shared/utils/Constants';
import Notify from '@dxc247/shared/utils/Notify';

/**
 * Casino Auto Bet Hook
 * Automatically places bets on casino pages when no suspended-box is present
 * 
 * @param {Object} config - Configuration object
 * @param {Array} config.totalPlayers - Array of players/bets to monitor
 * @param {string} config.betType - Type of bet to place
 * @param {number} config.stakeAmount - Amount to stake per bet
 * @param {boolean} config.enabled - Whether auto betting is enabled
 * @param {number} config.delay - Delay between bets in milliseconds (default: 1000)
 * @param {string} config.backOrLay - 'back' or 'lay' (default: 'back')
 * @param {Function} config.onBetPlaced - Callback when bet is placed
 * @param {Function} config.onError - Callback when error occurs
 * @returns {Object} - Auto bet controls and status
 */
export const useCasinoAutoBet = (config) => {
    const {
        totalPlayers = [],
        betType = 'ODDS',
        stakeAmount = 10,
        enabled = false,
        delay = 1000,
        backOrLay = 'back',
        onBetPlaced = () => {},
        onError = () => {}
    } = config;

    const [isRunning, setIsRunning] = useState(false);
    const [betsPlaced, setBetsPlaced] = useState(0);
    const [lastError, setLastError] = useState(null);
    const intervalRef = useRef(null);
    const betHistoryRef = useRef(new Set());

    const { setBetType, setPopupDisplayForDesktop } = useContext(SportsContext);
    const { getBalance } = useContext(AuthContext);
    const { casino_socket } = useContext(CasinoContext);

    /**
     * Check if an element has suspended-box class
     */
    const hasSuspendedBox = (element) => {
        if (!element) return false;
        
        // Check the element itself
        if (element.classList && element.classList.contains('suspended-box')) {
            return true;
        }
        
        // Check child elements
        const suspendedElements = element.querySelectorAll('.suspended-box');
        return suspendedElements.length > 0;
    };

    /**
     * Find available betting elements
     */
    const findAvailableBets = () => {
        const availableBets = [];
        
        // Look for casino odds boxes that are not suspended
        const oddsBoxes = document.querySelectorAll('.casino-odds-box, .casino-odd-box-container, .card-odd-box');
        
        oddsBoxes.forEach((box, index) => {
            if (!hasSuspendedBox(box)) {
                const oddsElement = box.querySelector('.casino-odds, .odd, span');
                const oddsValue = oddsElement ? parseFloat(oddsElement.textContent) : 0;
                
                if (oddsValue > 0) {
                    // Try to extract team name from parent elements
                    let teamName = '';
                    const nameElement = box.querySelector('.casino-nation-name, .casino-odd-box-container, h5, h6');
                    if (nameElement) {
                        teamName = nameElement.textContent.trim().split(':')[0] || `Bet ${index + 1}`;
                    }
                    
                    availableBets.push({
                        element: box,
                        odds: oddsValue,
                        teamName: teamName || `Bet ${index + 1}`,
                        index: index
                    });
                }
            }
        });
        
        return availableBets;
    };

    /**
     * Place a single bet
     */
    const placeSingleBet = async (betInfo) => {
        try {
            const betKey = `${betInfo.teamName}_${betInfo.odds}_${Date.now()}`;
            
            // Avoid duplicate bets
            if (betHistoryRef.current.has(betKey)) {
                return false;
            }
            
            betHistoryRef.current.add(betKey);
            
            // Set up bet data
            const betData = {
                sportList: { id: 'casino' },
                roundId: 'auto',
                backOrLay: backOrLay,
                teamname: { current: betInfo.teamName },
                odds: betInfo.odds,
                profit: { current: (betInfo.odds - 1) * stakeAmount },
                loss: { current: stakeAmount },
                betType: betType,
                stakeValue: { current: stakeAmount },
                match_id: 'auto',
                roundIdSaved: { current: 'auto' },
                playerStatuses: {},
                setHideLoading: () => {},
                setPopupDisplayForDesktop: () => {},
                setSubmitButtonDisable: () => {},
                resetBetFields: () => {},
                profitData: { current: (betInfo.odds - 1) * stakeAmount },
                getBalance: getBalance,
                updateAmounts: () => {},
                Notify: Notify
            };

            // Place the bet
            const success = await placeCasinoBet(betData);
            
            if (success) {
                setBetsPlaced(prev => prev + 1);
                onBetPlaced(betInfo);
                console.log(`Auto bet placed: ${betInfo.teamName} @ ${betInfo.odds} for ${stakeAmount}`);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error placing auto bet:', error);
            setLastError(error.message);
            onError(error);
            return false;
        }
    };

    /**
     * Main auto betting loop
     */
    const runAutoBet = async () => {
        if (!enabled || isRunning) return;
        
        setIsRunning(true);
        setLastError(null);
        
        try {
            const availableBets = findAvailableBets();
            
            if (availableBets.length === 0) {
                console.log('No available bets found (all suspended)');
                return;
            }
            
            console.log(`Found ${availableBets.length} available bets`);
            
            // Place bets with delay between them
            for (const betInfo of availableBets) {
                if (!enabled) break; // Stop if disabled
                
                await placeSingleBet(betInfo);
                
                // Wait before next bet
                if (delay > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        } catch (error) {
            console.error('Auto bet error:', error);
            setLastError(error.message);
            onError(error);
        } finally {
            setIsRunning(false);
        }
    };

    /**
     * Start auto betting
     */
    const startAutoBet = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        // Run immediately
        runAutoBet();
        
        // Then run every 5 seconds
        intervalRef.current = setInterval(runAutoBet, 5000);
    };

    /**
     * Stop auto betting
     */
    const stopAutoBet = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsRunning(false);
    };

    /**
     * Reset bet history and counters
     */
    const resetAutoBet = () => {
        betHistoryRef.current.clear();
        setBetsPlaced(0);
        setLastError(null);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // Auto start/stop based on enabled state
    useEffect(() => {
        if (enabled) {
            startAutoBet();
        } else {
            stopAutoBet();
        }
        
        return () => stopAutoBet();
    }, [enabled]);

    return {
        isRunning,
        betsPlaced,
        lastError,
        startAutoBet,
        stopAutoBet,
        resetAutoBet,
        runAutoBet
    };
};

/**
 * Casino Auto Bet Component
 * Renders UI controls for auto betting
 */
export const CasinoAutoBetControls = ({ 
    enabled, 
    onToggle, 
    stakeAmount, 
    onStakeChange, 
    delay, 
    onDelayChange,
    betsPlaced,
    isRunning,
    lastError,
    onReset 
}) => {
    return (
        <div className="casino-auto-bet-controls" style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            zIndex: 9999,
            minWidth: '250px'
        }}>
            <h6 style={{ margin: '0 0 10px 0', color: '#28a745' }}>
                Casino Auto Bet
            </h6>
            
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => onToggle(e.target.checked)}
                        style={{ margin: 0 }}
                    />
                    Enable Auto Bet
                </label>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    Stake Amount:
                </label>
                <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => onStakeChange(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '5px', borderRadius: '4px' }}
                    disabled={isRunning}
                />
            </div>
            
            <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    Delay (ms):
                </label>
                <input
                    type="number"
                    value={delay}
                    onChange={(e) => onDelayChange(parseInt(e.target.value) || 1000)}
                    style={{ width: '100%', padding: '5px', borderRadius: '4px' }}
                    disabled={isRunning}
                />
            </div>
            
            <div style={{ marginBottom: '10px', fontSize: '12px' }}>
                <div>Bets Placed: <strong>{betsPlaced}</strong></div>
                <div>Status: <strong style={{ color: isRunning ? '#28a745' : '#dc3545' }}>
                    {isRunning ? 'Running' : 'Stopped'}
                </strong></div>
                {lastError && (
                    <div style={{ color: '#dc3545', marginTop: '5px' }}>
                        Error: {lastError}
                    </div>
                )}
            </div>
            
            <div style={{ display: 'flex', gap: '5px' }}>
                <button
                    onClick={onReset}
                    style={{
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default useCasinoAutoBet;
