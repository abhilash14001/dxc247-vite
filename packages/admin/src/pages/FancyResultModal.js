import React, { useState, useEffect } from 'react';
import { adminApi } from '@dxc247/shared/utils/adminApi';
import { ADMIN_BASE_PATH } from '@dxc247/shared/utils/Constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const FancyResultModal = ({ modal, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    run: ''
  });
  const [loading, setLoading] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (modal.isOpen) {
      setFormData({ run: '' });
    }
  }, [modal.isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.run) {
      toast.error('Please enter a result value (0 or 1)', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      
      const response = await adminApi(`${ADMIN_BASE_PATH}/handle-fancy-result`, 'POST', {
        sport_id: modal.fancy.sport_id,
        team_name: modal.fancy.team_name,
        bet_type: 'FANCY_SESSION',
        action: 'result',
        run: formData.run
      }, true);

      if (response.success) {
        toast.success(response.message || 'Fancy result set successfully!', {
          position: "top-right",
          autoClose: 3000,
        });
        
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || 'Failed to set fancy result. Please try again.', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Error setting fancy result:', error);
      toast.error('Failed to set fancy result. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      show={modal.isOpen} 
      onHide={onClose}
      centered
      size="sm"
      dialogClassName="modal-dialog-centered modal-sm"
    >
      <Modal.Header style={{ backgroundColor: 'var(--theme1-bg)', color: 'white' }}>
        <Modal.Title>
          Fancy Result: <span className="fancyName">{modal.fancy?.team_name}</span>
        </Modal.Title>
        <button
          className="close" 
          data-dismiss="modal" 
          aria-label="Close"
          onClick={onClose}
          style={{ color: 'white' }}
        >
          ×
        </button>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="form-group">
            <label>Result Declare</label>
            <input 
              type="number" 
              className="form-control run" 
              id="run" 
              name="run" 
              value={formData.run}
              onChange={handleInputChange}
              placeholder="Enter 0 for ODD or 1 for EVEN"
              disabled={loading}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            type="submit" 
            disabled={loading}
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> : 'Submit'}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default FancyResultModal;
