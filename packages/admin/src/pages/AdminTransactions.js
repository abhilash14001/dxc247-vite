import React, { useState, useEffect } from 'react';
import { adminApiMethods } from '@dxc247/shared/utils/adminApi';
import DataTable from 'react-data-table-component';
import AdminLayout from '../layouts/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faDownload, 
  faEye,
  faCheck,
  faTimes,
  faDollarSign,
  faCreditCard,
  faWallet,
  faExchangeAlt,
  faCalendarAlt,
  faUser,
  faGamepad
} from '@fortawesome/free-solid-svg-icons';


function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await adminApiMethods.getTransactions();
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    const icons = {
      deposit: faCreditCard,
      withdrawal: faWallet,
      bet: faGamepad,
      win: faCheck,
      refund: faExchangeAlt,
      bonus: faDollarSign,
      commission: faDollarSign
    };
    return icons[type] || faDollarSign;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'status-completed',
      pending: 'status-pending',
      failed: 'status-failed',
      cancelled: 'status-cancelled',
      processing: 'status-processing'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-default'}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeClasses = {
      deposit: 'type-deposit',
      withdrawal: 'type-withdrawal',
      bet: 'type-bet',
      win: 'type-win',
      refund: 'type-refund',
      bonus: 'type-bonus',
      commission: 'type-commission'
    };
    
    return (
      <span className={`type-badge ${typeClasses[type] || 'type-default'}`}>
        {type}
      </span>
    );
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toString().includes(searchTerm) ||
                         transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    // Date filtering
    const transactionDate = new Date(transaction.created_at);
    const now = new Date();
    let matchesDate = true;
    
    if (dateFilter === 'today') {
      matchesDate = transactionDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = transactionDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = transactionDate >= monthAgo;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleApproveTransaction = (transactionId) => {
    if (window.confirm('Are you sure you want to approve this transaction?')) {
      console.log('Approving transaction:', transactionId);
    }
  };

  const handleRejectTransaction = (transactionId) => {
    if (window.confirm('Are you sure you want to reject this transaction?')) {
      console.log('Rejecting transaction:', transactionId);
    }
  };

  const handleExport = () => {
    console.log('Exporting transactions...');
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      width: '80px'
    },
    {
      name: 'User',
      selector: row => row.username,
      sortable: true,
      cell: row => (
        <div className="user-cell">
          <FontAwesomeIcon icon={faUser} className="user-icon" />
          <span>{row.username}</span>
        </div>
      )
    },
    {
      name: 'Type',
      selector: row => row.type,
      sortable: true,
      cell: row => getTypeBadge(row.type)
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
      cell: row => (
        <div className="description-cell">
          <span className="description-text">{row.description}</span>
        </div>
      )
    },
    {
      name: 'Amount',
      selector: row => row.amount,
      sortable: true,
      cell: row => (
        <div className={`amount-cell ${row.amount >= 0 ? 'positive' : 'negative'}`}>
          <FontAwesomeIcon icon={getTransactionIcon(row.type)} className="amount-icon" />
          <span>${Math.abs(row.amount).toLocaleString()}</span>
        </div>
      )
    },
    {
      name: 'Balance',
      selector: row => row.balance_after,
      sortable: true,
      cell: row => (
        <div className="balance-cell">
          <FontAwesomeIcon icon={faWallet} className="balance-icon" />
          <span>${row.balance_after?.toLocaleString() || '0'}</span>
        </div>
      )
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => getStatusBadge(row.status)
    },
    {
      name: 'Date',
      selector: row => row.created_at,
      sortable: true,
      cell: row => (
        <div className="date-cell">
          <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
          <span>{new Date(row.created_at).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleViewTransaction(row)}
            title="View Details"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleApproveTransaction(row.id)}
                title="Approve"
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRejectTransaction(row.id)}
                title="Reject"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px'
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
      <div className="admin-transactions-loading">
        <div className="loading-spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-transactions">
      <div className="page-header">
        <div className="header-left">
          <h1>Transaction Management</h1>
          <p>Monitor and manage all financial transactions</p>
        </div>
        <div className="header-right">
          <button 
            className="btn btn-outline"
            onClick={handleExport}
          >
            <FontAwesomeIcon icon={faDownload} />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
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
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="bet">Bet</option>
            <option value="win">Win</option>
            <option value="refund">Refund</option>
            <option value="bonus">Bonus</option>
            <option value="commission">Commission</option>
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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="processing">Processing</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* DataTable */}
      <div className="table-container">
        <DataTable
          columns={columns}
          data={filteredTransactions}
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
              <FontAwesomeIcon icon={faDollarSign} className="no-data-icon" />
              <p>No transactions found</p>
            </div>
          }
        />
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Transaction Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowTransactionModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="transaction-details">
                <div className="detail-row">
                  <label>Transaction ID:</label>
                  <span>{selectedTransaction.id}</span>
                </div>
                <div className="detail-row">
                  <label>User:</label>
                  <span>{selectedTransaction.username}</span>
                </div>
                <div className="detail-row">
                  <label>Type:</label>
                  {getTypeBadge(selectedTransaction.type)}
                </div>
                <div className="detail-row">
                  <label>Description:</label>
                  <span>{selectedTransaction.description}</span>
                </div>
                <div className="detail-row">
                  <label>Amount:</label>
                  <span className={selectedTransaction.amount >= 0 ? 'positive' : 'negative'}>
                    ${Math.abs(selectedTransaction.amount).toLocaleString()}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Balance After:</label>
                  <span>${selectedTransaction.balance_after?.toLocaleString() || '0'}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div className="detail-row">
                  <label>Date:</label>
                  <span>{new Date(selectedTransaction.created_at).toLocaleString()}</span>
                </div>
                {selectedTransaction.notes && (
                  <div className="detail-row">
                    <label>Notes:</label>
                    <span>{selectedTransaction.notes}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowTransactionModal(false)}
              >
                Close
              </button>
              {selectedTransaction.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleApproveTransaction(selectedTransaction.id)}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleRejectTransaction(selectedTransaction.id)}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  );
}

export default AdminTransactions;
