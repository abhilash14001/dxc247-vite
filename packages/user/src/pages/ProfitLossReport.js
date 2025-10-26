import React, {useContext, useEffect, useRef} from 'react';
import $ from 'jquery';
import Header from "@dxc247/shared/components/layouts/Header";
import {AuthContext} from "@dxc247/shared/contexts/AuthContext";
import {gameNames, getCurrentToken, secureDatatableFetch} from "@dxc247/shared/utils/Constants";
import CommonLayout from "@dxc247/shared/components/layouts/CommonLayout";


const ProfileLossReport = () => {
    const currentToken = getCurrentToken();

    const table= useRef('');

    const sportRef = useRef('');
    const eventNameRef = useRef('');
    const fromDateRef = useRef(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const toDateRef = useRef(new Date().toISOString().split('T')[0]);

    const datatable = () => {
        const data = {
            'from_date': fromDateRef.current.value,
            'to_date': toDateRef.current.value,
            'sport': sportRef.current.value,
            'event_name': eventNameRef.current.value,

        };


         table.current = $('#profit_loss_list').DataTable({
            pagingType: 'full_numbers',
            lengthMenu: [25, 50, 75, 100],
            pageLength: 25,
            processing: true,
            serverSide: true,
            ajax: async function (dtParams, callback) {
                try {
                    const decryptedJSON = await secureDatatableFetch(
                        "reports/profit-loss-data",
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
            columns: [
                { data: 'DT_RowIndex', name: 'DT_RowIndex' },
                { data: 'sport_name', name: 'sport_name' },
                { data: 'event_name', name: 'event_name' },
                { data: 'market', name: 'market' },
                { data: 'amountnew', name: 'amountnew' },
                { data: 'created_at', name: 'created_at' },
                { data: 'action', name: 'action' },
            ],
            header: 'false',

            // Additional DataTable settings...
        });
    }

    useEffect(() => {

        datatable();

        return () => {
            table.current.destroy(); // Clean up the DataTable instance on component unmount
        };
    }, []);

    const handleSearch = () => {
        table.current.destroy()
        datatable();
    };

    return (
        <CommonLayout>

            <div className="card">
                <div className="card-header">
                    <h4 className="mb-0">Profile Loss Reports</h4>
                </div>
                <div className="card-body container-fluid report-container">
                    <div className="row" style={{padding: 5}}>
                        <div className="row form-horizontal" style={{marginBottom: 25}}>
                            <div className="col-md-2">
                                <select
                                    className="form-control sport"
                                    id="sport"
                                    ref={sportRef}

                                >
                                    <option value="">All</option>
                                    {Object.entries(gameNames).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <input
                                    type="date"
                                    name="from_date"
                                    id="from_date"
                                    ref={fromDateRef}

                                    className="form-control"
                                    defaultValue={fromDateRef.current} // use defaultValue for initial value
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="date"
                                    name="to_date"
                                    id="to_date"
                                    ref={toDateRef}

                                    className="form-control"
                                    defaultValue={toDateRef.current} // use defaultValue for initial value
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="text"
                                    name="event_name"
                                    id="event_name"
                                    placeholder="Search by Event Name"
                                    className="form-control event_name"
                                    ref={eventNameRef}

                                />
                            </div>
                            <div className="col-md-2">

                                <button
                                    className="btn btn-success"
                                    id="search"
                                    style={{width: '100%'}}
                                    onClick={handleSearch}>
                                    Submit
                                </button>
                            </div>
                        </div>


                    </div>
                    <div className="clearfix"></div>
                    <div className="table-responsive">
                        <table className="table table-bordered data-table" id="profit_loss_list">
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

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

</CommonLayout>
)
};

export default ProfileLossReport;
