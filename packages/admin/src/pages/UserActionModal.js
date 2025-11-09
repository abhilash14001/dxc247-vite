import React, { useState } from 'react';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import Notify from '@dxc247/shared/utils/Notify';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';

const UserActionModal = ({ modal, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // State for diff display values
  const [depositFirstDiff, setDepositFirstDiff] = useState({ text: '', color: '' });
  const [depositSecondDiff, setDepositSecondDiff] = useState({ text: '', color: '' });
  const [withdrawFirstDiff, setWithdrawFirstDiff] = useState({ text: '', color: '' });
  const [withdrawSecondDiff, setWithdrawSecondDiff] = useState({ text: '', color: '' });

  // Initialize form data based on modal type
  React.useEffect(() => {
    if (modal.isOpen && modal.user) {
      setErrors({});
      switch (modal.type) {
        case 'creditReference':
          setFormData({ 
            old_credit: modal.data.currentValue || modal.user.credit_reference || 0,
            credit_reference: '',
            transaction_password: ''
          });
          break;
        case 'freeChipsIn':
          setFormData({ 
            amount: '', 
            remark: '',
            mpassword: ''
          });
          // Clear diff elements
          setDepositFirstDiff({ text: '', color: '' });
          setDepositSecondDiff({ text: '', color: '' });
          break;
        case 'freeChipsOut':
          setFormData({ 
            amount: '', 
            remark: '',
            wmpassword: ''
          });
          // Clear diff elements
          setWithdrawFirstDiff({ text: '', color: '' });
          setWithdrawSecondDiff({ text: '', color: '' });
          break;
        case 'exposureLimit':
          setFormData({ 
            old_limit: modal.data.currentLimit || modal.user.exposure_limit || 0,
            exposure_limit: '',
            empassword: ''
          });
          break;
        case 'changePassword':
          setFormData({ 
            password: '', 
            password_confirmation: '',
            pmpassword: ''
          });
          break;
        case 'toggleStatus':
          setFormData({ 
            userActive: modal.user?.active || false,
            betActive: modal.user?.bet_status || false,
            smpassword: ''
          });
          break;
        default:
          setFormData({});
      }
    } else if (!modal.isOpen) {
      // Clear diff elements when modal closes
      setDepositFirstDiff({ text: '', color: '' });
      setDepositSecondDiff({ text: '', color: '' });
      setWithdrawFirstDiff({ text: '', color: '' });
      setWithdrawSecondDiff({ text: '', color: '' });
    }
  }, [modal]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue;
    
    if (type === 'checkbox') {
      // For toggle switches, use boolean values
      if (name === 'userActive' || name === 'betActive') {
        newValue = checked;
      } else {
        newValue = checked ? 1 : 0;
      }
    } else {
      newValue = value;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Update diff elements based on amount changes
    if (name === 'amount' && (modal.type === 'freeChipsIn' || modal.type === 'freeChipsOut')) {
      const amount = parseFloat(newValue) || 0;
      
      if (modal.type === 'freeChipsIn') {
        // Deposit: parent balance decreases, user balance increases
        const parentBalance = parseFloat(modal.data?.parentBalance || 0);
        const userBalance = parseFloat(modal.user?.balance || 0);
        
        // Calculate new balances
        let newParentBalance = parentBalance - amount;
        const newUserBalance = userBalance + amount;
        
        // Ensure parent balance doesn't go negative
        if (newParentBalance < 0) {
          newParentBalance = 0;
        }
        
        // Update diff elements using state
        if (amount > 0 && amount <= parentBalance) {
          setDepositFirstDiff({ text: `${newParentBalance.toFixed(2)}`, color: '' });
        } else if (amount > parentBalance) {
          setDepositFirstDiff({ text: `(Insufficient)`, color: 'red' });
        } else {
          setDepositFirstDiff({ text: '', color: '' });
        }
        
        if (amount > 0) {
          setDepositSecondDiff({ text: `${newUserBalance.toFixed(2)}`, color: '' });
        } else {
          setDepositSecondDiff({ text: '', color: '' });
        }
      } else if (modal.type === 'freeChipsOut') {
        // Withdraw: parent balance increases, user balance decreases
        const parentBalance = parseFloat(modal.data?.parentBalance || 0);
        const userBalance = parseFloat(modal.user?.balance || 0);
        
        // Calculate new balances
        const newParentBalance = parentBalance + amount;
        let newUserBalance = userBalance - amount;
        
        // Ensure user balance doesn't go negative
        if (newUserBalance < 0) {
          newUserBalance = 0;
        }
        
        // Update diff elements using state
        if (amount > 0) {
          setWithdrawFirstDiff({ text: `${newParentBalance.toFixed(2)}`, color: '' });
        } else {
          setWithdrawFirstDiff({ text: '', color: '' });
        }
        
        if (amount > 0 && amount <= userBalance) {
          setWithdrawSecondDiff({ text: `${newUserBalance.toFixed(2)}`, color: '' });
        } else if (amount > userBalance) {
          setWithdrawSecondDiff({ text: `(Insufficient)`, color: 'red' });
        } else {
          setWithdrawSecondDiff({ text: '', color: '' });
        }
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Check if balance is insufficient
  const isInsufficientBalance = () => {
    if (modal.type === 'freeChipsIn') {
      // Deposit: check if amount exceeds parent balance
      const amount = parseFloat(formData.amount || 0);
      const parentBalance = parseFloat(modal.data?.parentBalance || 0);
      return amount > 0 && amount > parentBalance;
    } else if (modal.type === 'freeChipsOut') {
      // Withdraw: check if amount exceeds user balance
      const amount = parseFloat(formData.amount || 0);
      const userBalance = parseFloat(modal.user?.balance || 0);
      return amount > 0 && amount > userBalance;
    }
    return false;
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    switch (modal.type) {
      case 'creditReference':
        if (!formData.credit_reference || formData.credit_reference < 0) {
          newErrors.credit_reference = 'Please enter a valid credit reference amount';
        }
        if (!formData.transaction_password || formData.transaction_password.length < 1) {
          newErrors.transaction_password = 'Transaction password is required';
        } else if (formData.transaction_password.length > 15) {
          newErrors.transaction_password = 'Transaction password must be less than 15 characters';
        }
        break;

      case 'freeChipsIn':
        if (!formData.amount || formData.amount <= 0) {
          newErrors.amount = 'Please enter a valid amount (minimum 0.01)';
        }
        if (formData.remark && formData.remark.length > 255) {
          newErrors.remark = 'Remark must be less than 255 characters';
        }
        if (!formData.mpassword || formData.mpassword.length < 1) {
          newErrors.mpassword = 'Transaction password is required';
        } else if (formData.mpassword.length > 15) {
          newErrors.mpassword = 'Transaction password must be less than 15 characters';
        }
        break;
      case 'freeChipsOut':
        if (!formData.amount || formData.amount <= 0) {
          newErrors.amount = 'Please enter a valid amount (minimum 0.01)';
        } else if (formData.amount > modal.user.balance) {
          newErrors.amount = `Amount cannot exceed available balance (${modal.user.balance})`;
        }
        if (formData.remark && formData.remark.length > 255) {
          newErrors.remark = 'Remark must be less than 255 characters';
        }
        if (!formData.wmpassword || formData.wmpassword.length < 1) {
          newErrors.wmpassword = 'Transaction password is required';
        } else if (formData.wmpassword.length > 15) {
          newErrors.wmpassword = 'Transaction password must be less than 15 characters';
        }
        break;

      case 'exposureLimit':
        if (formData.exposure_limit < 0) {
          newErrors.exposure_limit = 'Please enter a valid exposure limit amount';
        }
        if (!formData.empassword || formData.empassword.length < 1) {
          newErrors.empassword = 'Transaction password is required';
        } else if (formData.empassword.length > 15) {
          newErrors.empassword = 'Transaction password must be less than 15 characters';
        }
        break;

      case 'changePassword':
        if (!formData.password || formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (formData.password.length > 20) {
          newErrors.password = 'Password must be less than 20 characters';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(formData.password)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }
        if (formData.password !== formData.password_confirmation) {
          newErrors.password_confirmation = 'Passwords do not match';
        }
        if (!formData.pmpassword || formData.pmpassword.length < 1) {
          newErrors.pmpassword = 'Transaction password is required';
        } else if (formData.pmpassword.length > 15) {
          newErrors.pmpassword = 'Transaction password must be less than 15 characters';
        }
        break;

      case 'toggleStatus':
        if (!formData.smpassword || formData.smpassword.length < 1) {
          newErrors.smpassword = 'Transaction password is required';
        } else if (formData.smpassword.length > 15) {
          newErrors.smpassword = 'Transaction password must be less than 15 characters';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let response;

      switch (modal.type) {
        case 'creditReference':
          response = await adminApi(`${ADMIN_BASE_PATH}/user/update-credit-reference`, 'POST', {
            user_id: modal.user.id,
            credit_reference: formData.credit_reference,
            transaction_password: formData.transaction_password
          }, true);
          break;
        case 'freeChipsIn':
          response = await adminApi(`${ADMIN_BASE_PATH}/user/free-chips`, 'POST', {
            user_id: modal.user.id,
            amount: formData.amount,
            remark: formData.remark,
            type: 'in',
            transaction_password: formData.mpassword
          }, true);
          break;
        case 'freeChipsOut':
          response = await adminApi(`${ADMIN_BASE_PATH}/user/free-chips`, 'POST', {
            user_id: modal.user.id,
            amount: formData.amount,
            remark: formData.remark,
            type: 'out',
            transaction_password: formData.wmpassword
          }, true);
          break;
        case 'exposureLimit':
          response = await adminApi(`${ADMIN_BASE_PATH}/user/update-exposure-limit`, 'POST', {
            user_id: modal.user.id,
            exposure_limit: formData.exposure_limit,
            transaction_password: formData.empassword
          }, true);
          break;
        case 'changePassword':
          response = await adminApi(`${ADMIN_BASE_PATH}/user/change-password`, 'POST', {
            user_id: modal.user.id,
            password: formData.password,
            password_confirmation: formData.password_confirmation,
            transaction_password: formData.pmpassword
          }, true);
          break;
        case 'toggleStatus':
          // Handle both toggles - send separate API calls for each field that changed
          const promises = [];
          
          // Check if userActive changed
          if (formData.userActive !== undefined && formData.userActive !== modal.user?.active) {
            promises.push(
              adminApi(`${ADMIN_BASE_PATH}/user/toggle-status`, 'POST', {
                user_id: modal.user.id,
                field: 'active',
                type : 'modal',
                value: formData.userActive,
                transaction_password: formData.smpassword
              }, true)
            );
          }
          
          // Check if betActive changed
          if (formData.betActive !== undefined && formData.betActive !== modal.user?.bet_status) {
            promises.push(
              adminApi(`${ADMIN_BASE_PATH}/user/toggle-status`, 'POST', {
                user_id: modal.user.id,
                field: 'bet_status',
                type : 'modal',
                value: formData.betActive,
                transaction_password: formData.smpassword
              })
            );
          }
          
          if (promises.length > 0) {
            const responses = await Promise.all(promises);
            response = responses[0]; // Use first response for success/error handling
          } else {
            response = { success: true, message: 'No changes to save' };
          }
          break;
        default:
          throw new Error('Unknown modal type');
      }

      if (response && response.success) {
        Notify(response.message, null, null, 'success');
        onSuccess();
        onClose();
      } else {
        // Handle validation errors from API
        if (response && response.errors) {
          setErrors(response.errors);
          Notify(response.message || 'Please fix the errors below', null, null, 'danger');
        } else {
          Notify(response?.message || 'Action failed', null, null, 'danger');
        }
      }
    } catch (error) {
      console.error('UserActionModal error:', error);
      
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Handle validation errors
        if (errorData.errors) {
          setErrors(errorData.errors);
          Notify(errorData.message || 'Please fix the errors below', null, null, 'danger');
        }
        // Handle specific error messages (like transaction password mismatch)
        else if (errorData.message) {
          // Clear any existing errors
          setErrors({});
          Notify(errorData.message, null, null, 'danger');
        }
        // Handle other error responses
        else {
          Notify('An error occurred while processing your request', null, null, 'danger');
        }
      }
      // Handle network or other errors
      else {
        Notify('An error occurred while processing your request', null, null, 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (modal.type) {
      case 'creditReference':
        return (
          <div className="container-fluid">
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Old Credit</label>
              </div>
              <div className="col-md-8">
                <span className="popup-box popup-box-full" id="old-credit">
                  {formData.old_credit || 0}
                </span>
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>New Credit</label>
              </div>
              <div className="col-md-8">
                <input
                  type="number"
                  id="new-credit"
                  name="credit_reference"
                  value={formData.credit_reference || ''}
                  onChange={handleInputChange}
                  className={`text-right maxlength10 ${errors.credit_reference ? 'is-invalid' : ''}`}
                  min="0"
                  max="9999999999"
                  placeholder="Enter new credit reference"
                  required
                />
                {errors.credit_reference && (
                  <div className="invalid-feedback">{errors.credit_reference}</div>
                )}
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Transaction Password</label>
              </div>
              <div className="col-md-8">
                <input
                  type="password"
                  name="transaction_password"
                  id="credit_password"
                  value={formData.transaction_password || ''}
                  onChange={handleInputChange}
                  className={`${errors.transaction_password ? 'is-invalid' : ''}`}
                  maxLength="15"
                  placeholder="Enter transaction password"
                  required
                />
                {errors.transaction_password && (
                  <div className="invalid-feedback">{errors.transaction_password}</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'freeChipsIn':
        return (
          <div className="container-fluid">
            <div className="row m-b-20">
              <div className="col-md-4">
                <label className="deposite-user-first">{modal.data.parentName || 'Loading..'}</label>
              </div>
              <div className="col-md-8">
                <span className="popup-box" id="deposite-first">
                  {modal.data.parentBalance || '0.00'}
                </span>
                <span className="popup-box" id="deposite-first-diff" style={{ color: depositFirstDiff.color }}>
                  {depositFirstDiff.text}
                </span>
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label className="deposite-user-second">{modal.user?.username || 'Loading..'}</label>
              </div>
              <div className="col-md-8">
                <span className="popup-box" id="deposite-second">
                  {modal.user?.balance || '0.00'}
                </span>
                <span className="popup-box" id="deposite-second-diff" style={{ color: depositSecondDiff.color }}>
                  {depositSecondDiff.text}
                </span>
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Amount</label>
              </div>
              <div className="col-md-8">
                <input
                  type="number"
                  className={`text-right maxlength10 number ${errors.amount ? 'is-invalid' : ''}`}
                  id="deposite-amount"
                  name="amount"
                  value={formData.amount || ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="9999999999"
                  step=".01"
                />
                {errors.amount && (
                  <div className="invalid-feedback">{errors.amount}</div>
                )}
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Remark</label>
              </div>
              <div className="col-md-8">
                <textarea
                  value={formData.remark || ''}
                  id="deposit-remark"
                  name="remark"
                  onChange={handleInputChange}
                  className={errors.remark ? 'is-invalid' : ''}
                />
                {errors.remark && (
                  <div className="invalid-feedback">{errors.remark}</div>
                )}
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Transaction Password</label>
              </div>
              <div className="col-md-8">
                <input
                  type="password"
                  name="mpassword"
                  id="mpassword"
                  value={formData.mpassword || ''}
                  onChange={handleInputChange}
                  className={errors.mpassword ? 'is-invalid' : ''}
                  required
                />
                {errors.mpassword && (
                  <div className="invalid-feedback">{errors.mpassword}</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'freeChipsOut':
        return (
          <div className="container-fluid">
            <div className="row m-b-20">
              <div className="col-md-4">
                <label className="withdraw-user-first">{modal.data.parentName || 'Loading..'}</label>
              </div>
              <div className="col-md-8">
                <span className="popup-box" id="withdraw-first">
                  {modal.data.parentBalance || '0.00'}
                </span>
                <span className="popup-box" id="withdraw-first-diff" style={{ color: withdrawFirstDiff.color }}>
                  {withdrawFirstDiff.text}
                </span>
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label className="withdraw-user-second">{modal.user?.username || 'Loading..'}</label>
              </div>
              <div className="col-md-8">
                <span className="popup-box" id="withdraw-second">
                  {modal.user?.balance || '0.00'}
                </span>
                <span className="popup-box" id="withdraw-second-diff" style={{ color: withdrawSecondDiff.color }}>
                  {withdrawSecondDiff.text}
                </span>
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Amount</label>
              </div>
              <div className="col-md-8">
                <input
                  type="number"
                  className={`text-right maxlength10 number ${errors.amount ? 'is-invalid' : ''}`}
                  id="withdraw-amount"
                  name="amount"
                  value={formData.amount || ''}
                  onChange={handleInputChange}
                  min="0"
                  max="9999999999"
                  step=".01"
                />
                {errors.amount && (
                  <div className="invalid-feedback">{errors.amount}</div>
                )}
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Remark</label>
              </div>
              <div className="col-md-8">
                <textarea
                  value={formData.remark || ''}
                  id="withdraw-remark"
                  name="remark"
                  onChange={handleInputChange}
                  className={errors.remark ? 'is-invalid' : ''}
                />
                {errors.remark && (
                  <div className="invalid-feedback">{errors.remark}</div>
                )}
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Transaction Password</label>
              </div>
              <div className="col-md-8">
                <input
                  type="password"
                  name="wmpassword"
                  id="wmpassword"
                  value={formData.wmpassword || ''}
                  onChange={handleInputChange}
                  className={errors.wmpassword ? 'is-invalid' : ''}
                  required
                />
                {errors.wmpassword && (
                  <div className="invalid-feedback">{errors.wmpassword}</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'exposureLimit':
        return (
          <div className="container-fluid">
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Old Limit</label>
              </div>
              <div className="col-md-8">
                <span className="popup-box popup-box-full" id="old-limit">
                  {formData.old_limit || 'Loading..'}
                </span>
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>New Limit</label>
              </div>
              <div className="col-md-8">
                <input
                  type="number"
                  className={`text-right maxlength10 ${errors.exposure_limit ? 'is-invalid' : ''}`}
                  id="new-limit"
                  name="exposure_limit"
                  value={formData.exposure_limit || ''}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="9999999999"
                />
                {errors.exposure_limit && (
                  <div className="invalid-feedback">{errors.exposure_limit}</div>
                )}
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Transaction Password</label>
              </div>
              <div className="col-md-8">
                <input
                  type="password"
                  name="empassword"
                  id="empassword"
                  value={formData.empassword || ''}
                  onChange={handleInputChange}
                  className={errors.empassword ? 'is-invalid' : ''}
                  required
                />
                {errors.empassword && (
                  <div className="invalid-feedback">{errors.empassword}</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'changePassword':
        return (
          <div className="container-fluid">
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>New Password</label>
              </div>
              <div className="col-md-8">
                <input
                  type="password"
                  className={`text-right password ${errors.password ? 'is-invalid' : ''}`}
                  name="password"
                  id="password"
                  value={formData.password || ''}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                  maxLength="20"
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Confirm Password</label>
              </div>
              <div className="col-md-8">
                <input
                  type="password"
                  className={`text-right confirm_password ${errors.password_confirmation ? 'is-invalid' : ''}`}
                  id="confirm_password"
                  name="password_confirmation"
                  value={formData.password_confirmation || ''}
                  onChange={handleInputChange}
                  required
                  minLength="8"
                  maxLength="20"
                />
                {errors.password_confirmation && (
                  <div className="invalid-feedback">{errors.password_confirmation}</div>
                )}
              </div>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4">
                <label>Transaction Password</label>
              </div>
              <div className="col-md-8">
                <input
                  type="password"
                  name="pmpassword"
                  id="pmpassword"
                  value={formData.pmpassword || ''}
                  onChange={handleInputChange}
                  required
                />
                {errors.pmpassword && (
                  <div className="invalid-feedback">{errors.pmpassword}</div>
                )}
              </div>
            </div>
            <div className="row m-b-20">
              <input type="hidden" id="pid" name="pid" value={modal.user?.id || ''} />
              <input type="hidden" id="clientPWUpdate" name="1" />
              <button style={{ display: 'none' }} id="submitbtnpw" type="submit" className="btn btn-submit">
                submit<i className="fas fa-sign-in-alt"></i>
              </button>
            </div>
          </div>
        );

      case 'toggleStatus':
        return (
          <div className="m-t-20">
            <div className="col-md-12">
              <div className="user-name">
                <p id="status-username">{modal.user?.username || 'Loading...'}</p>
              </div>
              <div className="float-right user-status">
             
                <p 
                  className="text-danger" 
                  id="user-active-diff-f" 
                  style={{ display: (formData.userActive !== undefined ? formData.userActive : (modal.user?.active || false)) ? 'none' : 'block' }}
                >
                  Inactive
                </p>
              </div>
            </div>
            <div className="row m-b-20">
              <ul className="status col-md-12 text-center m-t-20">
                <div className="row">
                  <li className="col-md-6">
                    <h4>User Active</h4>
                    <label className="switch">
                      <input 
                        name="userActive" 
                        id="status-user-active-s" 
                        checked={formData.userActive !== undefined ? formData.userActive : (modal.user?.active || false)}
                        type="checkbox"
                        onChange={handleInputChange}
                      />
                      <div id="s_usr" className="slider">
                        <span 
                          className="userStatusOnClass" 
                          style={{ 
                            color: (formData.userActive !== undefined ? formData.userActive : (modal.user?.active || false)) ? 'rgb(255, 255, 255)' : 'transparent',
                            display: (formData.userActive !== undefined ? formData.userActive : (modal.user?.active || false)) ? 'inline' : 'none'
                          }}
                        >
                          On
                        </span>
                        <span 
                          className="userStatusOffClass" 
                          style={{ 
                            display: (formData.userActive !== undefined ? formData.userActive : (modal.user?.active || false)) ? 'none' : 'block'
                          }}
                        >
                          Off
                        </span>
                      </div>
                    </label>
                  </li>
                  <li className="col-md-6">
                    <h4>Bet Active</h4>
                    <label className="switch">
                      <input 
                        name="betActive" 
                        id="status-bet-active-s" 
                        checked={formData.betActive !== undefined ? formData.betActive : (modal.user?.bet_status || false)}
                        type="checkbox"
                        onChange={handleInputChange}
                      />
                      <div id="s_bet" className="slider">
                        <span 
                          className="userBetOnClass" 
                          style={{ 
                            display: (formData.betActive !== undefined ? formData.betActive : (modal.user?.bet_status || false)) ? 'inline' : 'none'
                          }}
                        >
                          On
                        </span>
                        <span 
                          className="userBetOffClass" 
                          style={{ 
                            display: (formData.betActive !== undefined ? formData.betActive : (modal.user?.bet_status || false)) ? 'none' : 'block'
                          }}
                        >
                          Off
                        </span>
                      </div>
                    </label>
                  </li>
                </div>
              </ul>
            </div>
            <div className="row m-b-20">
              <div className="col-md-4 text-right">
                <label>Transaction Password</label>
              </div>
              <div className="col-md-7">
                <input 
                  type="password" 
                  name="smpassword" 
                  id="smpassword" 
                  value={formData.smpassword || ''}
                  onChange={handleInputChange}
                  required 
                />
                {errors.smpassword && (
                  <div className="invalid-feedback">{errors.smpassword}</div>
                )}
              </div>
            </div>
            <input type="hidden" id="status-uid" value={modal.user?.id || ''} />
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modal.type) {
      case 'creditReference':
        return 'Credit Reference';
      case 'freeChipsIn':
        return 'Deposit';
      case 'freeChipsOut':
        return 'Withdraw';
      case 'exposureLimit':
        return 'Exposure Limit';
      case 'changePassword':
        return 'Change Password';
      case 'toggleStatus':
        return 'Change Status';
      default:
        return 'User Action';
    }
  };

  const getModalIcon = () => {
    switch (modal.type) {
      case 'creditReference':
        return '💰';
      case 'freeChipsIn':
        return '📈';
      case 'freeChipsOut':
        return '📉';
      case 'exposureLimit':
        return '⚠️';
      case 'changePassword':
        return '🔒';
      case 'toggleStatus':
        return '🔄';
      default:
        return '⚙️';
    }
  };

  if (!modal.isOpen) return null;

  return (
    <>
      
      <div 
        className="modal fade show" 
        style={{ display: 'block' }} 
        tabIndex="-1" 
        role="dialog"
        onClick={onClose}
      >
      <div 
        className="modal-dialog modal-dialog-centered modal-md" 
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{getModalTitle()}</h4>
            <button
              type="button"
              className="close"
              onClick={onClose}
              disabled={loading}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {renderFormFields()}
            </div>
            <div className="modal-footer">
              {modal.type === 'creditReference' && (
                <input type="hidden" name="uid" id="credit-uid" value={modal.user?.id || ''} />
              )}
              {modal.type === 'freeChipsIn' && (
                <input type="hidden" name="UserID" id="UserID" value={modal.user?.id || ''} />
              )}
              {modal.type === 'freeChipsOut' && (
                <input type="hidden" name="uid" id="withdraw-uid" value={modal.user?.id || ''} />
              )}
              {modal.type === 'exposureLimit' && (
                <input type="hidden" name="uid" id="limit-uid" value={modal.user?.id || ''} />
              )}
              <button
                type="button"
                className="btn btn-back"
                onClick={onClose}
                disabled={loading}
              >
                <i className="fas fa-undo"></i>Back
              </button>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={loading || isInsufficientBalance()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    submit<i className="fas fa-sign-in-alt"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserActionModal;
