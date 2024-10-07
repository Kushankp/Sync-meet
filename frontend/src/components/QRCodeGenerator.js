import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // For generating the QR Code
import { useNavigate } from 'react-router-dom';

function QRCodeGenerator() {
  const [userId, setUserId] = useState(null); // Optional: You can use a unique identifier for users
  const navigate = useNavigate();

  // Generate QR code without session ID
  const generateQRCode = () => {
    const userId = new Date().getTime(); // Example: Use a timestamp as a unique user ID
    setUserId(userId);    // Save the user ID
  };

  const handleScan = () => {
    // Navigate to the GoogleCalendar component without session ID
    navigate(`/google-calendar`); // Just navigate to GoogleCalendar.js
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <button onClick={generateQRCode}>Generate QR Code</button>

      {userId && (
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
