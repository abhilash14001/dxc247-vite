import Vaaa from "../../casino-games/Virtual/Vaaa";
import { useParams } from "react-router-dom";
import Teen32 from "../../casino-games/Teen32";
import Teen41 from "../../casino-games/Teen41";
import Race20 from "../../casino-games/Race20";
import Superover from "../../casino-games/Superover";
import Goal from "../../casino-games/Goal";
import Queen from "../../casino-games/Queen";
import Cricketv3 from "../../casino-games/Cricketv3";
import Abj from "../../casino-games/Abj";
import Dt202 from "../../casino-games/Dt202";
import Baccarat2 from "../../casino-games/Baccarat2";
import BallbyBall from "../../casino-games/BallbyBall";
import Baccarat from "../../casino-games/Baccarat";
import Lucky7eu from "../../casino-games/Lucky7eu";
import Cmatch20 from "../../casino-games/Cmatch20";
import Cmeter from "../../casino-games/Cmeter";
import War from "../../casino-games/War";
import Dtl20 from "../../casino-games/Dtl20";
import Teen9 from "../../casino-games/Teen9";
import Teen8 from "../../casino-games/Teen8";
import Teen from "../../casino-games/Teen";
import Teen20 from "../../casino-games/Teen20";
import Poker6 from "../../casino-games/Poker6";
import Poker from "../../casino-games/Poker";
import Poker20 from "../../casino-games/Poker20";
import Ab20 from "../../casino-games/Ab20";
import Worli from "../../casino-games/Worli";
import Worli2 from "../../casino-games/Worli2";
import ThreecardJ from "../../casino-games/ThreecardJ";
import Card32 from "../../casino-games/Card32";
import Card32eu from "../../casino-games/Card32eu";
import Aaa from "../../casino-games/Aaa";
import Btable from "../../casino-games/Btable";
import Dt6 from "../../casino-games/Dt6";
import Lucky7 from "../../casino-games/Lucky7";
import Testlottery from "../../casino-games/Testlottery";
import Cmeter1 from "../../casino-games/Cmeter1";
import Dum10 from "../../casino-games/Dum10";
import Teen3 from "../../casino-games/Teen3";
import Race2 from "../../casino-games/Race2";
import Aaa2 from "../../casino-games/Aaa2";
import Ab3 from "../../casino-games/Ab3";
import Ab4 from "../../casino-games/Ab4";
import Teen1 from "../../casino-games/Teen1";
import Teen120 from "../../casino-games/Teen120";
import Kbc from "../../casino-games/Kbc";
import Notenum from "../../casino-games/Notenum";
import Trio from "../../casino-games/Trio";
import Teen20b from "../../casino-games/Teen20b";
import Teenmuf from "../../casino-games/Teenmuf";
import Race17 from "../../casino-games/Race17";
import Teensin from "../../casino-games/Teensin";
import Patti2 from "../../casino-games/Patti2";
import Trap from "../../casino-games/Trap";
import Teen6 from "../../casino-games/Teen6";
import Lucky7eu2 from "../../casino-games/Lucky7eu2";
import Vlucky7 from "../../casino-games/Virtual/Vlucky7";
import Vtrio from "../../casino-games/Virtual/Vtrio";
import Vdtl20 from "../../casino-games/Virtual/Vdtl20";
import Vteenmuf from "../../casino-games/Virtual/Vteenmuf";
import Vbtable from "../../casino-games/Virtual/Vbtable";
import Vdt6 from "../../casino-games/Virtual/Vdt6";
import Vteen from "../../casino-games/Virtual/Vteen";
import Vteen20 from "../../casino-games/Virtual/Vteen20";
import Dt201 from "../../casino-games/Dt201";
import Superover3 from "../../casino-games/Superover3";
import Teen33 from "../../casino-games/Teen33";
import Lucky5 from "../../casino-games/Lucky5";
import Mogambo from "../../casino-games/Mogambo";
import Lucky15 from "../../casino-games/Lucky15";
import Superover2 from "../../casino-games/Superover2";
import Teen42 from "../../casino-games/Teen42";
import Poison from "../../casino-games/Poison";
import Joker20 from "../../casino-games/Joker20";
import TeenJoker from "../../casino-games/TeenJoker";
import TeenUnique from "../../casino-games/TeenUnique";
import Joker120 from "../../casino-games/Joker120";
import Joker1 from "../../casino-games/Joker1";
import Roulette12 from "../../casino-games/Roulette12";
import Lottcard from "../../casino-games/Lottcard";
import Sicbo from "../../casino-games/Sicbo";
import { AdminProvider } from "../../contexts/AdminContext";

const CasinoMain = ({ isAdmin = false }) => {
  const { match_id } = useParams(); // Get gamename from the URL

  // Function to render different layouts based on the game name
  const renderLayout = (gamename) => {
    switch (gamename.toLowerCase()) {
      case "superover":
        return <Superover />;
      case "goal":
        return <Goal />;
      case "roulette12":
      case "roulette13":
      case "roulette11":
      case "ourroullete":
        return <Roulette12 />;
      case "superover2":
        return <Superover2 />;

      case "superover3":
        return <Superover3 />;
      case "race20":
        return <Race20 />;
      case "queen":
        return <Queen />;
      case "cricketv3":
        return <Cricketv3 />;
      case "abj":
        return <Abj />;
      case "dt202":
        return <Dt202 />;
      case "baccarat2":
        return <Baccarat2 />;
      case "baccarat":
        return <Baccarat />;
      case "ballbyball":
        return <BallbyBall />;
      case "lucky7eu":
        return <Lucky7eu />;
      case "cmatch20":
        return <Cmatch20 />;
      case "cmeter":
        return <Cmeter />;
      case "war":
        return <War />;
      case "dtl20":
        return <Dtl20 />;
      case "teen9":
        return <Teen9 />;
      case "teen8":
        return <Teen8 />;
      case "teen":
        return <Teen />;

      case "poison":
      case "poison20":
        return <Poison />;
      case "teenjoker":
        return <TeenJoker />;
      case "teen20":
        return <Teen20 />;
      case "poker6":
        return <Poker6 />;
      case "joker20":
        return <Joker20 />;
      case "poker":
        return <Poker />;
      case "joker120":
        return <Joker120 />;
      case "joker1":
        return <Joker1 />;
      case "poker20":
        return <Poker20 />;
      case "ab20":
        return <Ab20 />;
      case "worli":
        return <Worli />;
      case "worli2":
        return <Worli2 />;
      case "3cardj":
        return <ThreecardJ />;
      case "card32":
        return <Card32 />;
      case "card32eu":
        return <Card32eu />;
      case "aaa":
        return <Aaa />;
      case "btable":
      case "btable2":
        return <Btable />;
      case "dt20":
        return <Dt201 />;
      case "dt6":
        return <Dt6 />;
      case "test_lottery":
        return <Testlottery />;
      case "lucky7":
        return <Lucky7 />;
      case "cmeter1":
        return <Cmeter1 />;
      case "dum10":
        return <Dum10 />;
      case "teen3":
        return <Teen3 />;
      case "race2":
        return <Race2 />;
      case "aaa2":
        return <Aaa2 />;
      case "ab3":
        return <Ab3 />;
      case "ab4":
        return <Ab4 />;
      case "teen1":
        return <Teen1 />;
      case "teen120":
        return <Teen120 />;
      case "kbc":
        return <Kbc />;
      case "notenum":
        return <Notenum />;
      case "trio":
        return <Trio />;
      case "teenunique":
        return <TeenUnique />;
      case "teen20b":
      case "teen20c":
        return <Teen20b />;
      case "teenmuf":
        return <Teenmuf />;
      case "race17":
        return <Race17 />;
      case "teensin":
        return <Teensin />;
      case "patti2":
        return <Patti2 />;
      case "trap":
        return <Trap />;
      case "teen6":
        return <Teen6 />;
      case "lucky7eu2":
        return <Lucky7eu2 />;
      case "lucky5":
        return <Lucky5 />;
      case "lucky15":
        return <Lucky15 />;
      case "vlucky7":
        return <Vlucky7 />;
      case "vtrio":
        return <Vtrio />;
      case "vdtl20":
        return <Vdtl20 />;
      case "vteenmuf":
        return <Vteenmuf />;
      case "vaaa":
        return <Vaaa />;
      case "vbtable":
        return <Vbtable />;
      case "vdt6":
        return <Vdt6 />;
      case "vteen":
        return <Vteen />;
      case "vteen20":
        return <Vteen20 />;
      case "teen33":
        return <Teen33 />;
      case "teen41":
        return <Teen41 />;
      case "mogambo":
        return <Mogambo />;
      case "teen42":
        return <Teen42 />;
      case "lottcard":
        return <Lottcard />;
      case "sicbo":
      case "sicbo2":
        return <Sicbo />;
      // Default case for "teen32"
      default:
        return <Teen32 />;
    }
  };

  return (
    <AdminProvider isAdmin={isAdmin}>
      <div className="wrapper">{renderLayout(match_id)}</div>
    </AdminProvider>
  );
};

export default CasinoMain;
