import React, { useState, useEffect } from 'react';
import { adminApiMethods } from '@dxc247/shared/utils/adminApi';
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
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';


function AdminSettings() {
  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      siteUrl: '',
      adminEmail: '',
      timezone: 'UTC',
      currency: 'USD',
      language: 'en'
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      twoFactorAuth: false,
      ipWhitelist: '',
      sslRequired: true
    },
    betting: {
      minBetAmount: 1,
      maxBetAmount: 10000,
      maxExposure: 50000,
      commissionRate: 0.05,
      autoSettle: false,
      liveBetting: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true,
      userAlerts: true
    },
    api: {
      apiEnabled: true,
      rateLimit: 1000,
      apiKey: '',
      webhookUrl: '',
      thirdPartyIntegrations: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await adminApiMethods.getSettings();
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await adminApiMethods.updateSettings(settings);
      if (response.success) {
        alert('Settings saved successfully!');
      } else {
        alert('Error saving settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      loadSettings();
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const generateApiKey = () => {
    const newKey = 'sk_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    handleInputChange('api', 'apiKey', newKey);
  };

  const tabs = [
    { id: 'general', name: 'General', icon: faCog },
    { id: 'security', name: 'Security', icon: faShieldAlt },
    { id: 'betting', name: 'Betting', icon: faUserCog },
    { id: 'notifications', name: 'Notifications', icon: faBell },
    { id: 'api', name: 'API & Integrations', icon: faServer }
  ];

  if (loading) {
    return (
      <div className="admin-settings-loading">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
      <div className="admin-settings">
      <div className="page-header">
        <div className="header-left">
          <h1>System Settings</h1>
          <p>Configure system-wide settings and preferences</p>
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
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            <FontAwesomeIcon icon={faSave} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Site URL</label>
                  <input
                    type="url"
                    value={settings.general.siteUrl}
                    onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                    className="form-control"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="GMT">GMT</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
                    className="form-control"
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
                    value={settings.general.language}
                    onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                    className="form-control"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="form-control"
                    min="5"
                    max="480"
                  />
                </div>
                <div className="form-group">
                  <label>Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="form-control"
                    min="3"
                    max="10"
                  />
                </div>
                <div className="form-group">
                  <label>Password Min Length</label>
                  <input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                    className="form-control"
                    min="6"
                    max="20"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                    />
                    Enable Two-Factor Authentication
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.security.sslRequired}
                      onChange={(e) => handleInputChange('security', 'sslRequired', e.target.checked)}
                    />
                    Require SSL
                  </label>
                </div>
                <div className="form-group full-width">
                  <label>IP Whitelist (one per line)</label>
                  <textarea
                    value={settings.security.ipWhitelist}
                    onChange={(e) => handleInputChange('security', 'ipWhitelist', e.target.value)}
                    className="form-control"
                    rows="3"
                    placeholder="192.168.1.1&#10;10.0.0.1"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'betting' && (
            <div className="settings-section">
              <h3>Betting Settings</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Minimum Bet Amount</label>
                  <input
                    type="number"
                    value={settings.betting.minBetAmount}
                    onChange={(e) => handleInputChange('betting', 'minBetAmount', parseFloat(e.target.value))}
                    className="form-control"
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Bet Amount</label>
                  <input
                    type="number"
                    value={settings.betting.maxBetAmount}
                    onChange={(e) => handleInputChange('betting', 'maxBetAmount', parseFloat(e.target.value))}
                    className="form-control"
                    min="1"
                    step="1"
                  />
                </div>
                <div className="form-group">
                  <label>Maximum Exposure</label>
                  <input
                    type="number"
                    value={settings.betting.maxExposure}
                    onChange={(e) => handleInputChange('betting', 'maxExposure', parseFloat(e.target.value))}
                    className="form-control"
                    min="1000"
                    step="1000"
                  />
                </div>
                <div className="form-group">
                  <label>Commission Rate (%)</label>
                  <input
                    type="number"
                    value={settings.betting.commissionRate * 100}
                    onChange={(e) => handleInputChange('betting', 'commissionRate', parseFloat(e.target.value) / 100)}
                    className="form-control"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.betting.autoSettle}
                      onChange={(e) => handleInputChange('betting', 'autoSettle', e.target.checked)}
                    />
                    Auto Settle Bets
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.betting.liveBetting}
                      onChange={(e) => handleInputChange('betting', 'liveBetting', e.target.checked)}
                    />
                    Enable Live Betting
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Settings</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                    />
                    Email Notifications
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                    />
                    SMS Notifications
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
                    />
                    Push Notifications
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.adminAlerts}
                      onChange={(e) => handleInputChange('notifications', 'adminAlerts', e.target.checked)}
                    />
                    Admin Alerts
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.userAlerts}
                      onChange={(e) => handleInputChange('notifications', 'userAlerts', e.target.checked)}
                    />
                    User Alerts
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="settings-section">
              <h3>API & Integration Settings</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.api.apiEnabled}
                      onChange={(e) => handleInputChange('api', 'apiEnabled', e.target.checked)}
                    />
                    Enable API
                  </label>
                </div>
                <div className="form-group">
                  <label>Rate Limit (requests per hour)</label>
                  <input
                    type="number"
                    value={settings.api.rateLimit}
                    onChange={(e) => handleInputChange('api', 'rateLimit', parseInt(e.target.value))}
                    className="form-control"
                    min="100"
                    max="10000"
                  />
                </div>
                <div className="form-group full-width">
                  <label>API Key</label>
                  <div className="input-group">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.api.apiKey}
                      onChange={(e) => handleInputChange('api', 'apiKey', e.target.value)}
                      className="form-control"
                      readOnly
                    />
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      <FontAwesomeIcon icon={showApiKey ? faEyeSlash : faEye} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={generateApiKey}
                    >
                      <FontAwesomeIcon icon={faKey} />
                      Generate
                    </button>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Webhook URL</label>
                  <input
                    type="url"
                    value={settings.api.webhookUrl}
                    onChange={(e) => handleInputChange('api', 'webhookUrl', e.target.value)}
                    className="form-control"
                    placeholder="https://example.com/webhook"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.api.thirdPartyIntegrations}
                      onChange={(e) => handleInputChange('api', 'thirdPartyIntegrations', e.target.checked)}
                    />
                    Enable Third-Party Integrations
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

export default AdminSettings;
