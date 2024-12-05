import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [message, setMessage] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", { username, password });
      if (response.data === "MFA required. Please check your email.") {
        setMfaRequired(true);
        setMessage("MFA required. Please check your email.");
      } else {
        setMessage("Login successful!");
      }
    } catch (error) {
      setMessage("Login failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const handleMfaVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/auth/verify-mfa", { username, mfaToken });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("MFA verification failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </div>
              </form>
              {mfaRequired && (
                <div className="mt-4">
                  <h3 className="text-center">MFA Verification</h3>
                  <form onSubmit={handleMfaVerification}>
                    <div className="mb-3">
                      <label htmlFor="mfaToken" className="form-label">MFA Token</label>
                      <input
                        type="text"
                        className="form-control"
                        id="mfaToken"
                        placeholder="Enter MFA token"
                        value={mfaToken}
                        onChange={(e) => setMfaToken(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-success w-100">
                        Verify MFA
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {message && <p className="mt-3 text-center">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
