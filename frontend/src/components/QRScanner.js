import React from 'react';

export default function QRScanner({ qr }) {
  return (
    <div>
      <p>📷 Silakan scan QR Code di bawah ini:</p>
      {qr && <img src={qr} alt="QR Code" />}
    </div>
  );
}
