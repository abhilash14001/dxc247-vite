import React, { useState, useEffect, useCallback, useMemo } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const CurrentBet = () => {
  // ------------------ State ------------------
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
  const [toDate, setToDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [betSide, setBetSide] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [ipAddress, setIpAddress] = useState("");

  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // ------------------ Derived Data ------------------
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return userOptions;
    return userOptions.filter((u) =>
      u.username.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [userOptions, userSearchTerm]);

  // ------------------ Load User Dropdown ------------------
  const loadUserDropdown = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await adminApi(`${ADMIN_BASE_PATH}/match-pl-dropdowns`, "GET");
      if (res.success) {
        setUserOptions(res.clients || []);
      } else {
        console.error("Failed to load users:", res.message);
        setUserOptions([]);
      }
    } catch (err) {
      console.error("Error loading users:", err);
      setUserOptions([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // ------------------ Load Bet Data ------------------
  const loadCurrentBetData = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          from_date: fromDate,
          to_date: toDate,
          bet_side: betSide,
          select_user_id: selectedUserId,
          ip: ipAddress,
          page,
          per_page: entriesPerPage,
        };

        const res = await adminApi(
          `${ADMIN_BASE_PATH}/admin-current-bet`,
          "POST",
          params
        );

        if (res.success) {
          setBetData(res.data || []);
          setCurrentPage(res.pagination?.current_page || 1);
          setTotalPages(res.pagination?.total_pages || 1);
          setTotalRecords(res.pagination?.total_records || 0);
        } else {
          console.error("Failed to load bet data:", res.message);
          setBetData([]);
        }
      } catch (err) {
        console.error("Error loading bet data:", err);
        setBetData([]);
      } finally {
        setLoading(false);
      }
    },
    [fromDate, toDate, betSide, selectedUserId, ipAddress, entriesPerPage]
  );

  // ------------------ Lifecycle ------------------
  useEffect(() => {
    loadUserDropdown();
    loadCurrentBetData(1);
  }, []);

  // ------------------ Handlers ------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    loadCurrentBetData(1);
  };

  const handleReset = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    setFromDate(d.toISOString().split("T")[0]);
    setToDate(new Date().toISOString().split("T")[0]);
    setBetSide("");
    setIpAddress("");
    setUserSearchTerm("");
    setSelectedUserId("");
    setBetData([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalRecords(0);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    loadCurrentBetData(page);
  };

  const handleUserSelect = (user) => {
    setSelectedUserId(user.id);
    setUserSearchTerm(user.username);
    setShowUserDropdown(false);
  };

  // ------------------ Render ------------------
  return (
    <div className="main-container">
      <div className="listing-grid">
        <div className="detail-row d-flex justify-content-between align-items-center">
          <h2>Current Bet</h2>
        </div>

        <form onSubmit={handleSubmit} className="row g-3 mb-4">
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

          <div className="col-md-2 position-relative">
            <label>User</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search user..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              onFocus={() => setShowUserDropdown(true)}
              onBlur={() => setTimeout(() => setShowUserDropdown(false), 150)}
              disabled={loadingUsers}
            />
            {loadingUsers && (
              <FontAwesomeIcon
                icon={faSpinner}
                className="fa-spin position-absolute"
                style={{ right: "10px", top: "35px" }}
              />
            )}

            {showUserDropdown && filteredUsers.length > 0 && (
              <div
                className="bg-white border position-absolute w-100 shadow-sm"
                style={{ maxHeight: "200px", overflowY: "auto", zIndex: 10 }}
              >
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="px-3 py-2 hover-bg-light cursor-pointer"
                  >
                    {user.username}
                  </div>
                ))}
              </div>
            )}

            {showUserDropdown && !filteredUsers.length && (
              <div className="bg-white border p-2 position-absolute w-100 text-muted small">
                No users found
              </div>
            )}
          </div>

          <div className="col-md-2">
            <label>IP</label>
            <input
              type="text"
              className="form-control"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="IP"
            />
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-success w-50 me-2"
              type="submit"
              disabled={loading}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> : "Submit"}
            </button>
            <button className="btn btn-secondary w-50" type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        <div className="table-responsive">
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

        {/* Pagination */}
        {totalRecords > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-3">
            <div>
              Showing {(currentPage - 1) * entriesPerPage + 1}–
              {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords}
            </div>

            <div className="d-flex gap-2 align-items-center">
              <label>Show:</label>
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                className="form-select form-select-sm w-auto"
              >
                {[10, 25, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex gap-1">
              <button
                className="btn btn-light btn-sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
              >
                First
              </button>
              <button
                className="btn btn-light btn-sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>

              <span className="px-2 align-self-center">
                Page {currentPage} / {totalPages}
              </span>

              <button
                className="btn btn-light btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
              <button
                className="btn btn-light btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentBet;
