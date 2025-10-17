import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../utils/api";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import CasinoGameResultsFinal from "@dxc247/shared/components/casino/CasinoGameResultsFinal";

const CasinoResult = () => {
  const [casinoGames, setCasinoGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [casinoData, setCasinoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [selectedSport, setSelectedSport] = useState("");
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);

  const [showResultPopup, setShowResultPopup] = useState(false);
  const [popupData, setPopupData] = useState(null);

  /** 📡 Load Casino Data (ClickHouse) */
  const loadCasinoResultData = useCallback(async (page = 1) => {
    if (!selectedSport) return;

    try {
      setLoading(true);
      const params = {
        match_id: selectedSport,
        start_date: toDate,
        end_date: toDate,
        page,
        per_page: entriesPerPage,
        sort_by: "created_at",
        sort_order: "desc",
      };

      const response = await adminApi(`${ADMIN_BASE_PATH}/clickhouse-data`, "POST", params);

      if (response.success) {
        setCasinoData(response.data || []);
        setCurrentPage(response.pagination?.current_page || 1);
        setTotalPages(response.pagination?.total_pages || 1);
        setTotalRecords(response.pagination?.total || 0);
      } else {
        console.error("Failed to load casino result data:", response.message);
        setCasinoData([]);
      }
    } catch (error) {
      console.error("Error loading casino result data:", error);
      setCasinoData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSport, toDate, entriesPerPage]);

  /** 🎮 Load Casino Games */
  const loadCasinoGames = useCallback(async () => {
    try {
      setGamesLoading(true);
      setGamesError(null);
      const response = await adminApi(`${ADMIN_BASE_PATH}/get-casino-list`, "GET");
      if (response.success) setCasinoGames(response.data || []);
      else setGamesError("Failed to load casino games");
    } catch {
      setGamesError("Error loading casino games");
    } finally {
      setGamesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCasinoGames();
  }, [loadCasinoGames]);

  /** 🔍 Handlers */
  const handleSubmit = (e) => {
    e.preventDefault();
    loadCasinoResultData(1);
  };

  const handlePageChange = (page) => loadCasinoResultData(page);

  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    loadCasinoResultData(1);
  };

  const handleResultClick = (casino) => {
    try {
      const parsedData =
        typeof casino.result_data === "string"
          ? JSON.parse(casino.result_data)
          : casino.result_data;

      setPopupData({
        requestData: parsedData?.requestData || {},
        result: parsedData?.result || {},
        resultNew: parsedData?.resultNew || {},
        winner_data: parsedData?.winner_data || {},
      });
      setShowResultPopup(true);
    } catch (err) {
      console.error("Error parsing result data:", err);
    }
  };

  const closeResultPopup = () => {
    setShowResultPopup(false);
    setPopupData(null);
  };

  /** 🧱 Render */
  return (
    <div className="container-fluid">
      <h2 className="mb-4">Casino Result Reports</h2>

      {/* Filter Form */}
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-3">
          <select
            className="form-control"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            disabled={gamesLoading}
          >
            <option value="">
              {gamesLoading ? "Loading games..." : "Select Game"}
            </option>
            {casinoGames.map((game) => (
              <option key={game.id} value={game.match_id}>
                {game.match_name || game.name}
              </option>
            ))}
          </select>
          {gamesError && <small className="text-danger">{gamesError}</small>}
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <button
            className="btn btn-success w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Submit"}
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
              <th>Round ID</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center">
                  <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                </td>
              </tr>
            ) : casinoData.length > 0 ? (
              casinoData
                .filter((item) =>
                  searchTerm
                    ? String(item.round_id)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    : true
                )
                .map((casino, index) => (
                  <tr key={casino.round_id || index}>
                    <td>{(currentPage - 1) * entriesPerPage + index + 1}</td>
                    <td
                      style={{
                        color: "#007bff",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => handleResultClick(casino)}
                    >
                      {casino.round_id || "N/A"}
                    </td>
                    <td>
                      {casino.result_data?.result ||
                        casino.result_data?.winner ||
                        "-"}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {casinoData.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Showing{" "}
            {(currentPage - 1) * entriesPerPage + 1}-
            {Math.min(currentPage * entriesPerPage, totalRecords)} of{" "}
            {totalRecords}
          </span>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showResultPopup && popupData && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Casino Result Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeResultPopup}
                ></button>
              </div>
              <div className="modal-body">
                <CasinoGameResultsFinal
                  requestData={popupData.requestData}
                  result={popupData.result}
                  resultNew={popupData.resultNew}
                  winner_data={popupData.winner_data}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeResultPopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasinoResult;
