import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Map.css"; // Import file CSS tùy chỉnh

// Biểu tượng đánh dấu vị trí
const redIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const blueIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-blue.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState([10.762622, 106.660172]); // HCM City mặc định
  const [searchPosition, setSearchPosition] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Lấy vị trí hiện tại ngay khi vào trang
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setCurrentPosition(newPos);
          sessionStorage.setItem("lastPosition", JSON.stringify(newPos));
        },
        () => {
          console.log("Không thể lấy vị trí");
        }
      );
    }
  }, []);

  // Kiểm tra vị trí đã lưu trong sessionStorage
  useEffect(() => {
    const lastPos = sessionStorage.getItem("lastPosition");
    if (lastPos) setCurrentPosition(JSON.parse(lastPos));

    const lastSearchPos = sessionStorage.getItem("lastSearchPosition");
    if (lastSearchPos) setSearchPosition(JSON.parse(lastSearchPos));
  }, []);

  // Xử lý tìm kiếm địa điểm
  const handleSearch = async () => {
    if (!search) return;
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${search}&key=1ac0ba6c16c54fd5a3b2c33a3d7bfedf&limit=5`
      );
      setSuggestions(response.data.results);
    } catch (error) {
      console.error("Lỗi tìm kiếm địa điểm", error);
    }
  };

  // Chọn địa điểm từ danh sách gợi ý
  const handleSelectLocation = (lat, lng) => {
    setSearchPosition([lat, lng]);
    sessionStorage.setItem("lastSearchPosition", JSON.stringify([lat, lng]));
    setSuggestions([]);
  };

  return (
    <div className="container-fluid vh-120 d-flex">
      <div className="col-7">
        <MapContainer center={currentPosition} zoom={13} className="w-100 h-100">
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Bản đồ tiêu chuẩn">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Vệ tinh (Google)">
              <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Ghim vị trí hiện tại */}
          <Marker position={currentPosition} icon={redIcon}>
            <Popup>Vị trí hiện tại của bạn</Popup>
          </Marker>

          {/* Ghim vị trí tìm kiếm */}
          {searchPosition && (
            <Marker position={searchPosition} icon={blueIcon}>
              <Popup>Vị trí tìm kiếm</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Sidebar tìm kiếm */}
      <div className="col-3 bg-light p-3">
        <input 
          type="text" 
          className="form-control mb-2" 
          placeholder="Nhập địa điểm..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={handleSearch}>Tìm kiếm</button>
        <ul className="list-group mt-2">
          {suggestions.map((place, index) => (
            <li 
              key={index} 
              className="list-group-item list-group-item-action"
              onClick={() => handleSelectLocation(place.geometry.lat, place.geometry.lng)}
              style={{ cursor: "pointer" }}
            >
              {place.formatted}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Map;
