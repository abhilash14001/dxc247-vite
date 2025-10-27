import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@dxc247/shared/components/layouts/Header';
import SidebarLayout from '@dxc247/shared/components/layouts/SidebarLayout';
import Footer from '@dxc247/shared/components/layouts/Footer';

const FantasyGame = () => {
  const [activeTab, setActiveTab] = useState(0);

  const gameCategories = [
    {
      name: 'smart',
      games: [
        { name: 'JetX', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/jetx.jpg' },
        { name: 'CricketX', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/cricketx.jpg' },
        { name: 'Balloon', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/balloon.jpg' },
        { name: 'PlinkoX', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/plinkox.jpg' },
        { name: 'FootballX', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/footballx.jpg' },
        { name: 'Mine Island', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/mineisland.jpg' },
        { name: 'TowerX', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/towerx.jpg' },
        { name: 'HelicopterX', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/helicopterx.jpg' },
        { name: 'SmashX', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/smashx.jpg' },
        { name: 'RollX', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/rollx.jpg' },
        { name: 'FoxyHot20', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/foxyhot20.jpg' },
        { name: 'HunterX', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/hunterx.jpg' },
        { name: 'PlinkoJoker', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/plinkojoker.jpg' },
        { name: 'Russian Keno', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/RussianKeno.jpg' },
        { name: 'Classic Keno', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/ClassicKeno.jpg' },
        { name: 'Cappadocia', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/cappadocia.jpg' },
        { name: 'JetX3', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/jetx3.jpg' },
        { name: 'Book BF Futuria', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/bookbffuturia.jpg' },
        { name: 'Wild Sands Gods', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/wildsandgods.jpg' },
        { name: 'Tug of War', image: 'https://sitethemedata.com/casino_icons/other/ssg/xgames/tugofwar.jpg' }
      ]
    },
    {
      name: 'our',
      games: [
        { name: 'Diamonds', image: 'https://sitethemedata.com/casino_icons/other/diam11.png' },
        { name: 'Player Battle', image: 'https://sitethemedata.com/casino_icons/other/playerbattle.jpeg' },
        { name: 'Snakes and Ladders', image: 'https://sitethemedata.com/casino_icons/other/snakes-and-ladders.jpg' },
        { name: 'Rummy', image: 'https://sitethemedata.com/casino_icons/other/rummy.jpg' },
        { name: 'Ludo Club', image: 'https://sitethemedata.com/casino_icons/other/ludoclub.jpg' },
        { name: 'Ludo Lands', image: 'https://sitethemedata.com/casino_icons/other/ludo-lands.jpg' }
      ]
    },
    {
      name: 'aviator',
      games: [
        { name: 'Aviator', image: 'https://sitethemedata.com/casino_icons/other/ssg/aviator/aviator.jpg' },
        { name: 'Dice', image: 'https://sitethemedata.com/casino_icons/other/ssg/aviator/dice.jpg' },
        { name: 'Goal', image: 'https://sitethemedata.com/casino_icons/other/ssg/aviator/goal.jpg' },
        { name: 'Plinko', image: 'https://sitethemedata.com/casino_icons/other/ssg/aviator/plinko.jpg' },
        { name: 'Mines', image: 'https://sitethemedata.com/casino_icons/other/ssg/aviator/mines.jpg' },
        { name: 'Hi-Lo', image: 'https://sitethemedata.com/casino_icons/other/ssg/aviator/hi-lo.jpg' },
        { name: 'Mini Roulette', image: 'https://sitethemedata.com/casino_icons/other/ssg/aviator/mini-roulette.jpg' },
        { name: 'Hotline', image: 'https://sitethemedata.com/casino_icons/other/ssg/aviator/hotline.jpg' }
      ]
    },
    {
      name: 'pascal',
      games: [
        { name: 'Creed Roomz 1', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500000397.gif' },
        { name: 'Creed Roomz 2', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/420033108.gif' },
        { name: 'Creed Roomz 3', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500009794.gif' },
        { name: 'Creed Roomz 4', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/420014051.gif' },
        { name: 'Creed Roomz 5', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/420033385.gif' },
        { name: 'Creed Roomz 6', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/426634405.gif' },
        { name: 'Creed Roomz 7', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500000203.jpg' },
        { name: 'Creed Roomz 8', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/420032901.gif' },
        { name: 'Creed Roomz 9', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500001017.gif' },
        { name: 'Creed Roomz 10', image: 'https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/400041201.gif' }
      ]
    },
    {
      name: 'scratch',
      games: [
        { name: 'Scratch', image: 'https://sitethemedata.com/casino_icons/other/ssg/scratch/scratch.jpg' }
      ]
    },
    {
      name: 'darwin',
      games: [
        { name: 'Aviator SR', image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/AVIATSR.jpg' },
        { name: 'HZCC', image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/HZCC.jpg' },
        { name: 'BAE', image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/BAE.jpg' },
        { name: 'BAE Pairs', image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/BAEPAIRS.jpg' },
        { name: 'BAE Pairs VIP', image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/BAEPAIRSVIP.jpg' },
        { name: 'BAE VIP', image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/BAEVIP.jpg' },
        { name: 'HL', image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/HL.jpg' },
        { name: 'HL VIP', image: 'https://sitethemedata.com/casino_icons/other/darwin/darwin/HLVIP.jpg' }
      ]
    },
    {
      name: 'gemini',
      games: [
        { name: 'Up Down', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/updown.jpg' },
        { name: 'Marbles Battle Team 1v1', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/MarblesBattleTeam1v1@@Suzuka.jpg' },
        { name: 'Marbles Battle Team 5v5', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/MarblesBattleTeam5v5@@Monaco.jpg' },
        { name: 'Stand Alone Plinko GR', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/StandAlonePlinkoGR.jpg' },
        { name: 'Multi Player Multi Hilo', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/MultiPlayerMultiHilo.jpg' },
        { name: 'Multi Player Crash NE', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/MultiPlayerCrashNE.jpg' },
        { name: 'Stand Alone Limbo NE', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/StandAloneLimboNE.jpg' },
        { name: 'Stand Alone Plinko NE', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/StandAlonePlinkoNE.jpg' },
        { name: 'Bonus Bingo', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/BonusBingo.jpg' },
        { name: 'Stand Alone Hilo GR', image: 'https://sitethemedata.com/casino_icons/other/gemini1/gemini/StandAloneHiloGR.jpg' }
      ]
    },
    {
      name: 'studio21',
      games: [
        { name: 'Studio21 Game 1', image: 'https://sitethemedata.com/casino_icons/other/s21/1094.gif' },
        { name: 'Studio21 Game 2', image: 'https://sitethemedata.com/casino_icons/other/s21/1095.gif' },
        { name: 'Studio21 Game 3', image: 'https://sitethemedata.com/casino_icons/other/s21/1096.png' },
        { name: 'Studio21 Game 4', image: 'https://sitethemedata.com/casino_icons/other/s21/1097.gif' },
        { name: 'Studio21 Game 5', image: 'https://sitethemedata.com/casino_icons/other/s21/1098.gif' },
        { name: 'Studio21 Game 6', image: 'https://sitethemedata.com/casino_icons/other/s21/1100.gif' },
        { name: 'Studio21 Game 7', image: 'https://sitethemedata.com/casino_icons/other/s21/1101.gif' },
        { name: 'Studio21 Game 8', image: 'https://sitethemedata.com/casino_icons/other/s21/1102.gif' },
        { name: 'Studio21 Game 9', image: 'https://sitethemedata.com/casino_icons/other/s21/1103.gif' },
        { name: 'Studio21 Game 10', image: 'https://sitethemedata.com/casino_icons/other/s21/1110.gif' },
        { name: 'Studio21 Game 11', image: 'https://sitethemedata.com/casino_icons/other/s21/1112.gif' }
      ]
    }
  ];

  const handleGameClick = (gameName) => {
    // Handle game click - you can add navigation or game launch logic here
    // Example: navigate to game or open game modal
  };

  const handleInfoClick = (gameName, e) => {
    e.stopPropagation();
    // Handle info click - you can add game info modal here
  };

  return (
    <div className="wrapper">
      <Header />

      <div className="main-container">
        <SidebarLayout />

        <div className="center-main-container list-page own-casino-page">
          <div className="center-container">
            <div className="container-fluid container-fluid-5">
              {/* Casino Sub Tabs */}
              <div className="casino-sub-tab-list">
                <div className="casino-sub-tab nav nav-pills" id="slot-tab" role="tablist">
                  {gameCategories.map((category, index) => (
                    <div key={index} className="nav-item">
                      <button
                        className={`nav-link ${activeTab === index ? 'active' : ''}`}
                        onClick={() => setActiveTab(index)}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === index}
                      >
                        {category.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-2 tab-content">
                {gameCategories.map((category, categoryIndex) => (
                  <div
                    key={categoryIndex}
                    className={`fade tab-pane ${activeTab === categoryIndex ? 'active show' : ''}`}
                    role="tabpanel"
                    aria-labelledby={`slot-tab-${categoryIndex}`}
                  >
                    <div className="casino-list mt-2 mt-lg-0">
                      {category.games.map((game, gameIndex) => (
                        <div key={gameIndex} className="casino-list-item rect rect2">
                          <div 
                            className="casino-list-item-banner"
                            style={{ backgroundImage: `url("${game.image}")` }}
                          >
                            <div className="fancy-play">
                              <i 
                                className="fas fa-play"
                                onClick={() => handleGameClick(game.name)}
                                style={{ cursor: 'pointer' }}
                              ></i>
                              <i 
                                className="fas fa-info-circle fancy-info"
                                onClick={(e) => handleInfoClick(game.name, e)}
                                style={{ cursor: 'pointer' }}
                              ></i>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FantasyGame;
