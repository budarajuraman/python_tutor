import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfessorPyPage.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ProfessorPyPage = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topics, setTopics] = useState({});
  const [questions, setQuestions] = useState([]);
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [showAnswers, setShowAnswers] = useState({});
  const [showCodingAnswers, setShowCodingAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/topics")
      .then((response) => {
        setTopics(response.data || {});
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching topics");
        setLoading(false);
      });
  }, []);

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    console.log("Selected Topic:", topic);

    axios
      .get(`http://localhost:5000/api/questions?topic=${encodeURIComponent(topic)}`)
      .then((response) => {
        console.log("Questions Response:", response.data);
        setQuestions(response.data || []);
        setShowAnswers({});
      })
      .catch((error) => console.error("Error fetching questions:", error));

    axios
      .get(`http://localhost:5000/api/coding-questions?topic=${encodeURIComponent(topic)}`)
      .then((response) => {
        console.log("Coding Questions Response:", response.data);
        setCodingQuestions(response.data || []);
        setShowCodingAnswers({});
      })
      .catch((error) => console.error("Error fetching coding questions:", error));
  };

  const toggleAnswer = (index) => {
    setShowAnswers((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const toggleCodingAnswer = (index) => {
    setShowCodingAnswers((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    setSelectedTopic(null);
    setQuestions([]);
    setCodingQuestions([]);
  };

  const handleBackButtonClick = () => {
    navigate("/");
  };

  const handleCodeItClick = () => {
    window.open("https://www.programiz.com/python-programming/online-compiler", "_blank");
  };

  const handleStoryAssessmentClick = () => {
    navigate("/story");
  };

  if (loading) return <div>Loading topics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div className="sidebar">
        <button className="new-lesson" disabled>+ New lesson</button>
        <div className="learning-progress">
          <h3>Mastery Levels</h3>
          {["beginner", "medium", "advanced"].map((level) => (
            <button key={level} className="level-button" onClick={() => handleLevelChange(level)}>
              Level {level === "beginner" ? "1" : level === "medium" ? "2" : "3"}: Python {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <button className="story-assessment-button" onClick={handleStoryAssessmentClick}>Story Based Assessment</button>
        <button className="back-button" onClick={handleBackButtonClick}>Back</button>
      </div>

      <div className="main-content">
        <h1>🎉 Welcome to Professor Py’s Magic Code World!</h1>
        <p>Click a topic and start your Python adventure!</p>

        <div className="lessons">
          {topics[selectedLevel] ? (
            Object.keys(topics[selectedLevel]).map((topic) => (
              <button key={topic} className="lesson-btn" onClick={() => handleTopicClick(topic)}>
                {topic}
              </button>
            ))
          ) : (
            <p>No topics available for this level</p>
          )}
        </div>

        {selectedTopic && (
          <div className="topic-details">
            <h2>{selectedTopic}</h2>
            <p>{topics[selectedLevel][selectedTopic]}</p>

            <h3>Questions:</h3>
            <ul>
              {questions.length > 0 ? (
                questions.map((q, index) => (
                  <li key={index} className="question-item">
                    <div className="question-header" onClick={() => toggleAnswer(index)}>
                      {q.question} {showAnswers[index] ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {showAnswers[index] && <p className="answer">Answer: {q.answer || "Answer not available."}</p>}
                  </li>
                ))
              ) : (
                <p>No questions available for this topic</p>
              )}
            </ul>

            <h3>Coding Questions:</h3>
            <ul>
              {codingQuestions.length > 0 ? (
                codingQuestions.map((q, index) => (
                  <li key={index} className="coding-question">
                    <div className="coding-question-header" onClick={() => toggleCodingAnswer(index)}>
                      {q.question} {showCodingAnswers[index] ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    {showCodingAnswers[index] && (
                      <div className="coding-answer">
                        <pre>{q.answer}</pre>
                        <button className="code-it-btn" onClick={handleCodeItClick}>Try It</button>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <p>No coding questions available for this topic</p>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorPyPage;
