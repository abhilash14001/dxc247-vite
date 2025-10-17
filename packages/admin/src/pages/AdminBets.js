import React, { useState, useEffect } from 'react';
import { adminApiMethods } from './adminApi';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faEye, 
  faCheck, 
  faTimes,
  faDownload,
  faChartLine,
  faGamepad,
  faDollarSign,
  faClock,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';


function AdminBets() {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedBets, setSelectedBets] = useState([]);
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

  useEffect(() => {
    loadBets();
  }, []);

  const loadBets = async () => {
    try {
      setLoading(true);
      const response = await adminApiMethods.getBets();
      setBets(response.data || []);
    } catch (error) {
      console.error('Error loading bets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBets = bets
    .filter(bet => {
      const matchesSearch = bet.id.toString().includes(searchTerm) ||
                           bet.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bet.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bet.market.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bet.status === statusFilter;
      const matchesSport = sportFilter === 'all' || bet.sport === sportFilter;
      
      // Date filtering
      const betDate = new Date(bet.created_at);
      const now = new Date();
      let matchesDate = true;
      
      if (dateFilter === 'today') {
        matchesDate = betDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = betDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = betDate >= monthAgo;
      }
      
      return matchesSearch && matchesStatus && matchesSport && matchesDate;
    })
    .sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

  const handleSelectBet = (betId) => {
    setSelectedBets(prev => 
      prev.includes(betId) 
        ? prev.filter(id => id !== betId)
        : [...prev, betId]
    );
  };

  const handleSelectAll = () => {
    if (selectedBets.length === filteredBets.length) {
      setSelectedBets([]);
    } else {
      setSelectedBets(filteredBets.map(bet => bet.id));
    }
  };

  const handleViewBet = (bet) => {
    setSelectedBet(bet);
    setShowBetModal(true);
  };

  const handleSettleBet = (betId) => {
    if (window.confirm('Are you sure you want to settle this bet?')) {
      // Implement settle logic
      console.log('Settling bet:', betId);
    }
  };

  const handleCancelBet = (betId) => {
    if (window.confirm('Are you sure you want to cancel this bet?')) {
      // Implement cancel logic
      console.log('Cancelling bet:', betId);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      settled: 'status-settled',
      cancelled: 'status-cancelled',
      won: 'status-won',
      lost: 'status-lost'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-default'}`}>
        {status}
      </span>
    );
  };

  const getProfitLossClass = (profitLoss) => {
    if (profitLoss > 0) return 'profit';
    if (profitLoss < 0) return 'loss';
    return 'neutral';
  };

  const getSportIcon = (sport) => {
    const sportIcons = {
      cricket: 'fa-baseball',
      football: 'fa-futbol',
      tennis: 'fa-table-tennis',
      basketball: 'fa-basketball-ball',
      volleyball: 'fa-volleyball-ball',
      hockey: 'fa-hockey-puck'
    };
    
    return sportIcons[sport] || 'fa-gamepad';
  };

  if (loading) {
    return (
      <div className="admin-bets-loading">
        <div className="loading-spinner"></div>
        <p>Loading bets...</p>
      </div>
    );
  }

  return (
    
      <div className="admin-bets">
      <div className="page-header">
        <div className="header-left">
          <h1>Bet Management</h1>
          <p>Monitor and manage all betting activities</p>
        </div>
        <div className="header-right">
          <button className="btn btn-outline">
            <FontAwesomeIcon icon={faDownload} />
            Export
          </button>
          <button className="btn btn-primary">
            <FontAwesomeIcon icon={faChartLine} />
            Analytics
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faGamepad} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{filteredBets.length}</div>
            <div className="stat-title">Total Bets</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {filteredBets.filter(bet => bet.status === 'pending').length}
            </div>
            <div className="stat-title">Pending</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              ${filteredBets.reduce((sum, bet) => sum + (bet.stake || 0), 0).toLocaleString()}
            </div>
            <div className="stat-title">Total Stake</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              ${filteredBets.reduce((sum, bet) => sum + (bet.profitLoss || 0), 0).toLocaleString()}
            </div>
            <div className="stat-title">Net Profit</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search bets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="settled">Settled</option>
            <option value="cancelled">Cancelled</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sport:</label>
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Sports</option>
            <option value="cricket">Cricket</option>
            <option value="football">Football</option>
            <option value="tennis">Tennis</option>
            <option value="basketball">Basketball</option>
            <option value="volleyball">Volleyball</option>
            <option value="hockey">Hockey</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="id">ID</option>
            <option value="created_at">Date</option>
            <option value="stake">Stake</option>
            <option value="profitLoss">Profit/Loss</option>
            <option value="odds">Odds</option>
          </select>
        </div>

        <button
          className="btn btn-outline"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <FontAwesomeIcon icon={faFilter} />
          {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>

      {/* Bets Table */}
      <div className="bets-table-container">
        <table className="bets-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedBets.length === filteredBets.length && filteredBets.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>User</th>
              <th>Sport</th>
              <th>Match</th>
              <th>Market</th>
              <th>Odds</th>
              <th>Stake</th>
              <th>P/L</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBets.map(bet => (
              <tr key={bet.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedBets.includes(bet.id)}
                    onChange={() => handleSelectBet(bet.id)}
                  />
                </td>
                <td>{bet.id}</td>
                <td>
                  <div className="user-info">
                    <span className="username">{bet.username}</span>
                  </div>
                </td>
                <td>
                  <div className="sport-info">
                    <FontAwesomeIcon 
                      icon={getSportIcon(bet.sport)} 
                      className="sport-icon"
                    />
                    <span className="sport-name">{bet.sport}</span>
                  </div>
                </td>
                <td className="match-info">
                  <div className="match-name">{bet.match}</div>
                  <div className="match-time">
                    {new Date(bet.created_at).toLocaleString()}
                  </div>
                </td>
                <td>{bet.market}</td>
                <td className="odds">{bet.odds}</td>
                <td className="stake">${bet.stake?.toLocaleString() || '0'}</td>
                <td className={`profit-loss ${getProfitLossClass(bet.profitLoss)}`}>
                  ${bet.profitLoss?.toLocaleString() || '0'}
                </td>
                <td>{getStatusBadge(bet.status)}</td>
                <td>{new Date(bet.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleViewBet(bet)}
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {bet.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleSettleBet(bet.id)}
                          title="Settle Bet"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCancelBet(bet.id)}
                          title="Cancel Bet"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          Showing {filteredBets.length} of {bets.length} bets
        </div>
        <div className="pagination-controls">
          <button className="btn btn-outline" disabled>Previous</button>
          <span className="page-numbers">
            <button className="btn btn-primary">1</button>
            <button className="btn btn-outline">2</button>
            <button className="btn btn-outline">3</button>
          </span>
          <button className="btn btn-outline">Next</button>
        </div>
      </div>

      {/* Bet Modal */}
      {showBetModal && selectedBet && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Bet Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowBetModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="bet-details">
                <div className="detail-row">
                  <label>Bet ID:</label>
                  <span>{selectedBet.id}</span>
                </div>
                <div className="detail-row">
                  <label>User:</label>
                  <span>{selectedBet.username}</span>
                </div>
                <div className="detail-row">
                  <label>Sport:</label>
                  <span>{selectedBet.sport}</span>
                </div>
                <div className="detail-row">
                  <label>Match:</label>
                  <span>{selectedBet.match}</span>
                </div>
                <div className="detail-row">
                  <label>Market:</label>
                  <span>{selectedBet.market}</span>
                </div>
                <div className="detail-row">
                  <label>Odds:</label>
                  <span>{selectedBet.odds}</span>
                </div>
                <div className="detail-row">
                  <label>Stake:</label>
                  <span>${selectedBet.stake?.toLocaleString() || '0'}</span>
                </div>
                <div className="detail-row">
                  <label>Profit/Loss:</label>
                  <span className={getProfitLossClass(selectedBet.profitLoss)}>
                    ${selectedBet.profitLoss?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  {getStatusBadge(selectedBet.status)}
                </div>
                <div className="detail-row">
                  <label>Date:</label>
                  <span>{new Date(selectedBet.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowBetModal(false)}
              >
                Close
              </button>
              {selectedBet.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleSettleBet(selectedBet.id)}
                  >
                    Settle Bet
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleCancelBet(selectedBet.id)}
                  >
                    Cancel Bet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    
  );
}

export default AdminBets;
