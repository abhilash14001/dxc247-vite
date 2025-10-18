import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from './adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import LoadingSpinner from '@dxc247/shared/components/ui/LoadingSpinner';
import { toast } from 'react-toastify';

// Custom Toggle Switch Component
const ToggleSwitch = ({ id, checked, onChange, label, isParent = false }) => (
  <div className="form-check">
    <div className="custom-toggle-switch">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="toggle-input"
      />
      <label htmlFor={id} className="toggle-label">
        <span className="toggle-slider"></span>
      </label>
      <label htmlFor={id} className={`form-check-label ${isParent ? 'fw-bold' : ''}`}>
        {label}
      </label>
    </div>

    <style jsx>{`
      .custom-toggle-switch {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
      }
      .toggle-input {
        display: none;
      }
      .toggle-label {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 26px;
        background: linear-gradient(145deg, #e0e0e0, #c0c0c0);
        border-radius: 26px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
      }
      .toggle-slider {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 22px;
        height: 22px;
        background: linear-gradient(145deg, #ffffff, #f0f0f0);
        border-radius: 50%;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1);
      }
      .toggle-input:checked + .toggle-label {
        background: linear-gradient(145deg, #28a745, #20c997);
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
      }
      .toggle-input:checked + .toggle-label .toggle-slider {
        transform: translateX(24px);
        background: linear-gradient(145deg, #ffffff, #f8f9fa);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1);
      }
      .toggle-input:focus + .toggle-label {
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.25), inset 0 2px 4px rgba(0,0,0,0.1);
      }
      .toggle-input:hover + .toggle-label {
        transform: scale(1.05);
      }
      .form-check-label {
        font-weight: 500;
        color: #495057;
        transition: color 0.3s ease;
      }
      .toggle-input:checked ~ .form-check-label {
        color: #28a745;
        font-weight: 600;
      }
    `}</style>
  </div>
);

const AdminEditPrivilege = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirm_password: '',
    role: 1,
    permissions: []
  });

  const permissionCategories = [
    {
      title: 'Main',
      permissions: [
        { value: 'client-list', label: 'List Of Clients' },
        { value: 'market-analysis', label: 'Market Analysis' }
      ]
    },
    {
      title: 'Casino Market',
      permissions: [
        { value: 'casino-market', label: 'Casino Market', isParent: true },
        { value: 'casino', label: 'Casino', parent: 'casino-market' },
        { value: 'virtual', label: 'Virtual', parent: 'casino-market' }
      ]
    },
    {
      title: 'Reports',
      permissions: [
        { value: 'reports', label: 'Reports', isParent: true },
        { value: 'account-statement', label: 'Account Statement', parent: 'reports' },
        { value: 'client-p-l', label: 'Client P L', parent: 'reports' },
        { value: 'sport-p-l', label: 'Sport P L', parent: 'reports' },
        { value: 'profit-loss', label: 'Profit & Loss', parent: 'reports' },
        { value: 'match-p-l', label: 'Match P L', parent: 'reports' },
        { value: 'current-bet', label: 'Current Bet', parent: 'reports' },
        { value: 'bet-history', label: 'Bet History', parent: 'reports' },
        { value: 'deleted-bet-history', label: 'Deleted Bet History', parent: 'reports' },
        { value: 'casino-result', label: 'Casino Result', parent: 'reports' },
        { value: 'line-market-bet-history', label: 'Line Market Bet History', parent: 'reports' }
      ]
    },
    {
      title: 'Settings',
      permissions: [
        { value: 'setting', label: 'Setting', isParent: true },
        { value: 'sports-market', label: 'Sports Market', parent: 'setting' },
        { value: 'setting-casino-market', label: 'Casino Market', parent: 'setting' },
        { value: 'match-history', label: 'Match History', parent: 'setting' },
        { value: 'manage-fancy', label: 'Manage Fancy', parent: 'setting' },
        { value: 'fancy-history', label: 'Fancy History', parent: 'setting' },
        { value: 'site-configuration', label: 'Site Configuration', parent: 'setting' },
        { value: 'manage-privilege', label: 'Multi Login Account', parent: 'setting' },
        { value: 'manage-prefix', label: 'Manage Prefix', parent: 'setting' },
        { value: 'block-market', label: 'Block Market', parent: 'setting' },
        { value: 'client-tack', label: 'Client Track', parent: 'setting' },
        { value: 'banner-manager', label: 'Banner Manager', parent: 'setting' },
        { value: 'block-ip', label: 'Block IP', parent: 'setting' }
      ]
    }
  ];

  // Load privilege details
  useEffect(() => {
    const loadPrivilegeDetails = async () => {
      try {
        setInitialLoading(true);
        const response = await adminApi(`${ADMIN_BASE_PATH}/privilege/details`, 'POST', { user_id: id });
        if (response.success) {
          const data = response.data;
          setFormData({
            name: data.name || '',
            username: data.username || '',
            password: '',
            confirm_password: '',
            role: data.role || 1,
            permissions: data.permissions || []
          });
        } else {
          toast.error(response.message || 'Failed to load privilege details');
          navigate('/settings/multi-login');
        }
      } catch (error) {
        console.error('Error loading privilege details:', error);
        toast.error('Failed to load privilege details');
        navigate('/settings/multi-login');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) loadPrivilegeDetails();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => {
      let newPermissions = [...prev.permissions];
      const isSelected = newPermissions.includes(permission);

      if (isSelected) {
        // Remove permission
        newPermissions = newPermissions.filter(p => p !== permission);

        // Remove children if parent
        const category = permissionCategories.find(cat => cat.permissions.some(p => p.value === permission && p.isParent));
        if (category) {
          const children = category.permissions.filter(p => p.parent === permission).map(p => p.value);
          newPermissions = newPermissions.filter(p => !children.includes(p));
        }

        // Remove parent if no children selected
        permissionCategories.forEach(cat => {
          cat.permissions.forEach(p => {
            if (p.value === permission && p.parent) {
              const siblings = cat.permissions.filter(sp => sp.parent === p.parent).map(sp => sp.value);
              const anySelected = siblings.some(sib => newPermissions.includes(sib));
              if (!anySelected) newPermissions = newPermissions.filter(np => np !== p.parent);
            }
          });
        });
      } else {
        // Add permission
        newPermissions.push(permission);

        // Add children if parent
        const category = permissionCategories.find(cat => cat.permissions.some(p => p.value === permission && p.isParent));
        if (category) {
          const children = category.permissions.filter(p => p.parent === permission).map(p => p.value);
          children.forEach(child => { if (!newPermissions.includes(child)) newPermissions.push(child); });
        }

        // Add parent if child
        permissionCategories.forEach(cat => {
          cat.permissions.forEach(p => {
            if (p.value === permission && p.parent && !newPermissions.includes(p.parent)) newPermissions.push(p.parent);
          });
        });
      }

      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSelectAll = () => {
    const allPermissions = permissionCategories.flatMap(cat => cat.permissions.map(p => p.value));
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.length === allPermissions.length ? [] : allPermissions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error('Full Name is required');
    if (!formData.username.trim()) return toast.error('Email is required');
    if (formData.password && formData.password !== formData.confirm_password) return toast.error('Passwords do not match');
    if (formData.permissions.length === 0) return toast.error('Please select at least one permission');

    try {
      setLoading(true);
      const apiData = { user_id: id, name: formData.name, username: formData.username, role: formData.role, permissions: formData.permissions };
      if (formData.password) apiData.password = formData.password;

      const response = await adminApi(`${ADMIN_BASE_PATH}/privilege/update`, 'POST', apiData);
      if (response.success) {
        toast.success('Privilege user updated successfully');
        navigate('/settings/multi-login');
      } else {
        toast.error(response.message || 'Failed to update privilege user');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update privilege user');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  const allPermissions = permissionCategories.flatMap(cat => cat.permissions.map(p => p.value));
  const isAllSelected = formData.permissions.length === allPermissions.length;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-header mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1 text-primary">
                  <i className="fas fa-user-edit me-2"></i>
                  Edit Privilege User
                </h2>
                <p className="text-muted mb-0">Manage user permissions and access levels</p>
              </div>
              <div className="text-end">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary me-2"
                  onClick={() => navigate('/settings/multi-login')}
                >
                  <i className="fas fa-arrow-left me-1"></i>
                  Back to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* User Information Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-gradient-primary text-white">
            <h5 className="mb-0">
              <i className="fas fa-user me-2"></i>
              User Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label fw-semibold">
                  <i className="fas fa-user me-1 text-primary"></i>
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  className="form-control form-control-lg" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Enter full name"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="username" className="form-label fw-semibold">
                  <i className="fas fa-at me-1 text-primary"></i>
                  Login User ID
                </label>
                <input 
                  type="text" 
                  name="username" 
                  id="username" 
                  className="form-control form-control-lg" 
                  value={formData.username} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Enter username"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label fw-semibold">
                  <i className="fas fa-lock me-1 text-primary"></i>
                  New Password
                  <small className="text-muted d-block">Leave blank to keep current password</small>
                </label>
                <input 
                  type="password" 
                  name="password" 
                  id="password" 
                  className="form-control form-control-lg" 
                  value={formData.password} 
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="confirm_password" className="form-label fw-semibold">
                  <i className="fas fa-lock me-1 text-primary"></i>
                  Confirm New Password
                </label>
                <input 
                  type="password" 
                  name="confirm_password" 
                  id="confirm_password" 
                  className="form-control form-control-lg" 
                  value={formData.confirm_password} 
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Card */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-gradient-success text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-shield-alt me-2"></i>
                User Permissions
              </h5>
              <div className="d-flex align-items-center">
                <ToggleSwitch 
                  id="checkAll" 
                  checked={isAllSelected} 
                  onChange={handleSelectAll} 
                  label="Select All" 
                  isParent 
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              {permissionCategories.map((category, idx) => (
                <div className="col-lg-4 col-md-6 mb-4" key={idx}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-header bg-light border-0">
                      <h6 className="mb-0 text-dark fw-bold">
                        <i className={`fas ${
                          category.title === 'Main' ? 'fa-home' :
                          category.title === 'Casino Market' ? 'fa-dice' :
                          category.title === 'Reports' ? 'fa-chart-line' :
                          'fa-cogs'
                        } me-2 text-primary`}></i>
                        {category.title}
                      </h6>
                    </div>
                    <div className="card-body">
                      {category.permissions.map((permission, pIdx) => (
                        <div 
                          key={pIdx} 
                          className={`mb-3 ${permission.parent ? 'ms-4 border-start border-3 border-primary ps-3 bg-light rounded py-2' : ''}`}
                        >
                          <ToggleSwitch
                            id={permission.value}
                            checked={formData.permissions.includes(permission.value)}
                            onChange={() => handlePermissionChange(permission.value)}
                            label={permission.label}
                            isParent={permission.isParent}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Review all permissions before saving changes
              </div>
              <div className="d-flex gap-2">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={() => navigate('/settings/multi-login')}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg px-4" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Update User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminEditPrivilege;
