import React, { useState, useEffect } from 'react';
import { adminApi } from './adminApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { 
  faSave,
  faTimes,
  faArrowLeft,
  faImage,
  faUpload,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import LoadingSpinner from '@dxc247/shared/components/ui/LoadingSpinner';

function CasinoForm({ casinoId = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    casino_name: '',
    casino_type: '',
    match_id: '',
    casino_sort: 80,
    odd_min_limit: 0,
    odd_max_limit: 0,
    casino_image: null,
    image_type: 'file',
    image_url: '',
    video_url: '',
    status: '1',
    inplay: '1',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (casinoId) {
      setIsEdit(true);
      loadCasinoData();
    }
  }, [casinoId]);

  useEffect(() => {
    // Handle object URL preview for file uploads
    if (formData.image_type === 'file' && formData.casino_image) {
      const objectUrl = URL.createObjectURL(formData.casino_image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl('');
    }
  }, [formData.casino_image, formData.image_type]);

  const loadCasinoData = async () => {
    try {
      setLoading(true);
      const response = await adminApi(`${ADMIN_BASE_PATH}/get-casino/${casinoId}`, 'GET');
      if (response.success) {
        const casino = response.data;
        setFormData({
          casino_name: casino.casino_name || casino.match_name || '',
          casino_type: casino.casino_type || '',
          match_id: casino.match_id || '',
          casino_sort: casino.casino_sort || 80,
          odd_min_limit: casino.odd_min_limit || 0,
          odd_max_limit: casino.odd_max_limit || 0,
          casino_image: null,
          image_type: 'url',
          image_url: casino.casino_image || '',
          video_url: casino.casino_video || casino.video_url || '',
          status: casino.status === 1 || casino.status === 'active' ? '1' : '0',
          inplay: casino.inplay || '1',
          description: casino.description || ''
        });
      } else {
        throw new Error(response.message || 'Failed to load casino data');
      }
    } catch (error) {
      console.error('Error loading casino data:', error);
      toast.error('Failed to load casino data. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (checked ? '1' : '0') : (type === 'file' ? files[0] : value)
      };
      if (name === 'image_type') {
        if (value === 'file') {
          newData.image_url = '';
          newData.casino_image = null;
        } else if (value === 'url') {
          newData.casino_image = null;
        }
      }
      return newData;
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB', { position: "top-right", autoClose: 3000 });
      e.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file', { position: "top-right", autoClose: 3000 });
      e.target.value = '';
      return;
    }

    setFormData(prev => ({ ...prev, casino_image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.image_type === 'file' && !formData.casino_image) {
      toast.error('Please select an image file', { position: "top-right", autoClose: 3000 });
      return;
    }

    if (formData.image_type === 'url' && !formData.image_url.trim()) {
      toast.error('Please enter an image URL', { position: "top-right", autoClose: 3000 });
      return;
    }

    if (formData.image_type === 'url' && formData.image_url.trim()) {
      try { new URL(formData.image_url); } 
      catch { 
        toast.error('Please enter a valid URL format (https://example.com/image.jpg)', { position: "top-right", autoClose: 3000 });
        return;
      }
    }

    setLoading(true);

    try {
      let submitData;
      if (formData.image_type === 'file') {
        submitData = new FormData();
        if (isEdit) {
          submitData.append('casino_id', casinoId);
          submitData.append('_method', 'PUT');
        }
        submitData.append('casino_name', formData.casino_name);
        submitData.append('casino_type', formData.casino_type);
        submitData.append('match_id', formData.match_id);
        submitData.append('casino_sort', parseInt(formData.casino_sort));
        submitData.append('odd_min_limit', parseFloat(formData.odd_min_limit));
        submitData.append('odd_max_limit', parseFloat(formData.odd_max_limit));
        submitData.append('video_url', formData.video_url);
        submitData.append('status', parseInt(formData.status));
        submitData.append('inplay', parseInt(formData.inplay));
        submitData.append('description', formData.description);
        submitData.append('image_type', formData.image_type);
        submitData.append('casino_image', formData.casino_image);
      } else {
        submitData = {
          ...(isEdit && { casino_id: casinoId, _method: 'PUT' }),
          casino_name: formData.casino_name,
          casino_type: formData.casino_type,
          match_id: formData.match_id,
          casino_sort: parseInt(formData.casino_sort),
          odd_min_limit: parseFloat(formData.odd_min_limit),
          odd_max_limit: parseFloat(formData.odd_max_limit),
          video_url: formData.video_url,
          status: parseInt(formData.status),
          inplay: parseInt(formData.inplay),
          description: formData.description,
          image_type: formData.image_type,
          image_url: formData.image_url || (isEdit ? formData.casino_image : '')
        };
      }

      const endpoint = isEdit ? `${ADMIN_BASE_PATH}/update-casino/${casinoId}` : `${ADMIN_BASE_PATH}/create-casino`;
      const method = 'POST';

      const response = await adminApi(endpoint, method, submitData);

      if (response.success) {
        toast.success(`Casino ${isEdit ? 'updated' : 'created'} successfully!`, { position: "top-right", autoClose: 3000 });
        if (onSuccess) onSuccess(response.data);
      } else {
        toast.error(response.message || `Failed to ${isEdit ? 'update' : 'create'} casino. Please try again.`, { position: "top-right", autoClose: 5000 });
      }
    } catch {
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} casino. Please try again.`, { position: "top-right", autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <LoadingSpinner centered height="400px" />;

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid mb-3">
          <div className="detail-row d-flex justify-content-between align-items-center">
            <h2>{isEdit ? 'Edit Casino' : 'Add New Casino'}</h2>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Casino List
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Casino Name */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="casino_name" className="form-label">Casino Name <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" id="casino_name" name="casino_name" value={formData.casino_name} onChange={handleInputChange} required />
                </div>

                {/* Casino Type */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="casino_type" className="form-label">Casino Type <span className="text-danger">*</span></label>
                  <select className="form-control" id="casino_type" name="casino_type" value={formData.casino_type} onChange={handleInputChange} required>
                    <option value="">Select Casino Type</option>
                    <option value="main">Main Casino</option>
                    <option value="virtual">Virtual Casino</option>
                  </select>
                </div>

                {/* Match ID */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="match_id" className="form-label">Match ID <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" id="match_id" name="match_id" value={formData.match_id} onChange={handleInputChange} required />
                </div>

                {/* Position */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="casino_sort" className="form-label">Position</label>
                  <input type="number" className="form-control" id="casino_sort" name="casino_sort" value={formData.casino_sort} onChange={handleInputChange} min="0" />
                  <small className="form-text text-muted">Auto-generated: {formData.casino_sort}</small>
                </div>

                {/* Min Bet Limit */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="odd_min_limit" className="form-label">Min Bet Limit</label>
                  <input type="number" className="form-control" id="odd_min_limit" name="odd_min_limit" value={formData.odd_min_limit} onChange={handleInputChange} min="0" step="0.01" />
                </div>

                {/* Max Bet Limit */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="odd_max_limit" className="form-label">Max Bet Limit</label>
                  <input type="number" className="form-control" id="odd_max_limit" name="odd_max_limit" value={formData.odd_max_limit} onChange={handleInputChange} min="0" step="0.01" />
                </div>

                {/* Image Type Selection */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Casino Image <span className="text-danger">*</span></label>
                  <div className="btn-group w-100 mb-2" role="group">
                    <input type="radio" name="image_type" value="file" id="image_file" className="btn-check" checked={formData.image_type === 'file'} onChange={handleInputChange} />
                    <label htmlFor="image_file" className="btn btn-outline-primary"><FontAwesomeIcon icon={faUpload} className="me-1" /> Upload File</label>
                    <input type="radio" name="image_type" value="url" id="image_url" className="btn-check" checked={formData.image_type === 'url'} onChange={handleInputChange} />
                    <label htmlFor="image_url" className="btn btn-outline-primary"><FontAwesomeIcon icon={faImage} className="me-1" /> Image URL</label>
                  </div>

                  {/* File Upload */}
                  {formData.image_type === 'file' && (
                    <div className="mb-2">
                      <input type="file" className="form-control" id="casino_image" name="casino_image" accept="image/png,image/gif,image/jpeg" onChange={handleFileSelect} required />
                      <small className="form-text text-muted">Supported formats: PNG, GIF, JPEG (Max 5MB)</small>
                      {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '100px', maxHeight: '80px', objectFit: 'cover', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }} />}
                    </div>
                  )}

                  {/* URL Input */}
                  {formData.image_type === 'url' && (
                    <div className="mb-2">
                      <input type="url" className="form-control" id="image_url_input" name="image_url" value={formData.image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" required />
                      <small className="form-text text-muted">Enter a valid image URL</small>
                      {isEdit && formData.image_url && (
                        <img src={formData.image_url} alt="Current" style={{ maxWidth: '100px', maxHeight: '80px', objectFit: 'cover', marginTop: '5px', border: '1px solid #ddd', borderRadius: '4px' }} />
                      )}
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="video_url" className="form-label">Video URL</label>
                  <input type="url" className="form-control" id="video_url" name="video_url" value={formData.video_url} onChange={handleInputChange} placeholder="https://example.com/video" />
                </div>

                {/* Status */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="status" className="form-label">Status</label>
                  <select className="form-control" id="status" name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                {/* Inplay */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="inplay" className="form-label">Inplay Status</label>
                  <select className="form-control" id="inplay" name="inplay" value={formData.inplay} onChange={handleInputChange}>
                    <option value="1">Enable</option>
                    <option value="0">Disable</option>
                  </select>
                </div>

                {/* Description */}
                <div className="col-md-12 mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleInputChange} placeholder="Enter casino description" />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="text-center">
                <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                  {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> : <><FontAwesomeIcon icon={faSave} className="me-1" /> {isEdit ? 'Update Casino' : 'Create Casino'}</>}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
                  <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CasinoForm;
