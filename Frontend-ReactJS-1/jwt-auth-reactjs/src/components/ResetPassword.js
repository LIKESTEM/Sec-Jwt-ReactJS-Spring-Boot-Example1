import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/reset-password", { token, newPassword });
      setMessage(response.data);
    } catch (error) {
      setMessage("Failed to reset password.");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Reset Password</h2>
              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary w-100">
                    Reset Password
                  </button>
                </div>
              </form>
              {message && <p className="mt-3 text-center">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
