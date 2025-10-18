import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from './adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

// ✅ Cleaned ToggleSwitch Component
const ToggleSwitch = ({ id, checked, onChange, label }) => {
  return (
    <>
      <div className="form-check custom-toggle-switch">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="toggle-input"
        />
        <label htmlFor={id} className="toggle-label">
          <span className="toggle-slider"></span>
        </label>
        {label && <label htmlFor={id} className="form-check-label">{label}</label>}
      </div>

      <style jsx>{`
        .custom-toggle-switch {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toggle-input {
          display: none;
        }
        .toggle-label {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 30px;
          background-color: #ccc;
          border-radius: 30px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.3s;
        }
        .toggle-input:checked + .toggle-label {
          background-color: #007bff;
        }
        .toggle-input:checked + .toggle-label .toggle-slider {
          transform: translateX(30px);
        }
        .form-check-label {
          margin-left: 10px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

const AdminBlockIp = () => {
  const [loading, setLoading] = useState(false);
  const [blockedIps, setBlockedIps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');

  // Load blocked IPs
  const loadBlockedIps = async () => {
    setLoading(true);
    try {
      const response = await adminApi(
        `${ADMIN_BASE_PATH}/block-ip/list?page=${currentPage}&per_page=${perPage}&search=${encodeURIComponent(searchTerm)}`,
        'GET'
      );

      if (response.success) {
        setBlockedIps(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
        setTotalRecords(response.data.total || 0);
      } else {
        setBlockedIps([]);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error('Error loading blocked IPs:', error);
      setBlockedIps([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleStatusChange = async (id, isActive) => {
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/block-ip/status`, 'POST', {
        id: id,
        status: isActive ? 1 : 0,
      });

      if (response.success) {
        toast.success(`IP ${isActive ? 'activated' : 'deactivated'} successfully`);
        loadBlockedIps();
      } else {
        toast.error(response.message || 'Failed to update IP status');
      }
    } catch (error) {
      console.error('Error updating IP status:', error);
      toast.error('Failed to update IP status. Please try again.');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadBlockedIps();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [currentPage, perPage, searchTerm]);

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">IP Blocked List</h2>
          </div>

          <div className="mt-3">
            <div className="card">
              <div className="card-body">
                <div className="pull-right">
                  <Link
                    to={`/settings/block-ip/create`}
                    className="btn-primary btn btn-sm"
                  >
                    <FontAwesomeIcon icon={faPlus} className="text-white" />
                  </Link>
                </div>

                <div className="table-responsive mt-3">
                  <div className="dataTables_wrapper no-footer">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="dataTables_length">
                        <label>
                          Show{' '}
                          <select
                            name="per_page"
                            value={perPage}
                            onChange={handlePerPageChange}
                            className="form-control d-inline-block w-auto"
                          >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={75}>75</option>
                            <option value={100}>100</option>
                          </select>{' '}
                          entries
                        </label>
                      </div>

                      <div className="dataTables_filter">
                        <label>
                          Search:
                          <input
                            type="search"
                            className="form-control d-inline-block w-auto ms-2"
                            value={searchTerm}
                            onChange={handleSearch}
                          />
                        </label>
                      </div>
                    </div>

                    {loading && (
                      <div className="dataTables_processing text-center">
                        <FontAwesomeIcon icon={faSpinner} spin />
                      </div>
                    )}

                    <table className="table table-striped dataTable no-footer">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>IP</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="5" className="text-center">
                              <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                            </td>
                          </tr>
                        ) : blockedIps.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="dataTables_empty text-center">
                              No data available in table
                            </td>
                          </tr>
                        ) : (
                          blockedIps.map((blockedIp, index) => (
                            <tr key={blockedIp.id}>
                              <td>{(currentPage - 1) * perPage + index + 1}</td>
                              <td>{blockedIp.ip}</td>
                              <td>
                                {blockedIp.created_at
                                  ? new Date(blockedIp.created_at).toLocaleString()
                                  : ''}
                              </td>
                              <td>
                                <ToggleSwitch
                                  id={`toggle_${blockedIp.id}`}
                                  checked={blockedIp.status === 1}
                                  onChange={(e) =>
                                    handleStatusChange(blockedIp.id, e.target.checked)
                                  }
                                />
                              </td>
                              <td>
                                <Link
                                  to={`/settings/block-ip/${blockedIp.id}/edit`}
                                  className="btn btn-primary btn-sm"
                                  title="Edit"
                                >
                                  <FontAwesomeIcon icon={faEdit} className="text-white" />
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    <div className="dataTables_info">
                      Showing {blockedIps.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to{' '}
                      {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} entries
                    </div>

                    {totalPages > 1 && (
                      <div className="dataTables_paginate paging_full_numbers mt-2">
                        <button
                          className={`paginate_button first ${currentPage === 1 ? 'disabled' : ''}`}
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                        >
                          First
                        </button>
                        <button
                          className={`paginate_button previous ${
                            currentPage === 1 ? 'disabled' : ''
                          }`}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              className={`paginate_button ${
                                currentPage === page ? 'current' : ''
                              }`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          );
                        })}

                        <button
                          className={`paginate_button next ${
                            currentPage === totalPages ? 'disabled' : ''
                          }`}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                        <button
                          className={`paginate_button last ${
                            currentPage === totalPages ? 'disabled' : ''
                          }`}
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          Last
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlockIp;
