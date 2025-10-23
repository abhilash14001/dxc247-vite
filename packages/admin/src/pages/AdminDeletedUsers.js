import React, { useState, useEffect } from 'react';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import Notify from '@dxc247/shared/utils/Notify';
import CenteredSpinner from '@dxc247/shared/components/ui/CenteredSpinner';
import Pagination from '@dxc247/shared/components/common/Pagination';
import ConfirmModal from '@dxc247/shared/components/ui/ConfirmModal';
import { useConfirmModal } from '@dxc247/shared/components/ui/useConfirmModal';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';

const AdminDeletedUsers = () => {
  const { modal: confirmModal, showConfirm, hideModal } = useConfirmModal();
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
    from: 1,
    to: 1
  });

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchDeletedUsers(1, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Initial load and page change effect
  useEffect(() => {
    if (!searchTerm) {
      fetchDeletedUsers(currentPage, '');
    }
  }, [currentPage]);

  const fetchDeletedUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '15'
      });
      if (search.trim()) params.append('search', search.trim());

      const response = await adminApi(`${ADMIN_BASE_PATH}/client/deleted?${params.toString()}`, 'GET');

      if (response && response.success) {
        setDeletedUsers(response.data || []);
        setPagination(response.pagination || {
          current_page: 1,
          per_page: 15,
          total: 0,
          last_page: 1,
          from: 1,
          to: 1
        });
      } else {
        Notify('Failed to fetch deleted users', null, null, 'danger');
      }
    } catch (error) {
      console.error('Error fetching deleted users:', error);
      Notify('Error fetching deleted users', null, null, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (userId) => {
    const user = deletedUsers.find(u => u.id === userId);
    const userName = user ? (user.name || user.username || 'this user') : 'this user';

    await showConfirm({
      title: "Restore User",
      message: `Are you sure you want to restore ${userName}? This will make the user active again.`,
      confirmText: "Yes, Restore",
      cancelText: "Cancel",
      type: "info",
      onConfirm: async () => {
        try {
          setRestoring(prev => ({ ...prev, [userId]: true }));
          const response = await adminApi(`${ADMIN_BASE_PATH}/client/restore/${userId}`, 'POST');

          if (response && response.success) {
            Notify(response.message || 'User restored successfully', null, null, 'success');
            fetchDeletedUsers(currentPage, searchTerm);
          } else {
            Notify(response.message || 'Failed to restore user', null, null, 'danger');
          }
        } catch (error) {
          console.error('Error restoring user:', error);
          if (error.response?.data?.message) {
            Notify(error.response.data.message, null, null, 'danger');
          } else {
            Notify('Error restoring user', null, null, 'danger');
          }
        } finally {
          setRestoring(prev => ({ ...prev, [userId]: false }));
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="row">
        <div className="col-md-12 main-container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <CenteredSpinner size="40px" color="#007bff" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">Close Users</h2>
            <div className="float-right m-b-10">
              <div className="form-group d-inline-block mr-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ minWidth: '200px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="clearfix"></div>
        <div className="table-responsive data-table">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>User ID</th>
                      <th>User Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deletedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          <div className="py-4">
                            <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                            <p className="text-muted">No deleted users found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      deletedUsers.map((user, index) => (
                        <tr key={user.id}>
                          <td>{index + 1}</td>
                          <td>{user.username || user.user_id || 'N/A'}</td>
                          <td>{user.name || user.full_name || 'N/A'}</td>
                          <td>
                            <button
                              className="btn btn-success btn-xs"
                              onClick={() => handleRestore(user.id)}
                              disabled={restoring[user.id]}
                              title="Restore this user"
                            >
                              {restoring[user.id] ? (
                                <>
                                  <CenteredSpinner size="12px" color="#ffffff" style={{ marginRight: '5px' }} />
                                  Restoring...
                                </>
                              ) : (
                                'Restore'
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {!loading && deletedUsers.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div className="dataTables_info">
                    Showing {pagination.from} to {pagination.to} of {pagination.total} entries
                  </div>
                  <Pagination
                    currentPage={pagination.current_page}
                    totalPages={pagination.last_page}
                    onPageChange={setCurrentPage}
                    maxVisiblePages={5}
                    showPreviousNext={true}
                  />
                </div>
              )}
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
    </div>
  );
};

export default AdminDeletedUsers;
