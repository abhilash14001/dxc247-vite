import React, {useContext, useEffect, useState} from 'react';
import {gameNames, getCurrentToken} from "@dxc247/shared/utils/Constants";
import CommonLayout from "@dxc247/shared/components/layouts/CommonLayout";
import $ from 'jquery'
import {AuthContext} from "@dxc247/shared/contexts/AuthContext";
const CasinoResultReport = () => {
    const [sport, setSport] = useState('');
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const columns = [
        {data: 'DT_RowIndex', name: 'DT_RowIndex', orderable: false},
        {data: 'round_id', name: 'round_id', orderable: false},
        {data: 'result', name: 'result', orderable: false},
    ];
    const handleSubmit = (e) => {
        e.preventDefault();

        var data = {
            'to_date': $('#to_date').val(),
            'sport': $('#sport').val(),
            "_token": $('meta[name="csrf-token"]').attr('content')
        };



        $('#casino_game_result_list').DataTable().destroy();

        $('#casino_game_result_list').DataTable({
            pagingType: 'full_numbers',
            lengthMenu: [25,50,75,100],
            pageLength: 25,
            processing: true,
            serverSide: true,

            ajax: {
                url:import.meta.env.VITE_API_URL +"casino-game-result",
                type: 'post',
                data: data,
                async: false,
                headers: {
                    'Authorization': `Bearer ${currentToken}`
                },
            },
            columns: columns,
            header: 'false',


            order: [],
            searchDelay: 500,
            "columnDefs": [{
                "targets": 'no-sort',
                "orderable": false
            }]
        });


    };
    const currentToken = getCurrentToken();


    useEffect(() => {

        var data = {
            'sport': $('#sport').val(),

        };
        $('#casino_game_result_list').DataTable({
            pagingType: 'full_numbers',

            processing: true,
            serverSide: true,

            ajax: {
                url:import.meta.env.VITE_API_URL +"casino-game-result",
                type: 'post',
                data: data,
                async: false,
                headers: {
                    'Authorization': `Bearer ${currentToken}`
                },
            },
            columns: columns,
            header: 'false',


            order: [],
            searchDelay: 500,
            "columnDefs": [{
                "targets": 'no-sort',
                "orderable": false
            }]
        });

    }, []);

    return (
        <CommonLayout>

            <div className="card">
                <div className="card-header">
                    <h4 className="mb-0">Casino Result Reports
                        <span className="export-buttons pull-right"></span>
                    </h4>
                </div>
                <div className="card-body container-fluid container-fluid-5 report-container">
                    <div className="row row5" style={{ padding: '5px' }}>
                        <form onSubmit={handleSubmit} className="row row5 form-horizontal" style={{ marginBottom: '25px', width: '100%' }}>
                            <div className="col-md-3">
                                <select
                                    className="form-control sport"
                                    id="sport"
                                    value={sport}
                                    onChange={(e) => setSport(e.target.value)}
                                >
                                    <option value="">Select Sport</option>
                                    {Object.entries(gameNames).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="date"
                                    name="to_date"
                                    id="to_date"
                                    value={toDate}
                                    className="form-control"
                                    placeholder="Today Date"
                                    onChange={(e) => setToDate(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="col-md-3">
                                <button className="btn btn-success btn-block btn-sm" style={{ width: '100%' }} type="submit">Submit</button>
                            </div>
                        </form>

                        <div className="row row5" style={{ width: '100%', marginTop: '10px', padding: '0px' }}>
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table w-100 table-bordered data-table table-responsive" id="casino_game_result_list">
                                        <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Round ID</th>
                                            <th>Result</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {/* Data rows will be rendered here, implement your data rendering logic */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </CommonLayout>
    );
};


export default CasinoResultReport;