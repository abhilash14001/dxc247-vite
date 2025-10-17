export const BackAndLayForSports = (apiData, model) => {
    // Initialize odds data for this specific match
    const matchId = model.match_id;
    let Back1 = {};
    let Lay1 = {};
    let Back2 = {};
    let Lay2 = {};
    let BackX = {};
    let LayX = {};

    
    if (apiData && Object.keys(apiData).length > 0) {
        let detailArray = apiData;

        
        if (!Array.isArray(detailArray)) {
            detailArray = [detailArray];
        }
        

        if (detailArray) {
            const gameData = detailArray[0];
            const firstGame = gameData.section[0];
            const secondGame = gameData.section[1];
            const thirdGame = gameData.section[2] || null;

            if (firstGame && firstGame.odds) {
                const firstGameOddsBack = firstGame.odds.findIndex(o => o.oname === 'back1');
                const firstGameOddsLay = firstGame.odds.findIndex(o => o.oname === 'lay1');
                
                if (firstGameOddsBack >= 0) {
                    Back1[matchId] = firstGame.odds[firstGameOddsBack]?.odds || 0;
                }
                if (firstGameOddsLay >= 0) {
                    Lay1[matchId] = firstGame.odds[firstGameOddsLay]?.odds || 0;
                }
            }

            if (secondGame && secondGame.odds) {
                const secondGameOddsBack = secondGame.odds.findIndex(o => o.oname === 'back1');
                const secondGameOddsLay = secondGame.odds.findIndex(o => o.oname === 'lay1');
                
                if (secondGameOddsBack >= 0) {
                    Back2[matchId] = secondGame.odds[secondGameOddsBack]?.odds || 0;
                }
                if (secondGameOddsLay >= 0) {
                    Lay2[matchId] = secondGame.odds[secondGameOddsLay]?.odds || 0;
                }
            }

            if (thirdGame && thirdGame.odds) {
                const thirdGameOddsBack = thirdGame.odds.findIndex(o => o.oname === 'back1');
                const thirdGameOddsLay = thirdGame.odds.findIndex(o => o.oname === 'lay1');
                
                if (thirdGameOddsBack >= 0) {
                    BackX[matchId] = thirdGame.odds[thirdGameOddsBack]?.odds || 0;
                }
                if (thirdGameOddsLay >= 0) {
                    LayX[matchId] = thirdGame.odds[thirdGameOddsLay]?.odds || 0;
                }
            }
        }

    }

    return { Back1, Lay1, Back2, Lay2, BackX, LayX };
};
