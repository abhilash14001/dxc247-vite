import React, { useState, useEffect, useContext } from 'react';
import { Modal, Nav, Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setAcceptTerms } from '../store/slices/userSlice';
import { AuthContext } from '../contexts/AuthContext';
import axiosFetch from '../utils/Constants';
import Notify from '../utils/Notify';

const RulesAcceptModal = ({ show, onClose, onAccept }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [loading, setLoading] = useState(false);

  // All sports list - only Cricket, Soccer, and Tennis
  const allSports = [
    "Cricket", "Soccer", "Tennis"
  ];

  // Languages list
  const languages = [
    { name: 'English', flag: 'https://g1ver.sprintstaticdata.com/v75/static/front/img/flags/flag_english.png' }
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
    // Scroll content to top when tab changes
    const contentElement = document.querySelector('.rules-content');
    if (contentElement) {
      contentElement.scrollTop = 0;
    }
  };

  const handleAccept = async () => {
    if (!user || !user.id) {
      Notify('User information not available', null, null, 'danger');
      return;
    }

    setLoading(true);
    try {
      // Call the accept-terms API endpoint
      // Backend uses auth()->user() so no need to send user_id
      const response = await axiosFetch('accept-terms', 'POST', null, {});

      // Handle response structure (axiosFetch may return {data: {...}} or direct response)
      const responseData = response?.data || response;
      
      if (responseData && responseData.success) {
        // Update user in Redux state
        dispatch(setAcceptTerms());
        
        // Show success notification
        Notify(
          responseData.message || 'Terms accepted successfully', 
          null, 
          null, 
          'success'
        );
        
        // Call callbacks and close modal
        if (onAccept) {
          onAccept();
        }
        if (onClose) {
          onClose();
        }
      } else {
        // Handle failure response
        const errorMessage = responseData?.message || response?.message || 'Failed to accept terms';
        Notify(errorMessage, null, null, 'danger');
      }
    } catch (error) {
      // Handle API errors
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'An error occurred while accepting terms';
      Notify(errorMessage, null, null, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Logout user and show notification if they try to close/cancel without accepting
    Notify('Please accept all rules to continue', null, null, 'danger');
    // Logout the user after a short delay to show the notification
    setTimeout(() => {
      if (logout) {
        logout();
      }
    }, 1000);
  };

  // Sports data structure - only Cricket, Soccer, and Tennis
  const sportsData = [
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
        },
        {
          title: "match",
          content: [
            { text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same or different IP and others. Note : only winning bets will be voided.", isDanger: true },
            { text: "for live streaming and animation :- Although the current score, time elapsed, video and other data provided on this site is sourced from \"live\" feeds provided by third parties, you should be aware that this data may be subject to a time delay and/or be inaccurate. Please also be aware that other customers may have access to data that is faster and/or more accurate than the data shown on the site. If you rely on this data to place bets, you do so entirely at your own risk. provides this data AS IS with no warranty as to the accuracy, completeness or timeliness of such data and accepts no responsibility for any loss (direct or indirect) suffered by you as a result of your reliance on it.", isDanger: false }
          ]
        }
      ]
    },
    {
      name: "Soccer",
      sections: [
        {
          title: "match",
          content: [
            { text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same or different IP and others. Note : only winning bets will be voided.", isDanger: true },
            { text: "for live streaming and animation :- Although the current score, time elapsed, video and other data provided on this site is sourced from \"live\" feeds provided by third parties, you should be aware that this data may be subject to a time delay and/or be inaccurate. Please also be aware that other customers may have access to data that is faster and/or more accurate than the data shown on the site. If you rely on this data to place bets, you do so entirely at your own risk. provides this data AS IS with no warranty as to the accuracy, completeness or timeliness of such data and accepts no responsibility for any loss (direct or indirect) suffered by you as a result of your reliance on it.", isDanger: false }
          ]
        }
      ]
    },
    {
      name: "Tennis",
      sections: [
        {
          title: "match",
          content: [
            { text: "\"In the event of a technical error or any unforeseen circumstance that leads to the suspension of the Provider's side of any market (Match_Odds,Over/Under, Game Winner, Point Winner, etc.) during a sporting event, and the market does not resume, the outcome will be settled based on the current result (win/loss) at the time of suspension. All bets placed prior to suspension will remain valid and will be settled accordingly. The company assumes no responsibility or liability for such interruptions or outcomes.\"", isDanger: true },
            { text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same or different IP and others. Note : only winning bets will be voided.", isDanger: true },
            { text: "Match Odds :-If 1st set has been not completed at the time of the retirement or disqualification, then all bets relating to that individual match will be void.after completion of 1st set in case of retirement the opponent player will be given the winner for match winner bets.", isDanger: false },
            { text: "Game Winner :- Predict which player will win the stated game. The nominated game will be featured in the name of the bet type, for example: 2ndset – 7 th game – Winner. If a game is not completed for any reason, bets on it will be void. Tie break points will not be counted for this bet type. unless the specific market outcome is already determined.", isDanger: false },
            { text: "Under / Over Games :- Finished set stand, the unfinished set can be played to its natural conclusion and settled as in the example: Example: A set is abandoned at 4-4 I win if I placed a bet on Over 9.5 (since any natural conclusion to the set would have at least 10 games); I lost the bet if I placed a bet on Under 9.5 (since any natural conclusion to the set would have at least 10 games); I get my stake back if I placed a bet on O/U 10.5 (it is undecided, the set could have ended 6-4).", isDanger: false },
            { text: "for live streaming and animation :- Although the current score, time elapsed, video and other data provided on this site is sourced from \"live\" feeds provided by third parties, you should be aware that this data may be subject to a time delay and/or be inaccurate. Please also be aware that other customers may have access to data that is faster and/or more accurate than the data shown on the site. If you rely on this data to place bets, you do so entirely at your own risk. provides this data AS IS with no warranty as to the accuracy, completeness or timeliness of such data and accepts no responsibility for any loss (direct or indirect) suffered by you as a result of your reliance on it.", isDanger: false }
          ]
        }
      ]
    }
  ];

  const getCurrentSportData = () => {
    return sportsData.find(sport => sport.name === allSports[activeTab]) || 
           { sections: [{ title: "match", content: [{ text: "Company reserves the right to suspend/void any id/bets if the same is found to be illegitimate. For example incase of VPN/robot-use/multiple entry from same or different IP and others. Note : only winning bets will be voided.", isDanger: true }] }] };
  };

  // Scroll content to top when activeTab changes
  useEffect(() => {
    // Use setTimeout to ensure DOM is updated
    const timer = setTimeout(() => {
      const contentElement = document.querySelector('.rules-content');
      if (contentElement) {
        contentElement.scrollTop = 0;
        // Also scroll the tab-pane to top if it has scroll
        const tabPane = document.querySelector(`#tules-tabs-tabpane-${activeTab}`);
        if (tabPane) {
          tabPane.scrollTop = 0;
        }
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Render rules content based on active tab
  const renderRulesContent = () => {
    const currentSport = getCurrentSportData();
    
    return (
      <div className="rules-content" style={{ overflowY: 'auto', maxHeight: 'calc(98vh - 120px)' }}>
        <div className="tab-content">
          <div 
            role="tabpanel" 
            id={`tules-tabs-tabpane-${activeTab}`}
            aria-labelledby={`tules-tabs-tab-${activeTab}`}
            className="fade tab-pane active show"
            style={{ display: 'block' }}
          >
            {currentSport.sections.map((section, sectionIndex) => (
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
    );
  };

  // Handle modal close attempts (backdrop click, ESC key, etc.)
  const handleModalClose = () => {
    handleCancel();
  };


  return (
    <Modal 
      show={show} 
      onHide={handleModalClose}
      size="xl"
      backdrop="static"
      dialogClassName="rules-modal"

      keyboard={false}
      centered
    >
      <Modal.Header>
        <div className="modal-title h4">Rules</div>
        <div className="rules-langualge">
          <Dropdown>
            <Dropdown.Toggle 
              variant="secondary" 
              id="lang-dropdown"
              className="btn"
            >
              <img 
                src={languages[0].flag} 
                alt={languages[0].name}
                style={{ width: '20px', height: '15px', marginRight: '5px' }}
              />
              {selectedLanguage}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {languages.map((lang, index) => (
                <Dropdown.Item 
                  key={index}
                  onClick={() => setSelectedLanguage(lang.name)}
                >
                  <img 
                    src={lang.flag} 
                    alt={lang.name}
                    style={{ width: '20px', height: '15px', marginRight: '5px' }}
                  />
                  {lang.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <button 
          type="button" 
          className="btn-close" 
          onClick={handleCancel}
          aria-label="Close"
        ></button>
      </Modal.Header>
      
      <Modal.Body>
        <div className="rules-left-sidebar">
          <Nav variant="pills" className="flex-column">
            {allSports.map((sport, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  onClick={() => handleTabClick(index)}
                  active={activeTab === index}
                  role="tab"
                  id={`tules-tabs-tab-${index}`}
                  aria-controls={`tules-tabs-tabpane-${index}`}
                  aria-selected={activeTab === index}
                >
                  {sport}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        {renderRulesContent()}
      </Modal.Body>
      
      <Modal.Footer>
        <span>I agree all rules</span>
        <div>
          <button 
            className="btn btn-success" 
            onClick={handleAccept}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Accept'}
          </button>
          <button 
            className="btn btn-danger ms-1" 
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RulesAcceptModal;

