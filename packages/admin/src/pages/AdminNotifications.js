import React, { useState, useEffect } from 'react';
import { adminApiMethods } from '@dxc247/shared/utils/adminApi';
import DataTable from 'react-data-table-component';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faDownload, 
  faEye,
  faEdit,
  faTrash,
  faPlus,
  faBell,
  faEnvelope,
  faSms,
  faCalendarAlt,
  faUser,
  faCheck,
  faTimes,
  faClock,
  faExclamationTriangle,
  faInfoCircle,
  faCog,
  faDollarSign,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';


function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showAddNotificationModal, setShowAddNotificationModal] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Mock data for notifications
      const notificationsData = [
        {
          id: 1,
          title: 'New User Registration',
          message: 'A new user has registered on the platform',
          type: 'user',
          status: 'sent',
          priority: 'medium',
          recipient: 'All Admins',
          sentAt: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-15T10:25:00Z',
          isRead: false
        },
        {
          id: 2,
          title: 'High Value Bet Placed',
          message: 'A bet of $10,000 has been placed on Cricket match',
          type: 'betting',
          status: 'sent',
          priority: 'high',
          recipient: 'Admin Team',
          sentAt: '2024-01-15T09:45:00Z',
          createdAt: '2024-01-15T09:40:00Z',
          isRead: true
        },
        {
          id: 3,
          title: 'System Maintenance',
          message: 'Scheduled maintenance will begin at 2:00 AM',
          type: 'system',
          status: 'scheduled',
          priority: 'high',
          recipient: 'All Users',
          sentAt: null,
          createdAt: '2024-01-15T08:00:00Z',
          isRead: false
        },
        {
          id: 4,
          title: 'Payment Processed',
          message: 'Withdrawal request of $5,000 has been processed',
          type: 'payment',
          status: 'sent',
          priority: 'medium',
          recipient: 'User: john_doe',
          sentAt: '2024-01-14T16:20:00Z',
          createdAt: '2024-01-14T16:15:00Z',
          isRead: true
        },
        {
          id: 5,
          title: 'Suspicious Activity',
          message: 'Multiple login attempts detected from unusual location',
          type: 'security',
          status: 'sent',
          priority: 'high',
          recipient: 'Security Team',
          sentAt: '2024-01-14T14:30:00Z',
          createdAt: '2024-01-14T14:25:00Z',
          isRead: false
        },
        {
          id: 6,
          title: 'Weekly Report',
          message: 'Weekly betting report is ready for review',
          type: 'report',
          status: 'sent',
          priority: 'low',
          recipient: 'Management',
          sentAt: '2024-01-14T09:00:00Z',
          createdAt: '2024-01-14T08:55:00Z',
          isRead: true
        },
        {
          id: 7,
          title: 'Server Error',
          message: 'Database connection error occurred',
          type: 'error',
          status: 'failed',
          priority: 'high',
          recipient: 'Technical Team',
          sentAt: null,
          createdAt: '2024-01-13T22:15:00Z',
          isRead: false
        },
        {
          id: 8,
          title: 'New Feature Release',
          message: 'Live betting feature has been released',
          type: 'announcement',
          status: 'sent',
          priority: 'medium',
          recipient: 'All Users',
          sentAt: '2024-01-13T12:00:00Z',
          createdAt: '2024-01-13T11:55:00Z',
          isRead: true
        }
      ];
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
  };

  const handleEditNotification = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
  };

  const handleDeleteNotification = (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
    }
  };

  const handleAddNotification = () => {
    setShowAddNotificationModal(true);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      sent: 'status-sent',
      scheduled: 'status-scheduled',
      failed: 'status-failed',
      pending: 'status-pending'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-default'}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityClasses = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    
    return (
      <span className={`priority-badge ${priorityClasses[priority] || 'priority-default'}`}>
        {priority}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      user: faUser,
      betting: faBell,
      system: faCog,
      payment: faDollarSign,
      security: faExclamationTriangle,
      report: faChartLine,
      error: faTimes,
      announcement: faInfoCircle
    };
    return icons[type] || faBell;
  };

  const columns = [
    {
      name: 'Type',
      selector: row => row.type,
      sortable: true,
      cell: row => (
        <div className="type-cell">
          <FontAwesomeIcon icon={getTypeIcon(row.type)} className="type-icon" />
          <span className="type-text">{row.type}</span>
        </div>
      ),
      width: '100px'
    },
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
      cell: row => (
        <div className="title-cell">
          <span className="title-text">{row.title}</span>
          {!row.isRead && <span className="unread-indicator">●</span>}
        </div>
      )
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
      name: 'Priority',
      selector: row => row.priority,
      sortable: true,
      cell: row => getPriorityBadge(row.priority),
      width: '100px'
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => getStatusBadge(row.status),
      width: '100px'
    },
    {
      name: 'Recipient',
      selector: row => row.recipient,
      sortable: true,
      cell: row => (
        <div className="recipient-cell">
          <FontAwesomeIcon icon={faUser} className="recipient-icon" />
          <span>{row.recipient}</span>
        </div>
      )
    },
    {
      name: 'Sent At',
      selector: row => row.sentAt,
      sortable: true,
      cell: row => (
        <div className="date-cell">
          <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
          <span>{row.sentAt ? new Date(row.sentAt).toLocaleDateString() : 'Not sent'}</span>
        </div>
      )
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleViewNotification(row)}
            title="View Details"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleEditNotification(row)}
            title="Edit Notification"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          {!row.isRead && (
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleMarkAsRead(row.id)}
              title="Mark as Read"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          )}
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteNotification(row.id)}
            title="Delete Notification"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '160px'
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
      <div className="admin-notifications-loading">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    
      <div className="admin-notifications">
      <div className="page-header">
        <div className="header-left">
          <h1>Notification Management</h1>
          <p>Manage and monitor all system notifications</p>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-outline"
          >
            <FontAwesomeIcon icon={faDownload} />
            Export
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleAddNotification}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Notification
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{notifications.length}</div>
            <div className="stat-title">Total Notifications</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{notifications.filter(n => n.status === 'sent').length}</div>
            <div className="stat-title">Sent</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faClock} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{notifications.filter(n => n.status === 'scheduled').length}</div>
            <div className="stat-title">Scheduled</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faTimes} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{notifications.filter(n => !n.isRead).length}</div>
            <div className="stat-title">Unread</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="user">User</option>
            <option value="betting">Betting</option>
            <option value="system">System</option>
            <option value="payment">Payment</option>
            <option value="security">Security</option>
            <option value="report">Report</option>
            <option value="error">Error</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="sent">Sent</option>
            <option value="scheduled">Scheduled</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <div className="table-container">
        <DataTable
          columns={columns}
          data={filteredNotifications}
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
              <FontAwesomeIcon icon={faBell} className="no-data-icon" />
              <p>No notifications found</p>
            </div>
          }
        />
      </div>

      {/* Notification Modal */}
      {showNotificationModal && selectedNotification && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Notification Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowNotificationModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="notification-details">
                <div className="detail-row">
                  <label>Title:</label>
                  <span>{selectedNotification.title}</span>
                </div>
                <div className="detail-row">
                  <label>Message:</label>
                  <span>{selectedNotification.message}</span>
                </div>
                <div className="detail-row">
                  <label>Type:</label>
                  <span>{selectedNotification.type}</span>
                </div>
                <div className="detail-row">
                  <label>Priority:</label>
                  {getPriorityBadge(selectedNotification.priority)}
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  {getStatusBadge(selectedNotification.status)}
                </div>
                <div className="detail-row">
                  <label>Recipient:</label>
                  <span>{selectedNotification.recipient}</span>
                </div>
                <div className="detail-row">
                  <label>Sent At:</label>
                  <span>{selectedNotification.sentAt ? new Date(selectedNotification.sentAt).toLocaleString() : 'Not sent'}</span>
                </div>
                <div className="detail-row">
                  <label>Created:</label>
                  <span>{new Date(selectedNotification.createdAt).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <label>Read Status:</label>
                  <span className={selectedNotification.isRead ? 'read' : 'unread'}>
                    {selectedNotification.isRead ? 'Read' : 'Unread'}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowNotificationModal(false)}
              >
                Close
              </button>
              <button className="btn btn-primary">
                Edit Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Notification Modal */}
      {showAddNotificationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Notification</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddNotificationModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="add-notification-form">
                <div className="form-group">
                  <label>Title:</label>
                  <input type="text" className="form-control" placeholder="Enter notification title" />
                </div>
                <div className="form-group">
                  <label>Message:</label>
                  <textarea className="form-control" rows="3" placeholder="Enter notification message"></textarea>
                </div>
                <div className="form-group">
                  <label>Type:</label>
                  <select className="form-control">
                    <option value="user">User</option>
                    <option value="betting">Betting</option>
                    <option value="system">System</option>
                    <option value="payment">Payment</option>
                    <option value="security">Security</option>
                    <option value="report">Report</option>
                    <option value="error">Error</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority:</label>
                  <select className="form-control">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Recipient:</label>
                  <input type="text" className="form-control" placeholder="Enter recipient" />
                </div>
                <div className="form-group">
                  <label>Send Immediately:</label>
                  <input type="checkbox" className="form-checkbox" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowAddNotificationModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Add Notification
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    
  );
}

export default AdminNotifications;
