import React, {useEffect, useState } from 'react'
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown'
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import {useParams} from "react-router-dom";

import '../../css/countdown.css';
import { isMobile } from 'react-device-detect';
import CustomCountdownTimer from './CustomCountdownTimer';
import { setGlobalVar } from '../../utils/Constants';
function TimerComponent({ data }) {
    const match_id = useParams().match_id;
    const desktopStyle = { height: "70px", marginRight: "05px"}
    const mobileStyle = { height: "30px", width: "20px", fontSize: "20px", marginRight: "05px", fontWeight: "bold" }

    // Use state to store the stable future timestamp
    const [to, setTo] = useState(Date.now());

    useEffect(() => {
        const t1lt = data?.t1?.lt || 0;
        const lt = data?.lt || 0;
        const maxLt = Math.max(t1lt, lt);
        // Only initialize if maxLt > 0 and timer is not already running
        if (maxLt > 0 && (to === 0 || to < Date.now())) {
            setTo(Date.now() + maxLt * 1000);
        } else if (maxLt === 0 && to !== 0) {
            setTo(0); // Reset timer if no countdown
        }
        setGlobalVar(maxLt);
    }, [data?.lt, data?.t1?.lt]);


    return (
        <>
          {match_id === "roulette12" || "roulette13" || "ourroullete" ? (
            <CustomCountdownTimer data={data} />
          ) : (
            <FlipClockCountdown
              digitBlockStyle={isMobile ? mobileStyle : desktopStyle}
              showSeparators={false}
              showLabels={false}
              className="float-right"
              hideOnComplete={false}
              style={{
                position: "absolute",
                bottom: isMobile ? "20px" : "0px",
                right: "10px",
                zIndex: "1",
              }}
              to={to}
            />
          )}
        </>
      );
      
}

export default TimerComponent