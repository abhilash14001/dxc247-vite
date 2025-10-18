import React, { useState, useEffect } from 'react';
import { adminApi } from './adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { Link } from 'react-router-dom';
import LoadingSpinner from '@dxc247/shared/components/ui/LoadingSpinner';
import Pagination from '@dxc247/shared/components/common/Pagination';

const AdminManageFancy = () => {
  const [loading, setLoading] = useState(true);
  const [fancyData, setFancyData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(25);

  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    sport_type: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
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
          page: currentPage,
          per_page: perPage,
          from_date: filters.from_date,
          to_date: filters.to_date,
          sport: filters.sport_type || 'cricket',
          search: searchTerm || ''
        };

        const response = await adminApi(`${ADMIN_BASE_PATH}/sports-fancy-list`, 'POST', params);

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
        console.error('Error loading fancy data:', error);
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

  const getStatusBadge = (status) => {
    if (status === 1 || status === 'Active') {
      return <span className="badge badge-success" data-toggle="tooltip" title="Active">Active</span>;
    } else {
      return <span className="badge badge-danger" data-toggle="tooltip" title="InActive">InActive</span>;
    }
  };

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">Manage Fancy</h2>
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
                autoComplete="off"
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
                autoComplete="off"
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
                <option value="cricket">Cricket</option>
                <option value="soccer">Soccer</option>
                <option value="tennis">Tennis</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          <LoadingSpinner size="sm" />
                        </td>
                      </tr>
                    ) : fancyData.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          There are no results to display for this query.
                        </td>
                      </tr>
                    ) : (
                      fancyData.map((fancy, index) => (
                        <tr key={fancy.id}>
                          <td>{fancy.sr_no || (currentPage - 1) * perPage + index + 1}</td>
                          <td>{fancy.match_id || '-'}</td>
                          <td>{fancy.match_name || '-'}</td>
                          <td>{fancy.match_date_formatted || formatDate(fancy.match_date)}</td>
                          <td>{getStatusBadge(fancy.status)}</td>
                          <td>
                            <Link
                              to={`/settings/manage-fancy-single/${fancy.match_id}`}
                              className="btn btn-success"
                              data-sport-id={fancy.id}
                            >
                              Manage Fancy
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

export default AdminManageFancy;
