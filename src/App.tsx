import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/index';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import SetPassword from './pages/SetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import GDPRCompliance from './pages/GDPRCompliance';
import TermsOfService from './pages/TermsOfService';
import CPVCodesPage from './pages/CPVCodes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/cpv" element={<CPVCodesPage />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/gdpr-compliance" element={<GDPRCompliance />} />
      </Routes>
    </Router>
  );
}

export default App;