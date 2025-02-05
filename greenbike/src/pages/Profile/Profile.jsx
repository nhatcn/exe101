import React, { useEffect, useState } from "react";

import { FaPencilAlt } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const userId = 1;
  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phone: false,
    userName: false,
  });

  useEffect(() => {
    // Thay đổi cách lấy userId theo nhu cầu (cookie, localStorage, v.v.)
    fetch(`http://localhost:8080/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  // Cập nhật giá trị từng trường khi nhập
  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Chuyển đổi chế độ chỉnh sửa của từng trường
  const toggleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Gọi API cập nhật profile khi người dùng nhấn nút Save Changes
  const handleSaveChanges = () => {
    fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })
      .then((response) => response.json())
      .then((data) => {
        // Xử lý sau khi cập nhật thành công nếu cần
        console.log("Profile updated:", data);
      })
      .catch((error) => console.error("Error updating profile:", error));
  };

  return (
    <div className="profile-page">

      <div className="container auth-container">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="auth-card">
              <div className="profile-content">
                <img
                  src={profile.avatar || "https://via.placeholder.com/150"}
                  alt="User Avatar"
                  className="profile-avatar rounded-circle mb-3"
                />

                {/* Trường Name */}
                <div className="form-group">
                  <label>Name</label>
                  <div className="input-icon-wrapper">
                    {isEditing.name ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    ) : (
                      <p>{profile.name}</p>
                    )}
                    <FaPencilAlt
                      className="pencil-icon"
                      onClick={() => toggleEdit("name")}
                    />
                  </div>
                </div>

                {/* Trường Email */}
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-icon-wrapper">
                    {isEditing.email ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    ) : (
                      <p>{profile.email}</p>
                    )}
                    <FaPencilAlt
                      className="pencil-icon"
                      onClick={() => toggleEdit("email")}
                    />
                  </div>
                </div>

                {/* Trường Phone */}
                <div className="form-group">
                  <label>Phone</label>
                  <div className="input-icon-wrapper">
                    {isEditing.phone ? (
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    ) : (
                      <p>{profile.phone}</p>
                    )}
                    <FaPencilAlt
                      className="pencil-icon"
                      onClick={() => toggleEdit("phone")}
                    />
                  </div>
                </div>

                {/* Trường Username */}
                <div className="form-group">
                  <label>Username</label>
                  <div className="input-icon-wrapper">
                    {isEditing.userName ? (
                      <input
                        type="text"
                        value={profile.userName}
                        onChange={(e) =>
                          handleInputChange("userName", e.target.value)
                        }
                      />
                    ) : (
                      <p>{profile.userName}</p>
                    )}
                    {/* Input ẩn dành cho password nếu cần gửi đi */}
                    <input
                      type="text"
                      value={profile.password}
                      name="password"
                      hidden
                    />
                    <FaPencilAlt
                      className="pencil-icon"
                      onClick={() => toggleEdit("userName")}
                    />
                  </div>
                </div>

                <button
                  className="btn btn-primary w-100 mt-3"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
