import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function QRCodeGenerator({ userId }) {
  // Construct the URL using the sample user ID
  const url = `http://localhost:3000/google-calendar?userId=${userId}`;

  return (
    <div>
      <h3>Scan this QR code to sync your Google Calendar</h3>
      <QRCodeCanvas value={url} size={256} />
    </div>
  );
}

export default QRCodeGenerator;
