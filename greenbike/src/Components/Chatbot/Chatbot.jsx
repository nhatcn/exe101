import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import "./Chatbox.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDlMEgk2PvIWm4XofA8EVIJj7snHfpg1lo`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: input }]
            }
          ],
          generationConfig: {
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
          }
        }
      );
  
      const botMessage = { 
        sender: "bot", 
        text: response.data.candidates[0]?.content?.parts[0]?.text || "Không có phản hồi." 
      };
  
      // Add an introduction message if it's the first interaction
      if (messages.length === 0) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Chào bạn! Tôi là chatbot của GreenBike, quản lý bởi Nguyễn Minh Nhật. Tôi có thể giúp gì cho bạn về dịch vụ cho thuê xe đạp và các tour của chúng tôi?" }
        ]);
      }
  
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };
  

  return (
    <div className="chatbox-wrapper">
      <button className="chatbox-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : "💬"}
      </button>
      {isOpen && (
        <div className="chatbox-container">
          <div className="chatbox-header">GreenBike Chatbot</div>
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>{msg.text}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbox-input">
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}><FaPaperPlane /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
