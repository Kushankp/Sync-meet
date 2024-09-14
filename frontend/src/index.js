import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GoogleCalendar from './App'; // Import the GoogleCalendar component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleCalendar /> {/* Render your GoogleCalendar component */}
  </React.StrictMode>
);

reportWebVitals();
