import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // For generating the QR Code
import { v4 as uuidv4 } from 'uuid';   // For generating unique session IDs
import { useNavigate } from 'react-router-dom';

function QRCodeGenerator() {
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();

  // Generate QR code with a unique session ID
  const generateQRCode = () => {
    const newSessionId = uuidv4(); // Generate a unique session ID
    setSessionId(newSessionId);    // Save the session ID
  };

  const handleScan = () => {
    // Navigate to the GoogleCalendar component with the session ID
    if (sessionId) {
      const state = btoa(JSON.stringify({ sessionId })); // Encode session ID into state
      navigate(`/google-calendar/${state}`); // Navigate to GoogleCalendar.js with the state parameter
    }
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <button onClick={generateQRCode}>Generate QR Code</button>

      {sessionId && (
        <div>
          <h3>Scan the QR Code:</h3>
          <QRCodeCanvas value={`${window.location.origin}/google-calendar/${btoa(JSON.stringify({ sessionId }))}`} size={256} />
        </div>
      )}

      <button onClick={handleScan} style={{ marginTop: '20px' }}>
        Use QR Code Scan
      </button>
    </div>
  );
}

export default QRCodeGenerator;
