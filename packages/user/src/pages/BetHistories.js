import React, {useContext, useEffect, useRef, useState} from 'react';
import {AuthContext} from "@dxc247/shared/contexts/AuthContext";
import CommonLayout from "@dxc247/shared/components/layouts/CommonLayout";
import $ from 'jquery';
import 'datatables.net-bs4';
import '../css/mobile/datatable.css';
import axios from 'axios';
import { getCurrentToken, secureDatatableFetch } from '@dxc247/shared/utils/Constants';

const BetHistories = () => {
    const [selectedGtype, setSelectedGtype] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const selectedFilterRef = useRef('all');
    const [totalBets, setTotalBets] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const currentToken = getCurrentToken();

    const [dataTable, setDataTable] = useState(null);
    const [pageLength, setPageLength] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [displayStart, setDisplayStart] = useState(0);
    const [displayEnd, setDisplayEnd] = useState(0);
    const [goToPageInput, setGoToPageInput] = useState(1);

    const initDatatable = () => {
        const betSideFromType = selectedGtype === '1' ? 'SPORTS' : selectedGtype === '2' ? 'CASINO' : '';
        const columns = [
            {data: 'sport_name', name: 'sport_name'},
            {data: 'team_name', name: 'team_name'},
            {data: 'bet_odds', name: 'bet_odds'},
            {data: 'bet_amount', name: 'bet_amount'},
            {data: 'created_at', name: 'created_at'},
            {
                data: null,
                name: 'actions',
                orderable: false,
                render: function(data, type, row) {
                    return `<div class="text-end"><div class="form-check form-check-inline"><input type="checkbox" class="form-check-input" style="cursor: pointer;" data-id="${row.id || ''}"></div></div>`;
                }
            }
        ];

        const ajaxExtras = () => {
            const sel = selectedFilterRef.current || 'all';
            return ({
                bet_side: betSideFromType,
                filter: sel,
                bet_filter: sel === 'all' ? '' : String(sel).toUpperCase(),
            });
        };

        const table = $('#bet_history_list').DataTable({
            pagingType: 'full_numbers',
            lengthMenu: [10, 20, 30, 40, 50],
            pageLength: pageLength,
            processing: true,
            serverSide: true,
            orderable: false,
            sortable: false,
            dom: 'rt',
            language: {
                emptyTable: '',
                zeroRecords: ''
            },
            ajax: async function (dtParams, callback) {
                try {
                    const extraParams = ajaxExtras();
                    const decryptedJSON = await secureDatatableFetch(
                        "reports/bet-history-data",
                        dtParams,
                        extraParams
                    );

                    // Update summary data
                    const data = decryptedJSON?.data || [];
                    const recordsTotal = decryptedJSON.recordsTotal || data.length || 0;
                    setTotalRecords(recordsTotal);
                    setTotalBets(recordsTotal);
                    const computedTotalAmount = Array.isArray(data) ? data.reduce((acc, r) => acc + (parseFloat(r.bet_amount || r.amount || 0) || 0), 0) : 0;
                    setTotalAmount(decryptedJSON.totalAmount || computedTotalAmount);

                    // Send data back to DataTable
                    callback({
                        draw: dtParams.draw,
                        recordsTotal: decryptedJSON.recordsTotal,
                        recordsFiltered: decryptedJSON.recordsFiltered,
                        data: data,
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
            ordering: false,
            searchDelay: 500,
            drawCallback: function(settings) {
                const api = this.api();
                const info = api.page.info();
                setCurrentPage(info.page + 1);
                setDisplayStart(info.start + 1);
                setDisplayEnd(info.end);
                setGoToPageInput(info.page + 1);
                try {
                    $(api.table().body()).find('td.dt-empty, td.dataTables_empty').closest('tr').remove();
                } catch (e) {}
            },
            rowCallback: function(row, data) {
                try {
                    const side = String(data?.bet_side || '').toUpperCase();
                    $(row).removeClass('lay back');
                    if (side === 'LAY' || side === 'NO') {
                        $(row).addClass('lay');
                    } else {
                        $(row).addClass('back');
                    }
                } catch (e) {}
            }
        });

        setDataTable(table);
        return table;
    };

    

    // Keep page length in sync with DataTable when changed
    useEffect(() => {
        if (dataTable) {
            try {
                dataTable.page.len(pageLength).draw('page');
            } catch (e) {}
        }
        //eslint-disable-next-line
    }, [pageLength]);

    const handleSubmit = () => {
        if (dataTable) {
            dataTable.destroy();
        }
        const table = initDatatable();
    };

    const handleFilterChange = (filterValue) => {
        selectedFilterRef.current = filterValue;
        if (dataTable) {
            dataTable.ajax.reload(null, true);
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalRecords / pageLength));
    const handleFirstPage = () => { if (dataTable && currentPage > 1) dataTable.page('first').draw('page'); };
    const handlePrevPage = () => { if (dataTable && currentPage > 1) dataTable.page('previous').draw('page'); };
    const handleNextPage = () => { if (dataTable && currentPage < totalPages) dataTable.page('next').draw('page'); };
    const handleLastPage = () => { if (dataTable && currentPage < totalPages) dataTable.page('last').draw('page'); };
    const onGoToChange = (e) => { setGoToPageInput(e.target.value); };
    const onGoToSubmit = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            const pageNum = parseInt(goToPageInput);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages && dataTable) {
                dataTable.page(pageNum - 1).draw('page');
            } else {
                setGoToPageInput(currentPage);
            }
        }
    };

    return (
        <CommonLayout props={{className: 'report-page'}}>

                <div className="card">
                    <div className="card-header"><h4 className="card-title">Bet History</h4></div>
                    <div className="card-body">
                        <div className="report-form">
                            <form className="row row10" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                <div className="col-lg-2 col-md-3">
                                    <div className="mb-4 input-group position-relative">
                                        <select className="form-select" name="gtype" value={selectedGtype} onChange={(e)=>{
                                            setSelectedGtype(e.target.value);
                                         
                                        }}>
                                            <option value="" disabled>Select Report Type</option>
                                            <option value="1">Sports</option>
                                            <option value="2">Casino</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-2 d-grid">
                                    <button type="submit" className="btn btn-primary btn-block">Submit</button>
                                </div>
                            </form>
                            <div className="row row10 mt-2 justify-content-between align-items-center">
                                <div className="col-lg-2 col-6">
                                    <div className="mb-2 input-group position-relative">
                                        <span className="me-2">Show</span>
                                        <select className="form-select" value={pageLength} onChange={(e)=>{setPageLength(parseInt(e.target.value)); setCurrentPage(1);}}>
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
                                        <input type="radio" className="form-check-input" id="all" name="filter" value="all" defaultChecked onChange={(e)=> handleFilterChange(e.target.value)} />
                                        <label className="form-check-label" htmlFor="all">All</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input type="radio" className="form-check-input" id="back" name="filter" value="back" onChange={(e)=> handleFilterChange(e.target.value)} />
                                        <label className="form-check-label" htmlFor="back">Back</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input type="radio" className="form-check-input" id="lay" name="filter" value="lay" onChange={(e)=> handleFilterChange(e.target.value)} />
                                        <label className="form-check-label" htmlFor="lay">Lay</label>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 text-center">
                                    <div>Tot
                                        al Bets: <span className="me-2">{totalBets}</span> Total Amount: <span className="me-2">{totalAmount}</span></div>
                                </div>
                                <div className="col-lg-2 col-6">
                                    <div className="mb-2 input-group position-relative">
                                        <span className="me-2">Search:</span>
                                        <input 
                                            type="search" 
                                            className="form-control" 
                                            placeholder="Search records..." 
                                            value={searchValue} 
                                            onChange={(e)=>{
                                                setSearchValue(e.target.value);
                                                if (dataTable) { dataTable.search(e.target.value).draw(); }
                                            }} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2 table-responsive">
                                <table role="table" id="bet_history_list" className="table table-bordered table-striped">
                                    <thead>
                                        <tr role="row">
                                            <th colSpan="1" role="columnheader">Event Name</th>
                                            <th colSpan="1" role="columnheader">Nation</th>
                                            <th colSpan="1" role="columnheader" className="report-amount text-end">User Rate</th>
                                            <th colSpan="1" role="columnheader" className="report-amount text-end">Amount</th>
                                            <th colSpan="1" role="columnheader" className="report-date">Place Date</th>
                                            <th colSpan="1" role="columnheader" className="report-action">
                                                <div className="text-end">
                                                    <div className="form-check form-check-inline">
                                                        <input type="checkbox" className="form-check-input" title="Toggle All Current Page Rows Selected" style={{cursor: 'pointer'}} />
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody role="rowgroup"></tbody>
                                </table>
                            </div>
                            
                            <div className="custom-pagination mt-2">
                                <div 
                                    className={currentPage === 1 ? 'disabled' : ''}
                                    onClick={currentPage > 1 ? handleFirstPage : undefined}
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
                                    onClick={currentPage > 1 ? handlePrevPage : undefined}
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
                                    className={currentPage >= Math.max(1, Math.ceil(totalRecords / pageLength)) ? 'disabled' : ''}
                                    onClick={currentPage < Math.max(1, Math.ceil(totalRecords / pageLength)) ? handleNextPage : undefined}
                                    style={{ 
                                        cursor: currentPage < Math.max(1, Math.ceil(totalRecords / pageLength)) ? 'pointer' : 'not-allowed',
                                        opacity: currentPage >= Math.max(1, Math.ceil(totalRecords / pageLength)) ? 0.5 : 1,
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        marginRight: '5px',
                                        display: 'inline-block',
                                        backgroundColor: currentPage >= Math.max(1, Math.ceil(totalRecords / pageLength)) ? '#f5f5f5' : '#fff'
                                    }}
                                >
                                    Next
                                </div>
                                <div 
                                    className={currentPage >= Math.max(1, Math.ceil(totalRecords / pageLength)) ? 'disabled' : ''}
                                    onClick={currentPage < Math.max(1, Math.ceil(totalRecords / pageLength)) ? handleLastPage : undefined}
                                    style={{ 
                                        cursor: currentPage < Math.max(1, Math.ceil(totalRecords / pageLength)) ? 'pointer' : 'not-allowed',
                                        opacity: currentPage >= Math.max(1, Math.ceil(totalRecords / pageLength)) ? 0.5 : 1,
                                        padding: '8px 12px',
                                        border: '1px solid #ddd',
                                        marginRight: '15px',
                                        display: 'inline-block',
                                        backgroundColor: currentPage >= Math.max(1, Math.ceil(totalRecords / pageLength)) ? '#f5f5f5' : '#fff'
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
                                        onChange={onGoToChange}
                                        onKeyPress={onGoToSubmit}
                                        onBlur={onGoToSubmit}
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

        </CommonLayout>
    );
};

export default BetHistories;
