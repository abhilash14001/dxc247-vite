import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import Notify from '@dxc247/shared/utils/Notify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';

const AdminCreateEditBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [formData, setFormData] = useState({
    image_path: null,
    order_by: '',
    status: 1,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (isEdit) loadBannerData();
  }, [id]);

  const loadBannerData = async () => {
    setInitialLoading(true);
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/banner/${id}`, 'GET', {}, true);
      if (response.success) {
        const data = response.data;
        setFormData({
          image_path: null,
          order_by: data.order_by || '',
          status: data.status || 1,
        });
        setPreviewImage(data.image_path ? `${data.image_path}` : null);
      } else {
        Notify(response.message || 'Failed to load banner data', null, null, 'danger');
        navigate('/settings/banner-manager');
      }
    } catch (error) {
      console.error('Error loading banner data:', error);
      Notify('Failed to load banner data. Please try again.', null, null, 'danger');
      navigate('/settings/banner-manager');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image_path: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image_path && !previewImage) {
      Notify('Please select a banner image', null, null, 'danger');
      return;
    }

    if (!formData.order_by) {
      Notify('Please enter order by', null, null, 'danger');
      return;
    }

    // Validate order_by is a valid integer
    const orderByValue = parseInt(formData.order_by);
    if (isNaN(orderByValue) || orderByValue < 0) {
      Notify('Order by must be a valid positive integer', null, null, 'danger');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();

      if (formData.image_path) submitData.append('image_path', formData.image_path);
      submitData.append('order_by', formData.order_by);
      submitData.append('status', formData.status);

      if (isEdit) {
        submitData.append('id', id);
        submitData.append('_method', 'PUT');
      }

      const endpoint = isEdit ? `banner/${id}` : 'banner/create';
      const method = 'POST';
      const response = await adminApi(`${ADMIN_BASE_PATH}/${endpoint}`, method, submitData, true);

      // Handle successful response
      if (response && response.success) {
        Notify(isEdit ? 'Banner updated successfully!' : 'Banner created successfully!', null, null, 'success');
        navigate('/settings/banner-manager');
        return;
      }

      // Handle API error responses
      if (response && !response.success) {
        if (response.errors) {
          // Handle nested errors object like {order_by: ["The order by must be an integer."]}
          const errorMessages = [];
          Object.keys(response.errors).forEach(field => {
            if (Array.isArray(response.errors[field])) {
              errorMessages.push(...response.errors[field]);
            } else {
              errorMessages.push(response.errors[field]);
            }
          });
          Notify(errorMessages.join(', '), null, null, 'danger');
        } else {
          Notify(response.message || `Failed to ${isEdit ? 'update' : 'create'} banner`, null, null, 'danger');
        }
        setLoading(false);
        return;
      }

      // Handle unexpected response format
      if (!response) {
        Notify('No response received from server', null, null, 'danger');
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} banner:`, error);
      
      // Handle HTTP error responses
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 422) {
          // Validation errors
          if (errorData.errors) {
            const errorMessages = [];
            Object.keys(errorData.errors).forEach(field => {
              if (Array.isArray(errorData.errors[field])) {
                errorMessages.push(...errorData.errors[field]);
              } else {
                errorMessages.push(errorData.errors[field]);
              }
            });
            Notify(errorMessages.join(', '), null, null, 'danger');
          } else {
            Notify(errorData.message || 'Validation failed', null, null, 'danger');
          }
        } else if (status === 401) {
          Notify('Unauthorized. Please login again.', null, null, 'danger');
          navigate('/login');
        } else if (status === 403) {
          Notify('Access denied. You do not have permission to perform this action.', null, null, 'danger');
        } else if (status === 404) {
          Notify('Resource not found. Please refresh and try again.', null, null, 'danger');
        } else if (status === 500) {
          Notify('Server error. Please try again later.', null, null, 'danger');
        } else {
          Notify(errorData.message || `Server error (${status}). Please try again.`, null, null, 'danger');
        }
      } else if (error.request) {
        // Network error
        Notify('Network error. Please check your connection and try again.', null, null, 'danger');
      } else {
        // Other errors
        Notify(`Failed to ${isEdit ? 'update' : 'create'} banner. Please try again.`, null, null, 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  if (initialLoading && isEdit) {
    return (
      <div className="row">
        <div className="col-md-12 main-container">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="add-account">
          <h2 className="m-b-20">
            Banner / {isEdit ? 'Edit' : 'Create'}
            <button
              className="btn btn-secondary btn-sm ms-2 pull-right"
              onClick={() => navigate('/settings/banner-manager')}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Back to List
            </button>
          </h2>

          <form onSubmit={handleSubmit} className="form-horizontal" encType="multipart/form-data">
            <div className="row account-list">
              {/* Banner Image */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label htmlFor="image_path">Select Banner Image</label>
                  <input
                    type="file"
                    name="image_path"
                    className="form-control"
                    id="image_path"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!isEdit}
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Banner Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '100px',
                          objectFit: 'contain',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                        }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Order By */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label htmlFor="order_by">Order By</label>
                  <input
                    type="number"
                    name="order_by"
                    className="form-control"
                    id="order_by"
                    value={formData.order_by}
                    onChange={(e) => handleInputChange('order_by', e.target.value)}
                    min="0"
                    step="1"
                    required
                  />
                </div>
              </div>

              {/* Status */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    id="status1"
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', parseInt(e.target.value))}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ marginTop: '25px', padding: '6px 12px' }}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                        {isEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateEditBanner;
