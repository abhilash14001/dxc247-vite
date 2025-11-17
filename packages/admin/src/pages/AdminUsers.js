import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Pagination from "@dxc247/shared/components/common/Pagination";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import UserActionModal from "./UserActionModal";
import AddChipsModal from "./AddChipsModal";
import ConfirmModal from "@dxc247/shared/components/ui/ConfirmModal";
import { useConfirmModal } from "@dxc247/shared/components/ui/useConfirmModal";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function AdminUsers() {
  const { modal: confirmModal, showConfirm, hideModal } = useConfirmModal();
  const { liveModeData } = useSelector(state => state.commonData);
  const { user: adminUser } = useSelector(state => state.admin);
  const isSuperAdmin = adminUser?.role === 1;
  const [showBalanceBar, setShowBalanceBar] = useState(false);
  const [activeTab, setActiveTab] = useState("active_users");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0
  });
  const [userInfo, setUserInfo] = useState({
    role: 0,
    username: '',
    user_id: null,
    back_uuid: '',
    roles: []
  });
  const [balanceData, setBalanceData] = useState({
    upper_level_credit_reference: 0,
    down_level_occupy_balance: 0,
    down_level_credit_reference: "0.00",
    total_master_balance: "0.00",
    upper_level: 0,
    down_level_profit_loss: 0,
    available_balance: 0,
    available_balance_with_profit_loss: 0,
    my_profit_loss: 0
  });
  const [currentUuid, setCurrentUuid] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    user: null,
    data: {}
  });
  
  // Add Chips Modal State
  const [showAddChipsModal, setShowAddChipsModal] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Modal functions
  const openModal = (type, user, data = {}) => {
    setModal({
      isOpen: true,
      type,
      user,
      data
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: null,
      user: null,
      data: {}
    });
  };

  // Add Chips Modal functions
  const openAddChipsModal = () => {
    setShowAddChipsModal(true);
  };

  const closeAddChipsModal = () => {
    setShowAddChipsModal(false);
  };

  const handleAddChipsSubmit = async (data) => {
    try {
      setLoading(true);
      setBalanceLoading(true);
      
      const response = await adminApi(`${ADMIN_BASE_PATH}/update-admin-amount`, 'POST', {
        amount: parseFloat(data.amount),
        credit_reference: parseFloat(data.creditReference)
      }, true);
      
      if (response.success) {
        toast.success('Chips added successfully!');
        // Refresh user data and balance after successful submission
        const active = activeTab === "active_users" ? 1 : 0;
        await fetchUsers(currentPage, searchTerm, active, itemsPerPage, currentUuid);
        closeAddChipsModal();
      } else {
        toast.error(response.message || 'Failed to add chips');
      }
    } catch (error) {
      console.error('Error adding chips:', error);
      toast.error('Failed to add chips. Please try again.');
    } finally {
      setLoading(false);
      setBalanceLoading(false);
    }
  };

  const handleModalSuccess = async () => {
    // Refresh the users list after successful action
    const active = activeTab === "active_users" ? 1 : 0;
    await fetchUsers(currentPage, searchTerm, active, itemsPerPage, currentUuid);
  };

  // Fetch users data from API
  const fetchUsers = useCallback(async (page = 1, search = '', active = 1, perPage = 15, uuid = null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        search: search,
        active: active.toString()
      });

      // Add UUID to the URL if provided
      const url = uuid ? `${ADMIN_BASE_PATH}/client/list/${uuid}?${params}` : `${ADMIN_BASE_PATH}/client/list?${params}`;
      const response = await adminApi(url, 'GET');
      if (response.users) {
        setUsers(response.users);
        setPagination(response.pagination);
        setUserInfo(response.user_info);
        setCurrentUuid(uuid); // Set the current UUID being viewed
        if (response.balance_data) {
          setBalanceData(response.balance_data);
        }
      } else {
        console.error('Failed to fetch users:', response.message);
        setUsers([]);
        toast.error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      toast.error('Error fetching users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search with debounce and other filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const active = activeTab === "active_users" ? 1 : 0;
      fetchUsers(currentPage, searchTerm, active, itemsPerPage);
    }, searchTerm ? 500 : 0); // No delay for non-search changes

    return () => clearTimeout(timeoutId);
  }, [fetchUsers, currentPage, searchTerm, activeTab, itemsPerPage]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Action handlers
  const handleChangePassword = (userId) => {
    const user = users.find(u => u.id === userId);
    openModal('changePassword', user, {});
  };

  const handleDeposit = (userId, username, balance, parentName, parentAmount) => {
    const user = users.find(u => u.id === userId);
    openModal('freeChipsIn', user, { 
      currentBalance: balance, 
      parentName, 
      parentBalance: parentAmount 
    });
  };

  const handleWithdraw = (userId, username, balance, parentName, parentAmount) => {
    const user = users.find(u => u.id === userId);
    openModal('freeChipsOut', user, { 
      currentBalance: balance, 
      parentName, 
      parentBalance: parentAmount 
    });
  };

  const handleExposureLimit = (userId, exposureLimit) => {
    const user = users.find(u => u.id === userId);
    openModal('exposureLimit', user, { currentLimit: exposureLimit });
  };

  const handleUserStatus = (userId, username, userStatus, betStatus) => {
    const user = users.find(u => u.id === userId);
    openModal('toggleStatus', user, { 
      currentStatus: userStatus, 
      currentBetStatus: betStatus 
    });
  };

  // Toggle user status (active or bet_status)
  const toggleUserStatus = async (userId, field, currentValue) => {
    try {
      const newValue = !currentValue;
      
      const response = await adminApi(`${ADMIN_BASE_PATH}/user/toggle-status`, 'POST', {
        user_id: userId,
        field: field,
        value: newValue
      }, true);

      if (response.success) {
        // Update the user in the local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, [field]: newValue ? 1 : 0 }
              : user
          )
        );
        
        // Show success toast notification
        toast.success(response.message);
      } else {
        console.error('Failed to toggle user status:', response.message);
        // Show error toast notification
        toast.error(response.message || 'Failed to toggle user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      // Show error toast notification
      toast.error('Error toggling user status. Please try again.');
    }
  };

  const handleCreditReference = (userId, username, oldCreditReference) => {
    const user = users.find(u => u.id === userId);
    openModal('creditReference', user, { currentValue: oldCreditReference });
  };

  const handleLogoutSingleUser = async (userId) => {
    const confirmed = await showConfirm({
      title: "Logout User",
      message: "Are you sure you want to logout this user?",
      confirmText: "Yes, Logout",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: async () => {
        try {
          const response = await adminApi(`${ADMIN_BASE_PATH}/user/logout`, 'POST', {
            user_id: userId
          }, true);

          if (response.success) {
            toast.success(response.message);
            await handleModalSuccess();
          } else {
            toast.error(response.message || 'Failed to logout user');
          }
        } catch (error) {
          console.error('Error logging out user:', error);
          toast.error('Error logging out user. Please try again.');
        }
      }
    });
  };

  const handleDeleteUser = async (userId) => {
    // Check if user deletion is disabled (superadmin can always delete)
    if (!isSuperAdmin && liveModeData?.is_user_delete_disable === 1) {
      toast.error('User deletion is currently disabled by administrator.');
      return;
    }

    await showConfirm({
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          const response = await adminApi(`${ADMIN_BASE_PATH}/user/delete`, 'POST', {
            user_id: userId
          }, true);

          if (response.success) {
            toast.success(response.message);
            await handleModalSuccess();
          } else {
            toast.error(response.message || 'Failed to delete user');
          }
        } catch (error) {
          console.error('Error deleting user:', error);
          toast.error('Error deleting user. Please try again.');
        }
      }
    });
  };


  const handleViewUser = async (userId, uuid, username) => {
    if (uuid) {
      // Reset pagination and search when viewing sub-accounts
      setCurrentPage(1);
      setSearchTerm('');
      
      // Fetch sub-accounts for this user
      const active = activeTab === "active_users" ? 1 : 0;
      await fetchUsers(1, '', active, itemsPerPage, uuid);
      
    } else {
      toast.error('User UUID not found');
    }
  };

  const handleBack = async () => {
    if (userInfo.back_uuid) {
      // Reset pagination and search when going back
      setCurrentPage(1);
      setSearchTerm('');
      
      // Fetch parent user's sub-accounts
      const active = activeTab === "active_users" ? 1 : 0;
      await fetchUsers(1, '', active, itemsPerPage, userInfo.back_uuid);
      
      
    } else {
      // Go back to root level
      setCurrentPage(1);
      setSearchTerm('');
      
      const active = activeTab === "active_users" ? 1 : 0;
      await fetchUsers(1, '', active, itemsPerPage, null);
      
      
    }
  };


  return (
    <React.Fragment>
        <div className="row">
          <div className="master-balance">
            <div className="text-center">
              <span
                className={`far ${
                  !showBalanceBar
                    ? "fa-arrow-alt-circle-down hide-down"
                    : "fa-arrow-alt-circle-up hide-up"
                }`}
                id="user-balance1"
                onClick={() => setShowBalanceBar(!showBalanceBar)}
                style={{ cursor: "pointer", display: "inline" }}
              ></span>
            </div>
            <div
              className={`master-balance-detail m-t-20 ${
                showBalanceBar ? "" : "d-none"
              }`}
              id="master-balance-detail"
              style={{ display: showBalanceBar ? "block" : "none" }}
            >
              <ul className="row">
                <li className="col-md-12">
                  <label className="col-md-8 text-left">
                    <a
                      className="btn btn-success"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        openAddChipsModal();
                      }}
                    >
                      Add Chips
                    </a>
                  </label>
                </li>

                <li className="col-md-4">
                  <label className="col-md-8 text-left">
                    Upper Level Credit Reference :{" "}
                  </label>
                <span className="text-right col-md-4">
                  {balanceLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    balanceData.upper_level_credit_reference.toLocaleString()
                  )}
                </span>
                </li>
                <li className="col-md-4">
                  <label className="col-md-8 text-left">
                    Down level Occupy Balance :{" "}
                  </label>
                <span className="text-right col-md-4">{balanceData.down_level_occupy_balance.toLocaleString()}</span>
                </li>
                <li className="col-md-4">
                  <label className="col-md-8 text-left">
                    Down Level Credit Reference :{" "}
                  </label>
                <span className="text-right col-md-4">
                  {balanceLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    parseFloat(balanceData.down_level_credit_reference).toLocaleString()
                  )}
                </span>
                </li>

                <li className="col-md-4">
                  <label className="col-md-8 text-left">
                    Total Master Balance :{" "}
                  </label>
                <span className="text-right col-md-4">{parseFloat(balanceData.total_master_balance).toLocaleString()}</span>
                </li>
                <li className="col-md-4">
                  <label className="col-md-8 text-left">Upper Level : </label>
                <span className="text-right col-md-4">{balanceData.upper_level.toLocaleString()}</span>
                </li>
                <li className="col-md-4">
                  <label className="col-md-8 text-left">
                    Down Level Profit/Loss :{" "}
                  </label>
                <span className="text-right col-md-4">{balanceData.down_level_profit_loss.toLocaleString()}</span>
                </li>

                <li className="col-md-4">
                  <label className="col-md-8 text-left">
                    Available Balance :{" "}
                  </label>
                <span className="text-right col-md-4">
                  {balanceLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    balanceData.available_balance.toLocaleString()
                  )}
                </span>
                </li>
                <li className="col-md-4">
                  <label className="col-md-8 text-left">
                    Available Balance With Profit/Loss :{" "}
                  </label>
                <span className="text-right col-md-4">{balanceData.available_balance_with_profit_loss.toLocaleString()}</span>
                </li>
                <li className="col-md-4">
                  <label className="col-md-8 text-left">
                    My Profit/Loss :{" "}
                  </label>
                <span className="text-right col-md-4">{balanceData.my_profit_loss.toLocaleString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 main-container">
            <div className="listing-grid">
              <div className="detail-row">
                <h2 className="d-inline-block">Account List</h2>
                <div className="float-right m-b-10">
                  <p className="text-right">
                  {userInfo.back_uuid || currentUuid ? (
                    <button
                      onClick={handleBack}
                      className="btn btn-diamond mr-2"
                    >
                      Back
                    </button>
                  ) : (
                    <Link to={`/client/create`}
                      
                      className="btn btn-diamond mr-2"
                    >
                      Add Account
                    </Link>
                  )}
                  <Link to={`/client/deleted`}
                    
                      className="btn btn-diamond"
                    >
                      Delete User
                  </Link>
                  </p>
        </div>
      </div>
              <div className="clearfix"></div>

              <div className="table-responsive data-table">
          <input
            type="text"
                style={{ width: "10%", float: "right" }} 
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    id="searchClient"
                    className="form-control"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <a
                    className={`nav-link ${activeTab === "active_users" ? "active" : ""}`}
                      data-toggle="tab"
                    
                    onClick={() => handleTabChange("active_users")}
                      style={{ cursor: "pointer" }}
                    >
                      Active Users
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                    className={`nav-link ${activeTab === "deactive_users" ? "active" : ""}`}
                      data-toggle="tab"
                    
                    onClick={() => handleTabChange("deactive_users")}
                      style={{ cursor: "pointer" }}
                    >
                      Deactive Users
                    </a>
                  </li>
                </ul>

                <div className="tab-content">
                  <div
                  className={`tab-pane ${activeTab === "active_users" ? "active" : ""}`}
                    id="active_users"
                  >
                    <div className="table-responsive">
                      <table
                        id="clientActiveListTable"
                        className="table table-bordered clientListTable"
                      >
          <thead>
            <tr>
                            <th>User Name</th>
                            <th>Credit Reference</th>
                            <th>Total Balance</th>
                            <th>Client(P/L)</th>
                            <th>Exposure</th>
                            <th>Available Balance</th>
                            <th>U St</th>
                            <th>B St</th>
                            <th>Exposure Limit</th>
                            <th>Partnership (%)</th>
                            <th>Account Type</th>
                            <th className="noExport text-center">Action</th>
            </tr>
          </thead>
          <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="12" className="text-center">
                              <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                            </td>
                          </tr>
                        ) : users.length > 0 ? (
                          users.map((user) => (
              <tr key={user.id}>
                <td>
                                <a 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleViewUser(user.id, user.uuid, user.username);
                                  }}
                                >
                                  {user.username}
                                </a>
                              </td>
                              <td>{user.credit_reference ? parseFloat(user.credit_reference).toLocaleString() : '0'}</td>
                              <td>{user.totalBalance ? parseFloat(user.totalBalance).toLocaleString() : '0'}</td>
                              <td>{user.p_l ? parseFloat(user.p_l).toLocaleString() : '0'}</td>
                              <td>{user.exposure ? parseFloat(user.exposure).toLocaleString() : '0'}</td>
                              <td>{user.balance ? parseFloat(user.balance).toLocaleString() : '0'}</td>
                              <td className="ustatus">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={user.active === 1}
                                    onChange={() => toggleUserStatus(user.id, 'active', user.active === 1)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </td>
                              <td className="ustatus">
                                <label className="form-check-label">
                  <input
                                    className="form-check-input"
                    type="checkbox"
                                    checked={user.bet_status === 1}
                                    onChange={() => toggleUserStatus(user.id, 'bet_status', user.bet_status === 1)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </td>
                              <td>{user?.exposure_limit || 0}</td>
                              <td>{user?.partnership ? parseFloat(user.partnership).toLocaleString() : '0'}%</td>
                              <td>{user.type}</td>
                              <td className="actions text-center">
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCreditReference(user.id, user.username, user.credit_reference);
                                  }}
                                  title="Credit Reference"
                                >
                                  <span>C</span>
                                </a>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeposit(user.id, user.username, user.balance, userInfo.username, balanceData.available_balance_with_profit_loss);
                                  }}
                                  title="Deposit"
                                >
                                  <span>D</span>
                                </a>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleWithdraw(user.id, user.username, user.balance, userInfo.username, balanceData.available_balance_with_profit_loss);
                                  }}
                                  title="Withdraw"
                                >
                                  <span>W</span>
                                </a>
                                <a 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleExposureLimit(user.id, user.exposure_limit || 0);
                                  }}
                                  title="Exposure Limit"
                                >
                                  <span>L</span>
                                </a>
                                <a 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleChangePassword(user.id);
                                  }}
                                  title="Change Password"
                                >
                                  <span>P</span>
                                </a>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleUserStatus(user.id, user.username, user.active === 1, user.active === 1);
                                  }}
                                  title="User Status"
                                >
                                  <span>S</span>
                                </a>
                                <Link 
                                  to={`/client/edit/${user.id}`}
                                  title="Edit User"
                                  className="text-decoration-none"
                                >
                                  <i className="fa fa-edit"></i>
                                </Link>
                                <a
                                  href="#"
                                  title="Single User Logout"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleLogoutSingleUser(user.id);
                                  }}
                                >
                                  <i className="fas fa-sign-out-alt"></i>
                                </a>
                                {(isSuperAdmin || liveModeData?.is_user_delete_disable !== 1) && (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeleteUser(user.id);
                                    }}
                                    title="Delete User"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                            <tr>
                              <td colSpan="12" className="text-center">
                              No records to show in the given table
                </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                  {!loading && users.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <div className="dataTables_info">
                        Showing {pagination.from} to {pagination.to} of {pagination.total} entries
                      </div>
                      <Pagination
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        onPageChange={handlePageChange}
                        maxVisiblePages={5}
                        showPreviousNext={true}
                      />
                    </div>
                  )}
                  </div>

                  <div
                  className={`tab-pane ${activeTab === "deactive_users" ? "active" : ""}`}
                    id="deactive_users"
                  >
                    <div className="table-responsive">
                      <table
                        id="clientDeActiveListTable"
                        className="table table-bordered clientListTable"
                      >
                        <thead>
                          <tr>
                            <th>User Name</th>
                            <th>Credit Reference</th>
                            <th>Total Balance</th>
                            <th>Client(P/L)</th>
                            <th>Exposure</th>
                            <th>Available Balance</th>
                            <th>U St</th>
                            <th>B St</th>
                            <th>Exposure Limit</th>
                            <th>Partnership (%)</th>
                            <th>Account Type</th>
                            <th className="noExport text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="12" className="text-center">
                              <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                            </td>
                          </tr>
                        ) : users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <a 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleViewUser(user.id, user.uuid, user.username);
                                  }}
                                >
                                  {user.username}
                                </a>
                              </td>
                              <td>{user.credit_reference ? parseFloat(user.credit_reference).toLocaleString() : '0'}</td>
                              <td>{user.totalBalance ? parseFloat(user.totalBalance).toLocaleString() : '0'}</td>
                              <td>{user.profit_loss ? parseFloat(user.profit_loss).toLocaleString() : '0'}</td>
                              <td>0</td>
                              <td>{user.balance ? parseFloat(user.balance).toLocaleString() : '0'}</td>
                              <td className="ustatus">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={user.active === 1}
                                    onChange={() => toggleUserStatus(user.id, 'active', user.active === 1)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </td>
                              <td className="ustatus">
                                <label className="form-check-label">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={user.bet_status === 1}
                                    onChange={() => toggleUserStatus(user.id, 'bet_status', user.bet_status === 1)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </td>
                              <td>0</td>
                              <td>90%</td>
                              <td>{user.role === 1 ? 'ADMIN' : 'USER'}</td>
                              <td className="actions text-center">
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCreditReference(user.id, user.username, user.credit_reference);
                                  }}
                                  title="Credit Reference"
                                >
                                  <span>C</span>
                                </a>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeposit(user.id, user.username, user.balance, userInfo.username, balanceData.available_balance_with_profit_loss);
                                  }}
                                  title="Deposit"
                                >
                                  <span>D</span>
                                </a>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleWithdraw(user.id, user.username, user.balance, userInfo.username, balanceData.available_balance_with_profit_loss);
                                  }}
                                  title="Withdraw"
                                >
                                  <span>W</span>
                                </a>
                                <a 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleExposureLimit(user.id, user.exposure_limit || 0);
                                  }}
                                  title="Exposure Limit"
                                >
                                  <span>L</span>
                                </a>
                                <a 
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleChangePassword(user.id);
                                  }}
                                  title="Change Password"
                                >
                                  <span>P</span>
                                </a>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleUserStatus(user.id, user.username, user.active === 1, user.active === 1);
                                  }}
                                  title="User Status"
                                >
                                  <span>S</span>
                                </a>
                                <Link 
                                  to={`/client/edit/${user.id}`}
                                  title="Edit User"
                                  className="text-decoration-none"
                                >
                                  <i className="fa fa-edit"></i>
                                </Link>
                                <a
                                  href="#"
                                  title="Single User Logout"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleLogoutSingleUser(user.id);
                                  }}
                                >
                                  <i className="fas fa-sign-out-alt"></i>
                                </a>
                                {(isSuperAdmin || liveModeData?.is_user_delete_disable !== 1) && (
                                  <a
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleDeleteUser(user.id);
                                    }}
                                    title="Delete User"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </a>
                                )}
                </td>
              </tr>
                          ))
                        ) : (
                            <tr>
                            <td colSpan="12" className="text-center">
                                NO records to show in the given table
                              </td>
                            </tr>
                          )}
          </tbody>
        </table>
      </div>

                  {!loading && users.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <div className="dataTables_info">
                        Showing {pagination.from} to {pagination.to} of {pagination.total} entries
        </div>
                      <Pagination
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        onPageChange={handlePageChange}
                        maxVisiblePages={5}
                        showPreviousNext={true}
                      />
        </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* User Action Modal */}
      <UserActionModal 
        modal={modal}
        onClose={closeModal}
        onSuccess={handleModalSuccess}
      />
      
      {/* Add Chips Modal */}
      <AddChipsModal
        isOpen={showAddChipsModal}
        onClose={closeAddChipsModal}
        onSubmit={handleAddChipsSubmit}
        userId={userInfo.user_id}
      />
      
      {/* Confirm Modal */}
      <ConfirmModal
        show={confirmModal.show}
        onHide={hideModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
      />
      
      {/* Modal Backdrop */}
      {(modal.isOpen || showAddChipsModal) && <div className="modal-backdrop fade show"></div>}
      </React.Fragment>
  );
}

export default AdminUsers;