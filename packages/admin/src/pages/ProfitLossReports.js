import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../utils/api";
import Pagination from "@dxc247/shared/components/common/Pagination";
import { useGameNames } from "@dxc247/shared/store/admin/useGameNames";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function ProfitLossReports() {
  const [loading, setLoading] = useState(true);
  const { gameNames, gameNamesLoading, gameNamesError, fetchGameNames } = useGameNames();

  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const getSevenDaysAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  };

  const [fromDate, setFromDate] = useState(getSevenDaysAgo());
  const [toDate, setToDate] = useState(getTodayDate());
  const [sportFilter, setSportFilter] = useState("");
  const [eventName, setEventName] = useState("");
  const [profitLossData, setProfitLossData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 25,
    total: 0,
    last_page: 1,
    from: 0,
    to: 0,
  });

  const loadProfitLossData = useCallback(
    async (page = 1, search = "") => {
      try {
        setLoading(true);
        const params = {
          user_id: 1,
          sport: sportFilter,
          from_date: fromDate,
          to_date: toDate,
          event_name: eventName,
          start: (page - 1) * entriesPerPage,
          length: entriesPerPage,
          draw: page,
          search,
        };

        const response = await adminApi(`${ADMIN_BASE_PATH}/profit-loss`, "POST", params);
        if (response && response.data) {
          const transformedData = (response.data || []).map((item, index) => ({
            id: item.id || index,
            s_no: item.DT_RowIndex || (page - 1) * entriesPerPage + index + 1,
            sport_name: item.sport_name || "",
            event_name: item.event_name || "",
            market: item.market || "",
            profit_loss: item.dr > 0 ? item.dr * -1 : item.cr || 0,
            created_on: item.created_at || "",
            action: item.action || "",
            user_balance_history_id: item.user_balance_history_id,
          }));

          setProfitLossData(transformedData);
          setPagination({
            current_page: page,
            per_page: entriesPerPage,
            total: response.recordsTotal || 0,
            last_page: Math.ceil((response.recordsFiltered || 0) / entriesPerPage),
            from: (page - 1) * entriesPerPage + 1,
            to: Math.min(page * entriesPerPage, response.recordsFiltered || 0),
          });
        } else {
          setProfitLossData([]);
        }
      } catch (err) {
        console.error("Error loading profit loss data:", err);
        setProfitLossData([]);
      } finally {
        setLoading(false);
      }
    },
    [fromDate, toDate, entriesPerPage, sportFilter, eventName]
  );

  useEffect(() => {
    fetchGameNames();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProfitLossData(1, searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [fromDate, toDate, entriesPerPage, sportFilter, eventName, searchTerm]);

  const handlePageChange = (page) => loadProfitLossData(page, searchTerm);
  const handleEntriesPerPageChange = (num) => setEntriesPerPage(num);
  const handleSubmit = () => loadProfitLossData(1, searchTerm);

  const showBetDetails = (id) => {
    console.log("Show bet details for:", id);
  };

  return (
    <>
     <style>
        {`
          .ListAllHideHeader > thead{display:none !important;}
          .Checklogin{display:none !important;}
          .ListAllHideHeader > tbody > tr > td{padding: 0px !important;}
          label{
              color: #333;
          }
          .ml-1{
              margin-left: 5px;
          }
          .radio {
              margin: 0.5rem;
              margin-top: 0.5rem;
              margin-bottom: 0.5rem;
              display: inline-block;
          }
          .row {
              margin-right: 0px !important;
              margin-left: 0px !important;
          }
          .red-color {
              color: #dc3545 !important;
          }
          .green-color {
              color: #28a745 !important;
          }
          .export-buttons {
              float: right;
          }
          @media screen and (-webkit-min-device-pixel-ratio:0) {
              input[type="date"].form-control, input[type="time"].form-control, input[type="datetime-local"].form-control, input[type="month"].form-control {
                  line-height: 23px !important;
              }
          }
        `}
      </style>

      <div className="container-fluid">
        <h2 className="mb-4">Profit Loss Reports</h2>

        {/* Filters */}
        <div className="row mb-3">
          <div className="col-md-2">
            <select
              className="form-control"
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              disabled={gameNamesLoading}
            >
              <option value="">{gameNamesLoading ? "Loading..." : "All"}</option>
              {Object.entries(gameNames).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="col-md-2">
            <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="text"
              placeholder="Search by Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-success w-100" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>

        {/* Search + Pagination Control */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label>
              Show{" "}
              <select
                value={entriesPerPage}
                onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
              >
                {[25, 50, 75, 100].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>{" "}
              entries
            </label>
          </div>
          <div className="col-md-8 column">
                    <div id="profit_loss_list_filter" className="dataTables_filter">
                      <label>
                        Search:
                        <input
                          type="search"
                          className=""
                          placeholder=""
                          aria-controls="profit_loss_list"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Sport Name</th>
                <th>Event Name</th>
                <th>Market</th>
                <th>P-L</th>
                <th>Created On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin />
                  </td>
                </tr>
              ) : profitLossData.length > 0 ? (
                profitLossData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.s_no}</td>
                    <td>{item.sport_name}</td>
                    <td>{item.event_name}</td>
                    <td>{item.market}</td>
                    <td style={{ color: item.profit_loss >= 0 ? "green" : "red" }}>
                      {item.profit_loss.toFixed(2)}
                    </td>
                    <td>{item.created_on}</td>
                    <td>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          showBetDetails(item.user_balance_history_id);
                        }}
                      >
                        Show Bet
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        {!loading && profitLossData.length > 0 && (
          <div className="row mt-3">
            <div className="col-md-7">
              Showing {pagination.from} to {pagination.to} of {pagination.total} entries
            </div>
            <div className="col-md-5 text-end">
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.last_page}
                onPageChange={handlePageChange}
                maxVisiblePages={5}
                showPreviousNext
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfitLossReports;
