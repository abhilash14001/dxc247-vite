import React, { useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setOddsData, selectMatchOdds } from "../store/slices/oddsDataSlice";

const SportsDataTable = ({
  activeTab,
  listData,
  BackAndLayForSports,
  isHomeTabPages = false,
  matchParam = null,
  formatDateTime = null,
}) => {
  const dispatch = useDispatch();
  const oddsDataState = useSelector((state) => state.oddsData);
  const debounceTimeoutRef = useRef(null);
  const lastDataRef = useRef(null);

  // Debounced function to update Redux (only when data actually changes)
  const debouncedUpdateOddsData = useCallback(
    (newListData) => {
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

          dispatch(setOddsData({ activeTab, listData: newListData }));
        }
      }, 500); // 500ms debounce
    },
    [activeTab]
  );

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
  }, [listData, debouncedUpdateOddsData, activeTab]);

  const getSportRoute = (sportType) => {
    if (isHomeTabPages && matchParam) {
      return matchParam;
    }

    switch (sportType) {
      case "Cricket":
        return "cricket";
      case "Tennis":
        return "tennis";
      case "Football":
        return "soccer";
      default:
        return "cricket";
    }
  };

  // Memoized selector for better performance - now uses sport-specific storage
  const getOddsDataForMatch = useCallback(
    (matchId) => {
      return selectMatchOdds(oddsDataState, activeTab, matchId);
    },
    [oddsDataState, activeTab]
  );

  // Helper function to get property value with API fallback
  const getPropertyValue = useCallback(
    (sport, sportProperty, apiProperty) => {
      let value = sport?.[sportProperty] || 0;

      // Check if we have API data for this match from Redux
      const apiData = getOddsDataForMatch(sport.match_id);
      if (apiData && apiData[apiProperty] !== undefined) {
        value = apiData[apiProperty] == true ? 1 : 0;
      }

      return value;
    },
    [getOddsDataForMatch]
  );

  const renderGameIcons = (oddsData) => {
    
    const isPlay = Object.keys(oddsData).length > 0 ? (oddsData.iplay == true ? 1 :0) : 0;
    const isTv = Object.keys(oddsData).length > 0 ? (oddsData.tv == true ? 1 : 0): 0;
    const isFancy = Object.keys(oddsData).length > 0 ? (oddsData.f == true ? 1 : 0) :0;
    const isBookmaker = Object.keys(oddsData).length > 0 ? (oddsData.bm == true ? 1 : 0)  :0;

    return (
      <div className="game-icons">
        <div className="game-icon">
          {isPlay !== 0 && <span className="active"></span>}
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

  const renderOddsButtons = useCallback(
    (oddsData, matchId, sportType, sport) => {
      // Get odds data from Redux with memoization

      const {
        Back1,
        Lay1,
        Back2,
        Lay2,
        BackX,
        LayX,
        Back1Suspended,
        Back2Suspended,
        BackXSuspended,
      } = BackAndLayForSports(oddsData, sport);

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
                <b>{Back1?.[matchId] ?? "-"}</b>
              </span>
            </div>
            <div className="lay odd-box">
              <span className="bet-odd">
                <b>{Lay1?.[matchId] ?? "-"}</b>
              </span>
            </div>
          </div>
          <div className={`bet-nation-odd ${BackXSuspended?.[matchId] ?? ""}`}>
            <div className="back odd-box">
              <span className="bet-odd">
                <b>{BackX?.[matchId] ?? "-"}</b>
              </span>
            </div>
            <div className="lay odd-box">
              <span className="bet-odd">
                <b>{LayX?.[matchId] ?? "-"}</b>
              </span>
            </div>
          </div>
          <div className={`bet-nation-odd ${Back2Suspended?.[matchId] ?? ""}`}>
            <div className="back odd-box">
              <span className="bet-odd">
                <b>{Back2?.[matchId] ?? "-"}</b>
              </span>
            </div>
            <div className="lay odd-box">
              <span className="bet-odd">
                <b>{Lay2?.[matchId] ?? "-"}</b>
              </span>
            </div>
          </div>
        </>
      );
    },
    [getOddsDataForMatch, BackAndLayForSports]
  );

  const renderSportData = () => {
    if (Object.keys(listData).length == 0) {
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
          {Object.entries(listData)
            ?.map(([index, sport]) => {
              const oddsData = getOddsDataForMatch(sport.gmid);
              return { index, sport, oddsData };
            })
            ?.filter(({ oddsData }) => Object.keys(oddsData).length > 0)
            ?.sort((a, b) => {
              // First priority: iplay = true comes first
              const aIplay = a.oddsData?.iplay === true ? 1 : 0;
              const bIplay = b.oddsData?.iplay === true ? 1 : 0;
              
              if (aIplay !== bIplay) {
                return bIplay - aIplay; // true comes first (1 - 0 = 1, so b comes before a)
              }
              
              // Second priority: sort by date and time (stime)
              const aTime = new Date(a.sport.stime).getTime();
              const bTime = new Date(b.sport.stime).getTime();
              return aTime - bTime; // Earlier dates first
            })
            ?.map(({ index, sport, oddsData }) => {
              return (
                <div key={index} className="bet-table-row">
                  <div className="bet-nation-name">
                    <Link
                      className="bet-nation-game-name"
                      to={`/${getSportRoute(activeTab)}/${sport.match_id}`}
                    >
                      <span>{sport.ename}</span>
                      <span className="d-none d-md-inline-block">
                        &nbsp;/&nbsp;
                      </span>
                      <span>
                        {isHomeTabPages && formatDateTime
                          ? formatDateTime(new Date(sport.stime))
                          : sport.stime}
                      </span>
                    </Link>
                    {renderGameIcons(oddsData)}
                  </div>
                  {renderOddsButtons(oddsData, sport.gmid, activeTab, sport)}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  return renderSportData();
};

export default SportsDataTable;
