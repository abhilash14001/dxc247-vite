import React, { useEffect, useState } from "react";
import axios from "axios";
import TimerComponent from "./CountdownTimerComponent";
import { useParams } from "react-router-dom";

const CasinoVideo = ({
  gamename,
  data,
  showCasinoReconnectModal,
  virtualVideoCards = false,
}) => {
  const [videoUrl, setVideoUrl] = useState("");
  const vimageurl =
    "https://nd.sprintstaticdata.com/v13/static/front/img/virtual-casino/dealer-bg/";
  const virtualCasinos = [
    "vdtl20",
    "vlucky7",
    "vdt20",
    "vteenmuf",
    "vtrio",
    "vaaa",
    "vbtable",
    "vdt6",
    "vteen",
    "vteen20",
  ];

  const { match_id } = useParams();
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
      setVideoUrl("");
    }
  }, [gamename, showCasinoReconnectModal]);

  return (
    <>
      <div className="casino-video" style={{ backgroundColor: "black" }}>
        {virtualCasinos.includes(match_id) ? (
          <div className="video-box-container">
            <div className="casino-video-box">
              <img
                style={{ width: "100%", height: "auto" }}
                src={
                  vimageurl +
                  virtualCasinos.find((item) => item === match_id) +
                  ".png"
                }
                className="vcasinobg"
              />
            </div>
          </div>
        ) : (
          <div className="video-box-container">
            <div className="casino-video-box">
              <iframe
                style={{ width: "100%", height: "200px" }}
                src={videoUrl}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        {!virtualCasinos.includes(match_id) && <TimerComponent data={data} />}

        {typeof virtualVideoCards === "function" && virtualVideoCards()}
      </div>
      {virtualCasinos.includes(match_id) && <TimerComponent data={data} />}
    </>
  );
};

export default CasinoVideo;
