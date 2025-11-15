import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import Notify from '@dxc247/shared/utils/Notify';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';

const AdminCreateAccount = () => {
  const navigate = useNavigate();
  const { user: currentAdminUser } = useSelector(state => state.admin);
  const currentUserRole = String(currentAdminUser?.role || '');
  
  const [formData, setFormData] = useState({
    // Personal Details
    name: '',
    username: '',
    password: '',
    password_confirmation: '',
    city: '',
    phone: '',
    downline_partnership: '100',
    over_partnership: '0',
    expiry_date: '02-10-2035',
    
    // Account Details
    role: '',
    prefix_domain: '',
    credit_reference: '',
    account_limit: '',
    exposure_limit: '',
    isBetDeleteAccess: false,
    
    // Sport Information - Cricket
    cricket_min_stake: '5',
    cricket_max_stake: '10000000',
    cricket_max_profit: '10000000',
    cricket_bet_delay: '5',
    cricket_pre_inplay_profit: '1000000',
    cricket_pre_inplay_stake: '100000',
    cricket_min_odds: '0.01',
    cricket_max_odds: '15',
    cricket_bet_status: true,
    cricket_partnership: '100',
    
    // Sport Information - Bookmaker
    bookmaker_min_stake: '100',
    bookmaker_max_stake: '10000000',
    bookmaker_max_profit: '10000000',
    bookmaker_bet_delay: '5',
    bookmaker_pre_inplay_profit: '1000000',
    bookmaker_pre_inplay_stake: '100000',
    bookmaker_min_odds: '0.01',
    bookmaker_max_odds: '15',
    bookmaker_bet_status: true,
    bookmaker_partnership: '100',
    
    // Sport Information - Session
    session_min_stake: '100',
    session_max_stake: '10000000',
    session_max_profit: '10000000',
    session_bet_delay: '5',
    session_pre_inplay_profit: '1000000',
    session_pre_inplay_stake: '100000',
    session_min_odds: '0.01',
    session_max_odds: '15',
    session_bet_status: true,
    session_partnership: '100',
    
    // Sport Information - Soccer
    soccer_min_stake: '5',
    soccer_max_stake: '10000000',
    soccer_max_profit: '10000000',
    soccer_bet_delay: '5',
    soccer_pre_inplay_profit: '10000000',
    soccer_pre_inplay_stake: '100000',
    soccer_min_odds: '0.01',
    soccer_max_odds: '10000000',
    soccer_bet_status: true,
    soccer_partnership: '100',
    
    // Sport Information - Tennis
    tennis_min_stake: '5',
    tennis_max_stake: '10000000',
    tennis_max_profit: '10000000',
    tennis_bet_delay: '5',
    tennis_pre_inplay_profit: '10000000',
    tennis_pre_inplay_stake: '100000',
    tennis_min_odds: '0.01',
    tennis_max_odds: '10000000',
    tennis_bet_status: true,
    tennis_partnership: '100',
    
    // Sport Information - Casino
    casino_min_stake: '5',
    casino_max_stake: '10000000',
    casino_max_profit: '10000000',
    casino_bet_delay: '0',
    casino_pre_inplay_profit: '0',
    casino_pre_inplay_stake: '0',
    casino_min_odds: '0',
    casino_max_odds: '0',
    casino_bet_status: true,
    casino_partnership: '100',
    
    // Transaction Password
    master_password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Only allow numbers for phone field
    if (name === 'phone') {
      newValue = value.replace(/\D/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const setPartnershipToAll = (value, defaultValue = '100') => {
    const partnershipValue = value || defaultValue;
    const numValue = parseInt(partnershipValue) || 0;
    
    // Ensure downline_partnership doesn't exceed 100
    const downlineValue = Math.min(Math.max(numValue, 0), 100);
    
    // Calculate over_partnership: 100 - downline_partnership
    const overValue = 100 - downlineValue;
    
    setFormData(prev => ({
      ...prev,
      downline_partnership: downlineValue.toString(),
      over_partnership: overValue.toString(),
      cricket_partnership: downlineValue.toString(),
      bookmaker_partnership: downlineValue.toString(),
      session_partnership: downlineValue.toString(),
      soccer_partnership: downlineValue.toString(),
      tennis_partnership: downlineValue.toString(),
      casino_partnership: downlineValue.toString()
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Personal Details Validation
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.username.trim()) newErrors.username = 'Login UserID is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    // City and Phone are optional - no validation needed
    
    // Account Details Validation
    if (!formData.role) newErrors.role = 'User Role is required';
    if (!formData.credit_reference) newErrors.credit_reference = 'Credit Reference is required';
    
    // Downline Partnership Validation
    if (formData.role && formData.role !== '7') {
      const downlineValue = parseInt(formData.downline_partnership) || 0;
      if (downlineValue < 0) {
        newErrors.downline_partnership = 'Downline Partnership cannot be less than 0';
      } else if (downlineValue > 100) {
        newErrors.downline_partnership = 'Downline Partnership cannot exceed 100';
      }
    }
    
    // Transaction Password Validation
    if (!formData.master_password.trim()) {
      newErrors.master_password = 'Transaction Password is required';
    } else if (formData.master_password.length > 15) {
      newErrors.master_password = 'Transaction Password must be less than 15 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Notify('Please fix the validation errors below', null, null, 'danger');
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/client/store`, 'POST', formData, true);
      
      if (response && response.success) {
        Notify(response.message || 'Account created successfully', null, null, 'success');
        
        // Reset form
        setFormData(prev => ({
          ...prev,
          name: '',
          username: '',
          password: '',
          password_confirmation: '',
          city: '',
          phone: '',
          role: '',
          credit_reference: '',
          master_password: ''
        }));
        
        // Navigate to users page on success
        navigate('/users');
      } else {
        // Handle validation errors
        if (response && response.errors) {
          setErrors(response.errors);
          Notify('Please fix the validation errors below', null, null, 'danger');
        }
        // Handle specific error messages
        else if (response && response.message) {
          setErrors({});
          Notify(response.message, null, null, 'danger');
        }
        // Handle other error responses
        else {
          Notify('An error occurred while creating the account', null, null, 'danger');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 400) {
          // Bad Request - validation errors
          if (errorData && errorData.errors) {
            setErrors(errorData.errors);
            Notify('Please fix the validation errors below', null, null, 'danger');
          } else if (errorData && errorData.message) {
            setErrors({});
            Notify(errorData.message, null, null, 'danger');
          } else {
            Notify('Invalid data provided. Please check your input.', null, null, 'danger');
          }
        } else if (status === 422) {
          // Unprocessable Entity - validation errors
          if (errorData && errorData.errors) {
            setErrors(errorData.errors);
            Notify('Please fix the validation errors below', null, null, 'danger');
          } else if (errorData && errorData.message) {
            setErrors({});
            Notify(errorData.message, null, null, 'danger');
          } else {
            Notify('Validation failed. Please check your input.', null, null, 'danger');
          }
        } else if (status === 500) {
          // Internal Server Error
          Notify('Server error occurred. Please try again later.', null, null, 'danger');
        } else if (status === 401) {
          // Unauthorized
          Notify('You are not authorized to perform this action.', null, null, 'danger');
        } else if (status === 403) {
          // Forbidden
          Notify('Access denied. You do not have permission to create accounts.', null, null, 'danger');
        } else {
          // Other server errors
          const errorMessage = errorData?.message || `Server error (${status}). Please try again.`;
          Notify(errorMessage, null, null, 'danger');
        }
      } else if (error.request) {
        // Network error
        Notify('Network error. Please check your connection and try again.', null, null, 'danger');
      } else {
        // Other errors
        Notify('An unexpected error occurred. Please try again.', null, null, 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-12 main-container">
      <div>
        <div className="add-account">
          <h2 className="m-b-20">Add Account</h2>
          <form className="form-horizontal123" onSubmit={handleSubmit} id="clientFrm" noValidate>
            <div className="row">
              <div className="col-md-6 personal-detail">
                <h4 className="m-b-20 col-md-12">Personal Detail</h4>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input 
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        type="text" 
                        name="name" 
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="username">Login UserID</label>
                      <input 
                        type="text" 
                        name="username" 
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        id="username" 
                        autoComplete="off" 
                        autoCorrect="off" 
                        value={formData.username}
                        autoCapitalize="none" 
                        spellCheck="false"
                        onChange={handleInputChange}
                      />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input 
                        className={`form-control password d-block m-0 ${errors.password ? 'is-invalid' : ''}`}
                        type="password" 
                        name="password" 
                        id="password" 
                        value={formData.password}
                        minLength="8"
                        onChange={handleInputChange}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="password_confirmation">Re-enter Password</label>
                      <input 
                        className={`form-control password_confirmation d-block m-0 ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        type="password" 
                        name="password_confirmation" 
                        id="password_confirmation" 
                        value={formData.password_confirmation}
                        minLength="8"
                        onChange={handleInputChange}
                      />
                      {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input 
                        className="form-control" 
                        type="text" 
                        name="city" 
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input 
                        className="form-control" 
                        type="tel" 
                        name="phone" 
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </div>
                  </div>

                  {formData.role && formData.role !== '7' && (
                    <div className="col-md-6 col-sm-12 hide_partner">
                      <div className="form-group">
                        <label htmlFor="downline_partnership">Down Line Partnership</label>
                        <input 
                          className={`form-control partnerships ${errors.downline_partnership ? 'is-invalid' : ''}`}
                          type="number" 
                          name="downline_partnership" 
                          id="downline_partnership" 
                          min="0"
                          max="100"
                          value={formData.downline_partnership}
                          onInput={(e) => {
                            const value = e.target.value;
                            // Prevent values over 100
                            if (value && parseInt(value) > 100) {
                              e.target.value = '100';
                              setPartnershipToAll('100', '100');
                            } else {
                              setPartnershipToAll(value, '100');
                            }
                          }}
                          onChange={handleInputChange}
                        />
                        {errors.downline_partnership && (
                          <div className="invalid-feedback">{errors.downline_partnership}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {formData.role && formData.role !== '7' && (
                    <div className="col-md-6 col-sm-12 partnership over_partnership_form hide_partner">
                      <div className="form-group">
                        <label htmlFor="over_partnership">OVER PARTNERSHIP</label>
                        <input 
                          type="number" 
                          name="over_partnership" 
                          readOnly 
                          className="form-control partnerships" 
                          id="over_partnership" 
                          value={formData.over_partnership}
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-md-6 col-sm-12 d-none">
                    <div className="form-group">
                      <label htmlFor="expiry_date">Expiry Date</label>
                      <input
                        type="date"
                        className="form-control expiry_date"
                        id="expiry_date"
                        name="expiry_date"
                        value={formData.expiry_date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 account-detail">
                <h4 className="m-b-20 col-md-12">Account Detail</h4>
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label>User Role/Type</label>
                      <select 
                        name="role" 
                        id="role" 
                        className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="">Select User Role</option>
                        {/* If logged-in user is Super Admin (role 6), show all options */}
                        {currentUserRole === '6' && (
                          <>
                            <option value="2">Admin</option>
                            <option value="3">Sub Admin</option>
                            <option value="4">Super Master</option>
                            <option value="5">Master</option>
                            <option value="7">User</option>
                          </>
                        )}
                        {/* If logged-in user is Admin (role 2), show Sub Admin and all below */}
                        {currentUserRole === '2' && (
                          <>
                            <option value="3">Sub Admin</option>
                            <option value="4">Super Master</option>
                            <option value="5">Master</option>
                            <option value="7">User</option>
                          </>
                        )}
                        {/* If logged-in user is Sub Admin (role 3), show Super Master and all below (not Sub Admin) */}
                        {currentUserRole === '3' && (
                          <>
                            <option value="4">Super Master</option>
                            <option value="5">Master</option>
                            <option value="7">User</option>
                          </>
                        )}
                        {/* If logged-in user is not Super Admin, Admin, or Sub Admin, show all options (fallback) */}
                        {currentUserRole !== '6' && currentUserRole !== '2' && currentUserRole !== '3' && (
                          <>
                            <option value="2">Admin</option>
                            <option value="3">Sub Admin</option>
                            <option value="4">Super Master</option>
                            <option value="5">Master</option>
                            <option value="7">User</option>
                          </>
                        )}
                      </select>
                      {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                    </div>
                  </div>
                  {formData.role && formData.role === '2' && (
                    <div className="col-md-6 col-sm-12 prefix_domain">
                      <div className="form-group">
                        <label>Select Prefix</label>
                        <select
                          className={`form-control ${errors.prefix_domain ? 'is-invalid' : ''}`}
                          id="prefix_domain"
                          name="prefix_domain"
                          value={formData.prefix_domain}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Prefix</option>
                          <option value="3">dxc247.com</option>
                          <option value="6">ibm247.com</option>
                          <option value="9">sp247.in</option>
                        </select>
                        {errors.prefix_domain && (
                          <div className="invalid-feedback">{errors.prefix_domain}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="col-md-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="credit_reference">Credit Reference</label>
                      <input 
                        type="number" 
                        name="credit_reference" 
                        className={`form-control ${errors.credit_reference ? 'is-invalid' : ''}`}
                        value={formData.credit_reference}
                        onChange={handleInputChange}
                        step="0.01"
                      />
                      {errors.credit_reference && <div className="invalid-feedback">{errors.credit_reference}</div>}
                    </div>
                  </div>

                  {formData.role && formData.role === '2' && (
                    <div className="col-md-6 col-sm-12 prefix_domain">
                      <div className="form-group">
                        <label htmlFor="account_limit">Account Limit</label>
                        <input
                          type="number"
                          className={`form-control ${errors.account_limit ? 'is-invalid' : ''}`}
                          id="account_limit"
                          name="account_limit"
                          value={formData.account_limit}
                          onChange={handleInputChange}
                          step="1"
                        />
                        {errors.account_limit && (
                          <div className="invalid-feedback">{errors.account_limit}</div>
                        )}
                      </div>
                    </div>
                  )}
                  {formData.role && formData.role === '2' && (
                    <div className="col-md-6 col-sm-12 prefix_domain">
                      <div className="form-group">
                        <label htmlFor="isBetDeleteAccess">Is Bet Delete</label>
                        <input
                          type="hidden"
                          name="isBetDeleteAccess"
                          className="form-control"
                          value="0"
                        />
                        <input
                          type="checkbox"
                          name="isBetDeleteAccess"
                          id="isBetDeleteAccess"
                          className=""
                          value="1"
                          checked={formData.isBetDeleteAccess}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  )}
                  {formData.role && formData.role === '7' && (
                    <div className="col-md-6 col-sm-12 exposure_limit">
                      <div className="form-group">
                        <label htmlFor="exposure_limit">Exposure Limit</label>
                        <input
                          type="number"
                          className={`form-control ${errors.exposure_limit ? 'is-invalid' : ''}`}
                          id="exposure_limit"
                          name="exposure_limit"
                          value={formData.exposure_limit}
                          onChange={handleInputChange}
                          step="0.01"
                        />
                        {errors.exposure_limit && (
                          <div className="invalid-feedback">{errors.exposure_limit}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="row m-t-20" id="partnership-div">
              <div className="col-md-12">
                <h4 className="m-b-20 col-md-12">Sport Information</h4>
                <div style={{ overflow: 'scroll', width: '100%' }}>
                  <table className="table table-border">
                    <thead>
                      <tr>
                        <th></th>
                        <th>MIN STAKE</th>
                        <th>MAX STAKE</th>
                        <th>MAX PROFIT</th>
                        <th>BET DELAY</th>
                        <th>PRE INPLAY PROFIT</th>
                        <th>PRE INPLAY STAKE</th>
                        <th>MIN ODDS</th>
                        <th>MAX ODDS</th>
                        <th>Bet Status</th>
                        <th>DOWN LINE PARTNERSHIP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Cricket Row */}
                      <tr>
                        <th>
                          Cricket Odds
                          <br /><br />
                          Bookmaker
                          <br /><br />
                          Session
                        </th>
                        <td>
                          <input 
                            className="cricket_min_stake" 
                            type="number" 
                            name="cricket_min_stake" 
                            id="cricket_min_stake" 
                            placeholder="0" 
                            value={formData.cricket_min_stake}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="bookmaker_min_stake" 
                            id="bookmaker_min_stake" 
                            placeholder="0" 
                            value={formData.bookmaker_min_stake}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="session_min_stake" 
                            id="session_min_stake" 
                            placeholder="0" 
                            value={formData.session_min_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="cricket_max_stake" 
                            id="cricket_max_stake" 
                            placeholder="0" 
                            value={formData.cricket_max_stake}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="bookmaker_max_stake" 
                            id="bookmaker_max_stake" 
                            placeholder="0" 
                            value={formData.bookmaker_max_stake}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="session_max_stake" 
                            id="session_max_stake" 
                            placeholder="0" 
                            value={formData.session_max_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="cricket_max_profit" 
                            id="cricket_max_profit" 
                            placeholder="0" 
                            value={formData.cricket_max_profit}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="bookmaker_max_profit" 
                            id="bookmaker_max_profit" 
                            placeholder="0" 
                            value={formData.bookmaker_max_profit}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="session_max_profit" 
                            id="session_max_profit" 
                            placeholder="0" 
                            value={formData.session_max_profit}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="cricket_bet_delay" 
                            id="cricket_bet_delay" 
                            placeholder="0" 
                            value={formData.cricket_bet_delay}
                            onChange={handleInputChange}
                            step="1"
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="bookmaker_bet_delay" 
                            id="bookmaker_bet_delay" 
                            placeholder="0" 
                            value={formData.bookmaker_bet_delay}
                            onChange={handleInputChange}
                            step="1"
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="session_bet_delay" 
                            id="session_bet_delay" 
                            placeholder="0" 
                            value={formData.session_bet_delay}
                            onChange={handleInputChange}
                            step="1"
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="cricket_pre_inplay_profit" 
                            id="cricket_pre_inplay_profit" 
                            placeholder="0" 
                            value={formData.cricket_pre_inplay_profit}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="bookmaker_pre_inplay_profit" 
                            id="bookmaker_pre_inplay_profit" 
                            placeholder="0" 
                            value={formData.bookmaker_pre_inplay_profit}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="session_pre_inplay_profit" 
                            id="session_pre_inplay_profit" 
                            placeholder="0" 
                            value={formData.session_pre_inplay_profit}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="cricket_pre_inplay_stake" 
                            id="cricket_pre_inplay_stake" 
                            placeholder="0" 
                            value={formData.cricket_pre_inplay_stake}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="bookmaker_pre_inplay_stake" 
                            id="bookmaker_pre_inplay_stake" 
                            placeholder="0" 
                            value={formData.bookmaker_pre_inplay_stake}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="session_pre_inplay_stake" 
                            id="session_pre_inplay_stake" 
                            placeholder="0" 
                            value={formData.session_pre_inplay_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="cricket_min_odds" 
                            id="cricket_min_odds" 
                            placeholder="0" 
                            value={formData.cricket_min_odds}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="bookmaker_min_odds" 
                            id="bookmaker_min_odds" 
                            placeholder="0" 
                            value={formData.bookmaker_min_odds}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="session_min_odds" 
                            id="session_min_odds" 
                            placeholder="0" 
                            value={formData.session_min_odds}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="cricket_max_odds" 
                            id="cricket_max_odds" 
                            placeholder="0" 
                            value={formData.cricket_max_odds}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="bookmaker_max_odds" 
                            id="bookmaker_max_odds" 
                            placeholder="0" 
                            value={formData.bookmaker_max_odds}
                            onChange={handleInputChange}
                          />
                          <input 
                            className="form-control mt-10" 
                            type="number" 
                            name="session_max_odds" 
                            id="session_max_odds" 
                            placeholder="0" 
                            value={formData.session_max_odds}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" 
                            name="cricket_bet_status" 
                            value="1" 
                            checked={formData.cricket_bet_status}
                            onChange={handleInputChange}
                          />
                          <br />
                          <input 
                            type="checkbox" 
                            name="bookmaker_bet_status" 
                            value="1" 
                            checked={formData.bookmaker_bet_status}
                            onChange={handleInputChange}
                            className="mt-10"
                          />
                          <br />
                          <input 
                            type="checkbox" 
                            name="session_bet_status" 
                            value="1" 
                            checked={formData.session_bet_status}
                            onChange={handleInputChange}
                            className="mt-10"
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control partnership" 
                            type="number" 
                            name="cricket_partnership" 
                            id="cricket_partnership" 
                            data-partnership="100" 
                            readOnly 
                            placeholder="0" 
                            value={formData.cricket_partnership}
                            step="0.01"
                          />
                          <input 
                            className="form-control partnership mt-10" 
                            type="number" 
                            name="bookmaker_partnership" 
                            id="bookmaker_partnership" 
                            data-partnership="100" 
                            readOnly 
                            placeholder="0" 
                            value={formData.bookmaker_partnership}
                            step="0.01"
                          />
                          <input 
                            className="form-control partnership mt-10" 
                            type="number" 
                            name="session_partnership" 
                            id="session_partnership" 
                            data-partnership="100" 
                            readOnly 
                            placeholder="0" 
                            value={formData.session_partnership}
                            step="0.01"
                          />
                        </td>
                      </tr>

                      {/* Soccer Row */}
                      <tr>
                        <th>Soccer</th>
                        <td>
                          <input 
                            className="soccer_min_stake" 
                            type="number" 
                            name="soccer_min_stake" 
                            id="soccer_min_stake" 
                            placeholder="0" 
                            value={formData.soccer_min_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="soccer_max_stake" 
                            id="soccer_max_stake" 
                            placeholder="0" 
                            value={formData.soccer_max_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="soccer_max_profit" 
                            id="soccer_max_profit" 
                            placeholder="0" 
                            value={formData.soccer_max_profit}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="soccer_bet_delay" 
                            id="soccer_bet_delay" 
                            placeholder="0" 
                            value={formData.soccer_bet_delay}
                            onChange={handleInputChange}
                            step="1"
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="soccer_pre_inplay_profit" 
                            id="soccer_pre_inplay_profit" 
                            placeholder="0" 
                            value={formData.soccer_pre_inplay_profit}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="soccer_pre_inplay_stake" 
                            id="soccer_pre_inplay_stake" 
                            placeholder="0" 
                            value={formData.soccer_pre_inplay_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="soccer_min_odds" 
                            id="soccer_min_odds" 
                            placeholder="0" 
                            value={formData.soccer_min_odds}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="soccer_max_odds" 
                            id="soccer_max_odds" 
                            placeholder="0" 
                            value={formData.soccer_max_odds}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" 
                            name="soccer_bet_status" 
                            value="1" 
                            checked={formData.soccer_bet_status}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control partnership" 
                            type="number" 
                            name="soccer_partnership" 
                            id="soccer_partnership" 
                            data-partnership="100" 
                            readOnly 
                            placeholder="0" 
                            value={formData.soccer_partnership}
                            step="0.01"
                          />
                        </td>
                      </tr>

                      {/* Tennis Row */}
                      <tr>
                        <th>Tennis</th>
                        <td>
                          <input 
                            className="tennis_min_stake" 
                            type="number" 
                            name="tennis_min_stake" 
                            id="tennis_min_stake" 
                            placeholder="0" 
                            value={formData.tennis_min_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="tennis_max_stake" 
                            id="tennis_max_stake" 
                            placeholder="0" 
                            value={formData.tennis_max_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="tennis_max_profit" 
                            id="tennis_max_profit" 
                            placeholder="0" 
                            value={formData.tennis_max_profit}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="tennis_bet_delay"
                            step="1" 
                            id="tennis_bet_delay" 
                            placeholder="0" 
                            value={formData.tennis_bet_delay}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="tennis_pre_inplay_profit" 
                            id="tennis_pre_inplay_profit" 
                            placeholder="0" 
                            value={formData.tennis_pre_inplay_profit}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="tennis_pre_inplay_stake" 
                            id="tennis_pre_inplay_stake" 
                            placeholder="0" 
                            value={formData.tennis_pre_inplay_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="tennis_min_odds" 
                            id="tennis_min_odds" 
                            placeholder="0" 
                            value={formData.tennis_min_odds}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="tennis_max_odds" 
                            id="tennis_max_odds" 
                            placeholder="0" 
                            value={formData.tennis_max_odds}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" 
                            name="tennis_bet_status" 
                            value="1" 
                            checked={formData.tennis_bet_status}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control partnership" 
                            type="number" 
                            name="tennis_partnership" 
                            id="tennis_partnership" 
                            data-partnership="100" 
                            readOnly 
                            placeholder="0" 
                            value={formData.tennis_partnership}
                          />
                        </td>
                      </tr>

                      {/* Casino Row */}
                      <tr>
                        <th>Casino</th>
                        <td>
                          <input 
                            className="casino_min_stake" 
                            type="number" 
                            name="casino_min_stake" 
                            id="casino_min_stake" 
                            placeholder="0" 
                            value={formData.casino_min_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="casino_max_stake" 
                            id="casino_max_stake" 
                            placeholder="0" 
                            value={formData.casino_max_stake}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control" 
                            type="number" 
                            name="casino_max_profit" 
                            id="casino_max_profit" 
                            placeholder="0" 
                            value={formData.casino_max_profit}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control CASINO" 
                            type="number" 
                            name="casino_bet_delay" 
                            id="casino_bet_delay" 
                            placeholder="0" 
                            value={formData.casino_bet_delay}
                            readOnly
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control CASINO" 
                            type="number" 
                            name="casino_pre_inplay_profit" 
                            id="casino_pre_inplay_profit" 
                            placeholder="0" 
                            value={formData.casino_pre_inplay_profit}
                            readOnly
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control CASINO" 
                            type="number" 
                            name="casino_pre_inplay_stake" 
                            id="casino_pre_inplay_stake" 
                            placeholder="0" 
                            value={formData.casino_pre_inplay_stake}
                            readOnly
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control CASINO" 
                            type="number" 
                            name="casino_min_odds" 
                            id="casino_min_odds" 
                            placeholder="0" 
                            value={formData.casino_min_odds}
                            readOnly
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control CASINO" 
                            type="number" 
                            name="casino_max_odds" 
                            id="casino_max_odds" 
                            placeholder="0" 
                            value={formData.casino_max_odds}
                            readOnly
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" 
                            name="casino_bet_status" 
                            value="1" 
                            checked={formData.casino_bet_status}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input 
                            className="form-control partnership" 
                            type="number" 
                            name="casino_partnership" 
                            id="casino_partnership" 
                            data-partnership="100" 
                            readOnly 
                            placeholder="0" 
                            value={formData.casino_partnership}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <style jsx>{`
                  .form-control {
                    min-width: 100px !important;
                  }
                  .mt-10 {
                    margin-top: 10px;
                  }
                `}</style>
              </div>
            </div>

            <div className="row m-t-20">
              <div className="col-md-12">
                <div className="form-group col-md-3 float-right">
                  <label htmlFor="master_password">Transaction Password:</label>
                  <input 
                    required 
                    maxLength="15" 
                    placeholder="Transaction Password" 
                    name="master_password" 
                    id="master_password" 
                    value={formData.master_password}
                    type="password" 
                    className={`form-control ${errors.master_password ? 'is-invalid' : ''}`}
                    onChange={handleInputChange}
                  />
                  {errors.master_password && <div className="invalid-feedback">{errors.master_password}</div>}
                </div>
              </div>
            </div>
            
            <div className="row m-t-20">
              <div className="col-md-12">
                <div className="float-right">
                  <button 
                    className="btn btn-submit" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Account'}
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

export default AdminCreateAccount;