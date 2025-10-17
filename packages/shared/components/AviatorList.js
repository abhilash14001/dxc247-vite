
import React from "react";
import "./AviatorList.css";
import CommonLayout from "./layouts/CommonLayout";
import Notify from "../utils/Notify";

function AviatorList() {

    const casinos = [
        { imageUrl: "https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500000674.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/33060327.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500000203.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/500000397.gif" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/ssg/xgames/jetx.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/ssg/xgames/jetx3.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/ssg/xgames/helicopterx.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/bcslot/creedroomz/141422.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/darwin/darwin/AVIATSR.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/darwin/darwin/CRAE.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/darwin/darwin/CRAESP.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/gemini1/gemini/MultiPlayerAviator.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/slot/Jili/261.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/slot/Jili/224.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/slot/Jili/235.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/slot/TurboGames/TRB-crashx.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/slot/TurboGames/TRB-aero.jpg" },
        { imageUrl: "https://sitethemedata.com/casino_icons/other/ssg/aviator/aviator.jpg" }
    ];

    return (

        <CommonLayout>

            <div className="list-page slot-page">

                <div className="center-container">


                    <div className="tab-content mt-xl-2 mt-1">
                        <div className="casino-list mt-2 mt-lg-0">
                            {casinos.map((casino, index) => (
                                <div className="casino-list-item" key={index} onClick={() => Notify("Sorry for inconvenience! USE Real ID to play all these games.", null, null, 'danger')}>
                                    <div
                                        style={{
                                            backgroundImage: `url("${casino.imageUrl}")`,
                                            backgroundSize: "contain",
                                            backgroundColor: "rgb(0, 0, 0)",
                                            backgroundPosition: "center center",
                                            backgroundRepeat: "no-repeat",
                                            paddingTop: "54%",
                                        }}
                                    >
                                        <div className="fancy-play">
                                            <i className="fas fa-play"></i>
                                            <i className="fas fa-info-circle fancy-info"></i>
                                            
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="slot-iframe">
                        <iframe src="" style={{ width: '100%', border: '0px' }}></iframe>
                    </div>
                </div>
            </div>
        </CommonLayout>

    )
}


export default AviatorList;