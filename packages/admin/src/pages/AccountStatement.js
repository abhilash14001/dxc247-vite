import React, { useState, useEffect, useCallback, useMemo } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import LoadingSpinner from "@dxc247/shared/components/ui/LoadingSpinner";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@dxc247/shared/components/common/Pagination";

const AccountStatement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [filterType, setFilterType] = useState("0"); // All, Free Chips, Settlement, Game Report
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedUserId, setSelectedUserId] = useState("");
  
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

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
      const res = await adminApi(`${ADMIN_BASE_PATH}/match-pl-dropdowns`, "GET");
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

  // ----- API: load account statement -----
  const loadAccountStatementData = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          type: filterType,
          from_date: fromDate,
          to_date: toDate,
          select_user_id: selectedUserId,
          page,
          per_page: entriesPerPage,
        };

        const res = await adminApi(`${ADMIN_BASE_PATH}/admin-account-statement`, "POST", params);
        
        if (res && res.success) {
          setData(res.data || []);
          setCurrentPage(res.pagination?.current_page || 1);
          setTotalPages(res.pagination?.last_page || 1);
          setTotalRecords(res.pagination?.total || 0);
        } else {
          console.error("Failed to load account statement data:", res?.message);
          setData([]);
          setCurrentPage(1);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error loading account statement data:", err);
        setData([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    },
    [filterType, fromDate, toDate, selectedUserId, entriesPerPage]
  );

  // ----- lifecycle -----
  useEffect(() => {
    loadUserDropdown();
    loadAccountStatementData(1);
  }, [loadUserDropdown, loadAccountStatementData]);

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
    loadAccountStatementData(1);
  };

  const handleReset = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    setFromDate(d.toISOString().split("T")[0]);
    setToDate(new Date().toISOString().split("T")[0]);
    setFilterType("0");
    clearUserSearch();
    setData([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalRecords(0);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    loadAccountStatementData(page);
  };

  const handleEntriesPerPageChange = (e) => {
    const n = parseInt(e.target.value, 10);
    setEntriesPerPage(n);
    setCurrentPage(1);
    // user will click Submit to reload (keeps behavior consistent with original)
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="sidebar sidebar-main">
          <nav>
            <h2>Sports</h2>
            <span onClick={() => {/* Handle sidebar close */}}>
              <i className="fa fa-times"></i>
            </span>
            <div className="mtree-main">
              <ul className="mtree transit bubba">
                {/* Sports navigation would go here */}
              </ul>
            </div>
          </nav>
        </div>

        <div className="col-md-12 main-container">
          <div className="listing-grid">
            <div className="detail-row">
              <h2 className="d-inline-block">Account Statement</h2>
              <span className="export-buttons pull-right"></span>
            </div>
            
            <div className="">
              <form onSubmit={handleSubmit} className="row g-3 mb-4">
                <div className="col-md-12">
                  <div className="select_account">
                    <div className="radio pull-left">
                      <input
                        id="radio-1"
                        type="radio"
                        name="fltrselct"
                        value="0"
                        checked={filterType === "0"}
                        onChange={(e) => setFilterType(e.target.value)}
                      />
                      <label htmlFor="radio-1" className="radio-label">All</label>
                    </div>
                    <div className="radio pull-left">
                      <input
                        id="radio-2"
                        type="radio"
                        name="fltrselct"
                        value="1"
                        checked={filterType === "1"}
                        onChange={(e) => setFilterType(e.target.value)}
                      />
                      <label htmlFor="radio-2" className="radio-label">Free Chips</label>
                    </div>
                    <div className="radio">
                      <input
                        id="radio-3"
                        type="radio"
                        name="fltrselct"
                        value="2"
                        checked={filterType === "2"}
                        onChange={(e) => setFilterType(e.target.value)}
                      />
                      <label htmlFor="radio-3" className="radio-label">Settlement</label>
                    </div>
                    <div className="radio">
                      <input
                        id="radio-4"
                        type="radio"
                        name="fltrselct"
                        value="3"
                        checked={filterType === "3"}
                        onChange={(e) => setFilterType(e.target.value)}
                      />
                      <label htmlFor="radio-4" className="radio-label">Game Report</label>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-2">
                  <label className="form-label">From Date</label>
                  <input
                    type="date"
                    name="from_date"
                    id="from_date"
                    value={fromDate}
                    className="form-control"
                    placeholder="From Date"
                    autoComplete="off"
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">To Date</label>
                  <input
                    type="date"
                    name="to_date"
                    id="to_date"
                    value={toDate}
                    className="form-control"
                    placeholder="To Date"
                    autoComplete="off"
                    onChange={(e) => setToDate(e.target.value)}
                  />
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

                <div className="col-md-2 d-flex align-items-end gap-2">
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
                      <th>S.No</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Credit</th>
                      <th>Debit</th>
                      <th>Balance</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                        </td>
                      </tr>
                    ) : data.length > 0 ? (
                      data.map((row, index) => (
                        <tr key={row.id || index}>
                          <td>{((currentPage - 1) * entriesPerPage) + index + 1}</td>
                          <td>{row.created_at ? new Date(row.created_at).toLocaleString() : '-'}</td>
                          <td>
                            {row.description && row.description.includes('ROUND ID') ? (
                              <a href="javascript:void(0)" className="description-clickable">
                                {row.description}
                              </a>
                            ) : (
                              row.description || '-'
                            )}
                          </td>
                          <td>
                            {row.cr > 0 ? (
                              <span className="text-success fw-bold">{formatCurrency(row.cr)}</span>
                            ) : (
                              "0"
                            )}
                          </td>
                          <td>
                            {row.dr > 0 ? (
                              <span className="text-danger fw-bold">{formatCurrency(row.dr)}</span>
                            ) : (
                              "0"
                            )}
                          </td>
                          <td>
                            <span className={row.balance < 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                              {formatCurrency(row.balance)}
                            </span>
                          </td>
                          <td>{row.type || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No account statement data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
      </div>
    </div>
  );
};

export default AccountStatement;
