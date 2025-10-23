import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Pagination from "@dxc247/shared/components/common/Pagination";
import { Link } from "react-router-dom";

const LineMarketBetHistory = () => {
  const [loading, setLoading] = useState(false);
  const [betData, setBetData] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [betSide, setBetSide] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const loadUserDropdown = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const response = await adminApi(`${ADMIN_BASE_PATH}/match-pl-dropdowns`, "GET");
      if (response.success) {
        setUserOptions(response.clients || []);
        setFilteredUsers(response.clients || []);
      } else {
        console.error("Failed to load users:", response.message);
        setUserOptions([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUserOptions([]);
      setFilteredUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const filterUsers = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(userOptions);
    } else {
      const filtered = userOptions.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [userOptions]);

  const handleUserSearchChange = (e) => {
    const searchTerm = e.target.value;
    setUserSearchTerm(searchTerm);
    filterUsers(searchTerm);
    setShowUserDropdown(true);
  };

  const handleUserSelect = (user) => {
    setSelectedUserId(user.id);
    setUserSearchTerm(user.username);
    setShowUserDropdown(false);
  };

  const handleUserInputFocus = () => {
    setShowUserDropdown(true);
    if (!userSearchTerm.trim()) setFilteredUsers(userOptions);
    else filterUsers(userSearchTerm);
  };

  const handleUserInputBlur = () => {
    setTimeout(() => setShowUserDropdown(false), 200);
  };

  const clearUserSearch = () => {
    setUserSearchTerm("");
    setSelectedUserId("");
    setFilteredUsers(userOptions);
    setShowUserDropdown(false);
  };

  const loadLineMarketBetHistoryData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        from_date: fromDate,
        to_date: toDate,
        bet_side: betSide,
        select_user_id: selectedUserId,
        ip: ipAddress,
        active: 1,
        page: page,
        per_page: entriesPerPage,
      };
      const response = await adminApi(`${ADMIN_BASE_PATH}/admin-line-market-bet-history`, "POST", params);
      if (response.success) {
        setBetData(response.data || []);
        setCurrentPage(response.pagination?.current_page || 1);
        setTotalPages(response.pagination?.total_pages || 1);
        setTotalRecords(response.pagination?.total_records || 0);
      } else {
        setBetData([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setBetData([]);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, betSide, selectedUserId, ipAddress, entriesPerPage]);

  useEffect(() => { loadUserDropdown(); }, []);
  useEffect(() => { loadLineMarketBetHistoryData(1); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadLineMarketBetHistoryData(1);
  };

  const handleReset = () => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    setFromDate(date.toISOString().split('T')[0]);
    setToDate(new Date().toISOString().split('T')[0]);
    setBetSide("");
    setIpAddress("");
    clearUserSearch();
    setBetData([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalRecords(0);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    loadLineMarketBetHistoryData(page);
  };

  const handleEntriesPerPageChange = (e) => {
    const newEntriesPerPage = parseInt(e.target.value);
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1);
    // Auto-reload with new entries per page
    loadLineMarketBetHistoryData(1);
  };

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">
              Line Market Bet History
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row form-horizontal" style={{ marginBottom: "25px" }}>
              {/* From Date */}
              <div className="col-md-2">
                <label>From Date</label>
                <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>

              {/* To Date */}
              <div className="col-md-2">
                <label>To Date</label>
                <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>

              {/* Bet Side */}
              <div className="col-md-2">
                <label>Bet Side</label>
                <select className="form-control" value={betSide} onChange={(e) => setBetSide(e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="Back">Back</option>
                  <option value="Lay">Lay</option>
                </select>
              </div>

              {/* User Search */}
              <div className="col-md-2">
                <label>User</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search user..."
                    value={userSearchTerm}
                    onChange={handleUserSearchChange}
                    onFocus={handleUserInputFocus}
                    onBlur={handleUserInputBlur}
                    disabled={loadingUsers}
                    style={{ paddingRight: userSearchTerm ? '60px' : '30px' }}
                  />
                  {loadingUsers && (
                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#6c757d' }}>
                      <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                    </div>
                  )}
                  {!loadingUsers && userSearchTerm && (
                    <button type="button" onClick={clearUserSearch} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}>×</button>
                  )}

                  {showUserDropdown && filteredUsers.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ddd', maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                      {filteredUsers.map((user) => (
                        <div key={user.id} onClick={() => handleUserSelect(user)} style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
                          {user.username}
                        </div>
                      ))}
                    </div>
                  )}
                  {showUserDropdown && filteredUsers.length === 0 && userSearchTerm && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #ddd', padding: '8px 12px', color: '#6c757d', fontSize: '14px', zIndex: 1000 }}>
                      No users found
                    </div>
                  )}
                </div>
              </div>

              {/* IP */}
              <div className="col-md-2">
                <label>IP</label>
                <input className="form-control" type="text" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} placeholder="IP" />
              </div>

              {/* Submit Button */}
              <div className="col-md-2" style={{ marginTop: "25px" }}>
                <button className="btn btn-success" type="submit" style={{ width: "100%" }} disabled={loading}>
                  {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> : "Submit"}
                </button>
              </div>
            </div>
          </form>

          {/* Table */}
          <div className="display-balance-summary">
            <div className="table-responsive tableFixHead">
              <table className="table table-bordered data-table table-striped">
                <thead>
                  <tr>
                    <th>Parent</th>
                    <th>Username</th>
                    <th>Event Type</th>
                    <th>Event Name</th>
                    <th>Runner Name</th>
                    <th>Bet Type</th>
                    <th>User Rate</th>
                    <th>Amount</th>
                    <th>Place Date</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="text-center">
                        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                      </td>
                    </tr>
                  ) : betData.length > 0 ? (
                    betData.map((bet, index) => (
                      <tr key={bet.id || index}>
                        <td>{bet.parent_username}</td>
                        <td>{bet.username}</td>
                        <td>{bet.game_name}</td>
                        <td>
                          <Link to={`/sports/${bet.game_name?.toLowerCase()}/${bet.match_id}`}>
                            {bet.sport_name}
                          </Link>
                        </td>
                        <td>{bet.bet_type}</td>
                        <td>{bet.bet_side}</td>
                        <td>{bet.bet_odds}</td>
                        <td>{bet.amount}</td>
                        <td>{new Date(bet.created_at).toLocaleString()}</td>
                        <td>{bet.ip_address}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalRecords > 0 && (
            <div className="d-flex justify-content-between align-items-center border-top pt-3">
              <div className="dataTables_info">
                Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
              </div>
              
              <div className="d-flex align-items-center gap-3">
             
                
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  maxVisiblePages={5}
                  showPreviousNext={true}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LineMarketBetHistory;
