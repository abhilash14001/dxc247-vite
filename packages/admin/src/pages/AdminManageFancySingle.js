import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";

import LoadingSpinner from "@dxc247/shared/components/ui/LoadingSpinner";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useConfirmModal } from "@dxc247/shared/components/ui/useConfirmModal";
import ConfirmModal from "@dxc247/shared/components/ui/ConfirmModal";
import FancyResultModal from "./FancyResultModal";
import Pagination from "@dxc247/shared/components/common/Pagination";

const AdminManageFancySingle = () => {
  const { matchId } = useParams();
  const [loading, setLoading] = useState(true);
  const [fancyData, setFancyData] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  });

  // Confirmation modal
  const { modal: confirmModal, showConfirm, hideModal } = useConfirmModal();

  // Result modal state
  const [resultModal, setResultModal] = useState({
    isOpen: false,
    fancy: null,
  });

  const loadFancyData = useCallback(async (disable_loader = false, page = currentPage) => {
    try {
      
      if (!disable_loader) setLoading(true);

      const response = await adminApi(
        `${ADMIN_BASE_PATH}/sports-fancy-single`,
        "POST",
        { 
          sport_id: matchId,
          page: page,
          per_page: pagination.per_page,
          search: searchTerm || ''
        },
        true
      );

      if (response.success) {
        setFancyData(response.data || []);
        setMatchInfo({
          match_id: matchId,
          match_name: response.match_info.match_name,
          match_date: response.match_info.match_date_formatted,
        });
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setFancyData([]);
        setMatchInfo(null);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 50,
          total: 0,
          from: 0,
          to: 0,
        });
      }
    } catch (error) {
      console.error("Error loading fancy data:", error);
      setFancyData([]);
      setMatchInfo(null);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: 50,
        total: 0,
        from: 0,
        to: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [matchId, currentPage, pagination.per_page, searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadFancyData(false, currentPage);
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [currentPage, matchId, searchTerm, loadFancyData]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadFancyData(true, currentPage);
    }, 10000);
    return () => clearInterval(interval);
  }, [currentPage, matchId, searchTerm, loadFancyData]);

  const openResultModal = (fancy) => {
    setResultModal({ isOpen: true, fancy });
  };

  const closeResultModal = () => {
    setResultModal({ isOpen: false, fancy: null });
  };

  const handleModalSuccess = () => loadFancyData(false, currentPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFancyCancel = async (fancy) => {
    const confirmed = await showConfirm({
      title: "Cancel Fancy Result",
      message: `Are you sure you want to cancel result for "${fancy.team_name}"?`,
      confirmText: "Yes, Cancel",
      cancelText: "No",
      type: "danger",
    });

    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await adminApi(
        `${ADMIN_BASE_PATH}/handle-fancy-result`,
        "POST",
        {
          sport_id: fancy.sport_id,
          team_name: fancy.team_name,
          bet_type: "FANCY_SESSION",
          action: "cancel",
        }, true
      );

      if (response.success) {
        toast.success(response.message || "Fancy result cancelled successfully!", { autoClose: 3000 });
        loadFancyData();
      } else {
        toast.error(response.message || "Failed to cancel fancy result. Please try again.", { autoClose: 5000 });
      }
    } catch (error) {
      console.error("Error cancelling fancy result:", error);
      toast.error("Failed to cancel fancy result. Please try again.", { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">
              Manage Fancy : {matchInfo?.match_name || "Loading..."} - {matchInfo?.match_date}
              <span className="text-danger"> (For Odd / Even Result 0 = "ODD", 1 = "Even")</span>
            </h2>
          </div>

          <div className="row form-horizontal mb-3">
            <div className="col-md-3">
              <input
                type="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="form-control"
                placeholder="Search fancy names..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>SR. NO.</th>
                      <th>Name</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          <LoadingSpinner size="sm" />
                        </td>
                      </tr>
                    ) : fancyData.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          There are no results to display for this query.
                        </td>
                      </tr>
                    ) : (
                      fancyData.map((fancy, index) => (
                        <tr key={fancy.id}>
                          <td>{fancy.sr_no || (currentPage - 1) * pagination.per_page + index + 1}</td>
                          <td>{fancy.team_name || "-"}</td>
                          <td className="text-right">
                            <button
                              className="btn btn-md mr-2 btn-success"
                              onClick={() => openResultModal(fancy)}
                              disabled={loading}
                            >
                              Result
                            </button>
                            <button
                              className="btn btn-md btn-danger ms-2"
                              onClick={() => handleFancyCancel(fancy)}
                              disabled={loading}
                            >
                              Cancel
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

          {pagination.total > 0 && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              onPageChange={handlePageChange}
              maxVisiblePages={5}
              showPreviousNext={true}
            />
          )}
        </div>

        {/* Confirmation Modal */}
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

        {/* Fancy Result Modal */}
        <FancyResultModal
          modal={resultModal}
          onClose={closeResultModal}
          onSuccess={handleModalSuccess}
        />
      </div>
    </div>
  );
};

export default AdminManageFancySingle;
