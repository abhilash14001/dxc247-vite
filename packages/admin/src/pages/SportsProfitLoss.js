import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../utils/api";
import Pagination from "@dxc247/shared/components/common/Pagination";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function SportsProfitLoss() {
  const [loading, setLoading] = useState(true);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getSevenDaysAgo = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return sevenDaysAgo.toISOString().split("T")[0];
  };

  const [fromDate, setFromDate] = useState(getSevenDaysAgo());
  const [toDate, setToDate] = useState(getTodayDate());
  const [sportsData, setSportsData] = useState([]);
  const [gameNames, setGameNames] = useState([]);
  const [gameNamesMap, setGameNamesMap] = useState({});
  const [parentID, setParentID] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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

  const loadSportsData = useCallback(
    async (page = 1, search = "") => {
      try {
        setLoading(true);
        const params = {
          parent_id: parentID,
          from_date: fromDate,
          to_date: toDate,
          start: (page - 1) * entriesPerPage,
          length: entriesPerPage,
          draw: page,
          search: search,
        };
        const response = await adminApi(
          `${ADMIN_BASE_PATH}/sports-profit-loss`,
          "POST",
          params
        );

        if (response.success) {
          setGameNamesMap(response.game_names || {});
          const gameNamesArray = response.game_names
            ? Object.values(response.game_names)
            : [];
          setGameNames(gameNamesArray);

          const transformedData = (response.data || []).map((item, index) => ({
            id: item.user_id,
            user_id: item.user_id,
            username: item.username,
            role_name: item.role_name,
            total: item.total_profit_loss,
            is_own: item.user_id === response.current_user_id,
            can_view_details: item.role !== 7,
            DT_RowIndex: (page - 1) * entriesPerPage + index + 1,
            parent_id: item.parent_id,
            game_data: item.game_data || {},
          }));

          setSportsData(transformedData);
          setPagination({
            current_page: page,
            per_page: entriesPerPage,
            total: response.recordsTotal || 0,
            last_page: Math.ceil(
              (response.recordsFiltered || 0) / entriesPerPage
            ),
            from: (page - 1) * entriesPerPage + 1,
            to: Math.min(page * entriesPerPage, response.recordsFiltered || 0),
          });
        } else {
          setSportsData([]);
          setGameNames([]);
          setGameNamesMap({});
          setPagination({
            current_page: 1,
            per_page: entriesPerPage,
            total: 0,
            last_page: 1,
            from: 0,
            to: 0,
          });
        }
      } catch (error) {
        console.error("Error loading sports data:", error);
        setSportsData([]);
        setGameNames([]);
        setGameNamesMap({});
        setPagination({
          current_page: 1,
          per_page: entriesPerPage,
          total: 0,
          last_page: 1,
          from: 0,
          to: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [fromDate, toDate, entriesPerPage, parentID]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      loadSportsData(1, searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      loadSportsData(pagination.current_page, searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [fromDate, toDate, entriesPerPage, searchTerm, pagination.current_page]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
  };

  const handleEntriesPerPageChange = (newEntriesPerPage) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1);
  };

  const handleSubmit = () => {
    setCurrentPage(1);
    loadSportsData(1, searchTerm);
  };

  const handleParentIDChange = async (newParentID, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      setLoading(true);
      const params = {
        SPORT_PL_USER_ID: newParentID,
        SPORT_PL_FROM_DATE: fromDate,
        SPORT_PL_TO_DATE: toDate,
        search: searchTerm,
        page: 1,
        per_page: entriesPerPage,
      };

      const response = await adminApi(
        `${ADMIN_BASE_PATH}/sports-profit-loss-update`,
        "POST",
        params
      );

      if (response.success) {
        setGameNamesMap(response.game_names || {});
        const gameNamesArray = response.game_names
          ? Object.values(response.game_names)
          : [];
        setGameNames(gameNamesArray);

        const transformedData = (response.data || []).map((item, index) => ({
          id: item.user_id,
          user_id: item.user_id,
          username: item.username,
          role_name: item.role_name,
          total: item.total_profit_loss,
          is_own: item.user_id === response.current_user_id,
          can_view_details: item.role !== 7,
          DT_RowIndex: index + 1,
          parent_id: item.parent_id,
          game_data: item.game_data || {},
        }));

        setSportsData(transformedData);
        setParentID(newParentID);
        setCurrentPage(1);
        setPagination({
          current_page: 1,
          per_page: entriesPerPage,
          total: response.recordsTotal || 0,
          last_page: Math.ceil(
            (response.recordsFiltered || 0) / entriesPerPage
          ),
          from: 1,
          to: Math.min(entriesPerPage, response.recordsFiltered || 0),
        });
      } else {
        console.error("Failed to load sub-accounts:", response.message);
        setSportsData([]);
      }
    } catch (error) {
      console.error("Error loading sub-accounts:", error);
      setSportsData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .ListAllHideHeader > thead {display:none !important;}
        .Checklogin {display:none !important;}
        .ListAllHideHeader > tbody > tr > td {padding: 0px !important;}
        label {color: #333;}
        .ml-1 {margin-left: 5px;}
        .radio {margin: 0.5rem; display: inline-block;}
        .row {margin-right: 0px !important; margin-left: 0px !important;}
        .red-color {color: #dc3545 !important;}
        .green-color {color: #28a745 !important;}
        @media screen and (-webkit-min-device-pixel-ratio:0) {
          input[type="date"].form-control {
            line-height: 23px !important;
          }
        }
      `}</style>

      <div className="row">
        <div className="col-md-12 main-container">
          <div className="listing-grid">
            <div className="detail-row">
              <h2 className="d-inline-block">Sport PL</h2>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="table-responsive data-table">
            <input
              type="text"
              style={{ width: "10%", float: "right" }}
              autoComplete="off"
              id="searchClient"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="row form-horizontal" style={{ marginBottom: "25px" }}>
              <div className="col-md-2">
                <input
                  type="date"
                  name="from_date"
                  id="from_date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-control"
                  placeholder="From Date"
                />
              </div>
              <div className="col-md-2">
                <input
                  type="date"
                  name="to_date"
                  id="to_date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="form-control"
                  placeholder="To Date"
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-success"
                  id="search"
                  style={{ width: "100%" }}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="dataTables_length">
                  <label>
                    Show{" "}
                    <select
                      value={entriesPerPage}
                      onChange={(e) =>
                        handleEntriesPerPageChange(parseInt(e.target.value))
                      }
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={75}>75</option>
                      <option value={100}>100</option>
                    </select>{" "}
                    entries
                  </label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <table
                  id="sport-p-l-tbl"
                  className="table table-bordered clientListTable"
                >
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>User Name</th>
                      {gameNames.map((gameName, index) => (
                        <th key={index}>{gameName}</th>
                      ))}
                      <th>PL Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parentID > 0 && (
                      <tr>
                        <td>
                          <a
                            href="javascript:void(0);"
                            className="btn-sm btn-primary"
                            onClick={(e) => handleParentIDChange(0, e)}
                          >
                            Back
                          </a>
                        </td>
                        <td></td>
                        {gameNames.map((_, index) => (
                          <td key={index}></td>
                        ))}
                        <td></td>
                      </tr>
                    )}
                    {loading ? (
                      <tr>
                        <td colSpan={2 + gameNames.length + 1} className="text-center">
                          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                        </td>
                      </tr>
                    ) : sportsData.length > 0 ? (
                      sportsData.map((item, index) => {
                        const total = item.total || 0;
                        return (
                          <tr key={item.id || index}>
                            <td>{item.DT_RowIndex || index + 1}</td>
                            <td>
                              {item.parent_id > 0 ? (
                                <a
                                  href="javascript:void(0);"
                                  onClick={(e) => handleParentIDChange(item.user_id, e)}
                                >
                                  {item.username?.toUpperCase()}
                                </a>
                              ) : (
                                item.username?.toUpperCase()
                              )}
                            </td>
                            {gameNames.map((gameDisplayName, gameIndex) => {
                              const gameKey = Object.keys(gameNamesMap).find(
                                (key) => gameNamesMap[key] === gameDisplayName
                              );
                              const gameValue = gameKey
                                ? item.game_data[gameKey] || 0
                                : 0;
                              return (
                                <td key={gameIndex}>
                                  <span
                                    style={{
                                      color: gameValue >= 0 ? "green" : "red",
                                    }}
                                  >
                                    {parseFloat(gameValue).toFixed(2)}
                                  </span>
                                </td>
                              );
                            })}
                            <td>
                              <span
                                style={{
                                  color: total >= 0 ? "green" : "red",
                                }}
                              >
                                {total.toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={2 + gameNames.length + 1}
                          className="text-center"
                        >
                          No records to show in the given table
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {!loading && sportsData.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <div className="dataTables_info">
                  Showing {pagination.from} to {pagination.to} of{" "}
                  {pagination.total} entries
                </div>

                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                  onPageChange={handlePageChange}
                  maxVisiblePages={5}
                  showPreviousNext={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SportsProfitLoss;
