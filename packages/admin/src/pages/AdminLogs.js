import React, { useState, useEffect } from 'react';
import { adminApiMethods } from '@dxc247/shared/utils/adminApi';
import DataTable from 'react-data-table-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faDownload, 
  faEye,
  faTrash,
  faFileAlt,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle,
  faTimesCircle,
  faCalendarAlt,
  faUser,
  faServer,
  faDatabase,
  faShieldAlt,
  faCog,
  faBug,
  faDollarSign,
  faGamepad
} from '@fortawesome/free-solid-svg-icons';


function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      // Mock data for logs
      const logsData = [
        {
          id: 1,
          timestamp: '2024-01-15T10:30:00Z',
          level: 'error',
          category: 'database',
          message: 'Database connection failed',
          details: 'Connection timeout after 30 seconds',
          userId: 'admin_001',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          requestId: 'req_123456',
          stackTrace: 'Error: Connection timeout\n    at Database.connect()\n    at Query.execute()'
        },
        {
          id: 2,
          timestamp: '2024-01-15T10:25:00Z',
          level: 'warning',
          category: 'security',
          message: 'Multiple failed login attempts',
          details: 'User admin_002 failed to login 5 times',
          userId: 'admin_002',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          requestId: 'req_123457',
          stackTrace: null
        },
        {
          id: 3,
          timestamp: '2024-01-15T10:20:00Z',
          level: 'info',
          category: 'user',
          message: 'User login successful',
          details: 'User john_doe logged in successfully',
          userId: 'john_doe',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1) AppleWebKit/605.1.15',
          requestId: 'req_123458',
          stackTrace: null
        },
        {
          id: 4,
          timestamp: '2024-01-15T10:15:00Z',
          level: 'debug',
          category: 'api',
          message: 'API request processed',
          details: 'GET /api/bets processed in 150ms',
          userId: 'system',
          ipAddress: '192.168.1.103',
          userAgent: 'PostmanRuntime/7.28.4',
          requestId: 'req_123459',
          stackTrace: null
        },
        {
          id: 5,
          timestamp: '2024-01-15T10:10:00Z',
          level: 'error',
          category: 'payment',
          message: 'Payment processing failed',
          details: 'Stripe API returned error: card_declined',
          userId: 'user_123',
          ipAddress: '192.168.1.104',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          requestId: 'req_123460',
          stackTrace: 'Error: card_declined\n    at Stripe.processPayment()\n    at PaymentController.process()'
        },
        {
          id: 6,
          timestamp: '2024-01-15T10:05:00Z',
          level: 'info',
          category: 'betting',
          message: 'Bet placed successfully',
          details: 'Bet ID 789012 placed for $100 on Cricket match',
          userId: 'user_456',
          ipAddress: '192.168.1.105',
          userAgent: 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
          requestId: 'req_123461',
          stackTrace: null
        },
        {
          id: 7,
          timestamp: '2024-01-15T10:00:00Z',
          level: 'warning',
          category: 'system',
          message: 'High memory usage detected',
          details: 'Memory usage reached 85% of available capacity',
          userId: 'system',
          ipAddress: '192.168.1.106',
          userAgent: 'System Monitor',
          requestId: 'req_123462',
          stackTrace: null
        },
        {
          id: 8,
          timestamp: '2024-01-15T09:55:00Z',
          level: 'error',
          category: 'casino',
          message: 'Game result calculation failed',
          details: 'Unable to calculate result for game round 12345',
          userId: 'system',
          ipAddress: '192.168.1.107',
          userAgent: 'Casino Engine',
          requestId: 'req_123463',
          stackTrace: 'Error: Invalid game data\n    at GameEngine.calculateResult()\n    at CasinoController.processRound()'
        }
      ];
      setLogs(logsData);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.ipAddress.includes(searchTerm);
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowLogModal(true);
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      setLogs(prev => prev.filter(log => log.id !== logId));
    }
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setLogs([]);
    }
  };

  const getLevelBadge = (level) => {
    const levelClasses = {
      error: 'level-error',
      warning: 'level-warning',
      info: 'level-info',
      debug: 'level-debug',
      success: 'level-success'
    };
    
    return (
      <span className={`level-badge ${levelClasses[level] || 'level-default'}`}>
        {level}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      database: faDatabase,
      security: faShieldAlt,
      user: faUser,
      api: faServer,
      payment: faDollarSign,
      betting: faGamepad,
      system: faCog,
      casino: faGamepad,
      error: faBug,
      default: faFileAlt
    };
    return icons[category] || icons['default'];
  };

  const getLevelIcon = (level) => {
    const icons = {
      error: faTimesCircle,
      warning: faExclamationTriangle,
      info: faInfoCircle,
      debug: faBug,
      success: faCheckCircle
    };
    return icons[level] || faInfoCircle;
  };

  const columns = [
    {
      name: 'Level',
      selector: row => row.level,
      sortable: true,
      cell: row => (
        <div className="level-cell">
          <FontAwesomeIcon icon={getLevelIcon(row.level)} className="level-icon" />
          {getLevelBadge(row.level)}
        </div>
      ),
      width: '100px'
    },
    {
      name: 'Category',
      selector: row => row.category,
      sortable: true,
      cell: row => (
        <div className="category-cell">
          <FontAwesomeIcon icon={getCategoryIcon(row.category)} className="category-icon" />
          <span className="category-text">{row.category}</span>
        </div>
      ),
      width: '120px'
    },
    {
      name: 'Message',
      selector: row => row.message,
      sortable: true,
      cell: row => (
        <div className="message-cell">
          <span className="message-text">{row.message}</span>
        </div>
      )
    },
    {
      name: 'User',
      selector: row => row.userId,
      sortable: true,
      cell: row => (
        <div className="user-cell">
          <FontAwesomeIcon icon={faUser} className="user-icon" />
          <span>{row.userId}</span>
        </div>
      ),
      width: '120px'
    },
    {
      name: 'IP Address',
      selector: row => row.ipAddress,
      sortable: true,
      cell: row => (
        <span className="ip-cell">{row.ipAddress}</span>
      ),
      width: '130px'
    },
    {
      name: 'Timestamp',
      selector: row => row.timestamp,
      sortable: true,
      cell: row => (
        <div className="timestamp-cell">
          <FontAwesomeIcon icon={faCalendarAlt} className="timestamp-icon" />
          <span>{new Date(row.timestamp).toLocaleString()}</span>
        </div>
      ),
      width: '180px'
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleViewLog(row)}
            title="View Details"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteLog(row.id)}
            title="Delete Log"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '100px'
    }
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#667eea',
        color: 'white',
        fontWeight: '600'
      }
    },
    headCells: {
      style: {
        fontSize: '0.9rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }
    },
    cells: {
      style: {
        fontSize: '0.85rem',
        padding: '12px 8px'
      }
    },
    rows: {
      style: {
        '&:nth-of-type(odd)': {
          backgroundColor: '#f8f9fa'
        },
        '&:hover': {
          backgroundColor: '#e3f2fd'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-logs-loading">
        <div className="loading-spinner"></div>
        <p>Loading logs...</p>
      </div>
    );
  }

  return (
    
      <div className="admin-logs">
      <div className="page-header">
        <div className="header-left">
          <h1>System Logs</h1>
          <p>Monitor and manage system logs and events</p>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-outline"
          >
            <FontAwesomeIcon icon={faDownload} />
            Export
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleClearLogs}
          >
            <FontAwesomeIcon icon={faTrash} />
            Clear Logs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faFileAlt} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{logs.length}</div>
            <div className="stat-title">Total Logs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faTimesCircle} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{logs.filter(l => l.level === 'error').length}</div>
            <div className="stat-title">Errors</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{logs.filter(l => l.level === 'warning').length}</div>
            <div className="stat-title">Warnings</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{logs.filter(l => l.level === 'info').length}</div>
            <div className="stat-title">Info</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Level:</label>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
            <option value="success">Success</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="database">Database</option>
            <option value="security">Security</option>
            <option value="user">User</option>
            <option value="api">API</option>
            <option value="payment">Payment</option>
            <option value="betting">Betting</option>
            <option value="system">System</option>
            <option value="casino">Casino</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <div className="table-container">
        <DataTable
          columns={columns}
          data={filteredLogs}
          customStyles={customStyles}
          pagination
          paginationPerPage={25}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          selectableRows
          onSelectedRowsChange={setSelectedRows}
          highlightOnHover
          pointerOnHover
          responsive
          noDataComponent={
            <div className="no-data">
              <FontAwesomeIcon icon={faFileAlt} className="no-data-icon" />
              <p>No logs found</p>
            </div>
          }
        />
      </div>

      {/* Log Modal */}
      {showLogModal && selectedLog && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h3>Log Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowLogModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="log-details">
                <div className="detail-row">
                  <label>Timestamp:</label>
                  <span>{new Date(selectedLog.timestamp).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <label>Level:</label>
                  {getLevelBadge(selectedLog.level)}
                </div>
                <div className="detail-row">
                  <label>Category:</label>
                  <span>{selectedLog.category}</span>
                </div>
                <div className="detail-row">
                  <label>Message:</label>
                  <span>{selectedLog.message}</span>
                </div>
                <div className="detail-row">
                  <label>Details:</label>
                  <span>{selectedLog.details}</span>
                </div>
                <div className="detail-row">
                  <label>User ID:</label>
                  <span>{selectedLog.userId}</span>
                </div>
                <div className="detail-row">
                  <label>IP Address:</label>
                  <span>{selectedLog.ipAddress}</span>
                </div>
                <div className="detail-row">
                  <label>User Agent:</label>
                  <span className="user-agent">{selectedLog.userAgent}</span>
                </div>
                <div className="detail-row">
                  <label>Request ID:</label>
                  <span>{selectedLog.requestId}</span>
                </div>
                {selectedLog.stackTrace && (
                  <div className="detail-row full-width">
                    <label>Stack Trace:</label>
                    <pre className="stack-trace">{selectedLog.stackTrace}</pre>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowLogModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    
  );
}

export default AdminLogs;
