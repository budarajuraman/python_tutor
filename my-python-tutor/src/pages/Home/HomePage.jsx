import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { images } from "../../assets/assets";


const HomePage = () => {
  const navigate = useNavigate();
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showDescription, setShowDescription] = useState(false);

  const saveConfiguration = async () => {
    try {
      const config = {apiKey};
      const response = await fetch("http://localhost:5000/update-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
  
      if (response.ok) {
        alert("Configuration saved!");
      } else {
        alert("Failed to save configuration.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving configuration.");
    }
  };
  

  const handleBuddyBotClick = () => {
    navigate("/buddybot");
  };
  
  const handleProfessorClick = () => {
    navigate("/tutorials");
  };

  return (
    <div className="homepage">
      <header className="header">
        <h1 className="logo"> PyCrew</h1>
        <button className="settings-icon" onClick={() => setShowConfig(!showConfig)}>⚙️</button>
      </header>

      <div className="welcome-section">
        <h2>🤖 Join <span className="pycrew">PyCrew</span> and Start Your Python Journey!</h2>
        <p>
          Your child's journey into Python programming starts here. Our AI-powered tutor makes learning to code fun and engaging
          through interactive lessons.
        </p>
        <a className="choose-companion">✨ Choose your coding companion below</a>
      </div>

      {/* Website Description (Initially Hidden) */}
      {showDescription && (
        <div className="app-description">
          {/* Purpose */}
          <div className="app-purpose">
            <h2>Purpose</h2>
            <p>
              Our AI-powered Python tutor is designed to make coding accessible and exciting for kids. 
              Through interactive storytelling assesment, AI-driven assistance. children can grasp Python fundamentals in a fun and intuitive way.
            </p>
          </div>

          {/* Unique Features */}
          <div className="app-features">
            <h2>Unique Features</h2>
            <ul>
              <li><strong>BuddyBot (AI Doubt Solver) :</strong> Provides instant answers and explanations to coding queries.</li>
              <li><strong>Professor Py (Guided Learning):</strong> Structured Python learning modules with progressive difficulty.</li>
              <li><strong>Customizable coding comapanion:</strong> Kids can personalize their AI mentor based on their interests.</li>
              <li><strong>Story-based assessment :</strong>  Kids can apply their learning in an exciting narrative-driven challenge. This immersive approach keeps them motivated while reinforcing key coding concepts in a fun and engaging way</li>. 
              <li><strong>Configure own API key:</strong> users can configure their own API key in the settings to prevent disruptions due to quota limits.</li>
            </ul>
          </div>

          {/* Design Approach */}
          <div className="app-design">
            <h2>Design Approach</h2>
            <p>
              Our platform is designed with a kid-friendly interface, ensuring intuitive navigation, 
              engaging visuals, and interactive elements. After completing Python concept modules, 
              kids can participate in a <strong>story-based assessment</strong>, where they apply their 
              learning in an exciting narrative-driven challenge. This immersive approach keeps them 
              motivated while reinforcing key coding concepts in a fun and engaging way.  
              I utilize the <strong>Groq API</strong> for AI-driven interactions. Additionally, 
              users can configure their own API key in the settings to prevent disruptions due to quota limits.
            </p>
          </div>
        </div>
      )}

      <div className="tutor-selection">
        <div className="tutor-card" onClick={handleProfessorClick}>
          <img src={images.PyImage} alt="Python_tutor" />
          <h3>Professor Py</h3>
          <p>A friendly robot professor who loves teaching Python!</p>
        </div>
        <div className="tutor-card" onClick={handleBuddyBotClick}>
          <img src={images.PyBot} alt="Python_Bot" />
          <h3>BuddyBot</h3>
          <p>A magical bot who turns complex code into simple spells!</p>
        </div>
      </div>

      {/* Learn More Button */}
      <div className="learn-more-section">
        <button className="learn-more-btn" onClick={() => setShowDescription(!showDescription)}>
          {showDescription ? "Hide Details" : "Learn More"}
        </button>
      </div>

      {/* API Configuration Popup */}
      {showConfig && (
        <div className="config-popup">
          <button className="back-button" onClick={() => setShowConfig(false)}> Back</button>
          <h3>API Configuration</h3>
          <label>Groq API Key</label>
          <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter API Key with quotes" />
          <button onClick={saveConfiguration}>Save Configuration</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
