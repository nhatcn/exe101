import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
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

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className="home-container"
    >
      {/* Tours Section */}
      <motion.div 
        className="tours-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2>Popular Tours</h2>
        <div className="tour-cards">
          {tours.map((tour) => (
            <motion.div 
              key={tour.tourId} 
              className="tour-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img src={tour.image} alt={tour.name} />
              <h3>{tour.name}</h3>
              <p>{tour.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bicycles Section */}
      <motion.div 
        className="bicycles-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2>Bicycle Rental</h2>
        <div className="bicycle-cards">
          {bicycles.map((bicycle) => (
            <motion.div 
              key={bicycle.bicycleId} 
              className="bicycle-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img src={bicycle.imageUrl} alt={bicycle.name} />
              <h3>{bicycle.name}</h3>
              <p>{bicycle.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
