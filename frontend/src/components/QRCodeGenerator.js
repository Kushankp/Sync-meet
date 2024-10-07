import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

function QRCodeGenerator() {
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();

  // Generate QR code with a unique session ID
  const generateQRCode = () => {
    const newSessionId = uuidv4(); // Generate a unique session ID
    setSessionId(newSessionId); // Save the session ID
  };

  const handleScan = () => {
    // Navigate to the GoogleCalendar component without URL params
    if (sessionId) {
      navigate('/google-calendar', { state: { sessionId }}); // Pass sessionId in state
    }
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <button onClick={generateQRCode}>Generate QR Code</button>

      {sessionId && (
        <div>
          <h3>Scan the QR Code:</h3>
          <QRCodeCanvas value={`${window.location.origin}/google-calendar`} size={256} />
        </div>
      )}

      <button onClick={handleScan} style={{ marginTop: '20px' }}>
        Use QR Code Scan
      </button>
    </div>
  );
}

export default QRCodeGenerator;
