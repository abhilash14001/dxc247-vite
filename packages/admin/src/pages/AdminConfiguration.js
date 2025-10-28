import React, { useState, useEffect } from 'react';
import { adminApi } from '@dxc247/shared/utils/adminApi';

import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faUndo,
  faCog,
  faShieldAlt,
  faBell,
  faGlobe,
  faDatabase,
  faLock,
  faUserCog,
  faServer,
  faKey,
  faEye,
  faEyeSlash,
  faUpload,
  faDownload,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';


function AdminConfiguration() {
  const [config, setConfig] = useState({
    general: {
      site_name: '',
      site_url: '',
      admin_email: '',
      timezone: 'UTC',
      currency: 'USD',
      language: 'en',
      maintenance_mode: false
    },
    security: {
      session_timeout: 30,
      max_login_attempts: 5,
      password_min_length: 8,
      two_factor_auth: false,
      ip_whitelist: '',
      ssl_required: true,
      password_reset_expiry: 60
    },
    betting: {
      min_bet_amount: 1,
      max_bet_amount: 10000,
      max_exposure: 50000,
      commission_rate: 0.05,
      auto_settle: false,
      live_betting: true,
      bet_timeout: 30
    },
    notifications: {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      admin_alerts: true,
      user_alerts: true,
      email_smtp_host: '',
      email_smtp_port: 587,
      email_smtp_username: '',
      email_smtp_password: ''
    },
    api: {
      api_enabled: true,
      rate_limit: 1000,
      api_key: '',
      webhook_url: '',
      third_party_integrations: false,
      api_timeout: 30
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      const response = await adminApi(`${ADMIN_BASE_PATH}/configuration`, 'GET', {}, true);
      if (response.success && response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await adminApi(`${ADMIN_BASE_PATH}/configuration/update`, 'POST', config, true);
      if (response.success) {
        alert('Configuration saved successfully!');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Error saving configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all configuration to default values?')) {
      loadConfiguration();
    }
  };

  const handleInputChange = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: faGlobe },
    { id: 'security', label: 'Security', icon: faShieldAlt },
    { id: 'betting', label: 'Betting', icon: faCog },
    { id: 'notifications', label: 'Notifications', icon: faBell },
    { id: 'api', label: 'API', icon: faServer }
  ];

  if (loading) {
    return (
      <div className="admin-configuration-loading">
        <div className="loading-spinner"></div>
        <p>Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="admin-configuration">
        <div className="page-header">
          <div className="header-left">
            <h1>Site Configuration</h1>
            <p>Manage global site settings and preferences</p>
          </div>
          <div className="header-right">
            <button 
              className="btn btn-outline"
              onClick={handleReset}
            >
              <FontAwesomeIcon icon={faUndo} />
              Reset
            </button>
            <button 
              className="btn btn-outline"
            >
              <FontAwesomeIcon icon={faDownload} />
              Export
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              <FontAwesomeIcon icon={faSave} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="configuration-container">
          <div className="tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <FontAwesomeIcon icon={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'general' && (
              <div className="config-section">
                <h3>General Settings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Site Name</label>
                    <input
                      type="text"
                      value={config.general.site_name}
                      onChange={(e) => handleInputChange('general', 'site_name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Site URL</label>
                    <input
                      type="url"
                      value={config.general.site_url}
                      onChange={(e) => handleInputChange('general', 'site_url', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Admin Email</label>
                    <input
                      type="email"
                      value={config.general.admin_email}
                      onChange={(e) => handleInputChange('general', 'admin_email', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={config.general.timezone}
                      onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={config.general.currency}
                      onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="INR">INR</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={config.general.language}
                      onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.general.maintenance_mode}
                        onChange={(e) => handleInputChange('general', 'maintenance_mode', e.target.checked)}
                      />
                      Maintenance Mode
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="config-section">
                <h3>Security Settings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={config.security.session_timeout}
                      onChange={(e) => handleInputChange('security', 'session_timeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Login Attempts</label>
                    <input
                      type="number"
                      value={config.security.max_login_attempts}
                      onChange={(e) => handleInputChange('security', 'max_login_attempts', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password Min Length</label>
                    <input
                      type="number"
                      value={config.security.password_min_length}
                      onChange={(e) => handleInputChange('security', 'password_min_length', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password Reset Expiry (minutes)</label>
                    <input
                      type="number"
                      value={config.security.password_reset_expiry}
                      onChange={(e) => handleInputChange('security', 'password_reset_expiry', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>IP Whitelist (comma-separated)</label>
                    <textarea
                      value={config.security.ip_whitelist}
                      onChange={(e) => handleInputChange('security', 'ip_whitelist', e.target.value)}
                      rows="3"
                      placeholder="192.168.1.1, 10.0.0.1"
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.security.two_factor_auth}
                        onChange={(e) => handleInputChange('security', 'two_factor_auth', e.target.checked)}
                      />
                      Two Factor Authentication
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.security.ssl_required}
                        onChange={(e) => handleInputChange('security', 'ssl_required', e.target.checked)}
                      />
                      SSL Required
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'betting' && (
              <div className="config-section">
                <h3>Betting Settings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Min Bet Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={config.betting.min_bet_amount}
                      onChange={(e) => handleInputChange('betting', 'min_bet_amount', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Bet Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={config.betting.max_bet_amount}
                      onChange={(e) => handleInputChange('betting', 'max_bet_amount', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Exposure</label>
                    <input
                      type="number"
                      step="0.01"
                      value={config.betting.max_exposure}
                      onChange={(e) => handleInputChange('betting', 'max_exposure', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Commission Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={config.betting.commission_rate * 100}
                      onChange={(e) => handleInputChange('betting', 'commission_rate', parseFloat(e.target.value) / 100)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bet Timeout (seconds)</label>
                    <input
                      type="number"
                      value={config.betting.bet_timeout}
                      onChange={(e) => handleInputChange('betting', 'bet_timeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.betting.auto_settle}
                        onChange={(e) => handleInputChange('betting', 'auto_settle', e.target.checked)}
                      />
                      Auto Settle
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.betting.live_betting}
                        onChange={(e) => handleInputChange('betting', 'live_betting', e.target.checked)}
                      />
                      Live Betting
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="config-section">
                <h3>Notification Settings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>SMTP Host</label>
                    <input
                      type="text"
                      value={config.notifications.email_smtp_host}
                      onChange={(e) => handleInputChange('notifications', 'email_smtp_host', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>SMTP Port</label>
                    <input
                      type="number"
                      value={config.notifications.email_smtp_port}
                      onChange={(e) => handleInputChange('notifications', 'email_smtp_port', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>SMTP Username</label>
                    <input
                      type="text"
                      value={config.notifications.email_smtp_username}
                      onChange={(e) => handleInputChange('notifications', 'email_smtp_username', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>SMTP Password</label>
                    <div className="password-input">
                      <input
                        type={showSmtpPassword ? 'text' : 'password'}
                        value={config.notifications.email_smtp_password}
                        onChange={(e) => handleInputChange('notifications', 'email_smtp_password', e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      >
                        <FontAwesomeIcon icon={showSmtpPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.notifications.email_notifications}
                        onChange={(e) => handleInputChange('notifications', 'email_notifications', e.target.checked)}
                      />
                      Email Notifications
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.notifications.sms_notifications}
                        onChange={(e) => handleInputChange('notifications', 'sms_notifications', e.target.checked)}
                      />
                      SMS Notifications
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.notifications.push_notifications}
                        onChange={(e) => handleInputChange('notifications', 'push_notifications', e.target.checked)}
                      />
                      Push Notifications
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.notifications.admin_alerts}
                        onChange={(e) => handleInputChange('notifications', 'admin_alerts', e.target.checked)}
                      />
                      Admin Alerts
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.notifications.user_alerts}
                        onChange={(e) => handleInputChange('notifications', 'user_alerts', e.target.checked)}
                      />
                      User Alerts
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="config-section">
                <h3>API Settings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Rate Limit (requests per hour)</label>
                    <input
                      type="number"
                      value={config.api.rate_limit}
                      onChange={(e) => handleInputChange('api', 'rate_limit', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>API Key</label>
                    <div className="password-input">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={config.api.api_key}
                        onChange={(e) => handleInputChange('api', 'api_key', e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        <FontAwesomeIcon icon={showApiKey ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Webhook URL</label>
                    <input
                      type="url"
                      value={config.api.webhook_url}
                      onChange={(e) => handleInputChange('api', 'webhook_url', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>API Timeout (seconds)</label>
                    <input
                      type="number"
                      value={config.api.api_timeout}
                      onChange={(e) => handleInputChange('api', 'api_timeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.api.api_enabled}
                        onChange={(e) => handleInputChange('api', 'api_enabled', e.target.checked)}
                      />
                      API Enabled
                    </label>
                  </div>
                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={config.api.third_party_integrations}
                        onChange={(e) => handleInputChange('api', 'third_party_integrations', e.target.checked)}
                      />
                      Third Party Integrations
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default AdminConfiguration;
