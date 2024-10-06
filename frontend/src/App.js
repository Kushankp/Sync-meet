import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QRCodeGenerator from './components/QRCodeGenerator';
import GoogleCalendar from './components/GoogleCalender'; // Import the GoogleCalendar component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRCodeGenerator />} />
        {/* This route navigates to GoogleCalendar.js with the session ID */}
        <Route path="/google-calendar/:sessionId" element={<GoogleCalendar />} />
      </Routes>
    </Router>
  );
}

export default App;
