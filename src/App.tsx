import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/index';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import SetPassword from './pages/SetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/set-password" element={<SetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;