import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setPasswordChanged } from '@dxc247/shared/store/slices/userSlice';
import Notify from '@dxc247/shared/utils/Notify';

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector(state => state.user);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Check if password change is needed - use useEffect for proper navigation
  useEffect(() => {
    if (userState.user && userState.user.ch_pas === 0) {
      // Password already changed, redirect to home
      navigate('/');
    }
  }, [userState.user, navigate]);

  // Show loading if user data is not loaded yet or if redirecting
  if (!userState.user || (userState.user && userState.user.ch_pas === 0)) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Password regex: 8 to 15 characters with at least one lowercase, one uppercase, and one numeric digit
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/;

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required';
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required';
    } else if (formData.new_password.length < 8 || formData.new_password.length > 15) {
      newErrors.new_password = 'Password must be 8 to 15 characters';
    } else if (!passwordRegex.test(formData.new_password)) {
      newErrors.new_password = '8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit.';
    }

    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Confirm password is required';
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const token = userState.token;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Password changed successfully
        Notify(data.message || 'Password changed successfully!', null, null, 'success');
        dispatch(setPasswordChanged());
        // Redirect to home page
        navigate('/');
      } else {
        // Handle validation errors or other errors
        if (data.errors) {
          const errorMessages = [];
          for (let property in data.errors) {
            errorMessages.push(data.errors[property].join(", "));
          }
          Notify(errorMessages.join("\n"), null, null, 'danger');
        } else {
          Notify(data.message || 'Failed to change password', null, null, 'danger');
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Notify('An error occurred while changing password', null, null, 'danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f8fb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
        minWidth: '300px'
      }}>
        <h2 style={{ 
          marginBottom: '30px', 
          color: '#333',
          textAlign: 'center',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)'
        }}>
          Change Password
        </h2>

        <form onSubmit={handleSubmit} id="changePasswordFrm">
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="current_password" className="form-label" style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
              Current Password
            </label>
            <input
              type="password"
              name="current_password"
              id="current_password"
              className={`form-control ${errors.current_password ? 'is-invalid' : ''}`}
              placeholder="Current Password"
              maxLength="100"
              autoComplete="new-password"
              value={formData.current_password}
              onChange={handleInputChange}
              required
              style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', padding: 'clamp(8px, 2vw, 12px)' }}
            />
            {errors.current_password && (
              <div className="invalid-feedback" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>
                {errors.current_password}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="new_password" className="form-label" style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
              New Password
            </label>
            <input
              type="password"
              name="new_password"
              id="new_password"
              className={`form-control password ${errors.new_password ? 'is-invalid' : ''}`}
              placeholder="New Password"
              minLength="8"
              maxLength="15"
              autoComplete="new-password"
              value={formData.new_password}
              onChange={handleInputChange}
              required
              style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', padding: 'clamp(8px, 2vw, 12px)' }}
            />
            {errors.new_password && (
              <div className="invalid-feedback" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>
                {errors.new_password}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="new_password_confirmation" className="form-label" style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="new_password_confirmation"
              id="new_password_confirmation"
              className={`form-control ${errors.new_password_confirmation ? 'is-invalid' : ''}`}
              placeholder="Confirm Password"
              minLength="8"
              maxLength="15"
              autoComplete="new-password"
              value={formData.new_password_confirmation}
              onChange={handleInputChange}
              required
              style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', padding: 'clamp(8px, 2vw, 12px)' }}
            />
            {errors.new_password_confirmation && (
              <div className="invalid-feedback" style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>
                {errors.new_password_confirmation}
              </div>
            )}
          </div>


          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                padding: 'clamp(10px, 3vw, 14px) clamp(20px, 5vw, 40px)',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                minWidth: 'clamp(120px, 20vw, 150px)',
                width: '100%',
                maxWidth: '200px'
              }}
            >
              {loading ? 'Changing...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
