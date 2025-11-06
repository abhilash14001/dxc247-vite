import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";

import LoadingSpinner from "@dxc247/shared/components/ui/LoadingSpinner";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useConfirmModal } from "@dxc247/shared/components/ui/useConfirmModal";
import ConfirmModal from "@dxc247/shared/components/ui/ConfirmModal";
import FancyResultModal from "./FancyResultModal";
import { clearSelectedMatchData } from "@dxc247/shared/store/admin/adminSlice";

const AdminFancyHistorySingle = () => {
  const { matchId } = useParams();
  const dispatch = useDispatch();
  const selectedMatchData = useSelector(state => state.admin.selectedMatchData);
  const [loading, setLoading] = useState(true);
  const [fancyData, setFancyData] = useState([]);
  const [matchInfo, setMatchInfo] = useState(null);

  // Confirmation modal
  const { modal: confirmModal, showConfirm, hideModal } = useConfirmModal();

  // Result modal state
  const [resultModal, setResultModal] = useState({
    isOpen: false,
    fancy: null,
  });

  const loadFancyData = useCallback(async (disable_loader = false) => {
    try {
      
      if (!disable_loader) setLoading(true);

      if (selectedMatchData) {
        setMatchInfo({
          match_id: selectedMatchData.match_id,
          match_name: selectedMatchData.match_name,
          match_date: selectedMatchData.match_date,
        });
      }

      const response = await adminApi(
        `${ADMIN_BASE_PATH}/cricket-fancy-history-single`,
        "POST",
          { sport_id: matchId },
        true
      );

      if (response.success) {
        setFancyData(response.data || []);
      } else {
        setFancyData([]);
      }
    } catch (error) {
      console.error("Error loading fancy history data:", error);
      setFancyData([]);
    } finally {
      setLoading(false);
    }
  }, [matchId, selectedMatchData]);

  useEffect(() => {
    loadFancyData();

    const interval = setInterval(() => {
      loadFancyData(true);
    }, 10000);

    return () => {
      clearInterval(interval);
      dispatch(clearSelectedMatchData());
    };
  }, []);

  const openResultModal = (fancy) => {
    setResultModal({ isOpen: true, fancy });
  };

  const closeResultModal = () => {
    setResultModal({ isOpen: false, fancy: null });
  };

  const handleModalSuccess = () => {
    loadFancyData();
  };

  const handleFancyRollback = async (fancy) => {
    const confirmed = await showConfirm({
      title: "Rollback Fancy Result",
      message: `Are you sure you want to rollback result for "${fancy.fancyName}"?`,
      confirmText: "Yes, Rollback",
      cancelText: "No",
      type: "warning",
    });

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await adminApi(
        `${ADMIN_BASE_PATH}/rollback-fancy-result`,
        "POST",
        { fancy_id: fancy.id },
        true
      );

      if (response.success) {
        toast.success(response.message || "Fancy result rollback completed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        loadFancyData();
      } else {
        toast.error(response.message || "Failed to rollback fancy result. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error rollback fancy result:", error);
      toast.error("Failed to rollback fancy result. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <LoadingSpinner centered height="400px" />;

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">
              Manage Fancy History: {matchInfo?.match_name || "Loading..."} - {matchInfo?.match_date}
            </h2>
          </div>

          <div className="table-responsive data-table">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Fancy Type</th>
                        <th>Fancy Name</th>
                        <th>Result</th>
                        <th>Match Name</th>
                        <th>Match Date</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fancyData.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            There are no results to display for this query.
                          </td>
                        </tr>
                      ) : (
                        fancyData.map((fancy, index) => (
                          <tr key={fancy.id}>
                            <td>{fancy.sr_no || index + 1}</td>
                            <td>{fancy.fancyType || "-"}</td>
                            <td>{fancy.fancyName || "-"}</td>
                            <td>{fancy.result || "-"}</td>
                            <td>{fancy.matchName || "-"}</td>
                            <td>
                              {fancy.created_at
                                ? new Date(fancy.created_at).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "-"}
                            </td>
                            <td className="text-right">
                              <button
                                className="btn btn-md mr-2 btn-danger"
                                onClick={() => handleFancyRollback(fancy)}
                                disabled={loading}
                              >
                                Rollback
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
    </div>
  );
};

export default AdminFancyHistorySingle;
