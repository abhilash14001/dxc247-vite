import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useConfirmModal } from '@dxc247/shared/components/ui/useConfirmModal';
import ConfirmModal from '@dxc247/shared/components/ui/ConfirmModal';

const AdminManagePrefix = () => {
  const { modal: confirmModal, showConfirm, hideModal } = useConfirmModal();
  const [loading, setLoading] = useState(false);
  const [prefixes, setPrefixes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(15);

  // Load prefixes data
  const loadPrefixes = async () => {
    setLoading(true);
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/prefix/list?page=${currentPage}&per_page=${perPage}&search=${encodeURIComponent(searchTerm)}`, 'GET');

      if (response.success) {
        setPrefixes(response.data || []);
        setTotalPages(response.pagination?.last_page || 1);
        setTotalRecords(response.pagination?.total || 0);
      } else {
        setPrefixes([]);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error('Error loading prefixes:', error);
      setPrefixes([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPrefixes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, perPage, searchTerm]);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Handle delete
  const handleDelete = (prefixId, domainName) => {
    showConfirm({
      title: 'Delete Prefix',
      message: `Are you sure you want to delete the prefix "${domainName}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          const response = await adminApi(`${ADMIN_BASE_PATH}/prefix/delete`, 'POST', {
            id: prefixId
          });

          if (response.success) {
            toast.success('Prefix deleted successfully!');
            loadPrefixes();
          } else {
            toast.error(response.message || 'Failed to delete prefix');
          }
        } catch (error) {
          console.error('Error deleting prefix:', error);
          toast.error('Failed to delete prefix. Please try again.');
        }
      }
    });
  };

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">
              PreFix Domain Listing
              <span className="detailinfo pull-right">
                <Link to={`/settings/manage-prefix/create`} className="btn btn-xs btn-primary pull-right">
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  Add New
                </Link>
              </span>
            </h2>
          </div>

          <div className="card">
            <div className="card-body">
              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search prefixes..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-control"
                    value={perPage}
                    onChange={handlePerPageChange}
                  >
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>SR. NO.</th>
                      <th>Domain Name</th>
                      <th>Site Title</th>
                      <th>Favicon</th>
                      <th>Logo</th>
                      <th>Site Bg Color</th>
                      <th>Site Menu Color</th>
                      <th>Live Mode</th>
                      <th>User Inspect Redirect</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="10" className="text-center">
                          <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                          Loading...
                        </td>
                      </tr>
                    ) : prefixes.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center">
                          No prefixes found
                        </td>
                      </tr>
                    ) : (
                      prefixes.map((prefix, index) => (
                        <tr key={prefix.id}>
                          <td>{(currentPage - 1) * perPage + index + 1}</td>
                          <td>{prefix.domain_name}</td>
                          <td>{prefix.title}</td>
                          <td>
                            {prefix.favi_icon ? (
                              <img 
                                src={prefix.favi_icon} 
                                alt="Favicon" 
                                style={{ height: '35px' }}
                                className="img-thumbnail"
                              />
                            ) : (
                              <span className="text-muted">No favicon</span>
                            )}
                          </td>
                          <td>
                            {prefix.logo ? (
                              <img 
                                src={prefix.logo} 
                                alt="Logo" 
                                style={{ height: '35px' }}
                                className="img-thumbnail"
                              />
                            ) : (
                              <span className="text-muted">No logo</span>
                            )}
                          </td>
                          <td>
                            {prefix.site_bg_color && (
                              <span 
                                className="badge"
                                style={{ backgroundColor: prefix.site_bg_color, color: 'white' }}
                              >
                                {prefix.site_bg_color}
                              </span>
                            )}
                          </td>
                          <td>
                            {prefix.site_menu_color && (
                              <span 
                                className="badge"
                                style={{ backgroundColor: prefix.site_menu_color, color: 'white' }}
                              >
                                {prefix.site_menu_color}
                              </span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${prefix.live_mode ? 'badge-success' : 'badge-danger'}`}>
                              {prefix.live_mode ? 'Enable' : 'Disable'}
                            </span>
                          </td>
                          <td>
                            {prefix.user_inspect_redirect ? (
                              <a 
                                href={prefix.user_inspect_redirect} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-truncate d-inline-block"
                                style={{ maxWidth: '150px' }}
                              >
                                {prefix.user_inspect_redirect}
                              </a>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <Link 
                              to={`/settings/manage-prefix/${prefix.id}/edit`}
                              className="btn btn-info btn-sm me-1"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(prefix.id, prefix.domain_name)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} entries
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        show={confirmModal.show}
        onHide={hideModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
      />
    </div>
  );
};

export default AdminManagePrefix;
