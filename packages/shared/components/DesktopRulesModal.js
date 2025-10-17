import React, {useState} from 'react';
import {Modal, Nav, Dropdown} from 'react-bootstrap';

const DesktopRulesModal = ({showModal, handleClose}) => {
    const [activeTab, setActiveTab] = useState('Football Fancy');


    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };




    const contentMapping = {

        'Football Fancy': <FootBallFancy/>,
        'Motor Sport': <MotorSport/>,
        'Mixed Martial Arts': <MixedMartialArts />,
        'Big Bash League': <BigBashLeague />,
        'Lunch Favourite': <LunchFavourite />,
        'Bookmaker': <Bookmakerrule />,
        'Teenpatti': <Teenpatti />,
        'CricketCasino': <CricketCasino />,
        'Politics': <Politics />,
        'Fancy Market 1': <FancyMarket1 />,
        'IPL': <IPL />,
        'Kabaddi': <Kabaddi />,
        'World Cup': <WorldCup />,
        'Binary': <Binary />,
        'Fancy': <Fancyrule />,
        'Match': <Matchrule />,
        'Khado': <Khadorule />,
        'Election': <Electionrule />,
    };



    const renderContent =() => {
        return contentMapping[activeTab]
    }


    return (
        <Modal show={showModal} onHide={handleClose} dialogClassName="modal-xl rules-modal">
            <Modal.Header>
                <div className="modal-title h4">Rules</div>

                <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </Modal.Header>

            <Modal.Body>
                <div className="rules-left-sidebar">
                    <Nav variant="pills" className="flex-column">
                        {[
                            'Football Fancy',
                            'Motor Sport',
                            'Mixed Martial Arts',
                            'Big Bash League',
                            'Lunch Favourite',
                            'Bookmaker',
                            'Teenpatti',
                            'CricketCasino',
                            'Politics',
                            'Fancy Market 1',
                            'IPL',
                            'Kabaddi',
                            'World Cup',
                            'Binary',
                            'Fancy',
                            'Match',
                            'Khado',
                            'Election'
                        ].map((rule, index) => (
                            <Nav.Item key={index}>
                                <Nav.Link
                                    onClick={() => handleTabClick(rule)}
                                    active={activeTab === rule}
                                >
                                    {rule}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>
                <div className="rules-content rules-description">
                    <div className="card">
                        {renderContent()}

                    </div>
                </div>


            </Modal.Body>
        </Modal>
    );
};

const FootBallFancy = () => (

    <div className="generalClass">
        <div className="rules-content-title">Football Fancy</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="text-danger">Tournament Total Goals, Team Total Goals goals.scored in 90 minutes or in extra-time will count.Goals scored in penalty shootouts do not count.</span>
                    </td>
                </tr>
                <tr>
                    <td><span
                        className="text-danger">Tournament Corners - Only corners taken in 90 minutes count.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Tournament Penalties Missed/Converted - Penalties taken in 90 minutes, extra-time and penalty shootouts all count. If a penalty has to be re-taken the previous disallowed penalty(ies) do not count.</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)
const MotorSport = () => (

    <div className="Motor generalClass">
        <div className="rules-content-title">Motor Sport</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr className="norecordsfound">
                    <td className="text-center">No records Found</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
)

const MixedMartialArts = () => (

    <div className="MixedMartialArts generalClass" >
        <div className="rules-content-title">Mixed Martial Arts</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr className="norecordsfound">
                    <td className="text-center">No records Found</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
)

const BigBashLeague = () => (

    <div className="BigBashLeague generalClass" >
        <div className="rules-content-title">Big Bash League</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="">Total match 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Highest innings run - Only first innings is valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Lowest innings run - Only first innings is valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st 6 over run:- Average 46 runs will be given if total 20 overs is not played, This event is valid only for the 1st innings</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 25 fours will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 10 sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average will 12 Wickets be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wides - Average 8 wides will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 14 extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fifties - Average 2 fifties will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Caught out - Average 8 catch out will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Bowled out - Average 2 bowled out will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Highest 6 over run: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest run in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest Fours in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest Sixes in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Total LBW:- Average 1 LBW will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Highest Wickets in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest extras in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest match 1st over run in individual match: Only 1st inning will be considered as valid valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">All events related to bowler are valid only for the league stages, both the innings will be considered as valid. A minimum of 32 overs has to be bowled else the same will be voided. If the mentioned bowler has bowled one legal delivery then it will be considered as 1 over even if the over is not completed</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">All events based on ground are decided based on the initial fixture, in case of any changes in the venue between the series. Then average will be given based on the initial fixture for the number of games reduced, Similarly if any match is added newly to the venue will not be considered</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Average for wickets taken will be given in case match abandoned or over reduced or the player has not bowled single legal delivery before the over got reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Fancy based on all individual teams/players/ground are valid only for league stage</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Management decision will be final</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Bellerive Oval:- Hobart</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 28 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 11 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 330 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Manuka Oval:- Canberra</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 5 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 44 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 24 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 13 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 318 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Bellerive Oval:- Hobart</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Aurora stadium:- Launceston</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 45 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 25 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 320 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">The Gabba:- Brisbane</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 44 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 24 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 9 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 13 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 310 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">QUEENSLAND</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 44 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 24 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 315 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Adelaide Oval</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 27 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 320 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Perth Stadium</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 26 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 12 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 9 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 16 Extras will be given in case match abandoned or over reducedTotal Extras - Average 16 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 340 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Showground Stadium</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 44 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 25 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 9 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 315 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Docklands Stadium</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 25 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 11 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 14 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 320 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Melbourne Ground</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 45 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 26 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 10 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 15 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 330 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Sydney Ground</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over run:- Average 6 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 6 over run:- Average 46 runs will be given if total 20 overs is not played, only 1st innings will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours - Average 26 fours will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes - Average 12 Sixes will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average 12 wickets will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide – Average 8 Wide will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 15 Extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run- Average 335 runs will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Average will be given for player if the mentioned player is not included in the playing 11</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">If the mentioned player is not included in playing 11 for 3 consecutive matches and the mentioned player will be deleted</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Super over will not be included</span></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)


const LunchFavourite = () => (

    <div className="LunchFavourite generalClass" >
        <div className="rules-content-title">Lunch Favourite</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="text-danger">1. The team which is favourite at lunch will be considered as lunch favourite or the team which is favourite after first inning last ball will be considered as lunch favourite in our exchange.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">2. In any circumstances management decision will be final.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">3. In case of tie in T20 or one day in lunch favourite game , all bets will be deleted in our exchange.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">4. In case overs are reduced in a match, the team which favourite at lunch will be considered as lunch favourite.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">4.1 For example :- if match is reduced to 18 over per side in t20 or Oneday then after 18 over the team which is favourite at lunch will be considered as lunch favourite.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">5. In case of weather, 1st innings match overs are reduced and direct target is given to team which will bat in 2nd inning then lunch favourite will be considered after target is given at lunch.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">5.1 For example :- in T20 match rain comes at 14 over and match is interrupted due to rain  and direct target is given to 2nd batting team, then team which is favourite in match odds after target is given in match, will be considered as lunch favourite.</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)


const Bookmakerrule = () => (

    <div className="Bookmakerrule generalClass" >
        <div className="rules-content-title">Bookmaker</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="text-danger">Due to any reason any team will be getting advantage or disadvantage we are not concerned.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at the same time (Punching) and others. Note : only winning bets will be voided.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">We will simply compare both teams 25 overs score higher score team will be declared winner in ODI (25 over comparison)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">We will simply compare both teams 10 overs higher score team will be declared winner in T20 matches (10 over comparison)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Any query about the result or rates should be contacted within 7 days of the specific event, the same will not be considered valid post 7 days from the event.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">If two team ends up with equal points, then result will be given based on the official point table</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Tennis:- Advance fancy market</span></td>
                </tr>
                <tr>
                    <td><span className="">If the second set is not completed all bets regarding this market will be voided</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">If a player retires after completion of second set, then the market will be settled as three sets</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Virtual Cricket</span></td>
                </tr>
                <tr>
                    <td><span className="">At any situation if the video gets interrupted/stopped then the same cannot be continued due to any technical issues bookmaker market will be voided</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)


const Teenpatti = () => (
    <div className="Teenpatti generalClass" >
        <div className="rules-content-title">Teenpatti</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tr className="norecordsfound">
                    <td className="text-center">No records Found</td>
                </tr>
            </table>
        </div>
    </div>
)

const CricketCasino = () => (

    <div className="CricketCasino generalClass" >
        <div className="rules-content-title">CricketCasino</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="text-danger">1. Completed game is valid , in case due to rain over are reduced or match abandoned particular game will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">2. Helmet penalty run will be counted, rest other penalty run will not be counted in game of our exchange.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">3. In any circumstances management decision will be final.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">4. The last digit of run in all game will be valid in our exchange.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">5. Single last digit game :-</span></td>
                </tr>
                <tr>
                    <td><span className="">5.1 For example:- 6 over run Ind : 47 run , so the result will be given as 7 for single last digit game in our exchange.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">6. Double last digit game :-</span></td>
                </tr>
                <tr>
                    <td><span className="">6.1 For example:- 6 over run &amp; 10 over run Ind : 45 run  &amp; 83 run respectively  , so the result will be given as 53 for double last digit game in our exchange.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">7. Triple last digit game :-</span></td>
                </tr>
                <tr>
                    <td>
                        <span className="">7.1  For example:- 6 over run, 10 over run &amp; 15 over run Ind : 43 run ,80 run and 125 respectively so the result will be given as 305 for triple last digit game in our exchange.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">7.2  For example:- 6 over run, 10 over run &amp; Lambi run Ind : 43 run ,80 run and 187 respectively so the result will be given as 307 for triple last digit game in our exchange.</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)

const Politics = () => (

    <div className="Politics generalClass" >
        <div className="rules-content-title">Politics</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="text-danger">Indian state legislative assembly elections.</span></td>
                </tr>
                <tr>
                    <td><span className="">1. This event is to decide the winner of various legislative assemblies of india .</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">2. The final result declared by election commission of india for assembly elections of various states of india for a particular year will be valid in our exchange ,The customers are entirely responsible for their bets at all times.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">3.  All bets will be voided if the election doesn’t take place in given time by election commission or as per our exchange management decision.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">4.  Company reserves the right to suspend/void any bets on this event at any time if we find the same not to be legitimate with the certainty of the outcome.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">5.  Accidental issues during assembly elections will not be counted in our exchange ,If required Additional candidates may be added on request.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">6.  Kindly be informed no candidates will be partially settled and will remain in the market until it is fully settled. This is to ensure that all customers can continue trading for the candidates that they have positions on, since each candidate is still a valid runner in this market.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">7.  Please be informed that the transmissions described as “live” by few broadcasters may actually be delayed due to multiple scenarios.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">8.  If any candidate withdraws for any reason, including death, all bets on the market will be valid and be settled as per the defined rules.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">West Bengal election results will be settled on result of all 294 seats</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">In case of results getting crossed to the actual rates (either much lower than the given rate or crossing the given rate) of any fancy, then that particular fancy market of West Bengal election results will be settled on May 02, 2021</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="text-danger">In case results fall closer to the given rate of any particular fancy market and requires complete 294 seat results, then the same shall be settled post result of all 294 seats</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
)

const FancyMarket1 = () => (

    <div className="FancyMarket1 generalClass" >
        <div className="rules-content-title">Fancy Market 1</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="text-danger">1. Even odd game betting rate rules.</span></td>
                </tr>
                <tr>
                    <td><span className="">1.1 Completed game is valid , in case due to rain over are reduced or match abandoned particular game will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1.2 All bets regarding to ODD/EVEN player/partnership are valid if one legal delivery is being played, else the bets will be deleted. Player odd/even all advance bets will be valid if one legal delivery is being played in match otherwise voided.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">1.3 All bets regarding Odd/Even sessions will be deleted if the particular session is incomplete, for example match got abandoned or finished before the end of particular session.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1.4  In any circumstances management decision will be final.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">2 Top batsman rules:-</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">2.1 If any player does not come as per playing eleven then all bets will be get deleted for the particular player.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">2.2 two players done the same run in a single match (M Agarwal   30 runs and A Rayudu 30 runs, whole inning top batsmen score also 30 run) then both player settlement to be get done 50 percent (50% , 50%)rate on their original value which given by our exchange.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Suppose we have opened value of M Agarwal 3.75 back and customer place bets on 10000 @ 3.75 rates and A Rayudu 3.0 back and customer place bets on 10000 @ 3.0 rates.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Whole inning result announces 30 run by both player then</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Rule of top batsman:-if you bet on M Agarwal you will be get half amount of this rate (10000*3.75/2=18750 you will get)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Rule of top batsman:-if you bet on A Rayudu you will be get half amount of this rate (10000*3.00/2=15000 you will get)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Top batsman only 1st inning valid.</span></td>
                </tr>
                <tr>
                    <td><span className="">For one day 50 over and for t-20 match 20 over must be played for top batsmen otherwise all bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Man of the Match Rules</span></td>
                </tr>
                <tr>
                    <td><span
                        className="">1. All bets will be deleted in case the match is abandoned or over reduced.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">2. All bets will be deleted if the mentioned player is not included in playing 11.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">3. In case Man of the Match is shared between two players then Dead heat rule will be applicable, For example  K Perera and T Iqbal shares the Man of the Match, then the settlement will be done 50% of the rates accordingly.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">4. Rules similar to our Top Batsman rules.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Maximum  Sixes by Team</span></td>
                </tr>
                <tr>
                    <td><span className="">1. All bets will be deleted if match abandoned or over reduced</span></td>
                </tr>
                <tr>
                    <td><span
                        className="">2. All bets will be deleted if both the teams hits same number of sixes.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">3. Super over will not be considered.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Maximum 6 or 10 over runs</span></td>
                </tr>
                <tr>
                    <td><span className="">1. All bets will be deleted if match abandoned or over reduced.</span></td>
                </tr>
                <tr>
                    <td><span className="">2. All the bets will be deleted if both the teams score is same (Runs scored in 6 or 10 overs)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">3. 6 overs for T20 and 10 overs for ODI</span></td>
                </tr>
                <tr>
                    <td><span className="">4. Both the innings are valid.</span></td>
                </tr>
                <tr>
                    <td><span className="">5. This fancy will be valid for 1st 6 overs of both innings for T20 and 1st 10 overs of both innings for ODI</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Batsman Match</span></td>
                </tr>
                <tr>
                    <td><span
                        className="">Batsman Match:- Bets for Favourite batsman from the two batsman matched.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted if any one of the mentioned player is not included in playing 11.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted unless one ball being played by both the mentioned players.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted if over reduced or Match abandoned.</span></td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted if both the player scored same run. For example H Amla and J Bairstow are the batsman matched, H Amla and J Bairstow both scored 38 runs then all bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Both innings will be valid</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Opening Pair</span></td>
                </tr>
                <tr>
                    <td><span
                        className="">1.  Bets for Favourite opening pair from the two mentioned opening pair.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">2.  Runs made by both the opening player will be added. For example:- J Roy scored 20 runs and J Bairstow scored 30 runs result will be 50 runs.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">3.  Highest run made by the pair will be declared as winner. For example: Opening pair ENG total is 70 runs and Opening pair SA is 90 runs, then SA 90 runs will be declared as winner.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Both innings will be valid</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Our exchange Special</span></td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted if the mentioned player is not included in playing 11.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted if match abandoned or over reduced.</span></td>
                </tr>
                <tr>
                    <td><span className="">Both innings will be valid</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Direction of First Boundary</span></td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted if the mentioned batsman is not included in playing 11.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted if match abandoned or over reduced.</span></td>
                </tr>
                <tr>
                    <td><span className="">The boundary hit through off side of the stump will be considered as off side four.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">The boundary hit through leg side of the stump will be considered as leg side four.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Boundaries through extras (byes,leg byes,wide,overthrow) will not be considered as valid.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Only 1st Inning will be considered</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Fifty &amp; Century by Batsman</span></td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted if match abandoned or over reduced.</span></td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted if the mentioned batsman is not included in playing 11.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">All bets will be deleted unless the batsman faces one legal ball.</span></td>
                </tr>
                <tr>
                    <td><span className="">Both Innings will be valid.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">1st over Fancy</span></td>
                </tr>
                <tr>
                    <td><span className="">Boundaries through extras (byes,leg byes,wide,overthrow) will not be considered.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Only 1st inning will be valid</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Odd Even Fancy</span></td>
                </tr>
                <tr>
                    <td><span className="">Incompleted games will be deleted. Over reduced or abandoned all bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">For example:-275 run SL bhav must be played 50 over if rain comes or any condition otherwise 275 run SL bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Next Man out</span></td>
                </tr>
                <tr>
                    <td><span className="">Next man out fancy advance &amp; in regular.
                                    Both inning will be valid. If any player does not come in opening then all bets will be deleted. If over reduced or abandoned then all bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Caught out</span></td>
                </tr>
                <tr>
                    <td><span className="">Caught out fancy in advance &amp; in regular.
                                    Both inning will be valid. If over reduced or match abandoned then all bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Wkt &amp; All out Fancy</span></td>
                </tr>
                <tr>
                    <td><span className="">5 wkt in 10 over &amp; All out in 20 over fancy is valid for both inning. If match abandoned or over reduced all bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Test Match: Game Completed Fancy</span></td>
                </tr>
                <tr>
                    <td><span
                        className="">1.  This is the fancy for match to be won/ completed in which day &amp; session (Completed: Game has to be completed)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">2.  If match drawn then all the sessions will be considered as lost.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Meter Fancy</span></td>
                </tr>
                <tr>
                    <td><span
                        className="">In case match abandoned or over reduced mid point rule will be applicable</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">For example: If Dhoni meter is 75 / 77 and the match abandoned or over reduced, then the result will be 76</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">In case of single difference result will be given for the higher rate of the final rate (eg 53/54) and match gets abandoned then the result will be given as 54</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Midpoint rule is applicable for test match also. However for lambi meter/ inning meter 70 overs has to be played only then the same will be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Maximum Boundaries:-</span></td>
                </tr>
                <tr>
                    <td><span className="">If the number of fours or sixes of both the team is equal, then all bets of the respective event will get voided</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Khado:- Test</span></td>
                </tr>
                <tr>
                    <td><span className="">Minimum 70 over has to be played by the particular team only then the Khado of the team will be considered as valid, else the same will be voided</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)

const IPL = () => (

    <div className="IPL generalClass" >
        <div className="rules-content-title">IPL</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td>
                        <span className="text-danger">If IPL fixture of 60 matches gets reduced due to any reason, then all the special fancies will be voided (Match abandoned due to rain/bad light will not be considered in this)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Management decision will be final</span></td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over runs: Average 6 runs will be given in case  match abandoned or over reduced (only 1st innings valid)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 1st 6 over run:- Average 47 runs will be given in case  match abandoned or over reduced (Only 1st Innings valid)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total fours: Average 27 fours will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total sixes: Average 12 sixes will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average will 12 Wickets be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wides - Average 8 wides will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 14 extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fifties - Average 2 fifties will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Caught outs: Average 9 caught out will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Bowled:- Average 2 Bowled out will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total LBW:- Average 1 LBW will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run out:- Average 1 Run out will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Highest innings run - Only first innings is valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Lowest innings run - Only first innings is valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest over run: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest 1st over run in individual match: only first innings is valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Highest Fours in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest Sixes in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest Extras in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest Wicket in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest 6 over run: - Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Super over will not be included</span></td>
                </tr>
                <tr>
                    <td><span className="">In fastest fifty always the first 50 runs will be considered, for example of R Sharma scores 1st fifty in 17 balls and scores 100 in next 14 balls, fastest 50 will be given based on the balls for the 1st fifty runs</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)

const Kabaddi = () => (

    <div className="Kabaddi generalClass" >
        <div className="rules-content-title">Kabaddi</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="text-danger">1. For Playoffs , Final result of 40 minutes of two halves will be valid in our exchange.</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)
const WorldCup = () => (

    <div className="WorldCup generalClass" >
        <div className="rules-content-title">World Cup</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="text-danger">In case of any circumstances, management decision will be final for all the fancies under world cup.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">WC:-WORLD CUP</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">MOM:-MAN OF THE MATCH.</span></td>
                </tr>
                <tr>
                    <td><span className="">Match 1st over run:- This fancy is valid only for first innings of the match, Average 4 runs will be given in case of match abandoned or the entire 50 over is not played.</span>
                    </td>
                </tr>
                <tr>
                    <td><span
                        className="">Highest inning run:- This fancy is valid only for first innings of the match.</span>
                    </td>
                </tr>
                <tr>
                    <td><span
                        className="">Lowest innings run:- This fancy is valid only for first innings of the match.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fours:- Average 48 Fours will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes:- Average 10 Sixes will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets:- Average 15 Wickets will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wide:- Average 14 Wide will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras:- Average 25 Extras will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total No ball:- Average 2 No ball will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fifties:- Average 3 Fifties will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Centuries:- Average 1 century will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Run outs:- Average 1 Run out will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">Total Ducks:- Average 1 Duck out will be given if the match is abandoned or over reduced. If the player is not out in the score of zero the same will not be considered as Duck out.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Caught Out:- Average 10 Caught Out will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">All fancy related to Individual teams are valid only for league matches (9 matches played by the teams in league stages)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">In case any player mentioned in our world cup fancy doesn’t play for the first three consecutive matches all the bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1. In case any player mentioned in our world cup fancy got ruled out or doesn’t play post few matches the bets after the last match played by the above mentioned player will be deleted.
                                    For example: U Khawaja played for first three league matches and doesn’t play after that, then bets for the first three matches will be valid. Bets after third match will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">2. First 10 over runs is valid for both innings for all the teams.</span></td>
                </tr>
                <tr>
                    <td><span className="">3. Total runs by team:- Average will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">4. First 10 over runs by team:- Average will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">5. Fours by team:- Average will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">6. Sixes by team:- Average will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">7. Opening wicket partnership:- Average will be given if the match is abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">8. Runs by player:- Average will be given if the match is abandoned or over reduced, Average will be given unless one ball is being played after the player enters the crease</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">9. Wickets by player:- Average will be given if the match is abandoned or over reduced, Average will be given unless one legal delivery has been bowled by the mentioned player.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">10.  Sixes by player:- Average will be given if the match is abandoned or over reduced, Average will be given unless one ball is being played after the player enters the crease.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Average of every fancy follows:</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by ENG 295 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of ENG 56 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Fours by ENG  25 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by ENG 7 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of ENG 44 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">J Roy runs 38 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">J Bairstow runs 43 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">J Root runs  43 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">J Archer wickets  2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">C Woakes wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">A Rashid wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">J Bairstow Sixes 2 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">J Buttler Sixes 2 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by IND 285 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of IND 53 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Four by IND 26 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by IND 6 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of IND 41 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">S Dhawan runs 38 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">R Sharma runs 43 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">V Kohli runs 48 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">J Bumrah wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Shami wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">K Yadav wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">R Sharma Sixes 2 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">H Pandya Sixes 1 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by AUS 280 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of AUS 52 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Four by AUS 26 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by AUS 6 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of AUS 40 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">D Warner runs 43 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">A Finch runs 38 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">S Smith runs 42 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Starc wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">P Cummins wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">A Zampa wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">D Warner Sixes 2 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by SA 270 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of SA 51 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Fours by SA 24 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by SA 5 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of SA   37 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">H Amla runs 38 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">F Du plessis runs 39 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">V Der Dussen runs   Runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Q De Kock runs 36 Runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">I Tahir wickets     2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">K Rabada wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">D Steyn wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Q De Kock Sixes 1 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by NZ 275 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of NZ 50 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Fours by NZ 25 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by NZ 5 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of NZ 37 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">C Munro runs    32 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Guptill runs 38 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">K Williamson runs 45 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">H Nicholls runs Runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">T Boult wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">T Southee wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Santner wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Guptill Sixes 2 Sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by WI 270 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of WI 49 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Fours by WI 23 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by WI 7 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of WI 35 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">C Gayle runs 37 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">E Lewis runs 32 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">DM Bravo runs 32 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">S Hope runs 37 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">K Roach wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">S Cottrell wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">J holder wickets 1 wicket per game</span></td>
                </tr>
                <tr>
                    <td><span className="">A Nurse wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by PAK 270 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of PAK 50 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Fours by PAK 24 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by PAK 5 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of PAK 36 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Imam Ul Haq runs 36 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">B Azam runs 44 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">F Zaman runs 34 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">H Ali wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Shadab Khan wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Shaheen Afridi wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">F Zaman Sixes 1 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">C Gayle Sixes 2 Sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">A Russell Sixes 2 Sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by SL 250 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of SL 48 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Fours by SL 22 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by SL 4 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of SL 32 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">D Karunaratne runs 31 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">L Thirimanne runs 29 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">K Mendis runs 33 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">L Malinga wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">S Lakmal wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">J Vandersay wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">T Perera Sixes 1 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by BAN 245 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of BAN 48 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Fours by BAN 22 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by BAN 4 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of BAN 32 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">T Iqbal runs 34 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">S Sarkar runs 29 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Rahim runs 31 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Hasan wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Rahman wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Mortaza wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">T Iqbal Sixes 1 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total runs by AFG 235 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">First 10 over runs of AFG 46 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Fours by AFG  20 fours per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Total Sixes by AFG 4 sixes per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening wicket partnership runs of AFG 28 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">R Shah runs 27 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">H Zazai runs 26 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">A Afghan runs Runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">M Shahzad runs 27 runs per game</span></td>
                </tr>
                <tr>
                    <td><span className="">D Zadran wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Rashid khan wickets 2 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">Mujeeb ur rahman wickets 1 wickets per game</span></td>
                </tr>
                <tr>
                    <td><span className="">H Zazai Sixes 1 sixes per game</span></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
)

const Binary = () => (

    <div className="Binary generalClass" >
        <div className="rules-content-title">Binary</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span
                        className="text-danger">1. All session's bets will be confirmed at market rate only.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">2. All session's settlement price means result can be checked from exchange's official sites.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">3. All session's result will be settlement price provided by exchange after market close.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">4. Every product has two types of prices SPOT and FUTURE.  We provide only near month's FUTURE price in
                                    Binary Session.  You can check it from the official website of that product.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">5.  Session's timings :
                                    NFY, B-NFY, AXS, ICI, RIL, SBI, TT STL - Monday to Friday 10:00 a.m. to 2:30 p.m.
                                    GOLD, SILVER, CRUDE - Monday to Friday 11:30 a.m. to 10:30 p.m.
                                    CMX CRUDE, DOWJONES, NASDAQ, SNP - Monday to Friday 7:30 p.m. to 12:00 a.m.</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)


const Fancyrule = () => (

    <div className="Fancyrule generalClass" >
        <div className="rules-content-title">Fancy</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span
                        className="text-danger">1. All fancy bets will be validated when match has been tied.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">2. All advance fancy will be suspended before toss or weather condition.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">3. In case technical error or any circumstances any fancy is suspended and does not resume result will be given all
                                    previous bets will be valid (based on haar/jeet).</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">4. If any case wrong rate has been given in fancy that particular bets will be cancelled.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="text-danger">5. In any circumstances management decision will be final related to all exchange items. Our scorecard will be considered as valid if there is any mismatch in online portal</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">6. In case customer make bets in wrong fancy we are not liable to delete, no changes will be made and bets will be consider as confirm bet.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">7. Due to any technical error market is open and result has came all bets after result will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">8. Manual bets are not accepted in our exchange</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">9.Our exchange will provide 5 second delay in our tv.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">10. Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at same time (Punching) and others. Note : only winning bets will be voided, For example: If we find such entries (above mentioned) from any id and their bets are (200000 lay in a 6 over session for the rate 40 and 200000 back for the rate of 48) and the actual score is 38, bets of 40 lay will be voided and the bets for 48 back will be considered valid.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">11. Company reserves the right to void any bets (only winning bets) of any event at any point of the match if the company believes there is any cheating/wrong doing in that particular event by the players (either batsman/bowler)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">12. Once our exchange give username and password it is your responsibility to change a
                                    password.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">13. Penalty runs will not be counted in any fancy.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">14. Warning:- live scores and other data on this site is sourced from third party feeds and may be subject to time delays and/or be inaccurate. If you rely on this data to place bets, you do so at your own risk. Our exchange does not accept responsibility for loss suffered as a result of reliance on this data.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">15.Traders will be block the user ID if find any misinterpret activities, No queries accept regarding.</span>
                    </td>
                </tr>
                <tr>
                    <td><span
                        className="text-danger">16. Our exchange is not responsible for misuse of client id.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Test</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">1 Session:-</span></td>
                </tr>
                <tr>
                    <td><span className="">1.1 Complete session valid in test.</span></td>
                </tr>
                <tr>
                    <td><span className="">1.2 Session is not completed for ex:- India 60 over run session Ind is running in case India team declares or all-out at 55 over next 5 over session will be continue in England inning.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1.3 1st day 1st session run minimum 25 over  will be played then result is given otherwise 1st day 1st session will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1.4 1st day 2nd session run minimum 25 over  will be played then result is given otherwise 1st day 2nd session will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1.5 1st day total run minimum 80 over  will be played then result is given otherwise 1st day total run will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1.6 Test match both advance session is valid.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">2 Test lambi/ Inning run:-</span></td>
                </tr>
                <tr>
                    <td><span className="">2.1 Mandatory 70 over played in test lambi paari/ Innings run. If any team all-out or declaration lambi paari/ innings run is valid.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">2.2 In case due to weather situation match has been stopped all lambi trades will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">2.3 In test both lambi paari / inning run is valid in advance fancy.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">3 Test batsman:-</span></td>
                </tr>
                <tr>
                    <td><span className="">3.1 In case batsmen is injured he/she is made 34 runs the result will be given 34 runs.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">3.2 Batsman 50/100 run if batsman is injured or declaration the result will be given on particular run.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">3.3 In next men out fancy if player is injured particular fancy will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">3.4 In advance fancy opening batsmen is only valid if same batsmen came in opening the fancy will be valid in case one batsmen is changed that particular player fancy will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">3.5 Test match both advance fancy batsmen run is valid.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">4 Test partnership:-</span></td>
                </tr>
                <tr>
                    <td><span className="">4.1 In partnership one batsman is injured partnership is continued in next batsman.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">4.2 Partnership and player runs due to weather condition or match abandoned the result will be given as per score.</span>
                    </td>
                </tr>
                <tr>
                    <td><span
                        className="">4.3 Advance partnership is valid in case both players are different or same.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">4.4 Test match both advance fancy partnership is valid.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">5 Other fancy advance (test):-</span></td>
                </tr>
                <tr>
                    <td><span className="">5.1 Four, sixes, wide, wicket,  extra run, total run, highest over and top batsmen is valid only if 300 overs has been played or the match has been won by any team otherwise all these fancy will be deleted. Additionally all events are valid only for 1st innings( this is applicable to all individual team events also)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">2 Odi rule:-</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Session:-</span></td>
                </tr>
                <tr>
                    <td><span className="">Match 1st over run advance fancy only 1st innings run will be counted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Complete session is valid in case due to rain or match abandoned particular session will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">For example:- 35 over run team a is playing any case team A  is all-out in 33 over team a has made 150 run the session result is validated on particular run.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Advance session is valid in only 1st innings.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">50 over runs:-</span></td>
                </tr>
                <tr>
                    <td><span className="">In case 50 over is not completed all bet will be deleted due to weather or any condition.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Advance 50 over runs is valid in only 1st innings.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Odi batsman runs:-</span></td>
                </tr>
                <tr>
                    <td><span className="">In case batsman is injured he/she is made 34 runs the result will be given 34 runs.</span>
                    </td>
                </tr>
                <tr>
                    <td><span
                        className="">In next men out fancy if player is injured particular fancy will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">In advance fancy opening batsmen is only valid if same batsmen came in opening the fancy will be valid in case one batsmen is changed that particular player fancy will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Odi partnership runs:-</span></td>
                </tr>
                <tr>
                    <td><span className="">In partnership one batsman is injured partnership is continued in next batsman.</span>
                    </td>
                </tr>
                <tr>
                    <td><span
                        className="">Advance partnership is valid in case both players are different or same.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Both team advance partnerships are valid in particular match.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Other fancy:-</span></td>
                </tr>
                <tr>
                    <td><span className="">Four, sixes, wide, wicket, extra run, total run, highest over ,top batsman,maiden over,caught-out,no-ball,run-out,fifty and century are valid only match has been completed in case due to rain over has been reduced all other fancy will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">T20:-</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Session:-</span></td>
                </tr>
                <tr>
                    <td><span className="">Match 1st over run advance fancy only 1st innings run will be counted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Complete session is valid in case due to rain or match abandoned particular session will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">For example :- 15 over run team a is playing any case team a  is all-out in 13 over team A has made 100 run the session result is validated on particular run.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Advance session is valid in only 1st innings.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">20 over runs:-</span></td>
                </tr>
                <tr>
                    <td><span className="">Advance 20 over run is valid only in 1st innings. 20 over run will not be considered as valid if 20 overs is not completed due to any situation</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">T20 batsman runs:-</span></td>
                </tr>
                <tr>
                    <td><span className="">In case batsman is injured he/she is made 34 runs the result will be given 34 runs.</span>
                    </td>
                </tr>
                <tr>
                    <td><span
                        className="">In next men out fancy if player is injured particular fancy will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">In advance fancy opening batsmen is only valid if same batsmen came in opening the fancy will be valid in case one batsmen is changed that particular player fancy will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">T20 partnership runs:-</span></td>
                </tr>
                <tr>
                    <td><span className="">In partnership one batsman is injured partnership is continued in next batsman.</span>
                    </td>
                </tr>
                <tr>
                    <td><span
                        className="">Advance partnership is valid in case both players are different or same.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Both team advance partnerships are valid in particular match.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">1st 2 &amp; 3 Wickets runs:- T20/ODI</span></td>
                </tr>
                <tr>
                    <td><span className="">Advance event is valid in only 1st Innings.</span></td>
                </tr>
                <tr>
                    <td><span className="">If over reduced due to rain or weather condition or match abandoned the result will be given as per score.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Other fancy:-</span></td>
                </tr>
                <tr>
                    <td><span className="">T-20 ,one day and test match in case current innings player and partnership are running in between match has been called off or abandoned that situation all current player and partnership results are valid.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Four, sixes, wide, wicket, extra run, total run, highest over and top batsman,maiden over,caught-out,no-ball,run-out,fifty and century are valid only match has been completed in case due to rain over has been reduced all other fancy will be deleted.
                                    1st 6 over dot ball and  20 over dot ball fancy only valid is 1st innings.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1st wicket lost to any team balls meaning that any team 1st wicket fall down in how many balls that particular fancy at least minimum one ball have to be played otherwise bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1st wicket lost to any team fancy valid both innings.</span></td>
                </tr>
                <tr>
                    <td><span className="">How many balls for 50 runs any team meaning that any team achieved 50 runs in how many balls that particular fancy at least one ball have to be played otherwise that fancy bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">How many balls for 50 runs fancy any team only first inning valid.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">1st 6 inning boundaries runs any team fancy will be counting only according to run scored fours and sixes at least 6 over must be played otherwise that fancy will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1st inning 6 over boundaries runs any team run like wide ,no-ball ,leg-byes ,byes and over throw runs are not counted this fancy.</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="">How many balls face any batsman meaning that any batsman how many balls he/she played that particular fancy at least one ball have to be played otherwise that fancy bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">How many balls face by any batsman both innings valid.</span></td>
                </tr>
                <tr>
                    <td><span className="">Lowest scoring over will be considered valid only if the over is completed fully (all six deliveries has to be bowled)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Concussion in Test:-</span></td>
                </tr>
                <tr>
                    <td>
                        <span className="">All bets of one over session will be deleted in test scenario, in case session is incomplete. For example innings declared or match suspended to bad light or any other conditions.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">1. All bets will be considered as valid if a player has been replaced under concussion substitute, result will be given for the runs scored by the mentioned player. For example DM Bravo gets retired hurt at 23 runs, then result will be given for 23.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">2. Bets of both the player will be valid under concussion substitute.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Total Match- Events (test):-</span></td>
                </tr>
                <tr>
                    <td><span className="">Minimum of 300 overs to be bowled in the entire test match, otherwise all bets related to the particular event will get void. For example, Total match caught outs will be valid only if 300 overs been bowled in the particular test match</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Limited over events-Test:-</span></td>
                </tr>
                <tr>
                    <td><span className="">This event will be considered valid only if the number of overs defined on the particular event has been bowled, otherwise all bets related to this event will get void. For example 0-25 over events will be valid only if 25 overs has been bowled, else the same will not be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">If the team gets all out prior to any of the defined overs, then balance overs will be counted in next innings. For example if the team gets all out in 23.1 over the same will be considered as 24 overs and the balance overs will be counted from next innings.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Bowler Wicket event's- Test:-</span></td>
                </tr>
                <tr>
                    <td><span className="">Minimum of one legal over (one complete over) has to be bowled by the bowler mentioned in the event, else the same will not be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Bowler over events- Test:-</span></td>
                </tr>
                <tr>
                    <td><span className="">The mentioned bowler has to complete the defined number of overs, else the bets related to that particular event will get void. For example if the mentioned bowler has bowled 8 overs, then 5 over run of that particular bowler will be considered as valid and the 10 over run will get void</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Player ball event's- Test:-</span></td>
                </tr>
                <tr>
                    <td><span className="">This event will be considered valid only if the defined number of runs made by the mentioned player, else the result will be considered as 0 (zero) balls</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">For example if Root makes 20 runs in 60 balls and gets out on 22 runs, result for 20 runs will be 60 balls and the result for balls required for 25 run Root will be considered as 0 (Zero) and the same will be given as result</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Limited over events-ODI:-</span></td>
                </tr>
                <tr>
                    <td><span className="">This event will be considered valid only if the number of overs defined on the particular event has been bowled, otherwise all bets related to this event will get void. 0-50 over events will be valid only if 50 over completed, if the team batting first get all out prior to 50 over the balance over will be counted from second innings. For example if team batting first gets all out in 35 over balance 15 over will be counted from second innings, the same applies for all events if team gets all out before the defined number of overs</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">The events which remains incomplete will be voided if over gets reduced in the match due to any situation, for example if match interrupted in 15 overs due to rain/badlight and post this over gets reduced. Events for 0-10 will be valid, all other events related to this type will get deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">This events will be valid only if the defined number of over is completed. For example team batting first gets all out in 29.4 over then the same will be considered as 30 over, the team batting second must complete 20 overs only then 0-50 over events will be considered as valid. In case team batting second gets all out in 19.4 over then 0-50 over event will not be considered as valid, This same is valid for 1st Innings only.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Bowler event- ODI:-</span></td>
                </tr>
                <tr>
                    <td><span className="">The mentioned bowler has to complete the defined number of overs, else the bets related to that particular event will get void. For example if the mentioned bowler has bowled 8 overs, then 5 over run of that particular bowler will be considered as valid and the 10 over run will get void</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Other event:- T20</span></td>
                </tr>
                <tr>
                    <td><span className="">The events for 1-10 over and 11-20 over will be considered valid only if the number of over mentioned has been played completely. However if the over got reduced before the particular event then the same will be voided,
                                    if the team batting first get all out prior to 20 over the balance over will be counted from second innings. For example if team batting first gets all out in 17 over balance 3 over will be counted from second innings.
                                    This same is valid for 1st Innings only.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">If over got reduced in between any running event, then the same will be considered valid and the rest will be voided. For example.., match started and due to rain/bad light or any other situation match got interrupted at 4 over and later over got reduced. Then events for 1-10 is valid rest all will be voided</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Bowler Session: This event is valid only if the bowler has completed his maximum quota of overs, else the same will be voided. However if the match has resulted and the particular bowler has already started bowling his final over then result will be given even if he haven't completed the over. For example B Kumar is bowling his final over and at 3.4 the match has resulted then result will be given for B Kumar over runs</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Incase of DLS, the over got reduced then the bowler who has already bowled his maximum quota of over that result will be considered as valid and the rest will be voided</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">12. Player and partnership are valid only 14 matches.</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Boundary on Match 1st Free hit</span></td>
                </tr>
                <tr>
                    <td><span className="">Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Boundary hit on Free hit only be considered as valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Bets will be deleted if there is no Free hit in the mentioned match</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Boundary by bat will be considered as valid</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Boundaries by Player</span></td>
                </tr>
                <tr>
                    <td><span className="">Both Four and six are valid</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Any query regarding result or rate has to be contacted within 7 days from the event, query after 7 days from the event will not be considered as valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Virtual Cricket</span></td>
                </tr>
                <tr>
                    <td><span className="">Scorecard available on the video will be considered as valid. At any situation, if there is a difference between the scorecard in the website and the scorecard available on video. Score card available on video will be valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">In case of any technical issues the video gets interrupted/stopped and the same cannot be continued, the existing markets will be voided. However the markets which are already finished/settled will remain valid.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">CPL:-</span></td>
                </tr>
                <tr>
                    <td>
                        <span className="">If CPL fixture 0f 33 matches gets reduced due to any reason, then all the special fancies will be voided (Match abandoned due to rain/bad light will not be considered in this)</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Fancy based on all individual teams are valid only for league stage</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total 1st over runs: Average 6 runs will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total fours: Average 22 fours will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total sixes: Average 13 sixes will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wickets - Average will 13 Wickets be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Wides - Average 10 wides will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Extras - Average 18 extras will be given in case match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total No ball - Average 1 no ball will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Fifties - Average 1 fifties will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Total Caught outs: Average 9 caught out will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">At any situation if result is given for any particular event based on the rates given for the same, then the particular result will be considered valid, similarly if the tournament gets canceled due to any reason the previously given result will be considered valid</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Management decision will be final</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest innings run - Only first innings is valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Lowest innings run - Only first innings is valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest over run: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest 1st over run in individual match: Both innings are valid, however for CPL we have created the fancy for 1st innings only</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">Highest Fours in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest Sixes in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest Extras in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Highest Wicket in individual match: Both innings are valid</span></td>
                </tr>
                <tr>
                    <td><span className="">Super over will not be included</span></td>
                </tr>
                <tr>
                    <td><span className="text-danger">Barbados Tridents</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening partnership run: Average 24 runs will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">First 6 over run: Average 45 run will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">St Kitts and Nevis Patriots</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening partnership run: Average 25 runs will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">First 6 over run: Average 45 run will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Trinbago Knight Riders</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening partnership run: Average 22 runs will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">First 6 over run: Average 46 run will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Guyana Amazon Warriors</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening partnership run: Average 23 runs will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">First 6 over run: Average 44 run will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">St Lucia Zouks</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening partnership run: Average 22 runs will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">First 6 over run: Average 43 run will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">Jamaica Tallawahs</span></td>
                </tr>
                <tr>
                    <td><span className="">Opening partnership run: Average 24 runs will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">First 6 over run: Average 46 run will be given in case  match abandoned or over reduced</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

)


const Matchrule = () => (

    <div className="Matchrule generalClass" >
        <div className="rules-content-title">Match</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tr className="norecordsfound">
                    <td className="text-center">No records Found</td>
                </tr>
            </table>
        </div>
    </div>

)


const Khadorule = () => (

    <div className="Khadorule generalClass" >
        <div className="rules-content-title">Khado</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="">Only First inning valid for T20 and one day matches.</span></td>
                </tr>
                <tr>
                    <td><span className="">Same will be work like Lambi. If match abandoned or over reduced, all bets will be deleted.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="">You can choose your own value in this event.</span></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
)

const Electionrule = () => (

    <div className="Electionrule generalClass">
        <div className="rules-content-title">Election</div>
        <div className="rules-content-desc">
            <table className="table table-bordered">
                <tbody>
                <tr>
                    <td><span className="text-danger">1. The final result declared by election commission of India for Loksabha election 2019 will be valid in our exchange.</span>
                    </td>
                </tr>
                <tr>
                    <td><span className="text-danger">2. Accidental issues during Loksabha election 2019 will not be counted in our exchange.</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
)


export default DesktopRulesModal;
