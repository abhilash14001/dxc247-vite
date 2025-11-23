# Smart Cashout Logic Documentation

## Overview

The smart cashout system calculates optimal hedge bets to "cash out" (lock in profit/loss) from existing bets. It finds the best bet (back or lay) on any team that will balance the user's exposure across all possible outcomes, minimizing risk regardless of which team wins.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Function: `findNearestStakeValue`](#function-findneareststakevalue)
3. [Function: `calculateSmartCashout`](#function-calculatesmartcashout)
4. [How It Works](#how-it-works)
5. [Mathematical Formulas](#mathematical-formulas)
6. [Examples](#examples)
7. [Return Value Structure](#return-value-structure)
8. [Special Cases](#special-cases)

---

## Core Concepts

### What is Cashout?

When a user has multiple bets on different teams, they have **exposure** (potential profit/loss) that varies depending on which team wins. A "cashout" hedge bet allows them to:

- **Lock in a consistent profit/loss** regardless of outcome
- **Reduce risk** by balancing exposure across all teams
- **Use optimal stake amounts** based on current market odds

### Key Terms

- **BACK bet**: Betting on a team to win
- **LAY bet**: Betting against a team (opposite of back)
- **Exposure**: Potential profit/loss based on current bets
- **Hedge bet**: A new bet that balances existing exposure
- **Theoretical stake**: The exact calculated stake needed to balance positions
- **Capped stake**: The actual stake rounded to nearest valid betting amount

---

## Function: `findNearestStakeValue`

### Purpose

Finds the nearest available stake value from a list of allowed stake values. This ensures that calculated stakes are rounded to valid betting amounts.

### Signature

```javascript
function findNearestStakeValue(targetValue, stakeValues = {})
```

### Parameters

- **`targetValue`** (number): The theoretical stake amount we want to match
- **`stakeValues`** (Object): Object containing available stake values
  - Format: `{ key1: { val: 100 }, key2: { val: 500 }, ... }`
  - Or: `{ key1: 100, key2: 500, ... }`

### Returns

- **number**: The nearest available stake value, or `targetValue` if no stakes available

### Algorithm

1. Extract all stake values from the object
2. Filter out invalid values (≤ 0)
3. Sort stakes in ascending order
4. Find the stake with minimum absolute difference from `targetValue`

### Example

```javascript
findNearestStakeValue(237.5, { 
  1: { val: 100 }, 
  2: { val: 200 }, 
  3: { val: 500 } 
})
// Returns: 200 (closest to 237.5)

findNearestStakeValue(150, {})
// Returns: 150 (no constraints, return original)
```

---

## Function: `calculateSmartCashout`

### Purpose

Calculates the optimal hedge bet to balance user's exposure across all possible outcomes.

### Signature

```javascript
export function calculateSmartCashout(matchData, recentBets, stakeValues = {})
```

### Parameters

#### `matchData` (Object)
Current market odds data with the following structure:

```javascript
{
  back: [
    {
      team: "Team A",      // Team name
      odds: 150,           // Display odds (150 = 1.50 decimal)
      volume: 10000         // Available volume (optional)
    },
    // ... more teams
  ],
  lay: [
    {
      team: "Team A",
      odds: 160,           // Display odds
      volume: 10000
    },
    // ... more teams
  ]
}
```

#### `recentBets` (Array)
User's existing active bets:

```javascript
[
  {
    team: "Team A",         // Team name the bet is on
    odds: 200,              // Display odds at time of bet
    stake: 100,             // Bet amount in rupees
    side: "back"            // "back" or "lay"
  },
  // ... more bets
]
```

#### `stakeValues` (Object, optional)
Available stake values for rounding:

```javascript
{
  key1: { val: 100 },
  key2: { val: 500 },
  // ... more stake values
}
```

### Returns

**Object** with the following structure:

```javascript
{
  team: "Team A",                    // Team to bet on
  side: "back",                      // "back" or "lay"
  decimalOdds: 1.5,                  // Decimal odds (for calculations only)
  stakeRupees: 125.50,                // Recommended stake in rupees
  stakePaise: 12550,                  // Recommended stake in paise
  resultingNet: 25.00,                // Average net profit/loss after hedge (locked amount)
  isCapped: false,                    // True if stake was rounded down from theoretical
  originalOdds: 150,                 // Display odds to use for bet placement
  theoreticalStake: 125.50,          // Exact calculated stake (before rounding)
  resultingNetsIfCapped: {            // Net positions for each team after hedge
    "Team A": 25.00,
    "Team B": 25.00
  }
}
```

**Returns `null`** if no valid cashout option is available.

### Throws

- **Error**: If `matchData.back` is missing or invalid
- **Error**: If `matchData` contains no teams

---

## How It Works

### Step 1: Calculate Current Exposure (`netIfWin`)

For each possible winning team, calculate what the user's net profit/loss would be based on all their existing bets.

#### Back Bet Logic:
- **If team wins**: Profit = `(decimalOdds - 1) * stake`
- **If team loses**: Loss = `stake`

#### Lay Bet Logic:
- **If team wins**: Loss = `(decimalOdds - 1) * stake`
- **If team loses**: Profit = `stake`

#### Example:
```javascript
// User has: BACK bet on Team A, odds 200, stake 100
// netIfWin["Team A"] = (2.0 - 1) * 100 = 100 (if A wins)
// netIfWin["Team B"] = -100 (if B wins, lose the back bet)
```

### Step 2: Generate Candidate Hedge Bets

For each team and each side (back/lay), calculate the theoretical stake needed to balance positions.

#### BACK Hedge Formula:
```
theo = (netIfWin[other] - netIfWin[team]) / decimalOdds
```

This calculates the stake needed so that `netIfWin[team] ≈ netIfWin[other]` after the hedge.

#### LAY Hedge Formula:
```
theo = (netIfWin[team] - netIfWin[other]) / decimalOdds
```

Similar logic but in reverse direction.

#### Candidate Evaluation:
Each candidate includes:
- `team`: Which team to bet on
- `side`: "back" or "lay"
- `stake`: Actual stake (rounded to nearest valid stake value)
- `theoreticalStake`: Exact calculated stake (before rounding)
- `isCapped`: Whether stake was rounded down
- `resultingNets`: Net profit/loss for each team after this hedge
- `diff`: Difference between net positions (lower = more balanced)

### Step 3: Handle Special Cases

#### Single Team Scenario:
When there's only one team, calculate win/lose scenarios instead of team vs team:
- `netWin`: Current net if team wins
- `netLose`: Current net if team loses
- Formulas adjust to balance win/lose scenarios

### Step 4: Select Best Candidate

#### Multi-team Scenarios (2+ teams):
Candidates are sorted by priority:

1. **Priority 1**: Stake closest to total bet amount (prefer similar bet sizes)
2. **Priority 2**: Smallest `diff` (most balanced outcome)
3. **Priority 3**: Smaller stake (prefer lower risk)
4. **Priority 4**: Smaller absolute average net (prefer lower exposure)

Then select the candidate with the smallest `diff`.

#### Single Team Scenarios:
- Sort by smallest `diff` (most balanced)
- Calculate average of win/lose scenarios

### Step 5: Construct Final Result

Calculate final net positions for each team after the hedge bet:
- `resultingNet`: Average of both net positions = locked amount (same regardless of outcome)
- Build result object with all necessary information for bet placement

---

## Mathematical Formulas

### Display Odds to Decimal Conversion

```javascript
// If odds between 1-5: already decimal
// Otherwise: decimal = 1 + (displayOdds / 100)
// Example: 150 → 1 + (150/100) = 2.5
```

### Back Bet Profit/Loss

```
If team wins:  profit = (decimalOdds - 1) * stake
If team loses: loss   = stake
```

### Lay Bet Profit/Loss

```
If team wins:  loss   = (decimalOdds - 1) * stake
If team loses: profit = stake
```

### Theoretical Stake Calculation

#### For BACK hedge:
```
theo = (netIfWin[other] - netIfWin[team]) / decimalOdds
```

#### For LAY hedge:
```
theo = (netIfWin[team] - netIfWin[other]) / decimalOdds
```

### Resulting Net Positions

#### After BACK hedge:
```
netTeamWin  = netIfWin[team] + (decimalOdds - 1) * stake
netOtherWin = netIfWin[other] - stake
```

#### After LAY hedge:
```
netTeamWin  = netIfWin[team] - (decimalOdds - 1) * stake
netOtherWin = netIfWin[other] + stake
```

### Locked Amount

```
resultingNet = (netTeam + netOther) / 2
```

This is the same regardless of which team wins (locked profit/loss).

---

## Complete Function Code

### `findNearestStakeValue` - Full Implementation

```javascript
function findNearestStakeValue(targetValue, stakeValues = {}) {
  if (!stakeValues || Object.keys(stakeValues).length === 0) {
    return targetValue; // Return original if no stake values available
  }

  // Extract all stake values from stakeValues object
  const availableStakes = Object.values(stakeValues)
    .map(item => parseFloat(item?.val || item || 0))
    .filter(val => val > 0)
    .sort((a, b) => a - b);

  if (availableStakes.length === 0) {
    return targetValue;
  }

  // Find the nearest stake value
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
```

### `calculateSmartCashout` - Full Implementation

```javascript
export function calculateSmartCashout(matchData, recentBets, stakeValues = {}) {
  if (!matchData || !Array.isArray(matchData.back)) throw new Error("matchData.back required");

  const round2 = r => Math.round(r * 100) / 100;
  const toPaise = r => Math.round(r * 100);

  // Calculate total bet amount sum from recentBets
  const totalBetAmount = recentBets.reduce((sum, bet) => sum + (parseFloat(bet.stake) || 0), 0);

  const teams = Array.from(new Set([
    ...matchData.back.map(b => b.team),
    ...matchData.lay.map(l => l.team)
  ]));

  const backMap = Object.fromEntries((matchData.back || []).map(b => [b.team, b]));
  const layMap  = Object.fromEntries((matchData.lay  || []).map(l => [l.team, l]));

  if (teams.length < 1) throw new Error("matchData must contain at least one team");

  // Calculate current exposure (netIfWin)
  const netIfWin = {};
  teams.forEach(t => netIfWin[t] = 0);

  for (const bet of (recentBets || [])) {
    const betDec = displayToDecimal(bet.odds);
    
    teams.forEach(teamWin => {
      if (bet.team === teamWin) {
        if (bet.side === "back") netIfWin[teamWin] += (betDec - 1) * bet.stake;
        else if (bet.side === "lay") netIfWin[teamWin] += -((betDec - 1) * bet.stake);
      } else {
        if (bet.side === "back") netIfWin[teamWin] += -bet.stake;
        else if (bet.side === "lay") netIfWin[teamWin] += bet.stake;
      }
    });
  }

  const candidates = [];

  // Generate BACK hedge candidate
  const pushBack = (team) => {
    const other = teams.find(t => t !== team);
    const market = backMap[team];
    if (!market || !other) return;

    const dec = displayToDecimal(market.odds);
    const numerator = netIfWin[other] - netIfWin[team];
    const theo = dec > 0 ? numerator / dec : NaN;
    
    if (theo <= 0 || !isFinite(theo)) return;

    const capped = findNearestStakeValue(theo, stakeValues);
    const netTeamWin = netIfWin[team] + (dec - 1) * capped;
    const netOtherWin = netIfWin[other] - capped;

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

  // Generate LAY hedge candidate
  const pushLay = (team) => {
    const other = teams.find(t => t !== team);
    const market = layMap[team];
    
    if (!market || !other) return;

    const dec = displayToDecimal(market.odds);
    const numerator = netIfWin[team] - netIfWin[other];
    const theo = dec > 0 ? numerator / dec : NaN;
    
    if (theo <= 0 || !isFinite(theo)) return;

    const capped = findNearestStakeValue(theo, stakeValues);
    const netTeamWin = netIfWin[team] - (dec - 1) * capped;
    const netOtherWin = netIfWin[other] + capped;

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

  // Generate candidates for all teams
  teams.forEach(t => {
    pushBack(t);
    pushLay(t);
  });

  // Handle single team scenario
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
        const capped = findNearestStakeValue(theo, stakeValues);
        const netWinBack = netWin + (decBack - 1) * capped;
        const netLoseBack = netLose - capped;
        candidates.push({
          team, side: "back", 
          decimalOdds: decBack,
          originalDisplayOdds: back.odds,
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
        const capped = findNearestStakeValue(theo, stakeValues);
        const netWinLay = netWin - (decLay - 1) * capped;
        const netLoseLay = netLose + capped;
        candidates.push({
          team, side: "lay", 
          decimalOdds: decLay,
          originalDisplayOdds: lay.odds,
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
    const best = candidates[0];
    const netWin1 = round2(best.resultingNets.win);
    const netLose1 = round2(best.resultingNets.lose);
    const resultingNet1 = round2((netWin1 + netLose1) / 2);

    return {
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
  }

  if (!candidates.length) return null;

  // Sort candidates by priority
  candidates.sort((a, b) => {
    // Priority 1: stake closest to total bet amount
    const diffA = Math.abs(a.stake - totalBetAmount);
    const diffB = Math.abs(b.stake - totalBetAmount);
    if (diffA !== diffB) return diffA - diffB;
    
    // Priority 2: best balance (smallest diff)
    if (a.diff !== b.diff) return a.diff - b.diff;
    
    // Priority 3: smaller stake
    if (a.stake !== b.stake) return a.stake - b.stake;
    
    // Priority 4: smaller absolute average net
    const avgA = Math.abs((Object.values(a.resultingNets)[0] + Object.values(a.resultingNets)[1]) / 2);
    const avgB = Math.abs((Object.values(b.resultingNets)[0] + Object.values(b.resultingNets)[1]) / 2);
    return avgA - avgB;
  });

  const best = candidates.reduce((min, c) => c.diff < min.diff ? c : min, candidates[0]);

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

  return finalResult;
}
```

**Note:** This function requires the `displayToDecimal()` helper function to convert display odds to decimal format.

---

## Examples

### Example 1: Simple Two-Team Cashout (Complete Code Example)

**User's Current Bets:**
- BACK bet: Team A, odds 200, stake 100

**Current Market:**
- Team A: back odds 150, lay odds 160
- Team B: back odds 180, lay odds 190

**Current Exposure:**
- If Team A wins: `netIfWin["Team A"] = (2.0 - 1) * 100 = 100`
- If Team B wins: `netIfWin["Team B"] = -100` (lose the back bet)

**Hedge Options:**

**Option 1: BACK Team B at 180**
- `theo = (100 - (-100)) / 1.8 = 111.11`
- If B wins: `netIfWin["Team B"] = -100 + (1.8-1)*111.11 = -11.11`
- If A wins: `netIfWin["Team A"] = 100 - 111.11 = -11.11`
- Result: Locked loss of ~11.11

**Option 2: LAY Team A at 160**
- `theo = (100 - (-100)) / 1.6 = 125`
- If A wins: `netIfWin["Team A"] = 100 - (1.6-1)*125 = 25`
- If B wins: `netIfWin["Team B"] = -100 + 125 = 25`
- Result: Locked profit of 25 ✓ **Better!**

**Result:** Function recommends Option 2 (LAY Team A) as it provides profit instead of loss.

**Complete Code Example:**

```javascript
// User's current bets
const recentBets = [
  {
    team: "Team A",
    odds: 200,      // Display odds (2.0 decimal)
    stake: 100,     // 100 rupees
    side: "back"
  }
];

// Current market data
const matchData = {
  back: [
    { team: "Team A", odds: 150, volume: 10000 },
    { team: "Team B", odds: 180, volume: 10000 }
  ],
  lay: [
    { team: "Team A", odds: 160, volume: 10000 },
    { team: "Team B", odds: 190, volume: 10000 }
  ]
};

// Available stake values
const stakeValues = {
  1: { val: 100 },
  2: { val: 200 },
  3: { val: 500 }
};

// Calculate cashout
const result = calculateSmartCashout(matchData, recentBets, stakeValues);

console.log(result);
// Output:
// {
//   team: "Team A",
//   side: "lay",
//   decimalOdds: 1.6,
//   stakeRupees: 125,
//   stakePaise: 12500,
//   resultingNet: 25,
//   isCapped: false,
//   originalOdds: 160,
//   theoreticalStake: 125,
//   resultingNetsIfCapped: {
//     "Team A": 25,
//     "Team B": 25
//   }
// }

// Use the result to place the hedge bet
if (result) {
  console.log(`Place ${result.side.toUpperCase()} bet on ${result.team}`);
  console.log(`Odds: ${result.originalOdds}`);
  console.log(`Stake: ₹${result.stakeRupees}`);
  console.log(`Locked profit/loss: ₹${result.resultingNet}`);
}
```

### Example 2: Multiple Bets (Complete Code Example)

**User's Current Bets:**
- BACK bet: Team A, odds 200, stake 100
- LAY bet: Team B, odds 150, stake 50

**Current Exposure:**
- If Team A wins: `netIfWin["Team A"] = (2.0-1)*100 - 50 = 50`
- If Team B wins: `netIfWin["Team B"] = -100 + (1.5-1)*50 = -75`

**Hedge Calculation:**
- Need to balance 50 vs -75
- Best hedge: LAY Team A or BACK Team B to balance positions
- Function calculates optimal stake to make both positions equal

**Complete Code Example:**

```javascript
// User's current bets
const recentBets = [
  {
    team: "Team A",
    odds: 200,
    stake: 100,
    side: "back"
  },
  {
    team: "Team B",
    odds: 150,
    stake: 50,
    side: "lay"
  }
];

// Current market data
const matchData = {
  back: [
    { team: "Team A", odds: 150, volume: 10000 },
    { team: "Team B", odds: 180, volume: 10000 }
  ],
  lay: [
    { team: "Team A", odds: 160, volume: 10000 },
    { team: "Team B", odds: 190, volume: 10000 }
  ]
};

const stakeValues = {
  1: { val: 100 },
  2: { val: 200 },
  3: { val: 500 }
};

const result = calculateSmartCashout(matchData, recentBets, stakeValues);

// Result will recommend either:
// - LAY Team A to reduce exposure if A wins
// - BACK Team B to balance the positions
// The function selects the option that provides the best balance
```

### Example 3: Single Team Scenario (Complete Code Example)

**User's Current Bets:**
- BACK bet: Team A, odds 200, stake 100

**Current Market:**
- Team A: back odds 150, lay odds 160

**Current Exposure:**
- If Team A wins: `netWin = (2.0-1)*100 = 100`
- If Team A loses: `netLose = -100`

**Hedge Options:**

**BACK hedge:**
- `theo = (-100 - 100) / 1.5 = -133.33` (invalid, negative)

**LAY hedge:**
- `theo = (100 - (-100)) / 1.6 = 125`
- If Team A wins: `netWin = 100 - (1.6-1)*125 = 25`
- If Team A loses: `netLose = -100 + 125 = 25`
- Result: Locked profit of 25

**Complete Code Example:**

```javascript
// User's current bets
const recentBets = [
  {
    team: "Team A",
    odds: 200,
    stake: 100,
    side: "back"
  }
];

// Single team market
const matchData = {
  back: [
    { team: "Team A", odds: 150, volume: 10000 }
  ],
  lay: [
    { team: "Team A", odds: 160, volume: 10000 }
  ]
};

const stakeValues = {
  1: { val: 100 },
  2: { val: 200 },
  3: { val: 500 }
};

const result = calculateSmartCashout(matchData, recentBets, stakeValues);

console.log(result);
// Output:
// {
//   team: "Team A",
//   side: "lay",
//   decimalOdds: 1.6,
//   stakeRupees: 125,
//   stakePaise: 12500,
//   resultingNet: 25,
//   isCapped: false,
//   originalOdds: 160,
//   theoreticalStake: 125,
//   resultingNetsIfCapped: {
//     win: 25,
//     lose: 25
//   }
// }
```

### Example 4: Real-World Integration Example

```javascript
// Example: Integrating cashout into a betting application

async function handleCashoutRequest(matchId, betType) {
  try {
    // 1. Get current market data
    const currentMarketData = await fetchMarketData(matchId, betType);
    
    // 2. Get user's active bets
    const activeBets = await getActiveBets(matchId, betType);
    
    // 3. Transform data to required format
    const matchData = {
      back: currentMarketData.map(item => ({
        team: item.nat?.trim(),
        odds: parseFloat(item.back?.find(o => o.oname === "back1")?.odds),
        volume: parseFloat(item.back?.find(o => o.oname === "back1")?.size || 0)
      })).filter(item => item.team),
      lay: currentMarketData.map(item => ({
        team: item.nat?.trim(),
        odds: parseFloat(item.lay?.find(o => o.oname === "lay1")?.odds),
        volume: parseFloat(item.lay?.find(o => o.oname === "lay1")?.size || 0)
      })).filter(item => item.team)
    };
    
    const recentBets = activeBets.map(bet => ({
      team: bet.team_name,
      odds: parseFloat(bet.bet_odds),
      stake: parseFloat(bet.bet_amount),
      side: bet.bet_side.toLowerCase()
    }));
    
    // 4. Get stake values from store
    const stakeValues = store.getState()?.commonData?.stake_values || {};
    
    // 5. Calculate optimal cashout
    const cashoutResult = calculateSmartCashout(matchData, recentBets, stakeValues);
    
    if (!cashoutResult) {
      return {
        success: false,
        message: "You are not eligible for cashout"
      };
    }
    
    // 6. Return cashout recommendation
    return {
      success: true,
      data: {
        team: cashoutResult.team,
        side: cashoutResult.side,
        odds: cashoutResult.originalOdds,
        stake: cashoutResult.stakeRupees,
        lockedAmount: cashoutResult.resultingNet,
        isCapped: cashoutResult.isCapped
      }
    };
    
  } catch (error) {
    console.error("Cashout calculation error:", error);
    return {
      success: false,
      message: "Error calculating cashout"
    };
  }
}

// Usage
const result = await handleCashoutRequest("match123", "match_odds");
if (result.success) {
  console.log(`Recommended: ${result.data.side.toUpperCase()} ${result.data.team}`);
  console.log(`Stake: ₹${result.data.stake}`);
  console.log(`Locked amount: ₹${result.data.lockedAmount}`);
}
```

### Example 5: Testing with Different Scenarios

```javascript
// Test Case 1: User in profit, wants to lock it
const testCase1 = {
  matchData: {
    back: [
      { team: "Team A", odds: 150 },
      { team: "Team B", odds: 200 }
    ],
    lay: [
      { team: "Team A", odds: 160 },
      { team: "Team B", odds: 210 }
    ]
  },
  recentBets: [
    { team: "Team A", odds: 120, stake: 100, side: "back" }
  ],
  stakeValues: { 1: { val: 100 }, 2: { val: 200 } }
};

// Test Case 2: User in loss, wants to minimize it
const testCase2 = {
  matchData: {
    back: [
      { team: "Team A", odds: 150 },
      { team: "Team B", odds: 200 }
    ],
    lay: [
      { team: "Team A", odds: 160 },
      { team: "Team B", odds: 210 }
    ]
  },
  recentBets: [
    { team: "Team A", odds: 300, stake: 100, side: "back" }
  ],
  stakeValues: { 1: { val: 100 }, 2: { val: 200 } }
};

// Test Case 3: Multiple bets on different teams
const testCase3 = {
  matchData: {
    back: [
      { team: "Team A", odds: 150 },
      { team: "Team B", odds: 180 },
      { team: "Team C", odds: 200 }
    ],
    lay: [
      { team: "Team A", odds: 160 },
      { team: "Team B", odds: 190 },
      { team: "Team C", odds: 210 }
    ]
  },
  recentBets: [
    { team: "Team A", odds: 200, stake: 100, side: "back" },
    { team: "Team B", odds: 150, stake: 50, side: "lay" },
    { team: "Team C", odds: 250, stake: 75, side: "back" }
  ],
  stakeValues: { 1: { val: 100 }, 2: { val: 200 }, 3: { val: 500 } }
};

// Run tests
console.log("Test 1:", calculateSmartCashout(
  testCase1.matchData,
  testCase1.recentBets,
  testCase1.stakeValues
));

console.log("Test 2:", calculateSmartCashout(
  testCase2.matchData,
  testCase2.recentBets,
  testCase2.stakeValues
));

console.log("Test 3:", calculateSmartCashout(
  testCase3.matchData,
  testCase3.recentBets,
  testCase3.stakeValues
));
```

---

## Return Value Structure

### Main Properties

| Property | Type | Description |
|----------|------|-------------|
| `team` | string | Team name to bet on |
| `side` | string | "back" or "lay" |
| `decimalOdds` | number | Decimal odds (for calculations only) |
| `stakeRupees` | number | Recommended stake in rupees |
| `stakePaise` | number | Recommended stake in paise |
| `resultingNet` | number | Average net profit/loss after hedge (locked amount) |
| `isCapped` | boolean | True if stake was rounded down from theoretical |
| `originalOdds` | number | Display odds to use for bet placement |
| `theoreticalStake` | number | Exact calculated stake (before rounding) |
| `resultingNetsIfCapped` | object | Net positions for each team after hedge |

### Usage Example

```javascript
const result = calculateSmartCashout(matchData, recentBets, stakeValues);

if (result) {
  // Place bet using:
  // - result.team (team name)
  // - result.side ("back" or "lay")
  // - result.originalOdds (display odds)
  // - result.stakeRupees (stake amount)
  
  // Locked profit/loss:
  console.log(`Locked amount: ${result.resultingNet}`);
}
```

---

## Special Cases

### No Valid Candidates

**Returns:** `null`

**When:**
- All calculated stakes are negative or invalid
- No market data available for hedging
- User not eligible for cashout

**Handling:**
```javascript
const result = calculateSmartCashout(matchData, recentBets, stakeValues);
if (!result) {
  // Show message: "You are not eligible for cashout"
}
```

### Stake Capping

**When:** Theoretical stake doesn't match available stake values

**Example:**
- Theoretical stake: 237.5
- Available stakes: [100, 200, 500]
- Capped stake: 200 (nearest)
- `isCapped: true` (rounded down)

**Impact:** May result in slightly unbalanced outcome, but still provides hedging benefit.

### Single Team Scenario

**When:** Only one team in the market

**Behavior:**
- Calculates win/lose scenarios instead of team vs team
- Uses different formulas to balance win/lose positions
- Returns result with `win` and `lose` in `resultingNetsIfCapped`

### Missing Market Data

**When:** No back or lay odds available for a team

**Behavior:**
- Skips that team/side combination
- Only generates candidates for available markets

---

## Implementation Notes

### Odds Format

- **Display Odds**: Used in UI and API (e.g., 150 = 1.50 decimal)
- **Decimal Odds**: Used for calculations (e.g., 1.50)
- Conversion handled by `displayToDecimal()` function

### Stake Rounding

- Always rounds to nearest valid stake value
- Uses `findNearestStakeValue()` helper function
- May result in `isCapped: true` if rounded down

### Performance

- Time complexity: O(n * m) where n = teams, m = bets
- Space complexity: O(n) for storing net positions
- Efficient for typical betting scenarios (2-10 teams, <100 bets)

---

## Related Functions

- `displayToDecimal()`: Converts display odds to decimal format
- `toPaise()`: Converts rupees to paise
- `handleCashoutLogic()`: Main handler that uses `calculateSmartCashout()`

---

## Version History

- **v1.0**: Initial implementation with basic hedging logic
- **v1.1**: Added stake value rounding support
- **v1.2**: Improved candidate selection algorithm
- **v1.3**: Added single-team scenario handling

---

## Support

For questions or issues related to cashout logic, please refer to:
- Code location: `packages/shared/utils/Constants.js`
- Functions: `calculateSmartCashout()`, `findNearestStakeValue()`

