import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const SportsDataTable = ({ 
    activeTab, 
    sportList, 
    listData, 
    BackAndLayForSports,
    isHomeTabPages = false,
    matchParam = null,
    formatDateTime = null
}) => {
    const [currentOddsData, setCurrentOddsData] = useState(null);
    // Update previous data when listData changes
    useEffect(() => {
        if (listData && Object.keys(listData).length > 0) {
            
            
            setCurrentOddsData(prev => ({
                ...prev,
                [activeTab]: listData
            }));
        }
    }, [listData, activeTab]);



    

    const getSportRoute = (sportType) => {
        if (isHomeTabPages && matchParam) {
            return matchParam;
        }
        
        switch(sportType) {
            case 'Cricket':
                return 'cricket';
            case 'Tennis':
                return 'tennis';
            case 'Football':
                return 'soccer';
            default:
                return 'cricket';
        }
    };

    // Helper function to get property value with API fallback
    const getPropertyValue = (sport, sportProperty, apiProperty) => {
        let value = sport?.[sportProperty] || 0;
        
        // Check if we have API data for this match
        if (currentOddsData && currentOddsData[activeTab]) {
            const apiData = Object.values(currentOddsData[activeTab]).find(item => item.gmid === parseInt(sport.match_id));
            if (apiData && apiData[apiProperty] !== undefined) {
                value = apiData[apiProperty] == true ? 1 : 0;
            }
        }
        
        return value;
    };

    const renderGameIcons = (sport) => {
        const isPlay = getPropertyValue(sport, 'isPlay', 'iplay');
        const isTv = getPropertyValue(sport, 'isTv', 'tv');
        const isFancy = getPropertyValue(sport, 'isFancy', 'f');
        const isBookmaker = getPropertyValue(sport, 'isBookmaker', 'bm');
        
        return (
            <div className="game-icons">
                <div className="game-icon">
                    {isPlay !== 0 && (
                        <span className="active"></span>
                    )}
                </div>
                <div className="game-icon">
                    {isTv !== 0 && <i className="fas fa-tv icon-tv"></i>}
                </div>
                <div className="game-icon">    
                    {isFancy !== 0 && (
                        <img
                            src="../img/icons/ic_fancy.png"
                            className="fancy-icon" 
                            alt="fancy" 
                        />
                    )}
                </div>
                <div className="game-icon">
                    {isBookmaker !== 0 && (
                        <img
                            src="../img/icons/ic_bm.png"
                            className="fancy-icon" 
                            alt="bookmaker" 
                        />
                    )}
                </div>
             
            </div>
        );
    };

    const renderOddsButtons = (matchId, sportType, sport) => {
        // Use currentOddsData (which includes previous data) instead of listData
        let oddsData = null;

        // First, try to get API data from currentOddsData
        if (currentOddsData && currentOddsData[activeTab]) {
            // Filter for the specific match
            const apiData = Object.values(currentOddsData[activeTab]).find(item => item.gmid === parseInt(matchId));
            if (apiData) {
                oddsData = apiData;
            }
        }
    
        // If API data not found, fallback to DB data
        if (!oddsData && sport.sport_new_data) {
            try {
                const parsedData = JSON.parse(sport.sport_new_data);
                oddsData = parsedData.listData || {};
            } catch (e) {
                oddsData = {};
            }
        }
    
        // If still nothing, create empty structure to avoid errors
        if (!oddsData) oddsData = {};
        
        const { Back1, Lay1, Back2, Lay2, BackX, LayX } = BackAndLayForSports(oddsData, sport);
        
        const isSuspended = (odds) => odds > 0 ? '' : 'suspended-box';
        const isSuspendedX = (odds) => odds > 0 ? '' : 'suspended-box11';
        
        return (
            <>
                <div className="bet-nation-odd d-xl-none">
                    <b>1</b>
                </div>
                <div className="bet-nation-odd d-xl-none">
                    <b>X</b>
                </div>
                <div className="bet-nation-odd d-xl-none">
                    <b>2</b>
                </div>
                <div className={`bet-nation-odd ${isSuspended(Back1?.[matchId])}`}>
                    <div className="back odd-box">
                        <span className="bet-odd">
                            <b>{Back1?.[matchId] ?? '-'}</b>
                        </span>
                    </div>
                    <div className="lay odd-box">
                        <span className="bet-odd">
                            <b>{Lay1?.[matchId] ?? '-'}</b>
                        </span>
                    </div>
                </div>
                <div className={`bet-nation-odd ${sportType === 'Cricket' ? isSuspendedX(BackX?.[matchId]) : isSuspended(BackX?.[matchId])}`}>
                    <div className="back odd-box">
                        <span className="bet-odd">
                            <b>{BackX?.[matchId] ?? '-'}</b>
                        </span>
                    </div>
                    <div className="lay odd-box">
                        <span className="bet-odd">
                            <b>{LayX?.[matchId] ?? '-'}</b>
                        </span>
                    </div>
                </div>
                <div className={`bet-nation-odd ${isSuspended(Back2?.[matchId])}`}>
                    <div className="back odd-box">
                        <span className="bet-odd">
                            <b>{Back2?.[matchId] ?? '-'}</b>
                        </span>
                    </div>
                    <div className="lay odd-box">
                        <span className="bet-odd">
                            <b>{Lay2?.[matchId] ?? '-'}</b>
                        </span>
                    </div>
                </div>
            </>
        );
    };

    const renderSportData = () => {
        

        if (!sportList || sportList.length === 0) {
            return <div className="norecords">No real-time records found</div>;
        }

        
        

        
        
        return (
            <div className="bet-table">
                <div className="bet-table-header">
                    <div className="bet-nation-name">
                        <b>Game</b>
                    </div>
                    <div className="bet-nation-odd">
                        <b>1</b>
                    </div>
                    <div className="bet-nation-odd">
                        <b>X</b>
                    </div>
                    <div className="bet-nation-odd">
                        <b>2</b>
                    </div>
                </div>
                <div className="bet-table-body">
                    {sportList.map((sport, index) => {
                        return (
                            <div key={index} className="bet-table-row">
                                <div className="bet-nation-name">
                                    <Link 
                                        className="bet-nation-game-name"
                                        to={`/${getSportRoute(activeTab)}/${sport.match_id}`}
                                    >
                                        <span>{sport.match_name}</span>
                                        <span className="d-none d-md-inline-block">&nbsp;/&nbsp;</span>
                                        <span>{isHomeTabPages && formatDateTime ? formatDateTime(new Date(sport.match_date_time)) : sport.match_date}</span>
                                    </Link>
                                    {renderGameIcons(sport)}
                                </div>
                                {renderOddsButtons(sport.match_id, activeTab, sport)}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };



    return (
        
            renderSportData()
        
    );
};

export default SportsDataTable;
