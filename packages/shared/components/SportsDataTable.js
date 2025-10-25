import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setOddsData, selectMatchOdds } from '../store/slices/oddsDataSlice';

const SportsDataTable = ({ 
    activeTab, 
    sportList, 
    listData, 
    BackAndLayForSports,
    isHomeTabPages = false,
    matchParam = null,
    formatDateTime = null
}) => {
    const dispatch = useDispatch();
    const oddsDataState = useSelector(state => state.oddsData);
    const debounceTimeoutRef = useRef(null);
    const lastDataRef = useRef(null);

    
    
    // Debounced function to update Redux (only when data actually changes)
    const debouncedUpdateOddsData = useCallback((newListData) => {
        // Clear existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        
        // Set new timeout
        debounceTimeoutRef.current = setTimeout(() => {
            // Only dispatch if data has actually changed
            const dataString = JSON.stringify(newListData);
            
            if (dataString !== lastDataRef.current) {
                lastDataRef.current = dataString;
                // Now each sport will have its own separate storage
                console.log('ilst data is ', newListData, ' active tab is ', activeTab)
                dispatch(setOddsData({ activeTab, listData: newListData }));
            }
        }, 500); // 500ms debounce
    }, [activeTab]);
    
    // Update odds data in Redux when listData changes (with debouncing)
    useEffect(() => {
        
        if (listData && Object.keys(listData).length > 0) {
            debouncedUpdateOddsData(listData);
        }
        
        // Cleanup timeout on unmount
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [listData, debouncedUpdateOddsData]);



    

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

    // Memoized selector for better performance - now uses sport-specific storage
    const getOddsDataForMatch = useCallback((matchId) => {
        return selectMatchOdds({ oddsData: oddsDataState }, activeTab, matchId);
    }, [oddsDataState, activeTab]);

    // Helper function to get property value with API fallback
    const getPropertyValue = useCallback((sport, sportProperty, apiProperty) => {
        let value = sport?.[sportProperty] || 0;
        
        // Check if we have API data for this match from Redux
        const apiData = getOddsDataForMatch(sport.match_id);
        if (apiData && apiData[apiProperty] !== undefined) {
            value = apiData[apiProperty] == true ? 1 : 0;
        }
        
        return value;
    }, [getOddsDataForMatch]);

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

    const renderOddsButtons = useCallback((matchId, sportType, sport) => {
        // Get odds data from Redux with memoization
        const oddsData = getOddsDataForMatch(matchId);
        
       

        const { Back1, Lay1, Back2, Lay2, BackX, LayX, Back1Suspended, Back2Suspended, BackXSuspended } = BackAndLayForSports(oddsData, sport);
        
        
        
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
                <div className={`bet-nation-odd ${Back1Suspended?.[matchId] ?? ""}`}>
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
                <div className={`bet-nation-odd ${BackXSuspended?.[matchId] ?? ""}`}>
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
                <div className={`bet-nation-odd ${Back2Suspended?.[matchId] ?? ""}`}>
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
    }, [getOddsDataForMatch, BackAndLayForSports]);

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
