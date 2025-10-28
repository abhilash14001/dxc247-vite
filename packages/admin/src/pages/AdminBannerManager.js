import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPlus, faEdit, faTrash, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from './ToggleSwitch';
import { useConfirmModal } from '@dxc247/shared/components/ui/useConfirmModal';
import ConfirmModal from '@dxc247/shared/components/ui/ConfirmModal';

const AdminBannerManager = () => {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [isUpdatingPositions, setIsUpdatingPositions] = useState(false);
  const { modal: confirmModal, showConfirm, hideModal } = useConfirmModal();

  const loadBanners = async () => {
    setLoading(true);
    try {
      const response = await adminApi(
        `${ADMIN_BASE_PATH}/banner/list?page=${currentPage}&per_page=${perPage}&search=${encodeURIComponent(searchTerm)}`,
        'GET',
        {}, true
      );

      if (response.success) {
        setBanners(response.data.data || []);
        setTotalPages(response.data.last_page || 1);
        setTotalRecords(response.data.total || 0);
      } else {
        setBanners([]);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
      setBanners([]);
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
      const response = await adminApi(`${ADMIN_BASE_PATH}/banner/status`, 'POST', {
        id,
        status: isActive ? 1 : 0,
      }, true);

      if (response.success) {
        toast.success(`Banner ${isActive ? 'activated' : 'deactivated'} successfully`);
        loadBanners();
      } else {
        toast.error(response.message || 'Failed to update banner status');
      }
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast.error('Failed to update banner status. Please try again.');
    }
  };

  const handleDelete = async (bannerId) => {
    await showConfirm({
      title: 'Delete Banner',
      message: 'Are you sure you want to delete this banner? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        try {
          const response = await adminApi(`${ADMIN_BASE_PATH}/banner/${bannerId}`, 'DELETE', {}, true);
          if (response.success) {
            toast.success('Banner deleted successfully');
            loadBanners();
          } else {
            toast.error(response.message || 'Failed to delete banner');
          }
        } catch (error) {
          console.error('Error deleting banner:', error);
          toast.error('Failed to delete banner. Please try again.');
        }
      },
    });
  };

  const handleDragStart = (e, bannerId) => {
    setDraggedItem(bannerId);
    e.target.style.opacity = '0.5';
  };

  const handleDragOver = (e, bannerId) => {
    e.preventDefault();
    setDragOverItem(bannerId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverItem(null);
  };

  const handleDrop = async (e, targetBannerId) => {
    e.preventDefault();
    const sourceBannerId = draggedItem;
    if (sourceBannerId === targetBannerId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const sourceIndex = banners.findIndex((b) => b.id === sourceBannerId);
    const targetIndex = banners.findIndex((b) => b.id === targetBannerId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newBanners = [...banners];
    const [moved] = newBanners.splice(sourceIndex, 1);
    newBanners.splice(targetIndex, 0, moved);

    const updatedBanners = newBanners.map((b, i) => ({ ...b, order_by: i + 1 }));
    setBanners(updatedBanners);
    setDraggedItem(null);
    setDragOverItem(null);

    await updateBannerPositions(updatedBanners);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const updateBannerPositions = async (updatedBanners) => {
    setIsUpdatingPositions(true);
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/banner/update-positions`, 'POST', {
        positions: updatedBanners.map((b) => ({ id: b.id, order_by: b.order_by })),
      }, true);

      if (response.success) toast.success('Banner positions updated successfully');
      else {
        toast.error(response.message || 'Failed to update positions');
        loadBanners();
      }
    } catch (error) {
      console.error('Error updating banner positions:', error);
      toast.error('Failed to update banner positions. Please try again.');
      loadBanners();
    } finally {
      setIsUpdatingPositions(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => loadBanners(), 500);
    return () => clearTimeout(timeoutId);
  }, [currentPage, perPage, searchTerm]);

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row d-flex align-items-center justify-content-between">
            <h2 className="mb-0">Banner Manager</h2>
            {isUpdatingPositions && (
              <div>
                <FontAwesomeIcon icon={faSpinner} spin className="text-primary me-1" />
                <span className="text-muted">Updating positions...</span>
              </div>
            )}
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <label>
                  Show{' '}
                  <select
                    name="per_page"
                    value={perPage}
                    onChange={handlePerPageChange}
                    className="form-control d-inline-block w-auto"
                  >
                    {[25, 50, 75, 100].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>{' '}
                  entries
                </label>
              </div>
              <div>
                <label>
                  Search:{' '}
                  <input
                    type="search"
                    className="form-control d-inline-block w-auto ms-2"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </label>
              </div>
              <Link
                to={`/settings/banner-manager/create`}
                className="btn btn-sm btn-primary"
              >
                <FontAwesomeIcon icon={faPlus} className="me-1" />
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-striped dataTable no-footer">
                <thead>
                  <tr>
                    <th></th>
                    <th>S.No</th>
                    <th>Order By</th>
                    <th>Image</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                      </td>
                    </tr>
                  ) : banners.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    banners.map((banner, index) => (
                      <tr
                        key={banner.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, banner.id)}
                        onDragOver={(e) => handleDragOver(e, banner.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, banner.id)}
                        onDragEnd={handleDragEnd}
                        style={{
                          cursor: 'move',
                          backgroundColor:
                            dragOverItem === banner.id ? '#e3f2fd' : 'transparent',
                          opacity: draggedItem === banner.id ? 0.5 : 1,
                        }}
                      >
                        <td className="text-center">
                          <FontAwesomeIcon icon={faGripVertical} className="text-muted" />
                        </td>
                        <td>{(currentPage - 1) * perPage + index + 1}</td>
                        <td>{banner.order_by}</td>
                        <td>
                          {banner.image_path ? (
                            <img
                              src={banner.image_path}
                              alt={`Banner ${banner.order_by}`}
                              style={{ width: '50px', height: '30px', objectFit: 'cover' }}
                              className="img-thumbnail"
                            />
                          ) : (
                            <span className="text-muted">No Image</span>
                          )}
                        </td>
                        <td>
                          <ToggleSwitch
                            checked={banner.status === 1}
                            onChange={(checked) => handleStatusChange(banner.id, checked)}
                          />
                        </td>
                        <td>
                          {banner.created_at
                            ? new Date(banner.created_at).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td>
                          <div className="btn-group">
                            <Link
                              to={`/settings/banner-manager/${banner.id}/edit`}
                              className="btn btn-sm btn-outline-primary"
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(banner.id)}
                              title="Delete"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="dataTables_info">
              Showing {banners.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to{' '}
              {Math.min(currentPage * perPage, totalRecords)} of {totalRecords} entries
            </div>

            {totalPages > 1 && (
              <div className="dataTables_paginate paging_full_numbers">
                <button
                  className="paginate_button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(1)}
                >
                  First
                </button>
                <button
                  className="paginate_button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(0, 5)
                  .map((page) => (
                    <button
                      key={page}
                      className={`paginate_button ${currentPage === page ? 'current' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                <button
                  className="paginate_button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
                <button
                  className="paginate_button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(totalPages)}
                >
                  Last
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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

export default AdminBannerManager;
