import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { setLiveModeData } from '@dxc247/shared/store/slices/commonDataSlice';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import CenteredSpinner from '@dxc247/shared/components/ui/CenteredSpinner';

const AdminCreateEditPrefix = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [formData, setFormData] = useState({
    domain_name: '',
    title: '',
    favi_icon: null,
    logo: null,
    site_bg_color: '#c86a6a',
    site_menu_color: '#33656A',
    site_front_user_announcement: '',
    site_back_user_announcement: '',
    login_page_email: '',
    user_inspect_redirect: '',
    facebook_link: '',
    instagram_link: '',
    telegram_link: '',
    twitter_link: '',
    is_demo_login: false,
    side_live_mode: false,
    is_user_delete_disable: false,
    master_password: ''
  });

  const [previewImages, setPreviewImages] = useState({
    favi_icon: null,
    logo: null
  });

  // Load prefix data for editing
  useEffect(() => {
    if (isEdit) {
      loadPrefixData();
    }
  }, [id]);

  const loadPrefixData = async () => {
    setInitialLoading(true);
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/prefix/details`, 'POST', {
        id: id
      }, true);

      if (response.success) {
        const data = response.data;
        setFormData({
          domain_name: data.domain_name || '',
          title: data.title || '',
          favi_icon: null,
          logo: null,
          site_bg_color: data.site_bg_color || '#c86a6a',
          site_menu_color: data.site_menu_color || '#33656A',
          site_front_user_announcement: data.site_front_user_announcement || '',
          site_back_user_announcement: data.site_back_user_announcement || '',
          login_page_email: data.login_page_email || '',
          user_inspect_redirect: data.user_inspect_redirect || '',
          facebook_link: data.facebook_link || '',
          instagram_link: data.instagram_link || '',
          telegram_link: data.telegram_link || '',
          twitter_link: data.twitter_link || '',
          is_demo_login: data.is_demo_login || false,
          side_live_mode: data.side_live_mode || false,
          is_user_delete_disable: data.is_user_delete_disable || false,
          master_password: ''
        });

        // Set preview images for existing files
        setPreviewImages({
          favi_icon: data.favi_icon || null,
          logo: data.logo || null
        });
      } else {
        toast.error(response.message || 'Failed to load prefix data');
        navigate('/settings/manage-prefix');
      }
    } catch (error) {
      console.error('Error loading prefix data:', error);
      toast.error('Failed to load prefix data. Please try again.');
      navigate('/settings/manage-prefix');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));

    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages(prev => ({
        ...prev,
        [field]: previewUrl
      }));
    } else {
      setPreviewImages(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.domain_name || !formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.master_password) {
      toast.error('Transaction password is required');
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'favi_icon' || key === 'logo') {
          if (formData[key]) {
            submitData.append(key, formData[key]);
          }
        } else if (key === 'master_password') {
          submitData.append('master_password', formData[key]);
        } else if (key === 'is_demo_login' || key === 'side_live_mode' || key === 'is_user_delete_disable') {
          // Convert boolean to 0 or 1 for API
          submitData.append(key, formData[key] ? 1 : 0);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add id for edit mode
      if (isEdit) {
        submitData.append('id', id);
      }

      const endpoint = isEdit ? 'prefix/update' : 'prefix/create';
      const response = await adminApi(`${ADMIN_BASE_PATH}/${endpoint}`, 'POST', submitData, true);

      if (response.success) {
        toast.success(isEdit ? 'Prefix updated successfully!' : 'Prefix created successfully!');
        
        // Refresh liveModeData to update login theme
        try {
          const liveModeResponse = await adminApi(`${ADMIN_BASE_PATH}/domain-details`, 'GET');
          if (liveModeResponse) {
            dispatch(setLiveModeData(liveModeResponse));
          }
        } catch (themeError) {
          console.error('Error refreshing login theme:', themeError);
          // Don't show error to user as prefix update was successful
        }
        
        navigate('/settings/manage-prefix');
      } else {
        // Show server validation message for 422 errors
        if (response.errors) {
          // Handle validation errors
          const errorMessages = Object.values(response.errors).flat();
          toast.error(errorMessages.join(', '));
        } else {
          toast.error(response.message || `Failed to ${isEdit ? 'update' : 'create'} prefix`);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} prefix:`, error);
      // Check if it's a 422 validation error
      if (error.response && error.response.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          toast.error(errorMessages.join(', '));
        } else {
          toast.error(errorData.message || 'Validation failed');
        }
      } else {
        toast.error(`Failed to ${isEdit ? 'update' : 'create'} prefix. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previewImages).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewImages]);

  if (initialLoading && isEdit) {
    return (
      <div className="col-md-12 main-container">
        <CenteredSpinner 
          size="50px"
          color="#007bff"
          style={{ height: '400px' }}
        />
      </div>
    );
  }

  return (
    <div className="col-md-12 main-container">
      <div className="listing-grid">
        <div className="detail-row">
          <h2 className="d-inline-block">
            Prefix Domain Management / {isEdit ? 'Edit Domain' : 'Create Domain'}
            <button
              className="btn btn-secondary btn-sm ms-2 pull-right"
              onClick={() => navigate('/settings/manage-prefix')}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              Back to List
            </button>
          </h2>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="domain_name">Domain Name *</label>
                  <input
                    className="form-control"
                    type="text"
                    name="domain_name"
                    id="domain_name"
                    value={formData.domain_name}
                    onChange={(e) => handleInputChange('domain_name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="title">Site Title *</label>
                  <input
                    className="form-control"
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="favi_icon">Favicon</label>
                  <input
                    type="file"
                    name="favi_icon"
                    className="form-control"
                    id="favi_icon"
                    accept="image/*"
                    onChange={(e) => handleFileChange('favi_icon', e.target.files[0])}
                  />
                  {previewImages.favi_icon && (
                    <div className="mt-2">
                      <img
                        src={previewImages.favi_icon}
                        alt="Favicon Preview"
                        style={{ height: '150px', width: '150px', objectFit: 'contain' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="logo">Logo</label>
                  <input
                    type="file"
                    name="logo"
                    className="form-control"
                    id="logo"
                    accept="image/*"
                    onChange={(e) => handleFileChange('logo', e.target.files[0])}
                  />
                  {previewImages.logo && (
                    <div className="mt-2">
                      <img
                        src={previewImages.logo}
                        alt="Logo Preview"
                        style={{ height: '150px', width: '150px', objectFit: 'contain' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="site_bg_color">Site Bg Color (Default: #c86a6a)</label>
                  <div className="d-flex align-items-center">
                    <input
                      type="color"
                      className="form-control form-control-color"
                      name="site_bg_color"
                      id="site_bg_color"
                      value={formData.site_bg_color}
                      onChange={(e) => handleInputChange('site_bg_color', e.target.value)}
                      style={{ width: '60px', height: '38px', marginRight: '10px' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={formData.site_bg_color}
                      onChange={(e) => handleInputChange('site_bg_color', e.target.value)}
                      placeholder="#c86a6a"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="site_menu_color">Site Menu Color (Default: #33656A)</label>
                  <div className="d-flex align-items-center">
                    <input
                      type="color"
                      className="form-control form-control-color"
                      name="site_menu_color"
                      id="site_menu_color"
                      value={formData.site_menu_color}
                      onChange={(e) => handleInputChange('site_menu_color', e.target.value)}
                      style={{ width: '60px', height: '38px', marginRight: '10px' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={formData.site_menu_color}
                      onChange={(e) => handleInputChange('site_menu_color', e.target.value)}
                      placeholder="#33656A"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="site_front_user_announcement">User Announcement Message</label>
                  <input
                    type="text"
                    className="form-control"
                    name="site_front_user_announcement"
                    id="site_front_user_announcement"
                    value={formData.site_front_user_announcement}
                    onChange={(e) => handleInputChange('site_front_user_announcement', e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="site_back_user_announcement">Backend Announcement Message</label>
                  <input
                    type="text"
                    className="form-control"
                    name="site_back_user_announcement"
                    id="site_back_user_announcement"
                    value={formData.site_back_user_announcement}
                    onChange={(e) => handleInputChange('site_back_user_announcement', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="login_page_email">Login Page Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="login_page_email"
                    id="login_page_email"
                    value={formData.login_page_email}
                    onChange={(e) => handleInputChange('login_page_email', e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="user_inspect_redirect">User Inspect Redirect</label>
                  <input
                    type="text"
                    className="form-control"
                    name="user_inspect_redirect"
                    id="user_inspect_redirect"
                    value={formData.user_inspect_redirect}
                    onChange={(e) => handleInputChange('user_inspect_redirect', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="facebook_link">Facebook Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="facebook_link"
                    id="facebook_link"
                    value={formData.facebook_link}
                    onChange={(e) => handleInputChange('facebook_link', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="instagram_link">Instagram Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="instagram_link"
                    id="instagram_link"
                    value={formData.instagram_link}
                    onChange={(e) => handleInputChange('instagram_link', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="telegram_link">Telegram Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="telegram_link"
                    id="telegram_link"
                    value={formData.telegram_link}
                    onChange={(e) => handleInputChange('telegram_link', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="twitter_link">Twitter Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="twitter_link"
                    id="twitter_link"
                    value={formData.twitter_link}
                    onChange={(e) => handleInputChange('twitter_link', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="is_demo_login"
                      id="is_demo_login"
                      checked={formData.is_demo_login}
                      onChange={(e) => handleInputChange('is_demo_login', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="is_demo_login">
                      Demo User Login active?
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="side_live_mode"
                      id="side_live_mode"
                      checked={formData.side_live_mode}
                      onChange={(e) => handleInputChange('side_live_mode', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="side_live_mode">
                      Live Mode
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="is_user_delete_disable"
                      id="is_user_delete_disable"
                      checked={formData.is_user_delete_disable}
                      onChange={(e) => handleInputChange('is_user_delete_disable', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="is_user_delete_disable">
                      Is User Delete Disable?
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-9 col-sm-6"></div>
              <div className="col-md-3 col-sm-6 text-right">
                <div className="form-group" style={{ marginTop: '5px' }}>
                  <input
                    type="password"
                    placeholder="Transaction Password"
                    name="master_password"
                    className="form-control"
                    value={formData.master_password}
                    onChange={(e) => handleInputChange('master_password', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-9 col-sm-6"></div>
              <div className="col-md-3 col-sm-6 text-right">
                <div className="form-group" style={{ marginRight: '30px', marginTop: '5px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ padding: '6px 12px' }}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                        {isEdit ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEdit ? 'Update' : 'Create'
                    )}
                  </button>
                </div>
              </div>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateEditPrefix;
