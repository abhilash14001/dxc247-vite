import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import LoadingSpinner from '@dxc247/shared/components/ui/LoadingSpinner';
import Pagination from '@dxc247/shared/components/common/Pagination';
import { toast } from 'react-toastify';
import { useConfirmModal } from '@dxc247/shared/components/ui/useConfirmModal';
import ConfirmModal from '@dxc247/shared/components/ui/ConfirmModal';

const AdminManagePrivilege = () => {
  const [loading, setLoading] = useState(true);
  const [privileges, setPrivileges] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(50);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Confirmation modal
  const { modal: confirmModal, showConfirm, hideModal } = useConfirmModal();

  // Load privileges data
  const loadPrivileges = useCallback(async () => {
    try {
      if (!isLoaded) setLoading(true);

      const params = {
        per_page: perPage,
        page: currentPage,
        search: searchTerm || ''
      };

      const response = await adminApi(`${ADMIN_BASE_PATH}/privilege/list`, 'GET', params);

      if (response.success) {
        setPrivileges(response.data || []);
        setTotalPages(response.pagination?.last_page || 1);
        setTotalRecords(response.pagination?.total || 0);
        setIsLoaded(true);
      } else {
        setPrivileges([]);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error('Error loading privileges data:', error);
      setPrivileges([]);
    } finally {
      setIsLoaded(true);
      setLoading(false);
    }
  }, [searchTerm, currentPage, perPage, isLoaded]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPrivileges();
    }, searchTerm ? 500 : 0); // 500ms delay for search

    return () => clearTimeout(timeoutId);
  }, [loadPrivileges, searchTerm]);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle per page change
  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // Handle delete privilege
  const handleDelete = async (privilegeId, privilegeName) => {
    const confirmed = await showConfirm({
      title: 'Delete Privilege',
      message: `Are you sure you want to delete the privilege "${privilegeName}"? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (confirmed) {
      try {
        setLoading(true);
        const response = await adminApi(`${ADMIN_BASE_PATH}/privilege/delete`, 'POST', {
          user_id: privilegeId
        });

        if (response.success) {
          toast.success('Privilege deleted successfully');
          setIsLoaded(false);
          loadPrivileges();
        } else {
          toast.error(response.message || 'Failed to delete privilege');
        }
      } catch (error) {
        console.error('Error deleting privilege:', error);
        toast.error('Failed to delete privilege');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !isLoaded) return <LoadingSpinner />;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12 main-container">
          <div className="listing-grid">
            <div className="detail-row">
              <h2 className="d-inline-block">
                Privileges Users Listing
                <span className="detailinfo pull-right">
                  <Link
                    to={`/settings/multi-login/create`}
                    className="btn btn-xs btn-primary"
                  >
                    Add New
                  </Link>
                </span>
              </h2>
            </div>
          </div>

          {/* Search and per-page */}
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search privileges..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-3">
              <select className="form-control" value={perPage} onChange={handlePerPageChange}>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
            <div className="col-md-3">
              <small className="text-muted">Total: {totalRecords} records</small>
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped clientListTbl">
                  <thead>
                    <tr>
                      <th>Sr No</th>
                      <th>Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          <LoadingSpinner />
                        </td>
                      </tr>
                    ) : privileges.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">
                          No privileges found
                        </td>
                      </tr>
                    ) : (
                      privileges.map((privilege, index) => (
                        <tr key={privilege.id}>
                          <td>{(currentPage - 1) * perPage + index + 1}</td>
                          <td>{privilege.username}</td>
                          <td>
                            <Link
                              to={`/settings/multi-login/${privilege.id}/edit`}
                              className="btn btn-info btn-xs"
                            >
                              <i className="fa fa-edit"></i>
                            </Link>
                            <button
                              onClick={() => handleDelete(privilege.id, privilege.name)}
                              className="btn btn-danger btn-xs ml-1"
                            >
                              <i className="fa fa-trash"></i>
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
                    <small className="text-muted">
                      Showing {((currentPage - 1) * perPage) + 1} to{' '}
                      {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} entries
                    </small>
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Modal */}
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
      </div>
    </div>
  );
};

export default AdminManagePrivilege;
