import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const DeletedBetHistory = () => {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(false);
  const [betData, setBetData] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  // Filter states
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [betSide, setBetSide] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  // User search states
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // --- LOAD USER DROPDOWN ---
  const loadUserDropdown = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const response = await adminApi(
        `${ADMIN_BASE_PATH}/match-pl-dropdowns`,
        "GET"
      );

      if (response && response.clients) {
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

  // --- FILTER USERS ---
  const filterUsers = useCallback(
    (searchTerm) => {
      if (!searchTerm.trim()) {
        setFilteredUsers(userOptions);
      } else {
        const filtered = userOptions.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    },
    [userOptions]
  );

  // --- HANDLE USER INPUT ---
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
    filterUsers(userSearchTerm);
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

  // --- LOAD BET HISTORY ---
  const loadDeletedBetHistoryData = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          from_date: fromDate,
          to_date: toDate,
          bet_side: betSide,
          select_user_id: selectedUserId,
          ip: ipAddress,
          active: 0,
          page,
          per_page: entriesPerPage,
        };

        const response = await adminApi(
          `${ADMIN_BASE_PATH}/admin-delete-bet-history`,
          "POST",
          params
        );

        if (response) {
          setBetData(response || []);
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
        console.error("Error loading deleted bet history data:", error);
        setBetData([]);
      } finally {
        setLoading(false);
      }
    },
    [fromDate, toDate, betSide, selectedUserId, ipAddress, entriesPerPage]
  );

  // --- EFFECTS ---
  useEffect(() => {
    loadUserDropdown();
  }, [loadUserDropdown]);

  useEffect(() => {
    loadDeletedBetHistoryData(1);
  }, [loadDeletedBetHistoryData]);

  // --- FORM HANDLERS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadDeletedBetHistoryData(1);
  };

  const handleReset = () => {
    const newFromDate = new Date();
    newFromDate.setDate(newFromDate.getDate() - 7);
    setFromDate(newFromDate.toISOString().split("T")[0]);
    setToDate(new Date().toISOString().split("T")[0]);
    setBetSide("");
    setIpAddress("");
    clearUserSearch();
    setBetData([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalRecords(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadDeletedBetHistoryData(page);
  };

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  // --- RENDER ---
  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">Deleted Bet History</h2>
          </div>

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
              <div className="col-md-2">
                <label>From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label>To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <label>Bet Side</label>
                <select
                  className="form-control"
                  value={betSide}
                  onChange={(e) => setBetSide(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="Back">Back</option>
                  <option value="Lay">Lay</option>
                </select>
              </div>

              <div className="col-md-2">
                <label>User</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search user..."
                    value={userSearchTerm}
                    onChange={handleUserSearchChange}
                    onFocus={handleUserInputFocus}
                    onBlur={handleUserInputBlur}
                    disabled={loadingUsers}
                  />
                  {loadingUsers && (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="fa-spin"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                      }}
                    />
                  )}
                  {!loadingUsers && userSearchTerm && (
                    <button
                      type="button"
                      onClick={clearUserSearch}
                      className="btn btn-link p-0"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      ×
                    </button>
                  )}

                  {showUserDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        background: "white",
                        border: "1px solid #ddd",
                        maxHeight: "200px",
                        overflowY: "auto",
                        zIndex: 1000,
                      }}
                    >
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            onClick={() => handleUserSelect(user)}
                            style={{
                              padding: "8px 12px",
                              cursor: "pointer",
                              borderBottom: "1px solid #f0f0f0",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.backgroundColor = "#f8f9fa")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.backgroundColor = "white")
                            }
                          >
                            {user.username}
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "8px 12px" }}>No users found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-2">
                <label>IP</label>
                <input
                  className="form-control"
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="IP"
                />
              </div>

              <div className="col-md-2 d-flex align-items-end">
                <button
                  className="btn btn-success w-100"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* --- DATA TABLE --- */}
          <div className="table-responsive tableFixHead">
            <table className="table table-bordered table-striped">
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
                  betData.map((bet, i) => (
                    <tr key={bet.id || i}>
                      <td>{bet.parent_username}</td>
                      <td>{bet.username}</td>
                      <td>{bet.game_name}</td>
                      <td>
                        <a
                          href={`${ADMIN_BASE_PATH}/sports/${bet.game_name?.toLowerCase()}/${bet.match_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {bet.sport_name}
                        </a>
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
                    <td colSpan="10" className="text-center">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION --- */}
          {betData.length > 0 && (
            <div
              className="pagination-container"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 0",
                borderTop: "1px solid #dee2e6",
              }}
            >
              <div>
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * entriesPerPage + 1,
                  totalRecords
                )}{" "}
                to {Math.min(currentPage * entriesPerPage, totalRecords)} of{" "}
                {totalRecords}
              </div>

              <div>
                <button
                  className="btn btn-light btn-sm me-1"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-light btn-sm ms-1"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeletedBetHistory;
