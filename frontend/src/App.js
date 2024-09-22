import React from 'react';
// import GoogleCalendar from './components/GoogleCalender';
import QRCodeGenerator from './components/QrCodeGenerator';

function App() {
  // Use a sample user ID for the QR code
  const sampleUserId = 'user123';

  return (
    <div className="App">
      <h1>Google Calendar Integration</h1>
      {/* <GoogleCalendar /> */}
      <QRCodeGenerator userId={sampleUserId} /> {/* Include QR code generator */}
    </div>
  );
}

export default App;
