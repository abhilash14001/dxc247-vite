  import React, { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { adminApi } from '@dxc247/shared/utils/adminApi';
  import Notify from '@dxc247/shared/utils/Notify';
  import CenteredSpinner from '@dxc247/shared/components/ui/CenteredSpinner';
  import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';

  const AdminEditAccount = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!userId;
    
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);
    const [errors, setErrors] = useState({});
    
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
      soccer_pre_inplay_profit: '1000000',
      soccer_pre_inplay_stake: '100000',
      soccer_min_odds: '0.01',
      soccer_max_odds: '15',
      soccer_bet_status: true,
      soccer_partnership: '100',
      
      // Sport Information - Tennis
      tennis_min_stake: '5',
      tennis_max_stake: '10000000',
      tennis_max_profit: '10000000',
      tennis_bet_delay: '5',
      tennis_pre_inplay_profit: '1000000',
      tennis_pre_inplay_stake: '100000',
      tennis_min_odds: '0.01',
      tennis_max_odds: '15',
      tennis_bet_status: true,
      tennis_partnership: '100',
      
      // Sport Information - Casino
      casino_min_stake: '5',
      casino_max_stake: '10000000',
      casino_max_profit: '10000000',
      casino_bet_delay: '5',
      casino_pre_inplay_profit: '1000000',
      casino_pre_inplay_stake: '100000',
      casino_min_odds: '0.01',
      casino_max_odds: '15',
      casino_bet_status: true,
      casino_partnership: '100',
      
      // Transaction Password
      master_password: ''
    });

    useEffect(() => {
      if (isEditMode && userId) {
        fetchUserData();
      }
    }, [isEditMode, userId]);

    const fetchUserData = async () => {
      setInitialLoading(true);
      try {
        const response = await adminApi(`${ADMIN_BASE_PATH}/user/details/${userId}`, 'GET', {}, true);
        if (response.success && response.data) {
          const userData = response.data;
          setFormData(prev => ({
            ...prev,
            name: userData.name || '',
            username: userData.username || '',
            city: userData.city || '',
            phone: userData.phone || '',
            downline_partnership: userData.downline_partnership || '100',
            over_partnership: userData.over_partnership || '0',
            expiry_date: userData.expiry_date || '02-10-2035',
            role: userData.role || '',
            prefix_domain: userData.prefix_domain || '',
            credit_reference: userData.credit_reference || '',
            account_limit: userData.account_limit || '',
            exposure_limit: userData.exposure_limit || '',
            isBetDeleteAccess: userData.isBetDeleteAccess || false,
            
            // Sport Information - Cricket
            cricket_min_stake: userData.cricket_min_stake || '5',
            cricket_max_stake: userData.cricket_max_stake || '10000000',
            cricket_max_profit: userData.cricket_max_profit || '10000000',
            cricket_bet_delay: userData.cricket_bet_delay || '5',
            cricket_pre_inplay_profit: userData.cricket_pre_inplay_profit || '1000000',
            cricket_pre_inplay_stake: userData.cricket_pre_inplay_stake || '100000',
            cricket_min_odds: userData.cricket_min_odds || '0.01',
            cricket_max_odds: userData.cricket_max_odds || '15',
            cricket_bet_status: userData.cricket_bet_status || true,
            cricket_partnership: userData.cricket_partnership || '100',
            
            // Sport Information - Bookmaker
            bookmaker_min_stake: userData.bookmaker_min_stake || '100',
            bookmaker_max_stake: userData.bookmaker_max_stake || '10000000',
            bookmaker_max_profit: userData.bookmaker_max_profit || '10000000',
            bookmaker_bet_delay: userData.bookmaker_bet_delay || '5',
            bookmaker_pre_inplay_profit: userData.bookmaker_pre_inplay_profit || '1000000',
            bookmaker_pre_inplay_stake: userData.bookmaker_pre_inplay_stake || '100000',
            bookmaker_min_odds: userData.bookmaker_min_odds || '0.01',
            bookmaker_max_odds: userData.bookmaker_max_odds || '15',
            bookmaker_bet_status: userData.bookmaker_bet_status || true,
            bookmaker_partnership: userData.bookmaker_partnership || '100',
            
            // Sport Information - Session
            session_min_stake: userData.session_min_stake || '100',
            session_max_stake: userData.session_max_stake || '10000000',
            session_max_profit: userData.session_max_profit || '10000000',
            session_bet_delay: userData.session_bet_delay || '5',
            session_pre_inplay_profit: userData.session_pre_inplay_profit || '1000000',
            session_pre_inplay_stake: userData.session_pre_inplay_stake || '100000',
            session_min_odds: userData.session_min_odds || '0.01',
            session_max_odds: userData.session_max_odds || '15',
            session_bet_status: userData.session_bet_status || true,
            session_partnership: userData.session_partnership || '100',
            
            // Sport Information - Soccer
            soccer_min_stake: userData.soccer_min_stake || '5',
            soccer_max_stake: userData.soccer_max_stake || '10000000',
            soccer_max_profit: userData.soccer_max_profit || '10000000',
            soccer_bet_delay: userData.soccer_bet_delay || '5',
            soccer_pre_inplay_profit: userData.soccer_pre_inplay_profit || '1000000',
            soccer_pre_inplay_stake: userData.soccer_pre_inplay_stake || '100000',
            soccer_min_odds: userData.soccer_min_odds || '0.01',
            soccer_max_odds: userData.soccer_max_odds || '15',
            soccer_bet_status: userData.soccer_bet_status || true,
            soccer_partnership: userData.soccer_partnership || '100',
            
            // Sport Information - Tennis
            tennis_min_stake: userData.tennis_min_stake || '5',
            tennis_max_stake: userData.tennis_max_stake || '10000000',
            tennis_max_profit: userData.tennis_max_profit || '10000000',
            tennis_bet_delay: userData.tennis_bet_delay || '5',
            tennis_pre_inplay_profit: userData.tennis_pre_inplay_profit || '1000000',
            tennis_pre_inplay_stake: userData.tennis_pre_inplay_stake || '100000',
            tennis_min_odds: userData.tennis_min_odds || '0.01',
            tennis_max_odds: userData.tennis_max_odds || '15',
            tennis_bet_status: userData.tennis_bet_status || true,
            tennis_partnership: userData.tennis_partnership || '100',
            
            // Sport Information - Casino
            casino_min_stake: userData.casino_min_stake || '5',
            casino_max_stake: userData.casino_max_stake || '10000000',
            casino_max_profit: userData.casino_max_profit || '10000000',
            casino_bet_delay: userData.casino_bet_delay || '5',
            casino_pre_inplay_profit: userData.casino_pre_inplay_profit || '1000000',
            casino_pre_inplay_stake: userData.casino_pre_inplay_stake || '100000',
            casino_min_odds: userData.casino_min_odds || '0.01',
            casino_max_odds: userData.casino_max_odds || '15',
            casino_bet_status: userData.casino_bet_status || true,
            casino_partnership: userData.casino_partnership || '100',
            
            // Transaction Password
            master_password: ''
          }));
        } else {
          Notify('Failed to fetch user details', null, null, 'danger');
          navigate('/users');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        Notify('Error fetching user details. Please try again.', null, null, 'danger');
        navigate('/users');
      } finally {
        setInitialLoading(false);
      }
    };

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      
      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    };

    const validateForm = () => {
      const newErrors = {};
      
      // Personal Details Validation
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!isEditMode && !formData.password.trim()) newErrors.password = 'Password is required';
      if (!isEditMode && formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
      if (isEditMode && formData.password && formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      
      // Account Details Validation
      if (!formData.role) newErrors.role = 'Role is required';
      if (!formData.prefix_domain) newErrors.prefix_domain = 'Prefix Domain is required';
      if (!formData.credit_reference) newErrors.credit_reference = 'Credit Reference is required';
      if (!formData.account_limit) newErrors.account_limit = 'Account Limit is required';
      if (!formData.exposure_limit) newErrors.exposure_limit = 'Exposure Limit is required';
      
      // Transaction Password Validation
      if (!formData.master_password.trim()) {
        newErrors.master_password = 'Transaction Password is required';
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
        const payload = {
          ...formData,
          password: isEditMode && !formData.password ? undefined : formData.password,
          password_confirmation: isEditMode && !formData.password ? undefined : formData.password_confirmation
        };
        
        const endpoint = isEditMode 
          ? `${ADMIN_BASE_PATH}/user/update/${userId}`
          : `${ADMIN_BASE_PATH}/user/create`;
          
        const response = await adminApi(endpoint, 'POST', payload, true);
        
        if (response.success) {
          Notify(
            isEditMode ? 'User updated successfully!' : 'User created successfully!',
            null, null, 'success'
          );
          navigate('/client/list');
        } else {
          Notify(response.message || 'Operation failed', null, null, 'danger');
        }
      } catch (error) {
        console.error('Error:', error);
        Notify('An error occurred while processing the request', null, null, 'danger');
      } finally {
        setLoading(false);
      }
    };

    if (initialLoading) {
      return <CenteredSpinner fullScreen={true} />;
    }

    return (
      <div className="col-md-12 main-container">
        <div>
          <div className="add-account">
            <h2 className="m-b-20">Clients Management / {isEditMode ? 'Update' : 'Create'}</h2>
            <form className="form-horizontal123" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 personal-detail">
                  <h4 className="m-b-20 col-md-12">Personal Detail</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="username">Login UserID</label>
                        <input
                          type="text"
                          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="none"
                          spellCheck="false"
                          required
                        />
                        {errors.username && (
                          <div className="invalid-feedback">{errors.username}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          className={`form-control password d-block m-0 ${errors.password ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          minLength="8"
                          required={!isEditMode}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label htmlFor="password_confirmation">Re-enter Password</label>
                        <input
                          type="password"
                          className={`form-control confirm_password d-block m-0 ${errors.password_confirmation ? 'is-invalid' : ''}`}
                          id="password_confirmation"
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleInputChange}
                          minLength="8"
                          required={!isEditMode}
                        />
                        {errors.password_confirmation && (
                          <div className="invalid-feedback">{errors.password_confirmation}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.city && (
                          <div className="invalid-feedback">{errors.city}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                          type="text"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">{errors.phone}</div>
                        )}
                      </div>
                    </div>

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
                          className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select User Role</option>
                          <option value="2">Admin</option>
                          <option value="3">Sub Admin</option>
                          <option value="4">Super Master</option>
                          <option value="5">Master</option>
                          <option value="7">User</option>
                        </select>
                        {errors.role && (
                          <div className="invalid-feedback">{errors.role}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-12 prefix_domain">
                      <div className="form-group">
                        <label>Select Prefix</label>
                        <select
                          className={`form-control ${errors.prefix_domain ? 'is-invalid' : ''}`}
                          id="prefix_domain"
                          name="prefix_domain"
                          value={formData.prefix_domain}
                          onChange={handleInputChange}
                          required
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

                    <div className="col-md-6 col-sm-12">
                      <div className="form-group">
                        <label htmlFor="credit_reference">Credit Reference</label>
                        <input
                          type="number"
                          className="form-control"
                          id="credit_reference"
                          name="credit_reference"
                          value={formData.credit_reference}
                          onChange={handleInputChange}
                          readOnly
                          step="0.01"
                        />
                      </div>
                    </div>

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
                          required
                          step="1"
                        />
                        {errors.account_limit && (
                          <div className="invalid-feedback">{errors.account_limit}</div>
                        )}
                      </div>
                    </div>
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
                    <div className="col-md-6 col-sm-12 exposure_limit" style={{display: 'none'}}>
                      <div className="form-group">
                        <label htmlFor="exposure_limit">Exposure Limit</label>
                        <input
                          type="number"
                          className={`form-control ${errors.exposure_limit ? 'is-invalid' : ''}`}
                          id="exposure_limit"
                          name="exposure_limit"
                          value={formData.exposure_limit}
                          onChange={handleInputChange}
                          required
                          step="0.01"
                        />
                        {errors.exposure_limit && (
                          <div className="invalid-feedback">{errors.exposure_limit}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row m-t-20" id="partnership-div">
                <div className="col-md-12">
                  <h4 className="m-b-20 col-md-12">Sport Information</h4>
                  <div style={{overflow: 'scroll', width: '100%'}}>
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
                        <tr>
                          <th>
                            Cricket Odds
                            <br/><br/>
                            Bookmaker
                            <br/><br/>
                            Session
                          </th>
                          <td>
                            <input className="form-control" type="text" name="cricket_min_stake" id="cricket_min_stake" placeholder="0" value={formData.cricket_min_stake} onChange={handleInputChange} />
                            <input className="form-control mt-10" type="text" name="bookmaker_min_stake" id="bookmaker_min_stake" placeholder="0" value={formData.bookmaker_min_stake} onChange={handleInputChange} />
                            <input className="form-control mt-10" type="text" name="session_min_stake" id="session_min_stake" placeholder="0" value={formData.session_min_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="cricket_max_stake" id="cricket_max_stake" placeholder="0" value={formData.cricket_max_stake} onChange={handleInputChange} />
                            <input className="form-control mt-10" type="text" name="bookmaker_max_stake" id="bookmaker_max_stake" placeholder="0" value={formData.bookmaker_max_stake} onChange={handleInputChange} />
                            <input className="form-control mt-10" type="text" name="session_max_stake" id="session_max_stake" placeholder="0" value={formData.session_max_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="cricket_max_profit" id="cricket_max_profit" placeholder="0" value={formData.cricket_max_profit} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="cricket_bet_delay" id="cricket_bet_delay" placeholder="0" value={formData.cricket_bet_delay} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="cricket_pre_inplay_profit" id="cricket_pre_inplay_profit" placeholder="0" value={formData.cricket_pre_inplay_profit} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="cricket_pre_inplay_stake" id="cricket_pre_inplay_stake" placeholder="0" value={formData.cricket_pre_inplay_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="cricket_min_odds" id="cricket_min_odds" placeholder="0" value={formData.cricket_min_odds} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="cricket_max_odds" id="cricket_max_odds" placeholder="0" value={formData.cricket_max_odds} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input type="checkbox" name="cricket_bet_status" value="1" checked={formData.cricket_bet_status} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control partnership" type="text" name="cricket_partnership" id="cricket_partnership" data-partnership="100" readOnly placeholder="0" value={formData.cricket_partnership} />
                          </td>
                        </tr>
                        <tr>
                          <th>Soccer</th>
                          <td>
                            <input className="form-control" type="text" name="soccer_min_stake" id="soccer_min_stake" placeholder="0" value={formData.soccer_min_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="soccer_max_stake" id="soccer_max_stake" placeholder="0" value={formData.soccer_max_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="soccer_max_profit" id="soccer_max_profit" placeholder="0" value={formData.soccer_max_profit} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="soccer_bet_delay" id="soccer_bet_delay" placeholder="0" value={formData.soccer_bet_delay} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="soccer_pre_inplay_profit" id="soccer_pre_inplay_profit" placeholder="0" value={formData.soccer_pre_inplay_profit} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="soccer_pre_inplay_stake" id="soccer_pre_inplay_stake" placeholder="0" value={formData.soccer_pre_inplay_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="soccer_min_odds" id="soccer_min_odds" placeholder="0" value={formData.soccer_min_odds} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="soccer_max_odds" id="soccer_max_odds" placeholder="0" value={formData.soccer_max_odds} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input type="checkbox" name="soccer_bet_status" value="1" checked={formData.soccer_bet_status} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control partnership" type="text" name="soccer_partnership" id="soccer_partnership" data-partnership="100" readOnly placeholder="0" value={formData.soccer_partnership} />
                          </td>
                        </tr>
                        <tr>
                          <th>Tennis</th>
                          <td>
                            <input className="form-control" type="text" name="tennis_min_stake" id="tennis_min_stake" placeholder="0" value={formData.tennis_min_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="tennis_max_stake" id="tennis_max_stake" placeholder="0" value={formData.tennis_max_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="tennis_max_profit" id="tennis_max_profit" placeholder="0" value={formData.tennis_max_profit} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="tennis_bet_delay" id="tennis_bet_delay" placeholder="0" value={formData.tennis_bet_delay} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="tennis_pre_inplay_profit" id="tennis_pre_inplay_profit" placeholder="0" value={formData.tennis_pre_inplay_profit} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="tennis_pre_inplay_stake" id="tennis_pre_inplay_stake" placeholder="0" value={formData.tennis_pre_inplay_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="tennis_min_odds" id="tennis_min_odds" placeholder="0" value={formData.tennis_min_odds} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="tennis_max_odds" id="tennis_max_odds" placeholder="0" value={formData.tennis_max_odds} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input type="checkbox" name="tennis_bet_status" value="1" checked={formData.tennis_bet_status} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control partnership" type="text" name="tennis_partnership" id="tennis_partnership" data-partnership="100" readOnly placeholder="0" value={formData.tennis_partnership} />
                          </td>
                        </tr>
                        <tr>
                          <th>Casino</th>
                          <td>
                            <input className="form-control" type="text" name="casino_min_stake" id="casino_min_stake" placeholder="0" value={formData.casino_min_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="casino_max_stake" id="casino_max_stake" placeholder="0" value={formData.casino_max_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control" type="text" name="casino_max_profit" id="casino_max_profit" placeholder="0" value={formData.casino_max_profit} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control CASINO" type="text" name="casino_bet_delay" id="casino_bet_delay" placeholder="0" value={formData.casino_bet_delay} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control CASINO" type="text" name="casino_pre_inplay_profit" id="casino_pre_inplay_profit" placeholder="0" value={formData.casino_pre_inplay_profit} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control CASINO" type="text" name="casino_pre_inplay_stake" id="casino_pre_inplay_stake" placeholder="0" value={formData.casino_pre_inplay_stake} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control CASINO" type="text" name="casino_min_odds" id="casino_min_odds" placeholder="0" value={formData.casino_min_odds} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control CASINO" type="text" name="casino_max_odds" id="casino_max_odds" placeholder="0" value={formData.casino_max_odds} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input type="checkbox" name="casino_bet_status" value="1" checked={formData.casino_bet_status} onChange={handleInputChange} />
                          </td>
                          <td>
                            <input className="form-control partnership" type="text" name="casino_partnership" id="casino_partnership" data-partnership="100" readOnly placeholder="0" value={formData.casino_partnership} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
                      onChange={handleInputChange}
                      type="password"
                      className={`form-control ${errors.master_password ? 'is-invalid' : ''}`}
                    />
                    {errors.master_password && (
                      <span id="master_password-error" className="error">{errors.master_password}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="row m-t-20">
                <div className="col-md-12">
                  <div className="float-right">
                    <input type="hidden" name="uID" value={userId || ''} />
                    <button className="btn btn-submit" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <CenteredSpinner size="sm" />
                          {isEditMode ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        isEditMode ? 'Update Account' : 'Create Account'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <style>
          {`
            .form-control {
              min-width: 100px !important
            }

            .mt-10 {
              margin-top: 10px;
            }
          `}
        </style>
      </div>
    );
  };

  export default AdminEditAccount;