import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faPlusCircle,
  faListAlt,
  faSort,
  faSortUp,
  faSortDown,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import NoRecordsFound from '@dxc247/shared/components/common/NoRecordsFound';

function AdminSportsMarket() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [newSport, setNewSport] = useState({
    name: '',
    status: 'active',
    type: 'sport'
  });
  const [limitData, setLimitData] = useState({
    min_bet: '',
    max_bet: '',
    max_exposure: ''
  });

  useEffect(() => {
    loadSports();
  }, []);

  const loadSports = async () => {
    try {
      setLoading(true);
      // Mock data
      setSports([
        { id: 1, name: 'CRICKET', status: 'active', type: 'sport', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 2, name: 'ELECTIONS', status: 'active', type: 'election', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 3, name: 'SOCCER', status: 'active', type: 'sport', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 4, name: 'TENNIS', status: 'active', type: 'sport', created_at: '2024-01-01', updated_at: '2024-01-01' }
      ]);
    } catch (error) {
      console.error('Error loading sports:', error);
      setSports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSports = [...sports].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleAddSport = async () => {
    try {
      const response = await adminApi('/sports-market', 'POST', newSport, true);
      if (response.data) {
        setSports([...sports, response.data]);
        setShowAddModal(false);
        setNewSport({ name: '', status: 'active', type: 'sport' });
      }
    } catch (error) {
      console.error('Error adding sport:', error);
    }
  };

  const handleSetLimit = async () => {
    try {
      const response = await adminApi(`/sports-market/${selectedSport.id}/limits`, 'POST', limitData, true);
      if (response.data) {
        setShowLimitModal(false);
        setSelectedSport(null);
        setLimitData({ min_bet: '', max_bet: '', max_exposure: '' });
      }
    } catch (error) {
      console.error('Error setting limits:', error);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faSort} className="text-muted" />;
    return sortDirection === 'asc' ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />;
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? 
      <span className="badge badge-success">Active</span> : 
      <span className="badge badge-danger">Inactive</span>;
  };

  const getActionButtons = (sport) => {
    const isElection = sport.type === 'election';
    return (
      <div className="d-flex gap-1 flex-wrap">
      
     
        <Link
          to={`/sports/list/${sport.name.toLowerCase()}`} 
          className="btn btn-success btn-sm"
        >
          <FontAwesomeIcon icon={faListAlt} className="me-1 mr-1" />
          Setting
        </Link>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row">
        <div className="col-md-12 main-container">
          <div className="listing-grid">
            <div className="detail-row">
              <h2 className="d-inline-block">Games List</h2>
            </div>

            <div className="table-responsive data-table">
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>SR. NO.</th>
                          <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                            Sport Name {getSortIcon('name')}
                          </th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedSports.length > 0 ? (
                          sortedSports.map((sport, index) => (
                            <tr key={sport.id}>
                              <td>{index + 1}</td>
                              <td>{sport.name}</td>
                              <td>{getStatusBadge(sport.status)}</td>
                              <td>{getActionButtons(sport)}</td>
                            </tr>
                          ))
                        ) : (
                          <NoRecordsFound colSpan={4} />
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Sport Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Sport</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Sport Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSport.name}
                    onChange={(e) => setNewSport({...newSport, name: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={newSport.type}
                    onChange={(e) => setNewSport({...newSport, type: e.target.value})}
                  >
                    <option value="sport">Sport</option>
                    <option value="election">Election</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={newSport.status}
                    onChange={(e) => setNewSport({...newSport, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleAddSport}>
                  <FontAwesomeIcon icon={faSave} className="me-1" /> Add Sport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set Limit Modal */}
      {showLimitModal && selectedSport && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Set Limits for {selectedSport.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowLimitModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Minimum Bet</label>
                  <input
                    type="number"
                    className="form-control"
                    value={limitData.min_bet}
                    onChange={(e) => setLimitData({...limitData, min_bet: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Maximum Bet</label>
                  <input
                    type="number"
                    className="form-control"
                    value={limitData.max_bet}
                    onChange={(e) => setLimitData({...limitData, max_bet: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Maximum Exposure</label>
                  <input
                    type="number"
                    className="form-control"
                    value={limitData.max_exposure}
                    onChange={(e) => setLimitData({...limitData, max_exposure: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLimitModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSetLimit}>
                  <FontAwesomeIcon icon={faSave} className="me-1" /> Set Limits
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showAddModal || showLimitModal) && <div className="modal-backdrop show"></div>}
    </>
  );
}

export default AdminSportsMarket;
