import React, { useEffect, useState } from "react";
import "./Booking.css";
import Menu from "../../Components/MenuComponent/Menu";
import * as XLSX from "xlsx";

const Booking = () => {
  const [bookingMode, setBookingMode] = useState("single");
  const [bicycles, setBicycles] = useState([]);
  const [currentBicycleIndex, setCurrentBicycleIndex] = useState(0);
  const [tours, setTours] = useState([]);
  const [excelData, setExcelData] = useState([]);

  // Hàm tính toán ngày tối thiểu và tối đa cho ô input type date
  const getMinDateStr = () => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toISOString().split("T")[0];
  };

  const getMaxDateStr = () => {
    const date = new Date();
    date.setDate(date.getDate() + 10);
    return date.toISOString().split("T")[0];
  };

  const minDateStr = getMinDateStr();
  const maxDateStr = getMaxDateStr();

  useEffect(() => {
    fetch("http://localhost:8080/api/bicycles/list")
      .then((response) => response.json())
      .then((data) => setBicycles(data))
      .catch((error) => console.error("Error fetching bicycles:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/tours")
      .then((response) => response.json())
      .then((data) => setTours(data))
      .catch((error) => console.error("Error fetching tours:", error));
  }, []);

  const handlePrevBicycle = () => {
    setCurrentBicycleIndex((prevIndex) =>
      prevIndex === 0 ? bicycles.length - 1 : prevIndex - 1
    );
  };

  const handleNextBicycle = () => {
    setCurrentBicycleIndex((prevIndex) =>
      prevIndex === bicycles.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSingleBookingSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }
    const formData = new FormData(form);
    if (bicycles.length > 0) {
      formData.append("bicycleId", bicycles[currentBicycleIndex].bicycleId);
    }
    const formObject = {};
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }
    const payload = {
      
      userId: formObject.userId ? Number(formObject.userId) : 1,
      
      bicycleId: formObject.bicycleId ? Number(formObject.bicycleId) : 0,
  
     
      fullName: formObject.fullName || "",
      email: formObject.email || "",
      phone: formObject.phone || "",
      national: formObject.nationality || "",
      note: formObject.requirements || ""
    };

    fetch("http://localhost:8080/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi tạo booking");
        }
        return response.json();
      })
      .then((data) => {
        alert("Booking thành công!");
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Error creating booking:", error);
        alert("Có lỗi khi tạo booking");
      });
  };

  const handleExcelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (data && data.length > 1) {
          const headers = data[0].map((header) => header.toLowerCase().trim());
          const rows = data.slice(1).map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          setExcelData(rows);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleBatchBookingSubmit = (event) => {
    event.preventDefault();
    if (excelData.length === 0) {
      alert("Vui lòng upload file Excel hợp lệ.");
      return;
    }
    if (excelData.length > 10) {
      alert("Số lượng booking trong file không được vượt quá 10 để xếp chung 1 group.");
      return;
    }
    const batchTourDate = document.getElementById("batchTourDate").value;
    if (!batchTourDate) {
      alert("Vui lòng chọn ngày cho batch booking.");
      return;
    }
    const processedData = excelData.map((record) => ({
    
      date: batchTourDate,
      time: record.time || "morning",
      userId: record.userid ? Number(record.userid) : 1,
     
      bicycleId: record.bicycleid ? Number(record.bicycleid) : 0,
     
     
      fullName: record.fullname || "",
      email: record.email || "",
      phone: record.phone || "",
      national: record.national || record.nationality || "",
      note: record.note || record.requirements || ""
    }));

    fetch("http://localhost:8080/api/booking/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processedData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi tạo batch booking");
        }
        return response.json();
      })
      .then((data) => {
        alert("Batch Booking thành công!");
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Error creating batch booking:", error);
        alert("Có lỗi khi tạo batch booking");
      });
  };

  const toggleButtonStyle = (mode) => ({
    border: bookingMode === mode ? "2px solid #198754" : "none",
    backgroundColor: "white",
    color: "#198754",
    padding: "0.5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: mode === "single" ? "1rem" : "0",
  });

  return (
    <div>

      <div className="booking-container">
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button style={toggleButtonStyle("single")} onClick={() => setBookingMode("single")}>
            Book Single
          </button>
          <button style={toggleButtonStyle("batch")} onClick={() => setBookingMode("batch")}>
            Batch Booking (Excel)
          </button>
        </div>
        {bookingMode === "single" && (
          <form id="bookingForm" className="needs-validation" noValidate onSubmit={handleSingleBookingSubmit}>
            <div className="progress-step">
              <h4>
                <span className="step-number">1</span>Available Tours
              </h4>
              <div className="tour-list">
                {tours.length > 0 ? (
                  tours.map((tour) => (
                    <div
                      key={tour.id}
                      className=""
                      style={{ border: "1px solid #ccc", borderRadius: "5px", padding: "1rem", marginBottom: "0.5rem" }}
                    >
                      <label htmlFor={`tour-${tour.id}`}>
                        <strong>{tour.name}</strong>
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No tours available</p>
                )}
              </div>
            </div>
            <div className="progress-step">
              <h4>
                <span className="step-number">2</span>Choose Date and Time
              </h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tour Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="tourDate"
                    name="date"
                    min={minDateStr}
                    max={maxDateStr}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Preferred Time</label>
                  <select className="form-select" name="time" required>
                    <option value="morning">Morning (8:00 AM)</option>
                    <option value="afternoon">Afternoon (2:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="progress-step">
              <h4>
                <span className="step-number">3</span>Select Bicycles
              </h4>
              <div className="bicycles-container position-relative">
                {bicycles.length > 0 ? (
                  <div className="bicycle-display d-flex justify-content-center align-items-center position-relative">
                    <button type="button" className="btn btn-outline-secondary position-absolute start-0" onClick={handlePrevBicycle}>
                      &larr;
                    </button>
                    <div className="bicycle-info text-center">
                      <img
                        src={bicycles[currentBicycleIndex].imageUrl}
                        alt={bicycles[currentBicycleIndex].name}
                        className="bicycle-image"
                      />
                      <h5>{bicycles[currentBicycleIndex].name}</h5>
                      <p>Price: ${bicycles[currentBicycleIndex].price.toFixed(2)}</p>
                      <p>{bicycles[currentBicycleIndex].description}</p>
                    </div>
                    <button type="button" className="btn btn-outline-secondary position-absolute end-0" onClick={handleNextBicycle}>
                      &rarr;
                    </button>
                  </div>
                ) : (
                  <p>Loading bicycles...</p>
                )}
              </div>
            </div>
            <div className="progress-step">
              <h4>
                <span className="step-number">4</span>Personal Information
              </h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" name="fullName" required />
                  <input value="1" className="form-control" name="userId" hidden readOnly />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" name="phone" required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Nationality</label>
                  <input type="text" className="form-control" name="nationality" required />
                </div>
                <div className="col-12">
                  <label className="form-label">Special Requirements</label>
                  <textarea className="form-control" name="requirements" rows="3"></textarea>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-book">
                Complete Booking
              </button>
            </div>
          </form>
        )}
        {bookingMode === "batch" && (
          <form id="batchBookingForm" onSubmit={handleBatchBookingSubmit}>
            <div className="progress-step">
              <h4>
                <span className="step-number">1</span>Upload Excel File
              </h4>
              <div className="mb-3">
                <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleExcelFileChange} required />
              </div>
            </div>
            <div className="progress-step">
              <h4>
                <span className="step-number">2</span>Chọn Ngày Cho Batch Booking
              </h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Tour Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="batchTourDate"
                    name="batchTourDate"
                    min={minDateStr}
                    max={maxDateStr}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="progress-step">
              <h4>
                <span className="step-number">3</span>Excel File Instructions
              </h4>
              <p>
                File Excel không cần cột date nữa (vì ngày sẽ được nhập riêng ở bước 2). 
                Các cột cần có: <strong>tourId, time, fullName, email, phone, nationality, requirements, bicycleId</strong>.<br />
                - <strong>time</strong> chỉ cho phép giá trị: <em>morning</em> hoặc <em>afternoon</em>.<br />
                - Các cột <strong>tourId, fullName, email, phone, nationality</strong> là bắt buộc.<br />
                - File chỉ được chứa tối đa <strong>10 booking</strong> (không tính dòng tiêu đề).
              </p>
            </div>
            {excelData.length > 0 && (
              <div className="progress-step">
                <h4>
                  <span className="step-number">4</span>Preview Data
                </h4>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      {Object.keys(excelData[0]).map((key, index) => (
                        <th key={index}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-book">
                Submit Batch Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Booking;
