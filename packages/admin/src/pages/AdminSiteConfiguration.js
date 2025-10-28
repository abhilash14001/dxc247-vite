import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';

const AdminSiteConfiguration = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    MAINTENANCE_MODE: false,
    MAINTENANCE_MESSAGE: '',
    SECURITY_PASSWORD: '',
    COMMISSION_PERCENTAGE: '',
    API_DATA_SITE: '',
    API_CASINO_VIDEO: '',
    FRONT_WELCOME_BANNER: null,
    FRONT_WELCOME_TEXT_BANNER: '',
    BANNER_API: false,
    LOGOUT_TIME: '',
    TRANSACTION_PASSWORD: '',
    API_SPORTS: '',
    API_CASINO: ''
  });
  const [bannerPreview, setBannerPreview] = useState('');
  const [existingBanner, setExistingBanner] = useState('');

  useEffect(() => {
    loadConfiguration();
  }, []);

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      if (bannerPreview && bannerPreview.startsWith('blob:')) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      const response = await adminApi(`${ADMIN_BASE_PATH}/configuration`, 'GET', {}, true);
      if (response.success) {
        const configData = response.data;
        
        // Map the configuration data to form state
        const mappedData = {
          MAINTENANCE_MODE: configData.MAINTENANCE_MODE?.value === '1' || configData.MAINTENANCE_MODE?.value === 1,
          MAINTENANCE_MESSAGE: configData.MAINTENANCE_MESSAGE?.value || '',
          SECURITY_PASSWORD: configData.SECURITY_PASSWORD?.value || '',
          COMMISSION_PERCENTAGE: configData.COMMISSION_PERCENTAGE?.value || '',
          API_DATA_SITE: configData.API_DATA_SITE?.value || '',
          API_CASINO_VIDEO: configData.API_CASINO_VIDEO?.value || '',
          FRONT_WELCOME_BANNER: null,
          FRONT_WELCOME_TEXT_BANNER: configData.FRONT_WELCOME_TEXT_BANNER?.value || '',
          BANNER_API: configData.BANNER_API?.value === '1' || configData.BANNER_API?.value === 1,
          LOGOUT_TIME: configData.LOGOUT_TIME?.value || '',
          TRANSACTION_PASSWORD: configData.TRANSACTION_PASSWORD?.value || '',
          API_SPORTS: configData.API_SPORTS?.value || '',
          API_CASINO: configData.API_CASINO?.value || ''
        };
        
        setFormData(mappedData);
        
        // Set banner preview if banner exists
        if (configData.FRONT_WELCOME_BANNER?.value) {
          const bannerUrl = `${configData.FRONT_WELCOME_BANNER.value}`;
          setBannerPreview(bannerUrl);
          setExistingBanner(bannerUrl);
        }
      } else {
        toast.error(response.message || 'Failed to load configuration');
      }
    } catch (error) {
      
      console.error('Error loading configuration:', error);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFormData(prev => ({
        ...prev,
        FRONT_WELCOME_BANNER: null
      }));
      setBannerPreview(existingBanner);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB', {
        position: "top-right",
        autoClose: 3000,
      });
      e.target.value = ''; // Clear the file input
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file', {
        position: "top-right",
        autoClose: 3000,
      });
      e.target.value = ''; // Clear the file input
      return;
    }

    setFormData(prev => ({
      ...prev,
      FRONT_WELCOME_BANNER: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare configurations object
      const configurations = {
        MAINTENANCE_MODE: formData.MAINTENANCE_MODE ? 1 : 0,
        MAINTENANCE_MESSAGE: formData.MAINTENANCE_MESSAGE,
        SECURITY_PASSWORD: formData.SECURITY_PASSWORD,
        COMMISSION_PERCENTAGE: formData.COMMISSION_PERCENTAGE,
        API_DATA_SITE: formData.API_DATA_SITE,
        API_CASINO_VIDEO: formData.API_CASINO_VIDEO,
        FRONT_WELCOME_TEXT_BANNER: formData.FRONT_WELCOME_TEXT_BANNER,
        BANNER_API: formData.BANNER_API ? 1 : 0,
        LOGOUT_TIME: formData.LOGOUT_TIME,
        TRANSACTION_PASSWORD: formData.TRANSACTION_PASSWORD,
        API_SPORTS: formData.API_SPORTS,
        API_CASINO: formData.API_CASINO
      };

      const formDataToSend = new FormData();
      
      // Send configurations as individual fields (not as JSON string)
      Object.keys(configurations).forEach(key => {
        formDataToSend.append(`configurations[${key}]`, configurations[key]);
      });

      // Handle file upload if banner is selected
      if (formData.FRONT_WELCOME_BANNER) {
        formDataToSend.append('files[FRONT_WELCOME_BANNER]', formData.FRONT_WELCOME_BANNER);
      }

      const response = await adminApi(`${ADMIN_BASE_PATH}/configuration`, 'POST', formDataToSend);

      if (response.success) {
        toast.success(response.message || 'Configuration updated successfully');
        
        // Update banner preview if new file was uploaded
        if (formData.FRONT_WELCOME_BANNER) {
          const previewUrl = URL.createObjectURL(formData.FRONT_WELCOME_BANNER);
          setBannerPreview(previewUrl);
        }
      } else {
        toast.error(response.message || 'Failed to update configuration');
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
      if (error.errors) {
        // Handle validation errors
        const errors = error.errors;
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        toast.error('Failed to update configuration');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && Object.values(formData).every(val => val === '' || val === false)) {
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="add-account">
        <h2 className="m-b-20">Sites Configurations</h2>
        <div className="row">
          <div className="col-md-12 col-sm-12">
            <form onSubmit={handleSubmit} className="form-horizontal" encType="multipart/form-data">
              <div className="card">
                <div className="card-body">
                  <div>
                    {/* Maintenance Mode */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Maintenance Mode
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="checkbox" 
                          name="MAINTENANCE_MODE" 
                          checked={formData.MAINTENANCE_MODE}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Maintenance Message */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Maintenance Message
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="MAINTENANCE_MESSAGE" 
                          id="MAINTENANCE_MESSAGE" 
                          value={formData.MAINTENANCE_MESSAGE}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* Security Password */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Security Password
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="SECURITY_PASSWORD" 
                          id="SECURITY_PASSWORD" 
                          value={formData.SECURITY_PASSWORD}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* Commission Percentage */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Commission Percentage
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="COMMISSION_PERCENTAGE" 
                          id="COMMISSION_PERCENTAGE" 
                          value={formData.COMMISSION_PERCENTAGE}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* API Data Type */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Api Data Type : OLD_DIAMOND, NEW_DIMAOND
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="API_DATA_SITE" 
                          id="API_DATA_SITE" 
                          value={formData.API_DATA_SITE}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* API Casino Video */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Api Casino Video IP OR Domain EX. http://3.110.92.155/
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="API_CASINO_VIDEO" 
                          id="API_CASINO_VIDEO" 
                          value={formData.API_CASINO_VIDEO}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* Front Welcome Banner */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Front Welcome Banner
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="file" 
                          name="FRONT_WELCOME_BANNER" 
                          onChange={handleFileChange}
                          className="form-control"
                          accept="image/*"
                        />
                        
                        {/* Current Image Preview (from server) */}
                        {bannerPreview && !formData.FRONT_WELCOME_BANNER && (
                          <div className="mt-2">
                            <small className="text-muted d-block mb-1">Current Image:</small>
                            <img
                              src={bannerPreview}
                              alt="Current banner"
                              style={{ 
                                maxWidth: '150px', 
                                maxHeight: '100px', 
                                objectFit: 'cover',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                              }}
                            />
                          </div>
                        )}

                        {/* Selected File Preview */}
                        {formData.FRONT_WELCOME_BANNER && (
                          <div className="mt-2">
                            <small className="text-muted d-block mb-1">Selected File Preview:</small>
                            <div className="d-flex align-items-center">
                              <img
                                src={URL.createObjectURL(formData.FRONT_WELCOME_BANNER)}
                                alt="Selected file preview"
                                style={{ 
                                  maxWidth: '150px', 
                                  maxHeight: '100px', 
                                  objectFit: 'cover',
                                  border: '2px solid #007bff',
                                  borderRadius: '4px'
                                }}
                                className="me-3"
                              />
                              <div>
                                <small className="text-muted d-block">
                                  <strong>File:</strong> {formData.FRONT_WELCOME_BANNER.name}
                                </small>
                                <small className="text-muted d-block">
                                  <strong>Size:</strong> {(formData.FRONT_WELCOME_BANNER.size / 1024 / 1024).toFixed(2)} MB
                                </small>
                                <small className="text-muted d-block">
                                  <strong>Type:</strong> {formData.FRONT_WELCOME_BANNER.type}
                                </small>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Front Welcome Text Banner */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Front Welcome Text Banner
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="FRONT_WELCOME_TEXT_BANNER" 
                          id="FRONT_WELCOME_TEXT_BANNER" 
                          value={formData.FRONT_WELCOME_TEXT_BANNER}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* Banner and Text Update Through API */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Banner and Text Update Through API
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="checkbox" 
                          name="BANNER_API" 
                          checked={formData.BANNER_API}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Logout Time */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Logout Time (in minutes)
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="LOGOUT_TIME" 
                          id="LOGOUT_TIME" 
                          value={formData.LOGOUT_TIME}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* Transaction Password */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        Transaction Password
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="TRANSACTION_PASSWORD" 
                          id="TRANSACTION_PASSWORD" 
                          value={formData.TRANSACTION_PASSWORD}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* API FOR SPORTS */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        API FOR SPORTS (1 = https://d1.api1.live, 2 = http://168.231.102.198)
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="API_SPORTS" 
                          id="API_SPORTS" 
                          value={formData.API_SPORTS}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>

                    {/* API FOR CASINO */}
                    <div className="form-group row">
                      <div className="col-md-2 col-sm-12">
                        API FOR CASINO (1 = https://d1.api1.live, 2 = http://168.231.102.198)
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <input 
                          type="text" 
                          name="API_CASINO" 
                          id="API_CASINO" 
                          value={formData.API_CASINO}
                          onChange={handleInputChange}
                          className="form-control" 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button 
                    className="btn btn-sm btn-primary float-right" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Configuration'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSiteConfiguration;
