import React, { useState } from "react";
import "./BuddyBotPage.css";
import { useNavigate } from "react-router-dom";

const BuddyBotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate("/");
  };

  const handleNewChatClick = () => {
    setMessages([]); 
    setInput("");
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.response) {
        setMessages([...newMessages, { text: data.response, sender: "bot" }]);
      } else {
        setMessages([...newMessages, { text: "Error: AI response failed", sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { text: "Error connecting to AI", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <button className="new-chat-button" onClick={handleNewChatClick}>+ New Chat</button>
        <div className="bottom-buttons">
          <button className="sidebar-button" onClick={handleBackButtonClick}>Back</button>
        </div>
      </div>

      <div className="chat-area">
        <div className="chat-header">
          <h2>BuddyBot</h2>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h3>Welcome to your Python learning journey!</h3>
              <p>Ask me anything about Python programming. I'm here to help!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}-message`}>
                {msg.text}
              </div>
            ))
          )}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask me anything about Python..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <button className="send-button" onClick={sendMessage} disabled={loading}>
            {loading ? "⏳" : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuddyBotPage;
