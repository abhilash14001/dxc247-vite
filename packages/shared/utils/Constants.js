import axios from "axios";
import { useEffect, useState } from "react";
import Notify from "./Notify";
import { setIsSubmitDisabled } from "../store/slices/casinoSlice";
import { store } from "../store";
import { toast } from "react-toastify";
import { useToastConfirm } from "../components/ui/ToastConfirm";
import { adminApi } from "./adminApi";
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';
let globalTimer = null;

axios.defaults.withCredentials = true;
export { store };
export const ADMIN_BASE_PATH = "/admin";
export const isAdminRoute = () => {
  
  return store.getState().admin?.isAdmin;
};

/**
 * Convert rupees to paisa, or return as-is if already in paisa
 * Only converts if value has decimal places (is in rupees)
 * If it's already a whole number, assumes it's already in paisa
 * @param {number} r - The value to convert (rupees if decimal, paisa if whole number)
 * @returns {number} - Value in paisa
 */
export const toPaise = (r) => {
  // Only convert if value has decimal places (is in rupees)
  // If it's already a whole number, assume it's already in paisa
  if (r % 1 !== 0) {
    return Math.round(r * 100);
  }
  return Math.round(r);
};

/**
 * Convert display odds (profit-per-100 format) to decimal odds
 * Display format: 150 means 150 profit per 100 staked (decimal: 2.50)
 * If odds are between 1-10, they are already in decimal format, return as-is
 * Otherwise, convert using formula: decimalOdds = 1 + (displayOdds / 100)
 * @param {number} d - Display odds in profit-per-100 format, or decimal odds if between 1-10
 * @returns {number} - Decimal odds
 */
export const displayToDecimal = (d) => {

  return d > 1 && d <= 5 ? d : 1 + d / 100;
};

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
      setTeam,
      setDefaultTeamName,
      stakeValue,
      setPopupDisplay,
      
      teamNameCurrentBets,
      
      runnerRowDefault,
      defaultBetType = "match_odds",
      oddsTeamData
    } = params;

     
    const isSuspended = currentMarketData.every(
      (item) => item.gstatus === "SUSPENDED"
    );
    if (isSuspended) {
      Notify("You are not eligible for cashout1", null, null, "danger");
      return false;
    }

    const activeBets = await getActiveBets(matchId, betType);
    if (!activeBets?.length) {
      alert("No active bets found for cashout");
      return false;
    }

    // Transform activeBets to format expected by calculateSmartCashout
    const recentBets = activeBets.map((bet) => ({
      team: bet.team_name,
      odds: parseFloat(bet.bet_odds),
      stake: parseFloat(bet.bet_amount),
      side: bet.bet_side.toLowerCase(), // "BACK" -> "back", "LAY" -> "lay"
    }));

    
    // Transform currentMarketData to matchData format for calculateSmartCashout
    const matchData = {
      back: [],
      lay: [],
    };

    currentMarketData.forEach((item) => {
      const team = item.nat?.trim();
      if (!team) return;

      // Extract back odds with volume (size)
      const backOdds = item.back?.find((o) => o.oname === "back1");
      if (backOdds && backOdds.odds) {
        matchData.back.push({
          team,
          odds: parseFloat(backOdds.odds),
          volume: parseFloat(backOdds.size || 0) || 10000, // Default volume if not available
        });
      }

      // Extract lay odds with volume (size)
      const layOdds = item.lay?.find((o) => o.oname === "lay1");
      if (layOdds && layOdds.odds) {
        matchData.lay.push({
          team,
          odds: parseFloat(layOdds.odds),
          volume: parseFloat(layOdds.size || 0) || 10000, // Default volume if not available
        });
      }
    });

    // Get stake values from Redux store or params if available
    const stakeValues = params.stakeValues || store.getState()?.commonData?.stake_values || {};
    
    // Use smart cashout calculation - returns best hedge option
    // Pass oddsTeamData to incorporate existing profit/loss into resultingNets
    const smartCashoutResult = calculateSmartCashout(matchData, recentBets, stakeValues, oddsTeamData);

    if (!smartCashoutResult) {
      Notify("You are not eligible for cashout2", null, null, "danger");
      return false;
    }

    // Map smart cashout result to existing flow
    // Smart cashout already calculates optimal stake based on exposure, so use it directly
    const finalStakeValue = parseFloat(smartCashoutResult.stakeRupees);
    
    // Always use original display odds (bet.odds) for bet placement, not decimal odds
    // decimalOdds is only for calculations
    let hedgeOddsDisplay = smartCashoutResult.originalOdds;
    if (!hedgeOddsDisplay) {
      // Fallback: get display odds from matchData if originalOdds not available
      const marketTeam = matchData[smartCashoutResult.side]?.find(m => m.team === smartCashoutResult.team);
      if (marketTeam) {
        hedgeOddsDisplay = marketTeam.odds;
      } else {
        Notify("You are not eligible for cashout3", null, null, "danger");
        return false;
      }
    }
    
  const bestHedge = {
    team: smartCashoutResult.team,
    hedgeSide: smartCashoutResult.side,
    hedgeOdds: hedgeOddsDisplay,
    stake: finalStakeValue,
  };


    const firstBet = bestHedge;

    // setup UI
    setBetType(betType);
    
    setBetTypeFromArray(defaultBetType);
    
    setBetOddValue(firstBet.hedgeOdds);
    setbackOrLay(firstBet.hedgeSide);
    runnerRowDefault.current = firstBet.hedgeSide.toLowerCase() === 'back' ? 2 : 0;
    
    setTeam(defaultBetType === "match_odds" ? "MATCH_ODDS" : defaultBetType.toUpperCase());
    setDefaultTeamName.current = firstBet.team;
    setPopupDisplay(true);

    const setStakeValueInput = () => {
      
      if (stakeValue?.current) {
        stakeValue.current.value = finalStakeValue;
        ["input", "change", "blur"].forEach((evt) =>
          stakeValue.current.dispatchEvent(new Event(evt, { bubbles: true }))
        );
      } else {
        setTimeout(setStakeValueInput, 100);
      }
    };
    setStakeValueInput();

    return true;
  } catch (error) {
    console.error("Cashout error:", error);
    return false;
  }
};

function findNearestStakeValue(targetValue, stakeValues = {}) {
  if (!stakeValues || Object.keys(stakeValues).length === 0) {
    return targetValue;
  }

  const availableStakes = Object.values(stakeValues)
    .map(item => parseFloat(item?.val || item || 0))
    .filter(val => val > 0)
    .sort((a, b) => a - b);

  if (availableStakes.length === 0) {
    return targetValue;
  }

  let nearest = availableStakes[0];
  let minDiff = Math.abs(targetValue - nearest);

  for (const stake of availableStakes) {
    const diff = Math.abs(targetValue - stake);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = stake;
    }
  }

  return nearest;
}

/**
 * Calculate smart cashout stakes based on match data and recent bets
 * Considers exposure, liquidity, and balanced profit/loss scenarios
 * @param {Object} matchData - Match data with back and lay markets
 * @param {Array} recentBets - Array of recent bets with team, odds, stake, side
 * @param {Object} stakeValues - Available stake values for rounding
 * @param {Object} oddsTeamData - Current exposure/profit-loss for each team
 * @returns {Object|null} Best cashout option with team, side, stake, and resulting nets
 */
export function calculateSmartCashout(matchData, recentBets, stakeValues = {}, oddsTeamData = {}) {
  if (!matchData || !Array.isArray(matchData.back)) throw new Error("matchData.back required");

  const round2 = r => Math.round(r * 100) / 100;
  const toPaise = r => Math.round(r * 100);

  // Calculate total bet amount sum from recentBets
  const totalBetAmount = recentBets.reduce((sum, bet) => sum + (parseFloat(bet.stake) || 0), 0);

  
  const teams = Array.from(new Set(
    matchData.back.map(b => b.team)
  ));

  const backMap = Object.fromEntries((matchData.back || []).map(b => [b.team, b]));
  const layMap  = Object.fromEntries((matchData.lay  || []).map(l => [l.team, l]));

  if (teams.length < 1) throw new Error("matchData must contain at least one team");


  // Initialize netIfWin with existing profit/loss from oddsTeamData
  const netIfWin = {};
  teams.forEach(t => {
    // Get existing value from oddsTeamData (existing bets exposure)
    netIfWin[t] = oddsTeamData && oddsTeamData[t] != null ? parseFloat(oddsTeamData[t]) || 0 : 0;
  });


  const candidates = [];

  const pushBack = (team) => {
    const other = teams.find(t => t !== team);
    if (!other) return;

    const market = backMap[team];
    if (!market) return;

    const dec = displayToDecimal(market.odds);
    const numerator = netIfWin[other] - netIfWin[team];
    const theo = dec > 0 ? numerator / dec : NaN;
    
    if (theo <= 0 || !isFinite(theo)) return;

    const capped = findNearestStakeValue(theo, stakeValues);
    const displayOdds = parseFloat(market.odds);
    const parsedStake = parseFloat(capped);
    const profit = parsedStake * (displayOdds - 1);
    const loss = parsedStake;
    
    const existingTeamValue = parseFloat(netIfWin[team] || 0);
    const existingOtherValue = parseFloat(netIfWin[other] || 0);
    const netTeamWin = Math.round((profit + existingTeamValue) * 100) / 100;
    const netOtherWin = Math.round((-loss + existingOtherValue) * 100) / 100;

    candidates.push({
      team, side: "back", 
      decimalOdds: dec,
      originalDisplayOdds: market.odds,
      theoreticalStake: theo, stake: capped,
      isCapped: capped < theo,
      resultingNets: { [team]: netTeamWin, [other]: netOtherWin },
      diff: Math.abs(netTeamWin - netOtherWin)
    });
  };

  const pushLay = (team) => {
    const other = teams.find(t => t !== team);
    if (!other) return;

    const market = layMap[team];
    if (!market) return;

    const dec = displayToDecimal(market.odds);
    const numerator = netIfWin[team] - netIfWin[other];
    const theo = dec > 0 ? numerator / dec : NaN;
    
    if (theo <= 0 || !isFinite(theo)) return;

    const capped = findNearestStakeValue(theo, stakeValues);
    const displayOdds = parseFloat(market.odds);
    const parsedStake = parseFloat(capped);
    const profit = parsedStake;
    const loss = (displayOdds - 1) * parsedStake;
    
    const existingTeamValue = parseFloat(netIfWin[team] || 0);
    const existingOtherValue = parseFloat(netIfWin[other] || 0);
    const netTeamWin = Math.round((-loss + existingTeamValue) * 100) / 100;
    const netOtherWin = Math.round((profit + existingOtherValue) * 100) / 100;
    
    candidates.push({
      team, side: "lay", 
      decimalOdds: dec,
      originalDisplayOdds: market.odds,
      theoreticalStake: theo, stake: capped,
      isCapped: capped < theo,
      resultingNets: { [team]: netTeamWin, [other]: netOtherWin },
      diff: Math.abs(netTeamWin - netOtherWin)
    });
  };


  teams.forEach(t => {
    pushBack(t);
    pushLay(t);
  });

  if (teams.length === 1) {
    const team = teams[0];
    const back = backMap[team];
    const lay = layMap[team];
    const decBack = back ? displayToDecimal(back.odds) : null;
    const decLay = lay ? displayToDecimal(lay.odds) : null;

    let netWin = netIfWin[team];
    let netLose = 0;
    for (const bet of recentBets || []) {
      if (bet.team !== team) continue;
      if (bet.side === "back") netLose -= bet.stake;
      else if (bet.side === "lay") netLose += bet.stake;
    }

    if (decBack) {
      const theo = (netLose - netWin) / decBack;
      if (theo > 0 && isFinite(theo)) {
        // Use the nearest stake value to the theoretical stake (rounded to available stake values)
        const capped = findNearestStakeValue(theo, stakeValues);
        const netWinBack = netWin + (decBack - 1) * capped;
        const netLoseBack = netLose - capped;

      
        candidates.push({
          team, side: "back", 
          decimalOdds: decBack,  // Used for calculations only
          originalDisplayOdds: back.odds,  // Original display odds for bet placement
          theoreticalStake: theo, stake: capped,
          isCapped: capped < theo,
          resultingNets: { win: netWinBack, lose: netLoseBack },
          diff: Math.abs(netWinBack - netLoseBack)
        });
      }
    }

    if (decLay) {
      const theo = (netWin - netLose) / decLay;
      if (theo > 0 && isFinite(theo)) {
        // Use the nearest stake value to the theoretical stake (rounded to available stake values)
        const capped = findNearestStakeValue(theo, stakeValues);
        const netWinLay = netWin - (decLay - 1) * capped;
        const netLoseLay = netLose + capped;
        candidates.push({
          team, side: "lay", 
          decimalOdds: decLay,  // Used for calculations only
          originalDisplayOdds: lay.odds,  // Original display odds for bet placement
          theoreticalStake: theo, stake: capped,
          isCapped: capped < theo,
          resultingNets: { win: netWinLay, lose: netLoseLay },
          diff: Math.abs(netWinLay - netLoseLay)
        });
      }
    }
    

    if (!candidates.length) {
      const netValue = round2(netIfWin[team]);
      return {
        team,
        side: "back",
        decimalOdds: 0,
        stakeRupees: 0,
        stakePaise: 0,
        resultingNet: netValue,
        resultingNetsIfCapped: { [team]: netValue }
      };
    }

    candidates.sort((a, b) => a.diff - b.diff);
    
    const best = candidates.reduce((min, c) => c.diff < min.diff ? c : min, candidates[0]);
    const netWin1 = round2(best.resultingNets.win);
    const netLose1 = round2(best.resultingNets.lose);
    const resultingNet1 = round2((netWin1 + netLose1) / 2);

    const finalResult = {
      team: best.team,
      side: best.side,
      decimalOdds: round2(best.decimalOdds),
      stakeRupees: round2(best.stake),
      stakePaise: toPaise(best.stake),
      resultingNet: resultingNet1,
      isCapped: best.isCapped,
      originalOdds: best.originalDisplayOdds,
      theoreticalStake: round2(best.theoreticalStake),
      resultingNetsIfCapped: {
        win: netWin,
        lose: netLose
      }
    };

    console.log('Cashout Result:', finalResult);

    return finalResult;
  }

  if (!candidates.length) return null;

  // Sort candidates: prioritize stake nearest to total bet amount, then by balance diff, then by stake size
  candidates.sort((a, b) => {
    // First priority: stake closest to total bet amount
    const diffA = Math.abs(a.stake - totalBetAmount);
    const diffB = Math.abs(b.stake - totalBetAmount);
    if (diffA !== diffB) return diffA - diffB;
    
    // Second priority: best balance (smallest diff)
    if (a.diff !== b.diff) return a.diff - b.diff;
    
    // Third priority: smaller stake
    if (a.stake !== b.stake) return a.stake - b.stake;
    
    // Fourth priority: smaller absolute average net
    const avgA = Math.abs((Object.values(a.resultingNets)[0] + Object.values(a.resultingNets)[1]) / 2);
    const avgB = Math.abs((Object.values(b.resultingNets)[0] + Object.values(b.resultingNets)[1]) / 2);
    return avgA - avgB;
  });


  const best =  candidates.reduce((min, c) => c.diff < min.diff ? c : min, candidates[0]);

  const netTeam = round2(best.resultingNets[teams[0]]);
  const netOther = round2(best.resultingNets[teams[1]]);
  const resultingNetSigned = round2((netTeam + netOther) / 2);

  const finalResult = {
    team: best.team,
    side: best.side,
    decimalOdds: round2(best.decimalOdds),
    stakeRupees: round2(best.stake),
    stakePaise: toPaise(best.stake),
    resultingNet: resultingNetSigned,
    isCapped: best.isCapped,
    originalOdds: best.originalDisplayOdds || matchData[best.side]?.find(m => m.team === best.team)?.odds,
    theoreticalStake: round2(best.theoreticalStake),
    resultingNetsIfCapped: {
      [teams[0]]: netTeam,
      [teams[1]]: netOther
    }
  };

  console.log('Cashout Result:', finalResult);

  return finalResult;
}
// Utility function to get the correct token based on current route
export function getCurrentToken() {
  
  
  if (isAdminRoute()) {
    
    // For admin routes, use admin token from Redux
    return store.getState().admin.token;
  } else {
    
    // For regular routes, use user token from Redux
    return store.getState().user.token;
  }
}


async function axiosFetch1(url, method, setList = null, data = {}, params = {}) {
  const token = getCurrentToken();
  
  return axios({
    method: method,

    url: import.meta.env.VITE_API_URL + "/" + url,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    
    params,
    data: data,
  })
    .then((response) => {
      if (setList !== null) {
        setList(response.data);
      }
      return response;
    })
    .catch((err) => {
      if (err && err.error && err.error === "Unauthenticated") {
        // Trigger logout for unauthenticated error
        handleUnauthorized();
        return null;
      } else if (err && err.response && err.response.status === 401) {
        // Trigger logout for 401 error
        handleUnauthorized();
        return null;
      } else if (err.code === "ERR_NETWORK") {
        return null;
      }
      throw err;
    });
}
export async function axiosFetch(url, method, setList = null, data = {}, params = {}) {
  const token = getCurrentToken();

  // 1️⃣ Generate AES key & IV
  const aesKey = CryptoJS.lib.WordArray.random(32);
  const aesIv = CryptoJS.lib.WordArray.random(16);

  let encryptedPayload = null;

  // 2️⃣ Encrypt payload if it's a POST/PUT/PATCH and has data
  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && Object.keys(data).length > 0) {
    const jsonData = JSON.stringify(data);
    encryptedPayload = CryptoJS.AES.encrypt(jsonData, aesKey, {
      iv: aesIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(); // Base64 string
  }

  // 3️⃣ Encrypt AES key using server's public key
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(store.getState().commonData.serverPublicKey);

  const encryptedAESKey = encryptor.encrypt(CryptoJS.enc.Base64.stringify(aesKey));

  // 4️⃣ Build request config
  const requestConfig = {
    method,
    url: import.meta.env.VITE_API_URL + "/" + url,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Encrypted-Key": encryptedAESKey,
      "X-IV": CryptoJS.enc.Base64.stringify(aesIv),
    },
    params: { ...params },
    data: {},
  };

  // For POST/PUT/PATCH, send encrypted payload in body
  if (["POST", "PUT", "PATCH"].includes(method.toUpperCase()) && encryptedPayload) {
    requestConfig.data = {
      payload: encryptedPayload,
    };
  }

  try {
    const response = await axios(requestConfig);

    // 5️⃣ Decrypt backend response if encrypted
    const encryptedResponse = response.data?.data;
    
    if (encryptedResponse && typeof encryptedResponse === 'string' && encryptedResponse !== 'undefined') {
      const decrypted = CryptoJS.AES.decrypt(encryptedResponse, aesKey, {
        iv: aesIv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      
      const decryptedJSON = JSON.parse(decryptedText);

      if (setList !== null) setList( decryptedJSON);
      return {data : decryptedJSON?.data || decryptedJSON};
    } else {
      
      if (setList !== null) setList(response.data);
      return response;
    }
  } catch (err) {
    if (err?.error === "Unauthenticated" || err?.response?.status === 401) {
      handleUnauthorized();
      return null;
    } else if (err?.code === "ERR_NETWORK") {
      return null;
    }
    
    // Try to decrypt error response if it's encrypted
    if (err?.response?.data && aesKey && aesIv) {
      try {
        const encryptedErrorData = err.response.data?.data || err.response.data?.payload || err.response.data;
        
        if (encryptedErrorData && typeof encryptedErrorData === 'string') {
          
          const decrypted = CryptoJS.AES.decrypt(encryptedErrorData, aesKey, {
            iv: aesIv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
          
          const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
          
          if (decryptedText) {
            const decryptedErrorData = JSON.parse(decryptedText);
            
            // Replace the error response data with decrypted data
            err.response.data = decryptedErrorData?.data || decryptedErrorData;
          }
        }
      } catch (decryptError) {
        
        // Keep original error if decryption fails
      }
    }
    
    throw err;
  }
}

/**
 * Fetch domain details (live mode data) - unified function for both admin and user contexts
 * @returns {Promise<Object|null>} - Domain details data or null on error
 */
export const fetchDomainDetails = async () => {
  try {
    const isAdmin = isAdminRoute();
        
    if (isAdmin) {
      // Admin context - use adminApi
      const response = await adminApi(`${ADMIN_BASE_PATH}/domain-details`, 'POST');
      // adminApi returns data directly
      return response || null;
    } else {
      // User context - use axiosFetch
      const response = await axiosFetch("admin/domain-details", "POST");
      
      if (response && response.data) {
        return response.data?.data || response.data;
      }
      
      return null;
    }
  } catch (error) {
    console.error("Error fetching domain details:", error);
    return null;
  }
};

// Function to handle unauthorized access (401 errors)
function handleUnauthorized() {
  // Check if we're in admin context
  const isAdmin = window.location.pathname.includes('/admin');
  
  if (isAdmin) {
    // For admin routes, dispatch admin logout
    import('../store/admin/adminSlice').then(({ logout }) => {
      store.dispatch(logout());
      localStorage.clear();

      window.location.href = '/admin/login';
    });
  } else {
    // For regular user routes, dispatch user logout
    import('../store/slices/userSlice').then(({ logout }) => {
      store.dispatch(logout());
      
      localStorage.clear();
      window.location.href = '/login';
    });
  }
}

export function organiseOdds(oddsArr) {
  let no = 0;
  oddsArr["back"] = [];
  oddsArr["lay"] = [];
  oddsArr.odds.forEach((a_value) => {
    if (a_value.otype && a_value.otype === "back") {
      const tno = a_value.tno;
      oddsArr["back"][tno] = a_value;
    }
    if (a_value.otype && a_value.otype === "lay") {
      oddsArr["lay"][no] = a_value;
      no++;
    }
  });
  return oddsArr;
}

export const getSize = (number = "", isConvert = false) => {
  if (number && number !== "-" && number !== "") {
    if (isConvert) {
      if (number >= 100000) {
        const res = number / 100000;
        return res % 1 !== 0 ? res.toFixed(2) + "L" : Math.floor(res) + "L";
      } else if (number >= 1000) {
        const res = number / 1000;
        return res % 1 !== 0 ? res.toFixed(2) + "K" : Math.floor(res) + "K";
      } else {
        return number;
      }
    }
  }
  return number;
};

export const getExByColor = (amount, returnZero = false) => {
  
  if (amount >= 0) {
    return (
      <b>
        <span className="teamEx" style={{ color: "green" }}>
          {amount}
        </span>
      </b>
    );
  } else if (amount < 0) {
    return (
      <b>
        {" "}
        <span className="teamEx" style={{ color: "red" }}>
          {amount}
        </span>
      </b>
    );
  } else {
    return returnZero === false ? null : (
      <b>
        {" "}
        <span className="teamEx" style={{ color: "red" }}></span>
      </b>
    );
  }
};

export const handleShowRules = (rule) => {};
export const mapSports = { 3: "soccer", 1: "cricket", 2: "tennis" };
export default axiosFetch;

function getOddValue(
  teamName,
  prices,
  sizes,
  rootClass,
  type,
  isback,
  betRowNo,
  setBetOddValue,
  setbackOrLay,
  teamNames,
  setPopupDisplay,
  defaultTeamName,
  oddsk = null,
  rootClassDefault,
  runnerRowDefault
) {
  rootClassDefault.current = betRowNo;
  runnerRowDefault.current = rootClass;

  if (prices === 0) {
    // ClearAllSelection();
    // Notify("Odds Price zero not Allow", null, null, 'danger');
    return false;
  }
  setPopupDisplay(true);

  if (oddsk !== null) {
    oddsk.current = sizes;
  }

  setBetOddValue(prices);

  defaultTeamName.current = teamName;

  setbackOrLay(isback === 1 ? "back" : "lay");
}

export function setdecimalPoint(profit) {
  if (profit === "" || isNaN(profit)) {
    return 0;
  }
  return parseFloat(profit).toFixed(2);
}

export const generateBackAndLayFunction = (
  tot,
  oddsArr,
  type,
  teamName,
  runnerRow,
  betrowno,
  bet_type = "ODDS",
  setBetOddValue,
  setbackOrLay,
  teamNames,
  setPopupDisplay,
  defaultTeamName = null,
  runnerRowDefault,
  rootClassDefault,
  setBetType,
  oddsk = null,
  ...params
) => {
  let functions = [];

  if (tot > 0 && oddsArr[type]) {
    if (
      (bet_type === "ODDS" || bet_type === "TOURNAMENT_WINNER") &&
      type === "back"
    ) {
      oddsArr[type] = Object.keys(oddsArr[type]).length > 1 ? oddsArr[type].slice().reverse() : oddsArr[type];
    }
    
    oddsArr[type].forEach((odds, index) => {
      
      
        const onClickHandler = () => {
          // Reset stakeValue if provided in params
          if (params[5] && params[5].current) {
            params[5].current.value = "";
          }

          if (params[2] !== undefined) {
            odds.odds = params[2];
          }

          if (params[3] !== undefined) {
            odds.size = params[3];
          }

          if (typeof params[0] === "function" && params[1] !== undefined) {
            params[0](params[1]);
          }

          if (typeof params[4] === "function") {
            params[4]();
          }

          const back =
            type === "back" || type === "odd" || type === "even" ? 1 : 0;

          setBetType(bet_type);

          getOddValue(
            teamName,
            odds.odds,
            odds.size,
            runnerRow,
            bet_type,
            back,
            betrowno,
            setBetOddValue,
            setbackOrLay,
            teamNames,
            setPopupDisplay,
            defaultTeamName,
            oddsk,
            runnerRowDefault,
            rootClassDefault
          );
        };

        
        functions.push(onClickHandler);
      
    });
  }

  // Only reverse for back odds to match the sorted display order
  return type === 'back' ? functions.reverse() : functions;
};

export const checkBetPlace = async (teamname, id) => {
  const datas = { teamname: teamname, id: id };
  const d =  await axiosFetch("bet_check", "post", null, datas);
  
  return d;
};

export const showCricketSessionBook = async (
  fancyName,
  sportID,
  set = null,
  betType = "FANCY_SESSION"
) => {
  try {
    const userId = isAdminRoute() ? store.getState().admin.user.id : store.getState().user.user.id;
    
    const datas =
      "fancyName=" +
      fancyName +
      "&sportID=" +
      sportID +
      "&userid=" +
      userId +
      "&type=" +
      betType;
    const response = await axiosFetch("getFancyList?" + datas, "get");

    if (response.data.status === true) {
      if (set != null) set(response.data);
    } else {
      alert("Something went wrong");
    }
  } catch (error) {
    console.error("Error fetching fancy list:", error);
    alert("Something went wrong");
  }
};

const checkFancyHide = async (id, sid) => {
  const datas = { id: id, sid: sid };
  return await axiosFetch("fancy_hide_check", "post", null, datas);
};

export function useFancyHideStatus(sportList, data) {
  const [fancyHideStatus, setFancyHideStatus] = useState({});

  useEffect(() => {
    const fetchHideStatus = async () => {
      if (data && Array.isArray(data["normal"]) && data["normal"].section) {
        const section = data["normal"].section;

        const hideStatuses = await Promise.all(
          section.map(async (oddsArr) => {
            const status = await checkFancyHide(sportList.id, oddsArr.sid);
            return { sid: oddsArr.sid, hide: status };
          })
        );

        const hideStatusMap = hideStatuses.reduce((acc, item) => {
          acc[item.sid] = item.hide;
          return acc;
        }, {});

        setFancyHideStatus(hideStatusMap);
      }
    };

    fetchHideStatus();
  }, [sportList.id, data]); // Trigger effect only when `sportList.id` or `data` changes

  return fancyHideStatus;
}

// Cache for getExByTeamName API calls
const getExByTeamNameCache = new Map();
const activeGetExRequests = new Map();

/**
 * Optimized function to get exposure by team names and bet types - makes single API call for all teams and bet types
 * @param {string} id - Sport ID
 * @param {Array} betTypes - Array of bet types (ODDS, BOOKMAKER, etc.)
 * @param {Array} teamNames - Array of team names
 * @returns {Promise<Object>} - Object with bet types as keys, containing team names and exposure values
 */
export async function getExByTeamNamesAndBetTypesBulk(id, betTypes, teamNames) {
  
  
  const request = (async () => {
    try {
      
      
      const response = await axiosFetch(
        'getExByTeamNameBulk',
        'POST',
        null,
        { 
          id: id, 
          bet_types: betTypes,  // Array of bet types
          
        }
      );
      
      const result = response.data || response;
      
      
      return result;
      
    } catch (error) {
      console.error('Error in bulk getExByTeamName:', error);
      throw error;
    } finally {
      
    }
  })();
  
  
  return request;
}

/**
 * Optimized function to get exposure by team names - makes single API call for all teams
 * @param {string} id - Sport ID
 * @param {string} betType - Bet type (ODDS, BOOKMAKER, etc.)
 * @param {Array} teamNames - Array of team names
 * @returns {Promise<Object>} - Object with team names as keys and exposure values as values
 */
export async function getExByTeamNamesBulk(id, betType, teamNames) {
  const cacheKey = `getExByTeamName_${id}_${betType}_${teamNames.sort().join(',')}`;
  
  // Check cache first
  const cached = getExByTeamNameCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < 5000) {
    
    return cached.data;
  }
  
  // Check if request is already in progress
  if (activeGetExRequests.has(cacheKey)) {
    
    return activeGetExRequests.get(cacheKey);
  }
  
  const request = (async () => {
    try {
      
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/getExByTeamNameBulk`,
        { 
          id: id, 
          bet_types: [betType], 
          teamnames: teamNames 
        },
        { headers: { Authorization: `Bearer ${getCurrentToken()}` } }
      );
      
      const result = response.data;
      
      // Cache the result
      getExByTeamNameCache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
      
      
      return result;
      
    } catch (error) {
      console.error('Error in bulk getExByTeamName:', error);
      throw error;
    } finally {
      activeGetExRequests.delete(cacheKey);
    }
  })();
  
  activeGetExRequests.set(cacheKey, request);
  return request;
}

/**
 * Optimized function to get exposure for all bet types and teams in one call
 * @param {Object} data - Section data containing all bet types
 * @param {string} id - Sport ID
 * @param {Object} prevdata - Previous data object
 * @param {Object} setFunctions - Object with bet types as keys and setter functions as values
 * @returns {Promise<Object>} - Object with all bet types and their exposure data
 */
export async function getExByTeamNameForAllBetTypes(
  data,
  id,
  prevdata = {},
  setFunctions = {}
) {
  let arr = {};
  
  // Get bet types from setFunctions keys (these are the actual bet types we want to fetch)
  const betTypes = Object.keys(setFunctions);
  const groupedTeams = {}; // <-- instead of allTeamNames
  
  // --- FIX "bookmaker 2" → "bookmaker2" safely ---
  if (data && data['bookmaker 2']) {
    data.bookmaker2 = data['bookmaker 2'];
    delete data['bookmaker 2'];
  
    // Also fix betTypes array (because Object.keys(setFunctions) may still contain "bookmaker 2")
    const index = betTypes.indexOf('bookmaker 2');
    if (index !== -1) {
      betTypes[index] = 'bookmaker2';
    }
  }
  
  // --- Collect team names for each betType ---
  betTypes.forEach(betType => {
    groupedTeams[betType] = new Set(); // ← create set for each bet type
  
    const section = data?.[betType]?.section;
    if (!Array.isArray(section)) return;
  
    section.forEach(oddsObj => {
      if (oddsObj?.nat) {
        groupedTeams[betType].add(String(oddsObj.nat).trim());
      }
    });
  });
  
  // Convert Sets → Arrays
  Object.keys(groupedTeams).forEach(bt => {
    groupedTeams[bt] = Array.from(groupedTeams[bt]);
  });
  
  
  
  
  const teamNamesArray = Array.from(groupedTeams);
  
  // Initialize data structure for each bet type
  betTypes.forEach(betType => {
    const storageKey = `exByTeamName_${betType}_${id}`;
    
    try {
      const existingData = localStorage.getItem(storageKey);
      if (existingData) {
        const parsedData = JSON.parse(existingData);
        arr[betType] = { ...parsedData };
      } else {
        arr[betType] = Object.keys(prevdata).length > 0 ? { ...prevdata } : {};
      }
    } catch (error) {
      console.error(`Error loading from localStorage for ${betType}:`, error);
      arr[betType] = Object.keys(prevdata).length > 0 ? { ...prevdata } : {};
    }
    
    // Initialize team names in arr
    teamNamesArray.forEach(teamName => {
      if (!arr[betType][teamName]) {
        arr[betType][teamName] = prevdata?.[teamName] ?? 0;
      }
    });
  });

  try {
    // Make single bulk API call for all .then and bet types
    const response = await getExByTeamNamesAndBetTypesBulk(id, groupedTeams);
    
    
    // Process the response
    if (response && response.data) {
      betTypes.forEach(betType => {
        const betTypeData = response.data[betType];
        if (betTypeData) {
          betTypeData.forEach(item => {
            const teamName = item.nat?.trim();
            const result = item.result;
            
            if (teamName) {
              // Only update if we have a valid result, otherwise preserve existing data
              if (result !== null && result !== undefined && result !== "") {
                arr[betType][teamName] = result;
              }
              // If result is 0 or negative, still update (as these are valid exposure values)
              else if (result === 0 || result < 0) {
                arr[betType][teamName] = result;
              }
            }
          });
        }
      });
    }
    else if(response){
      betTypes.forEach(betType => {
        const betTypeData = response[betType];
        
        if (betTypeData) {
          betTypeData.forEach(item => {
            const teamName = item.nat?.trim();
            const result = item.result;
            
            if (teamName) {
              // Only update if we have a valid result, otherwise preserve existing data
              if (result !== null && result !== undefined && result !== "") {
                arr[betType][teamName] = result;
              }
              // If result is 0 or negative, still update (as these are valid exposure values)
              else if (result === 0 || result < 0) {
                arr[betType][teamName] = result;
              }
            }
          });
        }
      });
    }

    // Save updated data in local storage for each bet type
    betTypes.forEach(betType => {
      const storageKey = `exByTeamName_${betType}_${id}`;
      if (Object.keys(arr[betType]).length > 0) {
        const existingData = localStorage.getItem(storageKey);
        if (existingData) {
          const parsedExistingData = JSON.parse(existingData);
          const mergedData = { ...parsedExistingData, ...arr[betType] };
          localStorage.setItem(storageKey, JSON.stringify(mergedData));
        } else {
          localStorage.setItem(storageKey, JSON.stringify(arr[betType]));
        }
      }
      
      // Call setter function if provided - each bet type gets its own data
      if (setFunctions[betType] && typeof setFunctions[betType] === 'function') {
        setFunctions[betType](arr[betType]);
      }
    });

    
    return arr;
  } catch (error) {
    console.error('Error in getExByTeamNameForAllBetTypes:', error);
    return arr;
  }
}

export async function getExByTeamNameForCricket(
  data,
  betType,
  bet_type,
  id,
  prevdata = {},
  setFunction = null
) {
  let arr = [];

  // Use the actual data key (bet_type) that matches the .mname from the API response
  let actualDataKey = bet_type;
  const storageKey = `exByTeamName_${actualDataKey}_${id}`;

  // First, try to load existing data from localStorage
  try {
    const existingData = localStorage.getItem(storageKey);
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      arr[actualDataKey] = { ...parsedData };
    } else {
      arr[actualDataKey] =
        Object.keys(prevdata).length > 0 ? { ...prevdata } : {};
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    arr[actualDataKey] =
      Object.keys(prevdata).length > 0 ? { ...prevdata } : {};
  }

  // Check if we have data to work with
  if (!data?.[actualDataKey]?.section) {
    if (setFunction !== null) {
      setFunction(arr[actualDataKey]);
    }
    return arr[actualDataKey];
  }

  // Extract all team names from the data
  const teamNames = data[actualDataKey].section.map(oddsArr => oddsArr.nat.trim());
  
  // Initialize team names in arr
  teamNames.forEach(teamName => {
    if (!arr[actualDataKey][teamName]) {
      arr[actualDataKey][teamName] = prevdata?.[teamName] ?? 0;
    }
  });

  try {
    // Make single bulk API call for all teams
    const response = await getExByTeamNamesBulk(id, betType, teamNames);
    
    // Process the response
    if (response && response.data) {
      response.data.forEach(item => {
        const teamName = item.nat?.trim();
        const result = item.result;
        
        if (teamName) {
          // Only update if we have a valid result, otherwise preserve existing data
          if (result !== null && result !== undefined && result !== "") {
            arr[actualDataKey][teamName] = result;
          }
          // If result is 0 or negative, still update (as these are valid exposure values)
          else if (result === 0 || result < 0) {
            arr[actualDataKey][teamName] = result;
          }
        }
      });
    }

    // Save updated data in local storage if arr has entries
    if (Object.keys(arr[actualDataKey]).length > 0) {
      const existingData = localStorage.getItem(storageKey);
      if (existingData) {
        const parsedExistingData = JSON.parse(existingData);
        const mergedData = { ...parsedExistingData, ...arr[actualDataKey] };
        localStorage.setItem(storageKey, JSON.stringify(mergedData));
      } else {
        localStorage.setItem(storageKey, JSON.stringify(arr[actualDataKey]));
      }
    }

    if (setFunction !== null) {
      const result = arr[actualDataKey];
      setFunction(result);
      return result;
    }
  } catch (error) {
    console.error('Error in getExByTeamNameForCricket:', error);
    return arr[actualDataKey];
  }
}

export function getExByTeamNameForCasino(
  model_id,
  roundId,
  player,
  match_id,
  betType = "BOOKMAKER",
  batch = false
) {
  // Convert betType if needed (e.g., cup -> cup)
  const convertedBetType = betType;

  const data = {
    id: model_id,
    round_id: roundId,
    player: player,
    match_id: match_id,
    betType: convertedBetType,
    batch: batch,
  };
  return axiosFetch("getExByTeamNameForCasino", "post", null, data);
}

export function getExBySingleTeamNameCasino(
  model_id,
  roundId,
  player,
  match_id,
  betType = "BOOKMAKER"
) {
  // Convert betType if needed (e.g., cup -> cup)
  const convertedBetType = betType;

  const data = {
    id: model_id,
    round_id: roundId,
    player: player,
    match_id: match_id,
    betType: convertedBetType,
  };
  return axiosFetch("getExBySingleTeamNameCasino", "post", null, data).then(response => {
    if (response && response.data?.data) {
    
      return {
        ...response,
        data: Number(response.data?.data) || 0
      };
    }
    return response;
  });
}

export const gameNames = {
  cricket: "Cricket",
  soccer: "Soccer",
  tennis: "Tennis",
  cmeter1: "1 CARD METER",
  dum10: "DUS KA DUM",
  teen3: "INSTANT TEENPATTI",
  race2: "RACE TO 2ND",
  aaa2: "AMAR AKBAR ANTHONY 2",
  ab3: "ANDAR BAHAR 50 CARDS",
  teen1: "1 CARD ONE-DAYS",
  teen120: "1 CARD 20-20",
  kbc: "K.B.C",
  teen2024: "TEEN 20 24",
  notenum: "NOTE NUMBER",
  trio: "TRIO",
  teen20b: "20-20 TEENPATTI B",
  teenmuf: "MUFLIS TEENPATTI",
  race17: "RACE TO 17",
  teensin: "29CARD BACCARAT",
  patti2: "2 CARDS TEENPATTI",
  trap: "THE TRAP",
  teen: "1 Day Teen Patti",
  superover: "Super Over",
  teen20: "20-20 Teenpatti",
  teen9: "Teenpatti Test",
  teen8: "Teenpatti Open",
  teen6: "TEENPATTI - 2.0",
  cricketv3: "5 Cricket",
  poker: "Poker One Day",
  poker20: "Poker 20-20",
  poker6: "6 player Poker",
  baccarat: "Baccarat",
  baccarat2: "Baccarat 2",
  dt20: "20-20 Dragon Tiger",
  dt6: "1 Day Dragon Tiger",
  dtl20: "20-20 Dragon Tiger Lion",
  dt202: "20-20 Dragon Tiger 2",
  card32: "32 Cards A",
  card32eu: "32 Cards B",
  ab20: "Andar Bahar",
  abj: "Andar bahar 2",
  lucky7: "Lucky 7-A",
  lucky7eu: "Lucky 7-B",
  lucky7eu2: "LUCKY 7-C",
  "3cardj": "3card judgement",
  war: "Casino War",
  worli: "Worli Matka",
  worli2: "Instant Worli",
  aaa: "Amar Akbar Anthony",
  btable: "Bollywood Casino",
  lottcard: "LOTTERY",
  cmatch20: "20-20 Cricket Match",
  cmeter: "Casino Meter",
  queen: "Queen",
  race20: "Race 20-20",
  vlucky7: "V-Lucky 7",
  vtrio: "V-Trio",
  vdtl20: "V-20-20 D T L",
  vteenmuf: "V-Muflis Teenpatti",
  vaaa: "V-Amar Akbar Anthony",
  vbtable: "V-Bollywood Casino",
  vdt6: "V-1 Day Dragon Tiger",
  vteen: "V-Teenpatti 1-day",
  vteen20: "V-20-20 Teenpatti",
};

export function getPlayerCardAccordingToNumberOfPlayers(
  d_data,
  playerToGet = 1,
  totalNoOfPlayers = 2,
  pickExactCard = []
) {
  let playerCards = [];

  if (pickExactCard.length === 0) {
    for (let i = 0; i < totalNoOfPlayers; i++) {
      let cardValue = i * totalNoOfPlayers + playerToGet - 1;
      playerCards.push(cardValue);
    }
  } else {
    playerCards = pickExactCard;
  }

  if (d_data.card && d_data.card.length > 0) {
    const arCard = Array.isArray(d_data.card)
      ? d_data.card
      : typeof d_data.card === "string"
      ? d_data.card.split(",")
      : [];

    const playerA = arCard.map((path) => `/img/casino/cards/${path}.png`);

    return playerCards.map((index) => playerA[index]).filter(Boolean); // Return only valid paths
  }

  return [];
}

//TEEN8 CLASSIFY CARD FUNCTION FURTHER IMPLEMENTATION REFER DEVELOPERS
export const classifyCard = (card) => {
  let cardDetails = {
    card_no: "",
    card_for: "",
    card_icon: "",
    card_class: "",
    img_src: "",
  };

  if (card !== "1" && card) {
    let cardType = "";

    // Check for Spade (SS)
    if (card.includes("SS")) {
      cardType = "SS";
      cardDetails = {
        card_no: card.split("SS")[0],
        card_for: "SS",
        card_icon: "}",
        card_class: "card-black",
        img_src: `/img/casino/cards/${card}.png`,
      };
    }

    // Check for Heart (HH)
    if (card.includes("HH")) {
      cardType = "HH";
      cardDetails = {
        card_no: card.split("HH")[0],
        card_for: "HH",
        card_icon: "{",
        card_class: "card-red",
        img_src: `/img/casino/cards/${card}.png`,
      };
    }

    // Check for Club (CC)
    if (card.includes("CC")) {
      cardType = "CC";
      cardDetails = {
        card_no: card.split("CC")[0],
        card_for: "CC",
        card_icon: "]",
        card_class: "card-black",
        img_src: `/img/casino/cards/${card}.png`,
      };
    }

    // Check for Diamond (DD)
    if (card.includes("DD")) {
      cardType = "DD";
      cardDetails = {
        card_no: card.split("DD")[0],
        card_for: "DD",
        card_icon: "[",
        card_class: "card-red",
        img_src: `/img/casino/cards/${card}.png`,
      };
    }

    // Default image if card type isn't matched
    if (!cardType) {
      cardDetails.img_src = `/img/casino/cards/1.png`; // Default card image if no match
    }
  } else {
    // Handle if card is "1" (no card scenario)
    cardDetails.img_src = `/img/casino/cards/1.png`;
  }

  return cardDetails;
};

export const updatePlayerStats = (
  playerData,
  setPlayerBack = null,
  setPlayerLay = null,
  playerName,
  setPlayerStatuses,
  suspende_status = "suspended"
) => {
  if (!playerData) return;
  let playerStatus = "";
  if (playerData.gstatus === "SUSPENDED") {
    playerStatus = suspende_status;
  }

  setPlayerStatuses((prev) => ({ ...prev, [playerName]: playerStatus }));

  if (setPlayerBack !== null) {
    if (playerData.b) {
      setPlayerBack(playerData.b);
    } else {
      setPlayerBack(0);
    }
  }
  if (setPlayerLay !== null) {
    if (playerData.l) {
      setPlayerLay(playerData.l);
    } else {
      setPlayerLay(0);
    }
  }
};

export const resetBetFields = (profitdata, stakevalue) => {
  profitdata.current = 0;
  stakevalue.current.value = 0;
};

export function cardMap(index, increase = true) {
  if (increase) index += 1;
  switch (index) {
    case 1:
      index = "A";
      break;

    case 11:
      index = "J";
      break;

    case 12:
      index = "Q";
      break;
    case 13:
      index = "K";
      break;

    default:
      break;
  }

  return index;
}

export function changeCardIndex(index) {
  switch (index) {
    case "A":
      index = 1;
      break;

    case "J":
      index = 11;
      break;

    case "Q":
      index = 12;
      break;
    case "K":
      index = 13;
      break;

    default:
      break;
  }

  return index;
}

export function cardMapInteger(index) {
  if (index.charAt(1) === "0") {
    index = 10;
  } else {
    index = index.charAt(0);
  }

  switch (index) {
    case "A":
      index = 1;
      break;

    case "J":
      index = 11;
      break;

    case "Q":
      index = 12;
      break;
    case "K":
      index = 13;
      break;

    default:
      break;
  }

  return index;
}

export const cardGenerate = () => {
  return Array.from({ length: 13 }, (_, index) => {
    index += 1;
    return [index, "/img/card/" + index + ".jpg"];
  });
};

export const getExBySingleTeamLayBackCasino = (
  sportId,
  roundId,
  teamname,
  betType,
  type
) => {
  // Convert betType if needed (e.g., cup -> cup)
  const convertedBetType = betType;

  const data = {
    id: sportId,
    round_id: roundId,
    teamname: teamname,
    bet_type: convertedBetType,
    type: type,
  };
  return axiosFetch("getExBySingleTeamLayBackCasino", "post", null, data);
};

export const cardPointsCount = (exclude = ["K"], cards) => {
  if (!cards && !Array.isArray(cards)) return 0;

  return cards.reduce((accumulator, value) => {
    // Check if we should exclude this value

    const includevalue = value.charAt(0) + value.charAt(1);
    const newvalue =
      includevalue !== "10" ? value.charAt(0).toUpperCase() : includevalue;
    if (exclude !== null && exclude.includes(newvalue) === true) {
      return accumulator; // Skip this value
    }

    // Parse and add the transformed value to the accumulator
    return (
      accumulator +
        parseInt(
          changeCardIndex(
            includevalue !== "10" ? value.charAt(0).toUpperCase() : includevalue
          ),
          10
        ) || 0
    ); // Ensure adding 0 if NaN
  }, 0);
};

export const race17calculation = (round_id, team_name) => {
  const data = { roundId: round_id, team_name: team_name };

  return axiosFetch("calculate-bet-17", "post", null, data);
};

export const chunkArray = (arr, size, debug = false) => {
  if (!arr || arr.length === 0) {
    return [];
  }

  // Group items by sno (section number) to keep related items together
  const groupedBySno = {};
  arr.forEach((item) => {
    const sno = item.sno || 0;
    if (!groupedBySno[sno]) {
      groupedBySno[sno] = [];
    }
    groupedBySno[sno].push(item);
  });

  // Split groups into two columns based on odd/even sno values
  const oddChunk = []; // Items with odd sno values
  const evenChunk = []; // Items with even sno values

  Object.keys(groupedBySno).forEach((snoKey) => {
    const sno = parseInt(snoKey, 10);
    const group = groupedBySno[sno];
    if (sno % 2 === 1) {
      // Odd sno values go to oddChunk
      oddChunk.push(...group);
    } else {
      // Even sno values go to evenChunk
      evenChunk.push(...group);
    }
  });

  if (oddChunk.length > 0 && evenChunk.length > 0) {
    return [oddChunk, evenChunk];
  } else if (oddChunk.length > 0) {
    return [oddChunk];
  } else if (evenChunk.length > 0) {
    return [evenChunk];
  } else {
    return [];
  }
};
export const dummyDataOdds = (array) => {
  const newArray = [];
  let type = null;

  if (
    typeof array !== "undefined" &&
    typeof array === "object" &&
    array.length === 1
  ) {
    for (let i = 0; i <= 1; i++) {
      type = array[0].otype;
      newArray.push({
        sid: "",
        psid: 0,
        odds: 0,
        otype: array[0].otype,
        oname: array[0].oname,
        size: 0,
      });
    }
  }

  if (type === "back") {
    return [...newArray, ...array]; // Merge newArray and array
  } else if (type === null) {
    return array; // Return the original array
  } else {
    return [...array, ...newArray]; // Merge array and newArray
  }
};

// Function to convert betType format to data key format

export const placeCasinoBet = async (betData, callbacks = {}) => {
  const {
    sportList,
    roundId,
    backOrLay,
    teamname,
    odds,
    profit,
    loss,
    betType,
    stakeValue,
    match_id,
    roundIdSaved,
    totalPlayers,
    playerStatuses,
    setHideLoading,
    setPopupDisplayForDesktop,
    setSubmitButtonDisable,
    resetBetFields,
    profitData,
    getBalance,
    updateAmounts,
    Notify,
    onSuccess = null,
    onError = null,
  } = betData;

  try {
    setHideLoading(false);

    if(isAdminRoute()) {
      return false;
    }

    // Check if bet amount is 0 or less
    if (parseFloat(stakeValue.current.value) <= 0) {
      Notify("Please fill bet amount", null, null, "danger");
      setHideLoading(true);
      return false;
    }

    // Check if game is suspended
    let isSuspended = false;
    if (totalPlayers && teamname.current) {
      if (
        totalPlayers[teamname.current] &&
        totalPlayers[teamname.current].status !== ""
      ) {
        isSuspended = true;
      }
    }

    if (globalTimer !== null && globalTimer < 2) {
      isSuspended = true;
    }

    
    if (
      (playerStatuses && playerStatuses?.[teamname.current] === "suspended") ||
      playerStatuses?.[teamname.current] === "suspended-box"
    ) {
      isSuspended = true;
    }

    
    else if (
      (playerStatuses && typeof playerStatuses === "string" && playerStatuses.toLowerCase() === "suspended") ||
      (playerStatuses && typeof playerStatuses === "string" && playerStatuses.toLowerCase() === "suspended-box" )
    ) {
      isSuspended = true;
    }

    if (isSuspended) {
      if (callbacks && typeof callbacks.onError === "function") {
        callbacks.onError();
      }

      Notify(`Bet Not Confirmed. Reason: Game Suspended`, null, null, "danger");
      setPopupDisplayForDesktop(false);
      setHideLoading(true);
      resetBetFields(profitData, stakeValue);
      return false;
    }

    // Check if round has changed
    if (roundIdSaved.current !== roundId) {
      if (callbacks && typeof callbacks.onError === "function") {
        callbacks.onError();
      }

      Notify("Bet Not Confirm Reason Game Change", null, null, "danger");
      setPopupDisplayForDesktop(false);
      setHideLoading(true);
      resetBetFields(profitData, stakeValue);
      return false;
    }

    
    // Also call the local function for backward compatibility
    if (setSubmitButtonDisable) {
      setSubmitButtonDisable(true);
    }

    // Convert betType if needed (e.g., cup -> cup)
    const convertedBetType = betType;

    const postdata = {
      sportId: sportList.id,
      matchId: roundId,
      isback: backOrLay === "back" ? 1 : 0,
      placeName: teamname.current,
      placeName2: callbacks.placeName2
        ? callbacks.placeName2.find((item) => item !== teamname.current)
        : null,
      odds: odds,
      oddsk: callbacks.oddsk || 0,
      profit: parseFloat(profit.current).toFixed(2),
      loss: parseFloat(loss.current).toFixed(2),
      betType: convertedBetType,
      bet_side: backOrLay.toUpperCase(),
      betAmount: parseFloat(stakeValue.current.value),
      type: match_id.toUpperCase(),
      matchType: match_id.toLowerCase(),
    };

    if (callbacks && typeof callbacks.betBeforeNotification === "function") {
      const betBeforeNotification = callbacks.betBeforeNotification();

      Notify(betBeforeNotification.message, null, null, "danger");
      if (!betBeforeNotification.status) {
        return false;
      }
    }

    if (callbacks && typeof callbacks.checkBeforeBet === "function") {
      const checkBeforeBet = callbacks.checkBeforeBet();
      if (!checkBeforeBet) {
        return false;
      }
    }

    if (
      callbacks &&
      typeof callbacks.odd_min_limit === "function" &&
      callbacks.odd_min_limit !== null
    ) {
      const odd_min_limit = callbacks.odd_min_limit();

      if (
        odd_min_limit !== null &&
        parseFloat(odd_min_limit) > parseFloat(stakeValue.current.value)
      ) {
        Notify(
          "Bet Amount Should Be Greater Than Or Equal To " + odd_min_limit,
          null,
          null,
          "danger"
        );
        return false;
      }
    }
    if (
      callbacks &&
      typeof callbacks.odd_max_limit === "function" &&
      callbacks.odd_max_limit !== null
    ) {
      const odd_max_limit = callbacks.odd_max_limit();

      if (
        odd_max_limit !== null &&
        parseFloat(odd_max_limit) < parseFloat(stakeValue.current.value)
      ) {
        Notify(
          "Bet Amount Should Be Less Than Or Equal To " + odd_max_limit,
          null,
          null,
          "danger"
        );
        return false;
      }
    }
    const res = await axiosFetch("casino/store", "post", null, postdata);

    if (res.data.status === true) {
      // Call optional update function
      if (updateAmounts) {
        if (typeof updateAmounts === "function") {
          updateAmounts();
        } else if (typeof updateAmounts === "string") {
          // Handle case where updateAmounts is a string (betType)
          const updateFunc = window[updateAmounts];
          if (typeof updateFunc === "function") {
            updateFunc(betType);
          }
        }
      }

      // Get balance
      if (getBalance) {
        getBalance();
      }

      // Reset bet fields
      resetBetFields(profitData, stakeValue);

      // Call optional success callback
      if (callbacks && typeof callbacks.onSuccess === "function") {
        callbacks.onSuccess();
      }
      if (callbacks && typeof callbacks.noNotify === "function") {
        const isTrue = callbacks.noNotify();

        if (isTrue) {
          return true;
        }
      }
      Notify("Bet Placed Successfully", null, null, "success");
      return true;
    } else {
      resetBetFields(profitData, stakeValue);
      Notify(res.data.msg, null, null, "danger");

      // Call optional error callback
      if (onError && typeof onError === "function") {
        onError(res.data.msg);
      }
      return false;
    }
  } catch (error) {
    console.error("Error placing bet:", error);
    resetBetFields(profitData, stakeValue);
    Notify("An error occurred while placing bet", null, null, "danger");

    // Call optional error callback
    if (onError && typeof onError === "function") {
      onError(error.message);
    }
    return false;
  } finally {
    setHideLoading(true);
    // Use global Redux store to dispatch action
    store.dispatch(setIsSubmitDisabled(true));
    
    // Also call the local function for backward compatibility
    if (setSubmitButtonDisable) {
      setSubmitButtonDisable(false);
    }
    setPopupDisplayForDesktop(false);
  }
};

/**
 * Calculate updated bets for placing bets functionality
 * @param {string} betType - The type of bet (ODDS, BOOKMAKER, etc.)
 * @param {string} backOrLay - Whether it's 'back' or 'lay' bet
 * @param {string} currentTeam - Current team name
 * @param {number} profit - Current profit value
 * @param {number} loss - Current loss value
 * @param {Array} teamNames - Array of team names for the bet type
 * @param {Object} teamNameCurrentBets - Current bets for each team
 * @param {Object} existingPlacingBets - Existing placing bets state
 * @returns {Object} Updated bets object
 */
export const calculateUpdatedBets = (
  betType,
  backOrLay,
  currentTeam,
  profit,
  loss,
  teamNames,
  teamNameCurrentBets,
  existingPlacingBets = null
) => {
  if (
    ![
      "ODDS",
      "BOOKMAKER",
      "TIED_MATCH",
      "TIED MATCH",
      "cup",
      "BOOKMAKER2",
    ].includes(betType)
  ) {
    return existingPlacingBets;
  }

  if (!teamNames || teamNames.length === 0) {
    return existingPlacingBets;
  }

  const updatedBets = teamNames.reduce(
    (acc, value) => {
      if (backOrLay === "back") {
        if (currentTeam !== value) {
          // Other teams get negative loss
          acc[value] =
            Math.round(
              (parseFloat(-loss) +
                parseFloat(teamNameCurrentBets[betType]?.[value] || 0)) *
                100
            ) / 100;
        } else {
          // Current team gets positive profit
          acc[currentTeam] =
            Math.round(
              (parseFloat(profit) +
                parseFloat(teamNameCurrentBets[betType]?.[value] || 0)) *
                100
            ) / 100;
        }
      } else {
        if (currentTeam !== value) {
          // Other teams get positive profit
          acc[value] =
            Math.round(
              (parseFloat(profit) +
                parseFloat(teamNameCurrentBets[betType]?.[value] || 0)) *
                100
            ) / 100;
        } else {
          // Current team gets negative loss
          acc[currentTeam] =
            Math.round(
              (parseFloat(-loss) +
                parseFloat(teamNameCurrentBets[betType]?.[value] || 0)) *
                100
            ) / 100;
        }
      }

      return acc;
    },
    { ...(existingPlacingBets?.[betType] || {}) }
  );

  return updatedBets;
};

/**
 * Update placing bets state with calculated values
 * @param {function} setPlacingBets - State setter function
 * @param {string} betType - The type of bet
 * @param {Object} updatedBets - Calculated updated bets
 */
export const updatePlacingBetsState = (
  setPlacingBets,
  betType,
  updatedBets,
  globalUpdatePlacingBets = null
) => {
  
  if (setPlacingBets) {
    setPlacingBets((prevState) => {
      const newState = {
        ...prevState,
        [betType]: updatedBets,
      };

      return newState;
    });
  }

  if (globalUpdatePlacingBets) {
    
    globalUpdatePlacingBets.current = updatedBets;
  }
};

export const calculateProfitCommon = (
  betType,
  backOrLay,
  odds,
  stake,
  profit,
  profitData,
  oddsk = null
) => {
  const parsedOdds = parseFloat(odds);
  const parsedStake = parseFloat(stake);

  let profitCalc = 0;

  if (betType === "ODDS" || betType === "ODDEVEN") {
    profitCalc = parsedStake * (parsedOdds - 1);
  } else if (betType === "SESSION" || betType === "FANCY_SESSION") {
    profitCalc = parsedStake;
  } else if (
    betType === "BOOKMAKER" ||
    betType === "BOOKMAKER2" ||
    betType === "TIED_MATCH" ||
    betType === "cup"
  ) {
    profitCalc = (parsedStake * parsedOdds) / 100;
  } else {
    profitCalc = parsedStake * parsedOdds;
  }

  // Ensure profitCalc is always a number to avoid issues
  profitCalc = isNaN(profitCalc) ? 0 : profitCalc;

  // Store the result directly in the profit reference
  profit.current = profitCalc.toFixed(2);

  // Handle profit/loss logic for back or lay
  if (backOrLay === "back") {
    if (betType === "ODDS") {
      profit.current = profitData.current = profit.current;
    } else if (
      betType === "BOOKMAKER" ||
      betType === "BOOKMAKER2" ||
      betType === "cup"
    ) {
      profit.current = profitCalc;
      profitData.current = profitCalc;
    } else if (betType === "ODDEVEN") {
      profit.current = profitData.current = profit.current;
    } else if (betType === "fancy1") {
      profit.current = profitData.current = (parsedOdds - 1) * 100;
    } else if (betType === "TIED_MATCH") {
      profit.current = profitData.current = (parsedOdds * parsedStake) / 100;
    } else {
      profit.current = profitData.current = (oddsk.current * parsedStake) / 100;
    }
  } else {
    profitData.current = parsedStake;
    profit.current = parsedStake;
  }
};
export const exposureCheck = () => {
  // Get exposure from Redux store instead of localStorage
  const state = store.getState();
  return state.user.exposure || 0.00;
};

export const setGlobalVar = (val) => {
  globalTimer = val;
};

export const getGlobalTimer = () => {
  return parseFloat(globalTimer);
};

// Generic function to fetch and handle result popup for casino games
export const fetchAndHandleResultPopup = async (
  roundId,
  matchId,
  setResultText,
  setShowPopup,
  gameType = "goal",
  autoHideDelay = 5000
) => {
  if (roundId && matchId) {
    try {
      // Use the same API pattern as CasinoLastResult.js
      const fdata = { match_id: matchId, roundID: roundId };
      const response = await axiosFetch("last-result", "post", null, fdata);

      if (response?.data) {
        

        // Parse result based on game type
        const resultData = response.data;
        let resultText = "Result Available!";

        switch (gameType) {
          case "goal":
            // Parse goal result from API response
            if (resultData.resultNew?.t1?.rdesc) {
              const rdesc = resultData.resultNew.t1.rdesc;
              if (rdesc.includes("#")) {
                const [player, method] = rdesc.split("#");
                resultText = `${method} by ${player}`;
              } else {
                resultText = rdesc;
              }
            }
            break;

          case "cricket":
            // Parse cricket result
            if (resultData.resultNew?.t1?.rdesc) {
              resultText = resultData.resultNew.t1.rdesc;
            }
            break;

          case "card":
            // Parse card game result
            if (resultData.resultNew?.t1?.rdesc) {
              resultText = resultData.resultNew.t1.rdesc;
            }
            break;

          default:
            // Generic result parsing
            if (resultData.resultNew?.t1?.rdesc) {
              resultText = resultData.resultNew.t1.rdesc;
            }
            break;
        }

        // Set the result and show popup
        setResultText(resultText);
        setShowPopup(true);

        // Auto-hide popup after specified delay
        setTimeout(() => {
          setShowPopup(false);
          setResultText("");
        }, autoHideDelay);
      }
    } catch (error) {
      console.error("Error fetching individual result:", error);
    }
  }
};

/**
 * Find data by gmid (Game Match ID) from various data sources
 * @param {string} gmid - The Game Match ID to search for
 * @param {Object} dataSource - The data source to search in
 * @param {Object} options - Search options
 * @returns {Object|null} - Found data or null if not found
 */
export const findDataByGmid = (gmid, dataSource, options = {}) => {
  if (!gmid || !dataSource) {
    console.warn("findDataByGmid: Missing required parameters");
    return null;
  }

  const {
    searchIn = ["t1", "t2", "data"], // Where to search for gmid
    returnType = "full", // 'full', 'gmid', 'data'
    includeMetadata = true,
  } = options;

  try {
    // Search in specified locations
    for (const location of searchIn) {
      if (dataSource[location]) {
        const locationData = dataSource[location];

        // Check if this location has gmid
        if (locationData.gmid === gmid) {
          if (returnType === "gmid") {
            return { gmid: locationData.gmid, location };
          } else if (returnType === "data") {
            return { data: locationData, location };
          } else {
            // Return full data with metadata
            return {
              gmid: locationData.gmid,
              data: locationData,
              location,
              metadata: includeMetadata
                ? {
                    foundAt: location,
                    searchTime: new Date().toISOString(),
                    hasCard: !!locationData.card,
                    hasRdesc: !!locationData.rdesc,
                    hasWin: !!locationData.win,
                    hasWinnat: !!locationData.winnat,
                  }
                : null,
            };
          }
        }
      }
    }

    // If not found in specified locations, search recursively
    const recursiveSearch = (obj, path = "") => {
      if (typeof obj !== "object" || obj === null) return null;

      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;

        if (value && typeof value === "object") {
          if (value.gmid === gmid) {
            return {
              gmid: value.gmid,
              data: value,
              location: currentPath,
              metadata: includeMetadata
                ? {
                    foundAt: currentPath,
                    searchTime: new Date().toISOString(),
                    hasCard: !!value.card,
                    hasRdesc: !!value.rdesc,
                    hasWin: !!value.win,
                    hasWinnat: !!value.winnat,
                  }
                : null,
            };
          }

          const result = recursiveSearch(value, currentPath);
          if (result) return result;
        }
      }
      return null;
    };

    return recursiveSearch(dataSource);
  } catch (error) {
    console.error("Error in findDataByGmid:", error);
    return null;
  }
};

/**
 * Find multiple data entries by gmid from an array of data sources
 * @param {string} gmid - The Game Match ID to search for
 * @param {Array} dataSources - Array of data sources to search in
 * @param {Object} options - Search options
 * @returns {Array} - Array of found data entries
 */
export const findMultipleDataByGmid = (gmid, dataSources, options = {}) => {
  if (!gmid || !Array.isArray(dataSources)) {
    console.warn("findMultipleDataByGmid: Invalid parameters");
    return [];
  }

  const results = [];

  dataSources.forEach((dataSource, index) => {
    const result = findDataByGmid(gmid, dataSource, options);
    if (result) {
      results.push({
        ...result,
        sourceIndex: index,
      });
    }
  });

  return results;
};

/**
 * Get gmid from various data structures
 * @param {Object} data - Data object to extract gmid from
 * @returns {string|null} - Extracted gmid or null
 */
export const extractGmid = (data) => {
  if (!data || typeof data !== "object") return null;

  // Common gmid locations
  const gmidLocations = [
    "gmid",
    "t1.gmid",
    "t2.gmid",
    "data.t1.gmid",
    "data.t2.gmid",
    "mid",
    "t1.mid",
    "t2.mid",
  ];

  for (const location of gmidLocations) {
    const value = getNestedValue(data, location);
    if (value) return value;
  }

  return null;
};

/**
 * Helper function to get nested object values
 * @param {Object} obj - Object to search in
 * @param {string} path - Dot notation path
 * @returns {*} - Value at path or undefined
 */
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Filter data array by gmid
 * @param {Array} dataArray - Array of data objects
 * @param {string} gmid - Game Match ID to filter by
 * @returns {Array} - Filtered array
 */
export const filterDataByGmid = (dataArray, gmid) => {
  if (!Array.isArray(dataArray) || !gmid) {
    return [];
  }

  return dataArray.filter((item) => {
    const itemGmid = extractGmid(item);
    return itemGmid === gmid;
  });
};

/**
 * Set up socket connection for specific gmid
 * @param {Object} socket - Socket instance
 * @param {string} gmid - Game Match ID
 * @param {string} gameType - Type of game
 * @param {string} purpose - Purpose for socket connection
 * @returns {boolean} - Success status
 */
export const setupSocketForGmid = (
  socket,
  gmid,
  gameType,
  purpose = "casino"
) => {
  if (!socket || !gmid || !gameType) {
    console.warn("setupSocketForGmid: Missing required parameters");
    return false;
  }

  try {
    // Emit setPurposeFor with gmid
    socket.emit("setPurposeFor", purpose, gameType, null, gmid, gameType);
    return true;
  } catch (error) {
    console.error("Error setting up socket for gmid:", error);
    return false;
  }
};

/**
 * Get exposure data for specific gmid and team
 * @param {string} gmid - Game Match ID
 * @param {string} teamName - Team/Player name
 * @param {string} matchId - Match ID
 * @param {string} sportId - Sport ID
 * @param {string} betType - Bet type
 * @returns {Promise} - API response
 */
export const getExposureByGmid = async (
  gmid,
  teamName,
  matchId,
  sportId,
  betType = "BOOKMAKER"
) => {
  if (!gmid || !teamName || !matchId || !sportId) {
    console.warn("getExposureByGmid: Missing required parameters");
    return null;
  }

  try {
    return await getExByTeamNameForCasino(
      sportId,
      gmid,
      teamName,
      matchId,
      betType
    );
  } catch (error) {
    console.error("Error getting exposure by gmid:", error);
    return null;
  }
};

/**
 * Validate gmid format
 * @param {string} gmid - Game Match ID to validate
 * @returns {boolean} - Whether gmid is valid
 */
export const isValidGmid = (gmid) => {
  if (!gmid || typeof gmid !== "string") return false;

  // Basic validation - gmid should be numeric and have reasonable length
  const numericGmid = gmid.replace(/\D/g, "");
  return numericGmid.length >= 10 && numericGmid.length <= 20;
};

export const RouletteNumberMappings = {
  // Odd numbers (1-36)
  Odd: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],

  // Even numbers (1-36)
  Even: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],

  // Red numbers
  Red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],

  // Black numbers
  Black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],

  // Column mappings
  "1st Column": [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  "2nd Column": [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  "3rd Column": [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],

  // Dozen mappings
  "1st 12": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  "2nd 12": [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
  "3rd 12": [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],

  // Half board mappings
  "1 to 18": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  "19 to 36": [
    19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  ],
};

/**
 * Simple function to calculate runs for cricket betting
 * Based on Twenty-20 cricket rules: 12 runs needed in 2 balls
 * @param {Array} matchedBets - Array of matched bets like [{teamName: "Run 2", odds: 9.5, stake: 100}]
 * @param {number} stake - Default stake amount (default: 100)
 * @returns {Object} - Simple results object
 */
export const calculateRuns = (matchedBets = []) => {
  const results = {};
  if(!matchedBets) return results;
  if(matchedBets.length === 0) return results;
  for (let i = 1; i <= 10; i++) {
    let profit = 0;

    // Check all matched bets
    for (const bet of matchedBets) {
      const betRun = parseInt(bet.team_name.split(" ")[1], 10) - 2;
      const requiredRun = 10 - betRun;

      if (requiredRun <= i) {
        // Calculate profit for this bet
        if (bet.extra.toLowerCase() === "back") {
          profit += Math.round(bet.bet_amount * (bet.bet_odds - 1));
        } else {
          profit -= Math.round(bet.bet_amount * (bet.bet_odds - 1));
        }
      } else {
        if (bet.extra.toLowerCase() === "back") {
          profit -= bet.bet_amount;
        } else {
          profit += bet.bet_amount;
        }
      }
    }

    results[i] = profit;
  }
  return results;
};


/**
 * Hook to delete a matched bet with toast confirmation
 * @returns {Object} - { deleteBet: function }
 */
export const useDeleteMatchedBet = () => {
  const { showConfirm } = useToastConfirm();
  
  const deleteBet = async (betId, onSuccess = null, onError = null) => {
    // Check if admin has bet delete access
    const adminUser = store.getState().admin?.user;
    const isSuperAdmin = adminUser?.role === 1;
    const isBetDeleteAccess = adminUser?.isBetDeleteAccess === 1 || adminUser?.isBetDeleteAccess === true;
    
    // Only allow deletion if user has access or is superadmin (or if not in admin route)
    if (isAdminRoute() && !isBetDeleteAccess && !isSuperAdmin) {
      toast.error("You do not have permission to delete bets.");
      if (onError && typeof onError === 'function') {
        onError("Permission denied");
      }
      return false;
    }

    let loadingToast;

    try {
      // Show toast confirmation
      const confirmed = await showConfirm({
        title: "Delete Bet",
        message: "Are you sure you want to delete this bet?",
        confirmText: "Delete",
        cancelText: "Cancel",
        type: "danger"
      });
      
      if (!confirmed) {
        return false;
      }
      
      // Show loading toast
      loadingToast = toast.loading("Deleting bet...");
        // Make API call to delete bet - only send bet_id
        const formData = new FormData();
        formData.append('bet_id', betId);
        
        const response = await adminApi(`${ADMIN_BASE_PATH}/delete-matched-bet`, "POST", formData, true);
      
        
      if (response && response.success) {
        toast.dismiss(loadingToast);
        toast.success("Bet deleted successfully!");
        
        // Trigger bet data fetch after successful deletion
        try {
          const { getBetListData } = await import("@dxc247/shared/utils/betUtils");
          // Get match_id from URL
          const matchId = window.location.pathname.match(/\/(soccer|cricket|tennis|casino)\/(\d+)/)?.[2];
          if (matchId) {
            // Fetch fresh bet data (will update cache automatically)
            getBetListData(matchId).catch(err => console.error("Error fetching bet data after delete:", err));
            // Dispatch event to trigger callTeamDatas
            window.dispatchEvent(new CustomEvent('refreshExposureData'));
          }
        } catch (error) {
          console.error("Error importing getBetListData:", error);
        }
        
        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(betId);
        }
        
        return true;
      } else {
        toast.dismiss(loadingToast);
        const errorMessage = response?.data?.message || response?.message || "Failed to delete bet";
        toast.error(errorMessage);
        
        // Call error callback if provided
        if (onError && typeof onError === 'function') {
          onError(errorMessage);
        

        }
        
        return false;
      }
    } catch (error) {
      console.error("Error deleting bet:", error);
      toast.error("An error occurred while deleting the bet");
      toast.dismiss(loadingToast);
      
      // Call error callback if provided
      if (onError && typeof onError === 'function') {
        onError(error.message);
      }
      
      return false;
    }
  };
  
  const undoBet = async (betId, onSuccess = null, onError = null) => {
    let loadingToast;

    try {
      // Show toast confirmation
      const confirmed = await showConfirm({
        title: "Restore Bet",
        message: "Are you sure you want to restore this bet?",
        confirmText: "Restore",
        cancelText: "Cancel",
        type: "success"
      });
      
      if (!confirmed) {
        return false;
      }
      
      // Show loading toast
      loadingToast = toast.loading("Restoring bet...");
      
      // Make API call to restore bet - only send bet_id
      const formData = new FormData();
      formData.append('bet_id', betId);
      
      const response = await adminApi(`${ADMIN_BASE_PATH}/undo-deleted-bet`, "POST", formData, true);
    
      if (response && response.success) {
        toast.dismiss(loadingToast);
        toast.success("Bet restored successfully!");
        
        // Trigger bet data fetch after successful restoration
        try {
          const { getBetListData } = await import("@dxc247/shared/utils/betUtils");
          // Get match_id from URL
          const matchId = window.location.pathname.match(/\/(soccer|cricket|tennis|casino)\/(\d+)/)?.[2];
          if (matchId) {
            
            // Fetch fresh bet data (will update cache automatically)
            getBetListData(matchId).catch(err => console.error("Error fetching bet data after restore:", err));
            // Dispatch event to trigger callTeamDatas
            window.dispatchEvent(new CustomEvent('refreshExposureData'));
          }
        } catch (error) {
          console.error("Error importing getBetListData:", error);
        }
        
        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(betId);
        }
        
        return true;
      } else {
        toast.dismiss(loadingToast);
        const errorMessage = response?.data?.message || response?.message || "Failed to restore bet";
        toast.error(errorMessage);
        
        // Call error callback if provided
        if (onError && typeof onError === 'function') {
          onError(errorMessage);
        }
        
        return false;
      }
    } catch (error) {
      console.error("Error restoring bet:", error);
      toast.error("An error occurred while restoring the bet");
      toast.dismiss(loadingToast);
      
      // Call error callback if provided
      if (onError && typeof onError === 'function') {
        onError(error.message);
      }
      
      return false;
    }
  };
  
  return { deleteBet, undoBet };
};


export async function secureDatatableFetch(url, dtParams = {}, extraParams = {}) {
  const token = getCurrentToken();
  const publicKey = store.getState().commonData.serverPublicKey;

  // 1️⃣ Merge DataTables and extra params
  const requestPayload = { ...dtParams, ...extraParams };
  
 
  // 2️⃣ Generate AES key & IV
  const aesKey = CryptoJS.lib.WordArray.random(32);
  const aesIv = CryptoJS.lib.WordArray.random(16);

  // 3️⃣ Encrypt payload using AES
  const encryptedPayload = CryptoJS.AES.encrypt(
    JSON.stringify(requestPayload),
    aesKey,
    {
      iv: aesIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();

  // 4️⃣ Encrypt AES key using RSA public key
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  const encryptedAESKey = encryptor.encrypt(
    CryptoJS.enc.Base64.stringify(aesKey)
  );

  try {
    // 5️⃣ Send encrypted request
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/${url}`,
      { payload: encryptedPayload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Encrypted-Key": encryptedAESKey,
          "X-IV": CryptoJS.enc.Base64.stringify(aesIv),
        },
      }
    );

    // 6️⃣ Decrypt response
    const encryptedResponse = response.data?.data;
    let decryptedJSON = {};

    if (encryptedResponse && typeof encryptedResponse === 'string' && encryptedResponse !== 'undefined') {
      const decrypted = CryptoJS.AES.decrypt(encryptedResponse, aesKey, {
        iv: aesIv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      decryptedJSON = JSON.parse(decryptedText);
   
    } else {
      decryptedJSON = response.data;
      
    }

    // ✅ Return decrypted JSON ready for DataTables
    return decryptedJSON;
  } catch (error) {
    
    return {
      draw: dtParams.draw,
      recordsTotal: 0,
      recordsFiltered: 0,
      data: [],
    };
  }
}

/**
 * Calculate resulting nets using the same calculation as calculateUpdatedBets
 * But works with oddsTeamData and returns nets for the two teams only
 * @param {string} betType - The type of bet (ODDS, BOOKMAKER, etc.)
 * @param {string} backOrLay - Whether it's 'back' or 'lay' bet
 * @param {string} currentTeam - Current team name (team being bet on)
 * @param {number} profit - Current profit value (calculated from odds and stake)
 * @param {number} loss - Current loss value (calculated from odds and stake)
 * @param {Object} oddsTeamData - Current exposure/profit-loss for each team (like teamNameCurrentBets)
 *                                Must contain exactly 2 teams
 * @returns {Object} Resulting nets object with team names as keys
 */
export const calculateResultingNetsFromOdds = (
  betType,
  backOrLay,
  currentTeam,
  profit,
  loss,
  oddsTeamData = {}
) => {
  // Get team names from oddsTeamData keys
  const teamNames = Object.keys(oddsTeamData || {});
  
  if (teamNames.length !== 2) {
    
    return {};
  }

  // Find the other team (the one that's not currentTeam)
  const otherTeam = teamNames.find(t => t !== currentTeam);
  
  if (!otherTeam) {
    
    return {};
  }

  // Get existing values from oddsTeamData (like teamNameCurrentBets[betType][team] in calculateUpdatedBets)
  const existingCurrentValue = oddsTeamData && oddsTeamData[currentTeam] != null ? parseFloat(oddsTeamData[currentTeam]) || 0 : 0;
  const existingOtherValue = oddsTeamData && oddsTeamData[otherTeam] != null ? parseFloat(oddsTeamData[otherTeam]) || 0 : 0;

  // Apply calculateUpdatedBets logic exactly (lines 2114-2150)
  let netCurrentWin, netOtherWin;

  if (backOrLay === "back") {
    // For BACK bet: current team gets profit + existing, other team gets -loss + existing
    // This matches calculateUpdatedBets logic exactly (lines 2125-2130 and 2117-2122)
    netCurrentWin = Math.round((parseFloat(profit) + parseFloat(existingCurrentValue)) * 100) / 100;
    netOtherWin = Math.round((parseFloat(-loss) + parseFloat(existingOtherValue)) * 100) / 100;
  } else {
    // For LAY bet: current team gets -loss + existing, other team gets profit + existing
    // This matches calculateUpdatedBets logic exactly (lines 2143-2148 and 2135-2140)
    netCurrentWin = Math.round((parseFloat(-loss) + parseFloat(existingCurrentValue)) * 100) / 100;
    netOtherWin = Math.round((parseFloat(profit) + parseFloat(existingOtherValue)) * 100) / 100;
  }

  return {
    [currentTeam]: netCurrentWin,
    [otherTeam]: netOtherWin
  };
};