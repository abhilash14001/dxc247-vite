import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './AddChipsModal.css';

const AddChipsModal = ({ isOpen, onClose, onSubmit, userId }) => {
  const [formData, setFormData] = useState({
    amount: '',
    creditReference: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
 


    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        userId
      });
      // Reset form after successful submit
      setFormData({
        amount: '',
        creditReference: ''
      });
    } catch (error) {
      console.error('Error submitting add chips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      creditReference: ''
    });
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">Add Chips</h4>
          <button
            type="button"
            className="modal-close"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              className="form-control"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="Enter amount"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Credit Reference</label>
            <input
              type="text"
              className="form-control"
              value={formData.creditReference}
              onChange={(e) => handleInputChange('creditReference', e.target.value)}
              placeholder="Enter credit reference"
              disabled={loading}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AddChipsModal;
