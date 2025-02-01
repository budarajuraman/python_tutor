import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/Home/HomePage'
import BuddyBotPage from './pages/BuddyBot/BuddyBotPage'
import ProfessorPyPage from './pages/ProfessorPy/ProfessorPyPage'
import StoryLearning from './pages/Game/Game';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buddybot" element={<BuddyBotPage />} />
        <Route path="/tutorials" element={<ProfessorPyPage />} />
        <Route path="/story" element={<StoryLearning />} />
      </Routes>
    </Router>
  )
}

export default App
