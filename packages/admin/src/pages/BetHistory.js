import React, { useState, useEffect, useCallback, useMemo } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@dxc247/shared/components/common/Pagination";

const BetHistory = () => {
  // ----- state -----
  const [loading, setLoading] = useState(false);
  const [betData, setBetData] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [betSide, setBetSide] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // ----- derived -----
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return userOptions;
    return userOptions.filter((u) =>
      u.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [userOptions, userSearchTerm]);

  // ----- API: load users -----
  const loadUserDropdown = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await adminApi(`${ADMIN_BASE_PATH}/match-pl-dropdowns`, "GET", {}, true);
      if (res && res.clients) {
        setUserOptions(res.clients || []);
      } else {
        console.error("Failed to load users:", res?.message);
        setUserOptions([]);
      }
    } catch (err) {
      console.error("Error loading users:", err);
      setUserOptions([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // ----- API: load bet history -----
  const loadBetHistoryData = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          from_date: fromDate,
          to_date: toDate,
          bet_side: betSide,
          select_user_id: selectedUserId,
          ip: ipAddress,
          active: 1, // only active bets
          page,
          per_page: entriesPerPage,
        };

        const res = await adminApi(`${ADMIN_BASE_PATH}/admin-bet-history`, "POST", params, true);

        if (res && res) {
          setBetData(res || []);
          setCurrentPage(res.pagination?.current_page || 1);
          setTotalPages(res.pagination?.total_pages || 1);
          setTotalRecords(res.pagination?.total_records || 0);
        } else {
          console.error("Failed to load bet history data:", res?.message);
          setBetData([]);
          setCurrentPage(1);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error loading bet history data:", err);
        setBetData([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    },
    [fromDate, toDate, betSide, selectedUserId, ipAddress, entriesPerPage]
  );

  // ----- lifecycle -----
  useEffect(() => {
    loadUserDropdown();
    loadBetHistoryData(1);
  }, [loadUserDropdown, loadBetHistoryData]);

  // ----- handlers -----
  const handleUserSearchChange = (e) => {
    setUserSearchTerm(e.target.value);
    setShowUserDropdown(true);
  };

  const handleUserSelect = (user) => {
    setSelectedUserId(user.id);
    setUserSearchTerm(user.username);
    setShowUserDropdown(false);
  };

  const handleUserInputFocus = () => {
    setShowUserDropdown(true);
  };

  const handleUserInputBlur = () => {
    // small delay so click on dropdown can register
    setTimeout(() => setShowUserDropdown(false), 150);
  };

  const clearUserSearch = () => {
    setUserSearchTerm("");
    setSelectedUserId("");
    setShowUserDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadBetHistoryData(1);
  };

  const handleReset = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    setFromDate(d.toISOString().split("T")[0]);
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
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    loadBetHistoryData(page);
  };

  const handleEntriesPerPageChange = (e) => {
    const n = parseInt(e.target.value, 10);
    setEntriesPerPage(n);
    setCurrentPage(1);
    // user will click Submit to reload (keeps behavior consistent with original)
  };

  // ----- render -----
  return (
    <div className="main-container">
      <div className="listing-grid">
        <div className="detail-row d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Bet History</h2>
        </div>

        <form onSubmit={handleSubmit} className="row g-3 mb-4">
          <div className="col-md-2">
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Bet Side</label>
            <select
              className="form-select form-control"
              value={betSide}
              onChange={(e) => setBetSide(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Back">Back</option>
              <option value="Lay">Lay</option>
            </select>
          </div>

          <div className="col-md-3 position-relative">
            <label className="form-label">User</label>
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
                className="fa-spin position-absolute"
                style={{ right: 12, top: 36 }}
              />
            )}
            {userSearchTerm && !loadingUsers && (
              <button
                type="button"
                onClick={clearUserSearch}
                className="btn btn-sm btn-link position-absolute"
                style={{ right: 12, top: 6, padding: "0 6px", lineHeight: 1 }}
                title="Clear"
              >
                ×
              </button>
            )}

            {showUserDropdown && filteredUsers.length > 0 && (
              <div
                className="position-absolute w-100 bg-white border shadow-sm"
                style={{ zIndex: 1200, maxHeight: 220, overflowY: "auto" }}
              >
                {filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleUserSelect(u)}
                    className="px-3 py-2"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {u.username}
                  </div>
                ))}
              </div>
            )}

            {showUserDropdown && !filteredUsers.length && userSearchTerm && (
              <div className="position-absolute w-100 bg-white border p-2 text-muted">No users found</div>
            )}
          </div>

          <div className="col-md-2">
            <label className="form-label">IP</label>
            <input
              type="text"
              className="form-control"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="IP"
            />
          </div>

          <div className="col-md-1 d-flex align-items-end gap-2">
            <button className="btn btn-success w-100" type="submit" disabled={loading}>
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Submit"}
            </button>
            <button type="button" className="btn btn-secondary w-100" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        <div className="table-responsive mb-3">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Parent</th>
                <th>Username</th>
                <th>Event Type</th>
                <th>Event Name</th>
                <th>Bet Type</th>
                <th>Bet Side</th>
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
                betData.map((bet, idx) => (
                  <tr key={bet.id || idx} className={bet.bet_side?.toLowerCase()}>
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
                    <td>{bet.created_at ? new Date(bet.created_at).toLocaleString() : ""}</td>
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

        {/* pagination */}
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
  );
};

export default BetHistory;
