import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "./adminApi";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";
import LoadingSpinner from "@dxc247/shared/components/ui/LoadingSpinner";
import { toast } from "react-toastify";

// ✅ Custom Toggle Switch Component (fixed JSX & removed broken nested divs)
const ToggleSwitch = ({ id, checked, onChange, label, isParent = false }) => {
  return (
    <div className="form-check custom-toggle-switch">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="toggle-input"
      />
      <label htmlFor={id} className="toggle-label">
        <span className="toggle-slider"></span>
      </label>
      <label
        htmlFor={id}
        className={`form-check-label ${isParent ? "fw-bold" : ""}`}
      >
        {label}
      </label>

      <style jsx>{`
        .custom-toggle-switch {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .toggle-input {
          display: none;
        }
        .toggle-label {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 30px;
          background-color: #ccc;
          border-radius: 30px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .toggle-slider {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .toggle-input:checked + .toggle-label {
          background-color: #0d6efd;
        }
        .toggle-input:checked + .toggle-label .toggle-slider {
          transform: translateX(30px);
        }
        .toggle-input:focus + .toggle-label {
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
};

const AdminCreatePrivilege = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirm_password: "",
    role: 1,
    permissions: [],
  });

  // ✅ Permission categories remain unchanged
  const permissionCategories = [
    {
      title: "Main",
      permissions: [
        { value: "client-list", label: "List Of Clients" },
        { value: "market-analysis", label: "Market Analysis" },
      ],
    },
    {
      title: "Casino Market",
      parent: "casino-market",
      permissions: [
        { value: "casino-market", label: "Casino Market", isParent: true },
        { value: "casino", label: "Casino", parent: "casino-market" },
        { value: "virtual", label: "Virtual", parent: "casino-market" },
      ],
    },
    {
      title: "Reports",
      parent: "reports",
      permissions: [
        { value: "reports", label: "Reports", isParent: true },
        { value: "account-statement", label: "Account Statement", parent: "reports" },
        { value: "client-p-l", label: "Client P L", parent: "reports" },
        { value: "sport-p-l", label: "Sport P L", parent: "reports" },
        { value: "profit-loss", label: "Profit & Loss", parent: "reports" },
        { value: "match-p-l", label: "Match P L", parent: "reports" },
        { value: "current-bet", label: "Current Bet", parent: "reports" },
        { value: "bet-history", label: "Bet History", parent: "reports" },
        { value: "deleted-bet-history", label: "Deleted Bet History", parent: "reports" },
        { value: "casino-result", label: "Casino Result", parent: "reports" },
        { value: "line-market-bet-history", label: "Line Market Bet History", parent: "reports" },
      ],
    },
    {
      title: "Settings",
      parent: "setting",
      permissions: [
        { value: "setting", label: "Setting", isParent: true },
        { value: "sports-market", label: "Sports Market", parent: "setting" },
        { value: "setting-casino-market", label: "Casino Market", parent: "setting" },
        { value: "match-history", label: "Match History", parent: "setting" },
        { value: "manage-fancy", label: "Manage Fancy", parent: "setting" },
        { value: "fancy-history", label: "Fancy History", parent: "setting" },
        { value: "site-configuration", label: "Site Configuration", parent: "setting" },
        { value: "manage-privilege", label: "Multi Login Account", parent: "setting" },
        { value: "manage-prefix", label: "Manage Prefix", parent: "setting" },
        { value: "block-market", label: "Block Market", parent: "setting" },
        { value: "client-tack", label: "Client Track", parent: "setting" },
        { value: "banner-manager", label: "Banner Manager", parent: "setting" },
        { value: "block-ip", label: "Block IP", parent: "setting" },
      ],
    },
  ];

  // ✅ Input & permission handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handlePermissionChange = (permission) => {
    setFormData((prev) => {
      const newPermissions = [...prev.permissions];
      const isSelected = newPermissions.includes(permission);

      if (isSelected) {
        const index = newPermissions.indexOf(permission);
        newPermissions.splice(index, 1);
      } else {
        newPermissions.push(permission);
      }
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSelectAll = () => {
    const allPermissions = permissionCategories.flatMap((c) =>
      c.permissions.map((p) => p.value)
    );
    setFormData((prev) => ({
      ...prev,
      permissions:
        prev.permissions.length === allPermissions.length ? [] : allPermissions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Full Name is required");
    if (!formData.username.trim()) return toast.error("Email is required");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password !== formData.confirm_password)
      return toast.error("Passwords do not match");
    if (formData.permissions.length === 0)
      return toast.error("Please select at least one permission");

    try {
      setLoading(true);
      const apiData = {
        name: formData.name,
        username: formData.username,
        password: formData.password,
        role: formData.role,
        permissions: formData.permissions,
      };
      const response = await adminApi(
        `${ADMIN_BASE_PATH}/privilege/create`,
        "POST",
        apiData
      );
      if (response.success) {
        toast.success("Privilege user created successfully");
        navigate(`${ADMIN_BASE_PATH}/settings/multi-login`);
      } else toast.error(response.message || "Failed to create privilege user");
    } catch (error) {
      toast.error("Failed to create privilege user");
    } finally {
      setLoading(false);
    }
  };

  const allPermissions = permissionCategories.flatMap((c) =>
    c.permissions.map((p) => p.value)
  );
  const isAllSelected = formData.permissions.length === allPermissions.length;

  return (
    <div className="container-fluid">
      <div className="main-container">
        <div className="listing-grid">
          <h2>Privileges Users / Create User</h2>
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="username">Login User ID</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div className="form-group">
                  <label htmlFor="confirm_password">Re-enter Password</label>
                  <input
                    className="form-control"
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="card mt-4">
              <div className="card-body">
                <h4 className="text-center mb-3">Permissions</h4>

                <ToggleSwitch
                  id="checkAll"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  label="Select All Permissions"
                  isParent
                />

                <div className="row mt-4">
                  {permissionCategories.map((category, idx) => (
                    <div key={idx} className="col-md-4 mb-4">
                      <div className="card border-primary h-100">
                        <div className="card-header bg-primary text-white">
                          <h6 className="mb-0">{category.title}</h6>
                        </div>
                        <div className="card-body">
                          {category.permissions.map((p, index) => (
                            <div
                              key={index}
                              className={`mb-3 ${
                                p.parent
                                  ? "ms-4 border-start border-2 border-primary ps-3"
                                  : ""
                              }`}
                            >
                              <ToggleSwitch
                                id={p.value}
                                checked={formData.permissions.includes(p.value)}
                                onChange={() =>
                                  handlePermissionChange(p.value)
                                }
                                label={p.label}
                                isParent={p.isParent}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="row mt-4">
              <div className="col-md-6 text-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminCreatePrivilege;
