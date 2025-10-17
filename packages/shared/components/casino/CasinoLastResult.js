
import { useParams } from "react-router-dom";
import axiosFetch from "../../utils/Constants";
import { useEffect, useRef, useState } from "react";
import { Modal, ModalDialog } from "react-bootstrap";
import CasinoGameResultsFinal from "./CasinoGameResultsFinal";
import { Teen32 } from "./LastResults/Teen32";
import { Teen9 } from "./LastResults/Teen9";
import { Teen8 } from "./LastResults/Teen8";
import { Poker6 } from "./LastResults/Poker6";
import { Baccarat } from "./LastResults/Baccarat";
import { Dt20 } from "./LastResults/Dt20";
import { Card32 } from "./LastResults/Card32";
import { Lucky7 } from "./LastResults/Lucky7";
import { Superover } from "./LastResults/Superover";
import { Cricketv3 } from "./LastResults/Cricketv3";
import { Teen120 } from "./LastResults/Teen120";
import { Queen } from "./LastResults/Queen";
import { Teen1 } from "./LastResults/Teen1";
import { Race2 } from "./LastResults/Race2";
import { Dum10 } from "./LastResults/Dum10";
import { Aaa } from "./LastResults/Aaa";
import { Cmatch20 } from "./LastResults/Cmatch20";
import { Btable } from "./LastResults/Btable";
import { Race20 } from "./LastResults/Race20";
import { Race17 } from "./LastResults/Race17";
import { Dtl20 } from "./LastResults/Dtl20";
import { Cmeter1 } from "./LastResults/Cmeter1";
import { Cmeter } from "./LastResults/Cmeter";
import { Superover3 } from "./LastResults/Superover3";
import { Lucky15 } from "./LastResults/Lucky15";
import { Superover2 } from "./LastResults/Superover2";
import { BallbyBall } from "./LastResults/BallbyBall";
import { Lottcard } from "./LastResults/Lottcard";
import { Roulette } from "./LastResults/Roulette";
import { Sicbo } from "./LastResults/Sicbo";
import { Mogambo } from "./LastResults/Mogambo";

export const CasinoLastResult = ({ lastResults, sportList }) => {
  const { match_id } = useParams();
  const [lastResultData, setLastResultData] = useState([]);
  const [currentRoundId, setCurrentRoundId] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [winnerData, setWinnerData] = useState(null);
  const [resultNewData, setResultNewData] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const openPopup = async (key) => {
    // Reset all state to ensure fresh data
    setShow(false);
    setParsedResult(null);
    setWinnerData(null);
    setResultNewData(null);
    setCurrentRoundId(key);

    try {
      let responseData;

      if (!lastResultData[key]) {
        const fdata = { match_id: match_id, roundID: key };
        const response = await axiosFetch("last-result", "post", null, fdata);

        responseData = response.data;
        setLastResultData((prevData) => ({
          ...prevData,
          [key]: responseData,
        }));
      } else {
        responseData = lastResultData[key];
      }

      // Parse the response data for CasinoGameResultsFinal
      // Backend returns: { result: {...}, resultNew: {...}, winner_data: {...}, requestData: {...} }
      let parsedData = null;
      let winner = null;
      let resultNewData = null;
      let requestDataFromBackend = null;

      try {
        // Handle the specific backend response format
        if (typeof responseData === "object" && responseData !== null) {
          // Extract data from the backend response structure
          parsedData = responseData.result || null;
          winner = responseData.winner_data || null;
          resultNewData = responseData.resultNew || null;
          requestDataFromBackend = responseData.requestData || null;

          // If winner_data is not in the expected format, create it
          if (!winner || typeof winner !== "object") {
            winner = {
              winner:
                parsedData?.winner ||
                parsedData?.rdesc ||
                parsedData?.winnat ||
                "",
              match_time:
                parsedData?.mtime ||
                parsedData?.match_time ||
                new Date().toLocaleString(),
              extra_data:
                parsedData?.extra_data ||
                parsedData?.suit ||
                parsedData?.pair ||
                "",
              odd_even: parsedData?.odd_even || parsedData?.oddeven || "",
              consecutive:
                parsedData?.consecutive ||
                parsedData?.joker ||
                parsedData?.color ||
                "",
            };
          }
        }
        // Handle string data (should be JSON string)
        else if (typeof responseData === "string") {
          try {
            // Try to parse as JSON string first
            const jsonData = JSON.parse(responseData);

            // Check if it's the new backend format
            if (jsonData.result || jsonData.winner_data) {
              parsedData = jsonData.result || null;
              winner = jsonData.winner_data || null;
              resultNewData = jsonData.resultNew || null;
              requestDataFromBackend = jsonData.requestData || null;
            } else {
              // Old direct JSON format
              parsedData = jsonData;
              winner = {
                winner:
                  jsonData.winner || jsonData.rdesc || jsonData.winnat || "",
                match_time:
                  jsonData.mtime ||
                  jsonData.match_time ||
                  new Date().toLocaleString(),
                extra_data:
                  jsonData.extra_data || jsonData.suit || jsonData.pair || "",
                odd_even: jsonData.odd_even || jsonData.oddeven || "",
                consecutive:
                  jsonData.consecutive ||
                  jsonData.joker ||
                  jsonData.color ||
                  "",
              };
            }
          } catch (jsonError) {
            // If JSON parsing fails, log error and use fallback

            parsedData = {
              rid: key,
              card: "",
              rdesc: "Invalid data format",
            };

            winner = {
              winner: "Error",
              match_time: new Date().toLocaleString(),
              extra_data: "",
              odd_even: "",
              consecutive: "",
            };
          }
        }
      } catch (e) {
        console.error("Error parsing result data:", e);
        // Fallback to basic structure
        parsedData = { rid: key, card: "", rdesc: "Error loading result" };
        winner = { winner: "Unknown", match_time: new Date().toLocaleString() };
      }

      setParsedResult(parsedData);
      setWinnerData(winner);
      setResultNewData(resultNewData);
      setShow(true);
    } catch (error) {
      console.error("Error fetching result data:", error);
      setShow(true); // Still show modal with fallback
    }
  };

  // Determine what to render based on match_id
  const renderResults = () => {
    switch (match_id) {
      case "teen32":
        return <Teen32 lastResults={lastResults} openPopup={openPopup} />;
      case "teen9":
        return <Teen9 lastResults={lastResults} openPopup={openPopup} />;
      case "teen8":
      case "ab20":
      case "ab3":
      case "ab4":
      case "3cardj":
      case "war":
      case "worli":
      case "worli2":
      case "notenum":
      case "trio":
      case "vtrio":
        return <Teen8 lastResults={lastResults} openPopup={openPopup} />;
      case "poker6":
        return <Poker6 lastResults={lastResults} openPopup={openPopup} />;
      case "baccarat":
      case "baccarat2":
        return <Baccarat lastResults={lastResults} openPopup={openPopup} />;
      case "dt20":
      case "dt202":
      case "dt6":
      case "vdt6":
        return <Dt20 lastResults={lastResults} openPopup={openPopup} />;

      case "dtl20":
      case "vdtl20":
        return <Dtl20 lastResults={lastResults} openPopup={openPopup} />;

      case "card32":
      case "card32eu":
        return <Card32 lastResults={lastResults} openPopup={openPopup} />;
      case "lucky7":
      case "lucky5":
      case "vlucky7":
      case "lucky7eu":
      case "lucky7eu2":
        return <Lucky7 lastResults={lastResults} openPopup={openPopup} />;
      case "superover":
        return <Superover lastResults={lastResults} openPopup={openPopup} />;

      case "superover2":
        return <Superover2 lastResults={lastResults} openPopup={openPopup} />;

      // for R result only
      case "ballbyball":
      case "goal":
      case "joker120":
      case "teenunique":
        return <BallbyBall lastResults={lastResults} openPopup={openPopup} />;

      case "superover3":
        return <Superover3 lastResults={lastResults} openPopup={openPopup} />;

      case "cricketv3":
        return <Cricketv3 lastResults={lastResults} openPopup={openPopup} />;
      case "teen120":
        return <Teen120 lastResults={lastResults} openPopup={openPopup} />;
      case "queen":
        return <Queen lastResults={lastResults} openPopup={openPopup} />;
      case "race2":
        return <Race2 lastResults={lastResults} openPopup={openPopup} />;
      case "teen1":
        return <Teen1 lastResults={lastResults} openPopup={openPopup} />;
      case "dum10":
        return <Dum10 lastResults={lastResults} openPopup={openPopup} />;
      case "aaa":
      case "vaaa":
      case "aaa2":
        return <Aaa lastResults={lastResults} openPopup={openPopup} />;
      case "cmatch20":
        return <Cmatch20 lastResults={lastResults} openPopup={openPopup} />;
      case "btable":
      case "btable2":
      case "vbtable":
        return <Btable lastResults={lastResults} openPopup={openPopup} />;
      case "lucky15":
        return <Lucky15 lastResults={lastResults} openPopup={openPopup} />;
      case "race20":
        return <Race20 lastResults={lastResults} openPopup={openPopup} />;
      case "race17":
        return <Race17 lastResults={lastResults} openPopup={openPopup} />;
      case "cmeter1":
        return <Cmeter1 lastResults={lastResults} openPopup={openPopup} />;
      case "cmeter":
        return <Cmeter lastResults={lastResults} openPopup={openPopup} />;
      case "lottcard":
        return <Lottcard lastResults={lastResults} openPopup={openPopup} />;
      case "roulette12":
      case "roulette11":
      case "roulette13":
      case "ourroullete":
        return <Roulette lastResults={lastResults} openPopup={openPopup} />;
      case "sicbo":
      case "sicbo2":
        return <Sicbo lastResults={lastResults} openPopup={openPopup} />;
      case "mogambo":
        return <Mogambo lastResults={lastResults} openPopup={openPopup} />;
      default:
        return <Teen32 lastResults={lastResults} openPopup={openPopup} />;
    }
  };

  const renderResult = () => {
    // Always use CasinoGameResultsFinal with pure data approach
    if (parsedResult && winnerData && currentRoundId) {
      return (
        <CasinoGameResultsFinal
          requestData={{
            match_id: match_id,
            roundID: currentRoundId,
            all_bets: lastResultData[currentRoundId]?.all_bets || [],
          }}
          result={parsedResult}
          resultNew={resultNewData}
          winner_data={winnerData}
        />
      );
    }

    // No data available - show loading or error state
    return (
      <div className="text-center p-4">
        <p>Loading result data...</p>
      </div>
    );
  };

  return (
    <>
      {renderResults()}

      <Modal show={show} onHide={handleClose} dialogClassName="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>{sportList?.match_name} Result</Modal.Title>
        </Modal.Header>
        <Modal.Body id="casino-result-popup-body">{renderResult()}</Modal.Body>
      </Modal>
    </>
  );
};
