import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";
import { FaSearch } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import "./Home.css";

const Home = () => {
  const [tours, setTours] = useState([]);
  const [bicycles, setBicycles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      const response = await axios.get("http://localhost:8080/api/tours");
      setTours(response.data);
    };

    const fetchBicycles = async () => {
      const response = await axios.get("http://localhost:8080/api/bicycles");
      setBicycles(response.data);
    };

    fetchTours();
    fetchBicycles();
  }, []);

  // Hiệu ứng xuất hiện từ từ khi load trang
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 300 });

  // Hiệu ứng xuất hiện khi cuộn đến
  const [refTours, inViewTours] = useInView({ triggerOnce: true, threshold: 0.2 });
  const toursAnimation = useSpring({ opacity: inViewTours ? 1 : 0, transform: inViewTours ? "translateY(0px)" : "translateY(50px)" });

  const [refBicycles, inViewBicycles] = useInView({ triggerOnce: true, threshold: 0.2 });
  const bicyclesAnimation = useSpring({ opacity: inViewBicycles ? 1 : 0, transform: inViewBicycles ? "translateY(0px)" : "translateY(50px)" });

  return (
    <animated.div style={fadeIn} className="home-container">
    

      {/* Tours Section */}
      <animated.div ref={refTours} style={toursAnimation} className="tours-section">
        <h2>Popular Tours</h2>
        <div className="tour-cards">
          {tours.map((tour) => (
            <animated.div 
              key={tour.tourId} 
              className="tour-card" 
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
                ":hover": { transform: "scale(1.05)" }
              }}
            >
              <img src={tour.image} alt={tour.name} />
              <h3>{tour.name}</h3>
              <p>{tour.description}</p>
            </animated.div>
          ))}
        </div>
      </animated.div>

      {/* Bicycles Section */}
      <animated.div ref={refBicycles} style={bicyclesAnimation} className="bicycles-section">
        <h2>Bicycle Rental</h2>
        <div className="bicycle-cards">
          {bicycles.map((bicycle) => (
            <animated.div 
              key={bicycle.bicycleId} 
              className="bicycle-card" 
              style={{
                transform: "scale(1)",
                transition: "transform 0.3s ease",
                ":hover": { transform: "scale(1.05)" }
              }}
            >
              <img src={bicycle.imageUrl} alt={bicycle.name} />
              <h3>{bicycle.name}</h3>
              <p>{bicycle.description}</p>
            </animated.div>
          ))}
        </div>
      </animated.div>
    </animated.div>
  );
};

export default Home;
