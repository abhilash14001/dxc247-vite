import React, {useEffect, useMemo} from 'react';
import {

    getSize,
    handleShowRules,  useFancyHideStatus
} from "@dxc247/shared/utils/Constants";




const Khado = ({data, sportList,  betPlaceStatus,  teamNames, setMaxValue, setMinValue }) => {
    const fancyHideStatus = useFancyHideStatus( sportList, data);

    // Move hooks before early return
    const mainValue = data?.['khado'];
    const ar_sectionData = mainValue?.section || [];
    const maxValue = useMemo(() => mainValue?.max || sportList.fancy_max_limit, [mainValue, sportList.fancy_max_limit]);
    
    useEffect(() => {
        if (setMaxValue !== null) {
            setMaxValue((prevState) => {
                return {...prevState, 'KHADO': maxValue}
            })
        }

        if (setMinValue !== null) {
            setMinValue((prevState) => {
                return {...prevState, 'KHADO': mainValue?.min ?? sportList.fancy_min_limit}
            })
        }
        //eslint-disable-next-line
    }, [maxValue]);

    // Early return after all hooks
    if (!data || !Array.isArray(data) || data['khado'] === undefined) return null;

    teamNames.current['KHADO'] = [];

    return (
        <div className="game-market market-6">
            <div className="col-12">
                <div className="market-title">
                    <span>Khado</span>
                    <span className="m-r-5 game-rules-icon" onClick={() => handleShowRules('Fancyrule')}>
                        <span>
                            <i className="fa fa-info-circle float-right"></i>
                        </span>
                    </span>
                </div>
                <div className="market-header">
                    <div className="float-left country-name box-6"></div>
                    <div className="box-2 float-left text-center">

                    </div>

                </div>

                <div className="market-body">
                    {ar_sectionData.map((oddsArr, key) => {
                        const teamName = oddsArr.nat.trim();
                                                            teamNames.current['KHADO'].push(teamName);

                        if (fancyHideStatus[oddsArr.sid] || !teamName || teamName.trim() === '') {
                            return null;
                        }


                        let isSuspendedClass = '';
                        let back = 0, lay = 0, backk = '0';
                        oddsArr['back'] = [];
                        oddsArr['lay'] = [];


                        if (oddsArr.odds && oddsArr.odds.length > 0) {
                            let no = 0;

                            oddsArr.odds.forEach(a_value => {
                                const tno = a_value.tno;
                                if (a_value.otype === 'back') {

                                    oddsArr['back'][tno] = a_value;
                                    back = a_value.odds;
                                    backk = a_value.size;
                                } else if (a_value.otype === 'lay') {
                                    oddsArr['lay'][no] =a_value;
                                    lay = a_value.odds;

                                    no++;
                                }
                            });
                        }

                        let totalOdds = parseFloat(back) + parseFloat(lay);
                        if (sportList.match_suspend_fancy === 1 || sportList.match_suspend === 1) {
                            totalOdds = 0;
                        }

                        const gstatus = oddsArr.gstatus ? oddsArr.gstatus.toUpperCase() : '';

                        if (gstatus === 'SUSPENDED' || gstatus === 'BALL_RUNNING' || gstatus === 'MATCH-SUSPENDED') {
                            totalOdds = 0;
                        }

                        if (totalOdds === 0) {
                            isSuspendedClass = 'suspended suspend_box';

                        }

                        const betPlaceCheck = betPlaceStatus?.current?.[teamName];
                        const fancyListValues = Object.values(betPlaceCheck?.fancy_list || []);

                        const min_value = fancyListValues.length > 0 ? Math.min(...fancyListValues) : null;

                        const get_fancy_session_value =  betPlaceCheck?.fancy_list  ? (
                            <span className="span_fancy_session_value color-font-red">{min_value}</span>
                        ) : null;

                        return (
                            <div key={key} className={`row row10`}>
                                <div data-title={gstatus} className={`col-md-12 ${isSuspendedClass}`}>
                                    <div className="float-left country-name box-6" style={{borderBottom: '0 none'}}>
                                        <p className="m-b-0">
                                            {betPlaceCheck?.bet ? (
                                                <span className="link-session">
                                                    {teamName}
                                                </span>
                                            ) : (
                                                <span>{teamName}</span>
                                            )}
                                        </p>
                                        <p className="m-b-0">{get_fancy_session_value}</p>
                                    </div>


                                    <div className="box-1 back float-left text-center">
                                        <span className="odd d-block">{back > 0 ? back : '-'}</span>
                                        <span>{getSize(backk, false)}</span>
                                    </div>
                                    <div className="box-2 float-left text-left min-max"
                                         style={{borderBottom: "0px none"}}>
                                        <span className="d-block">Min: <span>{oddsArr.min}&nbsp;</span></span>
                                        <span className="d-block">Max: <span>{getSize(oddsArr.max, true)}&nbsp;</span></span>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default Khado;