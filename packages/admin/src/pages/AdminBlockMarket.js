import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faToggleOn,
  faToggleOff,
  faSpinner,
  faEye,
  faEyeSlash,
  faGamepad,
  faDice,
} from "@fortawesome/free-solid-svg-icons";
import { adminApiMethods as adminApi } from '@dxc247/shared/utils/adminApi';
import Pagination from "@dxc247/shared/components/common/Pagination";

const AdminBlockMarket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(15);

  // Items state
  const [items, setItems] = useState([]);
  const [itemsSearch, setItemsSearch] = useState("");
  const [itemsStatus, setItemsStatus] = useState("");
  const [itemsCasinoType, setItemsCasinoType] = useState("");

  // Fetch block market items
  const fetchItems = async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: page.toString(),
        per_page: perPage.toString(),
        ...(itemsSearch && { search: itemsSearch }),
        ...(itemsStatus !== "" && { status: itemsStatus }),
        ...(itemsCasinoType && { casino_type: itemsCasinoType }),
      };

      const response = await adminApi.getBlockMarketItems(params);

      if (response.success) {
        setItems(response.data.data);
        setTotalPages(response.data.last_page);
        setTotalRecords(response.data.total);
      } else {
        setError(response.message || "Failed to fetch items");
      }
    } catch (err) {
      setError("Failed to fetch items: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchItems(page);
  };

  // Toggle block status
  const toggleBlock = async (type, refId, currentStatus) => {
    setLoading(true);
    try {
      const response = await adminApi.toggleBlockMarket({
        type,
        ref_id: refId,
        status: currentStatus ? 0 : 1,
      });

      if (response.success) {
        fetchItems(currentPage);
      } else {
        setError(response.message || "Failed to toggle block status");
      }
    } catch (err) {
      setError("Failed to toggle block status: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchItems(1);
  };

  const clearFilters = () => {
    setCurrentPage(1);
    setItemsSearch("");
    setItemsStatus("");
    setItemsCasinoType("");
    fetchItems(1);
  };

  useEffect(() => {
    fetchItems(1);
  }, []);

  const renderContent = () => (
    <>
      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or ID..."
                value={itemsSearch}
                onChange={(e) => setItemsSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                autoComplete="off"
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={itemsStatus}
                onChange={(e) => setItemsStatus(e.target.value)}
                style={{ color: "black" }}
              >
                <option value="">All Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-control"
                value={itemsCasinoType}
                onChange={(e) => setItemsCasinoType(e.target.value)}
                style={{ color: "black" }}
              >
                <option value="">All Casino Types</option>
                <option value="main">Main</option>
                <option value="live">Live</option>
                <option value="sport">Sport</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} className="me-1" /> Search
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-5 text-right">
          <button className="btn btn-secondary" onClick={clearFilters}>
            <FontAwesomeIcon icon={faFilter} className="me-1" />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive data-table">
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center p-4">
                <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
                Loading...
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <tr key={`${item.type}_${item.id}`}>
                          <td>
                            <span
                              className={`badge text-white ${
                                item.type === "SPORT" ? "bg-primary" : "bg-info"
                              }`}
                              style={{ fontSize: "15px" }}
                            >
                              <FontAwesomeIcon
                                icon={
                                  item.type === "SPORT" ? faGamepad : faDice
                                }
                                className="me-1"
                              />{" "}
                              {item.type === "MATCH" ? "Casino" : "Sports"}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.icon_url && (
                                <img
                                  src={item.icon_url}
                                  alt={item.name}
                                  className="me-2"
                                  style={{ width: "24px", height: "24px" }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              )}
                              {item.display_name}
                            </div>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.is_blocked
                                  ? "bg-danger"
                                  : "bg-success"
                              } px-3 py-2`}
                            >
                              <FontAwesomeIcon
                                icon={
                                  item.is_blocked ? faEyeSlash : faEye
                                }
                                className="me-2 text-white"
                              />
                              {item.is_blocked ? "Blocked" : "Active"}
                            </span>
                          </td>
                          <td className="text-right">
                            <FontAwesomeIcon
                              icon={
                                item.is_blocked ? faToggleOff : faToggleOn
                              }
                              className={`cursor-pointer ${
                                item.is_blocked
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                              onClick={() =>
                                toggleBlock(item.type, item.id, item.is_blocked)
                              }
                              title={
                                item.is_blocked ? "Unblock" : "Block"
                              }
                              style={{
                                fontSize: "30px",
                                cursor: "pointer",
                              }}
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxVisiblePages={5}
          showPreviousNext={true}
          className="custom-pagination pull-right mt-2"
        />
      )}
    </>
  );

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <style>
          {`
            .custom-pagination .page-item.active .page-link {
              background-color: #007bff !important;
              border-color: #007bff !important;
              color: white !important;
              z-index: 1;
            }
            .custom-pagination .page-item.active {
              background-color: #007bff !important;
            }
            .custom-pagination .page-link {
              color: #007bff;
              border: 1px solid #dee2e6;
              padding: 0.375rem 0.75rem;
              margin-left: -1px;
              line-height: 1.25;
              text-decoration: none;
              display: block;
            }
            .custom-pagination .page-link:hover {
              color: #0056b3;
              background-color: #e9ecef;
              border-color: #dee2e6;
            }
            .custom-pagination .page-item {
              display: inline-block;
            }
            .cursor-pointer {
              cursor: pointer !important;
            }
            .cursor-pointer:hover {
              opacity: 0.8;
            }
          `}
        </style>

        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">Block Market Management</h2>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <strong>Error:</strong> {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminBlockMarket;
