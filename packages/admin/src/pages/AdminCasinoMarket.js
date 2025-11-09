import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus,
  faEdit,
  faTrash,
  faImage,
  faVideo,
  faCog,
  faSort,
  faSortUp,
  faSortDown,
  faGripVertical
} from '@fortawesome/free-solid-svg-icons';
import NoRecordsFound from '@dxc247/shared/components/common/NoRecordsFound';
import { toast } from 'react-toastify';
import { useConfirmModal } from '@dxc247/shared/components/ui/useConfirmModal';
import LoadingSpinner from '@dxc247/shared/components/ui/LoadingSpinner';
import ConfirmModal from '@dxc247/shared/components/ui/ConfirmModal';

function AdminCasinoMarket() {
  const [casinos, setCasinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [isUpdatingPositions, setIsUpdatingPositions] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const { modal: confirmModal, showConfirm, hideModal } = useConfirmModal();
  const [imageModal, setImageModal] = useState({
    show: false,
    casinoId: null,
    currentImage: '',
    uploading: false,
    uploadProgress: 0,
    selectedFile: null
  });

  useEffect(() => {
    loadCasinos();
  }, [activeTab]);

  const loadCasinos = async () => {
    try {
      setLoading(true);
      
      // Call the admin/get-casino-list API with ?all=1 query parameter
      const response = await adminApi(`${ADMIN_BASE_PATH}/get-casino-list?all=1`, "GET", {}, true);
      
      if (response.success) {
        // Filter casinos based on active tab (main or virtual)
        const filteredCasinos = (response.data || []).filter(casino => {
          // Assuming the API returns a casino_type field or similar
          // Adjust this logic based on your actual API response structure
          if (activeTab === 'main') {
            return !casino.casino_type || casino.casino_type === 'main';
          } else {
            return casino.casino_type === 'virtual';
          }
        });

        // Transform the API response to match our component structure
        const transformedCasinos = filteredCasinos.map(casino => ({
          id: casino.id,
          match_name: casino.match_name || casino.name || 'Unknown',
          casino_image: casino.casino_image || casino.image || '',
          casino_video: casino.casino_video || casino.video_url || '',
          status: casino.status === 1 || casino.status === 'active' ? 'active' : 'inactive',
          position: casino.casino_sort || casino.sort_order || 1
        }));

        setCasinos(transformedCasinos);
        
      } else {
        console.error("Failed to load casino list:", response.message);
        setCasinos([]);
      }
    } catch (error) {
      console.error('Error loading casino list:', error);
      setCasinos([]);
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

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <FontAwesomeIcon icon={faSort} className="text-muted" />;
    }
    return sortDirection === 'asc' ? 
      <FontAwesomeIcon icon={faSortUp} /> : 
      <FontAwesomeIcon icon={faSortDown} />;
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? 
      <span className="badge badge-success" data-toggle="tooltip" title="Active">Active</span> :
      <span className="badge badge-danger" data-toggle="tooltip" title="InActive">InActive</span>;
  };

  const handleStatusToggle = async (casino) => {
    const newStatus = casino.status === 'active' ? 'deactive' : 'active';
    const casinoId = casino.id;
    
    try {
      setUpdatingStatus(prev => ({ ...prev, [casinoId]: true }));
      
      const response = await adminApi(`${ADMIN_BASE_PATH}/update-casino-status`, 'POST', {
        casino_id: casinoId,
        status: newStatus
      }, true);
      
      if (response.success) {
        // Update the casino status in the local state
        setCasinos(prevCasinos => 
          prevCasinos.map(c => 
            c.id === casinoId 
              ? { ...c, status: newStatus }
              : c
          )
        );
        
        // Show success toast
        toast.success(`Casino ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(response.message || 'Failed to update casino status');
      }
    } catch (error) {
      console.error('Error updating casino status:', error);
      toast.error(`Failed to ${newStatus === 'active' ? 'activate' : 'deactivate'} casino. Please try again.`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [casinoId]: false }));
    }
  };

  const getStatusToggleLink = (casino) => {
    const newStatus = casino.status === 'active' ? 'deactive' : 'active';
    const linkText = casino.status === 'active' ? 'Is DeActive ?' : 'Is Active ?';
    const isUpdating = updatingStatus[casino.id];
    
    return (
      <button 
        onClick={() => handleStatusToggle(casino)}
        className="badge badge-danger ml-3"
        disabled={isUpdating}
        style={{ 
          cursor: isUpdating ? 'not-allowed' : 'pointer',
          opacity: isUpdating ? 0.6 : 1
        }}
      >
        {isUpdating ? 'Updating...' : linkText}
      </button>
    );
  };


  const handleSetImage = (casinoId, currentImage) => {
    setImageModal({
      show: true,
      casinoId: casinoId,
      currentImage: currentImage,
      uploading: false,
      uploadProgress: 0
    });
  };

  const closeImageModal = () => {
    setImageModal({
      show: false,
      casinoId: null,
      currentImage: '',
      uploading: false,
      uploadProgress: 0,
      selectedFile: null
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Store the selected file
    setImageModal(prev => ({ ...prev, selectedFile: file }));
  };

  const handleImageUpload = async () => {
    if (!imageModal.selectedFile) {
      toast.error('Please select an image file first', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setImageModal(prev => ({ ...prev, uploading: true, uploadProgress: 0 }));

    try {
      const formData = new FormData();
      formData.append('image', imageModal.selectedFile);
      formData.append('casino_id', imageModal.casinoId);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setImageModal(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90)
        }));
      }, 200);

      const response = await adminApi(`${ADMIN_BASE_PATH}/upload-casino-image`, 'POST', formData, true);

      clearInterval(progressInterval);
      setImageModal(prev => ({ ...prev, uploadProgress: 100 }));

      if (response.success) {
        // Update the casino image in local state
        setCasinos(prevCasinos => 
          prevCasinos.map(casino => 
            casino.id === imageModal.casinoId 
              ? { ...casino, casino_image: response.data.casino_image }
              : casino
          )
        );

        toast.success('Image uploaded successfully!', {
          position: "top-right",
          autoClose: 3000,
        });

        // Close modal after a short delay to show 100% progress
        setTimeout(() => {
          closeImageModal();
        }, 1000);
      } else {
        throw new Error(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      setImageModal(prev => ({ ...prev, uploading: false, uploadProgress: 0 }));
    }
  };

  const handleSetVideoURL = (casinoId, currentVideoURL) => {
    // Implement video URL setting logic
  };

  const handleSetBetLimit = (casinoId) => {
    // Implement bet limit setting logic
  };

  const handleDeleteCasino = async (casinoId) => {
    await showConfirm({
      title: "Delete Casino",
      message: "Are you sure you want to delete this casino? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        performDelete(casinoId);
      }
    });
  };

  const performDelete = async (casinoId) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [casinoId]: true }));
      
      const response = await adminApi(`${ADMIN_BASE_PATH}/delete-casino/${casinoId}`, 'DELETE', {}, true);
      
      if (response.success) {
        // Remove the casino from the local state
        setCasinos(prevCasinos => 
          prevCasinos.filter(casino => casino.id !== casinoId)
        );
        
        // Show success toast
        toast.success('Casino deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(response.message || 'Failed to delete casino');
      }
    } catch (error) {
      console.error('Error deleting casino:', error);
      toast.error(`Failed to delete casino: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [casinoId]: false }));
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, casinoId) => {
    setDraggedItem(casinoId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.style.opacity = '0.5';
  };

  const handleDragOver = (e, casinoId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(casinoId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverItem(null);
  };

  const handleDrop = async (e, targetCasinoId) => {
    e.preventDefault();
    const sourceCasinoId = draggedItem;
    
    if (sourceCasinoId === targetCasinoId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Find the indices of source and target casinos
    const sourceIndex = casinos.findIndex(casino => casino.id === sourceCasinoId);
    const targetIndex = casinos.findIndex(casino => casino.id === targetCasinoId);

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Create new array with reordered items
    const newCasinos = [...casinos];
    const [movedCasino] = newCasinos.splice(sourceIndex, 1);
    newCasinos.splice(targetIndex, 0, movedCasino);

    // Update positions
    const updatedCasinos = newCasinos.map((casino, index) => ({
      ...casino,
      position: index + 1
    }));

    setCasinos(updatedCasinos);
    setDraggedItem(null);
    setDragOverItem(null);

    // Update positions on server
    await updateCasinoPositions(updatedCasinos);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const updateCasinoPositions = async (updatedCasinos) => {
    try {
      setIsUpdatingPositions(true);
      
      // Create a single API call with all position updates
      const positionUpdates = updatedCasinos.map((casino, index) => ({
        id: casino.id,
        position: index + 1,
        casino_sort: index + 1
      }));

      
      const response = await adminApi(`${ADMIN_BASE_PATH}/update-casino-positions`, 'PUT', {
        positions: positionUpdates,
        casino_type: activeTab // Include the current tab to update the correct casino type
      }, true);

      if (response.success) {
      } else {
        throw new Error(response.message || 'Failed to update positions');
      }
    } catch (error) {
      console.error('Error updating casino positions:', error);
      // Show error message to user
      alert('Failed to update casino positions. Please try again.');
      // Reload the data to revert changes if update fails
      loadCasinos();
    } finally {
      setIsUpdatingPositions(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .admin-casino-market thead tr th:last-child,
          .admin-casino-market tbody tr td:last-child{
              text-align: right;
          }
          .admin-casino-market thead tr th,
          .admin-casino-market tbody tr td{
              font-size: 18px;
          }
          .admin-casino-market .form-control:focus{
              border: 1px solid #e2e2e2;
          }
          .admin-casino-market tbody tr[draggable] {
              cursor: move;
          }
          .admin-casino-market tbody tr[draggable]:hover {
              background-color: #f8f9fa;
          }
          .admin-casino-market tbody tr.drag-over {
              background-color: #e3f2fd;
              border: 2px dashed #2196f3;
          }
        `}
      </style>
      <div className="admin-casino-market">
        <div className="col-md-12 main-container">
          <div className="listing-grid">
            <div className="detail-row">
              <h2 className="d-inline-block">Casino List</h2>
              <div className="float-right">
                {isUpdatingPositions && (
                  <span className="badge badge-info mr-2">
                    <FontAwesomeIcon icon={faCog} className="fa-spin" /> Updating positions...
                  </span>
                )}
                <Link 
                  to={`/casinos/create`} 
                  className="btn btn-primary cursor-pointer mb-2"
                >
                  <FontAwesomeIcon icon={faPlus} /> Add New Casino
                </Link>
              </div>
            </div>

            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeTab === 'main' ? 'active' : ''}`} 
                  data-toggle="tab" 
                  href="#main"
                  onClick={(e) => { e.preventDefault(); setActiveTab('main'); }}
                >
                  Main
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${activeTab === 'virtual' ? 'active' : ''}`} 
                  data-toggle="tab" 
                  href="#virtual"
                  onClick={(e) => { e.preventDefault(); setActiveTab('virtual'); }}
                >
                  Virtual
                </a>
              </li>
            </ul>

            {/* Tab panes */}
            <div className="tab-content">
              <div className={`tab-pane ${activeTab === 'main' ? 'active' : ''}`} id="main">
                <div className="table-responsive data-table table_draggable">
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-striped ListAllHideHeader">
                          <thead>
                            <tr>
                              <th style={{ width: '40px' }}>Move</th>
                              <th>SR. NO.</th>
                              <th>Image</th>
                              <th 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSort('match_name')}
                              >
                                Match Name {getSortIcon('match_name')}
                              </th>
                              <th 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSort('casino_video')}
                              >
                                Video URL {getSortIcon('casino_video')}
                              </th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {casinos.length > 0 ? (
                              casinos.map((casino, index) => (
                                <tr 
                                  key={casino.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, casino.id)}
                                  onDragOver={(e) => handleDragOver(e, casino.id)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, casino.id)}
                                  onDragEnd={handleDragEnd}
                                  style={{
                                    cursor: 'move',
                                    backgroundColor: dragOverItem === casino.id ? '#f8f9fa' : 'transparent',
                                    opacity: draggedItem === casino.id ? 0.5 : 1
                                  }}
                                >
                                  <td style={{ textAlign: 'center' }}>
                                    <FontAwesomeIcon 
                                      icon={faGripVertical} 
                                      style={{ color: '#6c757d', cursor: 'grab' }}
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>
                                    <img 
                                      className="img-responsive" 
                                      src={casino.casino_image} 
                                      alt={casino.match_name} 
                                      width="60" 
                                      style={{ margin: '5px 0' }}
                                    />
                                  </td>
                                  <td>{casino.match_name}</td>
                                  <td>{casino.casino_video}</td>
                                  <td>
                                    {getStatusBadge(casino.status)}
                                    {getStatusToggleLink(casino)}
                                  </td>
                                  <td>
                                    <a 
                                      href="#" 
                                      onClick={(e) => e.preventDefault()}
                                      className="btn btn-success btn-sm me-1"
                                    >
                                      {casino.position}
                                    </a>
                                    <a 
                                      href="#" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSetImage(casino.id, casino.casino_image);
                                      }} 
                                      className="btn btn-warning btn-sm me-1"
                                    >
                                      <FontAwesomeIcon icon={faImage} /> Set Image
                                    </a>
                                    <a 
                                      href="#" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSetVideoURL(casino.id, casino.casino_video);
                                      }} 
                                      className="btn btn-primary btn-sm me-1"
                                    >
                                      <FontAwesomeIcon icon={faVideo} /> Set URL
                                    </a>
                                    
                                    <Link 
                                      to={`/casinos/edit/${casino.id}`} 
                                      className="btn btn-warning btn-sm me-1"
                                    >
                                      <FontAwesomeIcon icon={faEdit} /> Edit
                                    </Link>
                                    <button 
                                      onClick={() => handleDeleteCasino(casino.id)} 
                                      className="btn btn-danger btn-sm"
                                      disabled={updatingStatus[casino.id]}
                                      style={{ 
                                        cursor: updatingStatus[casino.id] ? 'not-allowed' : 'pointer',
                                        opacity: updatingStatus[casino.id] ? 0.6 : 1
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTrash} /> 
                                      {updatingStatus[casino.id] ? 'Deleting...' : 'Delete'}
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <NoRecordsFound colSpan={7} />
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`tab-pane ${activeTab === 'virtual' ? 'active' : ''}`} id="virtual">
                <div className="table-responsive data-table table_draggable">
                  <div className="card">
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-striped ListAllHideHeader">
                          <thead>
                            <tr>
                              <th style={{ width: '40px' }}>Move</th>
                              <th>SR. NO.</th>
                              <th>Image</th>
                              <th 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSort('match_name')}
                              >
                                Match Name {getSortIcon('match_name')}
                              </th>
                              <th 
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleSort('casino_video')}
                              >
                                Video URL {getSortIcon('casino_video')}
                              </th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {casinos.length > 0 ? (
                              casinos.map((casino, index) => (
                                <tr 
                                  key={casino.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, casino.id)}
                                  onDragOver={(e) => handleDragOver(e, casino.id)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, casino.id)}
                                  onDragEnd={handleDragEnd}
                                  style={{
                                    cursor: 'move',
                                    backgroundColor: dragOverItem === casino.id ? '#f8f9fa' : 'transparent',
                                    opacity: draggedItem === casino.id ? 0.5 : 1
                                  }}
                                >
                                  <td style={{ textAlign: 'center' }}>
                                    <FontAwesomeIcon 
                                      icon={faGripVertical} 
                                      style={{ color: '#6c757d', cursor: 'grab' }}
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>
                                    <img 
                                      className="img-responsive" 
                                      src={casino.casino_image} 
                                      alt={casino.match_name} 
                                      width="60" 
                                      style={{ margin: '5px 0' }}
                                    />
                                  </td>
                                  <td>{casino.match_name}</td>
                                  <td>{casino.casino_video}</td>
                                  <td>
                                    {getStatusBadge(casino.status)}
                                    {getStatusToggleLink(casino)}
                                  </td>
                                  <td>
                                    <a 
                                      href="#"
                                      onClick={(e) => e.preventDefault()} 
                                      className="btn btn-success btn-sm me-1"
                                    >
                                      {casino.casino_sort}
                                    </a>
                                    <a 
                                      href="#" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSetImage(casino.id, casino.casino_image);
                                      }} 
                                      className="btn btn-warning btn-sm me-1"
                                    >
                                      <FontAwesomeIcon icon={faImage} /> Set Image
                                    </a>
                                    <a 
                                      href="#" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSetVideoURL(casino.id, casino.casino_video);
                                      }} 
                                      className="btn btn-primary btn-sm me-1"
                                    >
                                      <FontAwesomeIcon icon={faVideo} /> Set URL
                                    </a>
                                    <a 
                                      href="#" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleSetBetLimit(casino.id);
                                      }} 
                                      className="btn btn-info btn-sm me-1"
                                    >
                                      <FontAwesomeIcon icon={faCog} /> Bet Limit
                                    </a>
                                    <Link 
                                      to={`/casinos/edit/${casino.id}`} 
                                      className="btn btn-warning btn-sm me-1"
                                    >
                                      <FontAwesomeIcon icon={faEdit} /> Edit
                                    </Link>
                                    <button 
                                      onClick={() => handleDeleteCasino(casino.id)} 
                                      className="btn btn-danger btn-sm"
                                      disabled={updatingStatus[casino.id]}
                                      style={{ 
                                        cursor: updatingStatus[casino.id] ? 'not-allowed' : 'pointer',
                                        opacity: updatingStatus[casino.id] ? 0.6 : 1
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTrash} /> 
                                      {updatingStatus[casino.id] ? 'Deleting...' : 'Delete'}
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <NoRecordsFound colSpan={7} />
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

      {/* Image Upload Modal */}
      {imageModal.show && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Casino Image</h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeImageModal}
                  disabled={imageModal.uploading}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* Current Image Preview */}
                {imageModal.currentImage && (
                  <div className="mb-3">
                    <label className="form-label">Current Image:</label>
                    <div>
                      <img
                        src={imageModal.currentImage}
                        alt="Current casino"
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                        className="img-thumbnail"
                      />
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="mb-3">
                  <label htmlFor="imageUpload" className="form-label">
                    Select New Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={imageModal.uploading}
                  />
                  <div className="form-text">
                    Supported formats: JPG, PNG, JPEG. Max size: 2MB
                  </div>
                </div>

                {/* Selected File Preview */}
                {imageModal.selectedFile && (
                  <div className="mb-3">
                    <label className="form-label">Selected Image Preview:</label>
                    <div>
                      <img
                        src={URL.createObjectURL(imageModal.selectedFile)}
                        alt="Selected image"
                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                        className="img-thumbnail"
                      />
                      <div className="mt-2">
                        <small className="text-muted">
                          File: {imageModal.selectedFile.name} ({(imageModal.selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Progress */}
                {imageModal.uploading && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Uploading image...</span>
                      <span>{imageModal.uploadProgress}%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: `${imageModal.uploadProgress}%` }}
                        aria-valuenow={imageModal.uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {imageModal.uploadProgress}%
                      </div>
                    </div>
                    {imageModal.uploadProgress === 100 && (
                      <div className="text-success mt-2">
                        <FontAwesomeIcon icon={faImage} className="me-2" />
                        Image uploaded successfully!
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeImageModal}
                  disabled={imageModal.uploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleImageUpload}
                  disabled={imageModal.uploading || !imageModal.selectedFile}
                >
                  {imageModal.uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {imageModal.show && <div className="modal-backdrop fade show"></div>}
    </>
  );
}

export default AdminCasinoMarket;