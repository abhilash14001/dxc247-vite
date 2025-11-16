import React, { useState, useEffect } from 'react';
import { adminApiMethods } from '@dxc247/shared/utils/adminApi';
import Notify from '@dxc247/shared/utils/Notify';
import Pagination from '@dxc247/shared/components/common/Pagination';

const MatchLockPopup = ({ 
  isOpen, 
  onClose, 
  sportId, 
  matchId, 
  lockType, 
  onSuccess 
}) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch users when popup opens or parameters change
  useEffect(() => {
    if (isOpen && sportId) {
      fetchUsers();
    }
  }, [isOpen, sportId, currentPage, perPage]);

  // Handle search with debounce
  useEffect(() => {
    if (isOpen && sportId) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1); // Reset to first page when searching
        fetchUsers();
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm]);

  // Handle per page change
  useEffect(() => {
    if (isOpen && sportId) {
      setCurrentPage(1); // Reset to first page when changing per page
    }
  }, [perPage]);

  const fetchUsers = async () => {
    if (!isOpen || !sportId) return;
    
    setLoading(true);
    try {
      const response = await adminApiMethods.getMatchLockUsers({
        sport_id: sportId,
        page: currentPage,
        per_page: perPage,
        search: searchTerm || ''
      });

      if (response && response.success) {
        const users = response.data?.users || [];
        const pagination = response.data?.pagination || {};
        
        setUsers(users);
        setTotalPages(pagination.total_pages || 1);
        setTotalUsers(pagination.total_users || 0);
        
        // Reset select all if no users
        if (users.length === 0) {
          setSelectAll(false);
          setSelectedUsers([]);
        }
      } else {
        console.error('API Error:', response);
        Notify(response?.message || 'Failed to fetch users', null, null, 'danger');
        setUsers([]);
        setTotalPages(1);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Notify('Error fetching users', null, null, 'danger');
      setUsers([]);
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (userId, isSelected) => {
    if (isSelected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
      setSelectAll(false);
    } else {
      const allUserIds = users.map(user => user.id);
      setSelectedUsers(prev => [...new Set([...prev, ...allUserIds])]);
      setSelectAll(true);
    }
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      Notify('Please select at least one user', null, null, 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminApiMethods.matchLockSelectedUsers({
        sport_id: sportId,
        match_id: matchId,
        lock_type: lockType,
        user_ids: selectedUsers
      });

      if (response.success) {
        Notify('Users locked successfully', null, null, 'success');
        onSuccess && onSuccess();
        onClose();
      } else {
        Notify(response.message || 'Failed to lock users', null, null, 'danger');
      }
    } catch (error) {
      console.error('Error locking users:', error);
      Notify('Error locking users', null, null, 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchTerm('');
    setSelectAll(false);
    setCurrentPage(1);
    onClose();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  // Add escape key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show" 
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h5 className="modal-title">Select Users for {lockType} Lock</h5>
            <button 
              type="button" 
              className="close" 
              data-dismiss="modal" 
              onClick={handleClose}
              aria-label="Close"
            >
              <div className="close_new">
                <i className="fas fa-times-circle"></i>
              </div>
            </button>
          </div>
          
       c

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={submitting}
            >
              <i className="fas fa-times me-2"></i>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={selectedUsers.length === 0 || submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock me-2"></i>
                  Lock Selected Users ({selectedUsers.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchLockPopup;

