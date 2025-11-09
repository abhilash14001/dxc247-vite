import React, { useState, useEffect, useRef } from 'react';
import { adminApiMethods } from '@dxc247/shared/utils/adminApi';
import Notify from '@dxc247/shared/utils/Notify';
import MatchLockPopup from '@dxc247/shared/components/admin/MatchLockPopup';
import UserBookModal from '@dxc247/shared/components/admin/UserBookModal';

const AdminSportsControlPanel = ({ sportId, sportName, matchId }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [showViewMoreModal, setShowViewMoreModal] = useState(false);
  const [showMatchLockPopup, setShowMatchLockPopup] = useState(false);
  const [selectedLockType, setSelectedLockType] = useState('');
  const [showUserBookModal, setShowUserBookModal] = useState(false);
  const [selectedBookType, setSelectedBookType] = useState('');
  const dropdownRef = useRef(null);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => {
      // If clicking the same dropdown, toggle it
      if (prev[dropdownName]) {
        return { [dropdownName]: false };
      }
      // If clicking a different dropdown, close all others and open this one
      return { [dropdownName]: true };
    });
  };

  // Match Lock Functions
  const handleMatchLock = async (lockType, lockValue) => {
    try {
      const response = await adminApiMethods.matchLock({
        sport_id: sportId,
        lock_type: lockType,
        lock_value: lockValue
      });

      if (response.success) {
        Notify(response.message || `${lockType} ${lockValue === 1 ? 'locked' : 'unlocked'} successfully`, null, null, 'success');
      } else {
        Notify(response.message || 'Failed to process match lock', null, null, 'danger');
      }
    } catch (error) {
      console.error('Match lock error:', error);
      Notify(error.response?.data?.message || 'Failed to process match lock', null, null, 'danger');
    }
    // Close all dropdowns after action
    setOpenDropdowns({});
  };

  const handleSelectUsers = (lockType) => {
    setSelectedLockType(lockType);
    setShowMatchLockPopup(true);
    // Close all dropdowns after action
    setOpenDropdowns({});
  };

  const handleMatchLockSuccess = () => {
    Notify('Users locked successfully', null, null, 'success');
  };

  const handleUserBook = (bookType) => {
    setSelectedBookType(bookType);
    setShowUserBookModal(true);
  };

  return (
    <div className="col-md-12 d-flex overflow-x" ref={dropdownRef}>
      <div className="dropdown market-btn width-btn" style={{ display: 'block' }}>
        <button 
          className="btn btn-back dropdown-toggle margin-button width-btn-100" 
          type="button" 
          onClick={() => toggleDropdown('oddsLock')}
        >
          Odds Lock
          <span className="caret"></span>
        </button>
        {openDropdowns.oddsLock && (
         <ul className="dropdown-menu" style={{ top: '100%', position: 'absolute', display: 'block' }}>
         <li><button className="btn btn-link p-0 text-decoration-none" onClick={() => handleMatchLock('ODDS', 1)}>Lock</button></li>
         <li><button className="btn btn-link p-0 text-decoration-none" onClick={() => handleMatchLock('ODDS', 0)}>UnLock</button></li>
         
         <li><button className="btn btn-link p-0 text-decoration-none" onClick={() => handleSelectUsers('ODDS')}>Select User</button></li>
       </ul>
        )}
      </div>
      <button className="btn btn-back margin-button width-btn" type="button" onClick={() => handleUserBook('ODDS')}>
        Users Book
      </button>
      <button className="btn btn-back margin-button width-btn" type="button" onClick={() => handleUserBook('BOOKMAKER')}>
        B.M Book
      </button>

      <div className="dropdown market-btn width-btn">
        <button 
          className="btn btn-back dropdown-toggle margin-button width-btn-100" 
          type="button" 
          onClick={() => toggleDropdown('bmLock')}
        >
          B.M Lock<span className="caret"></span>
        </button>
        {openDropdowns.bmLock && (
          <ul className="dropdown-menu" style={{ top: '100%', position: 'absolute', display: 'block' }}>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('BOOKMAKER', 1); }}>Lock</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('BOOKMAKER', 0); }}>UnLock</a></li>
            
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleSelectUsers('BOOKMAKER'); }}>Select User</a></li>
          </ul>
        )}
      </div>
      <div className="dropdown market-btn width-btn">
        <button 
          className="btn btn-back dropdown-toggle margin-button width-btn-100" 
          type="button" 
          onClick={() => toggleDropdown('fancyLock')}
        >
          Fancy Lock
          <span className="caret"></span>
        </button>
        {openDropdowns.fancyLock && (
           <ul className="dropdown-menu" style={{ top: '100%', position: 'absolute', display: 'block' }}>
           <li><button className="btn btn-link p-0 text-decoration-none" onClick={() => handleMatchLock('FANCY', 1)}>Lock</button></li>
           <li><button className="btn btn-link p-0 text-decoration-none" onClick={() => handleMatchLock('FANCY', 0)}>UnLock</button></li>
           
           <li><button className="btn btn-link p-0 text-decoration-none" onClick={() => handleSelectUsers('FANCY')}>Select User</button></li>
         </ul>
        )}
      </div>

      <div className="dropdown market-btn width-btn" style={{ display: 'block' }}>
        <button 
          className="btn btn-back dropdown-toggle margin-button width-btn-100" 
          type="button" 
          onClick={() => toggleDropdown('matchSuspend')}
        >
          Match Suspend
          <span className="caret"></span>
        </button>
        {openDropdowns.matchSuspend && (
          <ul className="dropdown-menu" style={{ top: '100%', position: 'absolute', display: 'block' }}>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('SUSPEND', 1); }}>Suspend</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('SUSPEND', 0); }}>UnSuspend</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('SUSPENDODDS', 1); }}>Odds Suspend</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('SUSPENDODDS', 0); }}>Odds UnSuspend</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('SUSPENDBOOKMAKER', 1); }}>Bookmaker Suspend</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('SUSPENDBOOKMAKER', 0); }}>Bookmaker UnSuspend</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('SUSPENDFANCY', 1); }}>Fancy Suspend</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleMatchLock('SUSPENDFANCY', 0); }}>Fancy UnSuspend</a></li>
            
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleSelectUsers('SUSPEND'); }}>Select User</a></li>
          </ul>
        )}
      </div>
      <button className="btn btn-back margin-button width-btn" onClick={() => setShowViewMoreModal(true)} type="button">
        View More
      </button>

      {/* Match Lock Popup */}
      <MatchLockPopup
        isOpen={showMatchLockPopup}
        onClose={() => setShowMatchLockPopup(false)}
        sportId={sportId}
        matchId={matchId}
        lockType={selectedLockType}
        onSuccess={handleMatchLockSuccess}
      />

      {/* User Book Modal */}
      <UserBookModal
        isOpen={showUserBookModal}
        onClose={() => setShowUserBookModal(false)}
        sportId={sportId}
        matchId={matchId}
        bookType={selectedBookType}
      />
    </div>
  );
};

export default AdminSportsControlPanel;
