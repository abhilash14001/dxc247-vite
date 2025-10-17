// Batch Update Script for Casino Games
// This script shows the exact changes needed for each casino file

const casinoUpdates = {
    // Desktop Casinos - Remaining to implement
    "src/Desktop/casino-games/Abj.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Lucky7eu.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Card32eu.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Ab20.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Dt202.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Dt201.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Worli2.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Worli.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/War.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Trio.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Trap.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/ThreecardJ.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Testlottery.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Teensin.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Teenmuf.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Teen9.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Teen6.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Teen20b.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Teen120.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Teen1.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Superover3.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Superover.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Race20.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Race2.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Race17.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Queen.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Poker20.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Poker.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Patti2.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Notenum.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Lucky7eu2.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Goal.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Dum10.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Dtl20.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Dt6.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Cricketv3.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Cmeter1.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Cmeter.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Cmatch20.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Btable.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Ab3.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Aaa2.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Aaa.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Teen2024.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Desktop/casino-games/Kbc.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    }
};

// Mobile Casinos - Remaining to implement
const mobileCasinoUpdates = {
    "src/Mobile/casino-games/Teen32.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Teen20.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Teen3.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Cmeter.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Baccarat.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Poker6.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Card32.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Lucky7.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Superover.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Cricketv3.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Queen.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Race20.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Race17.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Dum10.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Aaa.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Cmatch20.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Btable.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Dtl20.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Ab3.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/War.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/Worli.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    },
    
    "src/Mobile/casino-games/ThreecardJ.js": {
        import: "import {useCasinoRoundChange} from \"../../utils/useCasinoRoundChange\";",
        hook: "const { userBetData, setBetData, clearBetData } = useCasinoRoundChange(roundId)",
        placeBet: `
                    // Store bet data for round change detection
                    setBetData({
                        roundId: roundId,
                        isback: backOrLay === 'back' ? 1 : 0,
                        placeName: teamname.current,
                        odds: odds,
                        betAmount: parseFloat(stakeValue.current)
                    })`
    }
};

// Combine all updates
const allUpdates = { ...casinoUpdates, ...mobileCasinoUpdates };

console.log(`Total casino files to update: ${Object.keys(allUpdates).length}`);
console.log('Desktop Casinos:', Object.keys(casinoUpdates).length);
console.log('Mobile Casinos:', Object.keys(mobileCasinoUpdates).length);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { allUpdates, casinoUpdates, mobileCasinoUpdates };
}
