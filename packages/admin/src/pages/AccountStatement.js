import React, { useState, useEffect, useCallback, useMemo } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import LoadingSpinner from "@dxc247/shared/components/ui/LoadingSpinner";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import Pagination from "@dxc247/shared/components/common/Pagination";

// Helper function to extract numeric value from HTML string or plain number
const extractNumericValue = (value) => {
  if (!value && value !== 0) return 0;
  
  // If it's already a number, return it
  if (typeof value === 'number') return value;
  
  // Remove HTML tags and extract number
  const cleanValue = value.toString().replace(/<[^>]*>/g, '').trim();
  const numericValue = parseFloat(cleanValue);
  
  return isNaN(numericValue) ? 0 : numericValue;
};

// Helper function to parse and format date from API format
const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  // Parse date in format "24-10-2025 10:01:38 am"
  const date = new Date(dateString);
  
  // If parsing fails, return original string
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleString();
};

const AccountStatement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [filterType, setFilterType] = useState("0"); // All, Free Chips, Settlement, Game Report
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedUserId, setSelectedUserId] = useState("");
  
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  // ----- derived -----
  const filteredUsers = useMemo(() => {
    if (!userSearchTerm.trim()) return userOptions;
    return userOptions.filter((u) =>
      u.username?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
  }, [userOptions, userSearchTerm]);

  // ----- API: load users -----
  const loadUserDropdown = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await adminApi(`${ADMIN_BASE_PATH}/match-pl-dropdowns`, "GET", {}, true);
      if (res && res.clients) {
        setUserOptions(res.clients || []);
      } else {
        console.error("Failed to load users:", res?.message);
        setUserOptions([]);
      }
    } catch (err) {
      console.error("Error loading users:", err);
      setUserOptions([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // ----- API: load account statement -----
  const loadAccountStatementData = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const params = {
          type: filterType,
          from_date: fromDate,
          to_date: toDate,
          select_user_id: selectedUserId,
          page,
          per_page: entriesPerPage,
        };

        const res = await adminApi(`${ADMIN_BASE_PATH}/admin-account-statement`, "POST", params, true);
        
        if (res && res.data && Array.isArray(res.data)) {
          // Transform the data to match the expected format
          const transformedData = res.data.map(row => ({
            ...row,
            // Extract numeric values from HTML strings
            cr: extractNumericValue(row.credit),
            dr: extractNumericValue(row.debit),
            balance: extractNumericValue(row.balance),
            
          }));
          
          setData(transformedData);
          setCurrentPage(page);
          
          // Calculate total pages and records from DataTables format
          const total = res.recordsFiltered || res.recordsTotal || 0;
          setTotalRecords(total);
          setTotalPages(Math.ceil(total / entriesPerPage) || 1);
        } else {
          console.error("Failed to load account statement data:", res?.message);
          setData([]);
          setCurrentPage(1);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error loading account statement data:", err);
        setData([]);
        setCurrentPage(1);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    },
    [filterType, fromDate, toDate, selectedUserId, entriesPerPage]
  );

  // ----- lifecycle -----
  useEffect(() => {
    loadUserDropdown();
    
  }, [loadUserDropdown]);

  // ----- handlers -----
  const handleUserSearchChange = (e) => {
    setUserSearchTerm(e.target.value);
    setShowUserDropdown(true);
  };

  const handleUserSelect = (user) => {
    setSelectedUserId(user.id);
    setUserSearchTerm(user.username);
    setShowUserDropdown(false);
  };

  const handleUserInputFocus = () => {
    setShowUserDropdown(true);
  };

  const handleUserInputBlur = () => {
    // small delay so click on dropdown can register
    setTimeout(() => setShowUserDropdown(false), 150);
  };

  const clearUserSearch = () => {
    setUserSearchTerm("");
    setSelectedUserId("");
    setShowUserDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadAccountStatementData(1);
  };

  const handleReset = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    setFromDate(d.toISOString().split("T")[0]);
    setToDate(new Date().toISOString().split("T")[0]);
    setFilterType("0");
    clearUserSearch();
    setData([]);
    setCurrentPage(1);
    setTotalPages(1);
    setTotalRecords(0);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    loadAccountStatementData(page);
  };

  const handleEntriesPerPageChange = (e) => {
    const n = parseInt(e.target.value, 10);
    setEntriesPerPage(n);
    setCurrentPage(1);
    // user will click Submit to reload (keeps behavior consistent with original)
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  // Export to Excel/CSV function
  const handleExportExcel = async () => {
    try {
      setLoading(true);
      // Fetch all data without pagination for export
      const params = {
        type: filterType,
        from_date: fromDate,
        to_date: toDate,
        select_user_id: selectedUserId,
        page: 1,
        per_page: 10000, // Large number to get all records
      };

      const res = await adminApi(`${ADMIN_BASE_PATH}/admin-account-statement`, "POST", params, true);
      
      if (res && res.data && Array.isArray(res.data)) {
        const exportData = res.data.map((row, index) => ({
          date: formatDate(row.created_at),
          srNo: index + 1,
          credit: extractNumericValue(row.credit),
          debit: extractNumericValue(row.debit),
          description: row.description ? row.description.replace(/<[^>]*>/g, '').trim() : '',
          balance: extractNumericValue(row.balance),
        }));

        // Create CSV content
        const headers = ['Date', 'Sr No', 'Credit', 'Debit', 'Description', 'Balance'];
        const csvRows = [
          headers.join(','),
          ...exportData.map(row => [
            `"${row.date}"`,
            row.srNo,
            row.credit,
            row.debit,
            `"${row.description.replace(/"/g, '""')}"`, // Escape quotes in description
            row.balance
          ].join(','))
        ];

        const csvContent = csvRows.join('\n');
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        
        // Generate filename with date range
        const selectedUser = userOptions.find(u => u.id === selectedUserId);
        const userPart = selectedUser ? `_${selectedUser.username}` : '';
        const filename = `Account_Statement${userPart}_${fromDate}_to_${toDate}.xls`;
        
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Account statement exported to Excel successfully');
      } else {
        toast.error('No data available to export');
      }
    } catch (err) {
      console.error("Error exporting account statement:", err);
      toast.error('Failed to export account statement');
    } finally {
      setLoading(false);
    }
  };

  // Export to PDF function using jsPDF
  const handleExportPDF = async () => {
    try {
      setLoading(true);
      toast.info('Preparing PDF export...');
      
      // Fetch all data without pagination for export
      const params = {
        type: filterType,
        from_date: fromDate,
        to_date: toDate,
        select_user_id: selectedUserId,
        page: 1,
        per_page: 10000, // Large number to get all records
      };

      const res = await adminApi(`${ADMIN_BASE_PATH}/admin-account-statement`, "POST", params, true);
      
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Dynamically import jsPDF
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
        
        // Get selected user info
        const selectedUser = userOptions.find(u => u.id === selectedUserId);
        const userName = selectedUser ? selectedUser.username : 'All Users';
        
        // Add title
        doc.setFontSize(16);
        doc.text('Account Statement', 14, 15);
        
        // Add user and date range info
        doc.setFontSize(10);
        doc.text(`User: ${userName}`, 14, 25);
        doc.text(`Date Range: ${fromDate} to ${toDate}`, 14, 30);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);
        
        // Prepare table data
        const tableData = res.data.map((row, index) => [
          index + 1,
          formatDate(row.created_at),
          formatCurrency(extractNumericValue(row.credit)),
          formatCurrency(extractNumericValue(row.debit)),
          (row.description || '').replace(/<[^>]*>/g, '').substring(0, 40), // Limit description length
          formatCurrency(extractNumericValue(row.balance))
        ]);
        
        // Add table using autoTable plugin
        try {
          const autoTable = (await import('jspdf-autotable')).default;
          doc.autoTable({
            startY: 40,
            head: [['Sr No', 'Date', 'Credit', 'Debit', 'Description', 'Balance']],
            body: tableData,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [66, 139, 202] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            margin: { top: 40 },
            columnStyles: {
              0: { cellWidth: 20 },
              1: { cellWidth: 40 },
              2: { cellWidth: 30 },
              3: { cellWidth: 30 },
              4: { cellWidth: 60 },
              5: { cellWidth: 30 }
            }
          });
        } catch (autoTableError) {
          // Fallback: Create simple table without autoTable
          let yPos = 40;
          const rowHeight = 8;
          const colWidths = [20, 40, 30, 30, 60, 30];
          const headers = ['Sr No', 'Date', 'Credit', 'Debit', 'Description', 'Balance'];
          
          // Draw header
          doc.setFillColor(66, 139, 202);
          doc.rect(14, yPos, 190, rowHeight, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          let xPos = 14;
          headers.forEach((header, i) => {
            doc.text(header, xPos + 2, yPos + 5);
            xPos += colWidths[i];
          });
          
          // Draw rows
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(8);
          tableData.forEach((row, rowIndex) => {
            yPos += rowHeight;
            if (yPos > 190) { // New page if needed
              doc.addPage();
              yPos = 20;
            }
            
            // Alternate row color
            if (rowIndex % 2 === 0) {
              doc.setFillColor(245, 245, 245);
              doc.rect(14, yPos, 190, rowHeight, 'F');
            }
            
            xPos = 14;
            row.forEach((cell, i) => {
              doc.text(String(cell), xPos + 2, yPos + 5);
              xPos += colWidths[i];
            });
          });
        }
        
        // Generate filename
        const userPart = selectedUser ? `_${selectedUser.username}` : '';
        const filename = `Account_Statement${userPart}_${fromDate}_to_${toDate}.pdf`;
        
        // Save PDF
        doc.save(filename);
        
        toast.success('Account statement exported to PDF successfully');
      } else {
        toast.error('No data available to export');
      }
    } catch (err) {
      console.error("Error exporting to PDF:", err);
      if (err.message && err.message.includes('jspdf')) {
        toast.error('PDF library not found. Please install jspdf and jspdf-autotable packages.');
      } else {
        toast.error('Failed to export to PDF. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @media print {
            .export-buttons,
            .btn,
            button,
            form,
            .pagination,
            .dataTables_info {
              display: none !important;
            }
            
            .table {
              page-break-inside: auto;
            }
            
            .table tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            
            .table thead {
              display: table-header-group;
            }
            
            .table tbody {
              display: table-row-group;
            }
          }
          
          .export-buttons {
            display: flex;
            gap: 10px;
          }
          
          .export-buttons .btn {
            display: flex;
            align-items: center;
            gap: 5px;
          }
        `}
      </style>
    <div className="container-fluid">
      <div className="row">
        <div className="sidebar sidebar-main">
          <nav>
            <h2>Sports</h2>
            <span onClick={() => {/* Handle sidebar close */}}>
              <i className="fa fa-times"></i>
            </span>
            <div className="mtree-main">
              <ul className="mtree transit bubba">
                {/* Sports navigation would go here */}
              </ul>
            </div>
          </nav>
        </div>

        <div className="col-md-12 main-container">
          <div className="listing-grid">
            <div className="detail-row">
              <h2 className="d-inline-block">Account Statement</h2>
              <span className="export-buttons pull-right">
                <button
                  className="btn btn-success mr-2"
                  onClick={handleExportExcel}
                  disabled={loading || data.length === 0}
                  title="Export to Excel"
                >
                  <FontAwesomeIcon icon={faFileExcel} /> Export Excel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleExportPDF}
                  disabled={data.length === 0}
                  title="Export to PDF"
                >
                  <FontAwesomeIcon icon={faFilePdf} /> Export PDF
                </button>
              </span>
            </div>
            
            <div className="">
              <form onSubmit={handleSubmit} className="row g-3 mb-4">
              
                
                <div className="col-md-2">
                  <label className="form-label">From Date</label>
                  <input
                    type="date"
                    name="from_date"
                    id="from_date"
                    value={fromDate}
                    className="form-control"
                    placeholder="From Date"
                    autoComplete="off"
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">To Date</label>
                  <input
                    type="date"
                    name="to_date"
                    id="to_date"
                    value={toDate}
                    className="form-control"
                    placeholder="To Date"
                    autoComplete="off"
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                <div className="col-md-3 position-relative">
                  <label className="form-label">User</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search user..."
                    value={userSearchTerm}
                    onChange={handleUserSearchChange}
                    onFocus={handleUserInputFocus}
                    onBlur={handleUserInputBlur}
                    disabled={loadingUsers}
                  />
                  {loadingUsers && (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="fa-spin position-absolute"
                      style={{ right: 12, top: 36 }}
                    />
                  )}
                  {userSearchTerm && !loadingUsers && (
                    <button
                      type="button"
                      onClick={clearUserSearch}
                      className="btn btn-sm btn-link position-absolute"
                      style={{ right: 12, top: 6, padding: "0 6px", lineHeight: 1 }}
                      title="Clear"
                    >
                      ×
                    </button>
                  )}

                  {showUserDropdown && filteredUsers.length > 0 && (
                    <div
                      className="position-absolute w-100 bg-white border shadow-sm"
                      style={{ zIndex: 1200, maxHeight: 220, overflowY: "auto" }}
                    >
                      {filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => handleUserSelect(u)}
                          className="px-3 py-2"
                          style={{ cursor: "pointer" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          {u.username}
                        </div>
                      ))}
                    </div>
                  )}

                  {showUserDropdown && !filteredUsers.length && userSearchTerm && (
                    <div className="position-absolute w-100 bg-white border p-2 text-muted">No users found</div>
                  )}
                </div>

                <div className="col-md-2 d-flex align-items-end gap-2">
                  <button className="btn btn-success w-100" type="submit" disabled={loading}>
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Submit"}
                  </button>
                  <button type="button" className="btn btn-secondary w-100" onClick={handleReset}>
                    Reset
                  </button>
                </div>
              </form>

              <div className="table-responsive mb-3">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      
                      <th>Date</th>
                      <th>Sr No</th>
                      
                      <th>Credit</th>
                      <th>Debit</th>
                      <th>Description</th>
                      <th>Balance</th>
                      {/* <th>From-To</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                        </td>
                      </tr>
                    ) : data.length > 0 ? (
                      data.map((row, index) => (
                        <tr key={row.id || index}>
                          <td>{formatDate(row.created_at)}</td>
                          <td>{((currentPage - 1) * entriesPerPage) + index + 1}</td>
                          <td>
                            {row.cr > 0 ? (
                              <span className="text-success fw-bold">{formatCurrency(row.cr)}</span>
                            ) : (
                              "0"
                            )}
                          </td>
                          <td>
                            {row.dr > 0 ? (
                              <span className="text-danger fw-bold">{formatCurrency(row.dr)}</span>
                            ) : (
                              "0"
                            )}
                          </td>
                          <td>
                            {row.description ? (
                              <div dangerouslySetInnerHTML={{ __html: row.description }} />
                            ) : (
                              '-'
                            )}
                          </td>
                       
                          <td>
                            <span className={row.balance < 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                              {formatCurrency(row.balance)}
                            </span>
                          </td>
                          
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No account statement data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalRecords > 0 && (
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <div className="dataTables_info">
                    Showing {(currentPage - 1) * entriesPerPage + 1} to{" "}
                    {Math.min(currentPage * entriesPerPage, totalRecords)} of {totalRecords} entries
                  </div>
                  
                  <div className="d-flex align-items-center gap-3">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      maxVisiblePages={5}
                      showPreviousNext={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AccountStatement;
