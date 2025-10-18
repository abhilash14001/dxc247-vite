import Header from "@dxc247/shared/components/layouts/Header";
import {useEffect, useState} from "react";

const Rules = () => {
    const [activeTab, setActiveTab] = useState(0);

    const sportsData = [
        {
            name: "Football",
            sections: [
                {
                    title: "bookmaker",
                    content: [
                        { text: "If the match will not take place within 48 hours of the original kick-off time bets will be void.", isDanger: false },
                        { text: "If the selection is in a multiple bet or accumulator any refund must be requested before kick-off of the first leg of the multiple bet.", isDanger: true },
                        { text: "Please note that games which have their kick-off altered well in advance to accommodate live TV, or to ease fixture congestion will not be classed as postponed.", isDanger: false },
                        { text: "If a match is forfeited or a team is given a walkover victory without the match having kicked off, then all bets will be void. Any subsequently awarded scoreline will not count for settlement purposes.", isDanger: true },
                        { text: "Where a confirmed postponed match features as part of a multiple bet, the bet will stand on the remaining selections in the multiple.", isDanger: true }
                    ]
                },
                {
                    title: "fancy",
                    content: [
                        { text: "Tournament Total Goals, Team Total Goals goals. scored in 90 minutes or in extra-time will count.Goals scored in penalty shootouts do not count.", isDanger: true },
                        { text: "Tournament Corners - Only corners taken in 90 minutes count.", isDanger: true },
                        { text: "Tournament Penalties Missed/Converted - Penalties taken in 90 minutes, extra-time and penalty shootouts all count. If a penalty has to be re-taken the previous disallowed penalty(ies) do not count.", isDanger: true }
                    ]
                },
                {
                    title: "match",
                    content: [
                        { text: "Match Odds :- All bets apply to the relevant full 'regular time' period including stoppage time. Any extra-time and/or penalty shoot-out is not included. For the cancellation of a goal, due to VAR, bets matched between the time of the goal being scored and the time at which the video assistant referee finishes the review will be voided. For the cancellation of a red card, due to VAR, bets matched after the time at which the video assistant referee commences the review will be voided.", isDanger: false },
                        { text: "Under_Over Goals :- In the event of a match starting but not being completed, all bets will be void, unless the specific market outcome is already determined,", isDanger: false },
                        { text: "1st Period Winner :- Bets will be void if the match is abandoned before half-time.", isDanger: false },
                        { text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same or different IP and others. Note : only winning bets will be voided.", isDanger: true },
                        { text: "for live streaming and animation :- Although the current score, time elapsed, video and other data provided on this site is sourced from \"live\" feeds provided by third parties, you should be aware that this data may be subject to a time delay and/or be inaccurate. Please also be aware that other customers may have access to data that is faster and/or more accurate than the data shown on the site. If you rely on this data to place bets, you do so entirely at your own risk. provides this data AS IS with no warranty as to the accuracy, completeness or timeliness of such data and accepts no responsibility for any loss (direct or indirect) suffered by you as a result of your reliance on it.", isDanger: false }
                    ]
                }
            ]
        },
        {
            name: "Horse Racing",
            sections: [
                {
                    title: "match",
                    content: [
                        { text: "1.General", isDanger: true },
                        { text: "All individual race markets will be determined according to the official result at the time of the 'weigh-in' announcement (or equivalent). Subsequent disqualifications, appeals or amendments to the result will be disregarded.", isDanger: false },
                        { text: "If a race is abandoned or otherwise declared void, or in the event of a walkover, all bets on that race will be void.", isDanger: false },
                        { text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same or different IP and others. Note : only winning bets will be voided.", isDanger: true },
                        { text: "for live streaming and animation :- Although the current score, time elapsed, video and other data provided on this site is sourced from \"live\" feeds provided by third parties, you should be aware that this data may be subject to a time delay and/or be inaccurate. Please also be aware that other customers may have access to data that is faster and/or more accurate than the data shown on the site. If you rely on this data to place bets, you do so entirely at your own risk. provides this data AS IS with no warranty as to the accuracy, completeness or timeliness of such data and accepts no responsibility for any loss (direct or indirect) suffered by you as a result of your reliance on it.", isDanger: false }
                    ]
                }
            ]
        },
        {
            name: "E Games",
            sections: [
                {
                    title: "match",
                    content: [
                        { text: "In the event of a match starting but not being completed, then all bets will be void.", isDanger: true },
                        { text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same or different IP and others. Note : only winning bets will be voided.", isDanger: true },
                        { text: "for live streaming and animation :- Although the current score, time elapsed, video and other data provided on this site is sourced from \"live\" feeds provided by third parties, you should be aware that this data may be subject to a time delay and/or be inaccurate. Please also be aware that other customers may have access to data that is faster and/or more accurate than the data shown on the site. If you rely on this data to place bets, you do so entirely at your own risk. provides this data AS IS with no warranty as to the accuracy, completeness or timeliness of such data and accepts no responsibility for any loss (direct or indirect) suffered by you as a result of your reliance on it.", isDanger: false }
                    ]
                }
            ]
        },
        {
            name: "Basketball",
            sections: [
                {
                    title: "match",
                    content: [
                        { text: "Match Odds :- Predict which team will be the winner. There must be 5 minutes or less of scheduled game time left for bets to have action.", isDanger: false },
                        { text: "Quarter Winner :- The quarter must be completed for bets to have action, unless settlement of bets is already determined.", isDanger: false },
                        { text: "1st Half Winner / 2nd Half Winner :- The first half must be completed for first half bets to stand. If a game is postponed or cancelled after the start, for game and second half bets there must be 5 minutes or less remaining for bets to have action, unless settlement of bets is already determined. (Including Overtime if played.)", isDanger: false },
                        { text: "Highest Scoring Half :- Predict in which half most points will be scored. OT is not included in 2nd Half.", isDanger: false },
                        { text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same or different IP and others. Note : only winning bets will be voided.", isDanger: true },
                        { text: "for live streaming and animation :- Although the current score, time elapsed, video and other data provided on this site is sourced from \"live\" feeds provided by third parties, you should be aware that this data may be subject to a time delay and/or be inaccurate. Please also be aware that other customers may have access to data that is faster and/or more accurate than the data shown on the site. If you rely on this data to place bets, you do so entirely at your own risk. provides this data AS IS with no warranty as to the accuracy, completeness or timeliness of such data and accepts no responsibility for any loss (direct or indirect) suffered by you as a result of your reliance on it.", isDanger: false }
                    ]
                }
            ]
        },
        {
            name: "Cricket",
            sections: [
                {
                    title: "bookmaker",
                    content: [
                        { text: "1. Due to any reason any team will be getting advantage or disadvantage we are not concerned.", isDanger: true },
                        { text: "2. We will simply compare both teams 25 overs score higher score team will be declared winner in ODI (If both teams same score means, low wickets team will be declared winner. In case, both teams same score & same wickets means highest boundaries team will be declared winner.If all same then will be declared No result)", isDanger: true },
                        { text: "3. We will simply compare both teams 10 overs higher score team will be declared winner in T20 matches (If both teams same score means, low wickets team will be declared winner. In case, both teams same score & same wickets means highest boundaries team will be declared winner.If all same then will be declared No result)", isDanger: true },
                        { text: "4. Any query about the result or rates should be contacted within 7 days of the specific event, the same will not be considered valid post 7 days from the event.", isDanger: true },
                        { text: "5. Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of vpn/robot-use/multiple entry from same IP/ multiple bets at the same time (Punching) and others. Note : only winning bets will be voided.", isDanger: true },
                        { text: "6. In case, company will find Ground bets, Group betting, Punching bets, Multiple entries with same IP or any fraud or unusual activities are detected then Company will be void winning bets and charge penalty of 2X (Two times) from winning amount.", isDanger: true },
                        { text: "7. If two team ends up with equal points, then result will be given based on the official point table", isDanger: true },
                        { text: "8. Super Over Bookmaker: If the scores are level at the end of both innings in the Super Over, the same market will continue into subsequent Super Overs until a winner is declared. (This rule applicable from 19th July 2025)", isDanger: true },
                        { text: "9. In case technical error or any circumstances any bookmaker is suspended and does not resume result will be given all previous bets will be valid (based on haar/jeet).", isDanger: true }
                    ]
                },
                {
                    title: "fancy",
                    content: [
                        { text: "1. All fancy bets will be validated when match has been tied.", isDanger: true },
                        { text: "2. All advance fancy will be suspended before toss or weather condition. All advance fancy will be voided if over reduced before match start.", isDanger: true },
                        { text: "3. In case technical error or any circumstances any fancy is suspended and does not resume result will be given all previous bets will be valid (based on haar/jeet).", isDanger: true },
                        { text: "4. If any case wrong rate has been given in fancy that particular bets will be cancelled.", isDanger: true },
                        { text: "5. In any circumstances management decision will be final related to all exchange items. Our scorecard will be considered as valid if there is any mismatch in online portal.", isDanger: true },
                        { text: "6. In case customer make bets in wrong fancy we are not liable to delete. No changes will be made and bets will be consider as confirm bet.", isDanger: true },
                        { text: "7. Due to any technical error market is open and result has came all bets after result will be deleted.", isDanger: true },
                        { text: "8. Manual bets are not accepted in our exchange.", isDanger: true },
                        { text: "9.Our exchange will provide 5 second delay in our TV.", isDanger: true },
                        { text: "10. Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same IP and others. Note : only winning bets will be voided.", isDanger: true }
                    ]
                }
            ]
        }
    ];

    // All sports list
    const allSports = [
        "Football", "Horse Racing", "E Games", "Basketball", "MotoGP", "Chess", "Volleyball", 
        "Ice Hockey", "Tennis", "Badminton", "Cycling", "Mixed Martial Arts", "Motorbikes", 
        "Athletics", "Basketball 3X3", "Sumo", "Virtual sports", "Handball", "Cricket", 
        "Politics", "Golf", "Motor Sports", "Baseball", "Rugby Union", "Rugby League", 
        "Darts", "American Football", "Snooker", "Boxing", "Soccer", "Esports", 
        "Greyhound Racing", "Kabaddi", "Boat Racing", "Esoccer", "Beach Volleyball", 
        "Table Tennis", "Futsal"
    ];

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    const getCurrentSportData = () => {
        return sportsData.find(sport => sport.name === allSports[activeTab]) || 
               { sections: [{ title: "match", content: [{ text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same or different IP and others. Note : only winning bets will be voided.", isDanger: true }] }] };
    };

    useEffect(() => {
        // No need for manual DOM manipulation with React state management
    }, []);

    return (
        <>
            <Header/>
            <div className="report-container">
                <div className="modal-body">
                    <div className="rules-left-sidebar">
                        <div className="nav nav-pills" role="tablist">
                            {allSports.map((sport, index) => (
                                <div className="nav-item" key={index}>
                                    <a 
                                        role="tab" 
                                        data-rr-ui-event-key={index}
                                        id={`tules-tabs-tab-${index}`}
                                        aria-controls={`tules-tabs-tabpane-${index}`}
                                        aria-selected={activeTab === index}
                                        className={`nav-link ${activeTab === index ? 'active' : ''}`}
                                        tabIndex={activeTab === index ? 0 : -1}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTabClick(index);
                                        }}
                                    >
                                        {sport}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rules-content">
                        <div className="tab-content">
                            <div 
                                role="tabpanel" 
                                id={`tules-tabs-tabpane-${activeTab}`}
                                aria-labelledby={`tules-tabs-tab-${activeTab}`}
                                className="fade tab-pane active show"
                            >
                                {getCurrentSportData().sections.map((section, sectionIndex) => (
                                    <div key={sectionIndex}>
                                        <div className="rules-content-title">{section.title}</div>
                                        <div className="rules-content-desc">
                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <tbody>
                                                        {section.content.map((rule, ruleIndex) => (
                                                            <tr key={ruleIndex}>
                                                                <td>
                                                                    <span className={rule.isDanger ? 'text-danger' : ''}>
                                                                        {rule.text}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
export default Rules;