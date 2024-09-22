import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Button from './Button';

function QRCodeGenerator({ userId }) {
  // State to toggle the visibility of the QR code
  const [showQRCode, setShowQRCode] = useState(false);

  // Construct the URL using the sample user ID
  const url = `https://3fe3d1c9.sync-meet.pages.dev/google-calendar?userId=${userId}`;

  // Function to handle button click
  const handleButtonClick = () => {
    setShowQRCode(true); // Show the QR code when the button is clicked
  };

  return (
    <div>
      <h3>Scan this QR code to sync your Google Calendar</h3>
      <button onClick={handleButtonClick}>Generate QR Code</button>
      <Button onClick={handleButtonClick} text="Generate QR Code" />
      
      {/* Conditionally render the QR code */}
      {showQRCode && (
        <div>
          <QRCodeCanvas value={url} size={256} />
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;
