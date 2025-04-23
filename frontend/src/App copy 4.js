import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRScanner from './components/QRScanner';
import SendForm from './components/SendForm';
import History from './components/History';

function App() {
  const [qr, setQr] = useState('');
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const res = await axios.get('http://localhost:3001/qr');
        setQr(res.data.qr);
        setReady(res.data.ready);
      } catch (err) {
        console.error('QR Fetch error:', err.message);
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:3001/history');
        setHistory(res.data);
      } catch (err) {
        console.error('History error:', err.message);
      }
    };

    fetchQr();
    fetchHistory();
    const interval = setInterval(() => {
      fetchQr();
      fetchHistory();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📱 WhatsApp Gateway - Multi Device</h1>
      {!ready ? (
        <QRScanner qr={qr} />
      ) : (
        <>
          <SendForm />
          <History history={history} />
        </>
      )}
    </div>
  );
}

export default App;
