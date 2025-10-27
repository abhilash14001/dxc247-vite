import React, { useState, useEffect } from 'react';
import { adminApiMethods } from '@dxc247/shared/utils/adminApi';
import Notify from '@dxc247/shared/utils/Notify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldAlt, 
  faBell, 
  faCog, 
  faUser 
} from '@fortawesome/free-solid-svg-icons';

function AdminProfile() {
  const [profile, setProfile] = useState({
    id: 1,
    username: 'admin_user',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+1 234 567 8900',
    avatar: '/img/admin-avatar.jpg',
    role: 'Super Admin',
    permissions: ['users', 'bets', 'reports', 'settings', 'casino', 'sports'],
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    isActive: true,
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true
  });

  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // Mock profile load - replace with API call
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    const { current_password, new_password, new_password_confirmation } = passwordForm;

    if (!current_password.trim()) errors.current_password = 'Current password is required';
    if (!new_password.trim()) {
      errors.new_password = 'New password is required';
    } else if (new_password.length < 8 || new_password.length > 15) {
      errors.new_password = 'Password must be 8-15 characters';
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(new_password)) {
      errors.new_password = 'Must contain uppercase, lowercase, and number';
    }

    if (!new_password_confirmation.trim()) {
      errors.new_password_confirmation = 'Please confirm your password';
    } else if (new_password !== new_password_confirmation) {
      errors.new_password_confirmation = 'Passwords do not match';
    }

    if (current_password === new_password) {
      errors.new_password = 'New password must be different';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setPasswordLoading(true);
    try {
      const response = await adminApiMethods.changePassword(passwordForm);
      if (response.success) {
        Notify(response.message || 'Password changed successfully!', null, null, 'success');
        setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      } else {
        if (response.errors) {
          const messages = Object.values(response.errors).flat().join('\n');
          Notify(messages, null, null, 'danger');
        } else {
          Notify(response.message || 'Failed to change password', null, null, 'danger');
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Notify('An error occurred while changing password', null, null, 'danger');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-profile-loading text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="admin-profile">
          <h2 className="mb-4">Change Password for SADMIN</h2>

          <form
            onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}
          >
            <div className="row">
              {/* Current Password */}
              <div className="col-md-4 col-sm-12 mb-3">
                <label htmlFor="current_password" className="form-label">Current Password</label>
                <input
                  type="password"
                  id="current_password"
                  value={passwordForm.current_password}
                  onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                  className="form-control"
                  placeholder="Current Password"
                  disabled={passwordLoading}
                />
                {passwordErrors.current_password && <small className="text-danger">{passwordErrors.current_password}</small>}
              </div>

              {/* New Password */}
              <div className="col-md-4 col-sm-12 mb-3">
                <label htmlFor="new_password" className="form-label">New Password</label>
                <input
                  type="password"
                  id="new_password"
                  value={passwordForm.new_password}
                  onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                  className="form-control"
                  placeholder="New Password"
                  disabled={passwordLoading}
                />
                {passwordErrors.new_password && <small className="text-danger">{passwordErrors.new_password}</small>}
              </div>

              {/* Confirm Password */}
              <div className="col-md-4 col-sm-12 mb-3">
                <label htmlFor="new_password_confirmation" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="new_password_confirmation"
                  value={passwordForm.new_password_confirmation}
                  onChange={(e) => handlePasswordChange('new_password_confirmation', e.target.value)}
                  className="form-control"
                  placeholder="Confirm Password"
                  disabled={passwordLoading}
                />
                {passwordErrors.new_password_confirmation && <small className="text-danger">{passwordErrors.new_password_confirmation}</small>}
              </div>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                {passwordLoading ? 'Changing...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
