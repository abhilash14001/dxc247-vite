/**
 * Enhanced Cashout Logic Implementation
 * Implements correct hedge calculations for multiple bets including both back and lay bets
 * Based on the provided formulas and examples
 * 
 * @module CashoutLogic
 */

import Notify from "../utils/Notify";



/**
 * Main cashout logic handler implementing the correct hedge calculation
 * 
 * @param {Object} params - All required parameters for cashout
 * @returns {Promise<boolean>} Success status
 */

function calculatePnLs(bets) {
    const teams = [...new Set(bets.map(b => b.team_name))];
    const pnls = {};

    for (const team of teams) {
        let pnl = 0;
        for (const b of bets) {
            const odds = Number(b.bet_odds);
            const stake = Number(b.bet_amount);

            if (b.bet_side.toLowerCase() === 'back') {
                if (b.team_name === team) {
                    // back wins
                    pnl += (odds - 1) * stake;
                } else {
                    // back loses
                    pnl -= stake;
                }
            } else if (b.bet_side.toLowerCase() === 'lay') {
                if (b.team_name === team) {
                    // lay loses when this team wins -> liability
                    pnl -= (odds - 1) * stake;
                } else {
                    // lay wins when other team wins -> you keep matched stake
                    pnl += stake;
                }
            } else {
                throw new Error("Unknown bet type: " + b.bet_side);
            }
        }
        pnls[team] = Number(pnl.toFixed(2));
    }

    // find best and worst
    let bestTeam = null, worstTeam = null;
    for (const t of Object.keys(pnls)) {
        if (bestTeam === null || pnls[t] > pnls[bestTeam]) bestTeam = t;
        if (worstTeam === null || pnls[t] < pnls[worstTeam]) worstTeam = t;
    }
    const totalBetAmount = Number((pnls[bestTeam] - pnls[worstTeam]).toFixed(2));
    return {
        pnls,
        best: { team: bestTeam, pnl: pnls[bestTeam] },
        worst: { team: worstTeam, pnl: pnls[worstTeam] },
        totalBetAmount
    };
}

export const handleCashoutLogic = async (params) => {
    try {
        const {
            currentMarketData,
            matchId,
            betType,
            getActiveBets,
            setBetType,
            setBetTypeFromArray,
            setBetOddValue,
            setbackOrLay,
            setCashoutTeam,
            setDefaultTeamName,
            stakeValue,
            setPopupDisplay,
            teamNames,
            teamNameCurrentBets,
            defaultBetType = 'ODDS'
        } = params;
        

        // Validation checks
        if (!currentMarketData?.length) {
            Notify('No market data available for cashout', null, null, 'danger');
            return false;
        }

        // Check for suspended markets
        const isSuspended = currentMarketData.some(item =>
            item.gstatus === 'SUSPENDED' || item.status === 'SUSPENDED'
        );

        if (isSuspended) {
            Notify('You are not eligible for cashout - Market suspended', null, null, 'danger');
            return false;
        }

        if (!matchId) {
            console.error('No match ID available');
            return false;
        }

        // Get active bets for the match
        const activeBets = await getActiveBets(matchId, betType);

        const { totalBetAmount } = calculatePnLs(activeBets)

        const { allLayOdds, allBackOdds } = calculateAdjustedOdds(currentMarketData, totalBetAmount);

        
        const bestHedge = layAndBackBetCalculation(allLayOdds, allBackOdds, teamNames.current[betType], teamNameCurrentBets.current[betType], activeBets, currentMarketData);

        
        
        if (bestHedge) {

            // Set up the hedge bet pa
            // rameters
            setBetType(betType);
            setBetTypeFromArray(defaultBetType);
            setBetOddValue(parseFloat(bestHedge.odds).toFixed(2));
            setbackOrLay(bestHedge.type);
            setCashoutTeam(defaultBetType.toUpperCase());
                setDefaultTeamName.current = bestHedge.team;
            stakeValue.current.value = parseFloat(bestHedge.stake);

            // Open the bet popup
            setPopupDisplay(true);
            return true;
        } else {
            Notify('No suitable hedge option available for cashout', null, null, 'warning');
            return false;
        }

        if (!activeBets?.length) {
            Notify('No active bets found for cashout', null, null, 'danger');
            return false;
        }

    } catch (error) {
        console.error('Cashout error:', error);
        Notify('An error occurred while calculating cashout', null, null, 'danger');
        return false;
    }
};


function calculateAdjustedOdds(currentMarketData, totalBetAmount) {
    let allLayOdds = [];
    let allBackOdds = [];

    currentMarketData.forEach(item => {
        if (item.lay && item.lay.length > 0) {
            const layBet = item.lay.find(x => x.oname === 'lay1');
            if (layBet) {
                allLayOdds.push({
                    stake: parseFloat((totalBetAmount / layBet.odds).toFixed(2)),
                    odds: layBet.odds,
                    team: item.nat?.trim(),
                    side: 'lay'
                });
            }
        }

        if (item.back && item.back.length > 0) {
            const backBet = item.back.find(x => x.oname === 'back1');
            if (backBet) {
                allBackOdds.push({
                    stake: parseFloat((totalBetAmount / backBet.odds).toFixed(2)),
                    odds: backBet.odds,
                    team: item.nat?.trim(),
                    side: 'back'
                });
            }
        }
    });

    return { allLayOdds, allBackOdds };
}
function hedgeMultipleBets(bets, hedgeSelection, hedgeLayOdds, teamNames, basePnL) {
    // Step 1: Identify unique selections
    const selections = [...new Set(teamNames)];
  
    // Step 2: Compute current exposures per selection
    let exposure = {};
    selections.forEach(sel => { 
        // Initialize with basePnL for each selection
        exposure[sel] = basePnL || 0; 
    });
  

    
    bets.forEach(bet => {
        selections.forEach(sel => {
            if (bet.bet_side.toLowerCase() === "back") {
                if (sel === bet.team_name) {
                    exposure[sel] += (bet.bet_odds - 1) * bet.bet_amount; // win side
                    
                } else {
                    exposure[sel] -= bet.bet_amount; // lose side
                }
            } else if (bet.bet_side.toLowerCase() === "lay") {
                if (sel === bet.team_name) {
                    exposure[sel] -= (bet.bet_odds - 1) * bet.bet_amount; // liability if wins

                } else {
                    exposure[sel] += bet.bet_amount; // profit if loses
                }
            }
        });
    });
  
    // Step 3: Compute hedge lay stake for chosen selection
    // Formula: LayStake = (MaxWin - MinWin) / (hedgeLayOdds - 1)
    const worstCase = Math.min(...Object.values(exposure));
    const bestCase = Math.max(...Object.values(exposure));
  
    const layStake = (bestCase - worstCase) / hedgeLayOdds;
  
    // Step 4: Apply hedge lay bet virtually to recompute exposures
    selections.forEach(sel => {
      if (sel === hedgeSelection.team_name) {
        exposure[sel] -= (hedgeLayOdds - 1) * layStake;
      } else {
        exposure[sel] += layStake;
      }
    });
  
    return {
      hedgeStake: parseFloat(layStake.toFixed(2)),
      odds: hedgeLayOdds,
      pnl: exposure
    };
  }
  

  function hedgeMultipleBetss11(bets, hedgeSelection, hedgeOdds, hedgeType, teamNames, basePnL) {
    // Step 1: Identify unique selections
    const selections = [...new Set(teamNames)];
  
    // Step 2: Compute current exposures including basePnL
    let exposure = {};
    selections.forEach(sel => {
      // Initialize with basePnL for each selection
      exposure[sel] = basePnL[sel] || 0; 
    });
  
    // Step 3: Apply all active bets to exposures
    bets.forEach(bet => {
      selections.forEach(sel => {
        if (bet.bet_side.toLowerCase() === "back") {
          if (sel === bet.team_name) {
            exposure[sel] += (bet.bet_odds - 1) * bet.bet_amount; // win side
          } else {
            exposure[sel] -= bet.bet_amount; // lose side
          }
        } else if (bet.bet_side.toLowerCase() === "lay") {
          if (sel === bet.team_name) {
            exposure[sel] -= (bet.bet_odds - 1) * bet.bet_amount; // liability if wins
          } else {
            exposure[sel] += bet.bet_amount; // profit if loses
          }
        }
      });
    });
  
    // Step 4: Calculate hedge stake depending on hedge type
    const worstCase = Math.min(...Object.values(exposure));
    const bestCase = Math.max(...Object.values(exposure));
  
    let hedgeStake = 0;
  
    if (hedgeType === "lay") {
      // Lay hedge formula
      hedgeStake = (bestCase - worstCase) / (hedgeOdds - 1);
    } else if (hedgeType === "back") {
      // Back hedge formula
      hedgeStake = (bestCase - worstCase) / hedgeOdds;
    }
  
    // Step 5: Virtually apply hedge to exposures
    selections.forEach(sel => {
      if (hedgeType === "lay") {
        if (sel === hedgeSelection) {
          exposure[sel] -= (hedgeOdds - 1) * hedgeStake;
        } else {
          exposure[sel] += hedgeStake;
        }
      } else if (hedgeType === "back") {
        if (sel === hedgeSelection) {
          exposure[sel] += (hedgeOdds - 1) * hedgeStake;
        } else {
          exposure[sel] -= hedgeStake;
        }
      }
    });
  
    return {
      hedgeStake: parseFloat(hedgeStake.toFixed(2)),
      odds: hedgeOdds,
      pnl: exposure
    };
  }
  

function layAndBackBetCalculation(layBet, backBet, teamNames, teamNameCurrentBets, activeBets, currentMarketData) {
    const teamResults = {}; // store multiple results for each team

    
    for (const teamName of teamNames) {
        let basePnL = teamNameCurrentBets[teamName] || 0;
        teamResults[teamName] = [];


        teamResults[teamName].lay = hedgeMultipleBets(activeBets, teamName,  currentMarketData.find(item => item.nat?.trim() === teamName)?.lay?.[0].odds,   teamNames, basePnL);
        teamResults[teamName].back = hedgeMultipleBets(activeBets, teamName,   currentMarketData.find(item => item.nat?.trim() === teamName)?.back?.[0].odds,  teamNames, basePnL);
        
       
    }
    debugger    

   
    return pickEqualBet(teamResults);

}

function calculateHedgeFromActiveBets(activeBets, teamNames, teamNameCurrentBets) {
    const teamResults = {}; // store multiple results for each team

    for (const teamName of teamNames) {
        let basePnL = teamNameCurrentBets[teamName] || 0;
        teamResults[teamName] = [];

        // Loop through active bets to calculate potential hedge scenarios
        for (const activeBet of activeBets) {
            const { bet_side, bet_odds, bet_amount, team_name } = activeBet;
            
           
        }
    }

    return pickEqualBet(teamResults);
}

function calculateHedgeFromActiveBetsNew(activeBets, teamNameCurrentBets, currentMarketData) {
    // Step 1: Identify unique selections/teams from active bets
    const selections = [...new Set(activeBets.map(b => b.team_name))];
    
    // Step 2: Compute current exposures per selection for each possible outcome
    let exposure = {};
    selections.forEach(sel => { 
        exposure[sel] = 0; 
    });
    debugger
    
    // Calculate exposure for each selection based on active bets
    activeBets.forEach(bet => {
        const { bet_side, bet_odds, bet_amount, team_name } = bet;
        const odds = Number(bet_odds);
        const stake = Number(bet_amount);
        
        selections.forEach(sel => {
            if (bet_side.toLowerCase() === "back") {
                if (sel === team_name) {
                    // If this selection wins, back bet wins
                    exposure[sel] += (odds - 1) * stake;
                } else {
                    // If other selection wins, back bet loses
                    exposure[sel] -= stake;
                }
            } else if (bet_side.toLowerCase() === "lay") {
                if (sel === team_name) {
                    // If this selection wins, lay bet loses (liability)
                    exposure[sel] -= (odds - 1) * stake;
                } else {
                    // If other selection wins, lay bet wins (keep matched stake)
                    exposure[sel] += stake;
                }
            }
        });
    });
    
    // Add existing team bet positions if available
    if (teamNameCurrentBets) {
        Object.keys(teamNameCurrentBets).forEach(team => {
            if (exposure[team] !== undefined) {
                exposure[team] += Number(teamNameCurrentBets[team] || 0);
            }
        });
    }
    
    
    // Step 3: Find the best hedge option
    // We need to find which selection to hedge and what odds to use
    let bestHedge = null;
    let minImbalance = Infinity;

    debugger
    
    // For each selection, calculate potential hedge scenarios
    for (const hedgeSelection of selections) {
        // Find available market odds for this selection
        // For now, we'll use a default approach - you can modify this based on your market data
        
        // Calculate current imbalance
        const worstCase = Math.min(...Object.values(exposure));
        const bestCase = Math.max(...Object.values(exposure));
        const currentImbalance = bestCase - worstCase;
        
        // Find available market odds for this selection from currentMarketData
        const marketItem = currentMarketData?.find(item => 
            item.nat?.trim() === hedgeSelection?.trim()
        );
        
        if (marketItem) {
            // Get available lay odds for hedging
            if (marketItem.lay && marketItem.lay.length > 0) {
                const layBet = marketItem.lay.find(x => x.oname === 'lay1');
                if (layBet && layBet.odds > 1) {
                    const hedgeOdds = Number(layBet.odds);
                    
                    // Calculate hedge stake using the formula: (MaxWin - MinWin) / (hedgeOdds - 1)
                    const hedgeStake = (bestCase - worstCase) / (hedgeOdds - 1);
                    
                    if (hedgeStake > 0) {
                        // Apply hedge bet virtually to recompute exposures
                        const newExposure = { ...exposure };
                        selections.forEach(sel => {
                            if (sel === hedgeSelection) {
                                // Lay bet on this selection
                                newExposure[sel] -= (hedgeOdds - 1) * hedgeStake;
                            } else {
                                // Back bet on other selections
                                newExposure[sel] += hedgeStake;
                            }
                        });
                        
                        // Calculate new imbalance
                        const newWorstCase = Math.min(...Object.values(newExposure));
                        const newBestCase = Math.max(...Object.values(newExposure));
                        const newImbalance = newBestCase - newWorstCase;
                        
                        // Check if this hedge reduces imbalance
                        if (newImbalance < minImbalance) {
                            minImbalance = newImbalance;
                            bestHedge = {
                                selection: hedgeSelection,
                                odds: hedgeOdds,
                                stake: parseFloat(hedgeStake.toFixed(2)),
                                type: 'lay', // We're laying the selected team
                                originalImbalance: currentImbalance,
                                newImbalance: newImbalance,
                                improvement: currentImbalance - newImbalance
                            };
                        }
                    }
                }
            }
        }
    }
    
    
    if (bestHedge) {
        return {
            type: bestHedge.type,
            odds: bestHedge.odds,
            stake: bestHedge.stake,
            team: bestHedge.selection,
            improvement: bestHedge.improvement
        };
    }
    
    return null;
}

/**
 * Choose the best bet option from PnL results
 * Returns the option with highest PnL
 */
function pickEqualBet(book) {
    const [A, B] = Object.keys(book);
    const betsA = book[A], betsB = book[B];
  
    let best = null, minDiff = Infinity;
  
    for (const a of betsA) {
      for (const b of betsB) {
        // match same type & odds (with float tolerance)
        if (a.type === b.type && Math.abs(a.odds - b.odds) < 1e-9) {
          const diff = Math.abs(a.pnl - b.pnl);
          if (diff < minDiff) {
            minDiff = diff;
            best = { odds: a.odds, stake: a.stake, type: a.type, team: a.team };
          }
        }
      }
    }
  
    return best; // { odds, stake, type } — e.g. {1.24, 346.77, 'lay'}
  }

// Function to reset stake value and default cashout team
export const resetCashoutState = (stakeValue, cashoutTeam) => {
    if (stakeValue && stakeValue.current.value !== undefined) {
        stakeValue.current.value = '';
    }
    
    if (cashoutTeam && cashoutTeam !== undefined) {
        cashoutTeam(null);
    }
    
    
};

// Function to automatically calculate optimal hedge based on current positions
function calculateOptimalHedgeAutomatically(bets, teamNames, basePnL, hedgeOdds, hedgeType, hedgeTeam) {
    
    // Step 1: Calculate current exposure after applying all bets
    let currentExposure = { ...basePnL };
    
    bets.forEach(bet => {
        teamNames.forEach(team => {
            if (bet.bet_side.toLowerCase() === "back") {
                if (team === bet.team_name) {
                    // If this team wins, back bet wins
                    currentExposure[team] += (bet.bet_odds - 1) * bet.bet_amount;
                } else {
                    // If other team wins, back bet loses
                    currentExposure[team] -= bet.bet_amount;
                }
            } else if (bet.bet_side.toLowerCase() === "lay") {
                if (team === bet.team_name) {
                    // If this team wins, lay bet loses (liability)
                    currentExposure[team] -= (bet.bet_odds - 1) * bet.bet_amount;
                } else {
                    // If other team wins, lay bet wins
                    currentExposure[team] += bet.bet_amount;
                }
            }
        });
    });
    
    
    // Step 2: Automatically determine optimal target PnL
    const currentValues = Object.values(currentExposure);
    const worstCase = Math.min(...currentValues);
    const bestCase = Math.max(...currentValues);
    const currentImbalance = bestCase - worstCase;
    
    // Target PnL should be the average of current best and worst cases
    // This will minimize the difference between outcomes
    const optimalTargetPnL = (bestCase + worstCase) / 2;
    
    
    // Step 3: Calculate required hedge stake to achieve optimal balance
    let hedgeStake = 0;
    const otherTeam = teamNames.find(team => team !== hedgeTeam);
    
    if (hedgeType === 'lay') {
        // For lay hedge on hedgeTeam:
        // hedgeTeam: currentExposure[hedgeTeam] - (hedgeOdds-1) * stake = optimalTargetPnL
        // otherTeam: currentExposure[otherTeam] + stake = optimalTargetPnL
        
        const hedgeTeamCurrent = currentExposure[hedgeTeam];
        const otherTeamCurrent = currentExposure[otherTeam];
        
        // Calculate stake from both equations to verify consistency
        const stakeFromHedgeTeam = (hedgeTeamCurrent - optimalTargetPnL) / (hedgeOdds - 1);
        const stakeFromOtherTeam = optimalTargetPnL - otherTeamCurrent;
        
        
        // Both should be equal for consistency
        if (Math.abs(stakeFromHedgeTeam - stakeFromOtherTeam) < 0.01) {
            hedgeStake = stakeFromHedgeTeam;
        } else {
            hedgeStake = stakeFromHedgeTeam; // Use hedge team equation as primary
        }
        
    } else if (hedgeType === 'back') {
        // For back hedge on hedgeTeam:
        // hedgeTeam: currentExposure[hedgeTeam] + (hedgeOdds-1) * stake = optimalTargetPnL
        // otherTeam: currentExposure[otherTeam] - stake = optimalTargetPnL
        
        const hedgeTeamCurrent = currentExposure[hedgeTeam];
        const otherTeamCurrent = currentExposure[otherTeam];
        
        const stakeFromHedgeTeam = (optimalTargetPnL - hedgeTeamCurrent) / (hedgeOdds - 1);
        const stakeFromOtherTeam = otherTeamCurrent - optimalTargetPnL;
        
        
        if (Math.abs(stakeFromHedgeTeam - stakeFromOtherTeam) < 0.01) {
            hedgeStake = stakeFromHedgeTeam;
        } else {
            hedgeStake = stakeFromHedgeTeam;
        }
    }
    
    // Step 4: Apply hedge and verify final PnL
    const finalExposure = { ...currentExposure };
    
    if (hedgeType === 'lay') {
        finalExposure[hedgeTeam] -= (hedgeOdds - 1) * hedgeStake;
        finalExposure[otherTeam] += hedgeStake;
    } else if (hedgeType === 'back') {
        finalExposure[hedgeTeam] += (hedgeOdds - 1) * hedgeStake;
        finalExposure[otherTeam] -= hedgeStake;
    }
    
    
    // Check final balance
    const finalValues = Object.values(finalExposure);
    const finalWorstCase = Math.min(...finalValues);
    const finalBestCase = Math.max(...finalValues);
    const finalImbalance = finalBestCase - finalWorstCase;
    
    
    return {
        hedgeStake: parseFloat(hedgeStake.toFixed(2)),
        hedgeType: hedgeType,
        hedgeOdds: hedgeOdds,
        hedgeTeam: hedgeTeam,
        otherTeam: otherTeam,
        optimalTargetPnL: parseFloat(optimalTargetPnL.toFixed(2)),
        currentImbalance: parseFloat(currentImbalance.toFixed(2)),
        finalImbalance: parseFloat(finalImbalance.toFixed(2)),
        balanceImprovement: parseFloat((currentImbalance - finalImbalance).toFixed(2)),
        currentExposure: currentExposure,
        finalExposure: finalExposure,
        success: finalImbalance < 0.01 // Success if final imbalance is very small
    };
}

// Export default
export default handleCashoutLogic;
