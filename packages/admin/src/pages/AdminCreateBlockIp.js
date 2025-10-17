import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "./adminApi";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faArrowLeft,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

const AdminCreateBlockIp = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [formData, setFormData] = useState({
    ip: "",
  });

  // Fetch IP data when editing
  useEffect(() => {
    if (isEdit) {
      loadIpData();
    }
  }, [id]);

  const loadIpData = async () => {
    setInitialLoading(true);
    try {
      const response = await adminApi(`${ADMIN_BASE_PATH}/block-ip/${id}`, 'GET');
      if (response.success) {
        setFormData({
          ip: response.data.ip || "",
        });
      } else {
        toast.error(response.message || 'Failed to load IP data');
        navigate(`${ADMIN_BASE_PATH}/settings/block-ip`);
      }
    } catch (error) {
      console.error('Error loading IP data:', error);
      toast.error('Failed to load IP data. Please try again.');
      navigate(`${ADMIN_BASE_PATH}/settings/block-ip`);
    } finally {
      setInitialLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ip.trim()) {
      toast.error("Please enter an IP address");
      return;
    }

    // Basic IP validation
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(formData.ip)) {
      toast.error("Please enter a valid IP address");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isEdit ? `block-ip/${id}` : 'block-ip/create';
      const method = 'POST';
      const submitData = isEdit ? { ...formData, id, _method: 'PUT' } : formData;
      
      const response = await adminApi(
        `${ADMIN_BASE_PATH}/${endpoint}`,
        method,
        submitData
      );

      if (response.success) {
        toast.success(isEdit ? "IP address updated successfully!" : "IP address blocked successfully!");
        navigate(`${ADMIN_BASE_PATH}/settings/block-ip`);
      } else {
        toast.error(response.message || `Failed to ${isEdit ? 'update' : 'block'} IP address`);
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'blocking'} IP:`, error);
      if (error.response && error.response.status === 422) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          toast.error(errorMessages.join(", "));
        } else {
          toast.error(errorData.message || "Validation failed");
        }
      } else {
        toast.error(`Failed to ${isEdit ? 'update' : 'block'} IP address. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading && isEdit) {
    return (
      <div className="row">
        <div className="col-md-12 main-container">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-12 main-container">
        <div className="listing-grid">
          <div className="detail-row">
            <h2 className="d-inline-block">
              {isEdit ? 'Edit Blocked IP' : 'Block IP Address'}
              <button
                className="btn btn-secondary btn-sm ms-2 pull-right"
                onClick={() => navigate(`${ADMIN_BASE_PATH}/settings/block-ip`)}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                Back to List
              </button>
            </h2>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h5>{isEdit ? 'Edit Blocked IP' : 'Add New Blocked IP'}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="ip">IP Address *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ip"
                      name="ip"
                      value={formData.ip}
                      onChange={handleInputChange}
                      placeholder="Enter IP address (e.g., 192.168.1.1)"
                      required
                    />
                    <small className="form-text text-muted">
                      Enter the IP address you want to block
                    </small>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-12 text-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="me-1" />
                        {isEdit ? 'Updating IP...' : 'Blocking IP...'}
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="me-1" />
                        {isEdit ? 'Update' : 'Submit'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateBlockIp;
