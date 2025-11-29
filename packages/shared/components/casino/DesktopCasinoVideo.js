import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import TimerComponent from "./CountdownTimerComponent";
import { useParams } from "react-router-dom";
import { useIsAdmin } from "../../hooks/useIsAdmin";


const DesktopCasinoVideo = ({ gamename, data, showCasinoReconnectModal, virtualVideoCards = false, ...props }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const vimageurl = 'https://nd.sprintstaticdata.com/v13/static/front/img/virtual-casino/dealer-bg/'
    const virtualCasinos = [
        'vdtl20',
        'vlucky7',
        'vdt20',
        'vteenmuf',
        'vtrio',
        'vaaa',
        'vbtable',
        'vdt6',
        'vteen',
        'vteen20',
    ]

    const  isAdmin = useIsAdmin();
    const { match_id } = useParams()
    useEffect(() => {
        // Function to check if the view is mobile

        // Fetch token and generate video URL

        const fetchVideoUrl = async () => {

            try {
                const url = `${import.meta.env.VITE_CASINO_VIDEO_URL}/${match_id}`;
                setVideoUrl(url);


            } catch (error) {
                console.error("Error fetching token:", error);
            }
        };


        if (showCasinoReconnectModal === false) {


            fetchVideoUrl();
        } else {
            setVideoUrl('');
        }



    }, [gamename, showCasinoReconnectModal]);

    return (
        <>


            
                {virtualCasinos.includes(match_id)
                    ?


                    <div className="casino-video-box">
                        <img style={{ width: '100%', height: 'auto' }}
                            src={vimageurl + virtualCasinos.find(item => item === match_id) + ".png"}
                            className="vcasinobg" />
                    </div>


                    : (

                        <>



                        
                            <div className={props?.videoBox || 'video-box-container'}>
                                <div className={`casino-video-box ${isAdmin ? 'embed-responsive embed-responsive-16by9' : ''}`}>

                                    <iframe
                                        className="embed-responsive-item"
                                        src={videoUrl}
                                        allowFullScreen
                                    ></iframe>

                                    {props?.showGoalPopup && props?.goalResult && (
                                        <div className="cricket20ballpopup">
                                            <img src="/img/balls/soccer-ball.png" alt="Soccer Ball" />
                                            <span>{props.goalResult}</span>
                                        </div>
                                    )}
                

                                </div>
                                {typeof virtualVideoCards === 'function' && virtualVideoCards()}    
                            </div>
                            {props && props.casinoContainer && props.casinoContainer()}
                            

                        

                        </>

                    )}
                {!virtualCasinos.includes(match_id) && (

                    <TimerComponent data={data} />
                )}

           
            {virtualCasinos.includes(match_id) && (


                <TimerComponent data={data} />

            )}


        </>
    );
};

export default DesktopCasinoVideo;