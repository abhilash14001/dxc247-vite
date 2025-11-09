import React, { useState, useEffect } from 'react';
import { adminApiMethods } from '@dxc247/shared/utils/adminApi';
import Notify from '@dxc247/shared/utils/Notify';
import Pagination from '@dxc247/shared/components/common/Pagination';

const UserBookModal = ({ 
  isOpen, 
  onClose, 
  sportId, 
  matchId, 
  bookType 
}) => {
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch book data when modal opens or parameters change
  useEffect(() => {
    if (isOpen && sportId && bookType) {
      fetchBookData();
    }
  }, [isOpen, sportId, bookType, currentPage, perPage, searchTerm]);

  // Handle search with debounce
  useEffect(() => {
    if (isOpen && sportId && bookType) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1); // Reset to first page when searching
        fetchBookData();
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  // Handle per page change
  useEffect(() => {
    if (isOpen && sportId && bookType) {
      setCurrentPage(1); // Reset to first page when changing per page
      fetchBookData();
    }
  }, [perPage]);

  const fetchBookData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApiMethods.getUserBook({
        sport_id: sportId,
        type: bookType,
        page: currentPage,
        per_page: perPage,
        search: searchTerm || ''
      });

      if (response.success) {
        setBookData(response.data);
        setTotalPages(response.data.pagination.last_page);
      } else {
        setError(response.message || 'Failed to fetch book data');
        Notify(response.message || 'Failed to fetch book data', null, null, 'danger');
      }
    } catch (error) {
      console.error('Error fetching book data:', error);
      setError('Error fetching book data');
      Notify('Error fetching book data', null, null, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBookData(null);
    setError(null);
    setSearchTerm('');
    setCurrentPage(1);
    onClose();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Add escape key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatExposure = (value) => {
    if (value > 0) {
      return <span className="color-font-green">{value}</span>;
    } else if (value < 0) {
      return <span className="color-font-red">{value}</span>;
    }
    return <span>{value}</span>;
  };

  const getBookTypeDisplayName = (type) => {
    switch (type) {
      case 'ODDS': return 'User Book';
      case 'BOOKMAKER': return 'B.M Book';
      case 'TOSS': return 'Toss Book';
      default: return 'Book';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title">{getBookTypeDisplayName(bookType)}</h5>
            <button 
              type="button" 
              className="close" 
              data-dismiss="modal" 
              onClick={handleClose}
              aria-label="Close"
            >
              <div className="close_new">
                <i className="fas fa-times-circle"></i>
              </div>
            </button>
          </div>
          
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading book data...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <button 
                  className="btn btn-sm btn-outline-danger ms-2" 
                  onClick={fetchBookData}
                >
                  Retry
                </button>
              </div>
            ) : bookData ? (
              <>
                {/* Search and Controls */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select 
                      className="form-select" 
                      value={perPage} 
                      onChange={handlePerPageChange}
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex align-items-center">
                      <span className="text-muted">
                        {bookData?.pagination?.total || 0} users found
                      </span>
                    </div>
                  </div>
                </div>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User Name</th>
                      {bookData.team_names?.map((teamName, index) => (
                        <th key={index}>{teamName}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookData.users?.map((user, index) => (
                      <tr key={user.user_id}>
                        <td>{bookData.pagination?.from + index}</td>
                        <td>
                          <a 
                            href="#" 
                            onClick={(e) => e.preventDefault()}
                          >
                            {user.username}
                          </a>
                        </td>
                        {bookData.team_names?.map((teamName, teamIndex) => (
                          <td key={teamIndex}>
                            {formatExposure(user.exposures?.[teamName] || 0)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {bookData.totals && (
                      <tr>
                        <th colSpan="2" className="text-right">
                          <b>Total</b>
                        </th>
                        {bookData.team_names?.map((teamName, index) => (
                          <th key={index}>
                            <b style={{ 
                              color: bookData.totals[teamName] > 0 ? 'green' : 'red' 
                            }}>
                              {bookData.totals[teamName] || 0}
                            </b>
                          </th>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {bookData?.pagination && bookData.pagination.last_page > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="dataTables_info">
                    Showing {bookData.pagination.from} to {bookData.pagination.to} of {bookData.pagination.total} entries
                  </div>
                  <Pagination
                    currentPage={bookData.pagination.current_page}
                    totalPages={bookData.pagination.last_page}
                    onPageChange={handlePageChange}
                    maxVisiblePages={5}
                    showPreviousNext={true}
                  />
                </div>
              )}
              </>
            ) : (
              <div className="text-center py-4">
                <i className="fas fa-book text-muted" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted mt-2">No book data available</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            {bookData && (
              <button
                type="button"
                className="btn btn-success"
                onClick={fetchBookData}
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookModal;
