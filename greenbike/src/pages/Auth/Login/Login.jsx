import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Xóa lỗi khi nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      
      const response = await axios.post("http://localhost:8080/api/users/login", null, {
        params: formData,
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("Login successful:", response.data);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    }
  };
  


  return (
    <div className="container auth-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card auth-card p-4">
            <h4 className="mb-4 text-center">Sign In to Your Account</h4>

            {/* Social Login */}
            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <button className="btn btn-outline-danger w-100">
                  <FaGoogle className="me-2" /> Sign in with Google
                </button>
              </div>
              <div className="col-sm-6">
                <button className="btn btn-outline-primary w-100">
                  <FaFacebook className="me-2" /> Sign in with Facebook
                </button>
              </div>
            </div>

            <div className="text-center my-3">
              <span className="text-muted">or sign in with username</span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="userName"
                  className="form-control"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>

              <div className="d-flex justify-content-between mb-3">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="remember" />
                  <label className="form-check-label" htmlFor="remember">Remember me</label>
                </div>
                <a href="/forgotpass" className="text-success">Forgot password?</a>
              </div>

              <button type="submit" className="btn btn-success w-100">Sign In</button>
            </form>

            <p className="text-center mt-3">
              Don't have an account? <a href="/register" className="text-success">Create account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
