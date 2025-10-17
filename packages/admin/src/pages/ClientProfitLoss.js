import React, { useState, useEffect, useCallback } from "react";
import { adminApi } from "../utils/api";
import Pagination from "@dxc247/shared/components/common/Pagination";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function ClientProfitLoss() {
  const [loading, setLoading] = useState(true);
  
  // Calculate dynamic dates
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const getSevenDaysAgo = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return sevenDaysAgo.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const [fromDate, setFromDate] = useState(getSevenDaysAgo());
  const [toDate, setToDate] = useState(getTodayDate());
  const [profitLossData, setProfitLossData] = useState([]);
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

  // Load profit loss data
  const loadProfitLossData = useCallback(
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
          `${ADMIN_BASE_PATH}/client-profit-loss`,
          "POST",
          params
        );

        if (response.success) {
          // Transform the data to match our table structure
          const transformedData = (response.data || []).map((item, index) => ({
            id: item.user_id,
            user_id: item.user_id,
            username: item.username,
            role_name: item.role_name,
            total: item.total_profit_loss,
            is_own: item.user_id === response.current_user_id,
            can_view_details: item.role !== 7, // Only non-demo users can be drilled down
            DT_RowIndex: (page - 1) * entriesPerPage + index + 1,
            parent_id: item.parent_id
          }));
          
          setProfitLossData(transformedData);
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
          setProfitLossData([]);
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
        console.error("Error loading profit loss data:", error);
        setProfitLossData([]);
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

  
  // Load data when filters change (dates, parentID, entriesPerPage)
  useEffect(() => {
    
    let timeoutId = null;
    
      timeoutId = setTimeout(() => {
        setCurrentPage(1);
        
        loadProfitLossData(pagination.current_page, searchTerm);
      }, 500);
      
    return () => clearTimeout(timeoutId);
  }, [fromDate, toDate, entriesPerPage, searchTerm, pagination.current_page]);

  

  
  

  // Pagination handlers
  const handlePageChange = (page) => {
    
    setCurrentPage(page);
    setPagination({
      current_page: page,
      per_page: entriesPerPage,
      total: pagination.total,
      last_page: pagination.last_page,
      from: pagination.from,
      to: pagination.to,
    });
  };

  const handleEntriesPerPageChange = (newEntriesPerPage) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(1);
  };

  // Handle submit button
  const handleSubmit = () => {
    setCurrentPage(1);
    loadProfitLossData(1, searchTerm);
  };

  // Handle parent ID change (for navigation) - onclick functionality
  const handleParentIDChange = async (newParentID, event) => {
    // Prevent double clicks
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    
    
    try {
      setLoading(true);
      const params = {
        CLIENT_PL_USER_ID: newParentID,
        CLIENT_PL_FROM_DATE: fromDate,
        CLIENT_PL_TO_DATE: toDate,
        search: searchTerm,
        page: 1,
        per_page: entriesPerPage,
      };
      
      const response = await adminApi(
        `${ADMIN_BASE_PATH}/client-pl-update-owner-id`,
        "POST",
        params
      );

      if (response.success) {
        // Transform the data to match our table structure
        const transformedData = (response.data || []).map((item, index) => ({
          id: item.user_id,
          user_id: item.user_id,
          username: item.username,
          role_name: item.role_name,
          total: item.total_profit_loss,
          is_own: item.user_id === response.current_user_id,
          can_view_details: item.role !== 7, // Only non-demo users can be drilled down
          DT_RowIndex: index + 1
        }));
        
        setProfitLossData(transformedData);
        setParentID(newParentID);
        setCurrentPage(1);
        setPagination({
          current_page: currentPage,
          per_page: entriesPerPage,
          total: response.recordsTotal || 0,
          last_page: Math.ceil((response.recordsFiltered || 0) / entriesPerPage),
          from: (currentPage - 1) * entriesPerPage + 1,
          to: Math.min(currentPage * entriesPerPage, response.recordsFiltered || 0),
        });
      } else {
        console.error("Failed to load sub-accounts:", response.message);
        setProfitLossData([]);
      }
    } catch (error) {
      console.error("Error loading sub-accounts:", error);
      setProfitLossData([]);
    } finally {
      setLoading(false);
    }
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
          @media screen and (-webkit-min-device-pixel-ratio:0) {
              input[type="date"].form-control, input[type="time"].form-control, input[type="datetime-local"].form-control, input[type="month"].form-control {
                  line-height: 23px !important;
              }
          }
        `}
      </style>
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">Client Profit Loss Reports</h2>
          </div>
            <div className="clearfix"></div>

            <div className="table-responsive data-table">
              <input
                type="text"
                style={{ width: "10%", float: "right" }} 
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
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
                    autoComplete="off"
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
                    autoComplete="off"
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

              <div className="clearfix"></div>
              
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
              
              <table
                id="clientProfitLossTable"
                className="table table-bordered clientListTable"
              >
                             <thead>
                               <tr>
                                 <th>S.No.</th>
                                 <th>User Name</th>
                                 <th>Type</th>
                                 <th>Client PL Total</th>
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
                          <td></td>
                          <td></td>
                        </tr>
                      )}
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                          </td>
                        </tr>
                      ) : profitLossData.length > 0 ? (
                        profitLossData.map((item, index) => {
                          const total = item.total || 0;
                          return (
                            <tr key={item.id || index}>
                              <td>
                                {item.is_own ? 'Own' : (item.DT_RowIndex || index + 1)}
                              </td>
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
                              <td>{item.role_name}</td>
                              <td>
                                <span style={{ 
                                  color: total >= 0 ? 'green' : 'red' 
                                }}>
                                  {total.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No records to show in the given table
                          </td>
                        </tr>
                      )}
                    </tbody>
              </table>
            </div>
              
            {!loading && profitLossData.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div className="dataTables_info">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} entries
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
    </>
  );
}

export default ClientProfitLoss;


