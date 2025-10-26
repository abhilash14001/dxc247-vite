import React, {useContext, useEffect, useState} from "react";
import Header from "@dxc247/shared/components/layouts/Header";
import $ from 'jquery';
import 'datatables.net-bs4';
import '../css/mobile/datatable.css';
import {AuthContext} from "@dxc247/shared/contexts/AuthContext";
import CommonLayout from "@dxc247/shared/components/layouts/CommonLayout";
import axios from 'axios';
import axiosFetch, { getCurrentToken, secureDatatableFetch } from '@dxc247/shared/utils/Constants';
import {Modal, ModalDialog} from "react-bootstrap";
import CasinoGameResultsFinal from '@dxc247/shared/components/casino/CasinoGameResultsFinal';
import SportsResultContent from '@dxc247/shared/components/ui/SportsResultContent';

const AccountStatement = () => {

    const [selectedFilter, setSelectedFilter] = useState("0");
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    });
    const [toDate, setToDate] = useState(() => {
        const date = new Date();
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0');
    });
    const currentToken = getCurrentToken();
    

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Casino result modal state
    const [showCasinoModal, setShowCasinoModal] = useState(false);
    const [casinoResultData, setCasinoResultData] = useState(null);
    const [casinoWinnerData, setCasinoWinnerData] = useState(null);
    const [casinoResultNew, setCasinoResultNew] = useState(null);
    const [casinoRequestData, setCasinoRequestData] = useState(null);
    
    // Sports result modal state - now handled within existing casino modal
    
    // DataTable state
    const [dataTable, setDataTable] = useState(null);
    const [pageLength, setPageLength] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [displayStart, setDisplayStart] = useState(0);
    const [displayEnd, setDisplayEnd] = useState(0);
    const [goToPageInput, setGoToPageInput] = useState(1);




    function simpleFilter() {
        const filter = document.querySelector('input[name="betFilter"]:checked').value;
        const rows = document.querySelectorAll('#sports-bets-table tbody tr');
        
        rows.forEach(row => {
            if (filter === 'all') {
                row.style.display = '';
            } else if (filter === 'back') {
                row.style.display = row.classList.contains('back') ? '' : 'none';
            } else if (filter === 'lay') {
                row.style.display = row.classList.contains('lay') ? '' : 'none';
            }
        });
    }

    function handleCasinoFilter() {
        const filter = document.querySelector('input[name="casinoBetFilter"]:checked').value;
        const rows = document.querySelectorAll('.casino-result-content, .casino-result-desc');
        
        rows.forEach(row => {
            if (filter === 'all') {
                row.style.display = '';
            } else if (filter === 'casino') {
                row.style.display = row.classList.contains('casino') ? '' : 'none';
            } else if (filter === 'sports') {
                row.style.display = row.classList.contains('sports') ? '' : 'none';
            }
        });
    }
    // Function to handle description click and call API
    const handleDescriptionClick = async (description, element) => {
        try {
            setLoading(true);
            setShowModal(true);
            setModalData(null);

            // Check which class is present to determine API endpoint
            let apiEndpoint;
            if (element.classList.contains('sports-bet-clickable')) {
                apiEndpoint = 'casinoresultpopup-account_statement-reports';
            } else if (element.classList.contains('casino-bet-clickable')) {
                apiEndpoint = 'casinoresultpopup-account_statement-reports';
            } else {
                // Default to casino if no specific class is found
                apiEndpoint = 'casinoresultpopup-account_statement-reports';
            }

            const response = await axiosFetch(apiEndpoint, 'GET', null, {}, {
                betIds: description,
            });
            
            // Add event listeners for backend-generated DOM elements after successful API call
            setTimeout(() => {
                // Add click events to all filter radio buttons
                document.querySelectorAll('input[name="betFilter"]').forEach(radio => {
                    radio.removeEventListener('change', simpleFilter);
                    radio.addEventListener('change', simpleFilter);
                });
                
                // Add click events to casino filter radio buttons
                document.querySelectorAll('input[name="casinoBetFilter"]').forEach(radio => {
                    radio.removeEventListener('change', handleCasinoFilter);
                    radio.addEventListener('change', handleCasinoFilter);
                });
            }, 100);
            
            // Parse the response data
            const responseData = response.data;
            
            // Extract data from the backend response structure
            const parsedData = responseData.result || null;
            const winner = responseData.winner_data || null;
            const resultNewData = responseData.resultNew || null;
            const requestDataFromBackend = responseData.requestData || null;
            const allBets = responseData.all_bets || null;
            
            // Ensure requestData includes all_bets
            const requestDataWithBets = {
                ...requestDataFromBackend,
                all_bets: allBets
            };
            
            // Set modal data (handles both casino and sports)
            setCasinoResultData(parsedData);
            setCasinoWinnerData(winner);
            setCasinoResultNew(resultNewData);
            setCasinoRequestData(requestDataWithBets);
            
            // Close regular modal and open casino modal
            setShowModal(false);
            setShowCasinoModal(true);
            setLoading(false);
            
        } catch (error) {
            console.error('API call failed:', error);
            setModalData({ error: 'Failed to fetch data. Please try again.' });
            setLoading(false);
        }
    };

    // Function to close modal
    const closeModal = () => {
        setShowModal(false);
        setModalData(null);
        setLoading(false);
    };
    
    // Function to close casino modal
    const closeCasinoModal = () => {
        setShowCasinoModal(false);
        setCasinoResultData(null);
        setCasinoWinnerData(null);
        setCasinoResultNew(null);
        setCasinoRequestData(null);
        setLoading(false);
    };
    
    // Sports modal is now handled within the existing casino modal

    

    const initDatatable = () => {
        const columns = [
            {data: 'created_at', name: 'created_at'},
            {data: 'DT_RowIndex', name: 'DT_RowIndex'},
            {
                data: 'credit', 
                name: 'credit',
                render: function(data, type, row) {
                    if (type === 'display' && data && data !== '0' && data !== '0.00') {
                        return `<span class="text-success">${data}</span>`;
                    }
                    return data;
                }
            },
            {
                data: 'debit', 
                name: 'debit',
                render: function(data, type, row) {
                    if (type === 'display' && data && data !== '0' && data !== '0.00') {
                        return `<span class="text-danger">${data}</span>`;
                    }
                    return data;
                }
            },
            {data: 'balance', name: 'balance'},
            {
                data: 'description', 
                name: 'description',
            },

        ];
        const data =
            {
                'from_date': fromDate,
                'to_date': toDate,
                'type': selectedFilter,
            }
        
        
        
        const table = $('#account_statement_list').DataTable({
            pagingType: 'full_numbers',
            lengthMenu: [10, 20, 30, 40, 50],
            pageLength: 10,
            processing: true,
            serverSide: true,
            orderable: false,
            sortable: false,
            dom: 'rt', // Remove default controls, we'll use custom ones
            ajax: async function (dtParams, callback) {
                try {
                    const decryptedJSON = await secureDatatableFetch(
                        "account_statement",
                        dtParams,
                        data
                    );

                    // Send data back to DataTable
                    callback({
                        draw: dtParams.draw,
                        recordsTotal: decryptedJSON.recordsTotal,
                        recordsFiltered: decryptedJSON.recordsFiltered,
                        data: decryptedJSON?.data || [],
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
            header: 'false',
            order: false,
            searchDelay: 500,
            "columnDefs": [{
                "targets": 'no-sort',
                "orderable": false
            }],
            "drawCallback": function(settings) {
                const api = this.api();
                const pageInfo = api.page.info();
                
                setCurrentPage(pageInfo.page + 1);
                setTotalPages(pageInfo.pages);
                setTotalRecords(pageInfo.recordsTotal);
                setDisplayStart(pageInfo.start + 1);
                setDisplayEnd(pageInfo.end);
                setGoToPageInput(pageInfo.page + 1);
            }
        });

        // Add click event listener for description column
        $('#account_statement_list tbody').off('click', '.description-clickable').on('click', '.description-clickable', function() {
            const description = $(this).data('description');
            const element = this;
            
            handleDescriptionClick(description, element);
        });

        setDataTable(table);
        return table;
    }
    
    // Handle page length change
    const handlePageLengthChange = (e) => {
        const newLength = parseInt(e.target.value);
        setPageLength(newLength);
        if (dataTable) {
            dataTable.page.len(newLength).draw();
        }
    };
    
    // Handle search
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (dataTable) {
            dataTable.search(value).draw();
        }
    };
    
    // Pagination functions
    const goToFirstPage = () => {
        if (dataTable && currentPage > 1) {
            dataTable.page('first').draw('page');
        }
    };
    
    const goToPreviousPage = () => {
        if (dataTable && currentPage > 1) {
            dataTable.page('previous').draw('page');
        }
    };
    
    const goToNextPage = () => {
        if (dataTable && currentPage < totalPages) {
            dataTable.page('next').draw('page');
        }
    };
    
    const goToLastPage = () => {
        if (dataTable && currentPage < totalPages) {
            dataTable.page('last').draw('page');
        }
    };
    
    const goToPage = (pageNumber) => {
        if (dataTable && pageNumber >= 1 && pageNumber <= totalPages) {
            dataTable.page(pageNumber - 1).draw('page');
        }
    };
    
    // Handle go to page input
    const handleGoToPageInput = (e) => {
        const value = parseInt(e.target.value);
        setGoToPageInput(value);
    };
    
    const handleGoToPageSubmit = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            const pageNumber = parseInt(goToPageInput);
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                goToPage(pageNumber);
            } else {
                // Reset to current page if invalid
                setGoToPageInput(currentPage);
            }
        }
    };
    
    useEffect(() => {
        const table = initDatatable();
        
        //eslint-disable-next-line
    }, []);
    
    // Auto-refresh table when dates or filter change
    useEffect(() => {
        if (dataTable) {
            // Destroy and recreate table with new parameters
            $('#account_statement_list tbody').off('click', '.description-clickable');
            dataTable.destroy();
            const table = initDatatable();
        }
        //eslint-disable-next-line
    }, [fromDate, toDate, selectedFilter]);
    const handleFilterChange = (e) => {
        setSelectedFilter(e.target.value);
    };

    const handleFromDateChange = (e) => {
        
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e) => {
        
        setToDate(e.target.value);
    };

    const handleSubmit = () => {
        // Remove existing event listeners before destroying the table
        $('#account_statement_list tbody').off('click', '.description-clickable');
        if (dataTable) {
            dataTable.destroy();
        }
        
        const table = initDatatable();
    };

    return (

        <>
        <CommonLayout props={{className: 'report-page'}}>


            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Account Statement</h4>
                </div>
                <div className="card-body">
                    <div className="report-form">
                        <form className="row row10" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                            <div className="col-lg-2 col-md-3">
                                <div className="react-datepicker-wrapper">
                                    <div className="react-datepicker__input-container">
                                        <div className="mb-2 custom-datepicker">
                                            <input 
                                                type="date"
                                                name="from_date"
                                                id="from_date"
                                                value={fromDate}
                                                onChange={handleFromDateChange}
                                                className="form-control"
                                                autoComplete="off"
                                            />
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3">
                                <div className="react-datepicker-wrapper">
                                    <div className="react-datepicker__input-container">
                                        <div className="mb-2 custom-datepicker">
                                            <input 
                                                type="date"
                                                name="to_date"
                                                id="to_date"
                                                value={toDate}
                                                onChange={handleToDateChange}
                                                className="form-control"
                                                autoComplete="off"
                                            />
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4">
                                <div className="mb-2 input-group position-relative">
                                    <select 
                                        className="form-select" 
                                        name="type"
                                        value={selectedFilter}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="" disabled>Select Report Type</option>
                                        <option value="0">All Reports</option>
                                        <option value="1">Free Chips</option>
                                        <option value="2">Settlement</option>
                                        <option value="3">Game Reports</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-2 d-grid">
                                <button type="submit" className="btn btn-primary btn-block">
                                    Submit
                                </button>
                            </div>
                        </form>
                        
                        <div className="row row10 mt-2 justify-content-between">
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
                            <div className="col-lg-2 col-6">
                                <div className="mb-2 input-group position-relative">
                                    <span className="me-2">Search:</span>
                                    <input 
                                        type="search" 
                                        className="form-control" 
                                        placeholder="Search records..." 
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-2 table-responsive">
                            <table role="table" id="account_statement_list" className="table table-bordered table-striped">
                                <thead>
                                    <tr role="row">
                                        <th colSpan="1" role="columnheader" className="report-date">Date</th>
                                        <th colSpan="1" role="columnheader" className="report-sr text-end">Sr no</th>
                                        <th colSpan="1" role="columnheader" className="report-amount text-end">Credit</th>
                                        <th colSpan="1" role="columnheader" className="report-amount text-end">Debit</th>
                                        <th colSpan="1" role="columnheader" className="report-amount text-end">Pts</th>
                                        <th colSpan="1" role="columnheader">Remark</th>
                                    </tr>
                                </thead>
                                <tbody role="rowgroup">
                                    {/* Data rows will be rendered here */}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Custom Pagination Controls */}
                        <div className="custom-pagination mt-2">
                            <div 
                                className={currentPage === 1 ? 'disabled' : ''}
                                onClick={currentPage > 1 ? goToFirstPage : undefined}
                                style={{ 
                                    cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
                                    opacity: currentPage === 1 ? 0.5 : 1,
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    marginRight: '5px',
                                    display: 'inline-block',
                                    backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff'
                                }}
                            >
                                First
                            </div>
                            <div 
                                className={currentPage === 1 ? 'disabled' : ''}
                                onClick={currentPage > 1 ? goToPreviousPage : undefined}
                                style={{ 
                                    cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
                                    opacity: currentPage === 1 ? 0.5 : 1,
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    marginRight: '5px',
                                    display: 'inline-block',
                                    backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff'
                                }}
                            >
                                Previous
                            </div>
                            <div 
                                className={currentPage === totalPages ? 'disabled' : ''}
                                onClick={currentPage < totalPages ? goToNextPage : undefined}
                                style={{ 
                                    cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
                                    opacity: currentPage === totalPages ? 0.5 : 1,
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    marginRight: '5px',
                                    display: 'inline-block',
                                    backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff'
                                }}
                            >
                                Next
                            </div>
                            <div 
                                className={currentPage === totalPages ? 'disabled' : ''}
                                onClick={currentPage < totalPages ? goToLastPage : undefined}
                                style={{ 
                                    cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
                                    opacity: currentPage === totalPages ? 0.5 : 1,
                                    padding: '8px 12px',
                                    border: '1px solid #ddd',
                                    marginRight: '15px',
                                    display: 'inline-block',
                                    backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff'
                                }}
                            >
                                Last
                            </div>
                            <div style={{ display: 'inline-block' }}>
                                <span className="me-2">
                                    Page <b>{currentPage} of {totalPages}</b>
                                </span>
                                <span className="me-2">| Go to Page</span>
                                <input 
                                    className="form-control" 
                                    type="number" 
                                    value={goToPageInput}
                                    onChange={handleGoToPageInput}
                                    onKeyPress={handleGoToPageSubmit}
                                    onBlur={handleGoToPageSubmit}
                                    min="1"
                                    max={totalPages}
                                    style={{ 
                                        width: '80px', 
                                        display: 'inline-block',
                                        marginLeft: '5px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for displaying API response */}
           

        </CommonLayout>

        {/* Casino Result Modal */}
        {showCasinoModal && (
            <Modal show={showCasinoModal} onHide={closeCasinoModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Result</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading data...</p>
                        </div>
                    ) : (
                        <>
                            {casinoResultData?.match_id === 'sports' ? (
                                <SportsResultContent
                                    resultData={casinoResultData}
                                    requestData={casinoRequestData}
                                    allBets={casinoRequestData?.all_bets || []}
                                />
                            ) : (
                                <CasinoGameResultsFinal 
                                    requestData={casinoRequestData}
                                    result={casinoResultData}
                                    resultNew={casinoResultNew}
                                    winner_data={casinoWinnerData}
                                />
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={closeCasinoModal}>
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        )}

        {/* Sports results are now handled within the existing casino modal */}

         {showModal && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} 
                     onClick={closeModal}>
                    <div className="modal-dialog modal-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Account Statement Details</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {loading ? (
                                    <div className="text-center p-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading data...</p>
                                    </div>
                                                                ) : modalData ? (
                                    modalData.error ? (
                                        <div className="alert alert-danger" role="alert">
                                            {modalData.error}
                                        </div>
                                    ) : (
                                        <div className="casino-result-modal"
                                            dangerouslySetInnerHTML={{ __html: modalData }} 
                                            
                                        />
                                    )
                                ) : null}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AccountStatement;
