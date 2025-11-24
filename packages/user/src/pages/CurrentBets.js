import React, { useState, useEffect, useContext } from "react";

import CommonLayout from "@dxc247/shared/components/layouts/CommonLayout";

import { getCurrentToken, secureDatatableFetch } from "@dxc247/shared/utils/Constants";
import $ from "jquery";
import "datatables.net-bs4";
import "../css/mobile/datatable.css";

const CurrentBets = () => {
  const [selectedGtype, setSelectedGtype] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const currentToken = getCurrentToken();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(false);

  // DataTable state
  const [dataTable, setDataTable] = useState(null);
  const [pageLength, setPageLength] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [displayStart, setDisplayStart] = useState(0);
  const [displayEnd, setDisplayEnd] = useState(0);
  const [goToPageInput, setGoToPageInput] = useState("");

  // Summary state
  const [totalBets, setTotalBets] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const handlePageLengthChange = (e) => {
    const newLength = parseInt(e.target.value);
    setPageLength(newLength);
    if (dataTable) {
      dataTable.page.len(newLength).draw();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (dataTable) {
      dataTable.search(value).draw();
    }
  };

  const handleGoToPage = (e) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(goToPageInput);
      if (pageNum >= 1 && pageNum <= totalPages && dataTable) {
        dataTable.page(pageNum - 1).draw();
        setGoToPageInput("");
      }
    }
  };

  const handlePrevPage = () => {
    if (dataTable && currentPage > 1) {
      dataTable.page("previous").draw();
    }
  };

  const handleNextPage = () => {
    if (dataTable && currentPage < totalPages) {
      dataTable.page("next").draw();
    }
  };

  const handleFirstPage = () => {
    if (dataTable) {
      dataTable.page("first").draw();
    }
  };

  const handleLastPage = () => {
    if (dataTable) {
      dataTable.page("last").draw();
    }
  };

  // const showBetDetails = (data) => {
  //   setModalData(data);
  //   setShowModal(true);
  // };

  // const closeModal = () => {
  //   setShowModal(false);
  //   setModalData(null);
  // };

  const initDatatable = () => {
    // Ensure the table element exists first
    const tableElement = $("#current_bets_list");
    if (tableElement.length === 0) {
      console.error("Table element #current_bets_list not found");
      return null;
    }

    // Clear any existing DataTable instance first
    if ($.fn.DataTable.isDataTable("#current_bets_list")) {
      try {
        tableElement.DataTable().destroy();
      } catch (e) {
        console.warn("Error destroying existing DataTable:", e);
      }
    }

    // Only clear tbody, not the entire table (to preserve thead structure)
    tableElement.find("tbody").empty();

    const columns = [];
    
    // Add Sports column at the beginning if selectedGtype is "sports"
    if (selectedGtype && selectedGtype.toLowerCase() === "sports") {
      columns.push({
        data: "game_name",
        name: "game_name",
      });
    }
    
    // Add other columns
    columns.push(
      { data: "bet_type", name: "bet_type" },
      { data: "team_name", name: "team_name" },
      {
        data: "bet_odds",
        name: "bet_odds",
        className: "report-amount text-end",
      },
      { data: "amount", name: "amount", className: "report-amount text-end" },
      { data: "created_at", name: "created_at", className: "report-date" },
      {
        data: null,
        name: "actions",
        className: "report-action",
        orderable: false,
        render: function (data, type, row) {
          return `<div className="text-end">
                        <div className="form-check form-check-inline">
                            <input type="checkbox" className="form-check-input" style="cursor: pointer;" data-id="${
                              row.id || ""
                            }">
                        </div>
                    </div>`;
        },
      }
    );

    // Verify table structure is intact
    if (tableElement.find("thead").length === 0) {
      console.error("Table thead is missing. Cannot initialize DataTable.");
      return null;
    }

    // Verify header structure matches columns before initializing
    const headerThs = tableElement.find("thead th").length;
    if (headerThs !== columns.length) {
      console.error(`Header columns (${headerThs}) don't match DataTable columns (${columns.length}). Cannot initialize.`);
      console.log("Expected columns:", columns.map(c => c.name || c.data));
      console.log("Header structure:", tableElement.find("thead th").map((i, el) => $(el).text()).get());
      return null;
    }

    try {
      const table = tableElement.DataTable({
        pagingType: "full_numbers",
        lengthMenu: [10, 20, 30, 40, 50],
        pageLength: pageLength,
        processing: true,
        serverSide: true,
        orderable: false,
        sortable: false,
        dom: "rt", // Remove default controls, we'll use custom ones
      ajax: async function (dtParams, callback) {
        // Don't trigger API if no report type is selected
        if (!selectedGtype || selectedGtype === "") {
          callback({
            draw: dtParams.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
          return;
        }

        try {
          const decryptedJSON = await secureDatatableFetch(
            "current_bets",
            dtParams,
            {
              gtype: selectedGtype,
              filter: selectedFilter,
            }
          );

          

          // Calculate total bet amount from data
          const calculateTotalBetAmount = (data) => {
            if (!data || !Array.isArray(data)) return 0;
            return data.reduce((total, record) => {
              const betAmount = parseFloat(record.bet_amount || record.amount || 0);
              return total + (isNaN(betAmount) ? 0 : betAmount);
            }, 0);
          };

          const totalBetAmount = calculateTotalBetAmount(decryptedJSON?.data?.data || decryptedJSON?.data);
                   
          // Update your summary
          setTotalBets(decryptedJSON.recordsTotal || 0);
          setTotalAmount(totalBetAmount || decryptedJSON?.totalAmount || 0);
          setTotalRecords(decryptedJSON.recordsTotal || 0);

          // Send data back to DataTable
          callback({
            draw: dtParams.draw,
            recordsTotal: decryptedJSON.recordsTotal,
            recordsFiltered: decryptedJSON.recordsFiltered,
            data: decryptedJSON?.data?.data || decryptedJSON?.data || [],
          });
        } catch (e) {
          console.error("DataTable AJAX error:", e);
          callback({
            draw: dtParams.draw,
            recordsTotal: 0,
            recordsFiltered: 0,
            data: [],
          });
        }
      },
      columns: columns,
      header: "false",
      order: false,
      searchDelay: 500,
      rowCallback: function (row, datas, index) {
        // Add CSS class based on bet_side
        const data = datas?.data || datas;
        const bet_side = data.extra === null ? data.bet_side : data.extra;
        if (bet_side.toLowerCase() === "lay") {
          $(row).addClass("lay");
        } else if (bet_side.toLowerCase() === "back") {
          $(row).addClass("back");
        }
      },
      drawCallback: function (settings) {
        // Update pagination controls after each draw
        const info = this.api().page.info();
        setCurrentPage(info.page + 1);
        setTotalPages(info.pages);
        setDisplayStart(info.start + 1);
        setDisplayEnd(info.end);
      },
      });

      // Store table reference
      setDataTable(table);

      // Add click event for bet details
      $("#current_bets_list tbody").on("click", "td", function (e) {
        if (!$(e.target).is('input[type="checkbox"]')) {
          const data = table.row($(this).parents("tr")).data();
          
        }
      });

      return table;
    } catch (error) {
      console.error("Error initializing DataTable:", error);
      return null;
    }
  };

  useEffect(() => {
    // Only initialize datatable if a report type is selected
    if (selectedGtype && selectedGtype !== "") {
      initDatatable();
    }

    //eslint-disable-next-line
  }, []);

  // Auto-refresh table when gtype or filter change
  useEffect(() => {
    // Only refresh if a report type is selected
    if (!selectedGtype || selectedGtype === "") {
      return;
    }
    
    // Remove existing event listeners
    $("#current_bets_list tbody").off("click", "td");
    
    // Properly destroy existing DataTable instance
    if (dataTable) {
      try {
        dataTable.destroy();
      } catch (e) {
        console.warn("Error destroying DataTable in useEffect:", e);
      }
      setDataTable(null);
    }
    
    // Also check if DataTable exists on the element
    if ($.fn.DataTable.isDataTable("#current_bets_list")) {
      try {
        $("#current_bets_list").DataTable().destroy();
      } catch (e) {
        console.warn("Error destroying DataTable from element in useEffect:", e);
      }
    }
    
    // Clear only tbody, preserve thead structure
    $("#current_bets_list tbody").empty();
    
    // Small delay to ensure React has updated the DOM with new header structure
    setTimeout(() => {
      const table = initDatatable();
      if (table) {
        setDataTable(table);
      }
    }, 100);
    //eslint-disable-next-line
  }, [selectedGtype, selectedFilter]);

  const handleGtypeChange = (e) => {
    const newGtype = e.target.value;
    
    // Remove existing event listeners before destroying the table
    $("#current_bets_list tbody").off("click", "td");
    
    // Properly destroy existing DataTable instance
    if (dataTable) {
      try {
        dataTable.destroy();
      } catch (e) {
        console.warn("Error destroying DataTable:", e);
      }
      setDataTable(null);
    }
    
    // Also check if DataTable exists on the element
    if ($.fn.DataTable.isDataTable("#current_bets_list")) {
      try {
        $("#current_bets_list").DataTable().destroy();
      } catch (e) {
        console.warn("Error destroying DataTable from element:", e);
      }
    }
    
    // Clear only tbody, preserve thead structure
    $("#current_bets_list tbody").empty();
    
    setSelectedGtype(newGtype);

    // Initialize new table with selected gtype only if a type is selected
    if (newGtype && newGtype !== "") {
      // Use setTimeout to ensure React has updated the DOM with new header
      setTimeout(() => {
        const table = initDatatable();
        if (table) {
          setDataTable(table);
        }
      }, 100);
    }
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    
    setSelectedFilter(newFilter);

    // Always reload data when filter changes
    // Remove existing event listeners before destroying the table
    $("#current_bets_list tbody").off("click", "td");
    if (dataTable) {
      dataTable.destroy();
    }

    // Initialize new table with selected filter
    const table = initDatatable();
  };

  const handleSubmit = () => {
    // Only proceed if a gtype is selected
    if (!selectedGtype || selectedGtype === "") {
      alert("Please select a report type first!");
      return;
    }

    // Remove existing event listeners before destroying the table
    $("#current_bets_list tbody").off("click", "td");
    if (dataTable) {
      dataTable.destroy();
    }

    const table = initDatatable();
  };

  return (
    <CommonLayout props={{ className: "report-page" }}>
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Current Bets</h4>
        </div>
        <div className="card-body">
          <div className="report-form">
            <div className="row row10">
              <div className="col-lg-2 col-md-3">
                <div className="mb-4 input-group position-relative">
                  <select
                    className="form-select"
                    name="gtype"
                    value={selectedGtype}
                    onChange={handleGtypeChange}
                  >
                    <option value="" disabled={selectedGtype !== ""}>
                      Select Report Type
                    </option>
                    <option value="sports">Sports</option>
                    <option value="casino">Casino</option>
                  </select>
                </div>
              </div>

              <div className="row row10 mt-2 justify-content-between align-items-center">
                <div className="col-lg-2 col-6">
                  <div className="mb-2 input-group position-relative">
                    <span className="me-2">Show</span>
                    <select
                      className="form-select"
                      value={pageLength}
                      onChange={handlePageLengthChange}
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="40">40</option>
                      <option value="50">50</option>
                    </select>
                    <span className="ms-2">Entries</span>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 text-center">
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="all"
                      name="filter"
                      value="all"
                      checked={selectedFilter === "all"}
                      onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="all">
                      All
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="back"
                      name="filter"
                      value="back"
                      checked={selectedFilter === "back"}
                      onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="back">
                      Back
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="lay"
                      name="filter"
                      value="lay"
                      checked={selectedFilter === "lay"}
                      onChange={handleFilterChange}
                    />
                    <label className="form-check-label" htmlFor="lay">
                      Lay
                    </label>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6 text-center">
                  <div>
                    Total Bets: <span className="me-2">{totalBets}</span>
                    Total Amount: <span className="me-2">{totalAmount}</span>
                  </div>
                </div>

                <div className="col-lg-2 col-6">
                  <div className="mb-2 input-group position-relative">
                    <span className="me-2">Search:</span>
                    <input
                      type="search"
                      className="form-control"
                      placeholder={`${totalRecords} records...`}
                      value={searchValue}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 table-responsive">
                <table
                  role="table"
                  className="table table-bordered table-striped"
                  id="current_bets_list"
                >
                  <thead>
                    <tr role="row">
                      {selectedGtype && selectedGtype.toLowerCase() === "sports" && (
                        <th colSpan="1" role="columnheader">
                          Sports
                        </th>
                      )}
                      <th colSpan="1" role="columnheader">
                        Event Name
                      </th>
                      <th colSpan="1" role="columnheader">
                        Nation
                      </th>
                      <th
                        colSpan="1"
                        role="columnheader"
                        className="report-amount text-end"
                      >
                        User Rate
                      </th>
                      <th
                        colSpan="1"
                        role="columnheader"
                        className="report-amount text-end"
                      >
                        Amount
                      </th>
                      <th
                        colSpan="1"
                        role="columnheader"
                        className="report-date"
                      >
                        Place Date
                      </th>
                      <th
                        colSpan="1"
                        role="columnheader"
                        className="report-action"
                      >
                        <div className="text-end">
                          <div className="form-check form-check-inline">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              title="Toggle All Current Page Rows Selected"
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody role="rowgroup"></tbody>
                </table>
              </div>

              <div className="custom-pagination mt-2">
                <div disabled={currentPage === 1} onClick={handleFirstPage}>
                  First
                </div>
                <div disabled={currentPage === 1} onClick={handlePrevPage}>
                  Previous
                </div>
                <div
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  Next
                </div>
                <div
                  disabled={currentPage === totalPages}
                  onClick={handleLastPage}
                >
                  Last
                </div>
                <div>
                  <span className="me-2">
                    Page{" "}
                    <b>
                      {currentPage} of {totalPages}
                    </b>
                  </span>
                  <span className="me-2">| Go to Page</span>
                  <input
                    className="form-control"
                    type="number"
                    value={goToPageInput}
                    onChange={(e) => setGoToPageInput(e.target.value)}
                    onKeyPress={handleGoToPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for bet details */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Bet Details
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : modalData ? (
                  <div>
                    <p>
                      <strong>Event:</strong> {modalData.event_name}
                    </p>
                    <p>
                      <strong>Nation:</strong> {modalData.nation}
                    </p>
                    <p>
                      <strong>Rate:</strong> {modalData.user_rate}
                    </p>
                    <p>
                      <strong>Amount:</strong> {modalData.amount}
                    </p>
                    <p>
                      <strong>Date:</strong> {modalData.place_date}
                    </p>
                    {/* Add more details as needed */}
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CommonLayout>
  );
};

export default CurrentBets;
