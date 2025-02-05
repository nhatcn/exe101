import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/forgotPassword",
        { email } 
      );
      if (response.status === 200) {
        setSuccessMessage("Check your email for the password reset link.");
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("Error: Unable to send reset link. Please try again.");
      setSuccessMessage("");
    }
  };
  
  

  return (
    <div className="container auth-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card auth-card p-4">
            <h4 className="mb-4 text-center">Forgot Your Password?</h4>
            <p className="text-center text-muted">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                Send Reset Link
              </button>

              {successMessage && (
                <p className="text-success mt-3 text-center">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-danger mt-3 text-center">{errorMessage}</p>
              )}
            </form>

            <p className="text-center mt-3">
              <a href="/login" className="text-success">Back to Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
