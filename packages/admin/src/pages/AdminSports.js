import React, { useState, useEffect } from 'react';
import { adminApiMethods } from '@dxc247/shared/utils/adminApi';
import DataTable from 'react-data-table-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faDownload, 
  faEye,
  faEdit,
  faPlay,
  faCog,
  faBaseball,
  faFutbol,
  faTableTennis,
  faBasketballBall,
  faVolleyballBall,
  faHockeyPuck,
  faCircle,
  faChess,
  faMotorcycle,
  faFistRaised,
  faWater,
  faRunning,
  faTrophy,
  faUsers,
  faChartLine,
  faCalendarAlt,
  faToggleOn,
  faToggleOff,
  faTrash,
  faPlus
} from '@fortawesome/free-solid-svg-icons';


function AdminSports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showSportModal, setShowSportModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [showAddSportModal, setShowAddSportModal] = useState(false);

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    try {
      setLoading(true);
      // Get sports from SportsProvider configuration
      const sportsData = [
        { id: 1, name: 'Cricket', code: 'cricket', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 156, totalBets: 2340, totalRevenue: 45600, lastMatch: '2024-01-15T10:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 2, name: 'Football', code: 'soccer', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 89, totalBets: 1890, totalRevenue: 38900, lastMatch: '2024-01-14T15:45:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 3, name: 'Tennis', code: 'tennis', category: 'Racket Sports', status: 'active', isActive: true, totalMatches: 67, totalBets: 1234, totalRevenue: 23400, lastMatch: '2024-01-13T12:20:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 4, name: 'Table Tennis', code: 'table-tennis', category: 'Racket Sports', status: 'active', isActive: true, totalMatches: 45, totalBets: 890, totalRevenue: 15600, lastMatch: '2024-01-12T14:15:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 5, name: 'Basketball', code: 'basketball', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 78, totalBets: 1456, totalRevenue: 27800, lastMatch: '2024-01-11T20:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 6, name: 'Volleyball', code: 'volleyball', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 34, totalBets: 567, totalRevenue: 12300, lastMatch: '2024-01-10T16:45:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 7, name: 'Snooker', code: 'snooker', category: 'Cue Sports', status: 'active', isActive: true, totalMatches: 23, totalBets: 345, totalRevenue: 8900, lastMatch: '2024-01-09T19:20:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 8, name: 'Handball', code: 'handball', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 12, totalBets: 234, totalRevenue: 5600, lastMatch: '2024-01-08T17:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 9, name: 'Ice Hockey', code: 'ice-hockey', category: 'Ice Sports', status: 'active', isActive: true, totalMatches: 56, totalBets: 1123, totalRevenue: 20100, lastMatch: '2024-01-07T21:15:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 10, name: 'E Games', code: 'e-games', category: 'Electronic Sports', status: 'active', isActive: true, totalMatches: 234, totalBets: 4567, totalRevenue: 78900, lastMatch: '2024-01-06T13:45:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 11, name: 'Futsal', code: 'futsal', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 67, totalBets: 1234, totalRevenue: 23400, lastMatch: '2024-01-05T18:20:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 12, name: 'Kabaddi', code: 'kabaddi', category: 'Traditional Sports', status: 'active', isActive: true, totalMatches: 45, totalBets: 890, totalRevenue: 15600, lastMatch: '2024-01-04T15:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 13, name: 'Golf', code: 'golf', category: 'Individual Sports', status: 'active', isActive: true, totalMatches: 23, totalBets: 456, totalRevenue: 12300, lastMatch: '2024-01-03T09:15:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 14, name: 'Rugby League', code: 'rugby-league', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 34, totalBets: 678, totalRevenue: 14500, lastMatch: '2024-01-02T16:45:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 15, name: 'Boxing', code: 'boxing', category: 'Combat Sports', status: 'active', isActive: true, totalMatches: 12, totalBets: 234, totalRevenue: 8900, lastMatch: '2024-01-01T20:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 16, name: 'Beach Volleyball', code: 'beach-volleyball', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 8, totalBets: 123, totalRevenue: 3400, lastMatch: '2023-12-31T14:20:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 17, name: 'Mixed Martial Arts', code: 'mma', category: 'Combat Sports', status: 'active', isActive: true, totalMatches: 15, totalBets: 345, totalRevenue: 7800, lastMatch: '2023-12-30T22:15:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 18, name: 'MotoGP', code: 'motogp', category: 'Motor Sports', status: 'active', isActive: true, totalMatches: 18, totalBets: 456, totalRevenue: 12300, lastMatch: '2023-12-29T15:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 19, name: 'Chess', code: 'chess', category: 'Mind Sports', status: 'active', isActive: true, totalMatches: 89, totalBets: 1234, totalRevenue: 23400, lastMatch: '2023-12-28T12:45:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 20, name: 'Badminton', code: 'badminton', category: 'Racket Sports', status: 'active', isActive: true, totalMatches: 56, totalBets: 890, totalRevenue: 16700, lastMatch: '2023-12-27T18:20:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 21, name: 'Cycling', code: 'cycling', category: 'Individual Sports', status: 'active', isActive: true, totalMatches: 23, totalBets: 345, totalRevenue: 8900, lastMatch: '2023-12-26T10:15:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 22, name: 'Motorbikes', code: 'motorbikes', category: 'Motor Sports', status: 'active', isActive: true, totalMatches: 12, totalBets: 234, totalRevenue: 5600, lastMatch: '2023-12-25T16:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 23, name: 'Athletics', code: 'athletics', category: 'Individual Sports', status: 'active', isActive: true, totalMatches: 45, totalBets: 678, totalRevenue: 14500, lastMatch: '2023-12-24T14:45:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 24, name: 'Basketball 3X3', code: 'basketball-3x3', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 34, totalBets: 567, totalRevenue: 12300, lastMatch: '2023-12-23T19:20:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 25, name: 'Sumo', code: 'sumo', category: 'Traditional Sports', status: 'inactive', isActive: false, totalMatches: 5, totalBets: 89, totalRevenue: 2300, lastMatch: '2023-12-22T11:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 26, name: 'Virtual sports', code: 'virtual-sports', category: 'Electronic Sports', status: 'active', isActive: true, totalMatches: 156, totalBets: 2340, totalRevenue: 45600, lastMatch: '2024-01-15T10:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 27, name: 'Motor Sports', code: 'motor-sports', category: 'Motor Sports', status: 'active', isActive: true, totalMatches: 23, totalBets: 456, totalRevenue: 12300, lastMatch: '2023-12-21T15:45:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 28, name: 'Baseball', code: 'baseball', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 67, totalBets: 1234, totalRevenue: 23400, lastMatch: '2023-12-20T20:15:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 29, name: 'Rugby Union', code: 'rugby-union', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 45, totalBets: 890, totalRevenue: 15600, lastMatch: '2023-12-19T17:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 30, name: 'Darts', code: 'darts', category: 'Cue Sports', status: 'active', isActive: true, totalMatches: 78, totalBets: 1456, totalRevenue: 27800, lastMatch: '2023-12-18T21:45:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 31, name: 'American Football', code: 'american-football', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 34, totalBets: 678, totalRevenue: 14500, lastMatch: '2023-12-17T19:20:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 32, name: 'Soccer', code: 'soccer', category: 'Ball Sports', status: 'active', isActive: true, totalMatches: 89, totalBets: 1890, totalRevenue: 38900, lastMatch: '2023-12-16T15:30:00Z', createdAt: '2023-01-01T00:00:00Z' },
        { id: 33, name: 'Esports', code: 'esports', category: 'Electronic Sports', status: 'active', isActive: true, totalMatches: 234, totalBets: 4567, totalRevenue: 78900, lastMatch: '2023-12-15T13:45:00Z', createdAt: '2023-01-01T00:00:00Z' }
      ];
      setSports(sportsData);
    } catch (error) {
      console.error('Error loading sports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSports = sports.filter(sport => {
    const matchesSearch = sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sport.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || sport.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || sport.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewSport = (sport) => {
    setSelectedSport(sport);
    setShowSportModal(true);
  };

  const handleEditSport = (sport) => {
    setSelectedSport(sport);
    setShowSportModal(true);
  };

  const handleToggleStatus = (sportId) => {
    setSports(prev => prev.map(sport => 
      sport.id === sportId 
        ? { ...sport, isActive: !sport.isActive }
        : sport
    ));
  };

  const handleDeleteSport = (sportId) => {
    if (window.confirm('Are you sure you want to delete this sport?')) {
      setSports(prev => prev.filter(sport => sport.id !== sportId));
    }
  };

  const handleAddSport = () => {
    setShowAddSportModal(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      maintenance: 'status-maintenance',
      coming_soon: 'status-coming-soon'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-default'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getSportIcon = (sportCode) => {
    const icons = {
      'cricket': faBaseball,
      'soccer': faFutbol,
      'football': faFutbol,
      'tennis': faTableTennis,
      'table-tennis': faTableTennis,
      'basketball': faBasketballBall,
      'volleyball': faVolleyballBall,
      'ice-hockey': faHockeyPuck,
      'golf': faCircle,
      'chess': faChess,
      'motogp': faMotorcycle,
      'motorbikes': faMotorcycle,
      'boxing': faFistRaised,
      'athletics': faRunning,
      'swimming': faWater,
      'default': faTrophy
    };
    return icons[sportCode] || icons['default'];
  };

  const columns = [
    {
      name: 'Sport',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <div className="sport-name-cell">
          <FontAwesomeIcon icon={getSportIcon(row.code)} className="sport-icon" />
          <div className="sport-info">
            <span className="sport-name">{row.name}</span>
            <span className="sport-code">{row.code}</span>
          </div>
        </div>
      )
    },
    {
      name: 'Category',
      selector: row => row.category,
      sortable: true,
      cell: row => (
        <span className="category-badge">{row.category}</span>
      )
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => getStatusBadge(row.status)
    },
    {
      name: 'Matches',
      selector: row => row.totalMatches,
      sortable: true,
      cell: row => (
        <div className="stats-cell">
          <FontAwesomeIcon icon={faTrophy} className="stats-icon" />
          <span>{row.totalMatches}</span>
        </div>
      )
    },
    {
      name: 'Total Bets',
      selector: row => row.totalBets,
      sortable: true,
      cell: row => (
        <div className="stats-cell">
          <FontAwesomeIcon icon={faUsers} className="stats-icon" />
          <span>{row.totalBets.toLocaleString()}</span>
        </div>
      )
    },
    {
      name: 'Revenue',
      selector: row => row.totalRevenue,
      sortable: true,
      cell: row => (
        <div className="revenue-cell">
          <FontAwesomeIcon icon={faChartLine} className="revenue-icon" />
          <span>${row.totalRevenue.toLocaleString()}</span>
        </div>
      )
    },
    {
      name: 'Last Match',
      selector: row => row.lastMatch,
      sortable: true,
      cell: row => (
        <div className="date-cell">
          <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
          <span>{new Date(row.lastMatch).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleViewSport(row)}
            title="View Details"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleEditSport(row)}
            title="Edit Sport"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className={`btn btn-sm ${row.isActive ? 'btn-warning' : 'btn-success'}`}
            onClick={() => handleToggleStatus(row.id)}
            title={row.isActive ? 'Deactivate' : 'Activate'}
          >
            <FontAwesomeIcon icon={row.isActive ? faToggleOn : faToggleOff} />
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteSport(row.id)}
            title="Delete Sport"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '160px'
    }
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#667eea',
        color: 'white',
        fontWeight: '600'
      }
    },
    headCells: {
      style: {
        fontSize: '0.9rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }
    },
    cells: {
      style: {
        fontSize: '0.85rem',
        padding: '12px 8px'
      }
    },
    rows: {
      style: {
        '&:nth-of-type(odd)': {
          backgroundColor: '#f8f9fa'
        },
        '&:hover': {
          backgroundColor: '#e3f2fd'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-sports-loading">
        <div className="loading-spinner"></div>
        <p>Loading sports...</p>
      </div>
    );
  }

  return (
    
      <div className="admin-sports">
      <div className="page-header">
        <div className="header-left">
          <h1>Sports Management</h1>
          <p>Manage and monitor all sports categories</p>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-outline"
            onClick={() => console.log('Export sports')}
          >
            <FontAwesomeIcon icon={faDownload} />
            Export
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleAddSport}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Sport
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{sports.length}</div>
            <div className="stat-title">Total Sports</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faPlay} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{sports.filter(s => s.isActive).length}</div>
            <div className="stat-title">Active Sports</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{sports.reduce((sum, s) => sum + s.totalBets, 0).toLocaleString()}</div>
            <div className="stat-title">Total Bets</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="stat-content">
            <div className="stat-value">${sports.reduce((sum, s) => sum + s.totalRevenue, 0).toLocaleString()}</div>
            <div className="stat-title">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search sports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="Ball Sports">Ball Sports</option>
            <option value="Racket Sports">Racket Sports</option>
            <option value="Cue Sports">Cue Sports</option>
            <option value="Ice Sports">Ice Sports</option>
            <option value="Electronic Sports">Electronic Sports</option>
            <option value="Traditional Sports">Traditional Sports</option>
            <option value="Individual Sports">Individual Sports</option>
            <option value="Combat Sports">Combat Sports</option>
            <option value="Motor Sports">Motor Sports</option>
            <option value="Mind Sports">Mind Sports</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <div className="table-container">
        <DataTable
          columns={columns}
          data={filteredSports}
          customStyles={customStyles}
          pagination
          paginationPerPage={25}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          selectableRows
          onSelectedRowsChange={setSelectedRows}
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="no-data">
              <FontAwesomeIcon icon={faTrophy} className="no-data-icon" />
              <p>No sports found</p>
            </div>
          }
        />
      </div>

      {/* Sport Modal */}
      {showSportModal && selectedSport && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Sport Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowSportModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="sport-details">
                <div className="detail-row">
                  <label>Sport Name:</label>
                  <span>{selectedSport.name}</span>
                </div>
                <div className="detail-row">
                  <label>Sport Code:</label>
                  <span>{selectedSport.code}</span>
                </div>
                <div className="detail-row">
                  <label>Category:</label>
                  <span className="category-badge">{selectedSport.category}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  {getStatusBadge(selectedSport.status)}
                </div>
                <div className="detail-row">
                  <label>Total Matches:</label>
                  <span>{selectedSport.totalMatches}</span>
                </div>
                <div className="detail-row">
                  <label>Total Bets:</label>
                  <span>{selectedSport.totalBets.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <label>Total Revenue:</label>
                  <span>${selectedSport.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <label>Last Match:</label>
                  <span>{new Date(selectedSport.lastMatch).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <label>Created:</label>
                  <span>{new Date(selectedSport.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowSportModal(false)}
              >
                Close
              </button>
              <button className="btn btn-primary">
                Edit Sport
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Sport Modal */}
      {showAddSportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Sport</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddSportModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="add-sport-form">
                <div className="form-group">
                  <label>Sport Name:</label>
                  <input type="text" className="form-control" placeholder="Enter sport name" />
                </div>
                <div className="form-group">
                  <label>Sport Code:</label>
                  <input type="text" className="form-control" placeholder="Enter sport code" />
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <select className="form-control">
                    <option value="Ball Sports">Ball Sports</option>
                    <option value="Racket Sports">Racket Sports</option>
                    <option value="Cue Sports">Cue Sports</option>
                    <option value="Ice Sports">Ice Sports</option>
                    <option value="Electronic Sports">Electronic Sports</option>
                    <option value="Traditional Sports">Traditional Sports</option>
                    <option value="Individual Sports">Individual Sports</option>
                    <option value="Combat Sports">Combat Sports</option>
                    <option value="Motor Sports">Motor Sports</option>
                    <option value="Mind Sports">Mind Sports</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status:</label>
                  <select className="form-control">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="coming_soon">Coming Soon</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowAddSportModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Add Sport
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    
  );
}

export default AdminSports;
