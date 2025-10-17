import React, {useContext, useEffect} from 'react';
import $ from 'jquery';
import {AuthContext} from "../contexts/AuthContext";
import {Modal, Table} from "react-bootstrap";
import {isMobile} from 'react-device-detect';
import { getCurrentToken } from '../utils/Constants';

const CurrentBetModal = ({isOpen, onClose, dialogClass = "modal-95w"}) => {
    const currentToken = getCurrentToken();
    useEffect(() => {
        if (isOpen === true) {
            // Wait for modal to be fully rendered
            setTimeout(() => {
                const tableElement = $('.data-table-expposure');
                
                // Check if table element exists
                if (tableElement.length === 0) {
                    console.error('Table element not found');
                    return;
                }

                // Destroy existing DataTable if it exists
                if ($.fn.DataTable && $.fn.DataTable.isDataTable('.data-table-expposure')) {
                    $('.data-table-expposure').DataTable().destroy();
                }

                // Check if DataTable function is available
                if (!$.fn.DataTable) {
                    console.error('DataTable is not available');
                    return;
                }

                // Initialize new DataTable
                try {
                    $('.data-table-expposure').DataTable({
                        processing: true,
                        serverSide: true,
                        ajax: {
                            url: import.meta.env.VITE_API_URL + "reports/client-list-exposure-popup",
                            type: 'post',
                            headers: {
                                'Authorization': `Bearer ${currentToken}`
                            },
                        },
                        scrollX: isMobile ? true : false,
                        columns: [
                            {data: 'game_name', name: 'game_name'},
                            {data: 'sport_name', name: 'sport_name'},
                            {data: 'team_name', name: 'team_name'},
                            {data: 'bet_side', name: 'bet_side'},
                            {data: 'bet_odds', name: 'bet_odds'},
                            {data: 'bet_amount', name: 'bet_amount'},
                            {data: 'created_at', name: 'created_at'},
                            {data: 'ip_address', name: 'ip_address'},
                        ],
                        rowCallback: function (row, data) {
                            if (data.bet_side === "LAY" || data.bet_side === "No") {
                                $(row).addClass('lay');
                            } else {
                                $(row).addClass('back');
                            }
                        }
                    });
                } catch (error) {
                    console.error('DataTable initialization error:', error);
                }
            }, 300);
        }

        // Cleanup function
        return () => {
            if ($.fn.DataTable && $.fn.DataTable.isDataTable('.data-table-expposure')) {
                $('.data-table-expposure').DataTable().destroy();
            }
        };
    }, [isOpen, currentToken]);

    return (
        <Modal show={isOpen} onHide={() => onClose(false)} dialogClassName={dialogClass} aria-labelledby="example-custom-modal-styling-title">
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Exposure
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="content_popup report-container">
                    <div className="popup_form_row">
                        <div id="betHistoryModalbody" style={{padding: '0px'}}>
                            <div className="table-responsive">
                                <Table bordered responsive className="w-100 ABCD data-table data-table-expposure">
                                    <thead>
                                    <tr>
                                        <th>Event Type</th>
                                        <th>Event Name</th>
                                        <th>Runner Name</th>
                                        <th>Bet Type</th>
                                        <th>User Rate</th>
                                        <th>Amount</th>
                                        <th>Place Date</th>
                                        <th>IP Address</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default CurrentBetModal;
