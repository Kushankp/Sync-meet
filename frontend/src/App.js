import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QRCodeGenerator from './components/QRCodeGenerator';
import GoogleCalendar from './components/GoogleCalendar'; // Ensure the import is correct

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRCodeGenerator />} />
        {/* Remove the sessionId from the route since we don't use it anymore */}
        <Route path="/google-calendar" element={<GoogleCalendar />} />
      </Routes>
    </Router>
  );
}

export default App;
