import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const SportsResultContent = ({ 
  resultData, 
  requestData, 
  allBets = [] 
}) => {
  const [betFilter, setBetFilter] = useState('all');
  const [filteredBets, setFilteredBets] = useState([]);
  const [showBrowserDetails, setShowBrowserDetails] = useState(null);

  // Filter bets based on selected filter
  useEffect(() => {
    if (betFilter === 'all') {
      setFilteredBets(allBets);
    } else if (betFilter === 'back') {
      setFilteredBets(allBets.filter(bet => bet.bet_side === 'BACK'));
    } else if (betFilter === 'lay') {
      setFilteredBets(allBets.filter(bet => bet.bet_side === 'LAY'));
    }
  }, [betFilter, allBets]);

  const sportData = requestData?.sport_data || {};
  const fancyResult = requestData?.fancy_result || {};
  const gameData = requestData?.game_data || 'Cricket';

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get winner information
  const getWinnerInfo = () => {
    
    if (sportData.bet_type?.toLowerCase() === 'session') {
      return fancyResult.result || 'N/A';
    }
    return sportData.team_name || sportData.winner || 'N/A';
  };

  // Get team name for display
  const getTeamName = (bet) => {
    if (sportData.bet_type?.toLowerCase() === 'fancy_session') {
      return fancyResult.fancyName || 'N/A';
    }
    try {
      const resultData = JSON.parse(bet.result || '{}');
      return resultData.team_name || 'N/A';
    } catch {
      return 'N/A';
    }
  };

  // Get odds for display
  const getOdds = (bet) => {
    if (sportData.type?.toLowerCase() === 'fancy_session') {
      return bet.bet_odds || 'N/A';
    }
    return bet.bet_odds || 'N/A';
  };

  // Get bhav (result) for display
  const getBhav = (bet) => {

    if (sportData.type?.toLowerCase() === 'fancy_session') {
      return bet.bet_oddsk || '-';
    }
    return '-';
    
  };

  // Get win amount with proper formatting
  const getWinAmount = (bet) => {
    try {
      const resultData = JSON.parse(bet.result || '{}');
      
      const winAmount = resultData.win_amount;
      
      if (winAmount === 'N/A' || !isNumeric(winAmount)) {
        return <span>{winAmount || 'N/A'}</span>;
      }
      
      if (winAmount < 0) {
        return <span className="text-danger">{winAmount}</span>;
      } else {
        return <span className="text-success">{winAmount}</span>;
      }
    } catch {
      return <span>N/A</span>;
    }
  };

  // Check if value is numeric
  const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  // Calculate total amount
  

  // Get bet row class
  const getBetRowClass = (bet) => {
    if (bet.type === 'ODDEVEN') return 'back';
    if (bet.bet_side === 'BACK') return 'back';
    if (bet.bet_side === 'LAY') return 'lay';
    return 'back';
  };

  // Show browser details popup
  const showBrowserDetailsPopup = (browserDetails) => {
    setShowBrowserDetails(browserDetails);
  };

  // Hide browser details popup
  const hideBrowserDetailsPopup = () => {
    setShowBrowserDetails(null);
  };

              

  const map_session = {
    'FANCY_SESSION' : 'Normal',
    'BALL_BY_BALL' : 'Ball by Ball',
    'OVER_BY_OVER' : 'Over by Over',
    'ODDEVEN' : 'Odd Even',
    'fancy1' : 'Fancy 1',
    'BOOKMAKER' : 'Bookmaker',
    'TOSS' : 'Toss',
    'ODDS' : 'MATCH_ODDS',
    'MATCH_ODDS' : 'Match Odds',
    'cup' : "CPL_CUP_BOOKMAKER"
  }
  return (
    <>
      {/* Sports Header */}
      <div className="sports-header" style={{ marginBottom: '20px' }}>
        <div className="sports-breadcrumb" style={{
          color: '#666',
          fontSize: '14px',
          marginBottom: '15px'
        }}>
          {sportData.sport_name || 'Cricket'} → {gameData} → {sportData.match_name || 'Match Name'} → {map_session[sportData.type] || 'Over By Over'}
        </div>
        
        <div className="sports-info" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px'
        }}>
          <div className="winner-info" style={{ fontSize: '16px', fontWeight: '500' }}>
            <strong>Winner:</strong> {getWinnerInfo()}
          </div>
          
          <div className="game-details" style={{ textAlign: 'right' }}>
            <div className="game-time" style={{ marginBottom: '5px', fontSize: '14px' }}>
              <strong>Game Time:</strong> {formatDate(sportData.created_at)}
            </div>
            <div className="betting-summary" style={{ fontSize: '14px' }}>
              Total Bets: {allBets.length} {" "}
              Total Amount:{" "}
              <span
                className={`me-2 ${
                  (requestData.all_bets.reduce(
                    (sum, bet) => sum + (parseFloat(bet.win) || 0),
                    0
                  ) || 0) < 0
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {requestData.all_bets
                  .reduce((sum, bet) => sum + (parseFloat(bet.win) || 0), 0)
                  .toFixed(2)}
              </span>
               
            </div>
          </div>
        </div>
      </div>

      {/* Bet Type Filters */}
      <div className="bet-filters mb-3" style={{ marginBottom: '20px' }}>
        <div className="form-check form-check-inline" style={{ marginRight: '15px' }}>
          <input
            className="form-check-input"
            type="radio"
            name="betFilter"
            id="filterAll"
            value="all"
            checked={betFilter === 'all'}
            onChange={(e) => setBetFilter(e.target.value)}
          />
          <label className="form-check-label" htmlFor="filterAll">All</label>
        </div>
        <div className="form-check form-check-inline" style={{ marginRight: '15px' }}>
          <input
            className="form-check-input"
            type="radio"
            name="betFilter"
            id="filterBack"
            value="back"
            checked={betFilter === 'back'}
            onChange={(e) => setBetFilter(e.target.value)}
          />
          <label className="form-check-label" htmlFor="filterBack">Back</label>
        </div>
        <div className="form-check form-check-inline" style={{ marginRight: '15px' }}>
          <input
            className="form-check-input"
            type="radio"
            name="betFilter"
            id="filterLay"
            value="lay"
            checked={betFilter === 'lay'}
            onChange={(e) => setBetFilter(e.target.value)}
          />
          <label className="form-check-label" htmlFor="filterLay">Lay</label>
        </div>
      </div>

      {/* Sports Bets Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped" id="sports-bets-table">
          <thead className="thead-dark">
            <tr>
              <th>Nation</th>
              <th>Rate</th>
              <th>Bhav</th>
              <th>Amount</th>
              <th>Win</th>
              <th>Date</th>
              <th>IP Address</th>
              <th>Browser Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredBets.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No bets found for the selected filter.</td>
              </tr>
            ) : (
              filteredBets.map((bet, index) => (
                <tr 
                  key={bet.id} 
                  className={getBetRowClass(bet)}
                  data-bet-id={bet.id}
                  style={{
                    backgroundColor: getBetRowClass(bet) === 'lay' ? '#f8f9fa' : 'white'
                  }}
                >
                  <td>{getTeamName(bet)}</td>
                  <td>{getOdds(bet)}</td>
                  <td>{getBhav(bet)}</td>
                  <td>{bet.bet_amount || 'N/A'}</td>
                  <td>{getWinAmount(bet)}</td>
                  <td>{formatDate(bet.created_at)}</td>
                  <td>{bet.ip_address || 'N/A'}</td>
                  <td>
                    <a
                      href="#"
                      className="browser-detail-link"
                      onClick={(e) => {
                        e.preventDefault();
                        showBrowserDetailsPopup(bet.browser_details);
                      }}
                      style={{
                        color: '#007bff',
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} /> Detail
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Browser Details Popup */}
      {showBrowserDetails && (
        <div className="browser-details-popup" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#000',
          color: '#fff',
          padding: '20px',
          borderRadius: '8px',
          fontSize: '12px',
          maxWidth: '400px',
          zIndex: 10000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h6 style={{ margin: 0, color: '#fff' }}>Browser Details</h6>
            <button
              onClick={hideBrowserDetailsPopup}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
            {showBrowserDetails}
          </div>
        </div>
      )}
    </>
  );
};

export default SportsResultContent;
