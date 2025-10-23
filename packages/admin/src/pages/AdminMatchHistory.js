import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@dxc247/shared/components/ui/LoadingSpinner";
import Pagination from "@dxc247/shared/components/common/Pagination";
import { toast } from "react-toastify";
import { useConfirmModal } from "@dxc247/shared/components/ui/useConfirmModal";
import ConfirmModal from "@dxc247/shared/components/ui/ConfirmModal";

const AdminMatchHistory = () => {
  const [loading, setLoading] = useState(true);
  const [matchHistory, setMatchHistory] = useState([]);
  const sports = [
    { id: "", name: "Select Sport" },
    { id: "0", name: "All" },
    { id: "1", name: "Cricket" },
    { id: "2", name: "Tennis" },
    { id: "3", name: "Soccer" }
  ];

  // Confirmation modal
  const { modal, showConfirm, hideModal } = useConfirmModal();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [perPage, setPerPage] = useState(25);

  // Filter states
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    sport_id: ""
  });

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  };

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      from_date: getYesterdayDate(),
      to_date: getTodayDate()
    }));
  }, []);

  const loadMatchHistory = useCallback(
    async (searchFilters = filters) => {
      try {
        setLoading(true);

        const params = {
          page: currentPage,
          per_page: perPage,
          from_date: searchFilters.from_date,
          to_date: searchFilters.to_date,
          game_id: searchFilters.sport_id
        };

        const response = await adminApi(
          `${ADMIN_BASE_PATH}/sports-history`,
          "POST",
          params
        );

        if (response.success) {
          setMatchHistory(response.data || []);
          setTotalPages(response.pagination?.last_page || 1);
          setTotalRecords(response.pagination?.total || 0);
        } else {
          setMatchHistory([]);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (error) {
        console.error("Error loading match history:", error);
        setMatchHistory([]);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, perPage, filters]
  );

  useEffect(() => {
    loadMatchHistory();
  }, [loadMatchHistory]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadMatchHistory(filters);
  };

  const handleRoleBack = async (sportId) => {
    const confirmed = await showConfirm({
      title: "Rollback Sports Result",
      message:
        "Are you sure you want to rollback this sports result? This action cannot be undone.",
      confirmText: "Yes, Rollback",
      cancelText: "Cancel",
      type: "warning"
    });

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await adminApi(
        `${ADMIN_BASE_PATH}/rollback-sports-result`,
        "POST",
        { sport_id: sportId }
      );

      if (response.success) {
        toast.success(response.message || "Sports result rolled back successfully!", {
          position: "top-right",
          autoClose: 3000
        });

        loadMatchHistory(filters);
      } else {
        toast.error(response.message || "Failed to rollback sports result.", {
          position: "top-right",
          autoClose: 5000
        });
      }
    } catch (error) {
      console.error("Error rolling back sports result:", error);
      toast.error("Failed to rollback sports result. Please try again.", {
        position: "top-right",
        autoClose: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadMatchHistory(filters);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    loadMatchHistory(filters);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">Match History List</h2>
          </div>
        </div>

        <div className="row form-horizontal mb-3">
          <div className="col-md-2">
            <input
              type="date"
              name="from_date"
              value={filters.from_date}
              onChange={handleFilterChange}
              className="form-control"
              placeholder="From Date"
              autoComplete="off"
            />
          </div>
          <div className="col-md-2">
            <input
              type="date"
              name="to_date"
              value={filters.to_date}
              onChange={handleFilterChange}
              className="form-control"
              placeholder="To Date"
              autoComplete="off"
            />
          </div>
          <div className="col-md-3 col-xs-6">
            <select
              className="form-control"
              name="sport_id"
              value={filters.sport_id}
              onChange={handleFilterChange}
              style={{ color: "black" }}
            >
              {sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 col-xs-6">
            <button
              className="btn btn-success"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> : "Submit"}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>SR. NO.</th>
                    <th>Sport Name</th>
                    <th>Match Name</th>
                    <th>Match ID</th>
                    <th>Open Date</th>
                    <th>Winner Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <LoadingSpinner size="sm" />
                      </td>
                    </tr>
                  ) : matchHistory.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        There are no results to display for this query.
                      </td>
                    </tr>
                  ) : (
                    matchHistory.map((match, index) => (
                      <tr key={match.id}>
                        <td>{match.sr_no || (currentPage - 1) * perPage + index + 1}</td>
                        <td>{match.sport_name || "-"}</td>
                        <td>{match.match_name || "-"}</td>
                        <td>{match.match_id || "-"}</td>
                        <td>{formatDate(match.open_date)}</td>
                        <td>{match.winner_name || "-"}</td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => handleRoleBack(match.id)}
                          >
                            RoleBack
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {totalRecords > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            perPage={perPage}
            onPageChange={handlePageChange}
            onPerPageChange={handlePerPageChange}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        show={modal.show}
        onHide={hideModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        type={modal.type}
      />
    </div>
  );
};

export default AdminMatchHistory;
