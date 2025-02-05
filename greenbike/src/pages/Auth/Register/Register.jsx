import React, { useState } from "react";


const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Chỉ gửi fullName, userName và password
    const { name, userName, password } = formData;
    console.log({ name, userName, password });

    fetch("http://localhost:8080/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, userName, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User registered:", data);
      })
      .catch((error) => console.error("Error registering:", error));
  };

  return (
    <div className="container auth-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card auth-card p-4">
            <h4 className="mb-4 text-center">Create an Account</h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

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
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                Register
              </button>
            </form>

            <p className="text-center mt-3">
              Already have an account? <a href="/login" className="text-success">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
