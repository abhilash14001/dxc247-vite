import React, { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../utils/api';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import LoadingSpinner from '@dxc247/shared/components/ui/LoadingSpinner';
import Pagination from '@dxc247/shared/components/common/Pagination';
import { Link } from 'react-router-dom';
import { setSelectedMatchData } from '@dxc247/shared/store/admin/adminSlice';
import { useDispatch } from 'react-redux';

const AdminFancyHistory = () => {
  const [loading, setLoading] = useState(true);
  const [fancyData, setFancyData] = useState([]);
  const dispatch = useDispatch();
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(25);
  
  // Filter states
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    sport_type: 'CRICKET'
  });
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getYesterdayDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      from_date: getYesterdayDate(),
      to_date: getTodayDate()
    }));
  }, []);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      try {
        if (!isLoaded) setLoading(true);

        const params = {
          per_page: perPage,
          date_from: filters.from_date,
          date_to: filters.to_date,
          sport: filters.sport_type || 'CRICKET',
          search: searchTerm || ''
        };

        const response = await adminApi(`${ADMIN_BASE_PATH}/cricket-fancy-history`, 'POST', params);

        if (response.success) {
          setFancyData(response.data || []);
          setTotalPages(response.pagination?.last_page || 1);
          setTotalRecords(response.pagination?.total || 0);
          setIsLoaded(true);
        } else {
          setFancyData([]);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (error) {
        console.error('Error loading fancy history data:', error);
        setFancyData([]);
      } finally {
        setIsLoaded(true);
        setLoading(false);
      }
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters, currentPage, perPage, isLoaded]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) =>
    status === 1 || status === 'Active'
      ? <span className="badge badge-success" title="Active">Active</span>
      : <span className="badge badge-danger" title="InActive">InActive</span>;

  const getPlayStatusBadge = (isPlay) =>
    isPlay === 1 || isPlay === true
      ? <span className="badge badge-success" title="Playing">Playing</span>
      : <span className="badge badge-warning" title="Not Playing">Not Playing</span>;

  const getResultStatusBadge = (isResultDeclear) =>
    isResultDeclear === 1 || isResultDeclear === true
      ? <span className="badge badge-success" title="Result Declared">Result Declared</span>
      : <span className="badge badge-info" title="Result Pending">Result Pending</span>;

  const handleNavigateToSingle = (fancy) => {
    dispatch(setSelectedMatchData({
      match_id: fancy.match_id,
      match_name: fancy.match_name,
      match_date: fancy.match_date_formatted,
      sport_id: fancy.id,
      game_name: fancy.gameName || 'CRICKET'
    }));
  };

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">Manage Fancy History</h2>
          </div>

          <div className="row form-horizontal mb-3">
            <div className="col-md-3">
              <input
                type="date"
                name="from_date"
                value={filters.from_date}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="From Date"
              />
            </div>
            <div className="col-md-3">
              <input
                type="date"
                name="to_date"
                value={filters.to_date}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="To Date"
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                name="sport_type"
                value={filters.sport_type || ''}
                onChange={handleFilterChange}
                style={{ color: 'black' }}
              >
                <option value="">Select Sport Type</option>
                <option value="CRICKET">Cricket</option>
                <option value="SOCCER">Soccer</option>
                <option value="TENNIS">Tennis</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search matches..."
                value={searchTerm}
                onChange={handleSearchInput}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>SR. NO.</th>
                      <th>Match ID</th>
                      <th>Match Name</th>
                      <th>Match Date</th>
                      <th>Status</th>
                      <th>Play Status</th>
                      <th>Result Status</th>
                      <th>Winner Team</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          <LoadingSpinner size="sm" />
                        </td>
                      </tr>
                    ) : fancyData.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center">
                          There are no results to display for this query.
                        </td>
                      </tr>
                    ) : (
                      fancyData.map((fancy, index) => (
                        <tr key={fancy.id}>
                          <td>{fancy.sr_no || (currentPage - 1) * perPage + index + 1}</td>
                          <td>{fancy.match_id || '-'}</td>
                          <td>{fancy.match_name || '-'}</td>
                          <td>{fancy.match_date_formatted || formatDate(fancy.match_date_time)}</td>
                          <td>{getStatusBadge(fancy.status)}</td>
                          <td>{getPlayStatusBadge(fancy.is_play)}</td>
                          <td>{getResultStatusBadge(fancy.is_result_declear)}</td>
                          <td>{fancy.winner_team || '-'}</td>
                          <td>
                            <Link
                              to={`${ADMIN_BASE_PATH}/settings/manage-fancy-history-single/${fancy.match_id}`}
                              className="btn btn-success"
                              onClick={() => handleNavigateToSingle(fancy)}
                            >
                              Manage Fancy History
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {totalRecords > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              perPage={perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFancyHistory;
