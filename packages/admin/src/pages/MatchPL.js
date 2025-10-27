import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function MatchPL() {
  const [loading, setLoading] = useState(true);

  // Calculate dynamic dates
  const getTodayDate = () => new Date().toISOString().split("T")[0];
  const getSevenDaysAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  };

  const [fromDate, setFromDate] = useState(getSevenDaysAgo());
  const [toDate, setToDate] = useState(getTodayDate());
  const [sportCategory, setSportCategory] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("1");
  const [selectedSportId, setSelectedSportId] = useState("");
  const [accountStatementData, setAccountStatementData] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [sportOptions, setSportOptions] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingSports, setLoadingSports] = useState(false);

  const sportCategories = {
    "": "All",
    CRICKET: "CRICKET",
    SOCCER: "SOCCER",
    TENNIS: "TENNIS",
    ELECTIONS: "ELECTIONS",
  };

  // Load Account Statement
  const loadAccountStatement = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        user_id: selectedUserId,
        sport_id: selectedSportId,
      };
      const response = await adminApi(
        `${ADMIN_BASE_PATH}/match-pl-data`,
        "POST",
        params
      );

      if (response && response.success) {
        const transformed = [];
        let index = 1;
        Object.entries(response.data || {}).forEach(([type, amount]) => {
          if (Math.abs(amount) !== 0) {
            transformed.push({
              id: index,
              s_no: index,
              type,
              credit: amount > 0 ? amount : 0,
              debit: amount < 0 ? Math.abs(amount) : 0,
              total: amount,
              details: `${type} - ${
                response.sport_details?.match_name || "Unknown Match"
              }`,
            });
            index++;
          }
        });
        setAccountStatementData(transformed);
        
      } else {
        setAccountStatementData([]);
        console.error("Failed to load match PL data:", response.message);
      }
    } catch (error) {
      console.error("Error loading match PL data:", error);
      setAccountStatementData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedUserId, selectedSportId]);

  // Load Dropdowns
  const loadDropdowns = useCallback(async () => {
    try {
      setLoadingClients(true);
      setLoadingSports(true);

      const response = await adminApi(
        `${ADMIN_BASE_PATH}/match-pl-dropdowns`,
        "GET"
      );

      if (response.success) {
        setClientOptions(response.clients || []);
        setSportOptions(response.sports || []);
      } else {
        console.error("Failed to load dropdowns:", response.message);
        setClientOptions([]);
        setSportOptions([]);
      }
    } catch (error) {
      console.error("Error loading dropdowns:", error);
      setClientOptions([]);
      setSportOptions([]);
    } finally {
      setLoadingClients(false);
      setLoadingSports(false);
    }
  }, []);

  // Initial load and on date change
  useEffect(() => {
    loadDropdowns();
    setLoading(false);
  }, [fromDate, toDate, loadDropdowns]);

  // Load PL data when filters change
  useEffect(() => {
    if (selectedUserId && selectedSportId) {
      loadAccountStatement();
    }
  }, [selectedUserId, selectedSportId, loadAccountStatement]);

  const handleSportListSubmit = () => {
    loadDropdowns();
  };

  const handleSubmit = () => {
    if (selectedUserId && selectedSportId) {
      loadAccountStatement();
    } else {
      alert("Please select both Client and Sports");
    }
  };

  return (
    <>
      <style>
        {`
          .ListAllHideHeader > thead{display:none!important;}
          .Checklogin{display:none!important;}
          .ListAllHideHeader > tbody > tr > td{padding:0!important;}
          label{color:#333;}
          .ml-1{margin-left:5px;}
          .radio{margin:0.5rem;display:inline-block;}
          .row{margin-right:0!important;margin-left:0!important;}
          .red-color{color:#dc3545!important;}
          .green-color{color:#28a745!important;}
          .export-buttons{float:right;}
          .form-group{margin-bottom:15px;}
          @media screen and (-webkit-min-device-pixel-ratio:0){
            input[type="date"].form-control{
              line-height:23px!important;
            }
          }
        `}
      </style>

      <div className="row">
        <div className="col-md-12 main-container">
          <div className="listing-grid">
            <div className="detail-row">
              <h2 className="d-inline-block">Account Statement</h2>
            </div>

            {/* Sport Category, Date Range, and Filter Buttons */}
            <div className="row form-horizontal" style={{ marginBottom: "25px" }}>
              <div className="col-md-2">
                <div className="form-group">
                  <select
                    className="form-control sport"
                    value={sportCategory}
                    onChange={(e) => setSportCategory(e.target.value)}
                  >
                    {Object.entries(sportCategories).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="form-control"
                    placeholder="From Date"
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="form-control"
                    placeholder="To Date"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <button
                    className="btn btn-success"
                    onClick={handleSportListSubmit}
                    style={{ width: "100%" }}
                  >
                    Submit Sport List
                  </button>
                </div>
              </div>
            </div>

            {/* Client and Sport Selection */}
            <div className="row form-horizontal" style={{ marginBottom: "25px" }}>
              <div className="col-md-2">
                <div className="form-group">
                  <select
                    className="form-control select_user_id"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    disabled={loadingClients}
                  >
                    <option value="1">Select Client</option>
                    {clientOptions.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.username}
                      </option>
                    ))}
                  </select>
                  {loadingClients && (
                    <small className="text-muted">Loading clients...</small>
                  )}
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <select
                    className="form-control select_sport_id"
                    value={selectedSportId}
                    onChange={(e) => setSelectedSportId(e.target.value)}
                    disabled={loadingSports}
                  >
                    <option value="">Select Sports</option>
                    {sportOptions.map((sport) => (
                      <option key={sport.id} value={sport.id}>
                        {sport.match_name} - {sport.match_date}
                      </option>
                    ))}
                  </select>
                  {loadingSports && (
                    <small className="text-muted">Loading sports...</small>
                  )}
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    style={{ width: "100%" }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table
                className="table table-bordered data-table"
                id="account_statement_list"
              >
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Type</th>
                    <th>Credit</th>
                    <th>Debit</th>
                    <th>Total</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                      </td>
                    </tr>
                  ) : accountStatementData.length > 0 ? (
                    accountStatementData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.s_no}</td>
                        <td>{item.type}</td>
                        <td style={{ color: "green" }}>
                          {item.credit.toFixed(2)}
                        </td>
                        <td style={{ color: "red" }}>
                          {item.debit.toFixed(2)}
                        </td>
                        <td
                          style={{
                            color: item.total >= 0 ? "green" : "red",
                          }}
                        >
                          {item.total.toFixed(2)}
                        </td>
                        <td>{item.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MatchPL;
