import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";

import LoadingSpinner from "@dxc247/shared/components/ui/LoadingSpinner";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useConfirmModal } from "@dxc247/shared/components/ui/useConfirmModal";
import ConfirmModal from "@dxc247/shared/components/ui/ConfirmModal";
import FancyResultModal from "./FancyResultModal";

const AdminManageFancySingle = () => {
  const { matchId } = useParams();
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

      const response = await adminApi(
        `${ADMIN_BASE_PATH}/sports-fancy-single`,
        "POST",
        { sport_id: matchId }
      );

      if (response.success) {
        setFancyData(response.data || []);
        setMatchInfo({
          match_id: matchId,
          match_name: response.match_info.match_name,
          match_date: response.match_info.match_date_formatted,
        });
      } else {
        setFancyData([]);
        setMatchInfo(null);
      }
    } catch (error) {
      console.error("Error loading fancy data:", error);
      setFancyData([]);
      setMatchInfo(null);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    loadFancyData();
    
    const interval = setInterval(() => loadFancyData(true), 10000);
    return () => clearInterval(interval);
  }, [loadFancyData]);

  const openResultModal = (fancy) => {
    setResultModal({ isOpen: true, fancy });
  };

  const closeResultModal = () => {
    setResultModal({ isOpen: false, fancy: null });
  };

  const handleModalSuccess = () => loadFancyData();

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
        }
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

  if (loading) return <LoadingSpinner centered height="400px" />;

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

          <div className="card">
            <div className="card-body">
              <div className="table-responsive data-table">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Sr.No</th>
                      <th>Name</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fancyData.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          There are no results to display for this query.
                        </td>
                      </tr>
                    ) : (
                      fancyData.map((fancy, index) => (
                        <tr key={fancy.id}>
                          <td>{fancy.sr_no || index + 1}</td>
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
